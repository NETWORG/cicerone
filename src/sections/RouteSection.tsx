import React from 'react';
import * as Flags from 'country-flag-icons/react/3x2';
import RouteMap from '../components/RouteMap';
import { STOPS } from '../data/stops';

const COUNTRIES = [...new Set(STOPS.map((s) => s.country))];

const COUNTRY_NAMES: Record<string, string> = {
  CZ: 'Czech Republic',
  AT: 'Austria',
  IT: 'Italy',
  MC: 'Monaco',
  FR: 'France',
  CH: 'Switzerland',
  DE: 'Germany',
};

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

          {/* Country flags row */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6 mb-2">
            {COUNTRIES.map((code, i) => {
              const Flag = (Flags as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)[code];
              return (
                <span key={code} className="flex items-center gap-3">
                  <span className="flex items-center gap-2 group relative" title={COUNTRY_NAMES[code]}>
                    {Flag && (
                      <Flag
                        className="w-9 h-6 rounded-sm shadow-md border border-white/10 transition-transform group-hover:scale-110"
                      />
                    )}
                    <span className="text-xs text-asphalt-400 font-medium tracking-wider">{code}</span>
                  </span>
                  {i < COUNTRIES.length - 1 && (
                    <span className="text-asphalt-700 text-xs select-none">—</span>
                  )}
                </span>
              );
            })}
          </div>
          <p className="text-asphalt-400 text-sm mt-4">
            Click any pin for details. The amber line shows the planned route.
          </p>
        </div>

        <RouteMap />
      </div>
    </section>
  );
}
