import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Crews shown on the /tracker picker page, in display order. Keep in sync
 * with `VALID_CREW_IDS` (crewIds.ts) and `src/data/crews.ts` at the repo
 * root.
 */
const CREWS: { id: string; name: string }[] = [
  { id: 'crew-e30-polaris', name: 'Team Polaris' },
  { id: 'crew-megane', name: 'Team Megane' },
  { id: 'crew-eos', name: 'Team Eos' },
  { id: 'crew-ereso', name: 'Team Ereso' },
];

// Battery-friendly defaults for a multi-day road trip: no GPS-always-on,
// no wake lock, and infrequent updates (every 200m while moving, or a
// heartbeat every 5 minutes while stationary).
const TRACCAR_PARAMS =
  'accuracy=medium&distance=200&interval=60&heartbeat=300&buffer=true&wakelock=false&stop_detection=true';

const APP_STORE_URL = 'https://apps.apple.com/app/traccar-client/id843156974';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=org.traccar.client';

function renderPage(cards: { name: string; deepLink: string; manualUrl: string; deviceId: string }[]): string {
  const cardsHtml = cards
    .map(
      (c) => `
  <div class="card">
    <h2>${c.name}</h2>
    <a class="button" href="${c.deepLink}">Open Traccar Client</a>
    <details>
      <summary>Manual setup</summary>
      <p><strong>Server URL</strong></p>
      <code>${c.manualUrl}</code>
      <p><strong>Device Identifier</strong></p>
      <code>${c.deviceId}</code>
    </details>
  </div>`,
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cicerallye tracking setup</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #14171a; color: #e6e8ea; margin: 0; padding: 24px; text-align: center; }
  h1 { font-size: 1.25rem; margin-bottom: .25rem; }
  h2 { font-size: 1.05rem; margin: 0 0 10px; }
  p.intro { color: #a6adb4; font-size: .9rem; max-width: 420px; margin: 0 auto 24px; line-height: 1.4; }
  .install { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 420px; margin: 0 auto 24px; }
  a.store-button { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: #262b30; border: 1px solid #3a4046; color: #e6e8ea; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: .85rem; }
  .card { max-width: 420px; margin: 0 auto 16px; background: #1b1f23; border: 1px solid #2a2f34; border-radius: 10px; padding: 18px; }
  a.button { display: inline-block; margin: 4px 0 8px; padding: 12px 26px; background: #e0313a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; }
  details { text-align: left; margin-top: 8px; }
  summary { cursor: pointer; color: #a6adb4; font-size: .85rem; }
  code { display: block; background: #14171a; padding: 8px; border-radius: 6px; margin: 6px 0; word-break: break-all; font-size: .75rem; color: #cfd4d8; }
  p strong { font-size: .8rem; color: #a6adb4; }
</style>
</head>
<body>
  <h1>Cicerallye live tracking setup</h1>
  <p class="intro">1. Install Traccar Client. 2. Tap your crew below to configure it automatically.</p>
  <div class="install">
    <a class="store-button" href="${APP_STORE_URL}">📱 App Store (iOS)</a>
    <a class="store-button" href="${PLAY_STORE_URL}">🤖 Google Play (Android)</a>
  </div>
  ${cardsHtml}
</body>
</html>`;
}

export async function trackerRedirect(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const secret = process.env.TRACK_SHARED_SECRET;
  if (!secret) {
    context.error('TRACK_SHARED_SECRET is not configured - cannot build tracker links');
    return { status: 500, body: 'Tracking is not configured' };
  }

  const serverUrl = `https://cicerallye.com/api/track?token=${secret}`;
  const encodedUrl = encodeURIComponent(serverUrl);

  const cards = CREWS.map((crew) => ({
    name: crew.name,
    manualUrl: serverUrl,
    deviceId: crew.id,
    deepLink: `org.traccar.client://configure?url=${encodedUrl}&id=${crew.id}&${TRACCAR_PARAMS}`,
  }));

  return {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: renderPage(cards),
  };
}

app.http('trackerRedirect', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tracker',
  handler: trackerRedirect,
});
