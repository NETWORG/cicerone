import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps, MapPin, CalendarDays, Clock, Route } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { STOPS, CATEGORIES } from '../data/stops';
import { ITINERARY_PHOTOS } from '../data/itinerary-photos';
import { getDayIndex } from '../data/day-colors';
import CategoryBadge from '../components/CategoryBadge';

export default function ItinerarySection() {
  return (
    <section id="itinerary" className="section-pad bg-asphalt-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Day by Day
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 tracking-wide">
            ITINERARY
          </h2>
          <p className="text-asphalt-400 text-sm mt-4">
            Stops are planned, not compulsory. The spirit of the rallye is relaxed.
          </p>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-asphalt-700" />

          <div className="flex flex-col gap-6">
            {STOPS.map((stop, idx) => {
              const meta = CATEGORIES[stop.category];
              const isEndpoint = stop.category === 'start' || stop.category === 'finish';
              const iconName = meta.icon as keyof typeof LucideIcons;
              const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;
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
                  <div className="relative flex gap-6 md:gap-10 pl-10 md:pl-20">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 md:left-4 top-4 w-10 h-10 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 bg-white"
                    style={{
                      borderColor: meta.color,
                    }}
                  >
                    {Icon && <Icon size={16} strokeWidth={1.5} style={{ color: meta.color }} />}
                    {/* Step number badge */}
                    <span
                      className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full text-white text-[11px] font-bold leading-none flex items-center justify-center border-2 border-white shadow"
                      style={{ backgroundColor: meta.color }}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <div className={`card flex-1 overflow-hidden ${isEndpoint ? 'border-rally-500/40' : ''}`}>
                    {ITINERARY_PHOTOS[stop.id] && (
                      <img
                        src={ITINERARY_PHOTOS[stop.id]}
                        alt={stop.name}
                        className="w-full h-40 md:h-48 object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CategoryBadge category={stop.category} />
                      {stop.optional && (
                        <span className="category-badge border border-asphalt-600 text-asphalt-500">
                          Optional
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-asphalt-100 text-lg mb-1">{stop.name}</h3>

                    <p className="text-asphalt-400 text-xs mb-3 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={11} strokeWidth={1.5} />{stop.location}</span>
                      {stop.date && <span className="flex items-center gap-1"><CalendarDays size={11} strokeWidth={1.5} />{stop.date}</span>}
                      {stop.time && <span className="flex items-center gap-1"><Clock size={11} strokeWidth={1.5} />{stop.time}</span>}
                    </p>

                    {stop.driveFromPrevious && (stop.driveFromPrevious.distanceKm > 0 || stop.driveFromPrevious.durationMin > 0) && (
                      <p className="text-asphalt-500 text-xs mb-3 flex items-center gap-1">
                        <Route size={11} strokeWidth={1.5} />
                        {stop.driveFromPrevious.distanceKm.toFixed(1)} km / {Math.floor(stop.driveFromPrevious.durationMin / 60)}h {stop.driveFromPrevious.durationMin % 60}min from previous stop
                        {stop.driveFromPrevious.estimated && ' (estimated)'}
                      </p>
                    )}

                    <p className="text-asphalt-300 text-sm leading-relaxed">{stop.blurb}</p>

                    {stop.link && (
                      <a
                        href={stop.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-rally-400 hover:text-rally-300 transition-colors"
                      >
                        Official site <ExternalLink size={11} strokeWidth={1.5} />
                      </a>
                    )}
                    </div>
                  </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
