import { TableClient, RestError } from '@azure/data-tables';

const TABLE_NAME = 'mediaPosts';
const PARTITION_KEY = 'post';

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
}

export function mediaPartitionKey(): string {
  return PARTITION_KEY;
}
