## Context

La página `/checkout/pdf` existe como placeholder vacío. El proyecto ya tiene `@react-pdf/renderer` instalado. Se necesita crear el componente `RecipePdfDocument` que genere PDFs de recetas con estructura visual clara (íconos, secciones, paginación interna condicional) y un visor en la propia página junto a un botón de descarga.

## Goals / Non-Goals

**Goals:**

- Componente `RecipePdfDocument` que genera un `Document` de react-pdf con una o dos `Page` por receta según la cantidad de secciones
- Estilos completos vía `StyleSheet.create`
- Íconos SVG integrados con el componente `Image` de react-pdf (`/public/cooking-book.svg`, `/public/ingredients.svg`)
- Página `/checkout/pdf` que lee el carrito desde `localStorage` y renderiza `PDFViewer` + `PDFDownloadLink`
- Propiedades con valor `N/A` (o vacías) se omiten del render
- Número de página visible en la parte inferior de cada `Page`

**Non-Goals:**

- Edición de recetas desde la página de PDF
- Carga de recetas desde Supabase (se leen solo del carrito en `localStorage`)
- Soporte de fuentes personalizadas externas

## Decisions

### D1: Dos Page por receta cuando hay múltiples secciones

Si una receta tiene más de un grupo de ingredientes **o** más de un grupo de preparación, se divide en 2 Pages: la primera con título, rendimiento e ingredientes; la segunda con procedimientos. Así se evita el overflow de contenido. Para recetas simples (1 sección de cada uno), todo cabe en 1 Page.

**Alternativa considerada**: siempre 1 Page + `wrap` automático de react-pdf — descartado porque react-pdf no garantiza orden visual en el wrap de `View` anidados.

### D2: Nuevo componente `recipe-pdf-document.tsx`

Se crea `recipe-pdf-document.tsx` como componente dedicado, limpio y completo, con todos los estilos y la lógica de paginación interna encapsulados.

### D3: Leer carrito en el cliente antes de pasar al componente

`PDFViewer` y `PDFDownloadLink` solo funcionan en el cliente. La página `/checkout/pdf` es un Client Component que usa `useRecipePdfCart` para hidratar el carrito tras el montaje, pasando `cart` como prop al componente de PDF.

### D4: Omitir propiedades N/A

Se considera `N/A` una propiedad cuando su valor es la cadena `"N/A"`, `null`, `undefined` o array vacío. La lógica de filtrado vive dentro de `RecipePdfDocument`.

### D5: `PDFDownloadLink` debajo del visor

`PDFDownloadLink` renderiza un `<a>` que desencadena la descarga directamente desde el cliente sin pasar por el servidor.

## Risks / Trade-offs

- **[Riesgo] `PDFViewer` no disponible en SSR** → La página usa `"use client"` y la hidratación del carrito se realiza en `useEffect`; el visor solo se monta cuando `cart.length > 0`
- **[Riesgo] Rutas de SVG en react-pdf** → `Image` de react-pdf requiere URL absoluta o path resuelto con `fetch`. Se usará la URL relativa `/public/cooking-book.svg` con `process.env.NEXT_PUBLIC_BASE_URL` o path construido en runtime con `window.location.origin`; alternativamente se pueden usar rutas absolutas hardcodeadas en desarrollo si next.config configura el origen
- **[Trade-off] Sin wrap automático de texto largo** → Ingredientes o pasos muy largos pueden desbordarse visualmente; se acepta por simplicidad inicial
