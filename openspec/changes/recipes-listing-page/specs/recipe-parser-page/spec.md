## REMOVED Requirements

### Requirement: AGREGAR RECETAS button

**Reason**: The `/recipe-parser` route is renamed to `/recipes`. This requirement is superseded by the `recipes-page` capability's "AGREGAR RECETAS button on recipes page" requirement.
**Migration**: Use `/recipes`. The button behavior is identical; only the hosting route changes.

## MODIFIED Requirements

### Requirement: Page route

The page SHALL be served at `/recipes` instead of `/recipe-parser`.

#### Scenario: Old route is no longer valid

- **WHEN** the user navigates to `/recipe-parser`
- **THEN** the page SHALL NOT be found (Next.js 404)

#### Scenario: New route serves the recipes page

- **WHEN** the user navigates to `/recipes`
- **THEN** the recipes listing page SHALL be displayed
