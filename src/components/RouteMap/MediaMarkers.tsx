import { useEffect, useRef, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { Marker } from '@googlemaps/markerclusterer';
import { useMediaPosts, type MediaPost } from '../../hooks/useMediaPosts';
import MediaMarker from './MediaMarker';
import MediaLightbox from '../MediaLightbox';
import { useClusterer } from './useClusterer';
import { mediaClusterRenderer, postsInCluster } from './mediaClusterRenderer';
import { postsWithinRadius } from './mediaProximity';

type GeotaggedPost = MediaPost & { lat: number; lon: number };

/** Newest-*captured*-first (not newest-uploaded) - matches how
 *  `useMediaPosts` sorts. Crews upload with a time lag, so sorting by
 *  `capturedAt` (an ISO string, sorts correctly lexicographically) keeps
 *  lightbox ordering on trip-timeline order everywhere it's opened from. */
function sortNewestFirst(posts: readonly MediaPost[]): MediaPost[] {
  return [...posts].sort((a, b) => (a.capturedAt < b.capturedAt ? 1 : a.capturedAt > b.capturedAt ? -1 : 0));
}

const NEARBY_RADIUS_METERS = 500;

/** Renders one pin per geotagged uploaded photo/video, clustered like the crew/waypoint markers. */
export default function MediaMarkers() {
  const posts = useMediaPosts();
  const geotagged = posts.filter((p): p is GeotaggedPost => p.lat != null && p.lon != null);
  const [lightbox, setLightbox] = useState<{ posts: MediaPost[]; index: number } | null>(null);
  const map = useMap();

  // Clicking a media cluster bubble opens the lightbox with that cluster's
  // posts instead of MarkerClusterer's default zoom-to-split-the-cluster
  // behavior - browsing a cluster's photos in place is more useful here
  // than forcing a zoom. This is a plain mutable property assignment (see
  // useClusterer), so a fresh closure each render is fine.
  function handleClusterClick(_event: google.maps.MapMouseEvent, cluster: { markers?: Marker[] }) {
    const clusterPosts = sortNewestFirst(postsInCluster(cluster.markers ?? []));
    if (clusterPosts.length === 0) return;
    setLightbox({ posts: clusterPosts, index: 0 });
  }

  const setMediaMarkerRef = useClusterer(map, mediaClusterRenderer, undefined, handleClusterClick);

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

  // Same stable-identity concern for pin clicks: reads the live posts list
  // from a ref rather than capturing it, so `getClickHandler` never needs
  // to change identity across renders.
  const geotaggedRef = useRef<GeotaggedPost[]>(geotagged);
  geotaggedRef.current = geotagged;

  function openFromPin(post: GeotaggedPost) {
    // Individual (non-clustered) pins also allow browsing - grouping in
    // any other geotagged posts within 500m of this one, so a lone pin
    // isn't a dead end if there are nearby photos at the current zoom.
    const nearby = postsWithinRadius(geotaggedRef.current, post, NEARBY_RADIUS_METERS);
    const sorted = sortNewestFirst(nearby.length > 0 ? nearby : [post]);
    const index = Math.max(0, sorted.findIndex((p) => p.id === post.id));
    setLightbox({ posts: sorted, index });
  }

  const clickHandlers = useRef<Record<string, () => void>>({});
  function getClickHandler(id: string) {
    if (!clickHandlers.current[id]) {
      clickHandlers.current[id] = () => {
        const post = geotaggedRef.current.find((p) => p.id === id);
        if (post) openFromPin(post);
      };
    }
    return clickHandlers.current[id];
  }

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
        <MediaMarker
          key={post.id}
          post={post}
          onClick={getClickHandler(post.id)}
          markerRef={getTaggingRef(post.id)}
        />
      ))}
      {lightbox && (
        <MediaLightbox posts={lightbox.posts} initialIndex={lightbox.index} onClose={() => setLightbox(null)} />
      )}
    </>
  );
}
