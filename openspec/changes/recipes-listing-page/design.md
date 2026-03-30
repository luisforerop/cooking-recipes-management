## Context

The current `/recipe-parser` page is a fully client-side component that only shows the "AGREGAR RECETAS" button. It has no data fetching and does not display any recipes from Supabase. The route name is also misleading — the parser is just one sub-feature.

The `recipes` table in Supabase stores `title`, `ingredients` (jsonb array of Section<Ingredient>), and `preparation` (jsonb array of Section<PreparationStep>).

## Goals / Non-Goals

**Goals:**

- Rename the route from `/recipe-parser` to `/recipes`
- Display all existing recipes as cards fetched from Supabase with pagination
- Each card shows: title, first 3 ingredients (with "N more" indicator), first 3 preparation steps (with "N more" indicator)
- Pagination driven by URL query param `?page=N`
- Retain the "AGREGAR RECETAS" button

**Non-Goals:**

- Recipe detail page (clicking a card does nothing in this change)
- Filtering or searching recipes
- Editing or deleting recipes from this page

## Decisions

### 1. Convert page to a Server Component with a client island

The listing page will be a React Server Component that fetches data before rendering. The "AGREGAR RECETAS" button and modal retain their `"use client"` boundary, extracted into a standalone `AddRecipesButton` client component.

**Why**: Server Components avoid client-side loading states for the initial data fetch, enable URL-based pagination to work without JS hydration delays, and keep the bundle lean.

**Alternative considered**: Keep it fully `"use client"` with `useEffect` fetching — rejected because it introduces a loading flash and makes the URL param approach more complex.

### 2. URL search param for pagination (`?page=N`)

Pagination state is stored in the URL as `?page=1`, `?page=2`, etc. The server component reads `searchParams.page` and passes the offset to Supabase.

**Why**: Shareable URLs, browser back/forward navigation, SSR-compatible. No client state needed for pagination.

### 3. Supabase `.range()` for paginated queries

Use `supabase.from("recipes").select("id, title, ingredients, preparation", { count: "exact" }).range(from, to).order("created_at", { ascending: false })`.

**Why**: Single query returns both data and total count (`count: "exact"`) needed to compute total pages. Efficient server-side pagination.

### 4. Truncation logic in a RecipeCard component

A new `RecipeCard` Server Component flattens sectioned ingredients/steps and shows up to 3 items, appending "y N más" if more exist.

**Why**: Isolates display logic, reusable, no state needed — pure render component.

## Risks / Trade-offs

- [Route rename is breaking] → Update the home page `<a href="/recipe-parser">` link (if any) to `/recipes` during the same change.
- [Large ingredient/step lists flattened] → Flattening across sections loses section titles in the card preview; acceptable for a summary card view.
- [No loading state during page transitions] → Next.js shows a loading indicator by default; can add `loading.tsx` later if needed.

## Migration Plan

1. Rename `app/recipe-parser/` directory to `app/recipes/`
2. Convert `page.tsx` to a Server Component; extract `AddRecipesButton` as a client island
3. Add `getRecipes(page, pageSize)` helper in `lib/supabase.ts`
4. Build `RecipeCard` component
5. Build pagination UI component
6. Update any internal links from `/recipe-parser` to `/recipes`
