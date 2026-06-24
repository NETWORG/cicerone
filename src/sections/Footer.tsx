export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 border-t border-ink-800 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div>
          <p className="font-display text-lg text-white tracking-widest">CICERONE RALLYE</p>
          <p className="text-ink-500 text-xs mt-0.5">A road trip · Annual</p>
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
              className="text-ink-300 hover:text-white text-sm transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-ink-500 text-xs text-center md:text-right">
          © {year} Cicerone Rallye
        </p>
      </div>
    </footer>
  );
}
