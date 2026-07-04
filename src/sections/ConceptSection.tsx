import { Wrench, Mountain, Map, Users, MapPin, Banknote, CheckCircle } from 'lucide-react';

const CARDS = [
  {
    Icon: Wrench,
    title: 'Cheap, old, or characterful',
    body: 'Any car works if it is interesting. A Ferrari is welcome but would look a bit out of place next to someone\'s 200k km classic.',
  },
  {
    Icon: Wrench,
    title: 'Breakdowns welcome',
    body: 'Old cars fail sometimes. When they do, we fix them on the road ourselves. Bring more tools than you think you need and know roughly how your car works.',
  },
  {
    Icon: Map,
    title: 'Shared plan, your pace',
    body: 'There\'s a rough itinerary, but it is not binding. Split off, take detours, meet at stops, or skip things. We share live location so everyone can find each other.',
  },
  {
    Icon: Users,
    title: 'Multiple crews',
    body: 'We travel loosely together in more than one car. More stories, more help when something fails, better evenings.',
  },
  {
    Icon: MapPin,
    title: 'Live tracking',
    body: 'Anyone can follow along online - live map, photos, and updates as they happen.',
  },
  {
    Icon: Banknote,
    title: 'Low-cost by design',
    body: 'No luxury package, no shared budget. Keep it simple, split what makes sense, spend money where it is worth it.',
  },
];

const WHAT_TO_BRING = [
  'Valid documents for every country on the route',
  'European breakdown kit (warning triangle, vest, first-aid)',
  'Vignettes for Austria and Switzerland - mandatory',
  'Basic tools and spare fluids for your specific car',
  'Cash - some alpine passes and toll booths don\'t take cards',
  'A dashcam (you will want the footage)',
  'Sense of humour',
];

export default function ConceptSection() {
  return (
    <section id="concept" className="section-pad bg-asphalt-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
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
              Not many rules. But the ones we have, we take seriously.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {CARDS.map(({ Icon, title, body }) => (
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

        {/* What to bring */}
        <div className="border-t border-asphalt-700 pt-16">
          <div className="card p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Mountain size={22} strokeWidth={1.25} className="text-rally-500" />
              <h3 className="font-display text-2xl text-asphalt-100 tracking-wide">
                WHAT TO BRING
              </h3>
            </div>
            <ul className="flex flex-col gap-3">
              {WHAT_TO_BRING.map((item) => (
                <li key={item} className="flex items-start gap-3 text-asphalt-300 text-sm">
                  <CheckCircle size={14} strokeWidth={1.5} className="text-rally-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
