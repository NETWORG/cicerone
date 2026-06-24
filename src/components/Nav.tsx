import { useState, useEffect } from 'react';
import { Flag, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#concept', label: 'The Idea' },
  { href: '#route', label: 'Route' },
  { href: '#itinerary', label: 'Itinerary' },
  { href: '#rules', label: 'Rules' },
  { href: '#last-year', label: 'Last Year' },
  { href: '#crews', label: 'Crews' },
  { href: '#join', label: 'Join' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-asphalt-950/95 backdrop-blur border-b border-asphalt-700 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <Flag size={18} strokeWidth={1.5} className="text-rally-500 group-hover:text-rally-400 transition-colors" />
          <span className="font-display text-xl tracking-widest text-white group-hover:text-rally-400 transition-colors">
            CICERONE RALLYE
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-asphalt-200 hover:text-rally-400 transition-colors rounded-lg hover:bg-asphalt-800"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <a href="#join" className="btn-primary text-sm px-4 py-2">
              Join →
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-asphalt-200 hover:text-white hover:bg-asphalt-800 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-asphalt-900 border-t border-asphalt-700 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={close}
                  className="block px-3 py-3 text-sm font-medium text-asphalt-200 hover:text-rally-400 hover:bg-asphalt-800 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a href="#join" onClick={close} className="btn-primary w-full justify-center">
                Join the Rallye →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
