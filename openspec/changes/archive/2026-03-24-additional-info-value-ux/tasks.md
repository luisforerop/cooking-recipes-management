## 1. Dynamic Placeholder

- [x] 1.1 Define a `VALUE_PLACEHOLDERS` constant mapping each `FieldType` to its placeholder string: `string` → `"Valor"`, `number` → `"Ej: 42"`, `boolean` → `"true | false"`, `json` → `'Ej: {"clave": "valor"}'`
- [x] 1.2 Replace the static `placeholder="Valor"` on the value input with `placeholder={VALUE_PLACEHOLDERS[formType]}`

## 2. Boolean Validation

- [x] 2.1 In `handleAddEntry`, add a validation branch for `formType === "boolean"`: if `formValue.trim()` is not `"true"` or `"false"`, set `valueError` to `'El valor debe ser "true" o "false"'` and return without adding the entry
