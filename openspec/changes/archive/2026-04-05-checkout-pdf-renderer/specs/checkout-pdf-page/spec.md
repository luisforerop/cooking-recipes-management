## ADDED Requirements

### Requirement: Página de previsualización de PDF en /checkout/pdf

La página `/checkout/pdf` SHALL ser un Client Component que lea las recetas del carrito desde `localStorage` y renderice un `PDFViewer` con el componente `RecipePdfDocument`.

#### Scenario: Visor visible con recetas en el carrito

- **WHEN** el usuario navega a `/checkout/pdf` y el carrito tiene al menos una receta
- **THEN** la página muestra el `PDFViewer` con el documento generado por `RecipePdfDocument`

#### Scenario: Sin recetas en el carrito

- **WHEN** el usuario navega a `/checkout/pdf` y el carrito está vacío
- **THEN** la página muestra un mensaje indicando que no hay recetas en el carrito

---

### Requirement: Botón de descarga del PDF

Debajo del `PDFViewer` SHALL existir un botón de descarga usando `PDFDownloadLink` de `@react-pdf/renderer`.

#### Scenario: Descarga disponible con recetas

- **WHEN** el carrito tiene al menos una receta
- **THEN** el botón de descarga aparece debajo del visor y al hacer clic descarga el PDF generado

#### Scenario: Descarga oculta sin recetas

- **WHEN** el carrito está vacío
- **THEN** el botón de descarga no se muestra
