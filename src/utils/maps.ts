/**
 * Universal Google Maps location link. On mobile browsers this deep-links
 * straight into the native Google Maps app (dropping a pin at the exact
 * coordinates) if it's installed; otherwise it falls back to Google Maps on
 * the web. Deliberately a "show this place" link, not turn-by-turn
 * directions - crews can start navigation themselves from within Maps once
 * they're there.
 */
export function googleMapsPinUrl(coords: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}
