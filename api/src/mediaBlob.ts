import { BlobServiceClient, ContainerClient, BlobSASPermissions } from '@azure/storage-blob';
import type { MediaType } from './mediaTable';

const CONTAINER_NAME = 'media';

// Short-lived on purpose: the SAS is only meant to cover the time between
// requesting it and finishing the direct-to-blob upload from the phone.
const SAS_EXPIRY_MINUTES = 20;

// Generous enough for a few minutes of phone-shot video while still
// bounding worst-case storage/egress cost for an unmoderated public link.
export const MAX_UPLOAD_BYTES = 75 * 1024 * 1024;

let cachedContainer: ContainerClient | undefined;

/**
 * Lazily creates (and caches) the Blob Storage container used for
 * uploaded photos/videos, creating it on first use if it doesn't exist
 * yet. Uses `access: 'blob'` (anonymous *read* on individual blobs, no
 * container listing) so the frontend can render/play media directly from
 * its blob URL without any Function in the read path.
 */
export async function getMediaContainer(): Promise<ContainerClient> {
  if (cachedContainer) return cachedContainer;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING app setting is not configured');
  }

  const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
  const container = serviceClient.getContainerClient(CONTAINER_NAME);

  try {
    await container.createIfNotExists({ access: 'blob' });
  } catch (error) {
    // Azurite (local dev) doesn't support anonymous access levels the same
    // way the real service does - fall back to a private container locally
    // rather than failing the whole request.
    if (!connectionString.includes('UseDevelopmentStorage=true')) throw error;
    await container.createIfNotExists();
  }

  cachedContainer = container;
  return container;
}

export function generateMediaBlobPath(mediaType: MediaType, extension: string): string {
  const day = new Date().toISOString().slice(0, 10);
  const id = crypto.randomUUID();
  return `${day}/${mediaType}-${id}.${extension}`;
}

/**
 * Issues a short-lived, single-blob, write-only SAS URL. The caller (a
 * phone in the field) PUTs the file bytes directly to Blob Storage using
 * this URL - the file never passes through Function compute, which is
 * what keeps this cheap even for video.
 */
export async function createUploadSasUrl(
  blobPath: string,
  contentType: string,
): Promise<{ uploadUrl: string; blobUrl: string; expiresOn: string }> {
  const container = await getMediaContainer();
  const blockBlobClient = container.getBlockBlobClient(blobPath);
  const expiresOn = new Date(Date.now() + SAS_EXPIRY_MINUTES * 60 * 1000);

  const uploadUrl = await blockBlobClient.generateSasUrl({
    // Create + write only - no read/delete/list, so a leaked upload URL
    // can't be used to overwrite other posts or enumerate the container.
    permissions: BlobSASPermissions.parse('cw'),
    expiresOn,
    contentType,
  });

  return { uploadUrl, blobUrl: blockBlobClient.url, expiresOn: expiresOn.toISOString() };
}
