import { useEffect, useState } from "react";
import { TitleSection } from "@/components/title-sections";

/* ─────────────── Tipagem ─────────────── */
interface EditorialArticle {
	title: string;
	description?: string;
	link: string;
	image?: string;
	pubDate?: string;
}

interface EditorialCoverageProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		description?: string;
		visible?: boolean;
		rssUrls: string[];
	};
}

function normalizeArticleLink(link: string): string {
	const raw = String(link || "").trim();
	if (!raw || raw === "#") return "";

	try {
		const url = new URL(raw);
		for (const key of Array.from(url.searchParams.keys())) {
			if (/^utm_/i.test(key)) {
				url.searchParams.delete(key);
			}
		}
		url.hash = "";
		const pathname = url.pathname.replace(/\/+$/, "") || "/";
		return `${url.origin}${pathname}${url.search}`.toLowerCase();
	} catch {
		return raw.replace(/\/+$/, "").toLowerCase();
	}
}

/* ─────────────── Função para fetch com Proxy (como site-camarote) ─────────────── */
async function fetchFeedXML(
	feedUrl: string,
	proxyBase: string,
): Promise<string> {
	// Sempre usa proxy se disponível (melhor que fallback pro fetch direto)
	if (typeof proxyBase === "string" && proxyBase.trim().length > 0) {
		try {
			const url = new URL(`${proxyBase.replace(/\/$/, "")}/api/rss`);
			url.searchParams.set("url", feedUrl);
			url.searchParams.set("cacheMinutes", "30");

			console.log(`📡 [Proxy] Fetching: ${feedUrl}`);
			console.log(`📡 [Proxy] URL: ${url.toString()}`);

			const res = await fetch(url.toString(), {
				method: "GET",
				headers: {
					Accept: "application/json, application/xml, text/xml, */*",
				},
			});

			if (!res.ok) {
				console.error(`❌ [Proxy] HTTP ${res.status}: ${url.toString()}`);
				throw new Error(`Proxy RSS: HTTP ${res.status}`);
			}

			const text = await res.text();
			console.log(`✅ [Proxy] Fetched ${text.length} bytes`);

			// suporta JSON { xml: "<rss/>" } ou retorno raw "<rss/>"
			try {
				const maybeJson = JSON.parse(text) as { xml?: unknown };
				if (typeof maybeJson?.xml === "string") {
					console.log(`✅ [Proxy] JSON response detected`);
					return maybeJson.xml;
				}
			} catch {
				// ignore - talvez seja XML direto
			}
			return text;
		} catch (error) {
			console.error(`❌ [Proxy] Error:`, error);
			throw error;
		}
	}

	throw new Error(
		"Nenhum proxy configurado. Configure VITE_RSS_PROXY_BASE na variável de ambiente.",
	);
}

/* ─────────────── Função para parsear RSS ─────────────── */
async function fetchRSSFeeds(
	urls: string[],
	proxyBase: string,
): Promise<EditorialArticle[]> {
	const allArticles: (EditorialArticle & { pubTime: number })[] = [];

	const results = await Promise.all(
		urls.map(async (url) => {
			if (!url) return [];
			try {
				const xml = await fetchFeedXML(url, proxyBase);
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(xml, "application/xml");

				if (xmlDoc.documentElement.nodeName === "parsererror") {
					console.error(
						`❌ XML Parse Error for ${url}:`,
						xmlDoc.documentElement.textContent,
					);
					return [];
				}

				const items = xmlDoc.querySelectorAll("item");
				console.log(`📰 Found ${items.length} items in ${url}`);

				const articles: (EditorialArticle & { pubTime: number })[] = [];

				items.forEach((item) => {
					const title =
						item.querySelector("title")?.textContent || "Sem título";
					let description =
						item.querySelector("description")?.textContent || "";
					const link = item.querySelector("link")?.textContent || "#";
					const pubDateStr = item.querySelector("pubDate")?.textContent || "";

					const pubTime = pubDateStr ? new Date(pubDateStr).getTime() : 0;

					// Remove tags HTML da descrição (strip <img>, <p>, etc)
					description = description
						.replace(/<[^>]*>/g, " ")
						.replace(/\s+/g, " ")
						.trim();

					// Extrair imagem usando regex (namespace-safe, como site-camarote faz)
					const itemXml = new XMLSerializer().serializeToString(item);
					const image = extractImageUrl(itemXml);

					articles.push({
						title,
						description: `${description.substring(0, 150)}...`,
						link,
						pubDate: pubDateStr,
						image,
						pubTime,
					});
				});

				console.log(`✔️ Parsed ${articles.length} articles from ${url}`);
				return articles;
			} catch (error) {
				const msg = error instanceof Error ? error.message : String(error);
				console.error(`❌ Erro ao carregar feed RSS (${url}):`, msg);
				return [];
			}
		}),
	);

	results.forEach((articles) => {
		allArticles.push(...articles);
	});

	console.log(`🎯 Total articles: ${allArticles.length}`);

	const sortedArticles = allArticles.sort((a, b) => b.pubTime - a.pubTime);
	const seen = new Set<string>();
	const uniqueArticles = sortedArticles.filter((article) => {
		const normalizedLink = normalizeArticleLink(article.link);
		const fallbackKey =
			`${article.title}|${article.pubDate || ""}`.toLowerCase();
		const dedupeKey = normalizedLink || fallbackKey;
		if (!dedupeKey) return true;
		if (seen.has(dedupeKey)) return false;
		seen.add(dedupeKey);
		return true;
	});

	return uniqueArticles.slice(0, 6).map(({ pubTime, ...article }) => article);
}

