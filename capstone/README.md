# ShopSphere — Capstone Project

Modular, client-side routed e-commerce product catalog (vanilla JavaScript, ES modules).

## Structure
```
capstone/
├── index.html            app shell
├── css/styles.css        styles (light/dark theme, responsive)
├── src/
│   ├── main.js           entry: routes, theme, cart badge
│   ├── router.js         hash-based router
│   ├── store.js          cart state + localStorage
│   ├── data/products.js  product data
│   ├── components/       reusable UI (product card)
│   ├── pages/            home, catalog, product, cart, checkout, confirmation, 404
│   └── utils/            DOM helper, formatters, toast
├── assets/images/        WebP product images (240w and 480w)
├── scripts/build.js      esbuild production build
├── dist/                 production output (ready to deploy)
├── netlify.toml  vercel.json
└── package.json
```

## Run locally
- Dev: open this folder in VS Code and use Live Server on `index.html`
- Production build: `npm install` then `npm run build` then `npm run preview`

## Deploy (pick one)
**Netlify (easiest):** drag the `dist` folder onto https://app.netlify.com/drop, or connect the GitHub repo with Base directory `capstone`, Build command `npm run build`, Publish directory `dist`.

**Vercel:** import the GitHub repo, set Root Directory to `capstone`. Build and output settings are read from `vercel.json`.

**Render:** New > Static Site, Root Directory `capstone`, Build Command `npm install && npm run build`, Publish Directory `dist`.

Product images are generated placeholders; replace the files in `assets/images` with real photos (keep the `name-240.webp` / `name-480.webp` naming) and run the build again.
