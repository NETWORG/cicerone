import type { Cluster, Marker, Renderer } from '@googlemaps/markerclusterer';
import type { MediaPost } from '../../hooks/useMediaPosts';

/** Markers tagged with their post data by `MediaMarkers.tsx` on ref-set. */
type TaggedMarker = Marker & { __mediaPost?: MediaPost };

function pickThumbnailPost(markers: readonly Marker[]): MediaPost | undefined {
  const posts = markers.map((m) => (m as TaggedMarker).__mediaPost).filter((p): p is MediaPost => !!p);
  if (posts.length === 0) return undefined;
  // Apple Photos-style: prefer a random photo so the cluster bubble feels
  // like "one of your photos", falling back to a random video only if the
  // cluster has no photos at all.
  const photos = posts.filter((p) => p.mediaType === 'photo');
  const pool = photos.length > 0 ? photos : posts;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Cluster bubble for geotagged trip photos/videos - shows a random photo
 * from the cluster (Apple Photos map-view style) with a count badge,
 * falling back to the amber camera badge if no thumbnail is available.
 */
export const mediaClusterRenderer: Renderer = {
  render({ count, position, markers }: Cluster) {
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '40px';
    div.style.height = '40px';
    div.style.borderRadius = '50%';
    div.style.border = '3px solid #fff';
    div.style.boxShadow = '0 4px 10px rgba(0,0,0,.4)';
    div.style.cursor = 'pointer';
    div.style.overflow = 'hidden';
    div.title = `${count} photos/videos nearby`;

    const post = pickThumbnailPost(markers ?? []);
    const thumbSrc = post ? post.thumbUrl ?? post.blobUrl : undefined;
    if (thumbSrc) {
      const img = document.createElement('img');
      img.src = thumbSrc;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      div.appendChild(img);
    } else {
      div.style.background = '#f59e0b';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.fontSize = '18px';
      div.textContent = '📷';
    }

    const badge = document.createElement('span');
    badge.style.position = 'absolute';
    badge.style.top = '-4px';
    badge.style.right = '-4px';
    badge.style.minWidth = '18px';
    badge.style.height = '18px';
    badge.style.padding = '0 4px';
    badge.style.background = '#1b1f23';
    badge.style.color = '#fff';
    badge.style.fontSize = '10px';
    badge.style.fontWeight = '700';
    badge.style.fontFamily = 'sans-serif';
    badge.style.borderRadius = '9999px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.border = '2px solid #fff';
    badge.style.lineHeight = '1';
    badge.textContent = String(count);
    div.appendChild(badge);

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: div,
      zIndex: 900 + count,
    });
  },
};
