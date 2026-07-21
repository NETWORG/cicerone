import { useEffect, useRef, useState } from 'react';

export interface MediaPost {
  id: string;
  mediaType: 'photo' | 'video';
  blobUrl: string;
  lat?: number;
  lon?: number;
  capturedAt: string;
  uploadedAt: string;
}

const POLL_INTERVAL_MS = 30_000;

/**
 * Polls the `/api/media` Azure Function (backed by Table Storage, blob
 * bytes served directly from Blob Storage via `blobUrl`) for recently
 * uploaded photos/videos. Same polling approach as `useCrewPositions` -
 * Table Storage has no realtime push, and photos change far less often
 * than GPS position, so a longer interval is fine here.
 */
export function useMediaPosts(): MediaPost[] {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function poll() {
      try {
        const res = await fetch('/api/media', { cache: 'no-store' });
        if (!res.ok) return;
        const data: MediaPost[] = await res.json();
        if (isMounted.current) setPosts(data);
      } catch {
        // Network hiccup or offline - keep showing the last known posts
        // and try again on the next tick.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  return posts;
}
