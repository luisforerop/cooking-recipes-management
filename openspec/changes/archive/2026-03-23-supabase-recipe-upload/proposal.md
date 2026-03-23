## Why

Los usuarios ya pueden parsear recetas desde archivos Markdown, pero no hay forma de persistirlas. Agregar integración con Supabase permite guardar recetas en una base de datos real, habilitando búsqueda, edición y reutilización posterior.

## What Changes

- Nueva UI de carga en la página del parser: tabla de previsualización con datos descriptivos de las recetas parseadas antes de confirmar la carga.
- Botón para subir recetas al table de Supabase, ya sea en lote (todas las parseadas) o individualmente (selección por fila).
- El sistema de ingesta queda desacoplado del formato: inicialmente soporta Markdown, con arquitectura extensible para JSON y CSV.
- Se crea un cliente Supabase en el proyecto para interactuar con la tabla `recipes` existente.
- **BREAKING**: El tipo `Recipe` en `lib/types/recipe.ts` puede necesitar ajuste para alinear campos con el schema de Supabase.

## Constraints / Existing Context

- La tabla `recipes` ya existe en Supabase.
- No se permite la creación de esquemas de base de datos ni migraciones como parte de este cambio.
- La integración debe reutilizar la tabla `recipes` existente.
- El esquema de la tabla `recipes` se considera externo y pertenece a la capa de base de datos.
- El código de la aplicación debe adaptarse al esquema existente, no al revés.
- Se permite realizar operaciones CRUD completas en registros existentes.
- El esquema de la base de datos está documentado en `specs/database-schema.md`.

## Capabilities

### New Capabilities

- `supabase-client`: Configuración del cliente Supabase (env vars, singleton) para interactuar con la tabla `recipes` existente.
- `recipe-upload-ui`: Componente de tabla de previsualización + acciones de carga (individual y en lote) que se integra en la página del parser.

### Modified Capabilities

- `recipe-parser-page`: La página del parser expone las recetas parseadas al nuevo componente de upload; el flujo de usuario pasa de ser solo visualización a incluir una acción de guardado.

## Impact

- **Nuevas dependencias**: `@supabase/supabase-js`
- **Nuevos archivos**: `lib/supabase.ts`, `lib/actions/upload-recipes.ts`, `components/recipe-upload-table.tsx`
- **Archivos modificados**: `app/recipe-parser/page.tsx`, `lib/types/recipe.ts` (posible ajuste de campos)
- **Variables de entorno**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Base de datos**: integración con la tabla existente `recipes` en Supabase (sin cambios de schema)
