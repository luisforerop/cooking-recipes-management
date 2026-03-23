## Context

La página `/recipe-parser` expone directamente el panel de parseo JSON y la tabla de upload, generando una interfaz sobrecargada. El objetivo es mover toda la lógica de carga de recetas a una modal estructurada por pasos, dejando la página limpia para evolucionar hacia una vista de listado de recetas.

El componente `RecipeUploadTable` ya existe y funciona correctamente — no debe modificarse.

## Goals / Non-Goals

**Goals:**

- Simplificar la página `/recipe-parser` a un layout con un único botón "AGREGAR RECETAS".
- Crear una modal multi-paso `AddRecipesModal` que encapsula todo el flujo de carga.
- Reutilizar `RecipeUploadTable` como último paso de la modal sin modificarlo.

**Non-Goals:**

- Implementar los formatos CSV y JSON (quedan deshabilitados visualmente).
- Implementar la vista de listado de recetas existentes.
- Modificar `RecipeUploadTable`, `lib/recipe-parser.ts`, ni ninguna Server Action.

## Decisions

### 1. Modal como componente con estado interno de pasos

**Decisión:** `components/add-recipes-modal.tsx` es un Client Component que maneja internamente `step: "format" | "markdown" | "upload"`. Recibe `open` y `onClose` como props desde `page.tsx`.

**Alternativas consideradas:**

- Un componente por paso en archivos separados → más overhead de organización para una modal de tres pasos simples. Un componente único con estado interno es suficiente y más fácil de razonar.
- Estado de paso en `page.tsx` → innecesario exponer esa lógica al padre.

### 2. Flujo de pasos

```
page.tsx
  └── [botón AGREGAR RECETAS]
        └── AddRecipesModal (open)
              ├── step="format"   → elige Markdown (CSV/JSON deshabilitados)
              ├── step="markdown" → textarea + resumen (count, errores) + [Continuar]
              └── step="upload"   → <RecipeUploadTable recipes={parsed} />
```

**Decisión:** "Continuar" como copy del CTA en el paso Markdown. El paso de upload no tiene botón propio de cierre — el usuario puede cerrar la modal con la X o volver atrás (botón secundario).

### 3. Eliminación del parser de dos paneles

**Decisión:** Se remueve completamente el panel JSON del `page.tsx`. El estado `input`, `parsed`, `useDebounce`, `jsonOutput` y `handleCopy` se eliminan de la página y se trasladan al interior de `AddRecipesModal` (paso `markdown`).

**Alternativas consideradas:**

- Mantener la página pero ocultar los paneles → innecesario, agrega dead code.

### 4. Resumen de parseo en el paso Markdown

**Decisión:** Panel derecho en el paso `markdown` muestra: número de recetas detectadas y lista de errores de parseo (recetas que no pudieron parsearse). El resumen se actualiza en tiempo real con debounce de 300ms, igual que la implementación actual.

**Decisión de copy para el botón de avance:** "Continuar" — comunica avance sin implicar guardado.

## Risks / Trade-offs

- **[Risk] El usuario no puede ver el JSON raw** → Aceptado intencionalmente; esa funcionalidad se marcó como sin valor.
- **[Risk] Modal larga en pantallas pequeñas** → El paso `upload` contiene la tabla completa; en móvil puede requerir scroll interno. Mitigación: overflow-y-auto en el cuerpo de la modal.
