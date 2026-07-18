import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

/**
 * The native Google Maps fullscreenControl relies on the browser's
 * Fullscreen API (element.requestFullscreen). iOS Safari doesn't support
 * that API for arbitrary elements, so Google Maps silently hides its
 * fullscreen button on iPhone/iPad. We use our own CSS-based fullscreen
 * mode instead (see useFullscreenToggle), and this component just tells
 * the map to re-measure its size whenever that mode toggles.
 */
export default function MapResizeOnFullscreenChange({ isFullscreen }: { isFullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;

    const timer = setTimeout(() => {
      g.maps.event.trigger(map, 'resize');
    }, 50);
    return () => clearTimeout(timer);
  }, [map, isFullscreen]);

  return null;
}
