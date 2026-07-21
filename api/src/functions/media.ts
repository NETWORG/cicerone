import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

export interface MediaPost {
  id: string;
  mediaType: MediaEntity['mediaType'];
  blobUrl: string;
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
    const entities = table.listEntities<MediaEntity>({
      queryOptions: { filter: `PartitionKey eq '${mediaPartitionKey()}'` },
    });

    const posts: MediaPost[] = [];
    for await (const entity of entities) {
      posts.push({
        id: entity.rowKey,
        mediaType: entity.mediaType,
        blobUrl: entity.blobUrl,
        lat: entity.lat,
        lon: entity.lon,
        capturedAt: entity.capturedAt,
        uploadedAt: entity.uploadedAt,
      });
    }

    posts.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

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
