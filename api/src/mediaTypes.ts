import type { MediaType } from './mediaTable';

/**
 * Allow-listed upload content-types, mapped to the media kind + file
 * extension used when generating the blob path. Keeps validation and
 * naming in one place for the SAS-issuing and completion endpoints.
 */
export const ALLOWED_CONTENT_TYPES: Record<string, { mediaType: MediaType; extension: string }> = {
  'image/jpeg': { mediaType: 'photo', extension: 'jpg' },
  'image/png': { mediaType: 'photo', extension: 'png' },
  'image/webp': { mediaType: 'photo', extension: 'webp' },
  'image/heic': { mediaType: 'photo', extension: 'heic' },
  'video/mp4': { mediaType: 'video', extension: 'mp4' },
  'video/quicktime': { mediaType: 'video', extension: 'mov' },
  'video/webm': { mediaType: 'video', extension: 'webm' },
};
