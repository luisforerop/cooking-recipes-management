## Context

The application manages cooking recipes. A large collection of recipes already exists in a custom Markdown format with defined sections (`TÍTULO`, `RENDIMIENTO`, `TIEMPO`, `INGREDIENTES`, `PREPARACIÓN`, `INFORMACIÓN NUTRICIONAL`, `COMPLEMENTARIOS`). These recipes need to be available as structured JSON conforming to the `Recipe` TypeScript interface. Currently there is no tooling to perform this conversion, requiring manual effort that is slow and error-prone.

## Goals / Non-Goals

**Goals:**

- Provide a client-side parser utility that converts the custom MD format into `Recipe[]` JSON.
- Support both single-recipe and multi-recipe (batch) input separated within the same text block.
- Provide a two-panel UI page where the user pastes MD on the left and sees the JSON result on the right in real time.
- Handle multi-section ingredients (with subsection titles like "Masa:", "Relleno:") as well as flat ingredient lists.
- Normalize nutritional info type labels (e.g., "Calorías" → `"calories"`, "Proteinas" → `"protein"`) to match `NutritionalType`.
- Normalize string values (trim whitespace, sentence-case titles, etc.).

**Non-Goals:**

- Persisting parsed recipes to a database or API.
- Validating that parsed recipes are nutritionally correct.
- Supporting other input formats (e.g., CSV, XLSX).
- Authentication or user accounts.

## Decisions

### Decision 1: Client-side parsing only

**Choice**: All parsing runs in the browser (no server action or API route).  
**Rationale**: The feature is a utility tool for content editors. Keeping it client-side avoids backend complexity and works offline. Data volumes (individual recipe texts) are small, so performance is not a concern.  
**Alternatives considered**: Server action / API route – rejected because it adds unnecessary round-trips for a purely transformational, stateless operation.

### Decision 2: Real-time parsing via React state

**Choice**: Parse on every `onChange` of the textarea using a `useMemo` or `useCallback`, debounced to avoid excessive calls on large batches.  
**Rationale**: Provides instant feedback without a submit button, matching the "live conversion" UX requirement.  
**Alternatives considered**: Parse on button click – simpler, but less ergonomic for iterative editing.

### Decision 3: Parser as a pure utility function

**Choice**: Implement the parser as a pure TypeScript function in `lib/recipe-parser.ts` that takes a `string` and returns `Recipe[]`.  
**Rationale**: Decoupled from UI, easily unit-testable, and reusable for future import flows (e.g., file upload, seeding).

### Decision 4: Ingredient section detection

**Choice**: A line ending with `:` (not matching `ITEM:`, `PASO N:`, `VALOR:`, `TIPO:`, `CONTENIDO:`) inside the `INGREDIENTES` block is treated as a subsection title.  
**Rationale**: Mirrors the observed format where subsections like "Masa:" or "Relleno:" appear before ingredient `ITEM:` lines. This heuristic covers the known data without over-engineering.

### Decision 5: TypeScript interfaces location

**Choice**: Place shared interfaces in `lib/types/recipe.ts`.  
**Rationale**: Centralizes type definitions for reuse across the parser, page, and future features.

## Risks / Trade-offs

- **[Risk] Unusual MD variations** → The parser is designed for the known format. Edge cases in existing recipes may cause partial parses. Mitigation: display parse errors inline in the JSON panel so the user can identify and fix malformed input.
- **[Risk] Large batch input causes UI lag** → Debounce the parse call (300ms) to keep the UI responsive. Mitigation: debounce + `useMemo`.
- **[Trade-off] Heuristic subsection detection** → Simple but may misclassify a line as a subsection title if unusual colon usage appears in ingredient names. Acceptable for the known dataset.
