import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { checkMediaUploadToken } from '../mediaAuth';
import { ALLOWED_CONTENT_TYPES } from '../mediaTypes';
import { createUploadSasUrl, generateMediaBlobPath, MAX_UPLOAD_BYTES } from '../mediaBlob';

/**
 * Step 1 of the upload flow: issue a short-lived, single-blob, write-only
 * SAS URL. The phone then PUTs the file bytes directly to Blob Storage
 * using that URL (see /photos), and finally calls /api/media/complete.
 * File bytes never pass through this (or any) Function, which is what
 * keeps uploads cheap even for video on a Consumption plan.
 */
export async function mediaSas(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (!checkMediaUploadToken(request, context)) {
    return { status: 401, body: 'Invalid or missing token' };
  }

  let contentType: string | undefined;
  try {
    const body = (await request.json()) as { contentType?: string };
    contentType = body.contentType;
  } catch {
    return { status: 400, body: 'Expected a JSON body with a "contentType" field' };
  }

  if (!contentType || !(contentType in ALLOWED_CONTENT_TYPES)) {
    return { status: 400, body: `Unsupported contentType. Allowed: ${Object.keys(ALLOWED_CONTENT_TYPES).join(', ')}` };
  }

  const { mediaType, extension } = ALLOWED_CONTENT_TYPES[contentType];
  const blobPath = generateMediaBlobPath(mediaType, extension);

  try {
    const { uploadUrl, blobUrl, expiresOn } = await createUploadSasUrl(blobPath, contentType);
    return {
      status: 200,
      jsonBody: { uploadUrl, blobUrl, blobPath, mediaType, maxUploadBytes: MAX_UPLOAD_BYTES, expiresOn },
      headers: { 'Cache-Control': 'no-store' },
    };
  } catch (error) {
    context.error('Failed to generate upload SAS URL', error);
    return { status: 500, body: 'Failed to prepare upload' };
  }
}

app.http('mediaSas', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'media/sas',
  handler: mediaSas,
});
