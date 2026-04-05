## Why

El usuario seleccionó recetas y llegó a `/checkout/pdf`, pero la página está vacía. Se necesita implementar el componente de generación y previsualización de PDF con las recetas del carrito, haciendo uso de la librería `@react-pdf/renderer` que ya está parcialmente integrada en el proyecto.

## What Changes

- Nuevo componente `RecipePdfDocument` en `components/recipe-pdf-document.tsx` que recibe el array de recetas y genera el documento PDF con estilos, íconos, secciones y paginación interna
- Implementación de la página `/checkout/pdf` (`app/checkout/pdf/page.tsx`) que lee el carrito desde `localStorage` y renderiza el componente con `PDFViewer` para previsualización
- Botón de descarga del PDF usando el componente `PDFDownloadLink` de `@react-pdf/renderer`, ubicado debajo del visor

## Capabilities

### New Capabilities

- `recipe-pdf-document`: Componente React PDF que genera un documento estructurado con íconos, título, rendimiento, ingredientes y procedimiento por cada receta, con soporte de paginación interna (1 o 2 pages según complejidad)
- `checkout-pdf-page`: Página `/checkout/pdf` que integra el visor PDF y el botón de descarga, leyendo las recetas del carrito desde `localStorage`

### Modified Capabilities

## Impact

- Nuevo archivo `components/recipe-pdf-document.tsx`
- Modificación de `app/checkout/pdf/page.tsx` (actualmente placeholder vacío)
- Uso de `@react-pdf/renderer` (ya instalado): `Document`, `Page`, `View`, `Text`, `Image`, `StyleSheet`, `PDFViewer`, `PDFDownloadLink`
- Uso de iconos SVG existentes: `/public/cooking-book.svg` e `/public/ingredients.svg`
- Reutilización del hook `use-recipe-pdf-cart` para leer el carrito
- Sin cambios en base de datos ni en Supabase
