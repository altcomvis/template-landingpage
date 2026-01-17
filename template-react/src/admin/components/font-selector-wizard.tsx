import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";

interface GeneralData {
	fontBody: string;
	fontTitle: string;
	// Add other fields as needed
}

interface FontSelectorProps {
	googleFonts: string[];
	general: GeneralData;
	updateField: (field: keyof GeneralData, value: string) => void;
}
export function FontSelectorWizard({
	googleFonts,
	general,
	updateField,
}: FontSelectorProps) {
	const [step, setStep] = useState<"body" | "title">("body");
	const [selectedBody, setSelectedBody] = useState(general.fontBody);
	const [selectedTitle, setSelectedTitle] = useState(general.fontTitle);

	const fonts =
		googleFonts.length > 0 ? googleFonts : ["Poppins", "Roboto", "Inter"];

	const handleSelect = (font: string) => {
		if (step === "body") {
			setSelectedBody(font);
			updateField("fontBody", font);

			// ✨ Flash visual no preview do body
			const el = document.getElementById("font-body-preview");
			if (el) {
				el.classList.remove("font-flash");
				void el.offsetWidth; // força reflow para reiniciar animação
				el.classList.add("font-flash");
			}

			setStep("title");
		} else {
			setSelectedTitle(font);
			updateField("fontTitle", font);

			// ✨ Flash visual no preview do title
			const el = document.getElementById("font-title-preview");
			if (el) {
				el.classList.remove("font-flash");
				void el.offsetWidth;
				el.classList.add("font-flash");
			}
		}
	};

	return (
		<div className="p-3">
			<div className="flex items-center justify-between mb-2">
				<h4 className="font-semibold text-lg text-zinc-700">
					{step === "body"
						? "Escolha a fonte geral"
						: "Escolha a fonte dos títulos das seções"}
				</h4>
				{step === "title" && (
					<Button
						variant="destructive"
						onClick={() => setStep("body")}
						className="text-xs"
					>
						← voltar
					</Button>
				)}
			</div>

			<Command>
				<CommandInput placeholder="Buscar fonte..." />
				<CommandEmpty>Nenhuma fonte encontrada.</CommandEmpty>

				<CommandGroup>
					{fonts.map((font) => (
						<CommandItem
							key={font}
							value={font}
							onSelect={() => handleSelect(font)}
							className="flex justify-between"
						>
							<span style={{ fontFamily: font }}>{font}</span>
							{(step === "body" && font === selectedBody) ||
							(step === "title" && font === selectedTitle) ? (
								<Check className="w-4 h-4 text-green-600" />
							) : (
								<ChevronRight className="w-4 h-4 opacity-40" />
							)}
						</CommandItem>
					))}
				</CommandGroup>
			</Command>

			{/* Exemplo visual */}
			<div className="border-t mt-3 pt-2 text-xs text-zinc-600 space-y-1">
				{selectedBody && (
					<p style={{ fontFamily: selectedBody }}>
						Corpo: The quick brown fox jumps over the lazy dog.
					</p>
				)}
				{selectedTitle && (
					<p
						style={{ fontFamily: selectedTitle }}
						className="font-bold uppercase"
					>
						Título: THE QUICK BROWN FOX
					</p>
				)}
			</div>
		</div>
	);
}
