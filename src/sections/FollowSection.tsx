import { Radio } from 'lucide-react';

export default function FollowSection() {
  return (
    <section id="follow" className="section-pad bg-asphalt-950">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
          Follow Along
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-white mb-6 tracking-wide">
          WATCH THE TRIP
        </h2>

        <div className="card p-10 border-dashed border-asphalt-600">
          <Radio size={40} strokeWidth={1} className="text-asphalt-500 mx-auto mb-6" />
          <p className="text-asphalt-200 text-lg font-medium mb-3">
            Live map &amp; stories — coming July 2026
          </p>
          <p className="text-asphalt-400 text-sm leading-relaxed max-w-md mx-auto">
            During the rallye we'll share our live location so you can follow the route in real time.
            Photos, stories, and breakdowns will be posted as they happen.
            Check back here once we're on the road.
          </p>
        </div>
      </div>
    </section>
  );
}

