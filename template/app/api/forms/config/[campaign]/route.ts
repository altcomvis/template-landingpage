import { NextResponse } from "next/server";

/**
 * Configurações dinâmicas por campanha
 * No futuro isso pode vir de um banco, KV, SFMC, Google Sheet etc.
 */
const CAMPAIGN_CONFIGS: Record<string, any> = {
	"rio-gastronomia-2025": {
		formActive: true,
		formStart: "2025-01-10T00:00:00Z",
		formEnd: "2025-01-30T23:59:00Z",
		closedMessage: "As inscrições para esta edição já foram encerradas.",
	},
	"voices-2025": {
		formActive: true,
		formStart: "2025-02-01T00:00:00Z",
		formEnd: "2025-03-15T23:59:59Z",
		closedMessage: "Inscrições encerradas para o Voices 2025.",
	},
};

export async function GET(
	_req: Request,
	context: { params: { campaign: string } },
) {
	const campaign = context.params.campaign;

	const config = CAMPAIGN_CONFIGS[campaign];

	if (!config) {
		return NextResponse.json(
			{ error: "Configuração não encontrada para esta campanha" },
			{ status: 404 },
		);
	}

	return NextResponse.json({ success: true, config });
}
