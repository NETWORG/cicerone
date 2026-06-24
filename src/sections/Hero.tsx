import { ChevronDown, Flag } from 'lucide-react';
import photo1 from '../assets/photos/2025/2025-16.jpg';

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
          alt="Open road"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Edition badge */}
        <div className="inline-flex items-center gap-2 border border-white/50 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <Flag size={14} strokeWidth={1.5} />
          <span>Transalpine Edition · 18–26 Jul 2026</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-white leading-none mb-4 tracking-widest">
          CICERONE<br />
          <span className="text-rally-500">RALLYE</span>
        </h1>

        <p className="font-display text-2xl sm:text-3xl text-white/70 tracking-wider mb-4">
          TRANSALPINE EDITION 2026
        </p>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-2">
          Alps — Italy — Monaco — France — Switzerland — Germany
        </p>
        <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-10">
          18–26 July 2026 · Fun cars. Great places. Breakdowns welcome.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#join" className="btn-primary text-base px-8 py-4">
            Join the Rallye
          </a>
          <a href="#route" className="inline-flex items-center gap-2 rounded font-semibold transition-all duration-150 cursor-pointer select-none border-2 border-white text-white px-8 py-4 text-base hover:bg-white hover:text-asphalt-100 active:scale-95">
            See the Route
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={18} strokeWidth={1.5} />
      </div>
    </section>
  );
}
