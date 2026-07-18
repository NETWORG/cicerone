import { DAY_COLORS } from '../../data/day-colors';
import { CREWS } from '../../data/crews';
import { useCrewPositions } from '../../hooks/useCrewPositions';
import CrewMarker from './CrewMarker';

/** Renders one live car marker per crew that has reported a Traccar position. */
export default function CrewMarkers() {
  const positions = useCrewPositions();

  return (
    <>
      {positions.map((position) => {
        const idx = CREWS.findIndex((c) => c.id === position.crewId);
        const color = DAY_COLORS[(idx === -1 ? 0 : idx) % DAY_COLORS.length];
        return <CrewMarker key={position.crewId} position={position} color={color} />;
      })}
    </>
  );
}
