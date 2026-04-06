#!/bin/bash

set -euo pipefail

BASE_DIR="/Users/allanteixeira/Desktop/Projects/template-landingpage"
BUILD_AND_DEPLOY_SCRIPT="$BASE_DIR/scripts/build-and-deploy.sh"

if [ ! -f "$BUILD_AND_DEPLOY_SCRIPT" ]; then
	echo "❌ Script não encontrado: $BUILD_AND_DEPLOY_SCRIPT"
	exit 1
fi

echo "🚦 Pré-push obrigatório: atualizando ZIPs dos templates no admin-pages/public"

bash "$BUILD_AND_DEPLOY_SCRIPT"

echo ""
echo "✅ Pré-push concluído com sucesso."
echo "➡️ Agora você pode seguir com commits/push dos repositórios."
