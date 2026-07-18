import { useState } from 'react';
import ItineraryTeaser from '../components/Itinerary/ItineraryTeaser';
import ItineraryTimeline from '../components/Itinerary/ItineraryTimeline';

export default function ItinerarySection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="itinerary" className="section-pad bg-asphalt-950">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-rally-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Day by Day
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-asphalt-100 tracking-wide">
            ITINERARY
          </h2>
          <p className="text-asphalt-400 text-sm mt-4">
            Stops are planned, not compulsory. The spirit of the rallye is relaxed.
          </p>
        </div>

        {/* Grid-rows trick: 0fr collapses the content to zero height without
            unmounting it abruptly, 1fr reveals it, both animated smoothly.
            `inert` on the hidden panel keeps its buttons/links out of tab
            order and off the a11y tree while it's visually collapsed. */}
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
        >
          <div
            className={`overflow-hidden min-h-0 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            inert={!isOpen}
          >
            <ItineraryTimeline onCollapse={() => setIsOpen(false)} />
          </div>
        </div>

        <div
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: isOpen ? '0fr' : '1fr' }}
        >
          <div
            className={`overflow-hidden min-h-0 transition-opacity duration-500 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            inert={isOpen}
          >
            <ItineraryTeaser onExpand={() => setIsOpen(true)} />
          </div>
        </div>
      </div>
    </section>
  );
}
