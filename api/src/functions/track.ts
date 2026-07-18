import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { VALID_CREW_IDS } from '../crewIds';
import { getPositionsTable, positionPartitionKey } from '../positionsTable';

/**
 * Receiver endpoint for Traccar Client's location reporting protocol.
 *
 * Traccar Client is configured with:
 *   Server URL: https://cicerallye.com/api/track?token=<shared secret>
 *   Device Identifier: <crew id, e.g. crew-e30-polaris>
 *
 * Traccar Client >= 9.0.0 posts a JSON body shaped like:
 *   {
 *     "location": {
 *       "timestamp": "2000-01-01T00:00:00.000Z",
 *       "coords": { "latitude": 0.0, "longitude": 0.0, ... }
 *     },
 *     "device_id": "crew-e30-polaris"
 *   }
 * Older versions (and the original OsmAnd app) instead send `id`/`lat`/
 * `lon`/`timestamp` as query params or a form-urlencoded body. We support
 * both so this keeps working regardless of the crew's installed app
 * version.
 *
 * The shared secret (`?token=` on the Server URL) is passed through
 * unchanged in both cases since it's part of the URL query string, not
 * the body.
 *
 * We validate the id against the known crew list, require a shared secret
 * (TRACK_SHARED_SECRET app setting) so a leaked/guessed crew id alone can't
 * be used to spoof a position, and upsert the latest position into the
 * `positions` Table Storage table.
 */
export async function track(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  let id: string | null = null;
  let latRaw: string | null = null;
  let lonRaw: string | null = null;
  let timestampRaw: string | null = null;

  const contentType = request.headers.get('content-type') ?? '';
  if (request.method === 'POST' && contentType.includes('application/json')) {
    try {
      const json = (await request.json()) as {
        device_id?: string;
        location?: { timestamp?: string; coords?: { latitude?: number; longitude?: number } };
      };
      id = json.device_id ?? null;
      latRaw = json.location?.coords?.latitude != null ? String(json.location.coords.latitude) : null;
      lonRaw = json.location?.coords?.longitude != null ? String(json.location.coords.longitude) : null;
      timestampRaw = json.location?.timestamp
        ? String(Math.floor(new Date(json.location.timestamp).getTime() / 1000))
        : null;
    } catch (error) {
      context.warn('Failed to parse JSON body from Traccar Client', error);
    }
  } else {
    // Legacy OsmAnd query/form format: params may be in the query string,
    // a form-urlencoded body, or both - merge them, query string wins.
    const params = new URLSearchParams();
    if (request.method === 'POST') {
      try {
        const bodyText = await request.text();
        for (const [key, value] of new URLSearchParams(bodyText)) {
          params.set(key, value);
        }
      } catch {
        // No/unreadable body - fine, fall back to query params below.
      }
    }
    for (const [key, value] of request.query) {
      params.set(key, value);
    }
    id = params.get('id') ?? params.get('deviceid');
    latRaw = params.get('lat');
    lonRaw = params.get('lon');
    timestampRaw = params.get('timestamp');
  }

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
