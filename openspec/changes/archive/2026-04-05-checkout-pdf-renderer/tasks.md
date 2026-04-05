## 1. Componente RecipePdfDocument

- [x] 1.1 Crear `components/recipe-pdf-document.tsx` con la directiva `"use client"` y la firma del componente que acepta `recipes: RecipeRow[]`
- [x] 1.2 Definir los estilos con `StyleSheet.create` (contenedor de página, título, secciones, ítems, pie de página)
- [x] 1.3 Implementar la lógica de paginación interna: determinar si la receta usa 1 Page o 2 Pages según la cantidad de grupos de ingredientes y de preparación
- [x] 1.4 Renderizar el ícono `cooking-book.svg` con `<Image>` de react-pdf en la parte superior, antes del título
- [x] 1.5 Renderizar el título de la receta en mayúsculas con `toUpperCase()`
- [x] 1.6 Renderizar la sección "Rendimiento" en negrita solo si `servings` tiene valor distinto de `N/A`, vacío o nulo
- [x] 1.7 Renderizar el ícono `ingredients.svg` con `<Image>` de react-pdf antes de la sección de ingredientes
- [x] 1.8 Renderizar la sección de ingredientes agrupados con títulos de grupo (si existen) e ítems
- [x] 1.9 Renderizar la sección de procedimiento con grupos y descripciones de pasos
- [x] 1.10 Añadir el número de página en el pie de cada `Page` usando `render` prop de react-pdf o texto estático

## 2. Página /checkout/pdf

- [x] 2.1 Convertir `app/checkout/pdf/page.tsx` en Client Component (`"use client"`)
- [x] 2.2 Leer las recetas del carrito usando el hook `useRecipePdfCart`
- [x] 2.3 Renderizar `PDFViewer` con el componente `RecipePdfDocument` cuando el carrito tiene al menos una receta
- [x] 2.4 Mostrar mensaje de carrito vacío con enlace a `/recipes/select` cuando no hay recetas
- [x] 2.5 Añadir `PDFDownloadLink` debajo del `PDFViewer` con el mismo documento para descargar el archivo PDF
