import { ChevronDown, MapPinned } from 'lucide-react';

interface Props {
  /** Whether clicking this button expands or collapses the itinerary. */
  direction: 'expand' | 'collapse';
  onClick: () => void;
  className?: string;
}

/**
 * Shared CTA used to open/close the whole itinerary. When inviting people to
 * expand it gets a subtle pulse on the icon to draw the eye toward the
 * hidden photos; when offering to collapse it's calmer/secondary styled.
 */
export default function ItineraryToggleButton({ direction, onClick, className = '' }: Props) {
  const isExpand = direction === 'expand';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={!isExpand}
      className={[
        'group inline-flex items-center gap-2 rounded-full font-semibold transition-all duration-150',
        'select-none cursor-pointer active:scale-95',
        isExpand
          ? 'btn-primary shadow-lg shadow-rally-500/20 hover:shadow-rally-500/40'
          : 'btn-outline',
        className,
      ].join(' ')}
    >
      <MapPinned size={16} strokeWidth={1.75} className={isExpand ? 'animate-pulse' : ''} />
      <span>{isExpand ? 'View full itinerary' : 'Collapse itinerary'}</span>
      <ChevronDown
        size={16}
        strokeWidth={1.75}
        className={`transition-transform duration-300 ${isExpand ? '' : 'rotate-180'}`}
      />
    </button>
  );
}
