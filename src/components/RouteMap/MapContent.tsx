import { useState } from 'react';
import { AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { STOPS, type Stop } from '../../data/stops';
import RoutePolyline from './RoutePolyline';
import FitToRoute from './FitToRoute';
import MapResizeOnFullscreenChange from './MapResizeOnFullscreenChange';
import FullscreenButton from './FullscreenButton';
import MarkerPin from './MarkerPin';
import StopInfoWindow from './StopInfoWindow';
import MapLegend from './MapLegend';
import CrewMarkers from './CrewMarkers';
import { useClusterer } from './useClusterer';
import { focusOn } from './focusOn';

interface MapContentProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function MapContent({ isFullscreen, onToggleFullscreen }: MapContentProps) {
  const [selected, setSelected] = useState<Stop | null>(null);
  const map = useMap();
  const setStopMarkerRef = useClusterer(map);

  return (
    <>
      <RoutePolyline />
      <FitToRoute />
      <MapResizeOnFullscreenChange isFullscreen={isFullscreen} />
      <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
      <CrewMarkers />
      {STOPS.map((stop, idx) => (
        <AdvancedMarker
          key={stop.id}
          ref={(marker) => setStopMarkerRef(marker, stop.id)}
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
