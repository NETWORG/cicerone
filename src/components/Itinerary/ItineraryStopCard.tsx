import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps, MapPin, MapPinned, CalendarDays, Clock, Route } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { type Stop, CATEGORIES } from '../../data/stops';
import { ITINERARY_PHOTOS } from '../../data/itinerary-photos';
import { googleMapsPinUrl } from '../../utils/maps';
import CategoryBadge from '../CategoryBadge';

interface Props {
  stop: Stop;
  /** 1-based position in the itinerary, shown on the timeline dot. */
  index: number;
}

/** A single itinerary stop: timeline dot + card (image, badges, meta, links). */
export default function ItineraryStopCard({ stop, index }: Props) {
  const meta = CATEGORIES[stop.category];
  const isEndpoint = stop.category === 'start' || stop.category === 'finish';
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  return (
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
          {index}
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

          <a
            href={googleMapsPinUrl(stop.coords)}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link-btn mb-3"
            aria-label={`Open ${stop.name} in Google Maps`}
          >
            <MapPinned size={12} strokeWidth={1.75} />Open in Maps
          </a>

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
  );
}
