import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { checkMediaUploadToken } from '../mediaAuth';
import { ALLOWED_CONTENT_TYPES } from '../mediaTypes';
import { getMediaContainer } from '../mediaBlob';
import { getMediaTable, mediaPartitionKey, type MediaEntity, type MediaType } from '../mediaTable';

// Matches the shape produced by generateMediaBlobPath() in mediaBlob.ts,
// e.g. "2026-07-20/photo-<uuid>.jpg". Rejecting anything else stops a
// crafted blobPath from pointing outside the expected layout.
const BLOB_PATH_PATTERN = /^\d{4}-\d{2}-\d{2}\/(photo|video)-[0-9a-f-]{36}\.[a-z0-9]+$/;

interface CompleteBody {
  blobPath?: string;
  contentType?: string;
  lat?: number;
  lon?: number;
  capturedAt?: string;
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

  const { blobPath, contentType, lat, lon, capturedAt } = body;

  if (!blobPath || !BLOB_PATH_PATTERN.test(blobPath)) {
    return { status: 400, body: 'Missing or invalid blobPath' };
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

  const mediaType: MediaType = ALLOWED_CONTENT_TYPES[contentType].mediaType;

  try {
    const container = await getMediaContainer();
    const blockBlobClient = container.getBlockBlobClient(blobPath);
    const uploaded = await blockBlobClient.exists();
    if (!uploaded) {
      return { status: 409, body: 'Blob has not finished uploading yet' };
    }

    const now = new Date().toISOString();
    const entity: MediaEntity = {
      partitionKey: mediaPartitionKey(),
      rowKey: crypto.randomUUID(),
      mediaType,
      blobPath,
      blobUrl: blockBlobClient.url,
      contentType,
      capturedAt: capturedAt ?? now,
      uploadedAt: now,
      ...(lat !== undefined && lon !== undefined ? { lat, lon } : {}),
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
