import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';

/**
 * Public upload page for cicerallye.com/photos (rewritten from /api/photos
 * by public/staticwebapp.config.json, same trick as /tracker ->
 * /api/tracker). Renders a self-contained HTML+JS page rather than living
 * in the React SPA since the site has no client-side router - this
 * mirrors trackerRedirect.ts.
 *
 * Upload flow performed entirely in the browser:
 *   1. Try to read a geotag straight out of the file's EXIF data (JPEG and
 *      HEIC/HEIF - covers Android and iPhone camera photos, plus most
 *      library picks). If that's missing (video/screenshot/no geotag),
 *      show a Google Maps picker so the uploader can drop a pin
 *      themselves, or skip it entirely.
 *   2. POST /api/media/sas        -> get a short-lived write-only SAS URL
 *   3. PUT <file> to that SAS URL -> direct to Blob Storage, no compute
 *   4. POST /api/media/complete   -> record metadata (incl. location)
 *
 * The shared upload token is embedded server-side (same pattern as the
 * Maps API key below) rather than read from a `?token=` query param - so
 * the shareable link is just a plain `cicerallye.com/photos`, nothing to
 * copy wrong or lose. This is the same protection level as before (the
 * secret was already visible in any shared link); it just isn't part of
 * the URL anymore.
 */
