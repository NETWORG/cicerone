import { X, MapPinned } from 'lucide-react';
import { CATEGORIES, type Stop } from '../../data/stops';
import { ITINERARY_PHOTOS } from '../../data/itinerary-photos';
import { googleMapsPinUrl } from '../../utils/maps';
import CategoryBadge from '../CategoryBadge';

interface StopInfoWindowProps {
  stop: Stop;
  index: number;
  onClose: () => void;
}

export default function StopInfoWindow({ stop, index, onClose }: StopInfoWindowProps) {
  const photo = ITINERARY_PHOTOS[stop.id];
  const categoryColor = CATEGORIES[stop.category].color;

  return (
    <div className="bg-white rounded border border-asphalt-700 max-w-xs relative shadow-lg overflow-hidden text-asphalt-300">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-asphalt-500 hover:text-asphalt-100 transition-colors"
        aria-label="Close"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
      {photo && (
        <div className="relative">
          <img src={photo} alt={stop.name} className="w-full h-32 object-cover" />
          {/* Category color is data-driven, so it stays a scoped inline style. */}
          <span
            className="absolute -bottom-3 left-3 w-8 h-8 rounded-full text-white text-sm font-bold leading-none flex items-center justify-center border-2 border-white shadow z-10"
            style={{ backgroundColor: categoryColor }}
          >
            {index}
          </span>
        </div>
      )}
      <div className={`p-4 ${photo ? 'pt-5' : ''}`}>
        <div className="mb-2 flex items-center gap-2">
          <CategoryBadge category={stop.category} />
          {!photo && (
            <span
              className="w-6 h-6 rounded-full text-white text-xs font-bold leading-none flex items-center justify-center"
              style={{ backgroundColor: categoryColor }}
            >
              {index}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base mb-1 pr-5 text-asphalt-100">{stop.name}</h3>
        <p className="text-xs mb-2 text-asphalt-500">
          {stop.location}
          {stop.date && ` · ${stop.date}`}
          {stop.time && ` · ${stop.time}`}
        </p>
        <a
          href={googleMapsPinUrl(stop.coords)}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link-btn mb-2"
          aria-label={`Open ${stop.name} in Google Maps`}
        >
          <MapPinned size={12} strokeWidth={1.75} />Open in Maps
        </a>
        {stop.driveFromPrevious && (stop.driveFromPrevious.distanceKm > 0 || stop.driveFromPrevious.durationMin > 0) && (
          <p className="text-xs mb-2 text-asphalt-500">
            {stop.driveFromPrevious.distanceKm.toFixed(1)} km / {Math.floor(stop.driveFromPrevious.durationMin / 60)}h {stop.driveFromPrevious.durationMin % 60}min from previous stop
            {stop.driveFromPrevious.estimated && ' (estimated)'}
          </p>
        )}
        <p className="text-sm leading-relaxed text-asphalt-300">{stop.blurb}</p>
        {stop.link && (
          <a
            href={stop.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs font-medium text-rally-500"
          >
            Learn more →
          </a>
        )}
        {stop.optional && (
          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded border border-asphalt-700 text-asphalt-500">
            Optional stop
          </span>
        )}
      </div>
    </div>
  );
}
