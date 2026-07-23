import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { MediaPost } from '../hooks/useMediaPosts';

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
}: {
  posts: MediaPost[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  // `index` is only set from `initialIndex` on mount; if a caller swaps
  // `posts` while this stays open (e.g. `PhotoStreamTile` re-fetching) and
  // the previous index is now out of range, clamp instead of indexing past
  // the end - otherwise `post` becomes undefined and the whole overlay
  // silently disappears (see the early return below).
  const safeIndex = posts.length === 0 ? 0 : Math.min(index, posts.length - 1);
  const post = posts[safeIndex];
  const canNavigate = posts.length > 1;

  function goPrev() {
    setIndex((i) => (Math.min(i, posts.length - 1) - 1 + posts.length) % posts.length);
  }

  function goNext() {
    setIndex((i) => (Math.min(i, posts.length - 1) + 1) % posts.length);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (canNavigate && e.key === 'ArrowLeft') goPrev();
      else if (canNavigate && e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canNavigate, posts.length, onClose]);

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

      <a
        href={post.blobUrl}
        download
        onClick={(e) => e.stopPropagation()}
        aria-label="Download original"
        className="absolute top-4 right-[68px] z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors"
      >
        <Download size={20} strokeWidth={1.5} />
      </a>

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
          src={post.blobUrl}
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
          aria-label="Next photo"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-black/70 text-white ring-1 ring-white/30 hover:bg-black/90 transition-colors"
        >
          <ChevronRight size={24} strokeWidth={1.75} />
        </button>
      )}

      {canNavigate && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/80 text-xs font-medium bg-black/60 rounded-full px-3 py-1">
          {safeIndex + 1} / {posts.length}
        </div>
      )}
    </div>,
    document.body,
  );
}
