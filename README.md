# Bhilwara Reservoir

This project works as:

- **Website**: normal browser app with shareable URLs (React Router).
- **Web app (PWA)**: installable (“Add to Home Screen”) with a service worker + manifest.

## Run locally

```bash
npm install
npm run dev
```

## Production build / preview

```bash
npm run build
npx vite preview --host --port 4173
```

## Deploy as a website (SPA routing)

If you deploy the `dist/` folder to static hosting, make sure your host rewrites all routes to `index.html` (so `/anything` doesn’t 404 on refresh).

## PWA notes

- Install prompts work best on **HTTPS** (or `localhost`).
- Icons are currently SVG for simplicity; if you want the best “native app” feel across all devices, add PNG icons (192x192 and 512x512) and switch the manifest to those.

