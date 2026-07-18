/**
 * Pans/zooms the map to focus on a single marker when it's clicked, so
 * tapping a pin inside a cluster (or just a pin near the edge of view)
 * actually centers on it instead of leaving it half-visible.
 */
export function focusOn(
  map: google.maps.Map | null,
  position: { lat: number; lng: number },
  minZoom = 14
) {
  if (!map) return;
  map.panTo(position);
  const zoom = map.getZoom();
  if (zoom === undefined || zoom < minZoom) {
    map.setZoom(minZoom);
  }
}
