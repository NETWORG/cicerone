import type { MediaPost } from '../../hooks/useMediaPosts';

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

/**
 * `DAY_STATS`/`STOPS` dates are human-readable strings like
 * "Sat, 18 Jul 2026" (shared with `fitToDay`, which matches them against
 * `STOPS` as-is), not `YYYY-MM-DD`. Convert by regex instead of
 * `new Date(...).toISOString()` to avoid a timezone-shift-by-a-day bug -
 * `Date` parses the string as local midnight, and `toISOString()` converts
 * to UTC, which can roll the date backward/forward depending on the
 * viewer's offset.
 */
function toIsoDate(humanDate: string): string {
  const match = humanDate.match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return humanDate; // already ISO or unrecognized - use as-is
  const [, day, mon, year] = match;
  return `${year}-${MONTHS[mon] ?? '01'}-${day.padStart(2, '0')}`;
}

/**
 * Posts captured on the given day. Matches `capturedAt`'s UTC date portion
 * (YYYY-MM-DD) against `date` - using the UTC slice rather than the
 * viewer's local timezone keeps the grouping consistent regardless of who's
 * looking at the page.
 */
export function postsForDay(posts: readonly MediaPost[], date: string): MediaPost[] {
  const target = toIsoDate(date);
  return posts.filter((post) => post.capturedAt.slice(0, 10) === target);
}
