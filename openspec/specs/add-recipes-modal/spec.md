### Requirement: Format selection step

The modal SHALL display three format options on its first step: **Markdown** (enabled), **CSV** (disabled), and **JSON** (disabled). The user SHALL only be able to proceed with Markdown in this iteration.

#### Scenario: Markdown option is selectable

- **WHEN** the modal opens
- **THEN** the Markdown button is enabled and clickable

#### Scenario: CSV and JSON options are disabled

- **WHEN** the modal opens
- **THEN** the CSV and JSON buttons are visually disabled and do not respond to clicks

#### Scenario: Selecting Markdown advances to editor step

- **WHEN** the user clicks the Markdown button
- **THEN** the modal transitions to the Markdown editor step

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

#### Scenario: Continue button advances to upload step

- **WHEN** at least one recipe has been parsed and the user clicks "Continuar"
- **THEN** the modal transitions to the upload confirmation step

### Requirement: Upload confirmation step

The modal's upload confirmation step SHALL render the existing `RecipeUploadTable` component with the parsed recipes, without modification. The user can upload all or individual recipes from this step.

#### Scenario: Upload table is rendered with parsed recipes

- **WHEN** the upload confirmation step is shown
- **THEN** `RecipeUploadTable` receives the parsed recipes as props and renders correctly

#### Scenario: Back navigation returns to editor step

- **WHEN** the user clicks the back button on the upload step
- **THEN** the modal returns to the Markdown editor step with the textarea content preserved

### Requirement: Modal dismissal

The modal SHALL provide a way to close it at any step without saving any data.

#### Scenario: Closing the modal resets state

- **WHEN** the user closes the modal
- **THEN** the modal state resets to the format selection step and the textarea is cleared
