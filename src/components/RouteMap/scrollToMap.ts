/** Scrolls the map into view - used by the tracker/day-stats tables' "Show
 *  on map" buttons so tapping one on mobile (where the tables sit below the
 *  map) actually brings the map back into view instead of panning off-screen
 *  above the fold. No-ops on desktop where the map is already visible next
 *  to the tables. */
export function scrollToMap() {
  document.getElementById('route-map')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
