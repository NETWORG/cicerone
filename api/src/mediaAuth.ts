import { HttpRequest, InvocationContext } from '@azure/functions';

/**
 * Shared upload-side auth for the media endpoints. Deliberately a single
 * shared secret (not per-crew, per the "we don't need per-post
 * attribution" decision) checked the same way `TRACK_SHARED_SECRET` is
 * checked in track.ts.
 */
export function checkMediaUploadToken(request: HttpRequest, context: InvocationContext): boolean {
  const token = request.query.get('token');
  const expectedToken = process.env.MEDIA_UPLOAD_SHARED_SECRET;

  if (!expectedToken) {
    // Unlike track.ts (read/write of a low-value position ping), these are
    // write endpoints that put arbitrary files in Blob Storage - fail
    // closed if the secret isn't configured rather than leaving the
    // endpoints publicly writable.
    context.error('MEDIA_UPLOAD_SHARED_SECRET is not configured - rejecting request');
    return false;
  }

  if (token !== expectedToken) {
    context.warn('Rejected media upload request: missing/invalid token');
    return false;
  }

  return true;
}
