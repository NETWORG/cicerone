import { X } from 'lucide-react';
import type { MediaPost } from '../hooks/useMediaPosts';

/**
 * Fullscreen overlay for viewing a single uploaded photo/video at full
 * size. Shared between the live photo stream (FollowSection) and the
 * geotagged map pins (RouteMap) so both open the same viewer.
 */
export default function MediaLightbox({ post, onClose }: { post: MediaPost; onClose: () => void }) {
  return (
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
          src={post.blobUrl}
          alt="Trip photo"
          className="max-w-full max-h-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
