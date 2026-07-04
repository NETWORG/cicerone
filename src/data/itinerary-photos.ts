// Photos for itinerary stops, keyed by stop id. Not every stop has a photo
// (e.g. unbooked overnight placeholders) - consumers should handle misses.
// Files live in src/assets/photos/2026/itinerary/<stop-id>.<ext>.
const modules = import.meta.glob('../assets/photos/2026/itinerary/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

export const ITINERARY_PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const id = path.split('/').pop()!.replace(/\.[^.]+$/, '');
    return [id, url];
  })
);
