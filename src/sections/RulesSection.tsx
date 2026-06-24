import { Banknote, Wrench, Map, Users, MapPin, Camera, CheckCircle } from 'lucide-react';

const RULES = [
  {
    Icon: Banknote,
    title: 'Cheap or old (or both)',
    body: 'We like interesting cars. Cheap, old, questionable - any of these works. A Ferrari is allowed but would feel awkward next to someone\'s 200k km Accord.',
  },
  {
    Icon: Wrench,
    title: 'Breakdowns happen',
    body: "The car broke down twice last year. Fixed it both times ourselves on the road. Bring more tools than you think you need and know roughly how your car works.",
  },
  {
    Icon: Map,
    title: 'No mandatory stops',
    body: "The itinerary is a plan, not a contract. Every stop is optional. Groups can split, skip things, add their own. We share location so everyone can find each other.",
  },
  {
    Icon: Users,
    title: 'Groups are independent',
    body: "You don't have to follow us or stay with us. Multiple crews travel loosely together, meet at planned stops, compare notes at dinner.",
  },
  {
    Icon: MapPin,
    title: 'Share your location',
    body: 'We use live location sharing. Makes coordination easy and lets people follow the trip from home.',
  },
  {
    Icon: Camera,
    title: 'Document everything',
    body: 'Photos, stories, breakdowns, food - post all of it. People following from home are part of the rallye too.',
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

export default function RulesSection() {
  return (
    <section id="rules" className="section-pad bg-asphalt-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Spirit of the Rallye
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-wide">
            THE CARS &amp; THE RULES
          </h2>
          <p className="text-asphalt-400 text-sm mt-4 max-w-xl mx-auto">
            Not many rules. But the ones we have, we take seriously.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {RULES.map(({ Icon, title, body }) => (
            <div key={title} className="card p-6">
              <Icon size={28} strokeWidth={1.25} className="text-rally-500 mb-4" />
              <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-asphalt-300 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* What to bring */}
        <div className="card p-8 max-w-2xl mx-auto">
          <h3 className="font-display text-2xl text-white mb-6 tracking-wide">
            WHAT TO BRING
          </h3>
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
    </section>
  );
}
