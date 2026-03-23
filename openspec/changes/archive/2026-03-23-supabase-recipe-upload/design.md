## Context

La página `/recipe-parser` ya permite parsear recetas desde texto Markdown y visualizar el resultado como JSON. Sin embargo, no existe integración con ninguna capa de persistencia. El siguiente paso natural es permitir guardar esas recetas en Supabase, la base de datos elegida para el proyecto.

El tipo `Recipe` ya existe en `lib/types/recipe.ts` y el parser en `lib/recipe-parser.ts`. La integración debe construirse sobre esta base sin romper el flujo existente.

La tabla `recipes` **ya existe** en Supabase y es fuente de verdad — no se permite modificar su schema. Su definición está documentada en `specs/database-schema.md`. El código de la aplicación debe adaptarse al schema, no al revés.

## Goals / Non-Goals

**Goals:**

- Integrar el cliente de Supabase en el proyecto (una sola instancia, configurada vía env vars).
- Reutilizar la tabla `recipes` existente en Supabase adaptando el tipo `Recipe` al schema predefinido (sin migraciones).
- Mostrar una tabla de previsualización con datos descriptivos de las recetas parseadas antes de persistirlas.
- Permitir subir todas las recetas en lote con un botón, o subir recetas individualmente desde la misma tabla.
- Mantener la arquitectura extensible para soportar otros formatos de entrada (JSON, CSV) en el futuro sin refactorizar la capa de upload.

**Non-Goals:**

- Autenticación de usuarios en esta iteración.
- Soporte para editar o eliminar recetas desde la UI (solo inserción).
- Ingesta desde JSON o CSV (se deja la arquitectura preparada, pero no se implementa).
- Paginación o búsqueda en Supabase.

## Decisions

### 1. Cliente Supabase como singleton en `lib/supabase.ts`

**Decisión:** Un único `createClient` exportado desde `lib/supabase.ts`, consumido tanto desde Server Actions como desde componentes cliente.

**Alternativas consideradas:**

- Instanciar en cada punto de uso → descartado, múltiples conexiones innecesarias.
- Usar Supabase Auth Helpers → innecesario sin autenticación.

### 2. Server Action para la inserción

**Decisión:** `lib/actions/upload-recipes.ts` exporta una Server Action (`uploadRecipes`) que recibe un array de `Recipe` y llama a `supabase.from('recipes').insert(...)`.

**Alternativas consideradas:**

- API Route (`/api/upload-recipes`) → válido, pero una Server Action es más directo en Next.js App Router y evita una capa HTTP extra.

### 3. Tabla de previsualización como componente cliente

**Decisión:** `components/recipe-upload-table.tsx` es un Client Component que recibe las recetas parseadas como props, muestra columnas descriptivas (título, porciones, tiempo de preparación, nº de ingredientes, nº de pasos) y expone botones de acción.

**Columnas de previsualización:** `title`, `servings`, `preparation_time`, `# ingredients`, `# steps`. Coinciden con campos reales del schema de BD; no existe campo `category` ni en el tipo `Recipe` ni en la tabla.

**Alternativas consideradas:**

- Mostrar el JSON raw → ya existe en el panel derecho; duplicar info no aporta.

### 4a. Mapeo camelCase → snake_case antes de insertar

**Decisión:** Antes de llamar a `supabase.from('recipes').insert(...)`, un mapper transforma el objeto `Recipe` (camelCase) al formato esperado por la BD (snake_case): `preparationTime` → `preparation_time`, `nutritionalInformation` → `nutritional_information`. Los demás campos coinciden.

**Alternativas consideradas:**

- Renombrar campos en el tipo `Recipe` → descartado, rompería el parser y otros consumidores.
- Usar `transformers` de la librería Supabase JS → disponible pero agrega complejidad de configuración global; un mapper explícito es más predecible.

### 4. Arquitectura extensible de formatos

**Decisión:** La Server Action acepta `Recipe[]` (ya parseado), desacoplando el formato de entrada del mecanismo de persistencia. Quien llame a la acción es responsable de parsear el input a `Recipe[]`. Agregar CSV o JSON en el futuro solo requiere un nuevo parser, no tocar la capa de upload.

### 5. Feedback visual post-carga

**Decisión:** Tras una carga exitosa, las filas subidas se marcan visualmente (badge "Guardado") y el botón de lote muestra el conteo. En caso de error, se muestra un mensaje inline.

## Risks / Trade-offs

- **[Risk] camelCase vs snake_case entre `Recipe` y la BD** → Mitigación: mapper explícito en la Server Action (`preparationTime` → `preparation_time`, `nutritionalInformation` → `nutritional_information`). Si el tipo `Recipe` agrega nuevos campos en el futuro, el mapper debe actualizarse manualmente — esto es intencional y documentado.
- **[Risk] Duplicados en Supabase** → Mitigación: en esta iteración se permite insertar duplicados; se puede agregar `ON CONFLICT` o validación en una iteración posterior.
- **[Risk] Env vars no configuradas en producción** → Mitigación: el cliente Supabase lanza error en runtime; documentar variables requeridas en el README.
