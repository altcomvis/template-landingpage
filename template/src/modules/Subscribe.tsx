import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { TitleSection } from "../components/title-sections";

/* ─────────────── Tipos ─────────────── */
interface SubscribeField {
	id: string;
	label: string;
	visible: boolean;
}

interface SubscribeData {
	title: string;
	description: string;
	visible: boolean;
	successMessage: string;
	formUrl: string;
	formsConfig: {
		FORMS_URL_BASE64: string;
		QUESTION_IDS: Record<
			| "name"
			| "document"
			| "email"
			| "phone"
			| "position"
			| "company"
			| "message"
			| "optin1"
			| "optin2",
			string
		>;
	};
	fields: SubscribeField[];
}

interface SubscribeProps extends React.HTMLAttributes<HTMLElement> {
	data: SubscribeData;
}

/* ─────────────── Máscaras e validações ─────────────── */
const formatCPF = (value: string) =>
	value
		.replace(/\D/g, "")
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2")
		.slice(0, 14);

const formatCNPJ = (value: string) =>
	value
		.replace(/\D/g, "")
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.slice(0, 18);

const validateCPF = (raw: string) => {
	const cpf = raw.replace(/\D/g, "");
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
	let sum = 0;
	for (let i = 0; i < 9; i++)
		sum += Number.parseInt(cpf.charAt(i), 10) * (10 - i);
	let rev = 11 - (sum % 11);
	if (rev >= 10) rev = 0;
	if (rev !== Number.parseInt(cpf.charAt(9), 10)) return false;
	sum = 0;
	for (let i = 0; i < 10; i++)
		sum += Number.parseInt(cpf.charAt(i), 10) * (11 - i);
	rev = 11 - (sum % 11);
	if (rev >= 10) rev = 0;
	return rev === Number.parseInt(cpf.charAt(10), 10);
};

const validateCNPJ = (raw: string) => {
	const cnpj = raw.replace(/\D/g, "");
	if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
	const validateDigit = (v: string, length: number) => {
		let sum = 0;
		let pos = length - 7;
		for (let i = length; i >= 1; i--) {
			sum += Number.parseInt(v[length - i], 10) * pos--;
			if (pos < 2) pos = 9;
		}
		return sum % 11 < 2 ? 0 : 11 - (sum % 11);
	};
	return (
		validateDigit(cnpj, 12) === Number.parseInt(cnpj[12], 10) &&
		validateDigit(cnpj, 13) === Number.parseInt(cnpj[13], 10)
	);
};

/* ─────────────── Schema base (Zod) ─────────────── */
const baseSchema = z.object({
	name: z.string().min(2, "Nome inválido"),
	document: z
		.string()
		.min(14, "Documento inválido")
		.refine((value) => {
			const only = value.replace(/\D/g, "");
			return only.length === 11 ? validateCPF(only) : validateCNPJ(only);
		}, "Documento inválido"),
	email: z.string().email("Email inválido"),
	phone: z
		.string()
		.min(1, "Telefone obrigatório")
		.refine((phone) => isValidPhoneNumber(phone), {
			message: "Telefone inválido",
		}),
	position: z.string().min(2, "Cargo inválido"),
	company: z.string().min(2, "Empresa inválida"),
	message: z.string().min(5, "Mensagem muito curta"),
	optin1: z.enum(["Aceite1"], { message: "Obrigatório" }),
	optin2: z.enum(["Aceite2"], { message: "Obrigatório" }),
});

type FormValues = z.infer<typeof baseSchema>;