/* ─────────────── Extrair imagens do XML usando regex (namespace-safe) ─────────────── */
function extractImageUrl(itemXml: string): string {
	console.log(`🖼️ Extracting image from item...`);

	// 1) Tenta encontrar media:content ou media:thumbnail
	const mediaMatch = itemXml.match(
		/<media:(?:content|thumbnail)[^>]+url=["']([^"']+)["']/,
	);
	if (mediaMatch?.[1]) {
		console.log(`✅ Found image via media:content/thumbnail: ${mediaMatch[1]}`);
		return mediaMatch[1];
	}

	// 2) Tenta encontrar img tag dentro de description/CDATA
	const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
	if (imgMatch?.[1]) {
		console.log(`✅ Found image via img tag: ${imgMatch[1]}`);
		return imgMatch[1];
	}

	// 3) Tenta encontrar enclosure com type image
	const enclosureMatch = itemXml.match(
		/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/,
	);
	if (enclosureMatch?.[1]) {
		console.log(`✅ Found image via enclosure: ${enclosureMatch[1]}`);
		return enclosureMatch[1];
	}

	// 4) Tenta encontrar image tag (RSS 2.0)
	const imageSrcMatch = itemXml.match(/<image><url>([^<]+)<\/url>/);
	if (imageSrcMatch?.[1]) {
		console.log(`✅ Found image via image tag: ${imageSrcMatch[1]}`);
		return imageSrcMatch[1];
	}

	console.log(`❌ No image found in item`);
	return "";
}

/* ─────────────── Componente ─────────────── */
export function EditorialCoverage({ data, ...props }: EditorialCoverageProps) {
	const { title, description, rssUrls = [] } = data;
	const [articles, setArticles] = useState<EditorialArticle[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Proxy base (como em site-camarote)
	const proxyBase = (() => {
		if (typeof import.meta === "undefined") return "";
		try {
			const env = import.meta.env as Record<string, string> | undefined;
			// Usa proxy padrão se nenhum estiver configurado
			return (
				env?.VITE_RSS_PROXY_BASE ||
				"https://rss-proxy-alt4qbwtj-berall.vercel.app"
			);
		} catch {
			return "https://rss-proxy-alt4qbwtj-berall.vercel.app";
		}
	})();

	useEffect(() => {
		if (!rssUrls || rssUrls.length === 0) {
			setArticles([]);
			setError(null);
			return;
		}

		setLoading(true);
		setError(null);

		fetchRSSFeeds(rssUrls, proxyBase)
			.then((result) => {
				setArticles(result);
				if (result.length === 0) {
					setError(
						"Estamos preparando novidades para esta seção. Volte em instantes.",
					);
				}
			})
			.catch((err) => {
				console.error("Erro ao buscar feeds:", err);
				setError(
					err instanceof Error
						? err.message
						: "Erro ao carregar RSS. Configure VITE_RSS_PROXY_BASE se necessário.",
				);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [rssUrls, proxyBase]);

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: anchor id for menu navigation
		<section className="py-16" id="editorial-coverage" {...props}>
			<div className="w-full mx-auto px-4 max-w-6xl">
				<TitleSection name={title || "Cobertura Editorial"} />
				{description ? (
					<p className="text-(--text)/70 text-sm md:text-base mb-6 text-center max-w-3xl mx-auto">
						{description}
					</p>
				) : null}

				{loading && (
					<div className="text-center py-12">
						<p className="text-(--text)/60">Carregando artigos...</p>
					</div>
				)}

				{error && !loading && (
					<div className="text-center py-12 border border-(--text)/20 rounded-lg p-6">
						<p className="text-(--text)/60">{error}</p>
						{!proxyBase && (
							<p className="text-xs text-(--text)/40 mt-2">
								💡 Dica: Configure VITE_RSS_PROXY_BASE para evitar problemas de
								CORS
							</p>
						)}
					</div>
				)}

				{!loading && articles.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{articles.map((article, index) => (
							<a
								// biome-ignore lint/suspicious/noArrayIndexKey: stable index
								key={index}
								href={article.link}
								target="_blank"
								rel="noopener noreferrer"
								className="group block rounded-lg overflow-hidden bg-(--surface) border border-(--text)/10 hover:border-(--dark) hover:shadow-lg transition-all"
							>
								{article.image && (
									<div className="w-full h-48 overflow-hidden bg-(--text)/5">
										<img
											src={article.image}
											alt={article.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform"
										/>
									</div>
								)}
								<div className="p-4">
									<h3 className="font-semibold text-(--title) text-sm mb-2 line-clamp-2">
										{article.title}
									</h3>
									<p className="text-(--text)/70 text-xs line-clamp-2 mb-3">
										{article.description}
									</p>
									<div className="text-xs text-(--dark) group-hover:underline">
										Leia mais →
									</div>
								</div>
							</a>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
