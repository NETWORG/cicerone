import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { VALID_CREW_IDS } from '../crewIds';
import { getPositionsTable, positionPartitionKey } from '../positionsTable';

/**
 * Receiver endpoint for Traccar Client's "OsmAnd" HTTP reporting protocol.
 *
 * Traccar Client is configured with:
 *   Server URL: https://cicerallye.com/api/track
 *   Device Identifier: <crew id, e.g. crew-e30>
 *
 * It periodically issues:
 *   GET /api/track?id=crew-e30&lat=49.1234&lon=16.5678&timestamp=1717000000
 *
 * We validate the id against the known crew list and upsert the latest
 * position into the `positions` Table Storage table.
 */
export async function track(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const id = request.query.get('id');
  const latRaw = request.query.get('lat');
  const lonRaw = request.query.get('lon');
  const timestampRaw = request.query.get('timestamp');

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
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'track',
  handler: track,
});
