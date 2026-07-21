import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Public upload page for cicerallye.com/photos (rewritten from /api/photos
 * by public/staticwebapp.config.json, same trick as /tracker ->
 * /api/tracker). Renders a self-contained HTML+JS page rather than living
 * in the React SPA since the site has no client-side router - this
 * mirrors trackerRedirect.ts.
 *
 * Upload flow performed entirely in the browser:
 *   1. POST /api/media/sas       -> get a short-lived write-only SAS URL
 *   2. PUT <file> to that SAS URL -> direct to Blob Storage, no compute
 *   3. POST /api/media/complete  -> record metadata (incl. geolocation)
 *
 * The shared upload token is read from this page's own `?token=` query
 * param and forwarded to the two API calls above - it is not looked up or
 * embedded server-side here.
 */
function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Cicerallye - share a photo</title>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; background: #14171a; color: #e6e8ea; margin: 0; padding: 24px; text-align: center; }
  h1 { font-size: 1.25rem; margin: 0 0 6px; }
  p.intro { color: #a6adb4; font-size: .9rem; max-width: 420px; margin: 0 auto 24px; line-height: 1.4; }
  .card { max-width: 420px; margin: 0 auto 16px; background: #1b1f23; border: 1px solid #2a2f34; border-radius: 10px; padding: 22px; }
  label.pick { display: block; padding: 16px; border: 2px dashed #3a4046; border-radius: 10px; cursor: pointer; color: #cfd4d8; font-weight: 600; }
  input[type=file] { display: none; }
  .status { margin-top: 14px; font-size: .85rem; color: #a6adb4; min-height: 1.2em; }
  .thumbs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; }
  .thumbs div { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #14171a; font-size: .7rem; color: #a6adb4; display: flex; align-items: center; justify-content: center; }
  .thumbs img, .thumbs video { width: 100%; height: 100%; object-fit: cover; }
  .warn { color: #e0313a; font-size: .8rem; margin-top: 10px; }
</style>
</head>
<body>
  <h1>Share a photo or video 📸</h1>
  <p class="intro">Straight from your phone to the live map on cicerallye.com. No account needed - just pick a file below.</p>
  <div class="card">
    <label class="pick" for="file">Tap to choose photo/video</label>
    <input id="file" type="file" accept="image/*,video/*" capture="environment" multiple />
    <div id="status" class="status"></div>
    <div id="thumbs" class="thumbs"></div>
  </div>
  <div id="tokenWarning" class="warn" style="display:none">
    This link is missing an upload token - ask whoever shared it with you for the full link.
  </div>

<script>
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';
  if (!token) document.getElementById('tokenWarning').style.display = 'block';

  const statusEl = document.getElementById('status');
  const thumbsEl = document.getElementById('thumbs');
  const setStatus = (msg) => { statusEl.textContent = msg; };

  function getPosition() {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
      );
    });
  }

  async function uploadOne(file) {
    const coords = await getPosition();

    setStatus('Preparing upload for ' + file.name + '...');
    const sasRes = await fetch('/api/media/sas?token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: file.type }),
    });
    if (!sasRes.ok) throw new Error(await sasRes.text());
    const { uploadUrl, blobPath, maxUploadBytes } = await sasRes.json();

    if (file.size > maxUploadBytes) throw new Error(file.name + ' is too large');

    setStatus('Uploading ' + file.name + '...');
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error('Upload failed for ' + file.name);

    setStatus('Saving ' + file.name + '...');
    const completeRes = await fetch('/api/media/complete?token=' + encodeURIComponent(token), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blobPath,
        contentType: file.type,
        lat: coords ? coords.latitude : undefined,
        lon: coords ? coords.longitude : undefined,
        capturedAt: new Date().toISOString(),
      }),
    });
    if (!completeRes.ok) throw new Error(await completeRes.text());

    const thumb = document.createElement('div');
    if (file.type.startsWith('video/')) {
      thumb.innerHTML = '<video src="' + URL.createObjectURL(file) + '" muted></video>';
    } else {
      thumb.innerHTML = '<img src="' + URL.createObjectURL(file) + '" />';
    }
    thumbsEl.prepend(thumb);
  }

  document.getElementById('file').addEventListener('change', async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      try {
        await uploadOne(file);
      } catch (error) {
        setStatus('Failed: ' + (error && error.message ? error.message : error));
        return;
      }
    }
    setStatus('All done - it should show up on the live map shortly \u{1F389}');
    event.target.value = '';
  });
</script>
</body>
</html>`;
}

export async function photos(_request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: renderPage(),
  };
}

app.http('photos', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'photos',
  handler: photos,
});
