import { useEffect, useState } from 'react';
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
import { ROUTE_SEGMENTS } from '../data/route-segments';
import { DAY_COLORS } from '../data/day-colors';
import { ITINERARY_PHOTOS } from '../data/itinerary-photos';
import CategoryBadge from './CategoryBadge';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

// The route line is precomputed once per day (see scripts/generate-route-path.mjs)
// and committed as static data, so the map never needs to call the
// Directions API at runtime - every visitor just gets plain polylines, one
// per day, each colored to match that day's itinerary section.
function RoutePolyline() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;

    const lines = ROUTE_SEGMENTS.map((segment, i) => {
      return new g.maps.Polyline({
        path: segment.path,
        geodesic: true,
        strokeColor: DAY_COLORS[i % DAY_COLORS.length],
        strokeOpacity: 0.85,
        strokeWeight: 4,
        map,
      });
    });

    return () => {
      lines.forEach((line) => line.setMap(null));
    };
  }, [map]);

  return null;
}

// Zooms/pans the map to fit the whole route on load, instead of a fixed
// center+zoom that leaves most of the map looking empty.
function FitToRoute() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google;
    if (!g) return;

    const allPoints = ROUTE_SEGMENTS.flatMap((segment) => segment.path);
    const bounds = new g.maps.LatLngBounds();
    const points = allPoints.length > 0 ? allPoints : STOPS.map((s) => s.coords);
    points.forEach((p: { lat: number; lng: number }) => bounds.extend(p));
    map.fitBounds(bounds, 24);
  }, [map]);

  return null;
}

function MarkerPin({ stop, index }: { stop: Stop; index: number }) {
  const meta = CATEGORIES[stop.category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20"
        style={{ backgroundColor: meta.color }}
      >
        {Icon && <Icon size={17} strokeWidth={1.75} color="#fff" />}
        <span
          className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full text-white text-[11px] font-bold leading-none flex items-center justify-center border-2 border-white shadow"
          style={{ backgroundColor: '#0a0909' }}
        >
          {index}
        </span>
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

function StopInfoWindow({ stop, index, onClose }: { stop: Stop; index: number; onClose: () => void }) {
  const photo = ITINERARY_PHOTOS[stop.id];
  return (
    <div className="bg-white rounded border border-asphalt-700 max-w-xs relative shadow-lg overflow-hidden" style={{ color: '#2d2c2a' }}>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 text-asphalt-500 hover:text-asphalt-100 transition-colors"
        aria-label="Close"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
      {photo && (
        <div className="relative">
          <img src={photo} alt={stop.name} className="w-full h-32 object-cover" />
          <span
            className="absolute -bottom-3 left-3 w-8 h-8 rounded-full text-white text-sm font-bold leading-none flex items-center justify-center border-2 border-white shadow z-10"
            style={{ backgroundColor: CATEGORIES[stop.category].color }}
          >
            {index}
          </span>
        </div>
      )}
      <div className={`p-4 ${photo ? 'pt-5' : ''}`}>
      <div className="mb-2 flex items-center gap-2">
        <CategoryBadge category={stop.category} />
        {!photo && (
          <span
            className="w-6 h-6 rounded-full text-white text-xs font-bold leading-none flex items-center justify-center"
            style={{ backgroundColor: CATEGORIES[stop.category].color }}
          >
            {index}
          </span>
        )}
      </div>
      <h3 className="font-bold text-base mb-1 pr-5" style={{ color: '#0a0909' }}>
        {stop.name}
      </h3>
      <p className="text-xs mb-2" style={{ color: '#8a8784' }}>
        {stop.location}
        {stop.date && ` · ${stop.date}`}
        {stop.time && ` · ${stop.time}`}
      </p>
      {stop.driveFromPrevious && (stop.driveFromPrevious.distanceKm > 0 || stop.driveFromPrevious.durationMin > 0) && (
        <p className="text-xs mb-2" style={{ color: '#8a8784' }}>
          {stop.driveFromPrevious.distanceKm.toFixed(1)} km / {Math.floor(stop.driveFromPrevious.durationMin / 60)}h {stop.driveFromPrevious.durationMin % 60}min from previous stop
          {stop.driveFromPrevious.estimated && ' (estimated)'}
        </p>
      )}
      <p className="text-sm leading-relaxed" style={{ color: '#2d2c2a' }}>
        {stop.blurb}
      </p>
      {stop.link && (
        <a
          href={stop.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs font-medium"
          style={{ color: '#c8102e' }}
        >
          Learn more →
        </a>
      )}
      {stop.optional && (
        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded border" style={{ borderColor: '#d8d4ce', color: '#8a8784' }}>
          Optional stop
        </span>
      )}
      </div>
    </div>
  );
}

function CategoryIcon({ category }: { category: StopCategory }) {
  const meta = CATEGORIES[category];
  const iconName = meta.icon as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as React.ComponentType<LucideProps> | undefined;
  return Icon ? <Icon size={12} strokeWidth={1.5} style={{ color: meta.color }} /> : null;
}

const LEGEND_CATEGORIES: StopCategory[] = ['start', 'pass', 'cars', 'factory', 'track', 'sea', 'city', 'science', 'car-museum', 'tech-museum', 'culture', 'food', 'sport'];

function MapLegend() {
  return (
    <div className="hidden sm:flex absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-asphalt-700 rounded p-3 flex-col gap-1.5 shadow-md">
      {LEGEND_CATEGORIES.map((cat) => {
        const m = CATEGORIES[cat];
        return (
          <div key={cat} className="flex items-center gap-2 text-xs" style={{ color: '#2d2c2a' }}>
            <CategoryIcon category={cat} />
            <span>{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MapLegendBelow() {
  return (
    <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-2 bg-asphalt-900 border border-asphalt-700 rounded p-4 mt-3">
      {LEGEND_CATEGORIES.map((cat) => {
        const m = CATEGORIES[cat];
        return (
          <div key={cat} className="flex items-center gap-2 text-xs text-asphalt-300">
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
      <FitToRoute />
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

export default function RouteMap() {
  if (!API_KEY) {
    return (
      <div
        id="route-map"
        className="flex flex-col items-center justify-center bg-asphalt-900 border border-asphalt-700 rounded text-center p-8 gap-4"
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
          colorScheme="LIGHT"
        >
          <MapContent />
        </Map>
      </div>
      <MapLegendBelow />
    </APIProvider>
  );
}
