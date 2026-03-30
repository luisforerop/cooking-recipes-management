## Why

The `/recipe-parser` route only supports adding new recipes but does not display the recipes already stored in the database, making the route name misleading and the page incomplete. Users need a central page to browse all existing recipes.

## What Changes

- **BREAKING** Rename route `/recipe-parser` → `/recipes`
- Replace the sparse parser page with a full recipes view that still includes the "AGREGAR RECETAS" button
- Fetch and display existing recipes from the database as cards
- Each card shows: title, up to 3 ingredients (with remaining count), up to 3 steps (with remaining count)
- Add pagination to the recipe listing

## Capabilities

### New Capabilities

- `recipes-page`: The `/recipes` page — lists all recipes from the database as cards with truncated ingredients/steps and pagination, and retains the "AGREGAR RECETAS" action

### Modified Capabilities

- `recipe-parser-page`: **BREAKING** route renamed from `/recipe-parser` to `/recipes`; page behavior superseded by `recipes-page`

## Impact

- `app/recipe-parser/page.tsx` — directory renamed to `app/recipes/`
- `lib/supabase.ts` — new query to fetch paginated recipes
- `components/` — new `recipe-card.tsx` component
- Any internal links pointing to `/recipe-parser` must be updated to `/recipes`
