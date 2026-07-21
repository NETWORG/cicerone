import { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { useMediaPosts, type MediaPost } from '../../hooks/useMediaPosts';
import MediaMarker from './MediaMarker';
import MediaLightbox from '../MediaLightbox';
import { useClusterer } from './useClusterer';
import { mediaClusterRenderer } from './mediaClusterRenderer';

/** Renders one pin per geotagged uploaded photo/video, clustered like the crew/waypoint markers. */
export default function MediaMarkers() {
  const posts = useMediaPosts();
  const geotagged = posts.filter((p): p is MediaPost & { lat: number; lon: number } => p.lat != null && p.lon != null);
  const [selected, setSelected] = useState<MediaPost | null>(null);
  const map = useMap();
  const setMediaMarkerRef = useClusterer(map, mediaClusterRenderer);

  return (
    <>
      {geotagged.map((post) => (
        <MediaMarker
          key={post.id}
          post={post}
          onClick={() => setSelected(post)}
          markerRef={setMediaMarkerRef(post.id)}
        />
      ))}
      {selected && <MediaLightbox post={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
