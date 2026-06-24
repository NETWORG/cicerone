import PhotoCarousel from '../components/PhotoCarousel';

export default function LastYearSection() {
  return (
    <section id="last-year" className="section-pad bg-asphalt-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Where it Started
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 mb-4 tracking-wide">
            LAST YEAR'S TRIP
          </h2>
          <p className="text-asphalt-300 text-base max-w-2xl mx-auto">
            Last summer a group of us joined <a href="https://gumbalkan.cz/" target="_blank" rel="noopener noreferrer" className="text-rally-400 hover:text-rally-300 transition-colors">Gumbalkan</a> - a road trip rally through Poland, Lithuania, and Latvia. It was a good time. Good enough that we wanted to do something similar ourselves, just smaller and on our own terms. So here we are.
          </p>
        </div>

        <PhotoCarousel />

        <div className="card p-8 max-w-3xl mx-auto mt-10 border-rally-500/30">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Breakdown Chronicles
          </p>
          <p className="text-asphalt-200 text-base leading-relaxed mb-4">
            The car broke down twice. Once in Poland, once in Lithuania.
          </p>
          <p className="text-asphalt-300 text-sm leading-relaxed mb-3">
            Both times we fixed it ourselves. No tow truck. Just tools, some YouTube, and a lot of patience. The second repair took the better part of an afternoon.
          </p>
          <p className="text-asphalt-300 text-sm leading-relaxed">
            It was the best part of the trip. We're not entirely sure what that says about us.
          </p>
        </div>
      </div>
    </section>
  );
}
