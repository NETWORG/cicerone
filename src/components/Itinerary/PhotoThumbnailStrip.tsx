interface Props {
  /** Photo URLs to preview, in order. */
  photos: string[];
  /** Max number of thumbnails to render. */
  max?: number;
}

/**
 * A row of small teaser photos with a fade-out edge, used to hint at the
 * full gallery hiding inside the collapsed itinerary and entice a click.
 */
export default function PhotoThumbnailStrip({ photos, max = 8 }: Props) {
  const shown = photos.slice(0, max);

  if (shown.length === 0) return null;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2 overflow-hidden">
        {shown.map((src, idx) => (
          <div
            key={idx}
            className="relative flex-1 aspect-square rounded-lg overflow-hidden border border-asphalt-700 shadow-sm"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        ))}
      </div>
      {/* Fade the last couple of thumbnails into the background to suggest "more inside" */}
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-asphalt-950 to-transparent pointer-events-none" />
    </div>
  );
}
