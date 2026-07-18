import { Maximize, Minimize } from 'lucide-react';

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

export default function FullscreenButton({ isFullscreen, onToggle }: FullscreenButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
      aria-pressed={isFullscreen}
      className="absolute top-2.5 right-2.5 z-20 w-9 h-9 flex items-center justify-center rounded bg-white shadow-md border border-asphalt-700 text-asphalt-100 active:scale-95 transition-transform"
    >
      {isFullscreen ? <Minimize size={16} strokeWidth={1.75} /> : <Maximize size={16} strokeWidth={1.75} />}
    </button>
  );
}
