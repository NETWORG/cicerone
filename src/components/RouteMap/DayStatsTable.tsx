import { MapPin } from 'lucide-react';
import { useMap } from '@vis.gl/react-google-maps';
import { DAY_STATS } from '../../data/day-stats';
import { fitToDay } from './fitToDay';

function formatDistance(km: number): string {
  return `${Math.round(km)} km`;
}

function formatDuration(min: number): string {
  const hours = Math.floor(min / 60);
  const minutes = Math.round(min % 60);
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

/** Per-day distance/drive-time table next to the map, with a "show on map"
 *  button that fits the map bounds to that day's route. */
export default function DayStatsTable() {
  const map = useMap();

  return (
    <div className="bg-asphalt-900 border border-asphalt-700 rounded p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-asphalt-300 mb-3">
        Daily distance
      </h3>

      {/* Mobile: stacked cards. */}
      <div className="flex flex-col gap-2 sm:hidden">
        {DAY_STATS.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between gap-2 rounded border border-asphalt-800 p-2"
          >
            <div className="min-w-0">
              <p className="text-asphalt-200 text-sm">Day {day.dayIndex + 1}</p>
              <p className="text-asphalt-500 text-xs truncate">{day.date}</p>
              <p className="text-asphalt-400 text-xs mt-1">
                {formatDistance(day.distanceKm)} &middot; {formatDuration(day.durationMin)}
                {day.estimated ? ' (est.)' : ''}
              </p>
            </div>
            <button
              onClick={() => fitToDay(map, day.date)}
              className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-rally-500"
            >
              <MapPin size={14} /> Show
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: compact table. */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="text-left text-asphalt-500 text-xs uppercase">
            <th className="pb-2 font-medium">Day</th>
            <th className="pb-2 font-medium">Distance</th>
            <th className="pb-2 font-medium">Drive time</th>
            <th className="pb-2 font-medium text-right">Map</th>
          </tr>
        </thead>
        <tbody>
          {DAY_STATS.map((day) => (
            <tr key={day.date} className="border-t border-asphalt-800">
              <td className="py-2">
                <span className="text-asphalt-200">Day {day.dayIndex + 1}</span>
                <span className="block text-asphalt-500 text-xs">{day.date}</span>
              </td>
              <td className="py-2 text-asphalt-400">
                {formatDistance(day.distanceKm)}
                {day.estimated ? <span className="text-asphalt-600"> (est.)</span> : null}
              </td>
              <td className="py-2 text-asphalt-400">{formatDuration(day.durationMin)}</td>
              <td className="py-2 text-right">
                <button
                  onClick={() => fitToDay(map, day.date)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rally-500 hover:text-rally-400"
                >
                  <MapPin size={14} /> Show
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
