import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { FontSelectorWizard } from "../components/font-selector-wizard";

/* ──────────────────────────────── */
/* Tipos */
interface GeneralData {
	projectName: string;
	primaryColor: string;
	secondaryColor: string;
	darkColor: string;
	lightColor: string;
	backgroundColor: string;
	surfaceColor: string;
	textColor: string;
	backgroundMode: "solid" | "primary" | "secondary" | "dark" | "mylight";
	fontBody?: string; // ⇐ opcional
	fontTitle?: string; // ⇐ opcional
	enableParallax?: boolean;
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string;
	googleAnalyticsId?: string;
	directoryName?: string;
	pixelMeta?: string;
}

interface GeneralFormProps {
	data: { general?: Partial<GeneralData> };
	setData: (newData: Record<string, unknown>) => void;
	googleFonts?: string[];
}

/* ──────────────────────────────── */
/* Campo de cor com # fixo */
function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
}) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let inputValue = e.target.value.trim().toUpperCase();
		if (!inputValue.startsWith("#")) inputValue = `#${inputValue}`;
		inputValue = inputValue.replace(/[^#0-9A-F]/g, "").slice(0, 7);
		onChange(inputValue);
	};

	return (
		<div className="flex flex-col gap-2">
			<Label>{label}</Label>
			<Input
				type="text"
				value={value}
				onChange={handleChange}
				placeholder="#000000"
				maxLength={7}
				className="w-28 text-center font-mono uppercase"
			/>
		</div>
	);
}

