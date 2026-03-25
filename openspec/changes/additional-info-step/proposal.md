## Why

Las recetas provienen de fuentes diversas (PDFs, videos, libros, sitios web) y actualmente no hay forma de capturar esa información de origen durante la carga. El campo `additionalInfo` ya existe en el tipo `Recipe` y en la tabla de Supabase, pero nunca se popula desde la UI.

## What Changes

- Se agrega un nuevo paso `"additional-info"` al flujo de la modal, entre el paso Markdown y el paso de confirmación de carga.
- El nuevo paso permite al usuario crear, editar y eliminar pares clave/valor con soporte para cuatro tipos: `string`, `boolean`, `json`, `number`.
- El paso es opcional: el usuario puede avanzar sin agregar ningún par.
- Los pares acumulados se mapean al campo `additionalInfo` de **cada** receta antes de pasar a la tabla de carga.
- El título de la modal y la lógica de navegación "Atrás" del paso `upload` se actualizan para reflejar el nuevo step intermedio.

## Capabilities

### New Capabilities

- `additional-info-editor`: Editor de pares clave/valor con selector de tipo (string, boolean, json, number), con soporte para crear, editar y eliminar entradas. Se renderiza como el paso `"additional-info"` de la modal.

### Modified Capabilities

- `add-recipes-modal`: El flujo de pasos cambia de `format → markdown → upload` a `format → markdown → additional-info → upload`. El botón "Continuar" del paso `markdown` ahora avanza a `additional-info` en lugar de `upload`. La navegación "Atrás" del paso `upload` vuelve a `additional-info`.

## Impact

- `components/add-recipes-modal.tsx` — agregar el nuevo step, actualizar la máquina de estados de navegación, pasar `additionalInfo` mapeado a `RecipeUploadTable`.
- `lib/types/recipe.ts` — sin cambios (el campo `additionalInfo` ya existe).
- `lib/actions/upload-recipes.ts` — sin cambios (el mapper ya maneja `additionalInfo`).
