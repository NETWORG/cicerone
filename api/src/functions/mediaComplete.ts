import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { checkMediaUploadToken } from '../mediaAuth';
import { ALLOWED_CONTENT_TYPES } from '../mediaTypes';
import { getMediaContainer } from '../mediaBlob';
import { getMediaTable, mediaPartitionKey, generateMediaRowKey, type MediaEntity, type MediaType } from '../mediaTable';
import { normalizeUploaderEmail } from '../mediaEmail';
import { getCurrentTripId } from '../tripId';

// Matches the shape produced by generateMediaBlobPath() in mediaBlob.ts,
// e.g. "transalpine-2026/2026-07-20/photo-<uuid>.jpg". The trip segment is
// pinned to the *current* trip id (same value used by mediaPartitionKey())
// rather than any trip id - otherwise a caller with the shared upload
// token could point a metadata row at a blob filed under a different
// trip's folder, leaving that trip's data inconsistent.
function blobPathPattern(): RegExp {
  const tripId = getCurrentTripId().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${tripId}\\/\\d{4}-\\d{2}-\\d{2}\\/(photo|video)-[0-9a-f-]{36}\\.[a-z0-9]+$`);
}

// Matches generateThumbBlobPath() - always a JPEG regardless of the
// original media type, also pinned to the current trip id.
function thumbBlobPathPattern(): RegExp {
  const tripId = getCurrentTripId().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${tripId}\\/\\d{4}-\\d{2}-\\d{2}\\/thumb-[0-9a-f-]{36}\\.jpg$`);
}

interface CompleteBody {
  blobPath?: string;
  contentType?: string;
  lat?: number;
  lon?: number;
  capturedAt?: string;
  uploadedBy?: string;
  thumbBlobPath?: string;
}

/**
 * Step 2 of the upload flow: after the phone has PUT the file bytes
 * directly to Blob Storage with the SAS URL from /api/media/sas, it calls
 * this endpoint with just metadata. This is intentionally cheap - a HEAD
 * on the blob to confirm the upload landed, then one Table Storage row
 * write. No file bytes are read.
 */
export async function mediaComplete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (!checkMediaUploadToken(request, context)) {
    return { status: 401, body: 'Invalid or missing token' };
  }

  let body: CompleteBody;
  try {
    body = (await request.json()) as CompleteBody;
  } catch {
    return { status: 400, body: 'Expected a JSON body' };
  }

  const { blobPath, contentType, lat, lon, capturedAt, uploadedBy, thumbBlobPath } = body;

  if (!blobPath || !blobPathPattern().test(blobPath)) {
    return { status: 400, body: 'Missing or invalid blobPath' };
  }
  if (thumbBlobPath !== undefined && !thumbBlobPathPattern().test(thumbBlobPath)) {
    return { status: 400, body: 'Invalid thumbBlobPath' };
  }
  if (!contentType || !(contentType in ALLOWED_CONTENT_TYPES)) {
    return { status: 400, body: 'Missing or unsupported contentType' };
  }
  if (lat !== undefined && (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90)) {
    return { status: 400, body: 'lat must be a finite number between -90 and 90' };
  }
  if (lon !== undefined && (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180)) {
    return { status: 400, body: 'lon must be a finite number between -180 and 180' };
  }
  // Self-reported (no accounts yet) but required so later edit/delete
  // requests have something to check ownership against - see mediaEmail.ts.
  const normalizedUploadedBy = normalizeUploaderEmail(uploadedBy);
  if (!normalizedUploadedBy) {
    return { status: 400, body: 'Missing or invalid uploadedBy email' };
  }

  const mediaType: MediaType = ALLOWED_CONTENT_TYPES[contentType].mediaType;

  try {
    const container = await getMediaContainer();
    const blockBlobClient = container.getBlockBlobClient(blobPath);
    const uploaded = await blockBlobClient.exists();
    if (!uploaded) {
      return { status: 409, body: 'Blob has not finished uploading yet' };
    }

    const now = new Date().toISOString();
    // capturedAt comes from the client's clock and isn't validated on the
    // way in - fall back to the server time if it's missing or doesn't
    // parse as a real date, rather than storing/returning a value that
    // could break date sorting/parsing downstream.
    const capturedAtValid = capturedAt !== undefined && !Number.isNaN(new Date(capturedAt).getTime());
    // Thumbnail is best-effort (see photos.ts) - no exists() check here
    // (unlike the main blob above) since a missing/failed thumbnail just
    // means the frontend falls back to blobUrl, not a broken post.
    const thumbBlobClient = thumbBlobPath ? container.getBlockBlobClient(thumbBlobPath) : undefined;
    const entity: MediaEntity = {
      partitionKey: mediaPartitionKey(),
      rowKey: generateMediaRowKey(),
      mediaType,
      blobPath,
      blobUrl: blockBlobClient.url,
      contentType,
      capturedAt: capturedAtValid ? capturedAt! : now,
      uploadedAt: now,
      uploadedBy: normalizedUploadedBy,
      ...(lat !== undefined && lon !== undefined ? { lat, lon } : {}),
      ...(thumbBlobClient ? { thumbBlobPath, thumbUrl: thumbBlobClient.url } : {}),
    };

    const table = await getMediaTable();
    await table.createEntity(entity);

    return { status: 201, jsonBody: { id: entity.rowKey } };
  } catch (error) {
    context.error('Failed to record uploaded media', error);
    return { status: 500, body: 'Failed to record uploaded media' };
  }
}

app.http('mediaComplete', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'media/complete',
  handler: mediaComplete,
});
