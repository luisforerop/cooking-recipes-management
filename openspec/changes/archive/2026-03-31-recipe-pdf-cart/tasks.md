## 1. Data Layer

- [x] 1.1 Crear tipo `RecipeFullRow` en `lib/supabase.ts` con todos los campos de la tabla: `id`, `title`, `servings`, `preparation_time`, `ingredients`, `preparation`, `nutritional_information`, `complementaries`, `additional_info`
- [x] 1.2 Crear función `getRecipesFullData(page, pageSize)` en `lib/supabase.ts` que seleccione todos los campos de `RecipeFullRow` con paginación y ordenamiento por `created_at` descendente
- [x] 1.3 Añadir campo `id: string` al tipo `Recipe` en `lib/types/recipe.ts`
- [x] 1.4 Crear función `mapRowToRecipe(row: RecipeFullRow): Recipe` que convierta `preparation_time` → `preparationTime`, `nutritional_information` → `nutritionalInformation`, e incluya `id`

## 2. Hook de carrito

- [x] 2.1 Crear `lib/hooks/use-recipe-pdf-cart.ts` como custom hook que lea y escriba `localStorage["recipe-pdf-cart"]` serializando `Recipe[]`
- [x] 2.2 Implementar función `addToCart(recipes: Recipe[])` con deduplicación por `id` (no agrega si ya existe)
- [x] 2.3 Exponer `cartIds: Set<string>` desde el hook para que la tabla pueda determinar qué filas pre-seleccionar

## 3. Componente de tabla de selección

- [x] 3.1 Crear `components/recipe-selection-table.tsx` como Client Component que reciba `recipes: Recipe[]` y `totalCount: number` como props
- [x] 3.2 Implementar checkbox individual por fila con estado de selección local
- [x] 3.3 Implementar checkbox de encabezado con tres estados: vacío (ninguna fila seleccionada) → indeterminado (algunas seleccionadas) → marcado (todas seleccionadas); hacer clic en estado indeterminado selecciona todas las filas de la página
- [x] 3.4 Pre-seleccionar filas cuyo `id` ya exista en `cartIds` al montar el componente
- [x] 3.5 Eliminar botón "Añadir al carrito"; persistir el cambio en `localStorage` de forma inmediata al marcar o desmarcar cualquier checkbox (individual o de encabezado): marcar → `addToCart`, desmarcar → `removeFromCart`

## 4. Controles de paginación y tamaño de página

- [x] 4.1 Crear `components/page-size-selector.tsx` como Client Component con opciones 10, 25 y 50; al cambiar actualiza la URL con `?pageSize=<valor>&page=1` usando `useRouter`
- [x] 4.2 Crear `components/recipe-selection-pagination.tsx` (o reutilizar `RecipesPagination`) con navegación anterior/siguiente que actualice `?page=<n>` en la URL preservando `pageSize`

## 5. Página /recipes/select

- [x] 5.1 Crear `app/recipes/select/page.tsx` como Server Component que lea `searchParams` (`page`, `pageSize` con defaults 1 y 25), valide rangos y llame a `getRecipesFullData`
- [x] 5.2 Mapear los resultados con `mapRowToRecipe` y pasar `recipes: Recipe[]`, `totalCount`, `currentPage` y `pageSize` como props al componente `RecipeSelectionTable`
- [x] 5.3 Incluir `PageSizeSelector` y paginación dentro del layout de la página
- [x] 5.4 Añadir un enlace de navegación desde la página `/recipes` hacia `/recipes/select`
