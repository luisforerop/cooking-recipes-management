## Context

La modal de carga de recetas tiene actualmente tres pasos: `format → markdown → upload`. El campo `additionalInfo` en `Recipe` (y en la tabla Supabase) nunca se popula desde la UI. Las recetas provienen de fuentes diversas y es necesario capturar metadatos de origen (fuente, autor, URL, etc.) en el momento de la carga.

Estado actual relevante:

- `lib/types/recipe.ts`: `additionalInfo?: Record<string, unknown>` ya existe
- `lib/actions/upload-recipes.ts`: el mapper ya incluye `additionalInfo` con spread condicional
- `components/add-recipes-modal.tsx`: `Step = "format" | "markdown" | "upload"`

## Goals / Non-Goals

**Goals:**

- Insertar un paso `"additional-info"` entre `markdown` y `upload` en la modal
- Permitir crear, editar y eliminar pares clave/valor con tipo explícito
- Mapear los pares al campo `additionalInfo` de **todas** las recetas parseadas del batch
- Soportar cuatro tipos: `string`, `number`, `boolean`, `json`
- El paso es **opcional**: avanzar sin pares es válido

**Non-Goals:**

- Metadatos por receta individual (granularidad a nivel de batch)
- Persistencia de plantillas de `additionalInfo` entre sesiones
- Validación de claves contra un schema predefinido
- Modificar el parser de Markdown ni la lógica de upload

## Decisions

### 1. Granularidad: batch (no por receta)

Los metadatos capturados se aplican uniformemente a **todas** las recetas del batch. Alternativa: editor por fila en la tabla de upload. Se descartó porque añade complejidad alta para un caso de uso en el que todas las recetas del batch comparten la misma fuente.

### 2. Almacenamiento del valor como string en el formulario

Todos los valores se editan como texto libre. La conversión al tipo destino ocurre al construir el objeto `additionalInfo`. Para `boolean`: el input acepta `"true"` / `"false"`. Para `number`: `parseFloat`. Para `json`: `JSON.parse` con validación. Para `string`: sin transformación.

Alternativa: controles específicos por tipo (checkbox para boolean, number input). Se descartó para mantener uniformidad visual y facilitar la edición posterior.

### 3. Validación de json en el momento de agregar/editar

Para el tipo `json`, se ejecuta `JSON.parse` al confirmar el par. Si falla, se muestra error inline y no se agrega el par. Esto previene que datos malformados lleguen a Supabase.

### 4. Estado local en la modal

Los pares se almacenan en `useState` dentro de `AddRecipesModal`, se limpian junto con el resto del estado al cerrar la modal. No se requiere store global.

### 5. Mecanismo de edición: repopular el formulario

Al hacer clic en "Editar" de un par existente, sus valores se cargan de vuelta en el formulario y el par se elimina de la lista hasta que se confirme de nuevo. Esto evita duplicados y simplifica la lógica de edición.

## Risks / Trade-offs

- [Pérdida de datos en la edición] Si el usuario edita un par y cierra la modal, el par en edición pendiente se pierde → Mitigación: el reset on-close ya limpia todo el estado, comportamiento consistente.
- [JSON inválido silencioso] El usuario puede frustrar se si su JSON largo falla validación → Mitigación: mensaje de error inline descriptivo.
- [Colisión de claves] El usuario puede agregar dos pares con la misma clave → Mitigación: mostrar advertencia pero permitirlo (el último valor ganará en el objeto final); si se quiere restricción estricta, se puede agregar en una iteración posterior.
