import type { Cluster, Marker, Renderer } from '@googlemaps/markerclusterer';
import { type MediaPost, compareCapturedAtDesc } from '../../hooks/useMediaPosts';

/** Markers tagged with their post data by `MediaMarkers.tsx` on ref-set. */
export type TaggedMediaMarker = Marker & { __mediaPost?: MediaPost };

/** Extracts the tagged posts from a cluster's underlying markers, in no
 *  particular order - callers sort as needed for their own use case. */
export function postsInCluster(markers: readonly Marker[]): MediaPost[] {
  return markers.map((m) => (m as TaggedMediaMarker).__mediaPost).filter((p): p is MediaPost => !!p);
}

function pickThumbnailPost(markers: readonly Marker[]): MediaPost | undefined {
  const posts = postsInCluster(markers);
  if (posts.length === 0) return undefined;
  // Apple Photos-style: prefer a photo so the cluster bubble feels like
  // "one of your photos", falling back to a video only if the cluster has
  // no photos at all. Pick deterministically (newest *captured* first,
  // with an `id` tie-breaker baked into `compareCapturedAtDesc`) rather
  // than randomly, so the same cluster doesn't flicker between different
  // thumbnails on every pan/zoom re-render.
  const photos = posts.filter((p) => p.mediaType === 'photo');
  const pool = photos.length > 0 ? photos : posts;
  return [...pool].sort(compareCapturedAtDesc)[0];
}

/**
 * Cluster bubble for geotagged trip photos/videos - shows a photo from the
 * cluster (Apple Photos map-view style, deterministically newest-first) with
 * a count badge, falling back to the amber camera badge if no thumbnail is
 * available. Square (not round) and sized to match the bigger individual
 * `MediaMarker` pins. Offset a few pixels from its anchor point so it
 * doesn't sit exactly on top of a waypoint cluster/marker sharing the same
 * coordinate (e.g. a photo taken right at a trip stop) - see
 * `MediaMarker.tsx` for the matching offset on individual pins. Clicking the
 * bubble is handled by a custom `onClusterClick` in `MediaMarkers.tsx`
 * (opens the lightbox with this cluster's posts instead of the default
 * zoom-to-split).
 */
export const mediaClusterRenderer: Renderer = {
  render({ count, position, markers }: Cluster) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.transform = 'translate(8px, -8px)';

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style.width = '56px';
    div.style.height = '56px';
    div.style.borderRadius = '14px';
    div.style.border = '3px solid #fff';
    div.style.boxShadow = '0 4px 10px rgba(0,0,0,.4)';
    div.style.cursor = 'pointer';
    div.style.overflow = 'hidden';
    div.title = `${count} photos/videos nearby`;

    const post = pickThumbnailPost(markers ?? []);
    // thumbUrl is always a JPEG. For photos it's safe to fall back to the
    // full-size blobUrl (still an image); for videos without a generated
    // thumbnail, blobUrl points at a video file, which would break an
    // <img> - fall through to the generic badge instead.
    const thumbSrc = post ? post.thumbUrl ?? (post.mediaType === 'photo' ? post.blobUrl : undefined) : undefined;
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
      div.style.fontSize = '22px';
      div.textContent = '📷';
    }

    // Appended to `wrapper`, not `div` - `div` has overflow:hidden to clip
    // the square thumbnail to rounded corners, which would also clip this
    // badge since it intentionally overhangs the div's edge (negative
    // top/right) to read as a corner badge rather than an inset one.
    const badge = document.createElement('span');
    badge.style.position = 'absolute';
    badge.style.top = '-6px';
    badge.style.right = '-6px';
    badge.style.minWidth = '22px';
    badge.style.height = '22px';
    badge.style.padding = '0 5px';
    badge.style.background = '#1b1f23';
    badge.style.color = '#fff';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = '700';
    badge.style.fontFamily = 'sans-serif';
    badge.style.borderRadius = '9999px';
    badge.style.display = 'flex';
    badge.style.alignItems = 'center';
    badge.style.justifyContent = 'center';
    badge.style.border = '2px solid #fff';
    badge.style.lineHeight = '1';
    badge.style.boxShadow = '0 1px 3px rgba(0,0,0,.35)';
    badge.textContent = String(count);

    wrapper.appendChild(div);
    wrapper.appendChild(badge);

    return new google.maps.marker.AdvancedMarkerElement({
      position,
      content: wrapper,
      zIndex: 900 + count,
    });
  },
};

