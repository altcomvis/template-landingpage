import { Bold, Italic, Underline } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (editorRef.current && editorRef.current.innerHTML !== value) {
			editorRef.current.innerHTML = value;
		}
	}, [value]);

	const handleCommand = (cmd: string) => {
		document.execCommand(cmd, false);
		if (editorRef.current) {
			onChange(editorRef.current.innerHTML);
		}
	};

	const handleInput = () => {
		if (editorRef.current) onChange(editorRef.current.innerHTML);
	};

	return (
		<div className="border rounded-md bg-white">
			{/* Toolbar */}
			<div className="flex gap-1 border-b bg-zinc-50 p-1 justify-start">
				<Button
					type="button"
					size="icon"
					variant="ghost"
					onClick={() => handleCommand("bold")}
					title="Negrito"
				>
					<Bold className="w-4 h-4" />
				</Button>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					onClick={() => handleCommand("italic")}
					title="Itálico"
				>
					<Italic className="w-4 h-4" />
				</Button>
				<Button
					type="button"
					size="icon"
					variant="ghost"
					onClick={() => handleCommand("underline")}
					title="Sublinhado"
				>
					<Underline className="w-4 h-4" />
				</Button>
			</div>

			{/* Editor */}
			<div
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				className="min-h-[120px] p-3 text-sm leading-relaxed outline-none"
			></div>
		</div>
	);
}
