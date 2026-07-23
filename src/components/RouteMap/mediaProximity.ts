/**
 * Approximate great-circle distance between two lat/lon points, in meters
 * (haversine formula). Good enough for the small (~500m) radii used to
 * group nearby geotagged photos for lightbox browsing - no need for a
 * full geodesic library at this scale.
 */
export function distanceMeters(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const EARTH_RADIUS_M = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Posts within `radiusMeters` of `center` (inclusive), in original order. */
export function postsWithinRadius<T extends { lat: number; lon: number }>(
  posts: readonly T[],
  center: { lat: number; lon: number },
  radiusMeters: number
): T[] {
  return posts.filter((post) => distanceMeters(center, post) <= radiusMeters);
}
