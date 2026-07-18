import { useState } from 'react';
import { Car } from 'lucide-react';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { CREWS } from '../../data/crews';
import type { CrewPosition } from '../../hooks/useCrewPositions';

export default function CrewMarker({ position, color }: { position: CrewPosition; color: string }) {
  const [open, setOpen] = useState(false);
  const crew = CREWS.find((c) => c.id === position.crewId);
  const label = crew ? crew.name : position.crewId;
  const lastUpdate = new Date(position.updatedAt);

  return (
    <>
      <AdvancedMarker
        position={{ lat: position.lat, lng: position.lon }}
        onClick={() => setOpen(true)}
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
            className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-[3px] border-white"
            style={{ backgroundColor: color, opacity: position.stale ? 0.5 : 1 }}
          >
            <Car size={22} strokeWidth={2.25} color="#fff" />
          </div>
        </div>
      </AdvancedMarker>

      {open && (
        <InfoWindow
          position={{ lat: position.lat, lng: position.lon }}
          onCloseClick={() => setOpen(false)}
          pixelOffset={[0, -28]}
        >
          <div className="text-sm text-asphalt-300">
            <p className="font-bold mb-1 text-asphalt-100">{label}</p>
            {crew && <p className="text-xs mb-1 text-asphalt-500">{crew.car}</p>}
            <p className={`text-xs ${position.stale ? 'text-rally-500' : 'text-asphalt-500'}`}>
              {position.stale ? 'Last seen ' : 'Updated '}
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
