import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';

// Upper bound on how many rows we'll ever pull from the partition to sort
// in memory (see below) - just a sanity ceiling so a single trip's archive
// growing far beyond "hundreds" of posts can't make this scan unbounded.
// There is deliberately no separate, lower "default" cap below this: an
// earlier version of this endpoint defaulted to returning only the 100
// newest-*uploaded* rows, which meant older uploads silently vanished
// from the whole site (map pins, photo grid, sidebar tile) once total
// uploads passed 100 - exactly the "map only shows a few of the hundreds
// of photos" bug. Callers can still opt into a smaller page via `?limit=`
// (e.g. for testing), but by default every scanned post is returned.
const SCAN_CAP = 5000;

export interface MediaPost {
  id: string;
  mediaType: MediaEntity['mediaType'];
  blobUrl: string;
  thumbUrl?: string;
  displayUrl?: string;
  lat?: number;
  lon?: number;
  capturedAt: string;
  uploadedAt: string;
}

/**
 * Returns the media posts (photos/videos) for the public site's live
 * stream and map pins. Public/anonymous like `positions.ts` - this is
 * meant to be read by every site visitor. Only reads Table Storage
 * metadata; blob bytes are served directly from Blob Storage via
 * `blobUrl`, never through this Function.
 *
 * Supports cursor pagination via `?before=<ISO capturedAt>` so callers
 * (see MediaLightbox.tsx's `enablePagination`) can page through an
 * arbitrarily large archive of older posts without ever fetching more
 * than one page's worth of (small, metadata-only) JSON at a time. Omit
 * `before` for the first/newest page.
 */
export async function media(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const limitRaw = Number(request.query.get('limit'));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, SCAN_CAP) : SCAN_CAP;

  // Cursor for "load older posts" pagination (see MediaLightbox.tsx) - the
  // capturedAt of the last post the caller already has, so we only return
  // posts strictly older than that. Absent on the first page.
  const beforeRaw = request.query.get('before');
  const beforeMs = beforeRaw ? new Date(beforeRaw).getTime() : NaN;
  const before = Number.isFinite(beforeMs) ? beforeMs : undefined;

  try {
    const table = await getMediaTable();
    // RowKeys are generated with an inverted-timestamp prefix (see
    // generateMediaRowKey in mediaTable.ts), so Table Storage returns them
    // *upload*-time-newest-first within the partition - but that's not
    // necessarily the same order as `capturedAt` (e.g. someone uploads an
    // older photo later), and posts should read back in the order they
    // were taken, not the order they were uploaded. So we list the whole
    // partition (still cheap - a single trip's partition, bounded by
    // SCAN_CAP) and sort by capturedAt ourselves instead of relying on
    // RowKey order + stopping early.
    const entities = table.listEntities<MediaEntity>({
      queryOptions: { filter: `PartitionKey eq '${mediaPartitionKey()}'` },
    });

    const posts: MediaPost[] = [];
    for await (const entity of entities) {
      posts.push({
        id: entity.rowKey,
        mediaType: entity.mediaType,
        blobUrl: entity.blobUrl,
        thumbUrl: entity.thumbUrl,
        displayUrl: entity.displayUrl,
        lat: entity.lat,
        lon: entity.lon,
        capturedAt: entity.capturedAt,
        uploadedAt: entity.uploadedAt,
      });
      if (posts.length >= SCAN_CAP) break;
    }

    // capturedAt is self-reported/client-clock (see mediaComplete.ts) but
    // always falls back to a valid uploadedAt server timestamp when
    // missing/unparseable, so this sort is always well-defined.
    posts.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

    // Apply the pagination cursor *after* sorting the full set, so paging
    // deep into an archive of "hundreds" of photos still reads back in
    // true capture-date order, not just upload order.
    const windowed = before === undefined ? posts : posts.filter((p) => new Date(p.capturedAt).getTime() < before);

    return {
      status: 200,
      jsonBody: { posts: windowed.slice(0, limit), hasMore: windowed.length > limit },
      headers: { 'Cache-Control': 'no-store' },
    };
  } catch (error) {
    context.error('Failed to read media posts', error);
    return { status: 500, body: 'Failed to read media posts' };
  }
}

app.http('media', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'media',
  handler: media,
});
