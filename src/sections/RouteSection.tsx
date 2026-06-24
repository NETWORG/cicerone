import RouteMap from '../components/RouteMap';
import { STOPS } from '../data/stops';

const COUNTRY_FLAG: Record<string, string> = {
  CZ: '🇨🇿', AT: '🇦🇹', IT: '🇮🇹', MC: '🇲🇨', FR: '🇫🇷', CH: '🇨🇭', DE: '🇩🇪',
};

export default function RouteSection() {
  const countries = [...new Set(STOPS.map((s) => s.country))];

  return (
    <section id="route" className="section-pad bg-asphalt-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Route
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            {STOPS.length - 2} STOPS · {countries.length} COUNTRIES
          </h2>

          {/* Country flags row */}
          <div className="flex flex-wrap justify-center gap-3 text-2xl mt-4 mb-2">
            {countries.map((c, i) => (
              <span key={c} className="flex items-center gap-1.5 text-asphalt-300 text-base">
                <span>{COUNTRY_FLAG[c]}</span>
                {i < countries.length - 1 && (
                  <span className="text-rally-500 text-xs">→</span>
                )}
              </span>
            ))}
          </div>
          <p className="text-asphalt-400 text-sm mt-2">
            Click any pin for details. Yellow line shows the planned route.
          </p>
        </div>

        <RouteMap />
      </div>
    </section>
  );
}
