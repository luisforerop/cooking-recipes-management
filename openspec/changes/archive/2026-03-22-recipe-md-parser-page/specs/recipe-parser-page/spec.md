## ADDED Requirements

### Requirement: Two-panel parser page layout

The page at `/recipe-parser` SHALL render a two-panel layout with an input panel on the left and a JSON output panel on the right.

#### Scenario: Page renders both panels

- **WHEN** the user navigates to `/recipe-parser`
- **THEN** a textarea input panel and a read-only JSON output panel are visible side by side

### Requirement: Textarea input for MD recipes

The input panel SHALL contain a `<textarea>` where the user can paste one or more recipes in the custom MD format.

#### Scenario: User pastes a recipe

- **WHEN** the user pastes or types MD content into the textarea
- **THEN** the textarea reflects the pasted content

#### Scenario: Textarea accepts multi-recipe input

- **WHEN** the user pastes multiple recipes into the textarea
- **THEN** all content is accepted without truncation

### Requirement: Live JSON conversion output

The output panel SHALL display the parsed JSON result in real time as the user types or pastes into the textarea.

#### Scenario: JSON updates on input change

- **WHEN** the user modifies the textarea content
- **THEN** the JSON output panel updates to reflect the parsed result within 300ms (debounced)

#### Scenario: JSON is formatted for readability

- **WHEN** the JSON output is displayed
- **THEN** it is pretty-printed with 2-space indentation

#### Scenario: Empty textarea shows empty state

- **WHEN** the textarea is empty
- **THEN** the output panel shows an empty state message or an empty array `[]`

### Requirement: Copy JSON to clipboard

The output panel SHALL provide a button to copy the displayed JSON to the clipboard.

#### Scenario: Copy button copies JSON

- **WHEN** the user clicks the copy button
- **THEN** the full JSON string is copied to the clipboard

#### Scenario: Copy button shows feedback

- **WHEN** the user clicks the copy button
- **THEN** the button label temporarily changes to indicate success (e.g., "Copied!")
