import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import type { MediaPost } from '../hooks/useMediaPosts';

/**
 * Fullscreen overlay for viewing a single uploaded photo/video at full
 * size. Shared between the live photo stream (FollowSection) and the
 * geotagged map pins (RouteMap) so both open the same viewer.
 */
export default function MediaLightbox({ post, onClose }: { post: MediaPost; onClose: () => void }) {
  // The full-resolution original (post.blobUrl) can be several MB - bad on
  // a metered connection just to *look* at a photo. If the post doesn't
  // already carry a generated display-size copy (see mediaDisplay.ts),
  // request one on open; the server generates (and caches) it lazily on
  // first request, so this is a one-time cost per post, not per view.
  // Shown immediately with the full-size blobUrl as a fallback while that
  // request is in flight (or if it fails) so opening never stalls.
  const [displayUrl, setDisplayUrl] = useState(post.displayUrl);

  useEffect(() => {
    setDisplayUrl(post.displayUrl);
    if (post.mediaType !== 'photo' || post.displayUrl) return;

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
  }, [post.id, post.mediaType, post.displayUrl]);

  return (
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
      {post.mediaType === 'video' ? (
        <video
          src={post.blobUrl}
          controls
          autoPlay
          playsInline
          className="max-w-full max-h-full rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          src={displayUrl ?? post.blobUrl}
          alt="Trip photo"
          className="max-w-full max-h-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
