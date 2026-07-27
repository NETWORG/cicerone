import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMediaPosts } from '../hooks/useMediaPosts';
import MediaLightbox from './MediaLightbox';

/**
 * Live grid of recently uploaded trip photos/videos (from cicerallye.com/photos),
 * newest (by capture date) first. Used in FollowSection once the trip is
 * underway.
 */
// Capped so this stays a quick teaser instead of turning "Watch the trip"
// into a page-length grid once hundreds of photos pile up over a trip -
// the full set is still all reachable from the map pins.
const PREVIEW_COUNT = 12;

export default function PhotoStream() {
  const posts = useMediaPosts().slice(0, PREVIEW_COUNT);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (posts.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {posts.map((post, i) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedIndex(i)}
            aria-label={post.mediaType === 'video' ? 'Open trip video' : 'Open trip photo'}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            {post.mediaType === 'video' ? (
              <>
                {/* Prefer the small generated thumbnail (a JPEG frame) so
                    the grid never has to download the full-size video just
                    to show a preview - same reasoning as MediaMarker.tsx.
                    Only fall back to a <video> element (loading blobUrl,
                    metadata only) for older posts without one. */}
                {post.thumbUrl ? (
                  <img src={post.thumbUrl} alt="Trip video" loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <video
                    src={post.blobUrl}
                    muted
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
                <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                  <Video size={11} strokeWidth={2} color="#fff" />
                </span>
              </>
            ) : (
              <img
                src={post.thumbUrl ?? post.blobUrl}
                alt="Trip photo"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {selectedIndex !== null && (
        <MediaLightbox posts={posts} initialIndex={selectedIndex} onClose={() => setSelectedIndex(null)} />
      )}
    </>
  );
}
