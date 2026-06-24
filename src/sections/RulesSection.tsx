const RULES = [
  {
    icon: '💸',
    title: 'Cheap or old (or both)',
    body: 'We prefer cars that are interesting. The gold standard is something very cheap, very old, or very questionable. A Ferrari is welcome but it would be painfully embarrassing next to a 1997 Accord.',
  },
  {
    icon: '🔧',
    title: 'Breakdowns are the lore',
    body: 'Last year our car broke down twice on the road. Both times we fixed it ourselves. Both times it was the most memorable moment of the day. If your car is reliable, bring a toolkit anyway.',
  },
  {
    icon: '🗺️',
    title: 'No mandatory stops',
    body: "The itinerary is a plan, not a contract. Every stop is optional. Groups can split, diverge, and rejoin at any point. We share live location so everyone knows where everyone is.",
  },
  {
    icon: '🚗',
    title: 'Groups are independent',
    body: 'You don\'t have to follow us. You don\'t have to stay with us. The idea is that multiple crews travel loosely together, meet at planned stops, and share experiences after.',
  },
  {
    icon: '📍',
    title: 'Share your location',
    body: 'We use live location sharing so anyone can follow the trip online and crews can find each other without coordination overhead.',
  },
  {
    icon: '📷',
    title: 'Document everything',
    body: 'Photos, stories, breakdowns, food, views — post it all. The community of followers is part of the rallye even if they\'re not on the road.',
  },
];

const WHAT_TO_BRING = [
  'Valid documents for every country on the route',
  'European breakdown kit (warning triangle, vest, first-aid)',
  'Vignettes for Austria, Switzerland (mandatory)',
  'Basic tools + spare fluids for your specific car',
  'Cash — some things on alpine passes don\'t take cards',
  'A dashcam (you\'ll want the footage)',
  'Sense of humour (mandatory)',
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
            There aren't many. But what there are, they matter.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {RULES.map((rule) => (
            <div key={rule.title} className="card p-6">
              <span className="text-4xl mb-4 block">{rule.icon}</span>
              <h3 className="font-semibold text-white text-lg mb-2">{rule.title}</h3>
              <p className="text-asphalt-300 text-sm leading-relaxed">{rule.body}</p>
            </div>
          ))}
        </div>

        {/* What to bring */}
        <div className="card p-8 max-w-2xl mx-auto">
          <h3 className="font-display text-2xl text-white mb-6 tracking-wide">
            📦 WHAT TO BRING
          </h3>
          <ul className="flex flex-col gap-3">
            {WHAT_TO_BRING.map((item) => (
              <li key={item} className="flex items-start gap-3 text-asphalt-300 text-sm">
                <span className="text-rally-500 mt-0.5 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
