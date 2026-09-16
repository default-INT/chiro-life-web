const fs = require('fs-extra');
const handlebars = require('handlebars');
const path = require('path');
const packageJson = require('./package.json');

const distDir = path.join(__dirname, 'dist');
const distLibsDir = path.join(__dirname, 'dist', 'libs');
const nodeModulesDir = path.join(__dirname, 'node_modules');
const publicDir = path.join(__dirname, 'public');
const templatesDir = path.join(__dirname, 'templates');
const partialsDir = path.join(templatesDir, 'partials');
const pagesDir = path.join(templatesDir, 'pages');

const isExist = fs.pathExistsSync(distDir);
if (isExist) fs.removeSync(distDir);

fs.ensureDirSync(distDir);
fs.ensureDirSync(distLibsDir);

const dependencies = Object.keys(packageJson?.dependencies || {});
const data = fs.readJsonSync(path.join(__dirname, 'data', 'data.json'));
const siteUrl = `${data.site.url.replace(/\/$/, '')}/`;
const productUrl = new URL(data.product.path, siteUrl).href;
const pages = [
  { template: 'index', path: '/', title: data.meta.title, description: data.meta.description, ogType: 'website' },
  {
    template: 'product', path: data.product.path, isProduct: true, ogType: 'product',
    title: 'Whipped Grass-Fed Beef Tallow Balm, 4.4 oz | ChiroLife',
    description: "Discover ChiroLife's unscented whipped tallow balm for face and body. Made with grass-fed beef tallow, wild honey and beeswax in a 4.4 oz jar.",
  },
  ...require('./data/pages'),
  {
    template: 'guides', path: '/guides/', label: 'Guides', ogType: 'website',
    title: 'Tallow Balm Guides: Ingredients, Uses & Care | ChiroLife',
    description: 'Explore ChiroLife guides to tallow balm: what it is, how to use it, what to expect and how it compares with lotion.',
  },
  {
    template: 'editorial', path: '/404.html', noindex: true, ogType: 'website',
    title: 'Page Not Found | ChiroLife', label: 'Page Not Found', eyebrow: '404',
    heading: 'A Little Off the Beaten Path.',
    description: 'This page could not be found. Explore the ChiroLife balm or return to the homepage.',
    intro: 'We couldn’t find that page. Use the navigation to explore the balm, or head back home.',
    sections: [{ id: 'next', heading: 'Find Your Way', links: [{ label: 'Return home', href: '/' }, { label: 'Browse skincare guides', href: '/guides/' }] }],
  },
];
const guides = pages.filter(page => page.isArticle);
const styles = ['tokens', 'base', 'ui-kit', 'header', 'hero', 'ingredients', 'origin', 'benefits', 'purpose', 'results', 'footer', 'motion', 'product', 'editorial'];
const siteCss = styles.map(name => fs.readFileSync(path.join(publicDir, 'assets', 'css', `${name}.css`), 'utf8')).join('\n');

function structuredData(page) {
  const graph = [
    {
      '@type': 'Organization', '@id': `${siteUrl}#organization`,
      name: data.site.name, url: siteUrl, email: data.contact.email,
      logo: { '@type': 'ImageObject', url: `${siteUrl}favicon.svg` },
    },
    {
      '@type': 'WebSite', '@id': `${siteUrl}#website`, name: data.site.name, url: siteUrl,
      publisher: { '@id': `${siteUrl}#organization` }, inLanguage: data.site.language,
    },
    {
      '@type': 'WebPage', '@id': `${page.url}#webpage`, url: page.url,
      name: page.title, description: page.description, inLanguage: data.site.language,
      isPartOf: { '@id': `${siteUrl}#website` }, about: { '@id': `${productUrl}#product` },
    },
  ];
  if (page.isProduct) {
    graph.push({
      '@type': 'Product', '@id': `${productUrl}#product`, url: productUrl,
      name: data.product.name, description: page.description,
      mainEntityOfPage: { '@id': `${page.url}#webpage` },
      image: [`${siteUrl}assets/images/hero-product.webp`],
      brand: { '@type': 'Brand', name: data.site.name }, size: data.product.size,
      material: 'Grass-fed beef tallow, wild honey and beeswax',
    });
  }
  if (page.isArticle) {
    graph.push({
      '@type': 'Article', '@id': `${page.url}#article`, headline: page.heading,
      description: page.description, dateModified: page.updated,
      author: { '@type': 'Organization', name: page.author, url: `${siteUrl}about/` },
      publisher: { '@id': `${siteUrl}#organization` },
      mainEntityOfPage: { '@id': `${page.url}#webpage` },
      image: [`${siteUrl}assets/images/${page.image}`],
      citation: page.sources.map(source => source.href),
    });
  }
  if (page.path !== '/' && !page.noindex) {
    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }];
    if (page.isArticle) crumbs.push({ '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}guides/` });
    crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: page.label || 'The Balm', item: page.url });
    graph.push({ '@type': 'BreadcrumbList', '@id': `${page.url}#breadcrumbs`, itemListElement: crumbs });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

dependencies.forEach(dep => {
  const srcPath = path.join(nodeModulesDir, dep);
  const destPath = path.join(distLibsDir, dep);

  if (fs.existsSync(srcPath)) {
    fs.copySync(srcPath, destPath);
    console.log(`✅ ${dep} copied to dist/libs`);
  } else {
    console.warn(`⚠️ Dependency ${dep} not found in node_modules`);
  }
});

fs.readdirSync(partialsDir).forEach(file => {
  const partialName = path.parse(file).name;
  const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf-8');
  handlebars.registerPartial(partialName, partialContent);
});

pages.forEach(config => {
  const page = { ...config, url: new URL(config.path, siteUrl).href };
  page.isIngredients = page.path === '/ingredients/';
  page.isHowToUse = page.path === '/how-to-use-tallow-balm/';
  page.isGuides = page.path === '/guides/' || (page.isArticle && !page.isHowToUse);
  page.isAbout = page.path === '/about/';
  page.relatedPages = (page.related || []).map(route => {
    const relatedPage = pages.find(candidate => candidate.path === route);
    if (!relatedPage) throw new Error(`Missing related page: ${route}`);
    return relatedPage;
  });
  const templateContent = fs.readFileSync(path.join(pagesDir, `${page.template}.hbs`), 'utf-8');
  const result = handlebars.compile(templateContent)({ ...data, page, guides, structuredData: structuredData(page) });
  const outputPath = page.noindex ? path.join(distDir, '404.html') : path.join(distDir, page.path, 'index.html');
  fs.outputFileSync(outputPath, result, 'utf-8');
  console.log(`✅ Page ${page.path} is compiled!`);
});

fs.copySync(publicDir, distDir);
fs.outputFileSync(path.join(distDir, 'assets/css/site.css'), siteCss);

const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`;
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(page => !page.noindex).map(page => `  <url><loc>${new URL(page.path, siteUrl).href}</loc></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsContent, 'utf-8');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent, 'utf-8');
