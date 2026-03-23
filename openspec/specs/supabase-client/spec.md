### Requirement: Supabase client singleton

The system SHALL export a single Supabase client instance from `lib/supabase.ts` using environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

#### Scenario: Client is initialized with env vars

- **WHEN** the application starts
- **THEN** the Supabase client is available for use without additional configuration at the call site

#### Scenario: Missing env vars fail at startup

- **WHEN** either `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is not defined
- **THEN** the client initialization throws an error with a descriptive message

### Requirement: Recipe type-to-schema mapping

Before inserting into the existing `recipes` table, the application SHALL map the `Recipe` type fields to the DB column names defined in `specs/database-schema.md`. Specifically: `preparationTime` → `preparation_time` and `nutritionalInformation` → `nutritional_information`. All other fields are name-compatible.

#### Scenario: Mapper produces snake_case keys

- **WHEN** a `Recipe` object is passed to the upload action
- **THEN** the object sent to Supabase uses `preparation_time` and `nutritional_information` as keys, not the camelCase equivalents

#### Scenario: Insert succeeds with mapped object

- **WHEN** a well-formed and correctly mapped `Recipe` object is inserted into the `recipes` table
- **THEN** the row is persisted and Supabase returns no error

#### Scenario: Insert rejects missing required fields

- **WHEN** an insert is attempted with a missing required field (e.g., `title`)
- **THEN** Supabase returns an error and no row is created
