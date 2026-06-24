import { Wrench, Wine, Atom, Mountain, CalendarDays, Map, MapPin, Camera, Users } from 'lucide-react';

export default function ConceptSection() {
  return (
    <section id="concept" className="section-pad bg-asphalt-950">
      <div className="max-w-7xl mx-auto">
        {/* The Name */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
              The Name
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-none tracking-wide">
              CURATED ROUTES.<br />
              <span className="text-rally-500">REAL PLACES.</span>
            </h2>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              <strong className="text-white">Cicerone</strong> - a guide who walks you through places worth seeing and explains why they matter. The name goes back to Cicero. The idea is that travel should teach you something, not just cover distance.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              Every stop on the route is there for a reason. A factory floor. A mountain pass. A museum that earns the detour.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed">
              Different route every year. This year it's the Alps, Northern Italy, Monaco, Southern France, Switzerland, and Germany.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { Icon: Wrench,  title: 'Machines',     body: 'Factories, circuits, alpine passes. Rooms full of things with engines. This is the main thread.' },
              { Icon: Wine,    title: 'Food & Drink',  body: 'Wine cellars, aged cheese, post-track pasta. We take food seriously.' },
              { Icon: Atom,    title: 'Science',       body: 'CERN. A Concorde on a museum rooftop. The universe is interesting and we keep proving it.' },
              { Icon: Mountain, title: 'Scenery',      body: 'Alpine passes that make you stop the car and just stand there for a while.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <Icon size={22} strokeWidth={1.25} className="text-rally-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">{title}</p>
                  <p className="text-asphalt-300 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Format */}
        <div className="border-t border-asphalt-700 pt-16">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3 text-center">
            The Format
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-12 text-center tracking-wide">
            HOW IT WORKS
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: CalendarDays,
                title: 'One week',
               body: "Seven days, mid-July. Join for the full route or just part of it. No obligation.",
              },
              {
                Icon: Map,
                title: 'Shared plan, your pace',
               body: "There's an itinerary but it's not binding. Groups can split, take detours, meet at stops. We share live location so we know where everyone is.",
              },
              {
                Icon: MapPin,
                title: 'Live tracking',
               body: 'Anyone can follow online - live map, photos and updates as they happen.',
              },
              {
                Icon: Wrench,
                title: 'Breakdowns welcome',
               body: "The car broke down twice last year. Both times we fixed it on the road. Both times it was the best part of the day.",
              },
              {
                Icon: Users,
                title: 'Cars. Beer. Computers.',
               body: "The three interests overlap almost completely. This trip is what happens when you lean into that.",
              },
              {
                Icon: Camera,
               title: 'Annual',
               body: 'Different route every year. If this one goes well, we\'ll do it again.',
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="card p-6">
                <Icon size={28} strokeWidth={1.25} className="text-rally-500 mb-4" />
                <h3 className="font-semibold text-white mb-2 text-lg">{title}</h3>
                <p className="text-asphalt-300 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
