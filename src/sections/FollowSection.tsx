import { Radio, Camera } from 'lucide-react';
import PhotoStream from '../components/PhotoStream';

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

        <div className="card p-8 sm:p-10 border-dashed border-asphalt-600">
          <Radio size={40} strokeWidth={1} className="text-asphalt-500 mx-auto mb-6" />
          <p className="text-asphalt-100 text-lg font-medium mb-3">Live now</p>
          <p className="text-asphalt-400 text-sm leading-relaxed max-w-md mx-auto mb-6">
            Scroll up for the live map. Below is the live photo/video stream, straight from the
            crews' phones. Also check our Instagram Stories for daily highlights.
          </p>
          <a href="/photos" className="btn-primary inline-flex items-center gap-2 mb-8">
            <Camera size={16} strokeWidth={1.75} />
            Share a photo from your phone
          </a>

          <PhotoStream />
        </div>
      </div>
    </section>
  );
}


