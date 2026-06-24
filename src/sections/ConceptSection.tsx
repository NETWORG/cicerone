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
              <strong className="text-white">Cicerone</strong> — an old word for a knowledgeable guide who leads travellers through places of
              interest and explains what makes them remarkable. The word goes back to Cicero: the idea that travel should illuminate, not just cover ground.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              That's the spirit here. Every stop on the route is chosen for a reason — a factory floor worth seeing, a mountain road worth driving, a museum that earns its detour.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed">
              The promise is straightforward: <em className="text-rally-400">a vacation where you see interesting things and learn something.</em> What makes each edition unique is the itinerary.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { Icon: Wrench,  title: 'Machines',     body: 'Factories, circuits, alpine passes, and museum halls full of things with engines.' },
              { Icon: Wine,    title: 'Food & Drink',  body: 'Wine cellars, aged cheese, post-track pasta. Fuel for crew and car alike.' },
              { Icon: Atom,    title: 'Science',       body: "CERN's Large Hadron Collider. The Concorde on a rooftop. Because the universe is interesting." },
              { Icon: Mountain, title: 'Scenery',      body: 'Alpine passes that make grown adults press their face to the glass.' },
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
                body: "Seven days, mid-July. Crews join for all or part of the route — there's no obligation to do the full thing.",
              },
              {
                Icon: Map,
                title: 'Shared plan, your pace',
                body: "There's an itinerary, but it's not a race. Groups can diverge, skip stops, or add their own. We share live location so we always know where everyone is.",
              },
              {
                Icon: MapPin,
                title: 'Live tracking',
                body: 'Anyone can follow the trip online — live map, photos, and stories posted as they happen.',
              },
              {
                Icon: Wrench,
                title: 'Breakdowns welcome',
                body: "Our car broke down twice on a previous trip. Both times we fixed it roadside. Both times it was the highlight of the day. We're not joking.",
              },
              {
                Icon: Users,
                title: 'Cars. Beer. Computers.',
                body: "The Venn diagram of our interests is basically a circle. This trip is what happens when you combine all of them into a vacation.",
              },
              {
                Icon: Camera,
                title: 'Annual & evolving',
                body: 'Every year, a different route. Every edition, a different theme. The spirit stays the same.',
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
