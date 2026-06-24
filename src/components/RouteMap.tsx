import { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { STOPS, CATEGORIES, type Stop } from '../data/stops';
import CategoryBadge from './CategoryBadge';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

const PATH_COORDS = STOPS.map((s) => s.coords);

function RoutePolyline() {
  const map = useMap();
  const drawnRef = useRef(false);

  useEffect(() => {
    if (!map || drawnRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;
    new g.maps.Polyline({
      path: PATH_COORDS,
      geodesic: true,
      strokeColor: '#f59e0b',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map,
    });
    drawnRef.current = true;
  }, [map]);

  return null;
}

function MarkerPin({ stop }: { stop: Stop }) {
  const meta = CATEGORIES[stop.category];
  return (
    <div
      className="flex flex-col items-center"
      style={{ transform: 'translateY(-100%)' }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white/30"
        style={{ backgroundColor: meta.color }}
      >
        {meta.emoji}
      </div>
      <div
        className="w-0 h-0"
        style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `8px solid ${meta.color}`,
        }}
      />
    </div>
  );
}

function StopInfoWindow({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  return (
    <div className="bg-asphalt-900 rounded-xl p-4 max-w-xs" style={{ color: '#e2e4ea' }}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-asphalt-400 hover:text-white transition-colors text-xl leading-none"
        aria-label="Close"
      >
        ×
      </button>
      <div className="mb-2">
        <CategoryBadge category={stop.category} />
      </div>
      <h3 className="font-bold text-base mb-1" style={{ color: '#fff' }}>
        {stop.name}
      </h3>
      <p className="text-xs mb-2" style={{ color: '#9ca3af' }}>
        {stop.location}
        {stop.date && ` · ${stop.date}`}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: '#c0c4ce' }}>
        {stop.blurb}
      </p>
      {stop.link && (
        <a
          href={stop.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs font-medium"
          style={{ color: '#f59e0b' }}
        >
          Learn more →
        </a>
      )}
      {stop.optional && (
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full" style={{ background: '#f59e0b22', color: '#f59e0b' }}>
          Optional stop
        </span>
      )}
    </div>
  );
}

function MapLegend() {
  const shown = ['start', 'pass', 'cars', 'factory', 'track', 'sea', 'city', 'science', 'museum', 'food'] as const;
  return (
    <div className="absolute bottom-3 left-3 bg-asphalt-900/95 backdrop-blur border border-asphalt-700 rounded-xl p-3 flex flex-col gap-1.5">
      {shown.map((cat) => {
        const m = CATEGORIES[cat];
        return (
          <div key={cat} className="flex items-center gap-2 text-xs text-asphalt-200">
            <span className="text-sm">{m.emoji}</span>
            <span>{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MapContent() {
  const [selected, setSelected] = useState<Stop | null>(null);

  return (
    <>
      <RoutePolyline />
      {STOPS.map((stop) => (
        <AdvancedMarker
          key={stop.id}
          position={stop.coords}
          onClick={() => setSelected(stop)}
          title={stop.name}
        >
          <MarkerPin stop={stop} />
        </AdvancedMarker>
      ))}

      {selected && (
        <InfoWindow
          position={selected.coords}
          onCloseClick={() => setSelected(null)}
          pixelOffset={[0, -44]}
        >
          <StopInfoWindow stop={selected} onClose={() => setSelected(null)} />
        </InfoWindow>
      )}

      <MapLegend />
    </>
  );
}

export default function RouteMap() {
  if (!API_KEY) {
    return (
      <div
        id="route-map"
        className="flex flex-col items-center justify-center bg-asphalt-800 border border-asphalt-700 rounded-xl text-center p-8"
      >
        <span className="text-5xl mb-4">🗺️</span>
        <p className="text-asphalt-200 font-semibold mb-2">Interactive map coming soon</p>
        <p className="text-asphalt-400 text-sm max-w-sm">
          Add a <code className="text-rally-400">VITE_GOOGLE_MAPS_API_KEY</code> environment variable to enable the live map with category pins and route overlay.
        </p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY}>
      <div id="route-map" className="relative">
        <Map
          defaultCenter={{ lat: 46.5, lng: 9.5 }}
          defaultZoom={5}
          mapId="cicerone-rallye"
          gestureHandling="greedy"
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
          colorScheme="DARK"
        >
          <MapContent />
        </Map>
      </div>
    </APIProvider>
  );
}
