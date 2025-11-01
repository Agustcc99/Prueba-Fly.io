#!/usr/bin/env bash
# Finanzas de Lu - Start (Mac/Linux)
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  echo "Instalando dependencias..."
  npm install
fi
echo "Iniciando servidor en http://localhost:3000"
npm run dev
