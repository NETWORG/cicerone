import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Short, easy-to-share slugs for each crew, used in
 * https://cicerallye.com/tracker/<slug> links. Keep in sync with
 * `VALID_CREW_IDS` (crewIds.ts) and `src/data/crews.ts` at the repo root.
 */
const SLUG_TO_CREW: Record<string, { id: string; name: string }> = {
  polaris: { id: 'crew-e30-polaris', name: 'Team Polaris' },
  megane: { id: 'crew-megane', name: 'Team Megane' },
  eos: { id: 'crew-eos', name: 'Team Eos' },
  ereso: { id: 'crew-ereso', name: 'Team Ereso' },
};

// Battery-friendly defaults for a multi-day road trip: no GPS-always-on,
// no wake lock, and infrequent updates (every 200m while moving, or a
// heartbeat every 5 minutes while stationary).
const TRACCAR_PARAMS =
  'accuracy=medium&distance=200&interval=60&heartbeat=300&buffer=true&wakelock=false&stop_detection=true';

function renderPage(deepLink: string, crewName: string, manualUrl: string, deviceId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cicerallye tracking setup - ${crewName}</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #14171a; color: #e6e8ea; margin: 0; padding: 24px; text-align: center; }
  h1 { font-size: 1.25rem; margin-bottom: .5rem; }
  p { color: #a6adb4; font-size: .95rem; line-height: 1.4; }
  a.button { display: inline-block; margin: 16px 0; padding: 14px 28px; background: #e0313a; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; }
  code { display: block; background: #1f2327; padding: 10px; border-radius: 6px; margin: 8px 0; word-break: break-all; font-size: .8rem; color: #cfd4d8; }
  .manual { text-align: left; max-width: 420px; margin: 24px auto 0; border-top: 1px solid #2a2f34; padding-top: 16px; }
  .manual h2 { font-size: .95rem; margin-bottom: 8px; }
</style>
</head>
<body>
  <h1>Setting up tracking for ${crewName}</h1>
  <p>Opening Traccar Client&hellip; if nothing happens, make sure Traccar Client is installed, then tap the button below.</p>
  <a class="button" href="${deepLink}" id="open-link">Open Traccar Client</a>
  <div class="manual">
    <h2>Manual setup (if the button doesn't work)</h2>
    <p>In Traccar Client, open Settings and enter:</p>
    <p><strong>Server URL</strong></p>
    <code>${manualUrl}</code>
    <p><strong>Device Identifier</strong></p>
    <code>${deviceId}</code>
  </div>
  <script>
    window.location.replace(${JSON.stringify(deepLink)});
  </script>
</body>
</html>`;
}

export async function trackerRedirect(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const slug = (request.params.slug || '').toLowerCase();
  const crew = SLUG_TO_CREW[slug];

  if (!crew) {
    context.warn(`Unknown tracker slug requested: ${slug}`);
    return { status: 404, body: 'Unknown tracker link' };
  }

  const secret = process.env.TRACK_SHARED_SECRET;
  if (!secret) {
    context.error('TRACK_SHARED_SECRET is not configured - cannot build tracker link');
    return { status: 500, body: 'Tracking is not configured' };
  }

  const serverUrl = `https://cicerallye.com/api/track?token=${secret}`;
  const encodedUrl = encodeURIComponent(serverUrl);
  const deepLink = `org.traccar.client://configure?url=${encodedUrl}&id=${crew.id}&${TRACCAR_PARAMS}`;

  return {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: renderPage(deepLink, crew.name, serverUrl, crew.id),
  };
}

app.http('trackerRedirect', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'tracker/{slug}',
  handler: trackerRedirect,
});
