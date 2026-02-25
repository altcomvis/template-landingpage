import fs from "node:fs";
import path from "node:path";

const projectJsonPath = path.resolve(
  process.env.PROJECT_JSON_PATH || "./public/landing.json",
);
const sitemapPath = path.resolve("./public/sitemap.xml");

let landing = {};
try {
  landing = JSON.parse(fs.readFileSync(projectJsonPath, "utf-8"));
} catch (err) {
  console.warn(
    `⚠️ Não foi possível ler o JSON do projeto em ${projectJsonPath}. Gerando sitemap com defaults.`,
    err,
  );
}

const urlBase =
  process.env.SITEMAP_URL_BASE ||
  landing.general?.seoUrl ||
  "https://oglobo.globo.com/projetos";

const pages = [
  { loc: `${urlBase}/`, priority: "1.0" },
  { loc: `${urlBase}/#about`, priority: "0.8" },
  { loc: `${urlBase}/#schedule`, priority: "0.8" },
  { loc: `${urlBase}/#subscribe`, priority: "0.7" },
  { loc: `${urlBase}/#previous-events`, priority: "0.6" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(
      (p) => `
  <url>
    <loc>${p.loc}</loc>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

fs.writeFileSync(sitemapPath, xml);
console.log(`✅ Sitemap gerado em: ${sitemapPath}`);
