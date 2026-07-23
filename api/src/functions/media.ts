import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

export interface MediaPost {
  id: string;
  mediaType: MediaEntity['mediaType'];
  blobUrl: string;
  thumbUrl?: string;
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
    // generateMediaRowKey in mediaTable.ts), so Table Storage already
    // returns them newest-first within the partition. Stop as soon as we
    // have `limit` posts instead of listing the whole partition and
    // sorting in memory - keeps this cheap as uploads pile up.
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
        lat: entity.lat,
        lon: entity.lon,
        capturedAt: entity.capturedAt,
        uploadedAt: entity.uploadedAt,
      });
      if (posts.length >= limit) break;
    }

    return {
      status: 200,
      jsonBody: posts,
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
