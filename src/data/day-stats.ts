import { STOPS } from './stops';
import { DAYS, getDayIndex } from './day-colors';

export interface DayStat {
  date: string;
  dayIndex: number;
  distanceKm: number;
  durationMin: number;
  /** True when any leg contributing to this day's totals is an estimate. */
  estimated: boolean;
}

// Sums each stop's `driveFromPrevious` leg by arrival date. A day's first
// stop's leg is the overnight drive from the previous day's last stop, so
// grouping by `date` (rather than by day boundaries in STOPS order) already
// attributes it to the correct day - no need to touch route-segments.ts or
// call the Directions API.
export const DAY_STATS: DayStat[] = DAYS.map((date) => {
  const legs = STOPS.filter((stop) => stop.date === date && stop.driveFromPrevious).map(
    (stop) => stop.driveFromPrevious!
  );
  return {
    date,
    dayIndex: getDayIndex(date),
    distanceKm: legs.reduce((sum, leg) => sum + leg.distanceKm, 0),
    durationMin: legs.reduce((sum, leg) => sum + leg.durationMin, 0),
    estimated: legs.some((leg) => leg.estimated),
  };
});
