## 1. Componente AddRecipesModal

- [x] 1.1 Crear `components/add-recipes-modal.tsx` como Client Component con props `open: boolean` y `onClose: () => void` y estado interno `step: "format" | "markdown" | "upload"`
- [x] 1.2 Implementar paso `format`: tres botones (Markdown habilitado, CSV y JSON deshabilitados con estilo visual de disabled)
- [x] 1.3 Implementar paso `markdown`: textarea a la izquierda con debounce de 300ms y panel de resumen a la derecha (cantidad de recetas parseadas y mensajes de error)
- [x] 1.4 Implementar botón "Continuar" en el paso `markdown` — deshabilitado cuando no hay recetas parseadas; al hacer clic avanza al paso `upload`
- [x] 1.5 Implementar paso `upload`: renderizar `<RecipeUploadTable recipes={parsed} />` sin modificaciones
- [x] 1.6 Agregar botón "Atrás" en el paso `upload` que regresa al paso `markdown` preservando el contenido del textarea
- [x] 1.7 Implementar cierre de modal: botón X visible en todos los pasos; al cerrar, resetear `step` a `"format"` y limpiar el textarea

## 2. Refactorizar page.tsx

- [x] 2.1 Eliminar la lógica de JSON output de `app/recipe-parser/page.tsx`: `useDebounce`, `jsonOutput`, `handleCopy`, estado `copied`, estado `parsed`, y el import de `parseRecipes`
- [x] 2.2 Reemplazar el layout de dos paneles y la sección de upload por un layout limpio centrado con el botón "AGREGAR RECETAS"
- [x] 2.3 Agregar estado `modalOpen` y renderizar `<AddRecipesModal open={modalOpen} onClose={() => setModalOpen(false)} />`

## 3. Validación

- [x] 3.1 Verificar que CSV y JSON están deshabilitados y solo Markdown es seleccionable
- [x] 3.2 Verificar que el resumen actualiza en tiempo real y el botón "Continuar" está deshabilitado sin recetas
- [x] 3.3 Verificar que `RecipeUploadTable` funciona correctamente dentro de la modal (carga individual y en lote)
- [x] 3.4 Verificar que cerrar la modal resetea el estado al paso inicial
