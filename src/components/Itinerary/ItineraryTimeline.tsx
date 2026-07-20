import { useState } from 'react';
import { type Stop, STOPS } from '../../data/stops';
import { DAYS } from '../../data/day-colors';
import ItineraryDayGroup from './ItineraryDayGroup';
import ItineraryToggleButton from './ItineraryToggleButton';

interface Props {
  onCollapse: () => void;
}

// Group stops by day once, in the order days first appear (matches DAYS).
const STOPS_BY_DAY: { date: string; stops: Stop[]; startIndex: number }[] = (() => {
  let runningIndex = 1;
  return DAYS.map((date) => {
    const stops = STOPS.filter((stop) => stop.date === date);
    const startIndex = runningIndex;
    runningIndex += stops.length;
    return { date, stops, startIndex };
  });
})();

/**
 * Expanded itinerary: the full day-by-day vertical timeline. Each day is its
 * own accordion section — collapsed by default, only one open at a time —
 * so the whole thing doesn't read as one very long scroll.
 */
export default function ItineraryTimeline({ onCollapse }: Props) {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const toggleDay = (date: string) => {
    setOpenDay((current) => (current === date ? null : date));
  };

  return (
    <div>
      <div className="flex justify-center mb-8">
        <ItineraryToggleButton direction="collapse" onClick={onCollapse} />
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-asphalt-700" />

        <div className="flex flex-col gap-2">
          {STOPS_BY_DAY.map(({ date, stops, startIndex }, dayIdx) => (
            <ItineraryDayGroup
              key={date}
              dayNumber={dayIdx + 1}
              date={date}
              stops={stops}
              startIndex={startIndex}
              isOpen={openDay === date}
              onToggle={() => toggleDay(date)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
