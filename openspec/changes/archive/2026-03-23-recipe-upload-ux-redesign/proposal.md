## Why

La página actual de carga de recetas es confusa: muestra un panel JSON que ye no agrega valor, y el flujo de carga está expuesto sin estructura. La UX debe simplificarse: la acción de agregar recetas se desplaza a una modal con pasos claros, dejando espacio para que la página principal evolucione hacia una vista de listado de recetas existentes.

## What Changes

- **BREAKING**: Se elimina el panel de salida JSON de la página `/recipe-parser`. Los requirements de "Two-panel layout", "Live JSON conversion output", "Copy JSON to clipboard" y "Upload section below parser panels" quedan removidos.
- La página `/recipe-parser` pasa a tener un layout limpio con un único botón prominente **"AGREGAR RECETAS"**.
- El botón abre una modal de carga multi-paso:
  - **Paso 1 — Selección de formato**: tres opciones (Markdown, CSV, JSON). Solo Markdown está habilitado en esta iteración; CSV y JSON aparecen deshabilitados.
  - **Paso 2 — Editor Markdown**: textarea a la izquierda + panel de resumen a la derecha (cantidad de recetas parseadas y errores de parseo). El usuario confirma con un botón **"Continuar"**.
  - **Paso 3 — Confirmación de carga**: se muestra el componente `RecipeUploadTable` existente sin modificaciones, con sus acciones de carga individual y en lote.
- El componente `RecipeUploadTable` **no se modifica**.

## Capabilities

### New Capabilities

- `add-recipes-modal`: Modal multi-paso de carga de recetas (selección de formato → editor Markdown con resumen → tabla de upload).

### Modified Capabilities

- `recipe-parser-page`: Se reemplaza completamente el layout actual. Se remueven los requirements de parser de dos paneles y se agrega el requirement del botón "AGREGAR RECETAS" y la integración con la modal.

## Impact

- **Archivos modificados**: `app/recipe-parser/page.tsx`
- **Archivos eliminados**: lógica de JSON output y copy en `app/recipe-parser/page.tsx` (el hook `useDebounce`, `jsonOutput`, `handleCopy` ya no son necesarios)
- **Nuevos archivos**: `components/add-recipes-modal.tsx`
- **Sin cambios**: `components/recipe-upload-table.tsx`, `lib/actions/upload-recipes.ts`, `lib/recipe-parser.ts`
