# Musstech Solar Hub

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

## Deployment

The app is a single-page Vite app. `vercel.json` rewrites all routes to `index.html` so direct links such as `/calculators` and `/quotation` work after deployment.

