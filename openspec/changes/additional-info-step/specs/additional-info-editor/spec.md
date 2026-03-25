## ADDED Requirements

### Requirement: Additional info entry form

The additional-info editor SHALL display a form with three fields: a text input for the key (property name), a type selector with options `string`, `number`, `boolean`, and `json`, and a text input for the value. The form SHALL have a submit button labeled "Agregar".

#### Scenario: User fills all fields and submits

- **WHEN** the user enters a non-empty key, selects a type, enters a value, and clicks "Agregar"
- **THEN** a new entry is appended to the entries list and the form fields are cleared

#### Scenario: User submits with empty key

- **WHEN** the user clicks "Agregar" with an empty key field
- **THEN** the entry is not added and the form shows an inline error on the key field

#### Scenario: Default type is string

- **WHEN** the additional-info step renders for the first time
- **THEN** the type selector defaults to `string`

### Requirement: Type-specific value validation

For entries of type `json`, the editor SHALL validate that the value is parseable as JSON before adding the entry. Other types SHALL not perform parse-time validation.

#### Scenario: Valid JSON value accepted

- **WHEN** the user submits an entry with type `json` and a value that parses successfully
- **THEN** the entry is added to the list

#### Scenario: Invalid JSON value rejected

- **WHEN** the user submits an entry with type `json` and a value that fails JSON.parse
- **THEN** the entry is not added and an inline error is shown on the value field

### Requirement: Entries list

The additional-info editor SHALL display the accumulated entries as a list, each row showing the key, type badge, and value. Each row SHALL have an "Editar" button and an "Eliminar" button.

#### Scenario: List shows added entries

- **WHEN** the user has added one or more entries
- **THEN** each entry appears as a row with key, type, and value visible

#### Scenario: Empty state when no entries

- **WHEN** no entries have been added
- **THEN** the list area shows an empty state message

### Requirement: Edit an existing entry

When the user clicks "Editar" on an entry, the editor SHALL repopulate the form with that entry's key, type, and value and remove the entry from the list, allowing the user to modify and re-submit it.

#### Scenario: Clicking Editar loads entry into form

- **WHEN** the user clicks "Editar" on an existing entry
- **THEN** the key, type, and value fields are populated with that entry's data and the entry is removed from the list

#### Scenario: Re-submitting an edited entry

- **WHEN** the user modifies the pre-filled form and clicks "Agregar"
- **THEN** the updated entry is added back to the list

### Requirement: Delete an entry

The user SHALL be able to remove any entry from the list by clicking its "Eliminar" button.

#### Scenario: Eliminar removes the entry

- **WHEN** the user clicks "Eliminar" on an entry
- **THEN** that entry is removed from the list immediately

### Requirement: additionalInfo mapping

The entries list SHALL be converted to a `Record<string, unknown>` and assigned as `additionalInfo` to every recipe in the batch before passing them to the upload step. Values SHALL be cast to their declared type: `number` via `parseFloat`, `boolean` via comparing to the string `"true"`, `json` via `JSON.parse`, `string` unchanged.

#### Scenario: Entries map to additionalInfo on all recipes

- **WHEN** the user proceeds from the additional-info step with one or more entries
- **THEN** every recipe in the batch receives an `additionalInfo` object built from those entries

#### Scenario: No entries maps to empty object

- **WHEN** the user proceeds without adding any entries
- **THEN** every recipe receives `additionalInfo: {}` (or the field is omitted, relying on DB default)
