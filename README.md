# Cicerone Rallye — Transalpine Edition 2026

Website for the Cicerone Rallye, a modern Grand Tour road trip. Built with Vite + React + TypeScript + Tailwind CSS v4, deployed to GitHub Pages.

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

### Google Maps API key

1. Create a key at https://console.cloud.google.com/apis/credentials
2. Enable the **Maps JavaScript API**
3. Restrict the key to HTTP referrers: `https://networg.github.io/*` (and `http://localhost:*` for local dev)
4. Add it as a repository secret: **Settings → Secrets → Actions → New secret** → name `VITE_GOOGLE_MAPS_API_KEY`

Without the key the site still builds and renders — the map section shows a placeholder.

### Optional custom domain

1. Add a `CNAME` file to the `public/` folder containing your domain (e.g. `rallye.networg.com`)
2. Configure DNS: CNAME record pointing to `networg.github.io`
3. Enable HTTPS in repo Settings → Pages
4. Update `base` in `vite.config.ts` to `'/'` if using a custom domain (instead of `'/cicerone/'`)

## Adding next year's edition

1. Add a new entry to `src/data/editions.ts` (set `active: true`, previous one to `false`)
2. Update stops in `src/data/stops.ts`
3. Update the hero/concept copy in the relevant section files

## Updating crew list

Edit `src/data/crews.ts` — crew cards auto-render on the Crews section.

## Content updates

| What | File |
|------|------|
| Stops / itinerary | `src/data/stops.ts` |
| Crew list | `src/data/crews.ts` |
| Editions metadata | `src/data/editions.ts` |
| Photos | `src/assets/photos/` |
| Sign-up email | `src/sections/SignupSection.tsx` |
