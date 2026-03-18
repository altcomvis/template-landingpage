#!/bin/bash

set -e

BASE_DIR="/Users/allanteixeira/Desktop/Projects/template-landingpage"
ADMIN_PUBLIC="/Users/allanteixeira/Desktop/Projects/admin-pages/public"

PROJECTS=("$BASE_DIR"/template-lp-*)

if [ ${#PROJECTS[@]} -eq 0 ]; then
	echo "❌ Nenhum projeto template-lp-* encontrado em $BASE_DIR"
	exit 1
fi

echo "📦 Iniciando build e deploy dos projetos template-lp-*..."

for BUILD_DIR in "${PROJECTS[@]}"; do
	[ -d "$BUILD_DIR" ] || continue

	PROJECT_NAME="$(basename "$BUILD_DIR")"
	echo ""
	echo "➡️  Processando $PROJECT_NAME"

	cd "$BUILD_DIR" || exit 1
	echo "✓ Entrando em $BUILD_DIR"

	echo "🏗️  Building..."
	npm run build || exit 1
	echo "✓ Build concluído"

	if [ ! -f "dist/assets/index.js" ] || [ ! -f "dist/assets/index.css" ]; then
		echo "❌ Build sem nomes estáveis esperados (dist/assets/index.js e dist/assets/index.css) em $PROJECT_NAME"
		exit 1
	fi
	echo "✓ Nomes estáveis de assets validados"

	echo "📦 Zipando dist..."
	[ -d "dist" ] || { echo "❌ Pasta dist não encontrada em $PROJECT_NAME"; exit 1; }
	rm -f "$PROJECT_NAME.zip"
	cd dist || exit 1
	zip -r "../$PROJECT_NAME.zip" . > /dev/null 2>&1
	cd .. || exit 1
	echo "✓ Arquivo $PROJECT_NAME.zip criado"

	echo "📋 Copiando ZIP para admin-pages/public..."
	cp "$PROJECT_NAME.zip" "$ADMIN_PUBLIC/$PROJECT_NAME.zip"
	echo "✓ Arquivo ZIP copiado para $ADMIN_PUBLIC/$PROJECT_NAME.zip"
done

echo ""
echo "✅ Deploy concluído!"
echo "📍 ZIPs gerados em: $ADMIN_PUBLIC"
ls -lh "$ADMIN_PUBLIC"/template-lp-*.zip
