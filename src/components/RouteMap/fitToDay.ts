import { ROUTE_SEGMENTS } from '../../data/route-segments';
import { STOPS } from '../../data/stops';

/**
 * Fits the map's viewport to a single day's driving route (or falls back to
 * that day's stops if the precomputed route segment is missing), for the
 * day-stats table's "Show on map" button.
 */
export function fitToDay(map: google.maps.Map | null, date: string) {
  if (!map) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = (window as any).google;
  if (!g) return;

  const segment = ROUTE_SEGMENTS.find((s) => s.date === date);
  const points =
    segment && segment.path.length > 0
      ? segment.path
      : STOPS.filter((stop) => stop.date === date).map((stop) => stop.coords);
  if (points.length === 0) return;

  const bounds = new g.maps.LatLngBounds();
  points.forEach((p: { lat: number; lng: number }) => bounds.extend(p));
  map.fitBounds(bounds, 24);
}
