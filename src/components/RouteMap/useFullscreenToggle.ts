import { useCallback, useEffect, useState } from 'react';

/**
 * Tracks our CSS-based "fullscreen" mode for the map (see RouteMap/index.tsx
 * for why we don't use the real Fullscreen API) and takes care of the two
 * side effects that go along with it: locking body scroll and letting
 * Escape close it, same as the native API would.
 */
export function useFullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exitFullscreen();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen, exitFullscreen]);

  return { isFullscreen, toggleFullscreen };
}
