## 1. Route Rename

- [x] 1.1 Rename directory `app/recipe-parser/` to `app/recipes/`
- [x] 1.2 Update any internal links or navigation references from `/recipe-parser` to `/recipes`

## 2. Supabase Data Layer

- [x] 2.1 Add `getRecipes(page: number, pageSize: number)` helper in `lib/supabase.ts` that queries the `recipes` table ordered by `created_at` descending, uses `.range()` for pagination, and returns `{ data, count }`

## 3. Components

- [x] 3.1 Create `components/recipe-card.tsx` that accepts a recipe row and renders: title, up to 3 flattened ingredients with "y N más" label when N > 3, and up to 3 flattened preparation steps with "y N más" label when N > 3
- [x] 3.2 Create `components/add-recipes-button.tsx` that encapsulates the "AGREGAR RECETAS" button state and renders the `AddRecipesModal`
- [x] 3.3 Create `components/recipes-pagination.tsx` that receives `currentPage` and `totalPages` props and renders "Anterior" / "Siguiente" links using `useRouter` to update the `?page` query param; disables "Anterior" on page 1 and "Siguiente" on the last page

## 4. Recipes Page

- [x] 4.1 Convert `app/recipes/page.tsx` to an async Server Component that reads `page` from `searchParams` (defaulting to 1)
- [x] 4.2 Call `getRecipes` with the current page and render a grid of `RecipeCard` components
- [x] 4.3 Render the empty-state message "Todavía no hay recetas cargadas." when no recipes are returned
- [x] 4.4 Render `RecipesPagination` below the grid using the total count from `getRecipes`
- [x] 4.5 Place `AddRecipesButton` in the page header so it is visible at all times
