import { Car, X } from 'lucide-react';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { CREWS } from '../../data/crews';
import type { CrewPosition } from '../../hooks/useCrewPositions';
import { BRAND_LOGOS } from './brandLogos';
import type { Marker } from '@googlemaps/markerclusterer';

export default function CrewMarker({
  position,
  color,
  markerRef,
  open,
  onOpenChange,
}: {
  position: CrewPosition;
  color: string;
  markerRef?: (marker: Marker | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const crew = CREWS.find((c) => c.id === position.crewId);
  const label = crew ? crew.name : position.crewId;
  const lastUpdate = new Date(position.updatedAt);
  const logo = crew?.brandLogo ? BRAND_LOGOS[crew.brandLogo] : undefined;
  const coords = { lat: position.lat, lng: position.lon };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={coords}
        onClick={() => onOpenChange(true)}
        title={`${label}${position.stale ? ' (last seen a while ago)' : ''}`}
        zIndex={999}
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          {!position.stale && (
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-40"
              style={{ backgroundColor: color }}
            />
          )}
          <div
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-[3px]"
            style={{
              backgroundColor: logo ? '#fff' : color,
              borderColor: color,
              opacity: position.stale ? 0.5 : 1,
            }}
          >
            {logo ? (
              <img src={logo} alt="" className="w-8 h-8 object-contain" />
            ) : (
              <Car size={22} strokeWidth={2.25} color="#fff" />
            )}
          </div>
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow position={coords} onCloseClick={() => onOpenChange(false)} pixelOffset={[0, -28]}>
          <div className="bg-white rounded border border-asphalt-700 max-w-xs relative shadow-lg overflow-hidden text-asphalt-300">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-asphalt-500 hover:text-asphalt-100 transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
            <div className="p-4">
              <h3 className="font-bold text-base mb-1 pr-5 text-asphalt-100">{label}</h3>
              {crew && <p className="text-xs mb-2 text-asphalt-500">{crew.car}</p>}
              <p className={`text-xs ${position.stale ? 'text-rally-500' : 'text-asphalt-500'}`}>
                {position.stale ? 'Last seen ' : 'Updated '}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
