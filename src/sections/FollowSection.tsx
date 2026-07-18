import { MapPinned } from 'lucide-react';

const INSTAGRAM_HANDLE = 'networg_expedition';
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export default function FollowSection() {
  return (
    <section id="follow" className="section-pad bg-asphalt-950">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
          Follow Along
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 mb-6 tracking-wide">
          WATCH THE TRIP
        </h2>

        <div className="card p-10 border-rally-500/30">
          <span className="inline-flex items-center gap-2 rounded-full bg-rally-500/10 text-rally-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rally-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rally-500" />
            </span>
            Live now
          </span>

          <p className="text-asphalt-100 text-lg font-medium mb-3">
            The trip is happening right now.
          </p>
          <p className="text-asphalt-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Track everyone's live location on the map above, and follow{' '}
            <span className="text-asphalt-200 font-medium">@{INSTAGRAM_HANDLE}</span> on
            Instagram for photos and stories as they happen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <InstagramIcon size={18} />
              Follow @{INSTAGRAM_HANDLE}
            </a>
            <a href="#route" className="btn-outline inline-flex items-center gap-2">
              <MapPinned size={16} strokeWidth={1.75} />
              See the live map
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

