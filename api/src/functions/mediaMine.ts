import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';
import { normalizeUploaderEmail } from '../mediaEmail';
import type { MediaPost } from './media';

const MAX_LIMIT = 500;

// Upper bound on how many rows we'll ever pull for a single uploader to
// sort in memory - see media.ts for the same reasoning. Just a sanity
// ceiling, well above what any real uploader is expected to hit.
const SCAN_CAP = 5000;

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
        displayUrl: entity.displayUrl,
        lat: entity.lat,
        lon: entity.lon,
        capturedAt: entity.capturedAt,
        uploadedAt: entity.uploadedAt,
      });
      if (posts.length >= SCAN_CAP) break;
    }

    // Sort by capturedAt (not RowKey/upload order - see media.ts) *before*
    // truncating to MAX_LIMIT, so an uploader with more posts than
    // MAX_LIMIT still gets their genuinely most-recently-captured posts,
    // not whichever happened to be scanned first.
    posts.sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());

    return {
      status: 200,
      jsonBody: posts.slice(0, MAX_LIMIT),
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
