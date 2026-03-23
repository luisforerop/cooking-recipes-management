### Requirement: AGREGAR RECETAS button

The `/recipe-parser` page SHALL display a prominent "AGREGAR RECETAS" button that opens the `AddRecipesModal`.

#### Scenario: Button opens the modal

- **WHEN** the user clicks "AGREGAR RECETAS"
- **THEN** the `AddRecipesModal` opens at the format selection step

#### Scenario: Page renders without modal by default

- **WHEN** the user navigates to `/recipe-parser`
- **THEN** the page is visible with the "AGREGAR RECETAS" button and the modal is not open
