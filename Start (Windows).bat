@echo off
REM Finanzas de Lu - Start (Windows)
cd /d "%~dp0"
if not exist node_modules (
  echo Instalando dependencias...
  npm install
)
echo Iniciando servidor en http://localhost:3000
npm run dev
pause
