import { Mail, Tag, Users, Car, CalendarDays, HelpCircle } from 'lucide-react';

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
    a: 'No. Join for a day, a leg, or the whole week. The itinerary is open.',
  },
  {
    q: 'What car should I bring?',
    a: 'Something interesting. Cheap, old, or just characterful. A completely standard car is fine but boring. A truly questionable car is perfect.',
  },
  {
    q: 'What if my car breaks down?',
    a: "Good. Bring tools and know roughly how your car works. It's part of the trip.",
  },
  {
    q: 'Is it expensive?',
    a: "That's up to you. Costs are accommodation, fuel, food, entry fees. We don't run a shared budget - everyone handles their own.",
  },
  {
    q: 'Can I bring friends or family?',
    a: 'Yes. Crews of any size are welcome.',
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
          <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 mb-4 tracking-wide">
            JOIN THE RALLYE
          </h2>
          <p className="text-asphalt-300 text-base max-w-xl mx-auto">
            Send us an email with your crew details. We'll reply with what you need to know.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* CTA card */}
          <div className="card p-8 flex flex-col items-center text-center gap-6">
            <Mail size={40} strokeWidth={1} className="text-rally-500" />
            <div>
              <p className="text-asphalt-100 font-semibold text-lg mb-2">Drop us a line</p>
              <p className="text-asphalt-400 text-sm mb-6">
                Tell us about your crew and car. We'll get back to you.
              </p>
              <a href={MAILTO_HREF} className="btn-primary text-base w-full justify-center">
                Sign up by email
              </a>
              <p className="text-asphalt-500 text-xs mt-3">{SIGNUP_EMAIL}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-semibold text-asphalt-100 text-sm uppercase tracking-widest">
              Include in your email:
            </p>
            {[
              { Icon: Tag,          label: 'Crew name',  desc: 'Something memorable. Or your surname. Up to you.' },
              { Icon: Users,        label: 'Members',    desc: "First names, or full names if you'd like to be on the crew list." },
              { Icon: Car,          label: 'Car',        desc: "Make, model, year — and any relevant notes (condition, modifications, risk level)." },
              { Icon: CalendarDays, label: 'Dates',      desc: 'Full route, or which legs you plan to join.' },
              { Icon: HelpCircle,   label: 'Questions',  desc: "Anything you're unsure about." },
            ].map(({ Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={18} strokeWidth={1.25} className="text-rally-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-asphalt-100 text-sm">{label}</p>
                  <p className="text-asphalt-400 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="font-display text-3xl text-asphalt-100 mb-6 tracking-wide">FAQ</h3>
          <div className="flex flex-col gap-4">
            {FAQ.map((item) => (
              <div key={item.q} className="card p-5">
                <p className="font-semibold text-asphalt-100 mb-2 text-sm">{item.q}</p>
                <p className="text-asphalt-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
