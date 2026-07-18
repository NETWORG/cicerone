import { useMap } from '@vis.gl/react-google-maps';
import { DAY_COLORS } from '../../data/day-colors';
import { CREWS } from '../../data/crews';
import { useCrewPositions } from '../../hooks/useCrewPositions';
import CrewMarker from './CrewMarker';
import { useClusterer } from './useClusterer';

/** Renders one live car marker per crew that has reported a Traccar position. */
export default function CrewMarkers() {
  const positions = useCrewPositions();
  const map = useMap();
  const setCrewMarkerRef = useClusterer(map);

  return (
    <>
      {positions.map((position) => {
        const idx = CREWS.findIndex((c) => c.id === position.crewId);
        const color = DAY_COLORS[(idx === -1 ? 0 : idx) % DAY_COLORS.length];
        return (
          <CrewMarker
            key={position.crewId}
            position={position}
            color={color}
            markerRef={setCrewMarkerRef(position.crewId)}
          />
        );
      })}
    </>
  );
}
