#!/usr/bin/env node
/**
 * Precomputes the road-accurate route polyline for the itinerary and writes
 * it to `src/data/route-path.ts` as a static array of {lat, lng} points.
 *
 * Why: the map used to call the Directions API from every visitor's browser
 * on every page load. That's both wasteful (repeat requests for a route that
 * never changes) and was rendering an extra fallback line on top. Instead we
 * run this script once (whenever `src/data/stops.ts` changes) and commit the
 * resulting static path - the browser then just draws a plain polyline, no
 * API calls needed at runtime beyond loading the map tiles themselves.
 *
 * Usage:
 *   VITE_GOOGLE_MAPS_API_KEY=... node scripts/generate-route-path.mjs
 * (or just `npm run generate:route` if a .env file with the key is present)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stopsFile = path.join(__dirname, '../src/data/stops.ts');
const outFile = path.join(__dirname, '../src/data/route-path.ts');

// Load VITE_GOOGLE_MAPS_API_KEY from a local .env file if not already set.
function loadDotEnv() {
  if (process.env.VITE_GOOGLE_MAPS_API_KEY) return;
  try {
    const envPath = path.join(__dirname, '../.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) process.env[match[1]] ??= match[2];
    }
  } catch {
    // no .env file, that's fine - env var may already be set another way
  }
}
loadDotEnv();

const API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
if (!API_KEY) {
  console.error(
    'Missing VITE_GOOGLE_MAPS_API_KEY. Set it in the environment or in a .env file.'
  );
  process.exit(1);
}

// Extract ordered { lat, lng } coords from the STOPS array in stops.ts.
// (Simple regex extraction keeps stops.ts as the single source of truth
// without needing a TS-aware runtime for this one-off script.)
const source = readFileSync(stopsFile, 'utf-8');
const coordRegex = /coords:\s*\{\s*lat:\s*(-?[\d.]+),\s*lng:\s*(-?[\d.]+)\s*\}/g;
const stops = [];
let m;
while ((m = coordRegex.exec(source))) {
  stops.push({ lat: parseFloat(m[1]), lng: parseFloat(m[2]) });
}
console.log(`Found ${stops.length} stops in stops.ts`);

// Directions API allows a limited number of waypoints per request (~25 plus
// origin/destination). Split stops into overlapping chunks to stay under it.
const MAX_WAYPOINTS_PER_REQUEST = 23;
function chunkStops(list) {
  const chunkSize = MAX_WAYPOINTS_PER_REQUEST + 2;
  if (list.length <= chunkSize) return [list];
  const chunks = [];
  let i = 0;
  while (i < list.length - 1) {
    const end = Math.min(i + chunkSize - 1, list.length - 1);
    chunks.push(list.slice(i, end + 1));
    i = end; // overlap by one stop for continuity
  }
  return chunks;
}

// Decodes a Google encoded polyline string into [{lat, lng}, ...].
function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

async function fetchLeg(chunk) {
  const origin = `${chunk[0].lat},${chunk[0].lng}`;
  const destination = `${chunk[chunk.length - 1].lat},${chunk[chunk.length - 1].lng}`;
  const waypoints = chunk
    .slice(1, -1)
    .map((s) => `${s.lat},${s.lng}`)
    .join('|');

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);
  if (waypoints) url.searchParams.set('waypoints', waypoints);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('key', API_KEY);

  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(`Directions API error: ${data.status} - ${data.error_message ?? ''}`);
  }
  return decodePolyline(data.routes[0].overview_polyline.points);
}

async function main() {
  const chunks = chunkStops(stops);
  console.log(`Requesting ${chunks.length} route leg(s) from the Directions API...`);

  let fullPath = [];
  for (const [i, chunk] of chunks.entries()) {
    console.log(`  leg ${i + 1}/${chunks.length} (${chunk.length} stops)...`);
    const legPath = await fetchLeg(chunk);
    // Avoid duplicating the overlap point between consecutive legs.
    fullPath = fullPath.concat(i === 0 ? legPath : legPath.slice(1));
  }

  console.log(`Decoded ${fullPath.length} path points total.`);

  const body = `// AUTO-GENERATED by scripts/generate-route-path.mjs - do not edit by hand.
// Regenerate with: npm run generate:route
// This is the road-accurate driving route through all stops in stops.ts,
// precomputed once so the site never calls the Directions API at runtime.

export const ROUTE_PATH: { lat: number; lng: number }[] = ${JSON.stringify(fullPath)};
`;

  writeFileSync(outFile, body);
  console.log(`Wrote ${outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
