## ADDED Requirements

### Requirement: Recipes listing page at /recipes

The `/recipes` page SHALL fetch all recipes from Supabase and display them as a paginated grid of recipe cards.

#### Scenario: Page loads with existing recipes

- **WHEN** the user navigates to `/recipes`
- **THEN** the page SHALL display a grid of recipe cards, one per stored recipe, ordered by most recently created first

#### Scenario: Page loads with no recipes

- **WHEN** the user navigates to `/recipes` and no recipes exist in the database
- **THEN** the page SHALL display the empty-state message "Todavía no hay recetas cargadas." and the "AGREGAR RECETAS" button

### Requirement: Recipe card ingredient truncation

Each recipe card SHALL display a maximum of 3 ingredients, flattened across all ingredient sections.

#### Scenario: Recipe has 3 or fewer ingredients

- **WHEN** the total number of ingredients across all sections is 3 or fewer
- **THEN** the card SHALL display all ingredient names

#### Scenario: Recipe has more than 3 ingredients

- **WHEN** the total number of ingredients across all sections exceeds 3
- **THEN** the card SHALL display the first 3 ingredient names followed by a label reading "y N más" where N is the count of remaining ingredients

### Requirement: Recipe card step truncation

Each recipe card SHALL display a maximum of 3 preparation steps, flattened across all preparation sections.

#### Scenario: Recipe has 3 or fewer steps

- **WHEN** the total number of preparation steps across all sections is 3 or fewer
- **THEN** the card SHALL display all step descriptions

#### Scenario: Recipe has more than 3 steps

- **WHEN** the total number of preparation steps across all sections exceeds 3
- **THEN** the card SHALL display the first 3 step descriptions followed by a label reading "y N más" where N is the count of remaining steps

### Requirement: Recipes page pagination

The `/recipes` page SHALL paginate recipe cards using the `page` URL query parameter.

#### Scenario: Default page is 1

- **WHEN** the user navigates to `/recipes` without a `page` query parameter
- **THEN** the first page of recipes SHALL be displayed

#### Scenario: User navigates to next page

- **WHEN** the user clicks the "Siguiente" pagination control
- **THEN** the URL SHALL update to `?page=N+1` and the next set of recipes SHALL be displayed

#### Scenario: User navigates to previous page

- **WHEN** the user clicks the "Anterior" pagination control and the current page is greater than 1
- **THEN** the URL SHALL update to `?page=N-1` and the previous set of recipes SHALL be displayed

#### Scenario: Previous button is disabled on first page

- **WHEN** the user is on page 1
- **THEN** the "Anterior" control SHALL be disabled

#### Scenario: Next button is disabled on last page

- **WHEN** the user is on the last page (no more recipes)
- **THEN** the "Siguiente" control SHALL be disabled

### Requirement: AGREGAR RECETAS button on recipes page

The `/recipes` page SHALL display the "AGREGAR RECETAS" button that opens the `AddRecipesModal`.

#### Scenario: Button opens the modal

- **WHEN** the user clicks "AGREGAR RECETAS"
- **THEN** the `AddRecipesModal` SHALL open at the format selection step

#### Scenario: Button is always visible

- **WHEN** the user navigates to `/recipes` regardless of whether recipes exist
- **THEN** the "AGREGAR RECETAS" button SHALL be visible in the page header
