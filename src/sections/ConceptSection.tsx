import { Wrench, Mountain, CalendarDays, Map, MapPin, Users, Banknote } from 'lucide-react';

export default function ConceptSection() {
  return (
    <section id="concept" className="section-pad bg-asphalt-950">
      <div className="max-w-7xl mx-auto">
        {/* The Idea */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
              The Idea
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 mb-6 leading-none tracking-wide">
              NOT YOUR USUAL<br />
              <span className="text-rally-500">VACATION.</span>
            </h2>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              <strong>Cicerone Rallye</strong> is a week on the road in fun, old, unreliable cars with a decent chance something will need fixing.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              We drive thousands of kilometers and stop at interesting places along the way. Going by car lets us experience a lot in one week without turning it into a polished tour.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed">
              We travel in multiple crews because it is more fun, keep the costs sensible, and keep the plan easy.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { Icon: Wrench,   title: 'Questionable cars', body: 'Cheap, old, interesting, slightly broken, or all of the above.' },
              { Icon: Mountain, title: 'A lot in a week',   body: 'Alpine roads, small towns, museums, factories, food stops, and whatever looks worth pulling over for.' },
              { Icon: Users,    title: 'Multiple crews',    body: 'More cars means more stories, more help when something fails, and better evenings.' },
              { Icon: Banknote, title: 'Low-cost by design', body: 'No luxury package. Keep it simple, split what makes sense, and spend money where it is worth it.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <Icon size={22} strokeWidth={1.25} className="text-rally-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-asphalt-100 mb-1">{title}</p>
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
          <h2 className="font-display text-4xl md:text-5xl text-asphalt-100 mb-12 text-center tracking-wide">
            HOW IT WORKS
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                Icon: CalendarDays,
                title: 'One week',
               body: "A week in July. Long enough to cover real distance, short enough to fit around normal life.",
              },
              {
                Icon: Map,
                title: 'Shared plan, your pace',
               body: "There's a rough itinerary, but it is not binding. Groups can split, take detours, meet at stops, or skip things.",
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
               title: 'More crews, more fun',
               body: 'We travel loosely together. Enough coordination to help each other, enough freedom that it still feels like a vacation.',
              },
              {
               Icon: Banknote,
               title: 'Keep it easy',
               body: 'No big entry fee, no strict program, no overthinking. Fuel, food, rooms, tools, and the road.',
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="card p-6">
                <Icon size={28} strokeWidth={1.25} className="text-rally-500 mb-4" />
                <h3 className="font-semibold text-asphalt-100 mb-2 text-lg">{title}</h3>
                <p className="text-asphalt-300 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
