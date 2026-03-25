## Context

El editor de información adicional en `add-recipes-modal.tsx` usa un `<input type="text">` genérico para el valor. El tipo seleccionado ya está disponible en el estado `formType`. La validación al submit para `json` ya existe; se extiende el mismo patrón para `boolean`.

## Goals / Non-Goals

**Goals:**

- Placeholder del input de valor refleja el tipo seleccionado en tiempo real
- `boolean` valida que el valor sea `"true"` o `"false"` exacto al hacer submit

**Non-Goals:**

- Cambiar el tipo del input a `checkbox` para boolean (se mantiene texto para consistencia visual)
- Validación on-blur (solo on-submit)
- Cambios en otros tipos

## Decisions

### Placeholders por tipo

| Tipo      | Placeholder              |
| --------- | ------------------------ |
| `string`  | `Valor`                  |
| `number`  | `Ej: 42`                 |
| `boolean` | `true \| false`          |
| `json`    | `Ej: {"clave": "valor"}` |

Se usa un objeto/mapa constante para derivar el placeholder a partir de `formType`, evitando un `if/else` largo.

### Validación boolean: comparación estricta

`formValue.trim() !== "true" && formValue.trim() !== "false"` → error inline, misma posición que el error de JSON inválido existente. Sin cambios en el resto del flujo.
