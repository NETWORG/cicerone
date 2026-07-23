// Deliberately light-touch validation - just enough to reject obviously
// malformed input (matches the leniency style used for lat/lon elsewhere
// in this feature). This is a self-reported identifier, not a verified
// account, so there's no point being stricter than "looks like an email".
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes (trim + lowercase) and validates a self-reported uploader
 * email. Returns the normalized value, or null if it doesn't look like an
 * email at all.
 */
export function normalizeUploaderEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(trimmed)) return null;
  return trimmed;
}
