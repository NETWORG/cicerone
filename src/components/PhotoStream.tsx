import { useState } from 'react';
import { Video } from 'lucide-react';
import { useMediaPosts, type MediaPost } from '../hooks/useMediaPosts';
import MediaLightbox from './MediaLightbox';

/**
 * Live grid of recently uploaded trip photos/videos (from cicerallye.com/photos),
 * newest first. Used in FollowSection once the trip is underway.
 */
export default function PhotoStream() {
  const posts = useMediaPosts();
  const [selected, setSelected] = useState<MediaPost | null>(null);

  if (posts.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelected(post)}
            className="relative aspect-square rounded-lg overflow-hidden group"
          >
            {post.mediaType === 'video' ? (
              <>
                <video src={post.blobUrl} muted className="w-full h-full object-cover" />
                <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                  <Video size={11} strokeWidth={2} color="#fff" />
                </span>
              </>
            ) : (
              <img src={post.blobUrl} alt="Trip photo" loading="lazy" className="w-full h-full object-cover" />
            )}
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {selected && <MediaLightbox post={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
