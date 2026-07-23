import { Video } from 'lucide-react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { MediaPost } from '../../hooks/useMediaPosts';
import type { Marker } from '@googlemaps/markerclusterer';

export default function MediaMarker({
  post,
  onClick,
  markerRef,
}: {
  post: MediaPost;
  onClick: () => void;
  markerRef?: (marker: Marker | null) => void;
}) {
  // Prefer the small client-generated thumbnail (see photos.ts) so map
  // pins never have to download a multi-MB original just to show a
  // ~36px circle. Older posts (or the rare failed-generation post) fall
  // back to the full-size blobUrl - heavier, but still renders. For
  // videos, thumbUrl is always a JPEG frame, so only fall back to a
  // <video> element (playing blobUrl) when no thumbnail was generated -
  // never render a video URL through an <img>, or vice versa.
  const hasThumb = !!post.thumbUrl;
  const thumbSrc = post.thumbUrl ?? post.blobUrl;

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: post.lat!, lng: post.lon! }}
      onClick={onClick}
      title={post.mediaType === 'video' ? 'Trip video' : 'Trip photo'}
    >
      <div className="relative w-9 h-9 rounded-full shadow-lg border-[3px] border-white overflow-hidden bg-gray-300">
        {post.mediaType === 'video' && !hasThumb ? (
          <video src={thumbSrc} muted preload="metadata" playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={thumbSrc} alt="" className="w-full h-full object-cover" />
        )}
        {post.mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Video size={14} strokeWidth={2.5} color="#fff" />
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}
