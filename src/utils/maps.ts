/**
 * Universal Google Maps directions link. On mobile browsers this redirects
 * straight into the native Google Maps app (with the destination pre-filled
 * and ready for turn-by-turn navigation) if it's installed; otherwise it
 * falls back to Google Maps on the web.
 */
export function googleMapsDirectionsUrl(coords: { lat: number; lng: number }): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
}
