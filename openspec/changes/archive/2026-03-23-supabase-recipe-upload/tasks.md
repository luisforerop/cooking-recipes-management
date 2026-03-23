## 1. Setup y dependencias

- [x] 1.1 Instalar `@supabase/supabase-js` como dependencia del proyecto
- [x] 1.2 Agregar `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` al archivo `.env.local` (y documentar en README)
- [x] 1.3 Crear `lib/supabase.ts` con el singleton del cliente Supabase validando que las env vars existan

## 2. Mapeo de tipos

- [x] 2.1 Crear una función mapper en `lib/actions/upload-recipes.ts` que convierta `Recipe` (camelCase) al objeto de inserción snake_case: `preparationTime` → `preparation_time`, `nutritionalInformation` → `nutritional_information`
- [x] 2.2 Verificar que un insert de un objeto `Recipe` de ejemplo (una vez mapeado) no genera errores de tipo en Supabase

## 3. Server Action de upload

- [x] 3.1 Crear `lib/actions/upload-recipes.ts` con la Server Action `uploadRecipes(recipes: Recipe[])`
- [x] 3.2 Implementar inserción en lote usando `supabase.from('recipes').insert(recipes)`
- [x] 3.3 Implementar manejo de errores: retornar resultados por índice indicando éxito o error por receta
- [x] 3.4 Implementar función auxiliar `uploadSingleRecipe(recipe: Recipe)` que reutiliza la lógica de `uploadRecipes`

## 4. Componente RecipeUploadTable

- [x] 4.1 Crear `components/recipe-upload-table.tsx` como Client Component con props `recipes: Recipe[]`
- [x] 4.2 Implementar la tabla de previsualización con columnas: Title, Servings, Preparation Time, # Ingredients, # Steps
- [x] 4.3 Agregar estado vacío cuando `recipes` está vacío (sin acciones de upload)
- [x] 4.4 Implementar botón "Subir todas" que llama a `uploadRecipes` con todas las recetas
- [x] 4.5 Implementar botón de upload por fila que llama a `uploadSingleRecipe` con esa receta
- [x] 4.6 Agregar estado de carga (loading) en el botón activo durante el request
- [x] 4.7 Agregar badge "Guardado" en filas subidas exitosamente
- [x] 4.8 Mostrar indicador de error inline en filas que fallaron y mensaje de resumen si hay fallos parciales
- [x] 4.9 El botón "Subir todas" muestra el conteo de recetas subidas al completar

## 5. Integración en la página del parser

- [x] 5.1 Importar `RecipeUploadTable` en `app/recipe-parser/page.tsx`
- [x] 5.2 Pasar la lista de recetas parseadas como prop al componente
- [x] 5.3 Renderizar `RecipeUploadTable` debajo de los paneles existentes solo cuando `recipes.length > 0`

## 6. Validación

- [x] 6.1 Verificar flujo completo: pegar Markdown → ver preview → subir en lote → badges "Guardado" visibles
- [x] 6.2 Verificar flujo individual: upload de una sola receta no afecta el estado de las demás filas
- [x] 6.3 Verificar estado de carga: botones se deshabilitan y muestran spinner durante el request
- [x] 6.4 Verificar que las recetas aparecen en la tabla de Supabase después del upload
