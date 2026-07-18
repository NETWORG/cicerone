import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { ROUTE_SEGMENTS } from '../../data/route-segments';
import { STOPS } from '../../data/stops';

/**
 * Zooms/pans the map to fit the whole route on load, instead of a fixed
 * center+zoom that leaves most of the map looking empty.
 */
export default function FitToRoute() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;

    const allPoints = ROUTE_SEGMENTS.flatMap((segment) => segment.path);
    const bounds = new g.maps.LatLngBounds();
    const points = allPoints.length > 0 ? allPoints : STOPS.map((s) => s.coords);
    points.forEach((p: { lat: number; lng: number }) => bounds.extend(p));
    map.fitBounds(bounds, 24);
  }, [map]);

  return null;
}
