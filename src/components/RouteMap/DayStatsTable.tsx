import { MapPin, Camera } from 'lucide-react';
import { useMap } from '@vis.gl/react-google-maps';
import { DAY_STATS, TOTAL_STATS } from '../../data/day-stats';
import { fitToDay } from './fitToDay';
import { scrollToMap } from './scrollToMap';
import { useMediaPosts } from '../../hooks/useMediaPosts';
import { postsForDay } from './mediaByDay';
import MediaLightbox from '../MediaLightbox';
import { useState } from 'react';

function formatDistance(km: number): string {
  return `${Math.round(km)} km`;
}

function formatDuration(min: number): string {
  const hours = Math.floor(min / 60);
  const minutes = Math.round(min % 60);
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

/** A day with no recorded drive legs (e.g. a stay-put day) reads better as
 *  "Rest day" than a confusing "0 km · 0 min" - unless the stop data
 *  supplies a more specific label (e.g. a spectating day). */
function formatDayStats(
  distanceKm: number,
  durationMin: number,
  estimated: boolean,
  restDayLabel?: string
): string {
  if (distanceKm < 1 && durationMin < 1) return restDayLabel ?? 'Rest day';
  const suffix = estimated ? ' (est.)' : '';
  return `${formatDistance(distanceKm)} \u00b7 ${formatDuration(durationMin)}${suffix}`;
}

function ShowButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-rally-500/40 text-rally-600 hover:bg-rally-500 hover:text-white hover:border-rally-500 transition-colors"
    >
      <MapPin size={13} /> Show
    </button>
  );
}

/** Small icon-only button next to `ShowButton`, only rendered for days that
 *  actually have a geotagged post - opens the shared lightbox scoped to
 *  that day's photos/videos. */
function PhotosButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="See photos from this day"
      title="See photos from this day"
      className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full border border-rally-500/40 text-rally-600 hover:bg-rally-500 hover:text-white hover:border-rally-500 transition-colors"
    >
      <Camera size={13} />
    </button>
  );
}

/** Per-day distance/drive-time table next to the map, with a "show on map"
 *  button that fits the map bounds to that day's route. */
export default function DayStatsTable() {
  const map = useMap();
  const mediaPosts = useMediaPosts();
  const [dayLightbox, setDayLightbox] = useState<{ posts: typeof mediaPosts; index: number } | null>(null);

  function handleShow(date: string) {
    fitToDay(map, date);
    scrollToMap();
  }

  function handlePhotos(date: string) {
    const dayPosts = postsForDay(mediaPosts, date);
    if (dayPosts.length === 0) return;
    setDayLightbox({ posts: dayPosts, index: 0 });
  }

  return (
    <div className="bg-white border border-asphalt-700 shadow-sm rounded flex flex-col lg:flex-1 lg:min-h-0">
      <h3 className="flex-none text-sm font-semibold uppercase tracking-wide text-asphalt-300 px-4 pt-4 pb-3">
        Daily distance
      </h3>

      <div className="flex-1 lg:min-h-0 lg:overflow-y-auto px-4">
        {/* Mobile: stacked cards. */}
        <div className="flex flex-col gap-2 sm:hidden">
          {DAY_STATS.map((day) => {
            const dayPostCount = postsForDay(mediaPosts, day.date).length;
            return (
              <div
                key={day.date}
                className="flex items-center justify-between gap-2 rounded border border-asphalt-800 p-2"
              >
                <div className="min-w-0">
                  <p className="text-asphalt-200 text-sm">Day {day.dayIndex + 1}</p>
                  <p className="text-asphalt-500 text-xs truncate">{day.date}</p>
                  <p className="text-asphalt-400 text-xs mt-1">
                    {formatDayStats(day.distanceKm, day.durationMin, day.estimated, day.restDayLabel)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1.5">
                  {dayPostCount > 0 && <PhotosButton onClick={() => handlePhotos(day.date)} />}
                  <ShowButton onClick={() => handleShow(day.date)} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: compact table. */}
        <table className="hidden sm:table w-full text-sm">
          <thead>
            <tr className="text-left text-asphalt-500 text-xs uppercase">
              <th className="pb-2 font-medium">Day</th>
              <th className="pb-2 font-medium">Distance &amp; time</th>
              <th className="pb-2 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {DAY_STATS.map((day) => {
              const dayPostCount = postsForDay(mediaPosts, day.date).length;
              return (
                <tr key={day.date} className="border-t border-asphalt-800">
                  <td className="py-2">
                    <span className="text-asphalt-200">Day {day.dayIndex + 1}</span>
                    <span className="block text-asphalt-500 text-xs">{day.date}</span>
                  </td>
                  <td className="py-2 text-asphalt-400">
                    {formatDayStats(day.distanceKm, day.durationMin, day.estimated, day.restDayLabel)}
                  </td>
                  <td className="py-2 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {dayPostCount > 0 && <PhotosButton onClick={() => handlePhotos(day.date)} />}
                      <ShowButton onClick={() => handleShow(day.date)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trip-wide total - pinned outside the scroll region so it stays
       *  visible even while scrolling through the day list on desktop. */}
      <div className="flex-none flex items-center justify-between gap-2 px-4 py-3 border-t border-asphalt-700">
        <span className="text-sm font-semibold text-asphalt-100">Total</span>
        <span className="text-sm font-semibold text-asphalt-200">
          {formatDistance(TOTAL_STATS.distanceKm)} &middot; {formatDuration(TOTAL_STATS.durationMin)}
          {TOTAL_STATS.estimated ? ' (est.)' : ''}
        </span>
      </div>

      {dayLightbox && (
        <MediaLightbox
          posts={dayLightbox.posts}
          initialIndex={dayLightbox.index}
          onClose={() => setDayLightbox(null)}
        />
      )}
    </div>
  );
}
