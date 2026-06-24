import { User, Car, MapPin, CheckCircle } from 'lucide-react';
import { CREWS } from '../data/crews';

export default function CrewsSection() {
  return (
    <section id="crews" className="section-pad bg-asphalt-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Who's Coming
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 tracking-wide">
            SIGNED UP CREWS
          </h2>
          <p className="text-asphalt-400 text-sm mt-4">
            List updates as confirmations come in. Want to see your name here?{' '}
            <a href="#join" className="text-rally-400 hover:text-rally-300 underline underline-offset-2">
              Sign up below →
            </a>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CREWS.map((crew) => (
            <div
              key={crew.id}
              className={`card p-6 flex flex-col gap-3 ${
                !crew.confirmed ? 'opacity-60 border-dashed border-asphalt-600' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-asphalt-100 tracking-wide">{crew.name}</span>
                {crew.confirmed ? (
                  <span className="inline-flex items-center gap-1 category-badge bg-green-50 border border-green-300 text-green-700 text-xs">
                    <CheckCircle size={11} strokeWidth={1.5} /> Confirmed
                  </span>
                ) : (
                  <span className="category-badge border border-asphalt-600 text-asphalt-500 text-xs">
                    Spot open
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-asphalt-300 text-sm flex items-center gap-2">
                  <User size={12} strokeWidth={1.5} className="text-asphalt-500" />
                  {crew.members}
                </p>
                <p className="text-asphalt-300 text-sm flex items-center gap-2">
                  <Car size={12} strokeWidth={1.5} className="text-asphalt-500" />
                  {crew.car}
                  {crew.carYear && <span className="text-asphalt-500">· {crew.carYear}</span>}
                </p>
                {crew.carNote && (
                  <p className="text-asphalt-500 text-xs italic ml-5">{crew.carNote}</p>
                )}
                <p className="text-asphalt-300 text-sm flex items-center gap-2">
                  <MapPin size={12} strokeWidth={1.5} className="text-asphalt-500" />
                  {crew.joining}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