function renderPage(mapsApiKey: string | undefined, mediaUploadToken: string | undefined): string {
  // The Maps JS API key is already public (same one baked into the main
  // site's bundle, restricted by HTTP referrer) - safe to inline here too.
  // It's only used to lazy-load the picker when a photo has no geotag, so
  // most uploads (which have EXIF GPS) never trigger a Maps load at all.
  const mapsKeyLiteral = JSON.stringify(mapsApiKey ?? '');
  const mediaTokenLiteral = JSON.stringify(mediaUploadToken ?? '');

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
  .emailLabel { display: block; text-align: left; font-size: .85rem; font-weight: 600; margin-bottom: 6px; }
  .emailInput { width: 100%; padding: 10px; margin-bottom: 6px; border-radius: 8px; border: 1px solid #3a4046; background: #14171a; color: #e6e8ea; font-size: .9rem; box-sizing: border-box; }
  .emailHint { text-align: left; font-size: .75rem; color: #75808a; margin-bottom: 16px; line-height: 1.35; }
  .mineTitle { font-size: 1rem; margin: 0 0 10px; text-align: left; }
  .mineList { display: flex; flex-direction: column; gap: 12px; }
  .mineItem { display: flex; gap: 10px; text-align: left; border: 1px solid #2a2f34; border-radius: 8px; padding: 10px; }
  .mineItem .mineThumb { width: 64px; height: 64px; border-radius: 6px; overflow: hidden; flex: none; background: #14171a; }
  .mineItem .mineThumb img, .mineItem .mineThumb video { width: 100%; height: 100%; object-fit: cover; }
  .mineItem .mineBody { flex: 1; min-width: 0; }
  .mineItem .mineLoc { font-size: .8rem; color: #a6adb4; margin-bottom: 6px; }
  .mineItem .mineDate { width: 100%; padding: 6px; border-radius: 6px; border: 1px solid #3a4046; background: #14171a; color: #e6e8ea; font-size: .8rem; box-sizing: border-box; margin-bottom: 6px; }
  .mineItem .mineActions { display: flex; gap: 8px; }
  .mineItem .mineActions button { flex: 1; padding: 6px; border-radius: 6px; border: 1px solid #3a4046; background: #14171a; color: #e6e8ea; font-size: .78rem; cursor: pointer; }
  .mineItem .mineActions button.danger { border-color: #e0313a; color: #e0313a; }
  .srOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
  .modalOverlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 1000; }
  .modalCard { background: #1b1f23; border: 1px solid #2a2f34; border-radius: 12px; padding: 18px; max-width: 420px; width: 100%; text-align: left; }
  .modalTitle { margin: 0 0 4px; font-weight: 600; }
  .modalSub { margin: 0 0 12px; font-size: .8rem; color: #a6adb4; line-height: 1.4; }
  .pickerMap { width: 100%; height: 220px; border-radius: 8px; margin-bottom: 12px; background: #14171a; }
  .placeSearch { width: 100%; padding: 10px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #3a4046; background: #14171a; color: #e6e8ea; font-size: .9rem; box-sizing: border-box; }
  .placeSearch::placeholder { color: #75808a; }
  /* Google's Autocomplete dropdown is appended to <body>, not the modal -
     force it above the modal overlay so results are actually visible. */
  .pac-container { z-index: 1001; }
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
    <label for="emailInput" class="emailLabel">Your email (so you can manage your own uploads)</label>
    <input id="emailInput" type="email" class="emailInput" placeholder="you@example.com" autocomplete="email" />
    <div id="emailHint" class="emailHint">We don't use this for anything else - just so we know whose photo is whose, and it'll carry over once accounts arrive.</div>
    <label class="pick" for="file">Tap to choose photo/video</label>
    <input id="file" type="file" accept="image/*,video/*" multiple />
    <div id="status" class="status"></div>
    <div id="thumbs" class="thumbs"></div>
  </div>
  <div id="mineCard" class="card" style="display:none">
    <h2 class="mineTitle">Your uploads</h2>
    <div id="mineList" class="mineList"></div>
  </div>
  <div id="locateModal" class="modalOverlay" style="display:none" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="modalSub">
    <div class="modalCard">
      <p id="modalTitle" class="modalTitle">Where was this taken?</p>
      <p id="modalSub" class="modalSub">This one didn't have a location saved in it. Search for a place, tap the map, or drag the pin - or skip it. Tip: picking from your iPhone's gallery? Tap "Options" at the top before choosing the photo and turn on "Location" - though iPhones can still drop it for HEIC photos even with that on. For the most reliable geotagging, switch Settings &gt; Camera &gt; Formats to "Most Compatible" (JPEG).</p>
      <label for="placeSearchInput" class="srOnly">Search for a place</label>
      <input id="placeSearchInput" type="text" class="placeSearch" placeholder="Search for a place or address..." autocomplete="off" />
      <div id="pickerMap" class="pickerMap" role="application" aria-label="Map for choosing the photo's location"></div>
      <div class="modalActions">
        <button id="useCurrentBtn" type="button">Use my current location</button>
        <button id="confirmLocationBtn" type="button" class="primary" disabled aria-disabled="true">Use this location</button>
        <button id="skipLocationBtn" type="button" class="ghost">Skip - no location</button>
      </div>
    </div>
  </div>

<script>
  const MEDIA_UPLOAD_TOKEN = ${mediaTokenLiteral};

  const statusEl = document.getElementById('status');
  const thumbsEl = document.getElementById('thumbs');
  const setStatus = (msg) => { statusEl.textContent = msg; };

  // Self-reported email, not a real account - just enough to know whose
  // upload is whose so people can manage their own posts. Remembered in
  // localStorage so it only has to be typed once per device/browser.
  const EMAIL_STORAGE_KEY = 'cicerallyeEmail';
  const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const emailInput = document.getElementById('emailInput');
  const getStoredEmail = () => {
    const value = localStorage.getItem(EMAIL_STORAGE_KEY) || '';
    return EMAIL_PATTERN.test(value) ? value : '';
  };
  let currentEmail = getStoredEmail();
  if (currentEmail) emailInput.value = currentEmail;

  emailInput.addEventListener('change', () => {
    const value = emailInput.value.trim().toLowerCase();
    if (EMAIL_PATTERN.test(value)) {
      currentEmail = value;
      localStorage.setItem(EMAIL_STORAGE_KEY, value);
      loadMine();
    } else {
      currentEmail = '';
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    }
  });

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

  // --- EXIF GPS extraction. Supports JPEG (covers Android camera photos
  // and most gallery picks) and HEIC/HEIF (the default iPhone camera
  // format). Video never carries parseable EXIF here, so it always falls
  // through to the manual map picker below. ---
  function readFileSlice(file, start, end) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file.slice(start, end));
    });
  }

  async function readExifGps(file) {
    // Skip outright only for types we know can't be JPEG/HEIC (video,
    // audio, etc). Some browsers/flows (iOS shares, some camera/gallery
    // picks) leave file.type empty even for real photos, so an empty type
    // is deliberately let through - the header-sniffing below checks the
    // actual magic bytes and bails fast for anything that isn't a photo.
    if (file.type && (file.type.indexOf('video/') === 0 || file.type.indexOf('audio/') === 0)) return null;

    // EXIF (JPEG) and the HEIC 'meta' box both live near the start of the
    // file, so a small head read is enough to find them.
    const head = await readFileSlice(file, 0, 262144);
    if (!head) return null;
    const headView = new DataView(head);

    if (headView.byteLength >= 4 && headView.getUint16(0, false) === 0xffd8) {
      try {
        return parseExifGps(head);
      } catch {
        return null;
      }
    }

    if (headView.byteLength >= 8 && readFourCc(headView, 4) === 'ftyp') {
      try {
        const extent = locateHeicExifExtent(headView);
        if (!extent) return null;
        // The Exif item's bytes can live anywhere in the file (typically
        // inside 'mdat', after the image data), so fetch just that small,
        // precisely-located range rather than reading the whole photo.
        const exifBuffer = await readFileSlice(file, extent.offset, extent.offset + extent.length);
        if (!exifBuffer) return null;
        return parseHeicExifPayload(new DataView(exifBuffer));
      } catch {
        return null;
      }
    }

    return null;
  }

  function readFourCc(view, offset) {
    return String.fromCharCode(view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3));
  }

  // --- Minimal ISOBMFF box walker, just enough to locate the 'Exif' item
  // inside a HEIC/HEIF container's 'meta' box (via its 'iinf'/'iloc'
  // sub-boxes) and hand back the file byte range holding that item's data. ---
  function readIsoBoxes(view, start, end) {
    const boxes = [];
    let offset = start;
    while (offset + 8 <= end) {
      const size = view.getUint32(offset, false);
      if (size === 1) break; // 64-bit box size - not needed for phone photos
      const boxEnd = size === 0 ? end : offset + size;
      if (boxEnd <= offset || boxEnd > end) break;
      boxes.push({ type: readFourCc(view, offset + 4), start: offset, end: boxEnd, dataStart: offset + 8 });
      offset = boxEnd;
    }
    return boxes;
  }

  function findIsoBox(boxes, type) {
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].type === type) return boxes[i];
    }
    return null;
  }

  function findHeicExifItemId(view, iinfBox) {
    const version = view.getUint8(iinfBox.dataStart);
    const offset = iinfBox.dataStart + 4 + (version === 0 ? 2 : 4); // skip version+flags, entry_count
    const infeBoxes = readIsoBoxes(view, offset, iinfBox.end);
    for (let i = 0; i < infeBoxes.length; i++) {
      const infe = infeBoxes[i];
      if (infe.type !== 'infe') continue;
      const infeVersion = view.getUint8(infe.dataStart);
      let p = infe.dataStart + 4; // skip version+flags
      let itemId;
      if (infeVersion >= 3) {
        itemId = view.getUint32(p, false);
        p += 4;
      } else {
        itemId = view.getUint16(p, false);
        p += 2;
      }
      p += 2; // item_protection_index
      if (p + 4 > infe.end) continue;
      if (readFourCc(view, p) === 'Exif') return itemId;
    }
    return null;
  }

  function findHeicItemExtent(view, ilocBox, targetItemId) {
    let offset = ilocBox.dataStart;
    const version = view.getUint8(offset);
    offset += 4; // skip version+flags
    const sizesByte1 = view.getUint8(offset);
    offset += 1;
    const offsetSize = sizesByte1 >> 4;
    const lengthSize = sizesByte1 & 0x0f;
    const sizesByte2 = view.getUint8(offset);
    offset += 1;
    const baseOffsetSize = sizesByte2 >> 4;
    const indexSize = sizesByte2 & 0x0f;
    let itemCount;
    if (version < 2) {
      itemCount = view.getUint16(offset, false);
      offset += 2;
    } else {
      itemCount = view.getUint32(offset, false);
      offset += 4;
    }

    const readUint = (size) => {
      let value = 0;
      for (let i = 0; i < size; i++) {
        value = value * 256 + view.getUint8(offset);
        offset += 1;
      }
      return value;
    };

    for (let i = 0; i < itemCount; i++) {
      let itemId;
      if (version < 2) {
        itemId = view.getUint16(offset, false);
        offset += 2;
      } else {
        itemId = view.getUint32(offset, false);
        offset += 4;
      }
      let constructionMethod = 0;
      if (version === 1 || version === 2) {
        constructionMethod = view.getUint16(offset, false) & 0x0f;
        offset += 2;
      }
      offset += 2; // data_reference_index
      const baseOffset = readUint(baseOffsetSize);
      const extentCount = view.getUint16(offset, false);
      offset += 2;
      let firstExtent = null;
      for (let e = 0; e < extentCount; e++) {
        if ((version === 1 || version === 2) && indexSize > 0) readUint(indexSize);
        const extentOffset = readUint(offsetSize);
        const extentLength = readUint(lengthSize);
        if (!firstExtent) firstExtent = { offset: baseOffset + extentOffset, length: extentLength, constructionMethod: constructionMethod };
      }
      if (itemId === targetItemId) return firstExtent;
    }
    return null;
  }

  function locateHeicExifExtent(view) {
    const topBoxes = readIsoBoxes(view, 0, view.byteLength);
    const metaBox = findIsoBox(topBoxes, 'meta');
    if (!metaBox) return null;
    const metaChildren = readIsoBoxes(view, metaBox.dataStart + 4, metaBox.end); // +4 skips meta's own version+flags
    const iinfBox = findIsoBox(metaChildren, 'iinf');
    const ilocBox = findIsoBox(metaChildren, 'iloc');
    if (!iinfBox || !ilocBox) return null;
    const exifItemId = findHeicExifItemId(view, iinfBox);
    if (exifItemId == null) return null;
    const extent = findHeicItemExtent(view, ilocBox, exifItemId);
    // construction_method 1 ("idat", data embedded inside meta itself) is
    // rare for Exif items in practice - bail rather than risk reading the
    // wrong bytes. Falls through to the manual picker like any other miss.
    if (!extent || extent.constructionMethod !== 0) return null;
    return extent;
  }

  function parseHeicExifPayload(view) {
    if (view.byteLength < 8) return null;
    // Per the HEIF spec, an 'Exif' item's data starts with a 4-byte
    // big-endian offset to the actual TIFF header (accounting for the
    // "Exif\0\0" signature that usually precedes it, offset 6).
    const tiffHeaderOffset = view.getUint32(0, false);
    const tiffStart = 4 + tiffHeaderOffset;
    if (tiffStart + 8 > view.byteLength) return null;
    return parseTiff(view, tiffStart);
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
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(MAPS_API_KEY) + '&libraries=places';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
    return mapsLoadPromise;
  }

  let pickerMap = null;
  let pickerMarker = null;
  let placeAutocomplete = null;

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
    const searchInput = document.getElementById('placeSearchInput');
    // Require an explicit pin placement before "Use this location" is
    // enabled, so accepting the modal's default center (Prague) can never
    // happen by accident.
    const markMoved = () => {
      confirmBtn.disabled = false;
      confirmBtn.removeAttribute('aria-disabled');
    };
    confirmBtn.disabled = true;
    confirmBtn.setAttribute('aria-disabled', 'true');
    searchInput.value = '';

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

      // Lets the crew type a place name/address instead of hunting for it
      // on a tiny phone map - the most reliable way to set a location when
      // iOS has already stripped the photo's own GPS data.
      placeAutocomplete = new google.maps.places.Autocomplete(searchInput, {
        fields: ['geometry'],
      });
      placeAutocomplete.addListener('place_changed', () => {
        const place = placeAutocomplete.getPlace();
        const location = place && place.geometry && place.geometry.location;
        if (!location) return;
        pickerMap.setCenter(location);
        pickerMap.setZoom(15);
        pickerMarker.setPosition(location);
        markMoved();
      });
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

  // --- Thumbnail generation. Map pins/clusters render tiny (~40px) - no
  // reason to make them download a multi-MB original just to show a small
  // circle. Instead of server-side image processing (which would mean
  // Function compute in the upload path, the exact cost this whole
  // feature avoids), generate a small JPEG right here in the browser and
  // upload it as a second, tiny blob alongside the original. ---

  function loadImageElement(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not decode image')); };
      img.src = url;
    });
  }

  function grabVideoFrameElement(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      const url = URL.createObjectURL(file);
      const cleanup = () => URL.revokeObjectURL(url);
      video.addEventListener('loadeddata', () => {
        try {
          video.currentTime = Math.min(1, (video.duration || 1) / 2);
        } catch {
          resolve(video);
        }
      }, { once: true });
      video.addEventListener('seeked', () => resolve(video), { once: true });
      video.addEventListener('error', () => { cleanup(); reject(new Error('Could not decode video')); }, { once: true });
      video.src = url;
    });
  }

  // Best-effort: on any failure (e.g. a HEIC file a given browser can't
  // decode into a drawable element) this resolves to null. The caller
  // just skips the thumbnail for that post - never blocks or fails the
  // upload itself, and the map falls back to the full-size blobUrl for it.
  async function generateThumbnail(file) {
    const MAX_EDGE = 200;
    try {
      const source = file.type.startsWith('video/') ? await grabVideoFrameElement(file) : await loadImageElement(file);
      const sourceWidth = source.videoWidth || source.naturalWidth || source.width;
      const sourceHeight = source.videoHeight || source.naturalHeight || source.height;
      if (!sourceWidth || !sourceHeight) return null;
      const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(source, 0, 0, width, height);
      return await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7));
    } catch (err) {
      console.warn('Thumbnail generation skipped for ' + file.name, err);
      return null;
    }
  }

  // Plain fetch() never times out on its own - on a flaky mobile
  // connection (likely, live on a road trip) a stalled request just left
  // the upload stuck on "Preparing upload..." forever with no way to
  // recover except reloading. This bounds every network step and retries
  // once after a transient hiccup before surfacing a clear failure.
  async function fetchWithRetry(url, options, timeoutMs, label) {
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
      } catch (err) {
        lastError = err && err.name === 'AbortError' ? new Error(label + ' timed out') : err;
        if (attempt === 1) setStatus(label + ' - network hiccup, retrying...');
      } finally {
        clearTimeout(timer);
      }
    }
    throw lastError;
  }

  async function uploadOne(file, coords) {
    setStatus('Preparing upload for ' + file.name + '...');
    // Kick off thumbnail generation in parallel with requesting the SAS
    // URLs - independent work, no reason to serialize it.
    const thumbnailPromise = generateThumbnail(file);
    const sasRes = await fetchWithRetry(
      '/api/media/sas?token=' + encodeURIComponent(MEDIA_UPLOAD_TOKEN),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: file.type }),
      },
      25000,
      'Preparing upload for ' + file.name,
    );
    if (!sasRes.ok) throw new Error(await sasRes.text());
    const { uploadUrl, blobPath, maxUploadBytes, thumbUploadUrl, thumbBlobPath } = await sasRes.json();

    if (file.size > maxUploadBytes) throw new Error(file.name + ' is too large');

    setStatus('Uploading ' + file.name + '...');
    const putRes = await fetchWithRetry(
      uploadUrl,
      {
        method: 'PUT',
        headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': file.type },
        body: file,
      },
      // Actual file bytes, so give video more room than the small JSON calls.
      60000,
      'Uploading ' + file.name,
    );
    if (!putRes.ok) throw new Error('Upload failed for ' + file.name);

    // Thumbnail upload is best-effort - if generation failed, or the PUT
    // itself fails, just skip it. Never fail the whole upload over the
    // tiny thumbnail; the map will fall back to the full-size blobUrl.
    let uploadedThumbBlobPath;
    const thumbnailBlob = await thumbnailPromise;
    if (thumbnailBlob && thumbUploadUrl && thumbBlobPath) {
      try {
        setStatus('Uploading thumbnail for ' + file.name + '...');
        const thumbPutRes = await fetchWithRetry(
          thumbUploadUrl,
          {
            method: 'PUT',
            headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': 'image/jpeg' },
            body: thumbnailBlob,
          },
          20000,
          'Uploading thumbnail for ' + file.name,
        );
        if (thumbPutRes.ok) uploadedThumbBlobPath = thumbBlobPath;
      } catch (err) {
        console.warn('Thumbnail upload skipped for ' + file.name, err);
      }
    }

    setStatus('Saving ' + file.name + '...');
    const completeRes = await fetchWithRetry(
      '/api/media/complete?token=' + encodeURIComponent(MEDIA_UPLOAD_TOKEN),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blobPath,
          contentType: file.type,
          lat: coords ? coords.lat : undefined,
          lon: coords ? coords.lon : undefined,
          capturedAt: new Date().toISOString(),
          uploadedBy: currentEmail,
          thumbBlobPath: uploadedThumbBlobPath,
        }),
      },
      25000,
      'Saving ' + file.name,
    );
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

    if (!currentEmail) {
      setStatus('Please enter your email above first, so you can manage your uploads later.');
      event.target.value = '';
      emailInput.focus();
      return;
    }

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
    loadMine();
  });

  // --- "Your uploads": list/edit/delete posts owned by the stored email ---
  const mineCard = document.getElementById('mineCard');
  const mineList = document.getElementById('mineList');

  function formatForDateInput(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }

  function renderMineItem(post) {
    const item = document.createElement('div');
    item.className = 'mineItem';

    const thumb = document.createElement('div');
    thumb.className = 'mineThumb';
    thumb.innerHTML = post.mediaType === 'video'
      ? '<video src="' + post.blobUrl + '" muted></video>'
      : '<img src="' + post.blobUrl + '" />';

    const body = document.createElement('div');
    body.className = 'mineBody';

    const loc = document.createElement('div');
    loc.className = 'mineLoc';
    loc.textContent = (post.lat !== undefined && post.lon !== undefined)
      ? post.lat.toFixed(4) + ', ' + post.lon.toFixed(4)
      : 'No location saved';

    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.className = 'mineDate';
    dateInput.value = formatForDateInput(post.capturedAt);
    dateInput.addEventListener('change', async () => {
      if (!dateInput.value) return;
      const iso = new Date(dateInput.value).toISOString();
      await patchMine(post.id, { capturedAt: iso });
    });

    const actions = document.createElement('div');
    actions.className = 'mineActions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit location';
    editBtn.addEventListener('click', async () => {
      const coords = await openLocationPicker();
      if (!coords) return;
      const ok = await patchMine(post.id, { lat: coords.lat, lon: coords.lon });
      if (ok) loc.textContent = coords.lat.toFixed(4) + ', ' + coords.lon.toFixed(4);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Delete this upload? This cannot be undone.')) return;
      const ok = await deleteMine(post.id);
      if (ok) item.remove();
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    body.appendChild(loc);
    body.appendChild(dateInput);
    body.appendChild(actions);
    item.appendChild(thumb);
    item.appendChild(body);
    return item;
  }

  async function patchMine(id, fields) {
    try {
      const res = await fetch(
        '/api/media/' + encodeURIComponent(id) +
          '?token=' + encodeURIComponent(MEDIA_UPLOAD_TOKEN) +
          '&email=' + encodeURIComponent(currentEmail),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields),
        },
      );
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (error) {
      setStatus('Could not update: ' + (error && error.message ? error.message : error));
      return false;
    }
  }

  async function deleteMine(id) {
    try {
      const res = await fetch(
        '/api/media/' + encodeURIComponent(id) +
          '?token=' + encodeURIComponent(MEDIA_UPLOAD_TOKEN) +
          '&email=' + encodeURIComponent(currentEmail),
        { method: 'DELETE' },
      );
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (error) {
      setStatus('Could not delete: ' + (error && error.message ? error.message : error));
      return false;
    }
  }

  async function loadMine() {
    if (!currentEmail) {
      mineCard.style.display = 'none';
      return;
    }
    try {
      const res = await fetch('/api/media/mine?email=' + encodeURIComponent(currentEmail));
      if (!res.ok) throw new Error(await res.text());
      const posts = await res.json();
      mineList.innerHTML = '';
      if (!posts.length) {
        mineCard.style.display = 'none';
        return;
      }
      posts.forEach((post) => mineList.appendChild(renderMineItem(post)));
      mineCard.style.display = 'block';
    } catch (error) {
      // Non-fatal - the upload flow above still works even if this fails.
      console.error('Failed to load your uploads', error);
    }
  }

  loadMine();
</script>
</body>
</html>`;
}

export async function photos(_request: HttpRequest, _context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: renderPage(process.env.GOOGLE_MAPS_API_KEY, process.env.MEDIA_UPLOAD_SHARED_SECRET),
  };
}

app.http('photos', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'photos',
  handler: photos,
});