/* ─────────────── Componente principal ─────────────── */
export default function Subscribe({ data, ...props }: SubscribeProps) {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const [successOpen, setSuccessOpen] = useState(false);

	// Campos visíveis
	const visibleLabels = data.fields
		.filter((f) => f.visible)
		.map((f) => f.label.toLowerCase());

	// Adapta o schema com base na visibilidade dos campos
	const formSchema = useMemo(() => {
		let schema = baseSchema;
		if (!visibleLabels.includes("message"))
			schema = schema.omit({ message: true });
		if (!visibleLabels.includes("optin1"))
			schema = schema.omit({ optin1: true });
		if (!visibleLabels.includes("optin2"))
			schema = schema.omit({ optin2: true });
		return schema;
	}, [visibleLabels]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			document: "",
			email: "",
			phone: "",
			position: "",
			company: "",
			message: "",
		},
	});

	const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "");
		const formatted = value.length <= 11 ? formatCPF(value) : formatCNPJ(value);
		form.setValue("document", formatted, { shouldValidate: true });
	};

	const handleSuccessOpenChange = (open: boolean) => {
		setSuccessOpen(open);
		if (!open) {
			form.reset();
			form.clearErrors();
			requestAnimationFrame(() => setFormKey((k) => k + 1));
			window.location.reload();
		}
	};

	const BACKEND_URL = "https://backend-form-dusky.vercel.app/api/submit-form";

	const onSubmit: SubmitHandler<FormValues> = async (values) => {
		if (isUploading) return;
		setIsUploading(true);
		try {
			const cfg = data.formsConfig;
			const answers = Object.entries(values).map(([key, value]) => ({
				questionId: cfg.QUESTION_IDS[key as keyof typeof cfg.QUESTION_IDS],
				answer1: value,
			}));

			const resp = await fetch(BACKEND_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					target_b64: cfg.FORMS_URL_BASE64,
					startDate: new Date().toISOString(),
					submitDate: new Date().toISOString(),
					answers,
				}),
			});

			if (!resp.ok) throw new Error(`Erro ${resp.status}`);
			setSuccessOpen(true);
		} catch (error) {
			console.error(error);
			toast({
				title: "Erro no envio",
				description: "Não foi possível enviar o formulário.",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
		}
	};

	/* ─────────────── Render ─────────────── */
	return (
		<Card
			{...props}
			className="w-10/12 md:w-full max-w-3xl mx-auto mt-10 bg-[var(--surface)]"
			id="subscribe"
		>
			<CardContent className="p-6">
				<TitleSection name={data.title} description={data.description} />

				<Form key={formKey} {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-1 md:grid-cols-2 gap-4"
					>
						{/* Campos principais */}
						{[
							"name",
							"document",
							"email",
							"phone",
							"position",
							"company",
							"message",
						].map((field) =>
							visibleLabels.includes(field) ? (
								<FormField
									key={field}
									control={form.control}
									name={field as keyof FormValues}
									render={({ field: formField }) => {
										const placeholders: Record<string, string> = {
											name: "Nome completo",
											document: "CPF/CNPJ",
											email: "E-mail",
											phone: "Telefone",
											position: "Cargo",
											company: "Empresa",
											message: "Mensagem",
										};
										return (
											<FormItem
												className={field === "message" ? "col-span-2" : ""}
											>
												<FormControl>
													{field === "phone" ? (
														<PhoneInput
															{...formField}
															placeholder={placeholders[field]}
															international
															defaultCountry="BR"
															onChange={(val) =>
																form.setValue("phone", val || "", {
																	shouldValidate: true,
																})
															}
															className="border px-2 py-[.35rem] rounded-md text-[var(--text)] text-sm w-full"
														/>
													) : field === "message" ? (
														<Textarea
															{...formField}
															placeholder={placeholders[field]}
															className="min-h-28 text-[var(--text)]"
														/>
													) : (
														<Input
															{...formField}
															placeholder={placeholders[field]}
															className="text-[var(--text)]"
															onChange={
																field === "document"
																	? handleDocumentChange
																	: formField.onChange
															}
														/>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							) : null,
						)}

						{/* Opt-ins */}
						{["optin1", "optin2"].map((opt) =>
							visibleLabels.includes(opt) ? (
								<FormField
									key={opt}
									control={form.control}
									name={opt as keyof FormValues}
									render={({ field }) => (
										<FormItem className="col-span-2">
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="flex space-x-4"
											>
												<FormItem className="flex gap-2 items-center">
													<FormControl>
														<RadioGroupItem
															className="mt-2 bg-[var(--text)]"
															value={opt === "optin1" ? "Aceite1" : "Aceite2"}
														/>
													</FormControl>
													<p className="text-[var(--text)] text-sm leading-tight">
														{opt === "optin1" ? (
															<>
																Li e concordo com os{" "}
																<a
																	href="https://privacidade.globo.com/privacy-policy/"
																	target="_blank"
																	className="underline"
																>
																	Termos de Uso e Política de Privacidade
																</a>
																.
															</>
														) : (
															<>
																Autorizo o uso dos meus dados para comunicações
																do Grupo Globo e patrocinadores.
															</>
														)}
													</p>
												</FormItem>
											</RadioGroup>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : null,
						)}

						{/* Botão */}
						<div className="col-span-2">
							<Button
								type="submit"
								disabled={isUploading}
								className="w-full text-lg bg-[var(--background)] hover:bg-zinc-400/25 transition"
							>
								{isUploading ? (
									<Loader2 className="animate-spin mr-2" />
								) : (
									"Enviar"
								)}
							</Button>
						</div>
					</form>
				</Form>

				{/* ✅ Modal de sucesso */}
				<Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
					<DialogContent className="bg-zinc-100 text-zinc-500">
						<DialogHeader>
							<DialogTitle>Inscrição enviada!</DialogTitle>
							<DialogDescription>{data.successMessage}</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" onClick={() => setSuccessOpen(false)}>
									Fechar
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
