## ADDED Requirements

### Requirement: Upload section below parser panels

The `/recipe-parser` page SHALL render the `RecipeUploadTable` component below the existing two-panel layout whenever the parsed recipe list is non-empty.

#### Scenario: Upload section appears after successful parse

- **WHEN** the user pastes Markdown content that results in one or more parsed recipes
- **THEN** the upload preview table and action buttons appear below the parser panels

#### Scenario: Upload section hidden when no recipes

- **WHEN** the parsed recipe list is empty
- **THEN** no upload section is rendered on the page
