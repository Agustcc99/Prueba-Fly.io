# 🚀 Guía de Despliegue en Fly.io

Esta guía te ayudará a desplegar tu sistema de finanzas en fly.io de forma gratuita.

## 📋 Requisitos Previos

1. **Cuenta en fly.io**: Regístrate en https://fly.io (tiene plan gratuito)
2. **Fly CLI instalado**: 
   - Windows: `powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`
   - Mac/Linux: `curl -L https://fly.io/install.sh | sh`
3. **Autenticarse**: Ejecuta `fly auth login` en tu terminal

## 🔧 Pasos de Despliegue

### Paso 1: Inicializar la aplicación (si es primera vez)

Si es la primera vez que despliegas, ejecuta:

```bash
fly launch
```

Este comando:
- Te pedirá un nombre para tu app (o usa el que está en `fly.toml`)
- Te preguntará si quieres desplegar ahora (puedes decir que no por ahora)
- Creará la aplicación en fly.io

### Paso 2: Crear el volumen persistente

Los datos (db.json y users.json) necesitan un volumen persistente para no perderse:

```bash
fly volumes create data --region iad --size 1
```

- `iad` es la región de Virginia (cámbiala si prefieres otra)
- `--size 1` crea un volumen de 1GB (suficiente para la base de datos)

### Paso 3: Configurar el secreto de sesión

Es importante configurar un secreto seguro para las sesiones:

```bash
fly secrets set SESSION_SECRET="tu-secreto-super-seguro-aqui-cambia-esto"
```

**⚠️ IMPORTANTE**: 
- Usa un secreto largo y aleatorio
- Puedes generar uno con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Nunca compartas este secreto

### Paso 4: Desplegar la aplicación

```bash
fly deploy
```

Este comando:
- Construirá la aplicación
- La desplegará en fly.io
- Te dará una URL (algo como `https://tu-app.fly.dev`)

### Paso 5: Verificar el despliegue

Abre la URL que te dio fly.io en tu navegador. Deberías ver la página de login.

**Credenciales por defecto:**
- Usuario: `lu`
- Contraseña: `admin123`

## 📝 Comandos Útiles de Fly.io

### Ver logs en tiempo real
```bash
fly logs
```

### Ver el estado de la aplicación
```bash
fly status
```

### Abrir una consola SSH en la máquina
```bash
fly ssh console
```

### Ver los secretos configurados
```bash
fly secrets list
```

### Reiniciar la aplicación
```bash
fly apps restart tu-app-name
```

### Ver información del volumen
```bash
fly volumes list
```

## 🔒 Configuración de Seguridad

### Cambiar la contraseña por defecto

Una vez desplegado, deberías cambiar la contraseña inmediatamente. Puedes hacerlo:

1. Iniciando sesión en la aplicación
2. Usando la funcionalidad de cambio de contraseña (si está disponible)
3. O manualmente editando el archivo `users.json` en el volumen:

```bash
fly ssh console
cd /data
cat users.json
# Edita con tu editor favorito (vi, nano, etc.)
```

### Configurar HTTPS

Fly.io ya configura HTTPS automáticamente, así que tu aplicación ya estará protegida.

## 🛠️ Solución de Problemas

### La aplicación no inicia

1. Revisa los logs: `fly logs`
2. Verifica que el volumen esté creado: `fly volumes list`
3. Asegúrate de que `SESSION_SECRET` esté configurado: `fly secrets list`

### Los datos se pierden

- Verifica que el volumen esté montado correctamente
- Revisa que `DATA_DIR` esté apuntando a `/data` en `fly.toml`

### No puedo iniciar sesión

- Verifica que el archivo `users.json` existe en el volumen
- Revisa los logs para ver si hay errores al leer/crear usuarios

### Error de permisos

Si hay errores de permisos al escribir archivos:

```bash
fly ssh console
chmod 777 /data  # Temporal, para desarrollo
```

## 💰 Plan Gratuito de Fly.io

Fly.io tiene un plan gratuito generoso que incluye:
- 3 VMs compartidas con 256MB RAM
- Volúmenes de hasta 3GB
- 160GB de transferencia de datos por mes

**Nota**: Las máquinas se "duermen" después de un período de inactividad para ahorrar recursos. La primera petición puede tardar unos segundos en despertar la máquina.

## 📦 Actualizar la Aplicación

Cada vez que hagas cambios en el código:

```bash
fly deploy
```

Esto actualizará la aplicación con los cambios más recientes.

## 🔄 Backup de Datos

Para hacer backup de tus datos:

```bash
fly ssh console
cat /data/db.json > /tmp/backup-db.json
cat /data/users.json > /tmp/backup-users.json
exit
fly sftp shell
get /tmp/backup-db.json ./backup-db.json
get /tmp/backup-users.json ./backup-users.json
```

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `fly logs`
2. Consulta la documentación de fly.io: https://fly.io/docs
3. Verifica el estado de fly.io: https://status.fly.io

---

**¡Listo!** Tu aplicación debería estar funcionando en https://tu-app.fly.dev

