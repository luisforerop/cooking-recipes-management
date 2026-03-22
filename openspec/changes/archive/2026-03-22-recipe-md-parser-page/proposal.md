## Why

There is a large collection of recipes stored in a custom Markdown format that needs to be converted into structured JSON (`Recipe` interface) for use in the application. Doing this manually is error-prone and time-consuming, especially when dealing with batches of recipes at once.

## What Changes

- New page (`/recipe-parser`) that accepts one or multiple recipes in the custom MD format.
- A `textarea` input where the user can paste MD content (single recipe or multiple recipes separated by blank lines between titles).
- A read-only side-by-side container displaying the parsed JSON output in real time.
- A parser utility that converts the MD format into an array of `Recipe` objects following the defined TypeScript interfaces.

## Capabilities

### New Capabilities

- `recipe-md-parser`: Core parser logic that transforms the custom MD recipe format into a `Recipe[]` JSON array, handling sections like `INGREDIENTES`, `PREPARACIÓN`, `INFORMACIÓN NUTRICIONAL`, and `COMPLEMENTARIOS`, including multi-section ingredients with subsection titles.
- `recipe-parser-page`: The UI page with a two-panel layout — left panel with a `textarea` for MD input, right panel showing the live JSON conversion result.

### Modified Capabilities

<!-- No existing spec-level behavior changes. -->

## Impact

- New page under `app/recipe-parser/page.tsx`.
- New utility module for parsing logic (e.g., `lib/recipe-parser.ts`).
- New TypeScript interfaces file (e.g., `lib/types/recipe.ts`) defining `Recipe`, `Ingredient`, `Section`, `PreparationStep`, `NutritionalInfo`, `Complementary`, and `NutritionalType`.
- No breaking changes to existing pages or APIs.
