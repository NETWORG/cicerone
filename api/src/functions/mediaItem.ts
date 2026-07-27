import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import type { TableEntity } from '@azure/data-tables';
import { checkMediaUploadToken } from '../mediaAuth';
import { normalizeUploaderEmail } from '../mediaEmail';
import { getMediaTable, mediaPartitionKey, type MediaEntity } from '../mediaTable';
import { getMediaContainer } from '../mediaBlob';

interface PatchBody {
  email?: string;
  lat?: number;
  lon?: number;
  capturedAt?: string;
}

/**
 * Point-reads the target post and confirms the caller both has the shared
 * upload token (in the query string, checked the same way as the other
 * write endpoints) and matches the post's self-reported `uploadedBy`.
 * Neither check is real auth, but together they stop a random visitor
 * (no token) or a different crew member (mismatched email) from touching
 * someone else's post. Returns the entity on success, or the
 * HttpResponseInit to return immediately on failure.
 */
type OwnedEntityResult =
  | { ok: true; table: Awaited<ReturnType<typeof getMediaTable>>; entity: MediaEntity }
  | { ok: false; response: HttpResponseInit };

async function loadOwnedEntity(
  request: HttpRequest,
  context: InvocationContext,
  id: string,
): Promise<OwnedEntityResult> {
  if (!checkMediaUploadToken(request, context)) {
    return { ok: false, response: { status: 401, body: 'Invalid or missing token' } };
  }

  const email = normalizeUploaderEmail(request.query.get('email'));
  if (!email) {
    return { ok: false, response: { status: 400, body: 'Missing or invalid email query parameter' } };
  }

  const table = await getMediaTable();
  let entity: MediaEntity;
  try {
    entity = await table.getEntity<MediaEntity>(mediaPartitionKey(), id);
  } catch {
    return { ok: false, response: { status: 404, body: 'Post not found' } };
  }

  if (entity.uploadedBy !== email) {
    return { ok: false, response: { status: 403, body: 'This post was uploaded by a different email' } };
  }

  return { ok: true, table, entity };
}

/**
 * DELETE /api/media/{id} - removes both the blob and the metadata row.
 */
export async function mediaItemDelete(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return { status: 400, body: 'Missing id' };

  const loaded = await loadOwnedEntity(request, context, id);
  if (!loaded.ok) return loaded.response;
  const { table, entity } = loaded;

  try {
    const container = await getMediaContainer();
    await container.getBlockBlobClient(entity.blobPath).deleteIfExists();
    if (entity.thumbBlobPath) {
      await container.getBlockBlobClient(entity.thumbBlobPath).deleteIfExists();
    }
    if (entity.displayBlobPath) {
      await container.getBlockBlobClient(entity.displayBlobPath).deleteIfExists();
    }
    await table.deleteEntity(mediaPartitionKey(), id);
    return { status: 204 };
  } catch (error) {
    context.error('Failed to delete media post', error);
    return { status: 500, body: 'Failed to delete media post' };
  }
}

/**
 * PATCH /api/media/{id} - lets the uploader correct the location and/or
 * captured date after the fact. Only the fields present in the body are
 * changed (Table Storage "Merge" update).
 */
export async function mediaItemPatch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.params.id;
  if (!id) return { status: 400, body: 'Missing id' };

  const loaded = await loadOwnedEntity(request, context, id);
  if (!loaded.ok) return loaded.response;
  const { table, entity } = loaded;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return { status: 400, body: 'Expected a JSON body' };
  }

  const { lat, lon, capturedAt } = body;
  const update: TableEntity<Partial<MediaEntity>> = {
    partitionKey: entity.partitionKey,
    rowKey: entity.rowKey,
  };

  if (lat !== undefined || lon !== undefined) {
    if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      return { status: 400, body: 'lat must be a finite number between -90 and 90' };
    }
    if (typeof lon !== 'number' || !Number.isFinite(lon) || lon < -180 || lon > 180) {
      return { status: 400, body: 'lon must be a finite number between -180 and 180' };
    }
    update.lat = lat;
    update.lon = lon;
  }

  if (capturedAt !== undefined) {
    if (Number.isNaN(new Date(capturedAt).getTime())) {
      return { status: 400, body: 'capturedAt must be a valid date' };
    }
    update.capturedAt = capturedAt;
  }

  if (Object.keys(update).length <= 2) {
    return { status: 400, body: 'Nothing to update - provide lat+lon and/or capturedAt' };
  }

  try {
    await table.updateEntity(update, 'Merge');
    return { status: 204 };
  } catch (error) {
    context.error('Failed to update media post', error);
    return { status: 500, body: 'Failed to update media post' };
  }
}

app.http('mediaItemDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'media/{id}',
  handler: mediaItemDelete,
});

app.http('mediaItemPatch', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'media/{id}',
  handler: mediaItemPatch,
});
