import { STOPS } from '../../data/stops';
import { ITINERARY_PHOTOS } from '../../data/itinerary-photos';
import { DAYS } from '../../data/day-colors';
import PhotoThumbnailStrip from './PhotoThumbnailStrip';
import ItineraryToggleButton from './ItineraryToggleButton';

interface Props {
  onExpand: () => void;
}

/**
 * Collapsed itinerary teaser: a peek at the photos plus quick stats and a
 * CTA, designed to make people want to open the full itinerary rather than
 * face a long list of cards.
 */
export default function ItineraryTeaser({ onExpand }: Props) {
  const photos = STOPS.map((stop) => ITINERARY_PHOTOS[stop.id]).filter(Boolean) as string[];

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <PhotoThumbnailStrip photos={photos} />

      <p className="text-asphalt-400 text-sm text-center">
        <span className="text-asphalt-100 font-semibold">{STOPS.length} stops</span>
        {' across '}
        <span className="text-asphalt-100 font-semibold">{DAYS.length} days</span>
        {' — passes, factories, coastlines and more.'}
      </p>

      <ItineraryToggleButton direction="expand" onClick={onExpand} />
    </div>
  );
}
