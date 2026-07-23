import { TableClient, RestError } from '@azure/data-tables';
import { getCurrentTripId } from './tripId';

const TABLE_NAME = 'mediaPosts';

let cachedClient: TableClient | undefined;

/**
 * Lazily creates (and caches) the Table Storage client for the `mediaPosts`
 * table, creating the table on first use if it doesn't exist yet. Mirrors
 * `getPositionsTable()` in positionsTable.ts.
 */
export async function getMediaTable(): Promise<TableClient> {
  if (cachedClient) return cachedClient;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING app setting is not configured');
  }

  const client = TableClient.fromConnectionString(connectionString, TABLE_NAME, {
    allowInsecureConnection: connectionString.includes('UseDevelopmentStorage=true'),
  });

  try {
    await client.createTable();
  } catch (error) {
    const isAlreadyExists =
      error instanceof RestError && (error.statusCode === 409 || error.code === 'TableAlreadyExists');
    if (!isAlreadyExists) throw error;
  }

  cachedClient = client;
  return client;
}

export type MediaType = 'photo' | 'video';

export interface MediaEntity {
  partitionKey: string;
  rowKey: string;
  mediaType: MediaType;
  blobPath: string;
  blobUrl: string;
  contentType: string;
  lat?: number;
  lon?: number;
  capturedAt: string;
  uploadedAt: string;
  // Self-reported (not verified) for now - the uploader types an email
  // into /photos once and it's remembered in localStorage. Deliberately
  // the same field name/shape we'd want once real sign-in exists, so that
  // migration only has to change *where* this value comes from, not the
  // schema.
  uploadedBy?: string;
  // Small client-generated JPEG (see photos.ts) so map pins/clusters don't
  // have to download the full-size original just to show a ~40px pin.
  // Optional because generation is best-effort (e.g. HEIC decode failure
  // in some browsers) - falls back to blobUrl on the frontend when absent.
  thumbBlobPath?: string;
  thumbUrl?: string;
}

export function mediaPartitionKey(): string {
  // Scopes every read/write to the current trip - see tripId.ts. Table
  // Storage partitions data by this key, so different trips' posts never
  // mix and per-trip listing stays cheap (single-partition queries).
  return getCurrentTripId();
}

// RowKeys within a partition are returned by Table Storage in ascending
// order. Encoding an inverted timestamp as the prefix means the *newest*
// post always sorts first, so `/api/media` can just take the first N rows
// as they stream in instead of listing the whole partition and sorting in
// memory (see media.ts). The uuid suffix keeps rowkeys unique even if two
// uploads land in the same millisecond.
const MAX_TIMESTAMP = 9999999999999; // year 2286, comfortably past any real capture

export function generateMediaRowKey(): string {
  const inverted = (MAX_TIMESTAMP - Date.now()).toString().padStart(13, '0');
  return `${inverted}-${crypto.randomUUID()}`;
}
