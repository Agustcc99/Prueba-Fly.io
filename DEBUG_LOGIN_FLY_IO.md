# 🔍 Debug del Problema de Login en Fly.io

## Cambios Realizados

1. **Configuración mejorada de cookies**:
   - Nombre explícito: `lu-finanzas.sid`
   - Path: `/` para que se envíe en todas las rutas
   - SameSite: `lax` (mejor para mismo dominio)

2. **Guardado explícito de sesión**:
   - Usa `req.session.save()` para asegurar que se guarde antes de responder
   - Establece la cookie manualmente después de guardar

3. **Logs de depuración**:
   - Logs en login, `/` y `/api/auth/me` para rastrear el problema

## Pasos para Verificar

### 1. Desplegar los cambios

```bash
fly deploy
```

### 2. Ver los logs en tiempo real

```bash
fly logs
```

### 3. Intentar hacer login y observar los logs

Deberías ver mensajes como:
- `[AUTH] Login exitoso para usuario: lu, Session ID: ...`
- `[ROOT] Session ID: ..., User: lu` (o `none` si no hay sesión)

### 4. Verificar las cookies en el navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" (o "Aplicación")
3. En el menú izquierdo, expande "Cookies"
4. Haz clic en tu dominio de fly.io
5. Deberías ver una cookie llamada `lu-finanzas.sid`
   - Si NO está: las cookies no se están guardando
   - Si SÍ está pero el valor cambia: problema con la sesión

## Posibles Problemas y Soluciones

### Problema 1: Las cookies no se guardan

**Síntoma**: No ves la cookie `lu-finanzas.sid` en el navegador

**Solución**: 
- Verifica que estés usando HTTPS (fly.io usa HTTPS automáticamente)
- Verifica que `SESSION_SECRET` esté configurado: `fly secrets list`

### Problema 2: Las cookies se guardan pero la sesión no persiste

**Síntoma**: Ves la cookie pero cada request crea una nueva sesión

**Causa probable**: Fly.io puede tener múltiples instancias y las sesiones en memoria no se comparten

**Solución**: Si este es el caso, necesitaremos usar `cookie-session` en lugar de `express-session`. Los datos se guardan en la cookie misma, no en el servidor.

### Problema 3: Redirect 302 después del login

**Síntoma**: El login funciona (200) pero luego redirige a login.html

**Causa**: La sesión no se está leyendo correctamente

**Solución**: 
- Verifica los logs para ver si la sesión se guarda y lee correctamente
- Verifica que la cookie tenga el dominio correcto
- Prueba con `cookie-session` si el problema persiste

## Cambiar a cookie-session (si es necesario)

Si después de estos cambios el problema persiste, el issue probablemente es que fly.io tiene múltiples instancias y cada una tiene su propia memoria para sesiones.

En ese caso, necesitamos cambiar a `cookie-session` que guarda los datos en la cookie misma. Esto ya está agregado en `package.json` pero no está implementado todavía.

Si necesitas hacer este cambio, avísame y te ayudo a implementarlo.

## Comandos Útiles

```bash
# Ver logs en tiempo real
fly logs

# Ver secretos configurados
fly secrets list

# Ver estado de la app
fly status

# Reiniciar la app
fly apps restart tu-app-name

# Ver información de las máquinas
fly machine list
```

## Información para el Debug

Si el problema persiste, comparte:

1. Los logs de `fly logs` después de intentar hacer login
2. Si ves la cookie `lu-finanzas.sid` en el navegador
3. El valor de la cookie (solo necesitas confirmar si existe y cambia o no)

Esto ayudará a identificar exactamente dónde está el problema.

