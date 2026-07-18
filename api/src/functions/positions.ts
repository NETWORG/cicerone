import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { getPositionsTable, positionPartitionKey, type PositionEntity } from '../positionsTable';

const STALE_AFTER_MS = 15 * 60 * 1000; // 15 minutes

export interface CrewPosition {
  crewId: string;
  lat: number;
  lon: number;
  timestamp: number;
  updatedAt: string;
  stale: boolean;
}

/**
 * Returns the latest known position for every crew that has reported at
 * least once. Consumed by the frontend via polling (Table Storage has no
 * push/realtime subscription, so a short poll interval, e.g. 5-10s, is used
 * client-side instead).
 */
export async function positions(_request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const table = await getPositionsTable();
    const now = Date.now();
    const results: CrewPosition[] = [];

    const entities = table.listEntities<PositionEntity>({
      queryOptions: { filter: `PartitionKey eq '${positionPartitionKey()}'` },
    });

    for await (const entity of entities) {
      const updatedAtMs = new Date(entity.updatedAt).getTime();
      results.push({
        crewId: entity.rowKey,
        lat: entity.lat,
        lon: entity.lon,
        timestamp: entity.timestamp,
        updatedAt: entity.updatedAt,
        stale: !Number.isFinite(updatedAtMs) || now - updatedAtMs > STALE_AFTER_MS,
      });
    }

    return {
      status: 200,
      jsonBody: results,
      headers: { 'Cache-Control': 'no-store' },
    };
  } catch (error) {
    context.error('Failed to read positions', error);
    return { status: 500, body: 'Failed to read positions' };
  }
}

app.http('positions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'positions',
  handler: positions,
});
