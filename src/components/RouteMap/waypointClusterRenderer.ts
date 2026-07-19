import type { Cluster, ClusterStats, Renderer } from '@googlemaps/markerclusterer';

/**
 * Waypoint clusters use a neutral, smaller badge (a pin emoji on a dark
 * asphalt circle) so they stay visually secondary to the red car clusters,
 * matching the existing hierarchy between individual car and waypoint pins.
 */
export const waypointClusterRenderer: Renderer = {
  render({ count, position }: Cluster, _stats: ClusterStats, map: google.maps.Map) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '38px';
    div.style.height = '38px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.borderRadius = '50%';
    div.style.background = '#262b30';
    div.style.border = '2px solid #fff';
    div.style.boxShadow = '0 2px 6px rgba(0,0,0,.35)';
    div.style.fontSize = '16px';
    div.style.lineHeight = '1';
    div.style.cursor = 'pointer';
    div.title = `${count} stops nearby`;
    div.innerHTML = `📍<span style="position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;padding:0 3px;background:#c8102e;color:#fff;font-size:10px;font-weight:700;font-family:sans-serif;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;">${count}</span>`;

    return new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      content: div,
      zIndex: 500 + count,
    });
  },
};
