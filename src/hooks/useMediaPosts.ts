import { useEffect, useRef, useState } from 'react';

export interface MediaPost {
  id: string;
  mediaType: 'photo' | 'video';
  blobUrl: string;
  thumbUrl?: string;
  displayUrl?: string;
  lat?: number;
  lon?: number;
  capturedAt: string;
  uploadedAt: string;
}

const POLL_INTERVAL_MS = 30_000;

/**
 * Numeric compare of two posts by `capturedAt`, newest first. Crews upload
 * with a time lag, but followers should see photos in the trip's actual
 * timeline order regardless of when they landed in Blob/Table Storage.
 * Parses to epoch ms rather than comparing the raw strings - `capturedAt`
 * is client-supplied (see `mediaComplete` in the API) so its precision/
 * offset can vary, and lexicographic string comparison can mis-order
 * those. Falls back to `id` as a deterministic tie-breaker when
 * timestamps are equal (or both fail to parse), so results stay stable
 * across re-renders instead of depending on array/marker iteration order.
 */
export function compareCapturedAtDesc(a: MediaPost, b: MediaPost): number {
  const at = Date.parse(a.capturedAt) || 0;
  const bt = Date.parse(b.capturedAt) || 0;
  if (at !== bt) return bt - at;
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

function sortByCapturedAtDesc(posts: MediaPost[]): MediaPost[] {
  return [...posts].sort(compareCapturedAtDesc);
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
        // The API (media.ts) already sorts by capturedAt server-side, but
        // re-sort here too - cheap for "hundreds" of posts, and keeps
        // every consumer of this hook guaranteed trip-timeline order even
        // if that ever changes API-side.
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
