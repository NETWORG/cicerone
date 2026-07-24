import { useEffect, useRef, useState } from 'react';

export interface MediaPost {
  id: string;
  mediaType: 'photo' | 'video';
  blobUrl: string;
  thumbUrl?: string;
  lat?: number;
  lon?: number;
  capturedAt: string;
  uploadedAt: string;
}

const POLL_INTERVAL_MS = 30_000;

/**
 * Sorts posts newest-*captured*-first (not newest-uploaded). Crews upload
 * with a time lag, but followers should see photos in the trip's actual
 * timeline order regardless of when they landed in Blob/Table Storage.
 * `capturedAt` is an ISO date string, so lexicographic comparison sorts
 * correctly without parsing.
 */
function sortByCapturedAtDesc(posts: MediaPost[]): MediaPost[] {
  return [...posts].sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : a.capturedAt > b.capturedAt ? -1 : 0));
}

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
        // The API returns newest-*uploaded*-first (cheap Table Storage
        // pagination via an inverted-timestamp rowKey) - re-sort here by
        // when the photo was actually taken so every consumer of this
        // hook gets trip-timeline order "for free".
        if (isMounted.current) setPosts(sortByCapturedAtDesc(data));
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
