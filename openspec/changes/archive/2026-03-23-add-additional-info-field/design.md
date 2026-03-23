## Context

La tabla `recipes` en Supabase ya tiene la columna `additional_info` (jsonb, NOT NULL, DEFAULT `'{}'`). El esquema completo está documentado en `docs/dB/shemas/recipes.md`. El tipo `Recipe` en `lib/types/recipe.ts` no expone este campo, y el mapper `toDbRow` en `lib/actions/upload-recipes.ts` tampoco lo incluye. Como la columna tiene un default, los inserts actuales funcionan; el cambio permite proveer datos desde la aplicación cuando se disponga de ellos.

El cambio es mínimo y acotado: dos archivos, sin nuevas dependencias.

## Goals / Non-Goals

**Goals:**

- Agregar `additionalInfo?: Record<string, unknown>` al tipo `Recipe`.
- Incluir `additional_info` en el mapper de inserción cuando `additionalInfo` esté definido; omitir la clave cuando sea `undefined` para que el DB aplique su `DEFAULT '{}'`.

**Non-Goals:**

- Soporte en el parser Markdown — la sección `INFORMACIÓN ADICIONAL` no se implementa en este cambio.
- Validación del contenido del campo (es intencionalmente libre).
- Mostrar `additional_info` en la UI de previsualización.

## Decisions

### 1. Tipo TypeScript: `Record<string, unknown>`

**Decisión:** `additionalInfo?: Record<string, unknown>` en la interfaz `Recipe`. Refleja la naturaleza de una columna jsonb sin esquema fijo — es un objeto clave/valor sin restricciones.

**Alternativas consideradas:**

- `unknown` plano → no comunica que es un objeto.
- `JsonValue` / tipo más estricto → prematura; el objetivo del campo es no tener esquema definido.
- `object` → evitado, `Record<string, unknown>` es más específico y permite indexado.

### 2. Mapper: omitir la clave cuando `additionalInfo` es `undefined`

**Decisión:** Cuando `additionalInfo` es `undefined`, el mapper **omite** la clave `additional_info` del objeto de inserción. La columna tiene `DEFAULT '{}'`, por lo que Supabase aplica el valor por defecto automáticamente. Enviar `null` no es válido porque la columna es `NOT NULL`.

**Alternativas consideradas:**

- Enviar `{}` explícitamente → equivalente al default, pero verboso; omitir es más limpio.
- Enviar `null` → incorrecto, la columna es NOT NULL y el insert fallaría.

## Risks / Trade-offs

- **[Risk] Campo inutilizable desde el parser hasta que se implemente** → Aceptado intencionalmente; el campo puede popularse por otras vías (e.g., código que construya `Recipe` directamente).
- **[Risk] `Record<string, unknown>` acepta valores no serializables a JSON** → Mitigación: Supabase rechazará el insert si el valor no es JSON válido en runtime; sin validación en tiempo de compilación adicional.
