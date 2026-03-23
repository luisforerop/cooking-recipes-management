## REMOVED Requirements

### Requirement: Two-panel parser page layout

**Reason**: Replaced by simplified page layout with modal-based upload flow.
**Migration**: Upload functionality moved to `AddRecipesModal` component.

### Requirement: Textarea input for MD recipes

**Reason**: Textarea moved into the Markdown editor step of `AddRecipesModal`.
**Migration**: Use the modal textarea for Markdown input.

### Requirement: Live JSON conversion output

**Reason**: JSON preview panel removed as it no longer provides value to the user.
**Migration**: Recipe summary (count + errors) is now shown inside the modal.

### Requirement: Copy JSON to clipboard

**Reason**: Removed together with the JSON output panel.
**Migration**: No replacement.

### Requirement: Upload section below parser panels

**Reason**: Upload table moved into the upload confirmation step of `AddRecipesModal`.
**Migration**: `RecipeUploadTable` is rendered as the last step of the modal.

## ADDED Requirements

### Requirement: AGREGAR RECETAS button

The `/recipe-parser` page SHALL display a prominent "AGREGAR RECETAS" button that opens the `AddRecipesModal`.

#### Scenario: Button opens the modal

- **WHEN** the user clicks "AGREGAR RECETAS"
- **THEN** the `AddRecipesModal` opens at the format selection step

#### Scenario: Page renders without modal by default

- **WHEN** the user navigates to `/recipe-parser`
- **THEN** the page is visible with the "AGREGAR RECETAS" button and the modal is not open
