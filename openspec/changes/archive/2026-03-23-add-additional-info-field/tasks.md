## 1. Tipo Recipe

- [x] 1.1 Agregar `additionalInfo?: Record<string, unknown>` a la interfaz `Recipe` en `lib/types/recipe.ts`

## 2. Mapper de inserción

- [x] 2.1 En `toDbRow` en `lib/actions/upload-recipes.ts`, incluir `additional_info: recipe.additionalInfo` solo cuando `additionalInfo` esté definido (spread condicional o similar); omitir la clave si es `undefined` para que el DB aplique su `DEFAULT '{}'`

## 3. Validación

- [x] 3.1 Verificar que una receta sin `additionalInfo` omite la clave en el payload y el row en Supabase queda con `additional_info = {}`
- [x] 3.2 Verificar que una receta con `additionalInfo` poblado persiste el objeto correctamente en la columna jsonb
