# Anupama & Lijin — Wedding Invitation Website

A single-page, mobile-first wedding invitation site: plain HTML/CSS/JS, no build step required.

## Files

```
index.html      — page structure & content
styles.css      — all styling / design tokens
script.js       — countdown, scroll reveals, share button, maps link
assets/         — floral SVG decorations (transparent, lightweight)
```

## Run locally

No build tools needed. From this folder, run either:

```bash
python3 -m http.server 8000
```

or, with Node installed:

```bash
npx serve .
```

Then open `http://localhost:8000` (or the port shown) in your browser.

You can also just double-click `index.html` to open it directly, though a local
server is recommended so the Web Share API and relative asset paths behave the
same way they will in production.

## Before you publish

1. **Google Maps link** — open `script.js` and set:
   ```js
   const GOOGLE_MAPS_URL = "https://maps.google.com/?q=...";
   ```
   The "View Location" button stays hidden/disabled until this is filled in.

2. **OG share image** — replace `og-image.jpg` (referenced in `index.html`'s
   `<meta property="og:image">` tag) with a 1200×630 image if you'd like a
   custom preview card when the link is shared on WhatsApp/social apps. A
   simple option: screenshot the hero section and crop it to that ratio.

3. **Double-check every Malayalam line** against the original invitation PDF —
   names, addresses, and the notice text were transcribed directly from the
   source file, but it's worth one final proofread before sending the link out.

## Deploy

### Vercel
```bash
npm i -g vercel
vercel --prod
```
(Choose "Other" as the framework — this is a static site, no build command needed.)

### Netlify
Drag-and-drop this folder onto https://app.netlify.com/drop, or:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Hostinger (or any shared/static host)
Zip the contents of this folder (not the folder itself) and upload via the
File Manager / FTP into your `public_html` directory. No server-side code is
required — it's plain static files.

## Notes

- The countdown targets **25 October 2026, 11:42 AM IST** (the muhurtham time).
- Animations respect `prefers-reduced-motion`.
- Phone numbers are wired as `tel:` links for one-tap calling on mobile.
- The share button uses the native Web Share sheet where supported, and falls
  back to a WhatsApp share link elsewhere.
