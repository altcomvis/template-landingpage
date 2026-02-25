import fs from "fs";
import path from "path";

const projectJsonPath = path.resolve(
  process.env.PROJECT_JSON_PATH || "public/landing.json",
);

let landing = {};
try {
  landing = JSON.parse(fs.readFileSync(projectJsonPath, "utf8"));
} catch (err) {
  console.warn(
    `⚠️ Não foi possível ler o JSON do projeto em ${projectJsonPath}. Gerando sitemap com defaults.`,
    err,
  );
}

const dir = landing.general?.directoryName || "projeto-sem-nome";

// Base da URL
const baseURL =
  process.env.SITEMAP_BASE_URL ||
  "https://oglobo.globo.com/projetos/" + dir.replace(/\/$/, "");

// Data atual no formato ISO (apenas yyyy-mm-dd)
const today = new Date().toISOString().split("T")[0];

// Cria conteúdo XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}/</loc>
    <lastmod>${today}</lastmod>
    <priority>1.00</priority>
  </url>
</urlset>
`;

// Caminho do sitemap a ser gerado (na pasta dist)
const outDir = path.resolve("dist");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

console.log("✅ sitemap.xml gerado com sucesso para:", baseURL);