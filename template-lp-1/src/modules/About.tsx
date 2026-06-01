interface AboutProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		subtitle: string;
		paragraphs: string[];
	};
}

/**
 * About section — versão adaptada
 * - Recebe os dados via props (não importa o JSON diretamente)
 * - Suporta HTML básico em `paragraphs` (para bold/itálico/sublinhado)
 */
export function About({ data, ...props }: AboutProps) {
	const { subtitle, paragraphs } = data;

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: fixed section anchor id for menu navigation
		<section id="about" className="w-10/12 md:w-full mx-auto py-8 md:py-16">
			<div className="container mx-auto px-4 max-w-3xl text-center">
				{/* Subtítulo principal */}
				{subtitle && (
					<h3
						className="text-3xl font-semibold mb-6 text-(--title) md:max-w-[50ch]"
						{...props}
					>
						{subtitle}
					</h3>
				)}

				{/* Texto descritivo com suporte a HTML */}
				<div
					className="text-(--text) text-xl text-pretty md:max-w-[50ch] mx-auto [&_a]:text-(--title) [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-semibold [&_a:hover]:opacity-80"
					{...props}
				>
					{paragraphs.map((p, i) => (
						<p
							// biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are simple ordered rich-text blocks
							key={i}
							className="text-(--text) leading-relaxed mb-4"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content is intentionally authored in admin editor
							dangerouslySetInnerHTML={{ __html: p }}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
