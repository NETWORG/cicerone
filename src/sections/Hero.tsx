import photo1 from '../assets/photos/rally-2025-1.jpg';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src={photo1}
          alt="Cicerone Rallye — open road"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Edition badge */}
        <div className="inline-flex items-center gap-2 bg-rally-500/10 border border-rally-500/30 text-rally-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span>🏁</span>
          <span>Edition II · July 2026</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-white leading-none mb-4 tracking-widest">
          CICERONE<br />
          <span className="text-rally-500">RALLYE</span>
        </h1>

        <p className="font-display text-2xl sm:text-3xl text-asphalt-200 tracking-wider mb-4">
          TRANSALPINE EDITION 2026
        </p>

        <p className="text-asphalt-300 text-base sm:text-lg max-w-2xl mx-auto mb-2">
          A modern Grand Tour. Alps → Italy → Monaco → France → Switzerland → Germany.
        </p>
        <p className="text-asphalt-400 text-sm sm:text-base max-w-xl mx-auto mb-10">
          17 – 25 July 2026 · Fun cars welcome. Breakdowns expected.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#join" className="btn-primary text-base px-8 py-4">
            Join the Rallye →
          </a>
          <a href="#route" className="btn-outline text-base px-8 py-4">
            See the Route
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-asphalt-400 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
