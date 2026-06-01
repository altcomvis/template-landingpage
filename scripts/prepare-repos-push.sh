#!/bin/bash

set -euo pipefail

SCRIPTS=(
	"/Users/allanteixeira/Desktop/Projects/template-landingpage/scripts/build-and-deploy.sh"
	"/Users/allanteixeira/Desktop/Projects/site-voices/scripts/build-and-deploy.sh"
	"/Users/allanteixeira/Desktop/Projects/site-camarote/scripts/build-and-deploy.sh"
	"/Users/allanteixeira/Desktop/Projects/site-rg/scripts/build-and-deploy.sh"
)

echo "🚦 Pré-push obrigatório: atualizando ZIPs de templates e sites no admin-pages/public"

for script in "${SCRIPTS[@]}"; do
	if [ ! -f "$script" ]; then
		echo "❌ Script não encontrado: $script"
		exit 1
	fi

	echo ""
	echo "▶ Executando: $script"
	bash "$script"
done

echo ""
echo "✅ Pré-push concluído com sucesso."
echo "➡️ Agora você pode seguir com commits/push dos repositórios."
