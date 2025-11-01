# Cómo Personalizar Áreas y Categorías

## Ubicación de los archivos

Las áreas y categorías predeterminadas se encuentran en:
**`public/app.js`** en las líneas 7-8

## Cómo editarlas

1. Abre el archivo `public/app.js`
2. Busca estas líneas (alrededor de la línea 6-8):

```javascript
function cargarPresets(){
  const base = {
    areas: ["Casa","Tienda","Emergencias","Varios"],
    categorias: ["Categoría 1","Categoría 2","Categoría 3"]
  };
```

3. Edita los valores dentro de los corchetes `[]`
4. Guarda el archivo
5. Reinicia el servidor (Ctrl+C y vuelve a iniciar)

## Ejemplos

### Para un dentista
```javascript
areas: ["Consultorio","Laboratorio","Farmacia","Emergencias"],
categorias: ["Endodoncia","Zirconio","Resina","Limpieza","Implantes"]
```

### Para un hogar
```javascript
areas: ["Supermercado","Farmacia","Veterinaria","Servicios","Ropa","Otros"],
categorias: ["Alimentos","Medicamentos","Transporte","Utilidades","Entretenimiento"]
```

### Para un negocio
```javascript
areas: ["Local","Depósito","Oficina","Delivery","Marketing"],
categorias: ["Inventario","Personal","Publicidad","Servicios","Impuestos"]
```

## Importante

- **Separar con comas**: Cada valor debe ir entre comillas y separado por comas
- **Mantener las comillas**: Usa comillas dobles `"` alrededor de cada texto
- **Sin comas finales**: No pongas coma después del último elemento
- **Reinicia el servidor**: Siempre reinicia después de editar

## ¿Por qué ya hay valores guardados?

El sistema **aprende** de lo que escribes:
- Cada vez que ingresas un área o categoría nueva, la guarda automáticamente
- Se guardan en el navegador (localStorage)
- Los valores que edites en `app.js` se **combinan** con los ya guardados

### Si quieres empezar desde cero:

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" o "Aplicación"
3. En el menú izquierdo, busca "Local Storage"
4. Haz clic en `http://localhost:3000`
5. Busca la clave `lu_presets_v1` y elimínala
6. Recarga la página (F5)

## Consejos

- **Sé específico**: Mejor "Laboratorio Oro" que "Lab"
- **Ordena por importancia**: Coloca primero las que uses más
- **No uses duplicados**: El sistema los eliminará, pero es mejor evitar la confusión
- **Mantén nombres cortos**: Aparecen en listas desplegables

