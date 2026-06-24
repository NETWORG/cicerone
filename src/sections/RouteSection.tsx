import RouteMap from '../components/RouteMap';
import { STOPS } from '../data/stops';

const COUNTRIES = [...new Set(STOPS.map((s) => s.country))];

export default function RouteSection() {
  return (
    <section id="route" className="section-pad bg-asphalt-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Route
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            {STOPS.length - 2} STOPS · {COUNTRIES.length} COUNTRIES
          </h2>

          {/* Country pill row */}
          <div className="flex flex-wrap justify-center gap-2 mt-4 mb-2">
            {COUNTRIES.map((c, i) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-asphalt-700 text-asphalt-200 tracking-wider">
                  {c}
                </span>
                {i < COUNTRIES.length - 1 && (
                  <span className="text-asphalt-600 text-xs">—</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-asphalt-400 text-sm mt-3">
            Click any pin for details. The amber line shows the planned route.
          </p>
        </div>

        <RouteMap />
      </div>
    </section>
  );
}
