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

The map's route line is precomputed once (real driving directions, not a
straight line) and committed as static data in `src/data/route-path.ts`. It
is not regenerated automatically, so whenever stops are added, removed, or
reordered in `src/data/stops.ts`, regenerate it:

```bash
npm run generate:route
```

This calls the Google Directions API a handful of times (once per ~25-stop
chunk) and writes the resulting road-accurate path to
`src/data/route-path.ts` - commit that file along with your `stops.ts`
changes. The site itself never calls the Directions API at runtime, only
the Maps JavaScript API to render tiles/markers.
