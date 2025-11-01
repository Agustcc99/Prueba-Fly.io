# Sistema de Finanzas de Lu

Sistema web para gestionar ingresos y gastos personales con autenticación, filtros avanzados y exportación a CSV.

## 📋 Requisitos

Antes de comenzar, necesitas tener instalado:

- **Node.js** versión 18 o superior
  - Descarga desde: https://nodejs.org/
  - Al instalar, asegúrate de marcar la opción "Add to PATH"
  - Verifica la instalación abriendo una terminal y ejecutando: `node --version`

## 🚀 Instalación desde GitHub

### Paso 1: Descargar el proyecto

1. Ve a la página del repositorio en GitHub
2. Haz clic en el botón verde **"Code"** y luego en **"Download ZIP"**
3. Extrae el archivo ZIP en una carpeta de tu computadora (por ejemplo: `C:\Users\TuNombre\lu-finanzas`)

### Paso 2: Instalar dependencias

1. Abre una terminal/PowerShell en la carpeta del proyecto
   - **Windows**: Haz clic derecho en la carpeta → "Abrir en Terminal" o "Abrir PowerShell aquí"
   - También puedes escribir `cmd` en la barra de direcciones del Explorador de archivos

2. Ejecuta el siguiente comando:
```bash
npm install
```

Esto instalará todas las dependencias necesarias (puede tardar unos minutos).

### Paso 3: Iniciar el servidor

#### Opción A: Usando el archivo de inicio (Recomendado)

- **Windows**: Haz doble clic en `Start (Windows).bat`
- **Mac/Linux**: Abre una terminal y ejecuta: `bash start-mac-linux.sh`

#### Opción B: Manualmente

En una terminal, ejecuta:
```bash
npm start
```

Deberías ver un mensaje como: `Servidor listo en http://localhost:3000`

### Paso 4: Abrir en el navegador

1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ve a: `http://localhost:3000`
3. Serás redirigido automáticamente a la página de login

## 🔐 Primer acceso

### Credenciales por defecto:
- **Usuario**: `lu`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia la contraseña inmediatamente después de la primera sesión por seguridad.

### Cómo cambiar la contraseña:

1. Inicia sesión con las credenciales por defecto
2. El sistema te permitirá cambiar la contraseña desde el menú (si está disponible)
3. O sigue las instrucciones en `INSTRUCCIONES_CONTRASEÑA.md`

## 📁 Estructura del proyecto

```
lu-finanzas-api3/
├── public/              # Archivos del frontend
│   ├── index.html      # Página principal
│   ├── login.html      # Página de login
│   ├── app.js          # Lógica del frontend
│   └── style.css       # Estilos
├── server.js           # Servidor Node.js
├── package.json        # Configuración del proyecto
├── db.json            # Base de datos (se crea automáticamente)
├── users.json         # Usuarios (se crea automáticamente)
└── README.md          # Este archivo
```

## 🎯 Características

- ✅ **Sistema de login**: Solo usuarios autenticados pueden acceder
- ✅ **Gestión de movimientos**: Crear, listar y eliminar ingresos/gastos
- ✅ **Filtros avanzados**: Por tipo, fecha, mes, año y búsqueda de texto
- ✅ **Períodos rápidos**: Mes actual, Mes anterior, Año actual, Todo
- ✅ **Resumen financiero**: Totales, balances y desgloses por área
- ✅ **Exportar a CSV**: Exporta tus movimientos filtrados
- ✅ **Presets inteligentes**: El sistema aprende de las áreas y categorías que usas

## 💻 Comandos útiles

```bash
npm install     # Instalar dependencias (solo la primera vez)
npm start       # Iniciar el servidor
npm run dev     # Iniciar en modo desarrollo (con recarga automática)
```

## 📝 Uso diario

1. **Iniciar el servidor**: Ejecuta `Start (Windows).bat` o `npm start`
2. **Abrir en el navegador**: Ve a `http://localhost:3000`
3. **Iniciar sesión**: Ingresa tus credenciales
4. **Gestionar movimientos**: 
   - Agregar nuevos ingresos/gastos
   - Filtrar por período o categoría
   - Ver resúmenes y exportar datos
5. **Cerrar sesión**: Haz clic en "Cerrar Sesión" cuando termines

## 🔧 Personalización

### Cambiar áreas y categorías predeterminadas

Consulta el archivo `PERSONALIZAR_AREAS_CATEGORIAS.md` para instrucciones detalladas.

## 📚 Documentación adicional

- `INSTRUCCIONES_CONTRASEÑA.md` - Cómo cambiar la contraseña
- `PERSONALIZAR_AREAS_CATEGORIAS.md` - Personalizar áreas y categorías

## 🐛 Solución de problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`
- Revisa que el puerto 3000 no esté en uso

### No puedo iniciar sesión
- Verifica que estés usando: usuario `lu` y contraseña `admin123`
- Si cambiaste la contraseña, usa la nueva
- Revisa que el archivo `users.json` exista y tenga el formato correcto

### Los datos no se guardan
- Verifica que tengas permisos de escritura en la carpeta del proyecto
- Asegúrate de que los archivos `db.json` y `users.json` se puedan crear/modificar

## 🔒 Seguridad

- **Nunca compartas** tus credenciales
- Cambia la contraseña por defecto inmediatamente
- Si olvidas tu contraseña, puedes editarla manualmente en `users.json` (ver `INSTRUCCIONES_CONTRASEÑA.md`)

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, revisa primero:
1. Este README
2. Los archivos de instrucciones adicionales
3. Los mensajes de error en la terminal

---

**Versión**: 1.1.0  
**Última actualización**: 2024
