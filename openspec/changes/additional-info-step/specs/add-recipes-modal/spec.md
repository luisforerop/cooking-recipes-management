## ADDED Requirements

### Requirement: Additional-info editor step

The modal SHALL include an `"additional-info"` step between the Markdown editor step and the upload confirmation step. This step SHALL render the Additional Info Editor, which allows the user to create, edit, and delete key/value pairs that will be mapped to `additionalInfo` on every recipe in the batch. The step header SHALL read "Información adicional". The step is optional: the user MAY proceed without adding any entries.

#### Scenario: Step renders after continuing from markdown

- **WHEN** the user clicks "Continuar" on the Markdown editor step with at least one parsed recipe
- **THEN** the modal transitions to the `additional-info` step

#### Scenario: User can skip the step

- **WHEN** the `additional-info` step is shown and the user clicks "Continuar" without adding entries
- **THEN** the modal advances to the upload confirmation step

#### Scenario: Continue with entries advances to upload

- **WHEN** the user has added one or more entries and clicks "Continuar"
- **THEN** the modal advances to the upload confirmation step with `additionalInfo` populated on all recipes

## MODIFIED Requirements

### Requirement: Markdown editor step

The modal's Markdown editor step SHALL display a textarea on the left and a recipe summary panel on the right. The summary SHALL update in real time (debounced 300ms) as the user types and SHALL show the number of successfully parsed recipes and any parse errors.

#### Scenario: Summary shows parsed recipe count

- **WHEN** the user pastes valid Markdown content
- **THEN** the summary panel shows the count of successfully parsed recipes

#### Scenario: Summary shows parse errors

- **WHEN** the user pastes Markdown that contains malformed recipe blocks
- **THEN** the summary panel indicates that some blocks could not be parsed

#### Scenario: Continue button is disabled with no recipes

- **WHEN** the textarea is empty or no recipes were successfully parsed
- **THEN** the "Continuar" button is disabled

#### Scenario: Continue button advances to additional-info step

- **WHEN** at least one recipe has been parsed and the user clicks "Continuar"
- **THEN** the modal transitions to the additional-info step

### Requirement: Upload confirmation step

The modal's upload confirmation step SHALL render the existing `RecipeUploadTable` component with the parsed recipes (with `additionalInfo` already populated), without modification. The user can upload all or individual recipes from this step.

#### Scenario: Upload table is rendered with parsed recipes

- **WHEN** the upload confirmation step is shown
- **THEN** `RecipeUploadTable` receives the parsed recipes as props and renders correctly

#### Scenario: Back navigation returns to additional-info step

- **WHEN** the user clicks the back button on the upload step
- **THEN** the modal returns to the `additional-info` step
