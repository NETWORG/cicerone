import { useState } from 'react';
import { AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { STOPS, type Stop } from '../../data/stops';
import type { CrewPosition } from '../../hooks/useCrewPositions';
import RoutePolyline from './RoutePolyline';
import FitToRoute from './FitToRoute';
import MapResizeOnFullscreenChange from './MapResizeOnFullscreenChange';
import FullscreenButton from './FullscreenButton';
import MarkerPin from './MarkerPin';
import StopInfoWindow from './StopInfoWindow';
import MapLegend from './MapLegend';
import CrewMarkers from './CrewMarkers';
import { useClusterer } from './useClusterer';
import { waypointClusterRenderer } from './waypointClusterRenderer';
import { focusOn } from './focusOn';

interface MapContentProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  positions: CrewPosition[];
  selectedCrewId: string | null;
  onSelectCrew: (id: string | null) => void;
}

export default function MapContent({
  isFullscreen,
  onToggleFullscreen,
  positions,
  selectedCrewId,
  onSelectCrew,
}: MapContentProps) {
  const [selected, setSelected] = useState<Stop | null>(null);
  const map = useMap();
  const setStopMarkerRef = useClusterer(map, waypointClusterRenderer);

  return (
    <>
      <RoutePolyline />
      <FitToRoute />
      <MapResizeOnFullscreenChange isFullscreen={isFullscreen} />
      <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
      <CrewMarkers positions={positions} selectedCrewId={selectedCrewId} onSelectCrew={onSelectCrew} />
      {STOPS.map((stop, idx) => (
        <AdvancedMarker
          key={stop.id}
          ref={setStopMarkerRef(stop.id)}
          position={stop.coords}
          onClick={() => {
            setSelected(stop);
            focusOn(map, stop.coords);
          }}
          title={stop.name}
        >
          <MarkerPin stop={stop} index={idx + 1} />
        </AdvancedMarker>
      ))}

      {selected && (
        <InfoWindow
          position={selected.coords}
          onCloseClick={() => setSelected(null)}
          pixelOffset={[0, -44]}
        >
          <StopInfoWindow
            stop={selected}
            index={STOPS.findIndex((s) => s.id === selected.id) + 1}
            onClose={() => setSelected(null)}
          />
        </InfoWindow>
      )}

      <MapLegend />
    </>
  );
}
