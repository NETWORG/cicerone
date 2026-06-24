import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import all 2025 photos via Vite glob — sorted by filename
const modules = import.meta.glob('../assets/photos/2025/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const PHOTOS = Object.keys(modules)
  .sort()
  .map((key) => modules[key]);

const INTERVAL_MS = 4000;

export default function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = () => setCurrent((c) => (c - 1 + PHOTOS.length) % PHOTOS.length);
  const next = () => setCurrent((c) => (c + 1) % PHOTOS.length);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, current]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {PHOTOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`2025 trip — photo ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          loading={i < 3 ? 'eager' : 'lazy'}
        />
      ))}

      {/* Gradient overlay for controls legibility */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(13,14,16,0.6) 0%, transparent 30%)' }} />

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-asphalt-950/60 text-white hover:bg-asphalt-950/90 transition-colors"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-asphalt-950/60 text-white hover:bg-asphalt-950/90 transition-colors"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Dot strip */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to photo ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '1.5rem' : '0.375rem',
              background: i === current ? '#f59e0b' : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <span className="absolute top-3 right-3 z-20 text-xs text-white/60 tabular-nums">
        {current + 1} / {PHOTOS.length}
      </span>
    </div>
  );
}
