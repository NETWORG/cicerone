import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { ROUTE_SEGMENTS } from '../../data/route-segments';
import { DAY_COLORS } from '../../data/day-colors';

/**
 * The route line is precomputed once per day (see
 * scripts/generate-route-path.mjs) and committed as static data, so the map
 * never needs to call the Directions API at runtime - every visitor just
 * gets plain polylines, one per day, each colored to match that day's
 * itinerary section.
 */
export default function RoutePolyline() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;

    const lines = ROUTE_SEGMENTS.map((segment, i) => {
      return new g.maps.Polyline({
        path: segment.path,
        geodesic: true,
        strokeColor: DAY_COLORS[i % DAY_COLORS.length],
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map,
      });
    });

    return () => {
      lines.forEach((line) => line.setMap(null));
    };
  }, [map]);

  return null;
}
