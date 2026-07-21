import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Public upload page for cicerallye.com/photos (rewritten from /api/photos
 * by public/staticwebapp.config.json, same trick as /tracker ->
 * /api/tracker). Renders a self-contained HTML+JS page rather than living
 * in the React SPA since the site has no client-side router - this
 * mirrors trackerRedirect.ts.
 *
 * Upload flow performed entirely in the browser:
 *   1. Try to read a geotag straight out of the file's EXIF data (works
 *      for JPEGs - covers most photos picked from the library, since
 *      those weren't necessarily just taken here). If that's missing
 *      (HEIC/video/no geotag), show a Google Maps picker so the uploader
 *      can drop a pin themselves, or skip it entirely.
 *   2. POST /api/media/sas        -> get a short-lived write-only SAS URL
 *   3. PUT <file> to that SAS URL -> direct to Blob Storage, no compute
 *   4. POST /api/media/complete   -> record metadata (incl. location)
 *
 * The shared upload token is read from this page's own `?token=` query
 * param and forwarded to the two API calls above - it is not looked up or
 * embedded server-side here.
 */
function renderPage(mapsApiKey: string | undefined): string {
  // The Maps JS API key is already public (same one baked into the main
  // site's bundle, restricted by HTTP referrer) - safe to inline here too.
  // It's only used to lazy-load the picker when a photo has no geotag, so
  // most uploads (which have EXIF GPS) never trigger a Maps load at all.
  const mapsKeyLiteral = JSON.stringify(mapsApiKey ?? '');

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
  .modalOverlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 1000; }
  .modalCard { background: #1b1f23; border: 1px solid #2a2f34; border-radius: 12px; padding: 18px; max-width: 420px; width: 100%; text-align: left; }
  .modalTitle { margin: 0 0 4px; font-weight: 600; }
  .modalSub { margin: 0 0 12px; font-size: .8rem; color: #a6adb4; line-height: 1.4; }
  .pickerMap { width: 100%; height: 220px; border-radius: 8px; margin-bottom: 12px; background: #14171a; }
  .modalActions { display: flex; flex-direction: column; gap: 8px; }
  .modalActions button { padding: 10px; border-radius: 8px; border: 1px solid #3a4046; background: #14171a; color: #e6e8ea; font-weight: 600; font-size: .9rem; cursor: pointer; }
  .modalActions button.primary { background: #e0313a; border-color: #e0313a; color: #fff; }
  .modalActions button.ghost { background: transparent; border-color: transparent; color: #a6adb4; font-weight: 500; }
</style>
</head>
<body>
  <h1>Share a photo or video 📸</h1>
  <p class="intro">Straight from your phone to the live map on cicerallye.com. No account needed - just pick a file below.</p>
  <div class="card">
    <label class="pick" for="file">Tap to choose photo/video</label>
    <input id="file" type="file" accept="image/*,video/*" multiple />
    <div id="status" class="status"></div>
    <div id="thumbs" class="thumbs"></div>
  </div>
  <div id="tokenWarning" class="warn" style="display:none">
    This link is missing an upload token - ask whoever shared it with you for the full link.
  </div>

  <div id="locateModal" class="modalOverlay" style="display:none" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalSub">
    <div class="modalCard">
      <p id="modalTitle" class="modalTitle">Where was this taken?</p>
      <p id="modalSub" class="modalSub">This one didn't have a location saved in it. Tap the map (or drag the pin) to place it, or skip it.</p>
      <div id="pickerMap" class="pickerMap" role="application" aria-label="Map for choosing the photo's location"></div>
      <div class="modalActions">
        <button id="useCurrentBtn" type="button">Use my current location</button>
        <button id="confirmLocationBtn" type="button" class="primary" disabled aria-disabled="true">Use this location</button>
        <button id="skipLocationBtn" type="button" class="ghost">Skip - no location</button>
      </div>
    </div>
  </div>

<script>
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';
  if (!token) document.getElementById('tokenWarning').style.display = 'block';

  const statusEl = document.getElementById('status');
  const thumbsEl = document.getElementById('thumbs');
  const setStatus = (msg) => { statusEl.textContent = msg; };

  const MAPS_API_KEY = ${mapsKeyLiteral};
  // Rally start (Prague) - just a sane default center for the picker map
  // before a location is chosen; not saved anywhere.
  const DEFAULT_CENTER = { lat: 50.110124, lng: 14.497942 };

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

  // --- EXIF GPS extraction (JPEG only - covers most gallery photos; HEIC
  // and video don't carry parseable EXIF here, so those fall through to
  // the manual map picker below). Reads only the first slice of the file,
  // since EXIF always lives near the start. ---
  function readExifGps(file) {
    return new Promise((resolve) => {
      // Skip outright only for types we know can't be JPEG (video, HEIC,
      // PNG, etc). Some browsers/flows (iOS shares, some camera/gallery
      // picks) leave file.type empty even for real JPEGs, so an empty type
      // is deliberately let through here - parseExifGps() itself checks the
      // JPEG magic bytes (SOI marker) and returns null fast for anything
      // that isn't actually a JPEG.
      if (file.type && file.type !== 'image/jpeg' && file.type !== 'image/jpg') return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(parseExifGps(reader.result));
        } catch {
          resolve(null);
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file.slice(0, 262144));
    });
  }

  function readIfd(view, tiffStart, ifdOffset, little) {
    const count = view.getUint16(ifdOffset, little);
    const entries = {};
    for (let i = 0; i < count; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      entries[view.getUint16(entryOffset, little)] = { count: view.getUint32(entryOffset + 4, little), valueOffset: entryOffset + 8 };
    }
    return entries;
  }

  function readRationalArray(view, tiffStart, entry, little) {
    const dataOffset = entry.count * 8 > 4 ? tiffStart + view.getUint32(entry.valueOffset, little) : entry.valueOffset;
    const values = [];
    for (let i = 0; i < entry.count; i++) {
      const numerator = view.getUint32(dataOffset + i * 8, little);
      const denominator = view.getUint32(dataOffset + i * 8 + 4, little);
      values.push(denominator === 0 ? 0 : numerator / denominator);
    }
    return values;
  }

  function readAscii(view, tiffStart, entry, little) {
    const base = entry.count <= 4 ? entry.valueOffset : tiffStart + view.getUint32(entry.valueOffset, little);
    let str = '';
    for (let i = 0; i < entry.count; i++) {
      const code = view.getUint8(base + i);
      if (code === 0) break;
      str += String.fromCharCode(code);
    }
    return str;
  }

  function parseTiff(view, tiffStart) {
    const little = view.getUint16(tiffStart, false) === 0x4949;
    const ifd0Offset = view.getUint32(tiffStart + 4, little);
    const ifd0 = readIfd(view, tiffStart, tiffStart + ifd0Offset, little);
    const gpsPointer = ifd0[0x8825];
    if (!gpsPointer) return null;
    const gpsIfdOffset = view.getUint32(gpsPointer.valueOffset, little);
    const gps = readIfd(view, tiffStart, tiffStart + gpsIfdOffset, little);

    const latRefEntry = gps[0x0001];
    const latEntry = gps[0x0002];
    const lonRefEntry = gps[0x0003];
    const lonEntry = gps[0x0004];
    if (!latEntry || !lonEntry || !latRefEntry || !lonRefEntry) return null;

    const latDms = readRationalArray(view, tiffStart, latEntry, little);
    const lonDms = readRationalArray(view, tiffStart, lonEntry, little);
    if (latDms.length < 3 || lonDms.length < 3) return null;

    let lat = latDms[0] + latDms[1] / 60 + latDms[2] / 3600;
    let lon = lonDms[0] + lonDms[1] / 60 + lonDms[2] / 3600;
    if (readAscii(view, tiffStart, latRefEntry, little) === 'S') lat = -lat;
    if (readAscii(view, tiffStart, lonRefEntry, little) === 'W') lon = -lon;
    if (!isFinite(lat) || !isFinite(lon)) return null;
    return { lat: lat, lon: lon };
  }

  function parseExifGps(buffer) {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return null;
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset, false);
      if ((marker & 0xff00) !== 0xff00) break;
      if (marker === 0xffd8 || marker === 0xffd9) { offset += 2; continue; }
      if (marker === 0xffda) break;
      const size = view.getUint16(offset + 2, false);
      if (marker === 0xffe1) {
        const sigOffset = offset + 4;
        if (
          sigOffset + 6 <= view.byteLength &&
          view.getUint8(sigOffset) === 0x45 &&
          view.getUint8(sigOffset + 1) === 0x78 &&
          view.getUint8(sigOffset + 2) === 0x69 &&
          view.getUint8(sigOffset + 3) === 0x66 &&
          view.getUint8(sigOffset + 4) === 0 &&
          view.getUint8(sigOffset + 5) === 0
        ) {
          return parseTiff(view, sigOffset + 6);
        }
      }
      offset += 2 + size;
    }
    return null;
  }

  // --- Manual map picker (Google Maps), shown when a file has no usable
  // EXIF geotag. Lazy-loads the Maps JS API only the first time it's
  // actually needed, so a batch of already-geotagged photos never touches
  // it at all. ---
  let mapsLoadPromise = null;
  function loadGoogleMaps() {
    if (mapsLoadPromise) return mapsLoadPromise;
    mapsLoadPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.maps) return resolve();
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(MAPS_API_KEY);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
    return mapsLoadPromise;
  }

  let pickerMap = null;
  let pickerMarker = null;

  async function openLocationPicker() {
    if (!MAPS_API_KEY) return null;

    const modal = document.getElementById('locateModal');
    modal.style.display = 'flex';

    try {
      await loadGoogleMaps();
    } catch (err) {
      modal.style.display = 'none';
      return null;
    }

    const center = DEFAULT_CENTER;
    const confirmBtn = document.getElementById('confirmLocationBtn');
    // Require an explicit pin placement before "Use this location" is
    // enabled, so accepting the modal's default center (Prague) can never
    // happen by accident.
    const markMoved = () => {
      confirmBtn.disabled = false;
      confirmBtn.removeAttribute('aria-disabled');
    };
    confirmBtn.disabled = true;
    confirmBtn.setAttribute('aria-disabled', 'true');

    if (!pickerMap) {
      pickerMap = new google.maps.Map(document.getElementById('pickerMap'), {
        center: center,
        zoom: 6,
        streetViewControl: false,
        mapTypeControl: false,
      });
      pickerMarker = new google.maps.Marker({ position: center, map: pickerMap, draggable: true });
      pickerMap.addListener('click', (e) => {
        pickerMarker.setPosition(e.latLng);
        markMoved();
      });
      pickerMarker.addListener('dragend', markMoved);
    } else {
      pickerMap.setCenter(center);
      pickerMap.setZoom(6);
      pickerMarker.setPosition(center);
    }
    google.maps.event.trigger(pickerMap, 'resize');

    return new Promise((resolve) => {
      const useCurrentBtn = document.getElementById('useCurrentBtn');
      const skipBtn = document.getElementById('skipLocationBtn');

      const cleanup = (result) => {
        modal.style.display = 'none';
        useCurrentBtn.removeEventListener('click', onUseCurrent);
        confirmBtn.removeEventListener('click', onConfirm);
        skipBtn.removeEventListener('click', onSkip);
        resolve(result);
      };
      const onUseCurrent = async () => {
        const coords = await getPosition();
        if (!coords) return;
        const pos = { lat: coords.latitude, lng: coords.longitude };
        pickerMap.setCenter(pos);
        pickerMap.setZoom(14);
        pickerMarker.setPosition(pos);
        markMoved();
      };
      const onConfirm = () => {
        if (confirmBtn.disabled) return;
        const pos = pickerMarker.getPosition();
        cleanup({ lat: pos.lat(), lon: pos.lng() });
      };
      const onSkip = () => cleanup(null);

      useCurrentBtn.addEventListener('click', onUseCurrent);
      confirmBtn.addEventListener('click', onConfirm);
      skipBtn.addEventListener('click', onSkip);
    });
  }

  async function resolveLocation(file) {
    const exifCoords = await readExifGps(file);
    if (exifCoords) return exifCoords;
    return await openLocationPicker();
  }

  async function uploadOne(file, coords) {
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
        lat: coords ? coords.lat : undefined,
        lon: coords ? coords.lon : undefined,
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
        const coords = await resolveLocation(file);
        await uploadOne(file, coords);
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
    body: renderPage(process.env.GOOGLE_MAPS_API_KEY),
  };
}

app.http('photos', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'photos',
  handler: photos,
});
