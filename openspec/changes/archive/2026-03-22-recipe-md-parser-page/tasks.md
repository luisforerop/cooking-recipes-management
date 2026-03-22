## 1. Types & Interfaces

- [x] 1.1 Create `lib/types/recipe.ts` with all TypeScript interfaces: `Section<T>`, `Ingredient`, `PreparationStep`, `NutritionalType`, `NutritionalInfo`, `Complementary`, and `Recipe`

## 2. Parser Utility

- [x] 2.1 Create `lib/recipe-parser.ts` with a `parseRecipes(input: string): Recipe[]` pure function
- [x] 2.2 Implement batch splitting: detect recipe boundaries by splitting on lines that start with `TÍTULO:`
- [x] 2.3 Implement header field parsing: extract `TÍTULO`, `RENDIMIENTO`, and `TIEMPO` from each recipe block
- [x] 2.4 Implement ingredient section parsing: detect flat lists vs. subsection titles (lines ending with `:`) and build `Section<Ingredient>[]`
- [x] 2.5 Implement preparation step parsing: collect `PASO N:` lines into a single `Section<PreparationStep>`
- [x] 2.6 Implement nutritional info parsing: map `VALOR: <label> | <content>` lines to `NutritionalInfo[]`, normalizing Spanish labels to `NutritionalType`
- [x] 2.7 Implement complementaries parsing: collect `TIPO:` / `CONTENIDO:` pairs into `Complementary[]`
- [x] 2.8 Implement title normalization: convert all-uppercase titles to sentence case

## 3. Parser Page UI

- [x] 3.1 Create `app/recipe-parser/page.tsx` with a two-panel layout using Tailwind CSS (left: input, right: output)
- [x] 3.2 Add a `<textarea>` in the left panel for MD recipe input
- [x] 3.3 Wire textarea `onChange` to call `parseRecipes` with 300ms debounce and store result in state
- [x] 3.4 Render the parsed JSON in the right panel using a `<pre>` element with `JSON.stringify(result, null, 2)`
- [x] 3.5 Show an empty state message in the output panel when the textarea is empty
- [x] 3.6 Add a "Copy JSON" button to the output panel that copies the JSON string to the clipboard
- [x] 3.7 Implement temporary "Copied!" feedback on the copy button (revert after ~2 seconds)

## 4. Navigation

- [x] 4.1 Add a link or navigation entry to `/recipe-parser` in the main layout or home page so it is discoverable
