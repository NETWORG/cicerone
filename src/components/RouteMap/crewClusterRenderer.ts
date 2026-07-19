import type { Cluster, Renderer } from '@googlemaps/markerclusterer';

/**
 * Car-marker clusters need to read as "cars", not blend in with the default
 * blue/red waypoint cluster dots, since they're the most important pins on
 * the map. Renders a red circular badge with a car emoji and a count badge,
 * echoing the individual `CrewMarker` style (white ring, drop shadow).
 */
export const crewClusterRenderer: Renderer = {
  render({ count, position }: Cluster) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '52px';
    div.style.height = '52px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.borderRadius = '50%';
    div.style.background = '#c8102e';
    div.style.border = '3px solid #fff';
    div.style.boxShadow = '0 4px 10px rgba(0,0,0,.4)';
    div.style.fontSize = '24px';
    div.style.lineHeight = '1';
    div.style.cursor = 'pointer';
    div.title = `${count} cars nearby`;
    div.innerHTML = `🚗<span style="position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 4px;background:#1b1f23;color:#fff;font-size:11px;font-weight:700;font-family:sans-serif;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;">${count}</span>`;

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      zIndex: 1000 + count,
    });
  },
};
