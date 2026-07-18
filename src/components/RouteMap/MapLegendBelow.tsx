import { CATEGORIES } from '../../data/stops';
import { LEGEND_CATEGORIES } from './categories';
import CategoryIcon from './CategoryIcon';

/** Mobile legend, rendered below the map instead of overlaid on it. */
export default function MapLegendBelow() {
  return (
    <div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-2 bg-asphalt-900 border border-asphalt-700 rounded p-4 mt-3">
      {LEGEND_CATEGORIES.map((cat) => (
        <div key={cat} className="flex items-center gap-2 text-xs text-asphalt-300">
          <CategoryIcon category={cat} />
          <span>{CATEGORIES[cat].label}</span>
        </div>
      ))}
    </div>
  );
}
