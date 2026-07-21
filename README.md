# Cicerone Rallye

Website for the Cicerone Rallye, a summer road trip.

## Live site
`https://cicerallye.com/`

## Development

```bash
cp .env.example .env
# Add your Google Maps API key to .env
npm install
npm run dev
```

## Build & Deploy

The site deploys automatically via GitHub Actions on every push to `main`,
to an Azure Static Web App (Free tier, resource group `cicerallye`).

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

## Live photo/video uploads

Crews can share photos/videos straight from their phones at
`cicerallye.com/photos?token=<MEDIA_UPLOAD_SHARED_SECRET>`. Uploads go
direct-to-blob via a short-lived SAS URL (`POST /api/media/sas`), so file
bytes never pass through Function compute - only a small metadata call
(`POST /api/media/complete`) touches the API per upload. Geotagging comes
from the browser's Geolocation API at upload time, not EXIF. Posts publish
immediately with no moderation step; see `api/src/functions/photos.ts`,
`mediaSas.ts`, `mediaComplete.ts`, and `media.ts`. Requires the
`MEDIA_UPLOAD_SHARED_SECRET` app setting (see `api/local.settings.json.example`).
