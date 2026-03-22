## ADDED Requirements

### Requirement: Parse single MD recipe into Recipe object

The parser SHALL accept a string containing a single recipe in the custom MD format and return a `Recipe[]` array with one element conforming to the `Recipe` interface.

#### Scenario: Parse minimal recipe

- **WHEN** input contains a single recipe with `TÍTULO`, `RENDIMIENTO`, `TIEMPO`, `INGREDIENTES`, `PREPARACIÓN`, and `COMPLEMENTARIOS` sections
- **THEN** the parser returns an array with one `Recipe` object with all corresponding fields populated

#### Scenario: Parse recipe with multi-section ingredients

- **WHEN** the `INGREDIENTES` block contains subsection titles (lines ending with `:` that are not prefixed keywords) followed by `ITEM:` lines
- **THEN** each subsection becomes a `Section<Ingredient>` with its `title` set and `items` containing the ingredients under it

#### Scenario: Parse recipe with flat ingredient list

- **WHEN** the `INGREDIENTES` block contains only `ITEM:` lines with no subsection titles
- **THEN** the parser returns a single `Section<Ingredient>` with no `title` and all items collected

#### Scenario: Parse preparation steps

- **WHEN** the `PREPARACIÓN` block contains lines prefixed with `PASO N:` (where N is a number)
- **THEN** each step description is added as a `PreparationStep` item in a single `Section<PreparationStep>` with no title

#### Scenario: Parse nutritional information

- **WHEN** the `INFORMACIÓN NUTRICIONAL` block contains lines with `VALOR: <label> | <content>`
- **THEN** the parser maps known Spanish labels to `NutritionalType` values (`calories`, `protein`, `carbohydrates`, `fat`) and sets `content` accordingly

#### Scenario: Parse complementary sections

- **WHEN** the `COMPLEMENTARIOS` block contains `TIPO: <type>` and `CONTENIDO: <content>` pairs
- **THEN** each pair becomes a `Complementary` object with `type` and `content` in lowercase

### Requirement: Parse batch of MD recipes

The parser SHALL accept a string containing multiple recipes concatenated together and return a `Recipe[]` array with one element per recipe.

#### Scenario: Detect recipe boundaries in batch input

- **WHEN** input contains multiple recipes each starting with `TÍTULO:` on a new line
- **THEN** the parser splits correctly at each `TÍTULO:` occurrence and returns one `Recipe` per block

#### Scenario: Return empty array for empty input

- **WHEN** input is an empty string or contains only whitespace
- **THEN** the parser returns an empty array `[]`

### Requirement: Normalize recipe field values

The parser SHALL normalize field values to produce clean, consistent output.

#### Scenario: Normalize title casing

- **WHEN** the `TÍTULO` field is in all uppercase (e.g., `TARTA DE VERDURAS`)
- **THEN** the `title` field in the output is in sentence case (e.g., `Tarta de verduras`)

#### Scenario: Trim whitespace from all string values

- **WHEN** any parsed value has leading or trailing whitespace
- **THEN** the output value is trimmed
