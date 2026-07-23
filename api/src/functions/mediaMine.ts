import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';
import { normalizeUploaderEmail } from '../mediaEmail';
import type { MediaPost } from './media';

const MAX_LIMIT = 500;

/**
 * Lists a single uploader's own posts, keyed by their self-reported
 * email. Anonymous/public read, same exposure level as `/api/media` -
 * this is a "find posts with this uploadedBy" filter, not an
 * authenticated "my account" view. Once real sign-in exists, this becomes
 * the same query but sourced from a verified session's email.
 */
export async function mediaMine(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const email = normalizeUploaderEmail(request.query.get('email'));
  if (!email) {
    return { status: 400, body: 'Missing or invalid email query parameter' };
  }

  try {
    const table = await getMediaTable();
    const entities = table.listEntities<MediaEntity>({
      queryOptions: {
        filter: `PartitionKey eq '${mediaPartitionKey()}' and uploadedBy eq '${email}'`,
      },
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
      if (posts.length >= MAX_LIMIT) break;
    }

    return {
      status: 200,
      jsonBody: posts,
      headers: { 'Cache-Control': 'no-store' },
    };
  } catch (error) {
    context.error('Failed to read own media posts', error);
    return { status: 500, body: 'Failed to read own media posts' };
  }
}

app.http('mediaMine', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'media/mine',
  handler: mediaMine,
});
