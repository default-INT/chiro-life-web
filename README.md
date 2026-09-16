# ChiroLife

ChiroLife is a Node.js-based static skincare site that compiles Handlebars templates and copies project assets into a production-ready `dist` directory.

## Pages and SEO

- `/` — brand homepage.
- `/products/grass-fed-beef-tallow-balm/` — product details, ingredients, application and FAQ.
- `/ingredients/`, `/how-to-use-tallow-balm/` — detailed formula and application information.
- `/about/`, `/contact/`, `/shipping/`, `/returns/` — brand, public seller details and Amazon order guidance.
- `/guides/` — four guides, including application, tallow basics, dry skin and balm versus lotion.
- `/404.html` — shared noindex error page, served with HTTP 404 for missing routes.

Routes and page metadata are declared in `build.js`. Each route generates an `index.html` in its own directory and is included in the sitemap. Shared metadata and styles live in `templates/partials/Head.hbs`; use root-relative asset paths for nested pages.

Editorial content, source URLs, related pages and review dates are in `data/pages.js`. Article authorship is attributed to ChiroLife, without claiming medical review. Product-page feedback is explicitly seller feedback, not product reviews; its source is the public Amazon seller profile, checked September 15, 2026. Do not infer the website operator or manufacturing location from the seller’s business address.

The build combines the source CSS files into one `site.css` request. Hero content is immediately visible, with no reveal-animation delay. Images already use WebP, fixed dimensions and below-the-fold lazy loading. Real mobile Core Web Vitals still require measurements on the deployed site.

Run `npm test` to build and verify every route, metadata, JSON-LD, sitemap, local links, anchors and error-page indexing. For a preview without LiveReload: `LIVE_RELOAD=false PORT=3003 npm run serve`.

GitHub Pages uses the generated `404.html` for missing URLs. HTTPS enforcement and alternate-domain redirects depend on the GitHub Pages custom-domain settings and DNS; do not simulate them with JavaScript redirects or a catch-all that returns HTTP 200.

Product JSON-LD is generated on the product page. Purchases take place on Amazon, so the site does not publish an Offer, price, stock status or ratings. Keep product copy focused on cosmetic moisturizing benefits and confirm factual claims before adding them.

## Technologies

- Node.js 20
- Handlebars
- HTML5 and CSS
- Vanilla JavaScript
- SVG Inject
- Express
- Nodemon and Livereload
- fs-extra
- GitHub Actions and GitHub Pages

The project intentionally does not use a frontend framework, Swiper, or a map library.

## Installation

```sh
npm install
```

## Scripts

- `npm run build` — compiles Handlebars pages and copies public assets and SVG Inject to `dist`
- `npm run dev` — watches templates, data, scripts, styles, and SVG files and rebuilds automatically
- `npm run serve` — serves the compiled site at `http://localhost:3002`

Run the build and the server in separate terminals during local development:

```sh
npm run serve
npm run dev
```

## Project Structure

```text
./
├── data/                   # Page content and repeated collections
├── dist/                   # Generated production output
├── public/
│   ├── assets/
│   │   ├── css/            # Tokens, shared UI, and section styles
│   │   ├── icons/          # Original SVG assets from Figma
│   │   └── images/         # Original raster assets from Figma
│   └── js/                 # Client-side scripts
├── templates/
│   ├── pages/              # Complete page templates
│   └── partials/           # Reusable page sections
├── build.js
├── serve.js
└── package.json
```

## Design Tokens

All primitive and semantic colors, typography values, spacing, radii, shadows, and layout dimensions are defined in `public/assets/css/tokens.css`. Section styles consume tokens rather than defining independent color values.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which installs dependencies, builds the project, and deploys `dist` to GitHub Pages.
