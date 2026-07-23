import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer, type Marker, type Renderer, type onClusterClickHandler } from '@googlemaps/markerclusterer';

/**
 * Groups AdvancedMarker instances that overlap at the current zoom level into
 * a single cluster bubble, so two pins sitting on top of each other don't
 * hide one another. Clicking a cluster bubble zooms in to split it apart
 * (built-in MarkerClusterer default behavior).
 *
 * Returns a `getMarkerRef(key)` function; call it once per marker to get a
 * ref-callback for that `AdvancedMarker`'s `ref` prop. The callback identity
 * is cached per key so it stays stable across re-renders - an inline
 * `ref={(m) => ...}` would get a new function identity every render, which
 * makes React detach/reattach the ref (and re-run our state update) on every
 * single render, causing an infinite update loop.
 *
 * An optional custom `renderer` controls what a cluster bubble looks like
 * (e.g. the crew clusterer uses a red car-badge instead of the default
 * blue/red dot, so it stays visually distinct from waypoint clusters).
 *
 * An optional `recomputeKey` forces the clusterer to recompute cluster
 * groupings/positions on demand. This matters for markers that move (e.g.
 * crew cars updating every poll): `MarkerClusterer.render()` only re-runs
 * automatically on the map's `idle` event (zoom/pan) or when markers are
 * added/removed, so an existing marker's `position` prop changing in place
 * doesn't otherwise trigger a re-cluster - the cluster bubble would keep
 * showing the marker's old position until the next zoom/pan. Pass a value
 * that changes whenever the underlying data does (e.g. the positions array
 * itself) to keep clusters in sync.
 *
 * An optional `onClusterClick` replaces the default zoom-to-split behavior
 * for cluster bubble clicks (e.g. media clusters open a lightbox instead of
 * zooming in). Unlike the marker ref callbacks above, this is just a plain
 * mutable property on the clusterer instance (not tied to React's ref
 * reconciliation), so passing a new function identity each render is safe -
 * it doesn't retrigger `setMarkers` or cause a render loop.
 */
export function useClusterer(
  map: google.maps.Map | null,
  renderer?: Renderer,
  recomputeKey?: unknown,
  onClusterClick?: onClusterClickHandler
) {
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const refCallbacks = useRef<Record<string, (marker: Marker | null) => void>>({});

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map, renderer });
    }
  }, [map, renderer]);

  useEffect(() => {
    // Also depend on `map`: if the map instance is initially null, the
    // clusterer above isn't created until `map` becomes available, but this
    // effect previously only re-ran on `onClusterClick` changes - so on a
    // handler-provided-before-map-ready render order, `clusterer.current`
    // would still be null here and the assignment would silently never
    // happen, leaving cluster clicks on the default zoom-to-split behavior.
    if (clusterer.current && onClusterClick) {
      clusterer.current.onClusterClick = onClusterClick;
    }
  }, [map, onClusterClick]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  useEffect(() => {
    if (recomputeKey === undefined) return;
    clusterer.current?.render();
  }, [recomputeKey]);

  return function getMarkerRef(key: string) {
    if (!refCallbacks.current[key]) {
      refCallbacks.current[key] = (marker: Marker | null) => {
        setMarkers((prev) => {
          if (marker && prev[key] === marker) return prev;
          if (!marker && !prev[key]) return prev;
          const next = { ...prev };
          if (marker) {
            next[key] = marker;
          } else {
            delete next[key];
          }
          return next;
        });
      };
    }
    return refCallbacks.current[key];
  };
}
