import type { Cluster, Renderer } from '@googlemaps/markerclusterer';

/**
 * Cluster bubble for geotagged trip photos/videos - an amber camera badge,
 * distinct from both the default waypoint clusters and the red crew-car
 * clusters. Mirrors `crewClusterRenderer`'s style (white ring, drop
 * shadow, count badge).
 */
export const mediaClusterRenderer: Renderer = {
  render({ count, position }: Cluster) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.borderRadius = '50%';
    div.style.background = '#f59e0b';
    div.style.border = '3px solid #fff';
    div.style.boxShadow = '0 4px 10px rgba(0,0,0,.4)';
    div.style.fontSize = '18px';
    div.style.lineHeight = '1';
    div.style.cursor = 'pointer';
    div.title = `${count} photos/videos nearby`;
    div.innerHTML = `📷<span style="position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 4px;background:#1b1f23;color:#fff;font-size:10px;font-weight:700;font-family:sans-serif;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;">${count}</span>`;

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      zIndex: 900 + count,
    });
  },
};
