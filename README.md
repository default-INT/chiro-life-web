# ChiroLife

ChiroLife is a Node.js-based static product landing page that compiles Handlebars templates and copies project assets into a production-ready `dist` directory.

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
