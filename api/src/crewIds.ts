/**
 * Valid crew ids allowed to post/read live locations.
 *
 * Keep this in sync with the `id` field of each crew in `src/data/crews.ts`
 * at the repo root. Duplicated here (rather than imported) because the
 * `api/` project builds independently from the frontend.
 */
export const VALID_CREW_IDS: ReadonlySet<string> = new Set([
  'crew-e30-polaris',
  'crew-megane',
  'crew-eos',
  'crew-ereso',
]);
