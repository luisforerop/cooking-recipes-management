## Context

La aplicación tiene actualmente una página `/recipes` que muestra recetas en formato de tarjetas con datos parciales (`RecipeRow`: id, title, ingredients, preparation). Para generar PDFs con contenido completo se necesita:

1. Un lugar donde el usuario pueda elegir qué recetas incluir.
2. Un mecanismo de persistencia client-side para trasladar esa selección al paso de generación de PDF (etapa futura).

La función `getRecipes` existente solo selecciona 4 columnas del total de 9 que tiene la tabla `recipes`. Esta etapa requiere acceder a todos los campos para almacenar el tipo `Recipe` completo.

## Goals / Non-Goals

**Goals:**

- Nueva ruta `/recipes/select` con tabla de selección paginada.
- Selector de tamaño de página (items por página) persistido en URL.
- Selección múltiple por página, incluyendo "seleccionar todo en la página actual".
- Persistencia de `Recipe[]` seleccionadas en `localStorage` bajo la clave `recipe-pdf-cart`.
- Mapeo de la respuesta de Supabase al tipo `Recipe` de dominio.

**Non-Goals:**

- Generación o previsualización de PDF.
- UI para ver/gestionar las recetas ya almacenadas en el carrito.
- Edición o detalle de recetas individuales.

## Decisions

### 1. Ruta: `/recipes/select` como página independiente

Se crea una ruta separada en lugar de extender `/recipes` para mantener la separación de responsabilidades. La página de listado existente no se modifica.

_Alternativa considerada_: Agregar selección al listado actual. Descartada porque mezclaría responsabilidades y requeriría convertir la página de server a client component.

### 2. Composición Server + Client

- `app/recipes/select/page.tsx` es un Server Component: lee `searchParams` (page, pageSize), llama a Supabase, y pasa datos como props.
- `components/recipe-selection-table.tsx` es un Client Component: maneja estado de checkboxes, integra con localStorage, renderiza la tabla.

> **Nota — comportamiento del checkbox de encabezado**: el control sigue el ciclo vacío → indeterminado → marcado. Hacer clic cuando está en estado indeterminado (algunas filas seleccionadas) selecciona **todas** las filas de la página, no las deselecciona. Esto permite al usuario "completar" una selección parcial con un solo clic sin perder las ya elegidas.

> **Nota — persistencia inmediata en carrito**: no existe botón de confirmación. Cada cambio en un checkbox (individual o de encabezado) sincroniza el carrito en `localStorage` de inmediato: marcar añade la receta, desmarcar la elimina. Esto elimina el riesgo de que el usuario pierda selecciones al paginar sin confirmar.

_Rationale_: Mantener el patrón ya establecido en `/recipes`. El acceso a localStorage requiere cliente; la consulta a Supabase es más eficiente en servidor.

### 3. Nueva función de Supabase: `getRecipesFullData`

Se añade una función en `lib/supabase.ts` que obtiene todos los campos necesarios para construir `Recipe` (title, servings, preparation_time, ingredients, preparation, nutritional_information, complementaries). No modifica `getRecipes`.

_Alternativa considerada_: Reutilizar `getRecipes` con un parámetro de campos. Descartada por complejidad innecesaria dado que son casos de uso distintos.

### 4. Paginación y tamaño de página por URL searchParams

Los parámetros `page` y `pageSize` viajan por URL (e.g., `/recipes/select?page=2&pageSize=25`). Opciones de pageSize: 10, 25, 50. Default: 25.

_Rationale_: Consistente con el patrón ya usado en `/recipes`. Permite compartir/recargar sin perder posición.

### 5. clave localStorage: `recipe-pdf-cart`

Almacena un array `Recipe[]` serializado como JSON. Cada adición hace merge: si la receta ya está, no se duplica (deduplicación por `id` de Supabase). Se añade el campo `id: string` al tipo `Recipe` para hacer posible esta deduplicación y la lógica de merge se encapsula en un custom hook `useRecipeCart`.

_Alternativa considerada_: Deduplicar por `title` como clave natural del dominio. Descartada porque no garantiza unicidad si existen dos recetas con el mismo nombre.

### 6. Mapeo `RecipeRow` → `Recipe`

Se crea una función utilitaria `mapRowToRecipe` en `lib/supabase.ts` (o en un nuevo archivo `lib/recipe-mapper.ts`) que convierte los nombres snake_case de Supabase (`preparation_time`, `nutritional_information`) a los nombres camelCase del tipo `Recipe`.

## Risks / Trade-offs

- **localStorage limitado a 5MB** → Con recetas de contenido extenso (ingredientes largos, muchos pasos), podría alcanzarse el límite. Mitigación: en esta etapa los volúmenes son bajos; en etapas futuras se puede agregar validación de tamaño.
- **Server Component no puede leer localStorage** → El estado del carrito no se refleja en el servidor; el contador de seleccionados es puramente client-side. Mitigación: diseño intencional para esta etapa.
