import { type NextRequest, NextResponse } from "next/server";

interface SFMCTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.json();

		if (!formData.email) {
			return NextResponse.json(
				{ success: false, error: "Email é obrigatório" },
				{ status: 400 },
			);
		}

		const clientId = process.env.SFMC_CLIENT_ID;
		const clientSecret = process.env.SFMC_CLIENT_SECRET;
		const authBase = process.env.SFMC_AUTH_URL?.replace(/\/$/, "");
		const authUrl = `${authBase}/v2/token`;
		const restUrl = process.env.SFMC_REST_URL;
		const dataExtensionKey = process.env.SFMC_DATA_EXTENSION_KEY; // EXTERNAL KEY

		if (
			!clientId ||
			!clientSecret ||
			!authUrl ||
			!restUrl ||
			!dataExtensionKey
		) {
			return NextResponse.json(
				{ success: false, error: "Variáveis de ambiente SFMC faltando" },
				{ status: 500 },
			);
		}

		// 1 — Obter access token
		const tokenResponse = await fetch(authUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret,
			}),
		});

		if (!tokenResponse.ok) {
			throw new Error("__Erro ao obter token SFMC__");
		}

		const tokenJson = (await tokenResponse.json()) as SFMCTokenResponse;
		const accessToken = tokenJson.access_token;

		// 2 — Montar payload (Upsert)
		const payload = {
			items: [
				{
					keys: {
						email: formData.email, // PK
					},
					values: {
						fullName: formData.fullName,
						badgeName: formData.badgeName,
						email: formData.email,
						phone: formData.phone,
						cpf: formData.cpf,
						company: formData.company,
						role: formData.role,
						termsUsage: formData.termsUsage ? "Sim" : "Não",
						termsData: formData.termsData ? "Sim" : "Não",
					},
				},
			],
		};

		// 3 — Enviar para Salesforce Marketing Cloud
		const response = await fetch(
			`${restUrl}/data/v1/async/dataextensions/key:${dataExtensionKey}/rows`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			},
		);

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Erro ao enviar para SFMC: ${text}`);
		}

		const result = await response.json();

		return NextResponse.json(
			{
				success: true,
				message: "Dados enviados com sucesso para SFMC",
				result,
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Erro desconhecido",
			},
			{ status: 500 },
		);
	}
}
