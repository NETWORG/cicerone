import { TableClient, RestError } from '@azure/data-tables';

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

  try {
    await client.createTable();
  } catch (error) {
    // The table is created once and then reused by every subsequent cold
    // start / instance, so "already exists" is the expected steady state,
    // not a failure - only rethrow genuinely unexpected errors.
    const isAlreadyExists =
      error instanceof RestError && (error.statusCode === 409 || error.code === 'TableAlreadyExists');
    if (!isAlreadyExists) throw error;
  }

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

