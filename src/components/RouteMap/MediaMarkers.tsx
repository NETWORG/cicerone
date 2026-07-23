import { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Marker } from '@googlemaps/markerclusterer';
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

  // Keeps the tagging ref callback below stable in identity (see caveat
  // on useClusterer: a new function per render causes React to detach/
  // reattach every AdvancedMarker's ref on every single render, which
  // triggers an infinite setState loop in useClusterer). The post is
  // read from this ref instead of being captured directly so the
  // wrapper function itself never needs to change.
  const postsById = useRef<Record<string, MediaPost>>({});
  useEffect(() => {
    const next: Record<string, MediaPost> = {};
    for (const post of geotagged) next[post.id] = post;
    postsById.current = next;
  }, [geotagged]);

  const taggingRefs = useRef<Record<string, (marker: Marker | null) => void>>({});
  function getTaggingRef(id: string) {
    if (!taggingRefs.current[id]) {
      taggingRefs.current[id] = (marker: Marker | null) => {
        // Tag the raw marker instance with its post so the cluster
        // renderer (which only receives marker instances, not our
        // React props) can pick a thumbnail to show on the bubble.
        if (marker) Object.assign(marker, { __mediaPost: postsById.current[id] });
        setMediaMarkerRef(id)(marker);
      };
    }
    return taggingRefs.current[id];
  }

  return (
    <>
      {geotagged.map((post) => (
        <MediaMarker key={post.id} post={post} onClick={() => setSelected(post)} markerRef={getTaggingRef(post.id)} />
      ))}
      {selected && <MediaLightbox post={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
