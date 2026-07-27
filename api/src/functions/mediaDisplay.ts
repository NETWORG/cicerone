import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import sharp from 'sharp';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';
import { getMediaContainer, generateDisplayBlobPath } from '../mediaBlob';

// Originals already at or below this size aren't worth recompressing -
// re-encoding a small JPEG a second time only costs quality for little to
// no byte savings, so we just point `displayUrl` at the original instead.
const SKIP_RECOMPRESSION_BELOW_BYTES = 600 * 1024;

// Long-edge cap and JPEG quality for the generated "display" copy. Chosen
// to look essentially unchanged on a phone/laptop screen while cutting a
// typical 12MP+ camera photo down to a few hundred KB.
const MAX_EDGE = 1920;
const JPEG_QUALITY = 82;

/**
 * GET /api/media/{id}/display
 *
 * Lazily generates (once) and thereafter serves a cached, mid-size JPEG
 * copy of a photo post, so opening it in the viewer doesn't require
 * downloading the full-resolution original. The original blob is never
 * modified - this only ever adds a second, smaller blob alongside it.
 *
 * First caller for a given post pays the one-time cost of a resize; every
 * caller after that (including this same post being returned by /api/media
 * once displayUrl is persisted) is a plain, free blob read. This also
 * means posts uploaded *before* this endpoint existed get a display copy
 * automatically the first time anyone opens them - no backfill needed.
 *
 * Public/anonymous, same exposure level as GET /api/media - this only
 * reads/derives from data that's already publicly viewable via blobUrl.
 *
 * Note on data flow: this endpoint's HTTP response is always just a small
 * JSON `{ displayUrl }` payload, never image bytes - the browser's <img>
 * tag then fetches those bytes directly from Blob Storage, same as
 * blobUrl/thumbUrl. Only the one-time resize (below) reads the original
 * and writes the resized copy through this Function's own memory - that's
 * unavoidable since `sharp` needs the pixels to resize them - but it never
 * touches the requesting client's connection either way.
 */
export async function mediaDisplay(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return { status: 400, body: 'Missing id' };

  const table = await getMediaTable();
  let entity: MediaEntity;
  try {
    entity = await table.getEntity<MediaEntity>(mediaPartitionKey(), id);
  } catch {
    return { status: 404, body: 'Post not found' };
  }

  // Already generated (or already aliased to the original) - fast path,
  // no blob reads, no image processing.
  if (entity.displayUrl) {
    return { status: 200, jsonBody: { displayUrl: entity.displayUrl }, headers: { 'Cache-Control': 'no-store' } };
  }

  // Videos aren't resized here (see plan notes - re-encoding video is out
  // of scope for now) - the frontend should just keep using blobUrl.
  if (entity.mediaType !== 'photo') {
    return { status: 200, jsonBody: { displayUrl: entity.blobUrl }, headers: { 'Cache-Control': 'no-store' } };
  }

  try {
    const container = await getMediaContainer();
    const originalBlob = container.getBlockBlobClient(entity.blobPath);

    const properties = await originalBlob.getProperties();
    if ((properties.contentLength ?? Infinity) <= SKIP_RECOMPRESSION_BELOW_BYTES) {
      await table.updateEntity<Partial<MediaEntity>>(
        { partitionKey: entity.partitionKey, rowKey: entity.rowKey, displayUrl: entity.blobUrl },
        'Merge',
      );
      return { status: 200, jsonBody: { displayUrl: entity.blobUrl }, headers: { 'Cache-Control': 'no-store' } };
    }

    const original = await originalBlob.downloadToBuffer();
    // rotate() with no args applies the EXIF orientation tag (if any) then
    // strips it, so the resized copy displays right-side-up everywhere,
    // including viewers that ignore EXIF orientation. withoutEnlargement
    // guards against upscaling smaller-than-MAX_EDGE originals.
    const resized = await sharp(original)
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY })
      .toBuffer();

    const displayBlobPath = generateDisplayBlobPath();
    const displayBlob = container.getBlockBlobClient(displayBlobPath);
    await displayBlob.upload(resized, resized.length, {
      blobHTTPHeaders: { blobContentType: 'image/jpeg' },
    });

    const displayUrl = displayBlob.url;
    await table.updateEntity<Partial<MediaEntity>>(
      { partitionKey: entity.partitionKey, rowKey: entity.rowKey, displayBlobPath, displayUrl },
      'Merge',
    );

    return { status: 200, jsonBody: { displayUrl }, headers: { 'Cache-Control': 'no-store' } };
  } catch (error) {
    // Best-effort, same philosophy as client-side thumbnail generation -
    // e.g. a HEIC original that this sharp build can't decode. Never fail
    // the view over it, just fall back to the full-size original.
    context.warn('Falling back to blobUrl - display generation failed for ' + id, error);

    // Persist the fallback too (aliasing displayUrl to blobUrl), same as
    // the "already small enough" path above. Without this, a permanently
    // unsupported original (e.g. HEIC) would retry the expensive resize -
    // and lose to a full sharp() decode attempt - on every single view.
    try {
      await table.updateEntity<Partial<MediaEntity>>(
        { partitionKey: entity.partitionKey, rowKey: entity.rowKey, displayUrl: entity.blobUrl },
        'Merge',
      );
    } catch (persistError) {
      context.warn('Failed to persist blobUrl fallback for ' + id, persistError);
    }

    return { status: 200, jsonBody: { displayUrl: entity.blobUrl }, headers: { 'Cache-Control': 'no-store' } };
  }
}

app.http('mediaDisplay', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'media/{id}/display',
  handler: mediaDisplay,
});
