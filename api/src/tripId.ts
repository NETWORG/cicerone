/**
 * The site is built to host more than one trip over time - each is an
 * "edition" in `src/data/editions.ts` on the frontend (e.g.
 * `transalpine-2026`, `gumbalkan-2025`), with exactly one marked active.
 *
 * The `api/` project is deployed as its own Azure Functions app (only
 * `api/` is packaged - see the repo's build/deploy config), so it can't
 * import `src/data/editions.ts` directly. Instead, the current trip id is
 * configured here via an app setting, with a fallback default.
 *
 * IMPORTANT: whoever starts a new trip must update BOTH
 * `src/data/editions.ts` (flip `active` to the new edition) AND either
 * the `CURRENT_TRIP_ID` app setting or the fallback default below - there
 * is no automated link between the two.
 */
const FALLBACK_TRIP_ID = 'transalpine-2026';

export function getCurrentTripId(): string {
  return process.env.CURRENT_TRIP_ID || FALLBACK_TRIP_ID;
}
