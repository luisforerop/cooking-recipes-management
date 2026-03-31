## Why

Para poder generar PDFs con recetas completas, primero se necesita un mecanismo que permita al usuario seleccionar qué recetas quiere incluir. Esta etapa implementa ese sistema de selección, análogo a un carrito de compras, que persistirá las recetas elegidas para ser consumidas en una etapa posterior por el generador de PDF.

## What Changes

- Se crea una nueva página `/recipes/select` con una tabla de selección múltiple de recetas.
- La tabla soporta selección individual y selección masiva por página.
- Se añade paginación configurable (selector de cantidad de ítems por página).
- Las recetas seleccionadas (tipo `Recipe` completo) se persisten en `localStorage`.
- No se construye ningún componente de PDF ni previsualización en esta iteración.

## Capabilities

### New Capabilities

- `recipe-selection-page`: Página con tabla paginada para seleccionar múltiples recetas y persistirlas en `localStorage` con tipo `Recipe` completo.

### Modified Capabilities

## Impact

- Nueva ruta App Router: `app/recipes/select/page.tsx`
- Nuevos componentes: tabla de selección con checkboxes, controles de paginación y selector de tamaño de página
- Nuevo hook o utilidad: acceso a `localStorage` para persistir/leer las recetas seleccionadas
- Dependencias existentes: `lib/supabase.ts` (consulta de recetas), `lib/types/recipe.ts` (tipo `Recipe`)
- Sin cambios en rutas o componentes existentes
