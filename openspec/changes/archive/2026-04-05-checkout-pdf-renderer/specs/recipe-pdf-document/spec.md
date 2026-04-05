## ADDED Requirements

### Requirement: Componente de documento PDF de receta

El sistema SHALL proveer un componente React `RecipePdfDocument` que acepte un array de recetas (`RecipeRow[]`) y genere un `Document` de `@react-pdf/renderer` con una estructura visual definida por sección.

#### Scenario: Documento sin recetas

- **WHEN** el componente recibe un array vacío
- **THEN** el componente renderiza un `Document` vacío sin páginas

---

### Requirement: Ícono y título superior de receta

Cada receta SHALL iniciar con el ícono `cooking-book.svg` seguido del título de la receta en mayúsculas.

#### Scenario: Título en mayúsculas

- **WHEN** se renderiza una receta
- **THEN** el título aparece en mayúsculas usando `toUpperCase()`

#### Scenario: Ícono cooking-book antes del título

- **WHEN** se renderiza una receta
- **THEN** el ícono `cooking-book.svg` aparece encima del título principal

---

### Requirement: Sección de rendimiento

La receta SHALL mostrar una sección "Rendimiento" con el valor de `servings` en negrita únicamente si `servings` no es `N/A`, `null`, `undefined` ni cadena vacía.

#### Scenario: Rendimiento visible cuando tiene valor

- **WHEN** `servings` tiene un valor distinto de `N/A`, vacío o nulo
- **THEN** se muestra la etiqueta "Rendimiento" en negrita seguida del valor

#### Scenario: Rendimiento oculto cuando es N/A

- **WHEN** `servings` es `"N/A"`, `null`, `undefined` o cadena vacía
- **THEN** la sección de rendimiento no se renderiza

---

### Requirement: Ícono de ingredientes y sección de ingredientes

Después de la sección de rendimiento SHALL aparecer el ícono `ingredients.svg` seguido de la sección de ingredientes con sus grupos y elementos.

#### Scenario: Ícono ingredients antes de la sección

- **WHEN** se renderiza la sección de ingredientes
- **THEN** el ícono `ingredients.svg` aparece antes de la lista de ingredientes

#### Scenario: Renderizado de ingredientes agrupados

- **WHEN** la receta tiene múltiples grupos de ingredientes
- **THEN** cada grupo muestra su título (si existe) y sus ítems individuales

---

### Requirement: Sección de procedimiento

La receta SHALL mostrar una sección de procedimiento con sus grupos y pasos individuales.

#### Scenario: Renderizado de pasos de procedimiento

- **WHEN** la receta tiene pasos de preparación
- **THEN** cada grupo de preparación muestra su título (si existe) y sus descripciones

---

### Requirement: Paginación interna por receta (1 o 2 Pages)

Cada receta SHALL ocupar 1 `Page` si tiene exactamente 1 grupo de ingredientes y 1 grupo de preparación. Si tiene más de 1 grupo de ingredientes o más de 1 grupo de preparación, SHALL ocupar 2 `Page`: la primera con título, rendimiento e ingredientes; la segunda con procedimientos.

#### Scenario: Receta simple en una sola Page

- **WHEN** la receta tiene 1 grupo de ingredientes y 1 grupo de preparación
- **THEN** todo el contenido (título, rendimiento, ingredientes, procedimiento) aparece en una sola `Page`

#### Scenario: Receta compleja en dos Pages

- **WHEN** la receta tiene más de 1 grupo de ingredientes o más de 1 grupo de preparación
- **THEN** la primera `Page` contiene título, rendimiento e ingredientes; la segunda `Page` contiene el procedimiento

---

### Requirement: Número de página en el pie

Cada `Page` del documento SHALL mostrar el número de página actual en la parte inferior.

#### Scenario: Página muestra su número

- **WHEN** se renderiza cualquier `Page` del documento
- **THEN** el número de página aparece en la parte inferior de esa página

---

### Requirement: Estilos con StyleSheet.create

Todos los estilos del componente SHALL definirse usando `StyleSheet.create` de `@react-pdf/renderer`.

#### Scenario: Estilos definidos con StyleSheet

- **WHEN** se renderiza el componente
- **THEN** los estilos de contenedor, texto, título, secciones y pie provienen de un objeto `StyleSheet.create`
