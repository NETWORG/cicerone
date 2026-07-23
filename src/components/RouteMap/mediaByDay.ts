import type { MediaPost } from '../../hooks/useMediaPosts';

/**
 * Posts captured on the given day. Matches `capturedAt`'s UTC date portion
 * (YYYY-MM-DD) against `date` - using the UTC slice rather than the
 * viewer's local timezone keeps the grouping consistent regardless of who's
 * looking at the page, and matches how `DAY_STATS`/`STOPS` dates are
 * already plain `YYYY-MM-DD` strings.
 */
export function postsForDay(posts: readonly MediaPost[], date: string): MediaPost[] {
  return posts.filter((post) => post.capturedAt.slice(0, 10) === date);
}
