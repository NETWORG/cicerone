import { Camera, Video } from 'lucide-react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import type { MediaPost } from '../../hooks/useMediaPosts';
import type { Marker } from '@googlemaps/markerclusterer';

const PIN_COLOR = '#f59e0b';

export default function MediaMarker({
  post,
  onClick,
  markerRef,
}: {
  post: MediaPost;
  onClick: () => void;
  markerRef?: (marker: Marker | null) => void;
}) {
  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: post.lat!, lng: post.lon! }}
      onClick={onClick}
      title="Trip photo"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-[3px] border-white"
        style={{ backgroundColor: PIN_COLOR }}
      >
        {post.mediaType === 'video' ? (
          <Video size={16} strokeWidth={2.25} color="#fff" />
        ) : (
          <Camera size={16} strokeWidth={2.25} color="#fff" />
        )}
      </div>
    </AdvancedMarker>
  );
}
