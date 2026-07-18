import { CATEGORIES } from '../../data/stops';
import { LEGEND_CATEGORIES } from './categories';
import CategoryIcon from './CategoryIcon';

/** Desktop legend, overlaid on the map itself. */
export default function MapLegend() {
  return (
    <div className="hidden sm:flex absolute bottom-3 left-3 bg-white/95 backdrop-blur border border-asphalt-700 rounded p-3 flex-col gap-1.5 shadow-md">
      {LEGEND_CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center gap-2 text-xs text-asphalt-300">
          <CategoryIcon category={cat} />
          <span>{CATEGORIES[cat].label}</span>
        </div>
      ))}
    </div>
  );
}
