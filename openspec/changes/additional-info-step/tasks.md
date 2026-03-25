## 1. Types & State

- [x] 1.1 Define `AdditionalInfoEntry` type: `{ key: string; type: "string" | "number" | "boolean" | "json"; value: string }`
- [x] 1.2 Update `Step` union in `add-recipes-modal.tsx` to include `"additional-info"`
- [x] 1.3 Add state to `AddRecipesModal`: `entries: AdditionalInfoEntry[]`, form fields `formKey`, `formType`, `formValue`, and validation error strings `keyError`, `valueError`

## 2. Additional Info Editor — Form

- [x] 2.1 Render a text input for the entry key with inline error display when `keyError` is set
- [x] 2.2 Render a `<select>` for type with options `string`, `number`, `boolean`, `json` (default `string`)
- [x] 2.3 Render a text input for the entry value with inline error display when `valueError` is set
- [x] 2.4 Implement submit handler: validate non-empty key; for type `json` validate `JSON.parse`; on success append to entries and clear form; on failure set inline errors

## 3. Additional Info Editor — Entries List

- [x] 3.1 Render the accumulated entries list with columns: key, type badge, value
- [x] 3.2 Add "Eliminar" button per row that removes the entry from the list
- [x] 3.3 Add "Editar" button per row that removes the entry and repopulates the form fields with its data
- [x] 3.4 Render an empty-state message when no entries have been added

## 4. Modal Integration

- [x] 4.1 Add `"additional-info"` step rendering block inside the modal body that hosts the editor form and list
- [x] 4.2 Update modal header title: add `step === "additional-info" && "Información adicional"`
- [x] 4.3 Update footer: show "Atrás" and "Continuar" on the `additional-info` step; "Continuar" advances to `"upload"`, "Atrás" returns to `"markdown"`
- [x] 4.4 Change the `markdown` step "Continuar" button target from `"upload"` to `"additional-info"`
- [x] 4.5 Change the `upload` step "Atrás" button target from `"markdown"` to `"additional-info"`
- [x] 4.6 Build `additionalInfo` object from entries before the upload step: cast values according to their declared type (`parseFloat` for number, `=== "true"` for boolean, `JSON.parse` for json, identity for string)
- [x] 4.7 Derive enriched recipes (`parsedWithInfo`) by spreading `additionalInfo` onto each recipe and pass them to `<RecipeUploadTable>`
- [x] 4.8 Clear `entries`, `formKey`, `formType`, `formValue`, and errors in the `handleClose` reset timeout
