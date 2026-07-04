import { STOPS } from './stops';

// One distinct color per day of the rallye, in chronological order.
// Chosen to stay readable on both the map (satellite/road tiles) and the
// light itinerary cards, and to stay visually distinct from the category
// colors used elsewhere (CATEGORIES in stops.ts).
export const DAY_COLORS: string[] = [
  '#c8102e', // day 1 - rally red
  '#0ea5e9', // day 2 - sky blue
  '#eab308', // day 3 - amber/gold
  '#16a34a', // day 4 - green
  '#9333ea', // day 5 - purple
  '#f97316', // day 6 - orange
  '#0d9488', // day 7 - teal
  '#e11d48', // day 8 - rose
  '#4f46e5', // day 9 - indigo
];

// Ordered list of unique dates as they first appear in STOPS (chronological,
// since stops.ts is already in day order).
export const DAYS: string[] = (() => {
  const seen: string[] = [];
  for (const stop of STOPS) {
    if (stop.date && !seen.includes(stop.date)) seen.push(stop.date);
  }
  return seen;
})();

export function getDayIndex(date: string | undefined): number {
  if (!date) return 0;
  const idx = DAYS.indexOf(date);
  return idx === -1 ? 0 : idx;
}

export function getDayColor(date: string | undefined): string {
  const idx = getDayIndex(date);
  return DAY_COLORS[idx % DAY_COLORS.length];
}
