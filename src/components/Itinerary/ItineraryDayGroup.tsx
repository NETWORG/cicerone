import { CalendarDays, ChevronDown } from 'lucide-react';
import { type Stop } from '../../data/stops';
import { ITINERARY_PHOTOS } from '../../data/itinerary-photos';
import ItineraryStopCard from './ItineraryStopCard';

interface Props {
  /** 1-based day number shown in the header, e.g. "Day 3". */
  dayNumber: number;
  /** Human-readable date string for this day, e.g. "Sat, 18 Jul 2026". */
  date: string;
  /** Stops that happen on this day, in order. */
  stops: Stop[];
  /** 1-based position of this day's first stop in the overall itinerary, for the timeline dot numbers. */
  startIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * One collapsible day within the itinerary timeline. Collapsed by default,
 * the header hints at what's inside (stop count + a thumbnail from the
 * day's first available photo) to nudge people to open it, similar in
 * spirit to the whole-itinerary teaser.
 */
export default function ItineraryDayGroup({ dayNumber, date, stops, startIndex, isOpen, onToggle }: Props) {
  const thumbnail = stops.map((stop) => ITINERARY_PHOTOS[stop.id]).find(Boolean);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full grid grid-cols-[auto_minmax(4.5rem,auto)_0_2rem_minmax(4.5rem,auto)_1fr_auto] md:grid-cols-[auto_minmax(4.5rem,auto)_minmax(0,9rem)_2rem_minmax(4.5rem,auto)_1fr_auto] items-center gap-x-3 gap-y-1 pl-10 md:pl-20 pr-4 md:pr-0 pt-4 first:pt-0 text-left cursor-pointer group"
      >
        <CalendarDays size={20} strokeWidth={1.5} className="text-asphalt-300 flex-shrink-0" />
        <span className="font-display text-2xl md:text-3xl text-asphalt-100 tracking-wide whitespace-nowrap">
          Day {dayNumber}
        </span>
        <span className="text-asphalt-400 text-sm whitespace-nowrap overflow-hidden">{date}</span>

        <span className="w-8 h-8 flex-shrink-0">
          {!isOpen && thumbnail && (
            <img
              src={thumbnail}
              alt=""
              loading="lazy"
              className="w-8 h-8 rounded-md object-cover border border-asphalt-700"
            />
          )}
        </span>
        <span className="text-asphalt-500 text-xs whitespace-nowrap">
          {stops.length} stop{stops.length === 1 ? '' : 's'}
        </span>

        <span className="h-0.5 bg-asphalt-700 rounded-full" />

        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`text-asphalt-400 flex-shrink-0 transition-transform duration-300 group-hover:text-asphalt-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Grid-rows trick: 0fr collapses the content to zero height without
          unmounting it abruptly, 1fr reveals it, both animated smoothly.
          `inert` on the hidden panel keeps its links out of tab order and
          off the a11y tree while visually collapsed. */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div
          className={`overflow-hidden min-h-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          inert={!isOpen}
        >
          <div className="flex flex-col gap-6 pt-6">
            {stops.map((stop, idx) => (
              <ItineraryStopCard key={stop.id} stop={stop} index={startIndex + idx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