/* ──────────────────────────────── */
/* Componente principal */
export default function GeneralForm({
	data,
	setData,
	googleFonts = [],
}: GeneralFormProps) {
	const general: GeneralData = {
		projectName: "",
		primaryColor: "#0057FF",
		secondaryColor: "#FFAA00",
		darkColor: "#111111",
		lightColor: "#F5F5F5",
		backgroundColor: "#EAEAEA",
		surfaceColor: "#FFFFFF",
		textColor: "#222222",
		backgroundMode: "solid",
		fontBody: "Poppins",
		fontTitle: "Poppins",
		enableParallax: true,
		seoTitle: "",
		seoDescription: "",
		seoKeywords: "",
		googleAnalyticsId: "",
		directoryName: "",
		pixelMeta: "",
		...(data.general ?? {}),
	};

	const updateField = (field: keyof GeneralData, value: string | boolean) => {
		const updated = { ...general, [field]: value };
		setData({ ...data, general: updated });
	};

	return (
		<Card className="mt-6">
			<CardContent className="space-y-10 p-6">
				<div className="flex gap-8 ">
					{/* 🔹 Nome do projeto */}
					<div className="w-full">
						<Label>Nome do Projeto</Label>
						<Input
							value={general.projectName}
							onChange={(e) => updateField("projectName", e.target.value)}
							placeholder="Ex: Energy & Tech"
						/>
					</div>
					<div>
						{/* Switch Parallax */}
						<div className="flex items-center gap-4 mt-6">
							<Label>Ativar Parallax</Label>
							<Switch
								checked={general.enableParallax ?? false}
								onCheckedChange={(checked) =>
									updateField("enableParallax", checked)
								}
							/>
						</div>
						<p className="text-xs text-zinc-500 mt-2">
							Ativa animações sutis de fade, blur e movimento ao rolar.
						</p>
					</div>
				</div>
				{/* 🔤 Tipografia */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">Tipografia</Label>

					<Popover>
						<div className="flex justify-between items-center">
							<Label className="font-semibold">Fontes Google</Label>
							<PopoverTrigger asChild>
								<Button type="button" variant="outline" size="sm">
									+ Selecionar
								</Button>
							</PopoverTrigger>
						</div>

						<PopoverContent
							className="w-[22rem] max-h-[28rem] overflow-y-auto p-0"
							align="start"
						>
							<FontSelectorWizard
								googleFonts={googleFonts}
								general={{
									...general,
									fontBody: general.fontBody ?? "",
									fontTitle: general.fontTitle ?? "",
								}}
								updateField={updateField}
							/>
						</PopoverContent>
					</Popover>

					{/* Pré-visualização */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
						<div>
							<Label>Fonte do corpo</Label>
							<p
								className="text-sm text-zinc-500 mt-2 border rounded-md px-3 py-2 bg-zinc-50"
								style={{ fontFamily: general.fontBody }}
							>
								The quick brown fox jumps over the lazy dog.
							</p>
						</div>

						<div>
							<Label>Fonte dos títulos</Label>
							<p
								className="text-base text-zinc-700 mt-2 border rounded-md px-3 py-2 bg-zinc-50 font-semibold uppercase"
								style={{ fontFamily: general.fontTitle }}
							>
								THE QUICK BROWN FOX
							</p>
						</div>
					</div>
				</div>

				{/* 🎨 Paleta base */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">
						Paleta Base
					</Label>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-6">
						<ColorField
							label="Primária"
							value={general.primaryColor}
							onChange={(val) => updateField("primaryColor", val)}
						/>
						<ColorField
							label="Secundária"
							value={general.secondaryColor}
							onChange={(val) => updateField("secondaryColor", val)}
						/>
						<ColorField
							label="Escura"
							value={general.darkColor}
							onChange={(val) => updateField("darkColor", val)}
						/>
						<ColorField
							label="Clara"
							value={general.lightColor}
							onChange={(val) => updateField("lightColor", val)}
						/>
						<ColorField
							label="Texto"
							value={general.textColor}
							onChange={(val) => updateField("textColor", val)}
						/>
					</div>
				</div>

				{/* 🌄 Fundo global */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">
						Fundo da Página
					</Label>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex flex-col gap-3">
							<Label>Modo de Fundo</Label>
							<select
								className="border rounded-md px-2 py-1 text-sm"
								value={general.backgroundMode}
								onChange={(e) =>
									updateField(
										"backgroundMode",
										e.target.value as
											| "solid"
											| "primary"
											| "secondary"
											| "dark"
											| "mylight",
									)
								}
							>
								<option value="solid">Cor personalizada</option>
								<option value="primary">Usar cor primária</option>
								<option value="secondary">Usar cor secundária</option>
								<option value="dark">Usar cor escura</option>
								<option value="mylight">Usar cor clara</option>
							</select>
						</div>

						{general.backgroundMode === "solid" && (
							<ColorField
								label="Cor de Fundo Global"
								value={general.backgroundColor}
								onChange={(val) => updateField("backgroundColor", val)}
							/>
						)}

						<ColorField
							label="Cor do Fundo do Conteúdo"
							value={general.surfaceColor}
							onChange={(val) => updateField("surfaceColor", val)}
						/>
					</div>
				</div>

				{/* 🌐 SEO */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">
						SEO e Metadados
					</Label>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="flex flex-col gap-2">
							<Label>Título da página (SEO Title)</Label>
							<Input
								value={general.seoTitle || ""}
								onChange={(e) => updateField("seoTitle", e.target.value)}
								placeholder="Título exibido nos buscadores"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Descrição (SEO Description)</Label>
							<Input
								value={general.seoDescription || ""}
								onChange={(e) => updateField("seoDescription", e.target.value)}
								placeholder="Resumo da página (até 160 caracteres)"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Palavras-chave (Keywords)</Label>
							<Input
								value={general.seoKeywords || ""}
								onChange={(e) => updateField("seoKeywords", e.target.value)}
								placeholder="palavras, separadas, por, vírgula"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label>Google Analytics ID</Label>
							<Input
								value={general.googleAnalyticsId || ""}
								onChange={(e) =>
									updateField("googleAnalyticsId", e.target.value)
								}
								placeholder="G-XXXXXXXXXX"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Pixel Meta (Facebook)</Label>
							<Input
								value={general.pixelMeta || ""}
								onChange={(e) => updateField("pixelMeta", e.target.value)}
								placeholder="Ex: 123456789012345"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label>Nome do Diretório (pasta no SVN)</Label>
							<Input
								value={general.directoryName || ""}
								onChange={(e) => updateField("directoryName", e.target.value)}
								placeholder="Ex: dialogosrj"
							/>
							<p className="text-xs text-zinc-500 mt-1">
								Usado no Vite base, sitemap e SEO URL.
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
