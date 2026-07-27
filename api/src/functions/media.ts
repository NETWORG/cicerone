import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

// Upper bound on how many rows we'll ever pull from the partition to sort
// in memory (see below) - just a sanity ceiling so a single trip's archive
// growing far beyond "hundreds" of posts can't make this scan unbounded.
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
 * Returns the most recent media posts (photos/videos) for the public
 * site's live stream and map pins. Public/anonymous like `positions.ts` -
 * this is meant to be read by every site visitor. Only reads Table
 * Storage metadata; blob bytes are served directly from Blob Storage via
 * `blobUrl`, never through this Function.
 */
export async function media(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const limitRaw = Number(request.query.get('limit'));
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, MAX_LIMIT) : DEFAULT_LIMIT;

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

    return {
      status: 200,
      jsonBody: posts.slice(0, limit),
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
