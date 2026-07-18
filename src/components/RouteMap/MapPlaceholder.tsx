import { Map as MapIcon } from 'lucide-react';

export default function MapPlaceholder() {
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
