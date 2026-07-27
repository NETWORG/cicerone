import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { MediaPost } from '../hooks/useMediaPosts';

// How many additional posts to fetch per "load more" page once the user
// navigates past everything already loaded (see `enablePagination` below).
// Kept small - this is metadata-only JSON, but no reason to over-fetch.
const PAGE_SIZE = 24;

/**
 * Fullscreen overlay for browsing one or more uploaded photos/videos at
 * full size. This is the *single shared viewer* for every place photos can
 * be opened from - the live photo stream, the map-side photo tile, the
 * per-day "photos" button, and the geotagged map pins/clusters. Callers
 * only differ in what `posts`/`initialIndex` they pass in; left/right
 * navigation (buttons, arrow keys, wrap-around) and the download button
 * are handled once, here.
 */
export default function MediaLightbox({
  posts,
  initialIndex,
  onClose,
  enablePagination = false,
}: {
  posts: MediaPost[];
  initialIndex: number;
  onClose: () => void;
  // When true, navigating past the last post fetches the next page of
  // older posts from the API (see media.ts's `before` cursor) instead of
  // wrapping around - so browsing isn't capped at whatever `posts` this
  // caller happened to have loaded already. Opt-in because callers that
  // pass an intentionally-scoped subset (a map cluster, nearby pins - see
  // MediaMarkers.tsx) should still just wrap within that subset.
  enablePagination?: boolean;
}) {
  const [index, setIndex] = useState(initialIndex);
  // Posts fetched on-demand beyond the caller's initial `posts` list, only
  // ever appended to - see goNext. Combined with `posts` below to form the
  // full navigable list; kept separate (rather than merged into one
  // state) so a poll-driven refresh of the caller's `posts` prop (e.g.
  // PhotoStream re-fetching every 30s) can't wipe out pages we've already
  // loaded while the user is mid-browsing.
  const [extraPosts, setExtraPosts] = useState<MediaPost[]>([]);
  const [hasMore, setHasMore] = useState(enablePagination);
  const [loadingMore, setLoadingMore] = useState(false);

  const allPosts = enablePagination ? [...posts, ...extraPosts] : posts;

  // `index` is only set from `initialIndex` on mount; if a caller swaps
  // `posts` while this stays open (e.g. `PhotoStreamTile` re-fetching) and
  // the previous index is now out of range, clamp instead of indexing past
  // the end - otherwise `post` becomes undefined and the whole overlay
  // silently disappears (see the early return below).
  const safeIndex = allPosts.length === 0 ? 0 : Math.min(index, allPosts.length - 1);
  const post = allPosts[safeIndex];
  const canNavigate = allPosts.length > 1 || (enablePagination && hasMore);

  // The full-resolution original (post.blobUrl) can be several MB - bad on
  // a metered connection just to *look* at a photo. If the post doesn't
  // already carry a generated display-size copy (see mediaDisplay.ts),
  // request one on open (and again on every navigation, per-post); the
  // server generates (and caches) it lazily on first request, so this is a
  // one-time cost per post, not per view. Shown immediately with the
  // full-size blobUrl as a fallback while that request is in flight (or if
  // it fails) so opening/navigating never stalls.
  const [displayUrl, setDisplayUrl] = useState(post?.displayUrl);

  useEffect(() => {
    setDisplayUrl(post?.displayUrl);
    if (!post || post.mediaType !== 'photo' || post.displayUrl) return;

    let cancelled = false;
    fetch(`/api/media/${post.id}/display`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { displayUrl?: string } | null) => {
        if (!cancelled && data?.displayUrl) setDisplayUrl(data.displayUrl);
      })
      .catch(() => {
        // Network hiccup or the endpoint failed - blobUrl fallback below
        // already covers this, nothing else to do.
      });

    return () => {
      cancelled = true;
    };
  }, [post?.id, post?.mediaType, post?.displayUrl]);

  function goPrev() {
    setIndex((i) => (Math.min(i, allPosts.length - 1) - 1 + allPosts.length) % allPosts.length);
  }

  async function goNext() {
    if (index < allPosts.length - 1) {
      setIndex(index + 1);
      return;
    }

    if (enablePagination && hasMore && !loadingMore) {
      setLoadingMore(true);
      try {
        const last = allPosts[allPosts.length - 1];
        const params = new URLSearchParams({ before: last.capturedAt, limit: String(PAGE_SIZE) });
        const res = await fetch(`/api/media?${params}`, { cache: 'no-store' });
        if (res.ok) {
          const data: { posts: MediaPost[]; hasMore: boolean } = await res.json();
          if (data.posts.length > 0) {
            setExtraPosts((prev) => [...prev, ...data.posts]);
            setHasMore(data.hasMore);
            setIndex((i) => i + 1);
            return;
          }
          setHasMore(false);
        }
      } catch {
        // Network hiccup - fall through and wrap to the start instead of
        // leaving navigation stuck.
      } finally {
        setLoadingMore(false);
      }
    }

    setIndex(0);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (canNavigate && e.key === 'ArrowLeft') goPrev();
      else if (canNavigate && e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // Re-subscribing on every render (goPrev/goNext have a fresh identity
    // each time) is intentional here - it's the simplest way to guarantee
    // the listener never closes over a stale `index`/`hasMore`, and the
    // cost of re-attaching one window listener per navigation is trivial.
  });

  if (!post) return null;

  // Portal to document.body: when opened from a map pin/cluster, this
  // component is a DOM descendant of Google Maps' own container, which
  // creates its own CSS stacking context (for GPU compositing). A nested
  // z-[1000] can never escape that context to sit above the site header
  // (z-50) - the whole map subtree is compared to the header as one unit.
  // Rendering at the body level sidesteps that entirely.
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.mediaType === 'video' ? 'Trip video viewer' : 'Trip photo viewer'}
    >
      {/* Always the full-resolution original (post.blobUrl), never
          displayUrl/thumbUrl - the viewer's compressed copy is meant to
          save bandwidth for casual viewing, not to be what someone
          actually keeps. */}
      <a
        href={post.blobUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label={post.mediaType === 'video' ? 'Download full-size video' : 'Download full-size photo'}
        className="absolute top-4 right-[68px] z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors"
      >
        <Download size={20} strokeWidth={1.5} />
      </a>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      {canNavigate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors"
        >
          <ChevronLeft size={24} strokeWidth={1.75} />
        </button>
      )}

      {post.mediaType === 'video' ? (
        <video
          key={post.id}
          src={post.blobUrl}
          controls
          autoPlay
          playsInline
          className="max-w-full max-h-full rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          key={post.id}
          src={displayUrl ?? post.blobUrl}
          alt="Trip photo"
          className="max-w-full max-h-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {canNavigate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          disabled={loadingMore}
          aria-label="Next photo"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors disabled:opacity-50"
        >
          <ChevronRight size={24} strokeWidth={1.75} />
        </button>
      )}

      {canNavigate && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-xs font-medium bg-black/60 rounded-full px-3 py-1">
          {/* Total is only meaningful once we know there's nothing left to
              page in - otherwise showing "x / n" would understate the
              real count and look like a bug once more loads in. */}
          {enablePagination && hasMore ? safeIndex + 1 : `${safeIndex + 1} / ${allPosts.length}`}
        </div>
      )}
    </div>,
    document.body,
  );
}
