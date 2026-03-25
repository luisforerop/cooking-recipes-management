## MODIFIED Requirements

### Requirement: Type-specific value validation

For entries of type `json`, the editor SHALL validate that the value is parseable as JSON before adding the entry. For entries of type `boolean`, the editor SHALL validate that the value is exactly `"true"` or `"false"` (case-sensitive) before adding the entry. Other types SHALL not perform parse-time validation.

#### Scenario: Valid JSON value accepted

- **WHEN** the user submits an entry with type `json` and a value that parses successfully
- **THEN** the entry is added to the list

#### Scenario: Invalid JSON value rejected

- **WHEN** the user submits an entry with type `json` and a value that fails JSON.parse
- **THEN** the entry is not added and an inline error is shown on the value field

#### Scenario: Valid boolean value accepted

- **WHEN** the user submits an entry with type `boolean` and the value is exactly `"true"` or `"false"`
- **THEN** the entry is added to the list

#### Scenario: Invalid boolean value rejected

- **WHEN** the user submits an entry with type `boolean` and the value is anything other than `"true"` or `"false"`
- **THEN** the entry is not added and an inline error is shown on the value field indicating the accepted values

## ADDED Requirements

### Requirement: Dynamic value placeholder

The value input field SHALL display a type-aware placeholder that updates whenever the type selector changes: `string` → generic placeholder, `number` → numeric example, `boolean` → accepted values hint (`true | false`), `json` → JSON object example.

#### Scenario: Placeholder updates on type change

- **WHEN** the user selects a different type in the type selector
- **THEN** the value input placeholder changes to reflect the expected format for that type

#### Scenario: Boolean placeholder shows accepted values

- **WHEN** the type selector is set to `boolean`
- **THEN** the value input placeholder reads `true | false`

#### Scenario: JSON placeholder shows an example object

- **WHEN** the type selector is set to `json`
- **THEN** the value input placeholder shows a minimal JSON object example
