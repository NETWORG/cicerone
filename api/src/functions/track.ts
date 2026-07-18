import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { VALID_CREW_IDS } from '../crewIds';
import { getPositionsTable, positionPartitionKey } from '../positionsTable';

/**
 * Receiver endpoint for Traccar Client's "OsmAnd" HTTP reporting protocol.
 *
 * Traccar Client is configured with:
 *   Server URL: https://cicerallye.com/api/track?token=<shared secret>
 *   Device Identifier: <crew id, e.g. crew-e30-polaris>
 *
 * It periodically issues (Traccar Client uses POST for this, but all
 * parameters are still sent as URL query params rather than a body, so we
 * accept both GET and POST identically):
 *   POST /api/track?id=crew-e30-polaris&lat=49.1234&lon=16.5678&timestamp=1717000000&token=...
 *
 * We validate the id against the known crew list, require a shared secret
 * (TRACK_SHARED_SECRET app setting) so a leaked/guessed crew id alone can't
 * be used to spoof a position, and upsert the latest position into the
 * `positions` Table Storage table.
 */
export async function track(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.query.get('id');
  const latRaw = request.query.get('lat');
  const lonRaw = request.query.get('lon');
  const timestampRaw = request.query.get('timestamp');
  const token = request.query.get('token');

  const expectedToken = process.env.TRACK_SHARED_SECRET;
  if (expectedToken) {
    if (token !== expectedToken) {
      context.warn(`Rejected position update for crew id "${id}": missing/invalid token`);
      return { status: 401, body: 'Invalid or missing token' };
    }
  } else {
    // No secret configured (e.g. local dev without local.settings.json
    // filled in) - allow the request through but make it loud in the logs
    // so a missing production app setting doesn't fail silently.
    context.warn('TRACK_SHARED_SECRET is not configured - accepting request without auth');
  }

  if (!id || !latRaw || !lonRaw) {
    return { status: 400, body: 'Missing required query params: id, lat, lon' };
  }

  if (!VALID_CREW_IDS.has(id)) {
    context.warn(`Rejected position update for unknown crew id: ${id}`);
    return { status: 403, body: 'Unknown crew id' };
  }

  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { status: 400, body: 'lat/lon must be numeric' };
  }

  const timestamp = timestampRaw ? Number(timestampRaw) : Math.floor(Date.now() / 1000);

  try {
    const table = await getPositionsTable();
    await table.upsertEntity(
      {
        partitionKey: positionPartitionKey(),
        rowKey: id,
        lat,
        lon,
        timestamp: Number.isFinite(timestamp) ? timestamp : Math.floor(Date.now() / 1000),
        updatedAt: new Date().toISOString(),
      },
      'Replace',
    );
  } catch (error) {
    context.error('Failed to store position', error);
    return { status: 500, body: 'Failed to store position' };
  }

  // OsmAnd protocol expects a plain 200 OK with no particular body.
  return { status: 200, body: 'OK' };
}

app.http('track', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  route: 'track',
  handler: track,
});
