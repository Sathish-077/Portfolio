# Sathish Manikandan M — Multi-Page Portfolio

This version completes Task 1 to Task 5: a responsive multi-page portfolio with an interactive To-Do List application.

## Pages

- `index.html` — Home
- `about.html` — About, education, skills and certifications
- `projects.html` — Projects
- `todo.html` — To-Do List app (Task 3)
- `weather.html` — Weather Dashboard (Task 4)
- `contact.html` — Accessible contact form

## Task 2 implementation

- CSS Grid for page and card layouts
- Flexbox for navigation, buttons, tags and component alignment
- Mobile-first responsive breakpoints
- CSS custom properties for the complete theme
- Light/dark mode using JavaScript + CSS variables
- Responsive mobile navigation
- Accessible focus states and skip link
- Semantic HTML5 structure
- ARIA labels and live form status
- Responsive profile photo
- SEO-friendly title and description metadata on every page

## Run

Keep the folder structure unchanged and open `index.html` in a browser.

For local development, VS Code Live Server can also be used.

## Folder structure

sathish_portfolio/
├── index.html
├── about.html
├── projects.html
├── todo.html
├── weather.html
├── contact.html
├── styles.css
├── script.js
├── todo.js
├── weather.js
├── README.md
└── assets/
    ├── profile.jpg
    └── profile-circle.jpg

## Updated Hero Design

The Task 2 hero section now follows the requested reference style:
- Straight, centered profile-photo card
- Full portrait shown without awkward cropping
- Soft blue decorative blocks behind the photo
- Balanced two-column desktop layout
- Responsive photo sizing on tablet and mobile
- Clean white/blue visual treatment

## Task 3 — JavaScript Logic & State Management

Files: `todo.html`, `todo.js` (logic) and the "To-Do App" section at the end of `styles.css`.

- Full CRUD: create, read, update (inline edit) and delete tasks
- Automatic persistence with `window.localStorage` (data survives reloads)
- Filtering: All, Active, Completed
- Dynamic DOM elements created with `document.createElement`
- Delegated event listeners on the task list (click, change, keydown)
- Toggle complete, clear completed, live task counter, empty-state messages
- Input validation, HTML-injection-safe rendering (`textContent`)
- Keyboard support (Enter to save, Escape to cancel) and ARIA labels
- Works with the existing light/dark theme and responsive layout

## Profile photo fix

`assets/profile-circle.jpg` is a square, face-centered crop of `profile.jpg` (frame lines removed) used in the home-page circle, so the face and shoulders fit the circle without extra white space or stray lines.

## Task 4 — Asynchronous JavaScript & RESTful APIs

Files: `weather.html`, `weather.js` and the "Weather Dashboard" section at the end of `styles.css`.

- Real-time data from the free Open-Meteo REST API (no API key needed): geocoding endpoint for city search and forecast endpoint for weather
- Modern `fetch` with `async/await`
- Error handling: empty input, city not found, HTTP errors, network failure, 10-second timeout (AbortController)
- Parses nested JSON (`current`, `current_units`, `daily` arrays) and renders it with DOM methods
- Shows temperature, feels-like, humidity, wind speed, pressure, weather description and a 5-day forecast
- Extras: °C/°F toggle, "My location" button, recent searches (localStorage), loading and error states
- Responsive, accessible (`aria-live` status, labelled controls) and works with light/dark theme

## Task 5 — Full-Stack Deployment & Project Architecture (Capstone)

Folder: `capstone/` (ShopSphere, an e-commerce product catalog). Open it from the "Capstone" nav link.

- **Modular frontend:** ES modules split into `src/pages`, `src/components`, `src/utils`, `src/data`, `store.js` (cart state) and `router.js`
- **Client-side routing:** hash router with routes `#/`, `#/products?category=&q=&sort=`, `#/product/:id`, `#/cart`, `#/checkout`, `#/confirmation` and a 404 page; focus and page title update on every navigation
- **Optimized assets:** WebP images in two sizes with `srcset`, lazy loading and fixed dimensions; JS and CSS bundled, minified and content-hashed by esbuild (`npm run build` -> `capstone/dist`)
- **Deployment:** `netlify.toml` and `vercel.json` included (long-term caching for `/assets`). See `capstone/README.md`.

Run locally: open the `capstone` folder with Live Server, or `npm install && npm run build && npm run preview`.
