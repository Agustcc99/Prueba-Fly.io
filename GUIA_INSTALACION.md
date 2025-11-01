# 📖 Guía Paso a Paso para Instalar el Sistema

Esta guía está pensada para personas que no tienen mucha experiencia con computadoras. Sigue cada paso cuidadosamente.

## ✅ Paso 1: Verificar si tienes Node.js instalado

1. Presiona la tecla **Windows** (la tecla con el logo de Windows en tu teclado)
2. Escribe `cmd` y presiona **Enter**
3. Se abrirá una ventana negra (esta es la "terminal" o "símbolo del sistema")
4. Escribe exactamente esto (sin las comillas) y presiona Enter:
   ```
   node --version
   ```
5. Si ves un número como `v18.17.0` o similar, ¡perfecto! Ya tienes Node.js. Puedes saltar al Paso 3.
6. Si ves un mensaje de error como "no se reconoce como comando", necesitas instalar Node.js (ve al Paso 2)

## 📥 Paso 2: Instalar Node.js (solo si no lo tienes)

1. Abre tu navegador (Chrome, Firefox o Edge)
2. Ve a esta dirección: **https://nodejs.org/**
3. Verás dos botones grandes: uno dice "LTS" y otro "Current"
4. **Haz clic en el botón "LTS"** (generalmente está a la izquierda y es verde)
5. Se descargará un archivo. Espera a que termine la descarga
6. Una vez descargado, busca el archivo en tu carpeta de Descargas
7. **Haz doble clic** en el archivo descargado (será algo como `node-v18.17.0-x64.msi`)
8. Sigue las instrucciones del instalador:
   - Haz clic en "Siguiente" varias veces
   - Asegúrate de que **todas las opciones estén marcadas** (especialmente "Add to PATH")
   - Haz clic en "Instalar"
   - Espera a que termine la instalación
   - Haz clic en "Finalizar"
9. **IMPORTANTE**: Cierra todas las ventanas de terminal/cmd que tengas abiertas
10. Abre una nueva terminal (repite el Paso 1) y verifica que ahora funcione `node --version`

## 📂 Paso 3: Descargar el proyecto desde GitHub

1. Ve al repositorio de GitHub donde está el proyecto
2. Busca el botón grande verde que dice **"Code"**
3. Haz clic en "Code"
4. Verás varias opciones. Haz clic en **"Download ZIP"**
5. El archivo se descargará en tu carpeta de Descargas
6. Ve a tu carpeta de Descargas
7. Busca el archivo ZIP (será algo como `lu-finanzas-api3-main.zip`)
8. **Haz clic derecho** sobre el archivo ZIP
9. Selecciona **"Extraer todo..."** o **"Extract All..."**
10. Elige dónde quieres guardar el proyecto (por ejemplo: `C:\Users\TuNombre\lu-finanzas`)
11. Haz clic en "Extraer"
12. Espera a que termine la extracción

## 📦 Paso 4: Instalar las dependencias del proyecto

1. Navega hasta la carpeta que acabas de extraer
2. Deberías ver archivos como `package.json`, `server.js`, etc.
3. **Haz clic en la barra de direcciones** de la ventana del Explorador de archivos (donde aparece la ruta)
4. Escribe `cmd` y presiona Enter
   - **Alternativa**: Haz clic derecho dentro de la carpeta (en un espacio vacío) y selecciona "Abrir en Terminal" o "Abrir PowerShell aquí"
5. Se abrirá una ventana negra con la ruta de tu carpeta
6. Copia y pega este comando (presiona Ctrl+V para pegar en la terminal):
   ```
   npm install
   ```
7. Presiona Enter
8. Espera a que termine (verás muchas líneas de texto pasando, esto es normal)
9. Cuando termine, verás algo como "added 50 packages" y volverás a ver el cursor parpadeando
10. ¡Listo! Ya tienes todo instalado

## ▶️ Paso 5: Iniciar el sistema

### Opción A: Usando el archivo de inicio (Más fácil)

1. En la carpeta del proyecto, busca el archivo **`Start (Windows).bat`**
2. Haz **doble clic** en ese archivo
3. Se abrirá una ventana negra y verás el mensaje: `Servidor listo en http://localhost:3000`
4. **NO CIERRES** esta ventana. Déjala abierta mientras uses el sistema

### Opción B: Manualmente desde la terminal

1. Abre una terminal en la carpeta del proyecto (como en el Paso 4)
2. Escribe este comando y presiona Enter:
   ```
   npm start
   ```
3. Verás el mismo mensaje: `Servidor listo en http://localhost:3000`
4. **NO CIERRES** esta ventana

## 🌐 Paso 6: Abrir el sistema en el navegador

1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. En la barra de direcciones (arriba), escribe exactamente esto:
   ```
   http://localhost:3000
   ```
3. Presiona Enter
4. Serás redirigido a una página de login

## 🔑 Paso 7: Iniciar sesión

1. En la página de login, verás dos campos:
   - **Usuario**: Escribe `lu` (minúsculas)
   - **Contraseña**: Escribe `admin123`
2. Haz clic en el botón "Iniciar Sesión" o presiona Enter
3. Si todo está bien, entrarás al sistema

## 🔒 Paso 8: Cambiar la contraseña (MUY IMPORTANTE)

1. Una vez dentro del sistema, busca la opción para cambiar contraseña
2. O consulta el archivo `INSTRUCCIONES_CONTRASEÑA.md` para ver cómo hacerlo
3. **Cambia la contraseña inmediatamente** por seguridad

## ✅ Paso 9: ¡Listo para usar!

Ya puedes empezar a usar el sistema:
- Agregar ingresos y gastos
- Ver resúmenes
- Filtrar por fechas
- Exportar datos a Excel

## 🛑 Cómo cerrar el sistema

1. Cuando termines de usar el sistema, cierra la pestaña del navegador
2. Ve a la ventana negra donde está corriendo el servidor
3. Presiona **Ctrl + C** (mantén presionado Ctrl y presiona C)
4. Verás que el servidor se detiene
5. Puedes cerrar esa ventana

## 📋 Resumen rápido para uso diario

1. **Abrir**: Doble clic en `Start (Windows).bat`
2. **Usar**: Abre `http://localhost:3000` en el navegador
3. **Iniciar sesión**: Usuario `lu` y tu contraseña
4. **Cerrar**: Ctrl+C en la ventana negra cuando termines

## ❓ ¿Problemas?

### El servidor no inicia
- Verifica que Node.js esté instalado (Paso 1)
- Asegúrate de haber ejecutado `npm install` (Paso 4)
- Intenta cerrar y volver a abrir la terminal

### No se abre en el navegador
- Verifica que hayas escrito exactamente: `http://localhost:3000`
- Asegúrate de que la ventana negra del servidor esté abierta y muestre "Servidor listo"
- Prueba cerrar y volver a abrir el navegador

### No puedo iniciar sesión
- Verifica que escribas `lu` (minúsculas) como usuario
- La contraseña inicial es `admin123` (todo junto, sin espacios)
- Si ya cambiaste la contraseña, usa la nueva

### Se cerró la ventana negra
- No pasa nada, simplemente vuelve a hacer doble clic en `Start (Windows).bat`
- El sistema guardará todos tus datos aunque cierres el servidor

---

**Consejo**: Guarda esta guía en un lugar donde puedas encontrarla fácilmente si necesitas reinstalar el sistema en el futuro.


