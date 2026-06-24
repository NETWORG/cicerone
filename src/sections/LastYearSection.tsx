import photo1 from '../assets/photos/rally-2025-1.jpg';
import photo2 from '../assets/photos/rally-2025-2.jpg';
import photo3 from '../assets/photos/rally-2025-3.jpg';
import photo4 from '../assets/photos/rally-2025-4.jpg';
import photo5 from '../assets/photos/rally-2025-5.jpg';

const PHOTOS = [photo1, photo2, photo3, photo4, photo5];

const PHOTO_ALTS = [
  'Open road through the Baltics, 2025',
  'Crew and cars at a roadside stop',
  'Roadside moment — taking stock',
  'Scenic stop, Baltic coast',
  'Evening parking — the fleet',
];

export default function LastYearSection() {
  return (
    <section id="last-year" className="section-pad bg-asphalt-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Where it Started
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            LAST YEAR'S TRIP
          </h2>
          <p className="text-asphalt-300 text-base max-w-2xl mx-auto">
            Last summer we drove from Prague through Poland, Lithuania, and Latvia and back. About 3,000 km in cars that had no business doing 3,000 km. It was good enough that we decided to make it a regular thing and invite more people.
          </p>
        </div>

        {/* Photo grid — mosaic layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
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

          <div className="card p-8 max-w-3xl mx-auto border-rally-500/30">
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
