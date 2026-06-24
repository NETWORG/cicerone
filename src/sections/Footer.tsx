import { Flag } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-asphalt-950 border-t border-asphalt-800 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Flag size={20} strokeWidth={1.5} className="text-rally-500" />
          <div>
            <p className="font-display text-lg text-white tracking-widest">CICERONE RALLYE</p>
            <p className="text-asphalt-500 text-xs">A curated road trip · Annual</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            ['#concept', 'The Idea'],
            ['#route', 'Route'],
            ['#itinerary', 'Itinerary'],
            ['#rules', 'Rules'],
            ['#last-year', 'Last Year'],
            ['#crews', 'Crews'],
            ['#join', 'Join'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-asphalt-400 hover:text-rally-400 text-sm transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-asphalt-600 text-xs text-center md:text-right">
          © {year} Cicerone Rallye
        </p>
      </div>
    </footer>
  );
}
