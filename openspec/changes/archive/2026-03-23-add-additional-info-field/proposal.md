## Why

La tabla `recipes` en Supabase tiene una nueva columna `additional_info` (jsonb, NOT NULL, DEFAULT `'{}'`) para datos sin esquema fijo. El tipo `Recipe` no tiene un campo equivalente, por lo que actualmente el mapper de inserción no incluye esa columna y los datos nunca se persisten.

## What Changes

- Se agrega el campo opcional `additionalInfo?: Record<string, unknown>` al tipo `Recipe` en `lib/types/recipe.ts`.
- El mapper de inserción en `lib/actions/upload-recipes.ts` incluye `additional_info: recipe.additionalInfo ?? null` en el objeto enviado a Supabase.
- El parser Markdown **no se modifica** — la sección `INFORMACIÓN ADICIONAL` no se soporta en este cambio. El campo solo puede popularse programáticamente.

## Capabilities

### New Capabilities

_(ninguna — no se introduce una nueva capacidad independiente)_

### Modified Capabilities

- `supabase-client`: El requirement "Recipe type-to-schema mapping" cambia para incluir el mapeo del nuevo campo `additionalInfo` → `additional_info`.

## Impact

- **Archivos modificados**: `lib/types/recipe.ts`, `lib/actions/upload-recipes.ts`
- **Sin cambios de schema**: la columna ya existe en Supabase, es NOT NULL con DEFAULT `'{}'`.
- **Sin impacto en la UI**: `RecipeUploadTable` no muestra `additional_info`.
- **Sin cambios en el parser**: `lib/recipe-parser.ts` no se toca.
