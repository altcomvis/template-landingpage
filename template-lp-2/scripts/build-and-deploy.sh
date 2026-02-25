#!/bin/bash

# Variáveis
PROJECT_NAME="template-lp-2"
BUILD_DIR="/Users/allanteixeira/Desktop/React-Projetcs/template-landingpage/$PROJECT_NAME"
ADMIN_PUBLIC="/Users/allanteixeira/Desktop/React-Projetcs/admin-pages/public"

echo "📦 Iniciando build e deploy para $PROJECT_NAME..."

# 1. Entrar no diretório do projeto
cd "$BUILD_DIR" || exit 1
echo "✓ Entrando em $BUILD_DIR"

# 2. Fazer o build
echo "🏗️  Building..."
npm run build || exit 1
echo "✓ Build concluído"

# 3. Zipar o dist
echo "📦 Zipando dist..."
cd dist || exit 1
zip -r "../$PROJECT_NAME.zip" . > /dev/null 2>&1
cd ..
echo "✓ Arquivo $PROJECT_NAME.zip criado"

# 4. Copiar ZIP para admin-pages/public
echo "📋 Copiando ZIP para admin-pages/public..."
cp "$PROJECT_NAME.zip" "$ADMIN_PUBLIC/$PROJECT_NAME.zip"
echo "✓ Arquivo ZIP copiado para $ADMIN_PUBLIC/$PROJECT_NAME.zip"

# 5. Limpeza (opcional: remover zip local)
# rm "$PROJECT_NAME.zip"

echo ""
echo "✅ Deploy concluído!"
echo "📍 ZIP: $ADMIN_PUBLIC/$PROJECT_NAME.zip"
echo "📍 JSON: $ADMIN_PUBLIC/$JSON_FILE"
ls -lh "$ADMIN_PUBLIC/$PROJECT_NAME.zip" "$ADMIN_PUBLIC/$JSON_FILE"
