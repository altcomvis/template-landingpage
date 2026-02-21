import { useEffect, useState } from "react";
import { getBasePath } from "@/utils/getBasePath";

type SeoData = {
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string;
	seoUrl?: string;
	seoImage?: string;
	googleAnalyticsId?: string;
	pixelMeta?: string;
	directoryName?: string;
};

export function SeoHead() {
	const [seo, setSeo] = useState<SeoData | null>(null);

	useEffect(() => {
		// ✅ usa o BASE_URL (funciona em dev e produção)
		const jsonUrl = `${import.meta.env.BASE_URL}landing.json`;

		fetch(jsonUrl)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				return res.json();
			})
			.then((data) => setSeo(data.general))
			.catch((err) => console.error("Erro ao carregar SEO:", err));
	}, []);

	useEffect(() => {
		if (!seo) return;

		const {
			seoTitle,
			seoDescription,
			seoKeywords,
			seoUrl,
			seoImage,
			googleAnalyticsId,
			pixelMeta,
		} = seo;

		const defaultTitle = "Projeto Especial - Editora Globo";
		const defaultDesc =
			"Landing Page criada pela Editora Globo. Confira conteúdos, eventos e projetos especiais.";
		const defaultImage = `${getBasePath()}img/cover.webp`;

		// 🔹 utilitários locais
		const setMeta = (name: string, content?: string) => {
			if (!content) return;
			let tag =
				document.querySelector(`meta[name='${name}']`) ||
				document.createElement("meta");
			tag.setAttribute("name", name);
			tag.setAttribute("content", content);
			document.head.appendChild(tag);
		};

		const setOG = (property: string, content?: string) => {
			if (!content) return;
			let tag =
				document.querySelector(`meta[property='${property}']`) ||
				document.createElement("meta");
			tag.setAttribute("property", property);
			tag.setAttribute("content", content);
			document.head.appendChild(tag);
		};

		const setLink = (rel: string, href?: string) => {
			if (!href) return;
			let link =
				document.querySelector(`link[rel='${rel}']`) ||
				document.createElement("link");
			link.setAttribute("rel", rel);
			link.setAttribute("href", href);
			document.head.appendChild(link);
		};

		// 🧭 Título e metadados básicos
		document.title = seoTitle || defaultTitle;
		setMeta("description", seoDescription || defaultDesc);
		setMeta("keywords", seoKeywords || "editora globo, projetos, eventos");

		// 🔗 Canonical
		setLink("canonical", seoUrl || window.location.href);

		// 🌐 Open Graph
		setOG("og:title", seoTitle || defaultTitle);
		setOG("og:description", seoDescription || defaultDesc);
		setOG("og:type", "website");
		setOG("og:url", seoUrl || window.location.href);
		setOG("og:image", seoImage || defaultImage);
		setOG("og:image:width", "1200");
		setOG("og:image:height", "630");
		setOG("og:locale", "pt_BR");
		setOG("og:site_name", "Editora Globo");

		// 🐦 Twitter Cards
		setMeta("twitter:card", "summary_large_image");
		setMeta("twitter:title", seoTitle || defaultTitle);
		setMeta("twitter:description", seoDescription || defaultDesc);
		setMeta("twitter:image", seoImage || defaultImage);
		setMeta("twitter:site", "@EditoraGlobo");
		setMeta("twitter:creator", "@EditoraGlobo");

		// 📱 WhatsApp / Telegram
		setMeta("image", seoImage || defaultImage);

		// 📈 Google Analytics
		if (googleAnalyticsId) {
			if (!document.getElementById("ga-script")) {
				const script = document.createElement("script");
				script.id = "ga-script";
				script.async = true;
				script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
				document.head.appendChild(script);

				const inlineScript = document.createElement("script");
				inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `;
				document.head.appendChild(inlineScript);
			}
		}

		// 🔹 Meta Pixel (Facebook)
		if (pixelMeta && !document.getElementById("meta-pixel-script")) {
			const script = document.createElement("script");
			script.id = "meta-pixel-script";
			script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelMeta}');
        fbq('track', 'PageView');
      `;
			document.head.appendChild(script);

			const noScript = document.createElement("noscript");
			noScript.innerHTML = `
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelMeta}&ev=PageView&noscript=1"/>
      `;
			document.body.appendChild(noScript);
		}
	}, [seo]);

	return null;
}
