import { MapPin } from 'lucide-react';
import { CREWS, type Crew } from '../../data/crews';
import type { CrewPosition } from '../../hooks/useCrewPositions';
import { BRAND_LOGOS } from './brandLogos';
import { scrollToMap } from './scrollToMap';

function formatRelativeTime(iso: string): string {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.round(diffMin / 60);
  return diffH === 1 ? '1 hour ago' : `${diffH} hours ago`;
}

function ShowButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-rally-500/40 text-rally-600 hover:bg-rally-500 hover:text-white hover:border-rally-500 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-rally-600 disabled:cursor-not-allowed transition-colors"
    >
      <MapPin size={13} /> Show
    </button>
  );
}

interface TrackerTableProps {
  positions: CrewPosition[];
  selectedCrewId: string | null;
  onSelectCrew: (id: string | null) => void;
}

/** Crew list next to the map: car, last-updated, and a "show on map" button
 *  that re-centers the map and opens that crew's InfoWindow. */
export default function TrackerTable({ positions, selectedCrewId, onSelectCrew }: TrackerTableProps) {
  const rows = CREWS.map((crew) => ({
    crew,
    position: positions.find((p) => p.crewId === crew.id) ?? null,
  }));

  function handleShow(crewId: string) {
    onSelectCrew(crewId);
    scrollToMap();
  }

  return (
    <div className="flex-none bg-white border border-asphalt-700 shadow-sm rounded p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-asphalt-300 mb-3">
        Live tracker
      </h3>

      {/* Mobile: stacked cards, comfortable to tap. */}
      <div className="flex flex-col gap-2 sm:hidden">
        {rows.map(({ crew, position }) => (
          <TrackerCard
            key={crew.id}
            crew={crew}
            position={position}
            selected={selectedCrewId === crew.id}
            onShow={() => handleShow(crew.id)}
          />
        ))}
      </div>

      {/* Desktop: compact table. */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="text-left text-asphalt-500 text-xs uppercase">
            <th className="pb-2 font-medium">Crew</th>
            <th className="pb-2 font-medium">Updated</th>
            <th className="pb-2 font-medium text-right"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ crew, position }) => (
            <tr
              key={crew.id}
              className={`border-t border-asphalt-800 ${selectedCrewId === crew.id ? 'bg-asphalt-900' : ''}`}
            >
              <td className="py-2">
                <div className="flex items-center gap-2">
                  {crew.brandLogo && BRAND_LOGOS[crew.brandLogo] && (
                    <img src={BRAND_LOGOS[crew.brandLogo]} alt="" className="w-5 h-5 object-contain" />
                  )}
                  <span className="text-asphalt-200">{crew.name}</span>
                </div>
              </td>
              <td className="py-2">
                {position ? (
                  <span className={position.stale ? 'text-rally-500' : 'text-asphalt-400'}>
                    {formatRelativeTime(position.updatedAt)}
                  </span>
                ) : (
                  <span className="text-asphalt-600">No data yet</span>
                )}
              </td>
              <td className="py-2 text-right">
                <ShowButton disabled={!position} onClick={() => handleShow(crew.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrackerCard({
  crew,
  position,
  selected,
  onShow,
}: {
  crew: Crew;
  position: CrewPosition | null;
  selected: boolean;
  onShow: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 rounded border p-2 ${
        selected ? 'border-rally-500' : 'border-asphalt-800'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {crew.brandLogo && BRAND_LOGOS[crew.brandLogo] && (
          <img src={BRAND_LOGOS[crew.brandLogo]} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-asphalt-200 text-sm truncate">{crew.name}</p>
          <p className={`text-xs ${position?.stale ? 'text-rally-500' : 'text-asphalt-500'}`}>
            {position ? formatRelativeTime(position.updatedAt) : 'No data yet'}
          </p>
        </div>
      </div>
      <ShowButton disabled={!position} onClick={onShow} />
    </div>
  );
}
