const SIGNUP_EMAIL = 'adam.prokop@networg.com';

const MAILTO_SUBJECT = encodeURIComponent('Cicerone Rallye 2026 — Sign Up');
const MAILTO_BODY = encodeURIComponent(
  `Hi,

I'd like to join the Cicerone Rallye — Transalpine Edition 2026.

Crew name: 
Members: 
Car (make, model, year): 
Car note (anything interesting / relevant):
Dates joining: [Full route / From ___ / To ___]
Questions: 

See you on the road!
`
);

const MAILTO_HREF = `mailto:${SIGNUP_EMAIL}?subject=${MAILTO_SUBJECT}&body=${MAILTO_BODY}`;

const FAQ = [
  {
    q: 'Do I need to do the full route?',
    a: 'Absolutely not. Join for a day, a leg, or the whole week. The itinerary is open.',
  },
  {
    q: 'What car should I bring?',
    a: 'Something interesting. The spirit is cheap, old, or characterful. A normal car is fine but boring. A truly questionable car is peak.',
  },
  {
    q: 'What if my car breaks down?',
    a: 'Ideal. We strongly recommend bringing basic tools and knowing roughly how your car works. Breakdowns are features, not bugs.',
  },
  {
    q: 'Is it expensive?',
    a: 'That\'s up to you. Costs are accommodation, fuel, food, entry fees. We don\'t run a shared budget — everyone handles their own finances.',
  },
  {
    q: 'Can I bring friends or family?',
    a: 'Yes. Crews of any size or composition are welcome.',
  },
];

export default function SignupSection() {
  return (
    <section id="join" className="section-pad bg-asphalt-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Ready?
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            JOIN THE RALLYE
          </h2>
          <p className="text-asphalt-300 text-base max-w-xl mx-auto">
            Send us an email with your details. We'll get back to you with anything you need to know
            before departure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* CTA card */}
          <div className="card p-8 flex flex-col items-center text-center gap-6">
            <span className="text-6xl">✉️</span>
            <div>
              <p className="text-white font-semibold text-lg mb-2">Drop us a line</p>
              <p className="text-asphalt-400 text-sm mb-6">
                Tell us your crew name, car, and which dates you plan to join. We'll handle the rest.
              </p>
              <a href={MAILTO_HREF} className="btn-primary text-base w-full justify-center">
                Sign up by email →
              </a>
              <p className="text-asphalt-500 text-xs mt-3">{SIGNUP_EMAIL}</p>
            </div>
          </div>

          {/* What to include */}
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-white text-sm uppercase tracking-widest">
              Include in your email:
            </p>
            {[
              ['🏷️', 'Crew name', 'Something memorable. Or your surname. Up to you.'],
              ['👥', 'Members', 'First names, or full names if you\'d like to be on the crew list.'],
              ['🚗', 'Car', 'Make, model, year — and any relevant notes (condition, modifications, risk level).'],
              ['📅', 'Dates', 'Full route, or which legs you plan to join.'],
              ['❓', 'Questions', 'Anything you\'re unsure about.'],
            ].map(([emoji, label, desc]) => (
              <div key={label} className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{emoji}</span>
                <div>
                  <p className="font-medium text-white text-sm">{label}</p>
                  <p className="text-asphalt-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="font-display text-3xl text-white mb-6 tracking-wide">FAQ</h3>
          <div className="flex flex-col gap-4">
            {FAQ.map((item) => (
              <div key={item.q} className="card p-5">
                <p className="font-semibold text-white mb-2 text-sm">{item.q}</p>
                <p className="text-asphalt-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
