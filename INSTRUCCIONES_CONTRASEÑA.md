# Instrucciones para Cambiar la Contraseña

## Usuario y Contraseña por Defecto
- **Usuario**: `lu`
- **Contraseña**: `admin123`

⚠️ **IMPORTANTE**: Cambia esta contraseña inmediatamente después de la primera sesión.

## Cómo Cambiar la Contraseña

### Opción 1: Manualmente editando el archivo (Método simple)

1. Detén el servidor si está corriendo (Ctrl+C)
2. Abre el archivo `users.json` con un editor de texto
3. Verás algo como:
```json
{
  "lu": {
    "password": "$2a$10$abc123...",
    "nombre": "Lu"
  }
}
```

4. Para cambiar la contraseña, necesitas generar un nuevo hash. Abre una terminal y ejecuta:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('TU_NUEVA_CONTRASEÑA', 10))"
```

5. Reemplaza el valor del campo `password` con el nuevo hash generado
6. Guarda el archivo
7. Reinicia el servidor

### Opción 2: Usando la API (Próximamente)

Una vez que agregues la funcionalidad de cambio de contraseña desde la interfaz, podrás:
1. Hacer clic en "Cambiar Contraseña" en el menú
2. Ingresar tu contraseña actual
3. Ingresar tu nueva contraseña
4. Confirmar

## Notas de Seguridad

- **Nunca compartas** tu contraseña
- Usa una contraseña **fuerte** (al menos 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos)
- Si olvidas tu contraseña, puedes editar manualmente el archivo `users.json` siguiendo la Opción 1

## ¿Problemas?

Si tienes problemas para cambiar la contraseña, asegúrate de que:
1. El servidor está detenido antes de editar `users.json`
2. El archivo `users.json` tiene el formato JSON correcto (sin errores de sintaxis)
3. Has guardado el archivo correctamente

