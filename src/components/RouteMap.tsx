import { useEffect, useRef, useState } from 'react';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { type LucideProps, Map as MapIcon, X } from 'lucide-react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { STOPS, CATEGORIES, type Stop, type StopCategory } from '../data/stops';
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
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  return (
    <div className="flex flex-col items-center" style={{ transform: 'translateY(-100%)' }}>
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
        style={{ backgroundColor: meta.color }}
      >
        {Icon && <Icon size={16} strokeWidth={1.75} color="#fff" />}
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
    <div className="bg-asphalt-900 rounded-xl p-4 max-w-xs relative" style={{ color: '#e2e4ea' }}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-asphalt-400 hover:text-white transition-colors"
        aria-label="Close"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
      <div className="mb-2">
        <CategoryBadge category={stop.category} />
      </div>
      <h3 className="font-bold text-base mb-1 pr-5" style={{ color: '#fff' }}>
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

function CategoryIcon({ category }: { category: StopCategory }) {
  const meta = CATEGORIES[category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;
  return Icon ? <Icon size={12} strokeWidth={1.5} style={{ color: meta.color }} /> : null;
}

function MapLegend() {
  const shown: StopCategory[] = ['start', 'pass', 'cars', 'factory', 'track', 'sea', 'city', 'science', 'museum', 'food'];
  return (
    <div className="absolute bottom-3 left-3 bg-asphalt-900/95 backdrop-blur border border-asphalt-700 rounded-xl p-3 flex flex-col gap-1.5">
      {shown.map((cat) => {
        const m = CATEGORIES[cat];
        return (
          <div key={cat} className="flex items-center gap-2 text-xs" style={{ color: '#c0c4ce' }}>
            <CategoryIcon category={cat} />
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
        className="flex flex-col items-center justify-center bg-asphalt-800 border border-asphalt-700 rounded-xl text-center p-8 gap-4"
      >
        <MapIcon size={40} strokeWidth={1} className="text-asphalt-500" />
        <p className="text-asphalt-200 font-semibold">Interactive map coming soon</p>
        <p className="text-asphalt-400 text-sm max-w-sm">
          Add a <code className="text-rally-400">VITE_GOOGLE_MAPS_API_KEY</code> environment variable to enable the live route map.
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
