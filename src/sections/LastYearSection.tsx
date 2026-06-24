import photo1 from '../assets/photos/rally-2025-1.jpg';
import photo2 from '../assets/photos/rally-2025-2.jpg';
import photo3 from '../assets/photos/rally-2025-3.jpg';
import photo4 from '../assets/photos/rally-2025-4.jpg';
import photo5 from '../assets/photos/rally-2025-5.jpg';

const PHOTOS = [photo1, photo2, photo3, photo4, photo5];

const PHOTO_ALTS = [
  'Cicerone Rallye 2025 — open road in the Baltics',
  'Cicerone Rallye 2025 — crew and cars',
  'Cicerone Rallye 2025 — roadside moment',
  'Cicerone Rallye 2025 — scenic stop',
  'Cicerone Rallye 2025 — evening parking',
];

export default function LastYearSection() {
  return (
    <section id="last-year" className="section-pad bg-asphalt-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Edition I — 2025
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            WHERE IT STARTED
          </h2>
          <p className="text-asphalt-300 text-base max-w-2xl mx-auto">
            Inspired by the{' '}
            <a
              href="https://gumbalkan.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rally-400 hover:text-rally-300 underline underline-offset-2"
            >
              Gumbalkan 2025
            </a>
            , the first Cicerone Rallye took us from Prague to Poland, Lithuania, Latvia, and back — roughly 3,000 km
            across the Baltics in one week. The route was great. The cars were questionable. The breakdowns were legendary.
          </p>
        </div>

        {/* Photo grid — mosaic layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
          {/* Large photo takes 2 cols on md+ */}
          <div className="col-span-2 md:col-span-2 aspect-video overflow-hidden rounded-xl">
            <img src={PHOTOS[0]} alt={PHOTO_ALTS[0]} className="gallery-img" />
          </div>
          <div className="col-span-2 md:col-span-1 aspect-video md:aspect-auto overflow-hidden rounded-xl">
            <img src={PHOTOS[1]} alt={PHOTO_ALTS[1]} className="gallery-img h-full" />
          </div>
          <div className="col-span-1 aspect-video overflow-hidden rounded-xl">
            <img src={PHOTOS[2]} alt={PHOTO_ALTS[2]} className="gallery-img" />
          </div>
          <div className="col-span-1 aspect-video overflow-hidden rounded-xl">
            <img src={PHOTOS[3]} alt={PHOTO_ALTS[3]} className="gallery-img" />
          </div>
          <div className="col-span-2 md:col-span-1 aspect-video overflow-hidden rounded-xl">
            <img src={PHOTOS[4]} alt={PHOTO_ALTS[4]} className="gallery-img" />
          </div>
        </div>

        {/* Breakdown story */}
        <div className="card p-8 max-w-3xl mx-auto border-rally-500/30">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            The Breakdown Chronicles
          </p>
          <p className="text-asphalt-200 text-base leading-relaxed mb-4">
            The car broke down twice. Once on a Polish motorway, once in the middle of Lithuania.
            Both times, we fixed it ourselves — no tow truck, no calling for help. Just a toolkit,
            some YouTube, and a lot of creative language in two languages.
          </p>
          <p className="text-asphalt-300 text-sm leading-relaxed">
            The repairs took hours. They were genuinely the best moments of the trip. Nothing bonds a
            crew like standing by the side of a road at 35°C arguing about whether the problem is the
            alternator or the serpentine belt (it was the serpentine belt).
          </p>
        </div>
      </div>
    </section>
  );
}
