import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer, type Marker } from '@googlemaps/markerclusterer';

/**
 * Groups AdvancedMarker instances that overlap at the current zoom level into
 * a single cluster bubble, so two pins sitting on top of each other don't
 * hide one another. Clicking a cluster bubble zooms in to split it apart
 * (built-in MarkerClusterer default behavior).
 *
 * Returns a ref-callback to pass to each `AdvancedMarker`'s `ref` prop,
 * keyed by a stable id (e.g. stop id or crew id).
 */
export function useClusterer(map: google.maps.Map | null) {
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  return (marker: Marker | null, key: string) => {
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
