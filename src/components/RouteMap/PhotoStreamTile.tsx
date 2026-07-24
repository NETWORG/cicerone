import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMediaPosts } from '../../hooks/useMediaPosts';
import MediaLightbox from '../MediaLightbox';

/**
 * Compact preview of the live photo stream, shown next to the map so
 * visitors don't have to scroll all the way down to the `FollowSection`
 * grid to see the most recently *captured* photos/videos. Shows the
 * newest-captured thumbnails (see `useMediaPosts`, sorted by
 * `capturedAt` rather than upload time); tapping one opens the same
 * shared `MediaLightbox` used everywhere else, seeded with the *full*
 * posts list (not just this tile's truncated subset) so browsing from
 * here isn't more limited than browsing from the main stream.
 */
const TILE_COUNT = 6;

export default function PhotoStreamTile() {
  const posts = useMediaPosts();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (posts.length === 0) return null;

  const tilePosts = posts.slice(0, TILE_COUNT);

  return (
    <div className="bg-white border border-asphalt-700 shadow-sm rounded flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-asphalt-300">Latest photos</h3>
        <a href="#follow" className="text-xs font-semibold text-rally-600 hover:text-rally-700">
          View all
        </a>
      </div>

      <div className="grid grid-cols-3 gap-1.5 px-4 pb-4">
        {tilePosts.map((post, i) => (
          <button
            key={post.id}
            type="button"
            onClick={() => setSelectedIndex(i)}
            aria-label={post.mediaType === 'video' ? 'Open trip video' : 'Open trip photo'}
            className="relative aspect-square rounded-md overflow-hidden group bg-asphalt-800"
          >
            {post.mediaType === 'video' ? (
              <>
                {post.thumbUrl ? (
                  // thumbUrl is always a generated JPEG frame - render as an
                  // <img>, not a <video src>, which would fail to load/play
                  // for most posts (see MediaMarker.tsx for the same rule).
                  <img src={post.thumbUrl} alt="Trip video thumbnail" loading="lazy" className="w-full h-full object-cover" />
                ) : (
                  <video src={post.blobUrl} muted preload="metadata" playsInline className="w-full h-full object-cover" />
                )}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
                  <Video size={9} strokeWidth={2} color="#fff" />
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
    </div>
  );
}
