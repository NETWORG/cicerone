import { STOPS } from './stops';
import { DAYS, getDayIndex } from './day-colors';

export interface DayStat {
  date: string;
  dayIndex: number;
  distanceKm: number;
  durationMin: number;
  /** True when any leg contributing to this day's totals is an estimate. */
  estimated: boolean;
  /** Overrides the "Rest day" fallback label for zero-drive days that
   *  aren't actually a rest (e.g. a spectating day). */
  restDayLabel?: string;
}

// Sums each stop's `driveFromPrevious` leg by arrival date. A day's first
// stop's leg is the overnight drive from the previous day's last stop, so
// grouping by `date` (rather than by day boundaries in STOPS order) already
// attributes it to the correct day - no need to touch route-segments.ts or
// call the Directions API.
export const DAY_STATS: DayStat[] = DAYS.map((date) => {
  const dayStops = STOPS.filter((stop) => stop.date === date);
  const legs = dayStops.filter((stop) => stop.driveFromPrevious).map((stop) => stop.driveFromPrevious!);
  return {
    date,
    dayIndex: getDayIndex(date),
    distanceKm: legs.reduce((sum, leg) => sum + leg.distanceKm, 0),
    durationMin: legs.reduce((sum, leg) => sum + leg.durationMin, 0),
    estimated: legs.some((leg) => leg.estimated),
    restDayLabel: dayStops.find((stop) => stop.restDayLabel)?.restDayLabel,
  };
});

/** Trip-wide distance/time, summed across every day. */
export const TOTAL_STATS = {
  distanceKm: DAY_STATS.reduce((sum, day) => sum + day.distanceKm, 0),
  durationMin: DAY_STATS.reduce((sum, day) => sum + day.durationMin, 0),
  estimated: DAY_STATS.some((day) => day.estimated),
};
