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
              A MODERN<br />
              <span className="text-rally-500">GRAND TOUR</span>
            </h2>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              <strong className="text-white">Cicerone</strong> — an old word for a knowledgeable guide who leads travellers through places of
              interest and explains what makes them remarkable. Derived from Cicero: the embodiment of learning and eloquence.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed mb-4">
              <strong className="text-white">The Grand Tour</strong> was the classic 17th–19th century educational journey across Europe —
              Italy at its heart — undertaken as a rite of passage, traditionally in the company of a cicerone.
            </p>
            <p className="text-asphalt-300 text-base leading-relaxed">
              We are the cicerones. Every edition is a curated route through machines, food, science, and scenery.
              The promise is simple: <em className="text-rally-400">a nice vacation where you see interesting things and learn something.</em>
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {[
              { icon: '🚗', title: 'Machines', body: 'Factories, race circuits, mountain passes, and museum halls full of things with engines.' },
              { icon: '🍷', title: 'Food & Drink', body: 'Wine museums, Parmigiano tastings, post-track pasta. Fuel for crew and car alike.' },
              { icon: '⚛️', title: 'Science', body: "CERN's Large Hadron Collider. The Concorde on a rooftop. Because the universe is interesting." },
              { icon: '⛰️', title: 'Scenery', body: 'Alpine passes that make grown adults press their face to the glass like a seven-year-old.' },
            ].map((item) => (
              <div key={item.title} className="card p-5 flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-asphalt-300 text-sm leading-relaxed">{item.body}</p>
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
                icon: '📅',
                title: 'One week',
                body: 'We run for seven days, mid-July. Crews join for all or part of the route — there\'s no commitment to the full thing.',
              },
              {
                icon: '🗺️',
                title: 'Shared plan, your pace',
                body: 'There\'s an itinerary, but it\'s not a race. Groups can diverge, skip stops, or add their own. We share live location so we always know where everyone is.',
              },
              {
                icon: '📍',
                title: 'Live tracking',
                body: 'Everyone can follow the trip online — live map, photos, and stories posted along the way.',
              },
              {
                icon: '🔧',
                title: 'Breakdowns welcome',
                body: 'Last year our car broke down twice. Both times we fixed it on the road. It was the highlight of the trip. We\'re not joking.',
              },
              {
                icon: '🍺',
                title: 'Car guys. Beer guys. Computer guys.',
                body: 'The Venn diagram of our interests is basically a circle. This trip is what happens when you combine all of them into a vacation.',
              },
              {
                icon: '🌍',
                title: 'Annual & evolving',
                body: 'Every year, a different route. Edition I went to the Baltics. Edition II crosses the Alps. Edition III is already being argued about.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-semibold text-white mb-2 text-lg">{item.title}</h3>
                <p className="text-asphalt-300 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
