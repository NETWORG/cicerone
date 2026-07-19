import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer, type Marker, type Renderer } from '@googlemaps/markerclusterer';

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
 */
export function useClusterer(map: google.maps.Map | null, renderer?: Renderer) {
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
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

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
