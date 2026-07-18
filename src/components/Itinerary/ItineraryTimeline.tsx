import React from 'react';
import { CalendarDays } from 'lucide-react';
import { STOPS } from '../../data/stops';
import { getDayIndex } from '../../data/day-colors';
import ItineraryStopCard from './ItineraryStopCard';
import ItineraryToggleButton from './ItineraryToggleButton';

interface Props {
  onCollapse: () => void;
}

/** Expanded itinerary: the full day-by-day vertical timeline. */
export default function ItineraryTimeline({ onCollapse }: Props) {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <ItineraryToggleButton direction="collapse" onClick={onCollapse} />
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-asphalt-700" />

        <div className="flex flex-col gap-6">
          {STOPS.map((stop, idx) => {
            const isNewDay = stop.date && (idx === 0 || stop.date !== STOPS[idx - 1].date);

            return (
              <React.Fragment key={stop.id}>
                {isNewDay && (
                  <div className="flex items-center gap-3 pl-10 md:pl-20 pt-4 first:pt-0">
                    <CalendarDays size={20} strokeWidth={1.5} className="text-asphalt-300 flex-shrink-0" />
                    <span className="font-display text-2xl md:text-3xl text-asphalt-100 tracking-wide whitespace-nowrap">
                      Day {getDayIndex(stop.date) + 1}
                    </span>
                    <span className="text-asphalt-400 text-sm whitespace-nowrap">{stop.date}</span>
                    <span className="flex-1 h-0.5 bg-asphalt-700 rounded-full" />
                  </div>
                )}
                <ItineraryStopCard stop={stop} index={idx + 1} />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <ItineraryToggleButton direction="collapse" onClick={onCollapse} />
      </div>
    </div>
  );
}
