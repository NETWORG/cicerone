import { useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import MapPlaceholder from './MapPlaceholder';
import MapContent from './MapContent';
import MapLegendBelow from './MapLegendBelow';
import TrackerTable from './TrackerTable';
import DayStatsTable from './DayStatsTable';
import PhotoStreamTile from './PhotoStreamTile';
import { useFullscreenToggle } from './useFullscreenToggle';
import { useCrewPositions } from '../../hooks/useCrewPositions';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export default function RouteMap() {
  const { isFullscreen, toggleFullscreen } = useFullscreenToggle();
  // Polled once here and shared by both the map markers and the tracker
  // table below, so they stay in sync without double-fetching.
  const positions = useCrewPositions();
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);

  if (!API_KEY) {
    return <MapPlaceholder />;
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
        <div
          id="route-map"
          className={isFullscreen ? 'fixed inset-0 z-[999] is-fullscreen' : 'relative'}
        >
          <Map
            defaultCenter={{ lat: 46.5, lng: 9.5 }}
            defaultZoom={5}
            mapId="cicerone-rallye"
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapTypeControl={false}
            // The native fullscreenControl button doesn't work on iOS Safari
            // (no Fullscreen API support for map elements), so we use our own
            // CSS-based FullscreenButton/is-fullscreen mode instead of the
            // built-in control.
            fullscreenControl={false}
            // @vis.gl/react-google-maps only accepts sizing via `style` (there's
            // no className prop for the map dom-element), so this is required
            // by the library's API rather than a stylistic choice.
            style={{ width: '100%', height: '100%' }}
            colorScheme="LIGHT"
          >
            <MapContent
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              positions={positions}
              selectedCrewId={selectedCrewId}
              onSelectCrew={setSelectedCrewId}
            />
          </Map>
        </div>

        {!isFullscreen && (
          <div className="route-map-sidebar flex flex-col gap-4 lg:min-h-0">
            <TrackerTable
              positions={positions}
              selectedCrewId={selectedCrewId}
              onSelectCrew={setSelectedCrewId}
            />
            <DayStatsTable />
            <PhotoStreamTile />
          </div>
        )}
      </div>
      {!isFullscreen && <MapLegendBelow />}
    </APIProvider>
  );
}
