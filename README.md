# Solar Hub

Responsive React/Vite web application for solar sizing, troubleshooting, training resources, and quotation generation.

## Features

- Mobile-first dashboard
- Solar calculators for load, panels, batteries, inverters, cables, breakers, and cost per kWh
- Troubleshooting wizard and inverter fault-code search
- Maintenance checklist
- Ebook store links
- Client quotation generator with print/save as PDF support
- Local draft persistence for calculators and quotations

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Premium PIN

Home, ebooks, troubleshooting, and the basic load calculator are free to open. Advanced sizing, cost editing, and professional quotations unlock with a premium PIN. Set the PIN with:

```bash
VITE_ACCESS_PIN=your-pin-here
```

On Vercel, add `VITE_ACCESS_PIN` under Project Settings > Environment Variables before deploying.

This is a simple frontend gate. For selling unique PINs to TikTok buyers, connect the app to a backend/payment system so each buyer gets a verified one-time or subscription access code.

## Deployment

The app is a single-page Vite app. `vercel.json` rewrites all routes to `index.html` so direct links such as `/calculators` and `/quotation` work after deployment.
