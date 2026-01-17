import fs from "fs";
import path from "path";

const landingPath = path.resolve("./public/landing.json");
const sitemapPath = path.resolve("./public/sitemap.xml");

const landing = JSON.parse(fs.readFileSync(landingPath, "utf-8"));
const urlBase = landing.general?.seoUrl || "https://oglobo.globo.com/projetos";
const directory = landing.general?.directoryName || "";

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
