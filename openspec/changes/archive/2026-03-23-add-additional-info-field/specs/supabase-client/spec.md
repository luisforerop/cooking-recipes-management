## MODIFIED Requirements

### Requirement: Recipe type-to-schema mapping

Before inserting into the existing `recipes` table, the application SHALL map the `Recipe` type fields to the DB column names defined in `docs/dB/shemas/recipes.md`. Specifically: `preparationTime` → `preparation_time`, `nutritionalInformation` → `nutritional_information`, and `additionalInfo` → `additional_info`. All other fields are name-compatible. When `additionalInfo` is `undefined`, the mapper SHALL omit `additional_info` from the insert payload, allowing the database `DEFAULT '{}'` to apply.

#### Scenario: Mapper produces snake_case keys

- **WHEN** a `Recipe` object is passed to the upload action
- **THEN** the object sent to Supabase uses `preparation_time`, `nutritional_information`, and `additional_info` as keys, not the camelCase equivalents

#### Scenario: Mapper omits additional_info when undefined

- **WHEN** a `Recipe` object with no `additionalInfo` field is passed to the upload action
- **THEN** the object sent to Supabase does not include the `additional_info` key, and the row is inserted with the database default `{}`

#### Scenario: Insert succeeds with mapped object

- **WHEN** a well-formed and correctly mapped `Recipe` object is inserted into the `recipes` table
- **THEN** the row is persisted and Supabase returns no error

#### Scenario: Insert rejects missing required fields

- **WHEN** an insert is attempted with a missing required field (e.g., `title`)
- **THEN** Supabase returns an error and no row is created
