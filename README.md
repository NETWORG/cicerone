# Cicerone Rallye

Website for the Cicerone Rallye, a summer road trip.

## Live site
`https://networg.github.io/cicerone/`

## Development

```bash
cp .env.example .env
# Add your Google Maps API key to .env
npm install
npm run dev
```

## Build & Deploy

The site deploys automatically via GitHub Actions on every push to `main`.

## Route map

The map's route line is precomputed once per day (real driving directions,
not a straight line) and committed as static data in `src/data/route-segments.ts`.
It is not regenerated automatically, so whenever stops are added, removed, or
reordered in `src/data/stops.ts`, regenerate it:

```bash
npm run generate:route
```

This calls the Google Directions API once per day (chunked further if a
single day ever exceeds ~25 stops) and writes the resulting road-accurate
per-day path to `src/data/route-segments.ts` - commit that file along with
your `stops.ts` changes. The site itself never calls the Directions API at
runtime, only the Maps JavaScript API to render tiles/markers.
