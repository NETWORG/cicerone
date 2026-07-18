import { APIProvider, Map } from '@vis.gl/react-google-maps';
import MapPlaceholder from './MapPlaceholder';
import MapContent from './MapContent';
import MapLegendBelow from './MapLegendBelow';
import { useFullscreenToggle } from './useFullscreenToggle';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export default function RouteMap() {
  const { isFullscreen, toggleFullscreen } = useFullscreenToggle();

  if (!API_KEY) {
    return <MapPlaceholder />;
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div
        id="route-map"
        className={`relative${isFullscreen ? ' fixed inset-0 z-[999] is-fullscreen' : ''}`}
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
          <MapContent isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />
        </Map>
      </div>
      {!isFullscreen && <MapLegendBelow />}
    </APIProvider>
  );
}
