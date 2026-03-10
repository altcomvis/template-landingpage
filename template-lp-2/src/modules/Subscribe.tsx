import type { SubscribeData } from "@globo/form-engine";
import { Subscribe as SharedSubscribe } from "@globo/form-engine";

interface SubscribeProps extends React.HTMLAttributes<HTMLElement> {
	data: SubscribeData;
}

const TEMPLATE_DEFAULT_FIELDS: SubscribeData["fields"] = [
	{ id: "name", label: "Nome", visible: true },
	{ id: "email", label: "Email", visible: true },
	{ id: "phone", label: "Telefone", visible: true },
	{ id: "document", label: "CPF", visible: true },
	{ id: "position", label: "Cargo", visible: true },
	{ id: "company", label: "Empresa", visible: true },
	{ id: "optin1", label: "Aceito os termos.", visible: true },
	{ id: "optin2", label: "Aceito receber comunicações.", visible: true },
];

function withTemplateDefaults(data: SubscribeData): SubscribeData {
	const hasVisibleFields = Array.isArray(data.fields)
		? data.fields.some((field) => field?.visible)
		: false;

	if (hasVisibleFields) return data;

	return {
		...data,
		fields: TEMPLATE_DEFAULT_FIELDS,
	};
}

export default function Subscribe({ data, ...props }: SubscribeProps) {
	return <SharedSubscribe data={withTemplateDefaults(data)} {...props} />;
}
