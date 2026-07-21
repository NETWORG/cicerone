import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { CREWS } from '../../data/crews';
import type { CrewPosition } from '../../hooks/useCrewPositions';
import CrewMarker from './CrewMarker';
import { useClusterer } from './useClusterer';
import { crewClusterRenderer } from './crewClusterRenderer';
import { focusOn } from './focusOn';

interface CrewMarkersProps {
  positions: CrewPosition[];
  selectedCrewId: string | null;
  onSelectCrew: (id: string | null) => void;
}

/** Renders one live car marker per crew that has reported a Traccar position. */
export default function CrewMarkers({ positions, selectedCrewId, onSelectCrew }: CrewMarkersProps) {
  const map = useMap();
  const setCrewMarkerRef = useClusterer(map, crewClusterRenderer, positions);
  // Read via a ref (not a dependency) so re-centering happens only when the
  // selection itself changes - not on every 10s position poll, which would
  // otherwise keep yanking the view back while someone is selected.
  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  // Selecting a crew (from a marker click or the tracker table's "Show on
  // map" button) re-centers the map on its position at the moment of
  // selection.
  useEffect(() => {
    if (!selectedCrewId) return;
    const position = positionsRef.current.find((p) => p.crewId === selectedCrewId);
    if (position) focusOn(map, { lat: position.lat, lng: position.lon });
  }, [selectedCrewId, map]);

  return (
    <>
      {positions.map((position) => {
        const crew = CREWS.find((c) => c.id === position.crewId);
        const color = crew?.color ?? '#6b7280';
        return (
          <CrewMarker
            key={position.crewId}
            position={position}
            color={color}
            markerRef={setCrewMarkerRef(position.crewId)}
            open={selectedCrewId === position.crewId}
            onOpenChange={(open) => onSelectCrew(open ? position.crewId : null)}
          />
        );
      })}
    </>
  );
}
