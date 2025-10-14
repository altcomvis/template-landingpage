import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface HeroData {
	subtitle: string;
	subtitleColor?: string;
	date: string;
	time: string;
	location: string;
	address: string;
	useBackgroundImage: boolean;
	useLightRays?: boolean;
	lightRaysColor?: string;
	logoSize?: "grande" | "medio" | "pequeno";
}

interface HeroFormProps {
	data: { hero?: HeroData };
	setData: (newData: Record<string, unknown>) => void;
}

export default function HeroForm({ data, setData }: HeroFormProps) {
	const hero = data.hero || {
		subtitle: "",
		subtitleColor: "#ffffff",
		date: "",
		time: "",
		location: "",
		address: "",
		useBackgroundImage: false,
		useLightRays: false,
		lightRaysColor: "#ffffff",
		logoSize: "medio",
	};

	const [localHero, setLocalHero] = useState<HeroData>(hero);

	useEffect(() => {
		setLocalHero(hero);
	}, [hero]);

	const updateField = (field: keyof HeroData, value: string | boolean) => {
		const updated = { ...localHero, [field]: value };
		setLocalHero(updated);
		setData({ ...data, hero: updated });
	};

	return (
		<Card className="mt-6">
			<CardContent className="space-y-6 p-6">
				{/* ⚙️ Switches principais */}
				<div className="flex flex-wrap justify-end gap-8">
					<div className="flex items-center gap-3">
						<Label>Usar imagem de fundo</Label>
						<Switch
							checked={localHero.useBackgroundImage}
							onCheckedChange={(checked) =>
								updateField("useBackgroundImage", checked)
							}
						/>
					</div>

					<div className="flex items-center gap-3">
						<Label>Ativar Light Rays</Label>
						<Switch
							checked={localHero.useLightRays ?? false}
							onCheckedChange={(checked) =>
								updateField("useLightRays", checked)
							}
						/>
					</div>

					{/* 🎨 Seletor de cor do Light Rays */}
					{localHero.useLightRays && (
						<div className="flex items-center gap-3">
							<Label>Cor dos Raios</Label>
							<Input
								type="color"
								value={localHero.lightRaysColor || "#ffffff"}
								onChange={(e) =>
									updateField("lightRaysColor", e.target.value || "#ffffff")
								}
								className="w-12 h-8 cursor-pointer"
							/>
						</div>
					)}
				</div>

				{/* ⚙️ Configurações visuais do Hero */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">
						Aparência do Hero
					</Label>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* 🖼️ Tamanho do Logo */}
						<div className="flex flex-col gap-3">
							<Label>Tamanho do Logo</Label>
							<Select
								value={localHero.logoSize || "medio"}
								onValueChange={(value) =>
									updateField(
										"logoSize",
										value as "grande" | "medio" | "pequeno",
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o tamanho" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="grande">Grande</SelectItem>
									<SelectItem value="medio">Médio</SelectItem>
									<SelectItem value="pequeno">Pequeno</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				{/* 🗓️ Campos de texto */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6 mt-6">
					<div className="flex justify-between gap-2">
						<div className="w-full">
							<Label>Subtítulo</Label>
							<Input
								value={localHero.subtitle}
								onChange={(e) => updateField("subtitle", e.target.value)}
								placeholder="Ex: 10ª edição | Sustentabilidade e Inovação"
							/>
						</div>
						<div>
							<Label>Cor</Label>
							<Input
								type="color"
								value={localHero.subtitleColor || "#ffffff"}
								onChange={(e) =>
									updateField("subtitleColor", e.target.value || "#ffffff")
								}
								className="w-12 h-8 cursor-pointer"
							/>
						</div>
					</div>

					<div>
						<Label>Data</Label>
						<Input
							value={localHero.date}
							onChange={(e) => updateField("date", e.target.value)}
							placeholder="Ex: 23/11"
						/>
					</div>

					<div>
						<Label>Horário</Label>
						<Input
							value={localHero.time}
							onChange={(e) => updateField("time", e.target.value)}
							placeholder="Ex: 9h às 18h"
						/>
					</div>

					<div>
						<Label>Local</Label>
						<Input
							value={localHero.location}
							onChange={(e) => updateField("location", e.target.value)}
							placeholder="Ex: Parque Ibirapuera"
						/>
					</div>

					<div className="md:col-span-2">
						<Label>Endereço</Label>
						<Input
							value={localHero.address}
							onChange={(e) => updateField("address", e.target.value)}
							placeholder="Ex: Av. Pedro Álvares Cabral, São Paulo - SP"
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
