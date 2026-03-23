## ADDED Requirements

### Requirement: Recipe preview table

The system SHALL display a preview table listing parsed recipes with the columns: **Title**, **Servings**, **Preparation Time**, **# Ingredients**, **# Steps** before any upload is triggered.

#### Scenario: Preview renders parsed recipes

- **WHEN** the user has pasted Markdown content that parses to one or more recipes
- **THEN** the preview table shows one row per recipe with the five descriptive columns populated

#### Scenario: Preview is empty when no recipes parsed

- **WHEN** the textarea is empty or the Markdown does not parse to any recipe
- **THEN** the preview table shows an empty state message and all upload buttons are disabled

### Requirement: Batch upload action

The system SHALL provide a "Subir todas" button that inserts all previewed recipes into Supabase in a single batched operation.

#### Scenario: Batch upload succeeds

- **WHEN** the user clicks "Subir todas" and all recipes are valid
- **THEN** all recipes are inserted into Supabase, each row in the preview table is marked with a "Guardado" badge, and the button shows the count of uploaded recipes

#### Scenario: Batch upload partial failure

- **WHEN** one or more recipes fail to insert during batch upload
- **THEN** successfully inserted rows are marked with "Guardado", failed rows display an inline error indicator, and an error summary message is shown

### Requirement: Individual recipe upload

The system SHALL provide an upload button per row in the preview table to insert that single recipe into Supabase.

#### Scenario: Individual upload succeeds

- **WHEN** the user clicks the upload button on a single recipe row
- **THEN** only that recipe is inserted into Supabase and its row is marked with "Guardado"

#### Scenario: Individual upload does not affect other rows

- **WHEN** the user uploads a single recipe
- **THEN** the state of all other rows in the preview table remains unchanged

### Requirement: Upload loading state

The system SHALL show a loading indicator on the active upload button(s) while the Supabase request is in progress.

#### Scenario: Button shows loading during upload

- **WHEN** an upload (batch or individual) is in progress
- **THEN** the corresponding button is disabled and displays a loading indicator until the operation completes
