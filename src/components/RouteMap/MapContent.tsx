import { useState } from 'react';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { STOPS, type Stop } from '../../data/stops';
import RoutePolyline from './RoutePolyline';
import FitToRoute from './FitToRoute';
import MapResizeOnFullscreenChange from './MapResizeOnFullscreenChange';
import FullscreenButton from './FullscreenButton';
import MarkerPin from './MarkerPin';
import StopInfoWindow from './StopInfoWindow';
import MapLegend from './MapLegend';

interface MapContentProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export default function MapContent({ isFullscreen, onToggleFullscreen }: MapContentProps) {
  const [selected, setSelected] = useState<Stop | null>(null);

  return (
    <>
      <RoutePolyline />
      <FitToRoute />
      <MapResizeOnFullscreenChange isFullscreen={isFullscreen} />
      <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
      {STOPS.map((stop, idx) => (
        <AdvancedMarker
          key={stop.id}
          position={stop.coords}
          onClick={() => setSelected(stop)}
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
