import { TableClient } from '@azure/data-tables';

const TABLE_NAME = 'positions';
const PARTITION_KEY = 'crew';

let cachedClient: TableClient | undefined;

/**
 * Lazily creates (and caches) the Table Storage client for the `positions`
 * table, creating the table on first use if it doesn't exist yet.
 */
export async function getPositionsTable(): Promise<TableClient> {
  if (cachedClient) return cachedClient;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING app setting is not configured');
  }

  const client = TableClient.fromConnectionString(connectionString, TABLE_NAME, {
    allowInsecureConnection: connectionString.includes('UseDevelopmentStorage=true'),
  });
  await client.createTable();
  cachedClient = client;
  return client;
}

export interface PositionEntity {
  partitionKey: string;
  rowKey: string;
  lat: number;
  lon: number;
  timestamp: number;
  updatedAt: string;
}

export function positionPartitionKey(): string {
  return PARTITION_KEY;
}
