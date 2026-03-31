## Context

Actualmente el carrito de recetas se almacena en `localStorage["recipe-pdf-cart"]` y es accesible mediante el hook `use-recipe-pdf-cart`. Sin embargo, no existe una vista dedicada donde el usuario pueda revisar las recetas seleccionadas antes de continuar al flujo de generación de PDF. El usuario no tiene visibilidad del contenido del carrito ni acceso rápido a él desde el header de la aplicación.

## Goals / Non-Goals

**Goals:**

- Página `/checkout` que muestra las recetas del carrito con layout de dos columnas (2/1)
- Ícono de carrito en el header con enlace a `/checkout`
- Paginación client-side para el listado de recetas del carrito (más de 5 recetas)
- Botón "Continuar" en el panel de resumen que navega a `/checkout/pdf`
- Página vacía `/checkout/pdf` como placeholder para el futuro componente de PDF

**Non-Goals:**

- Eliminar o editar recetas desde la página de carrito (eso pertenece a `/recipes/select`)
- Generación de PDF (futura funcionalidad)
- Persistencia del carrito en servidor o base de datos

## Decisions

### D1: Paginación client-side en la página de carrito

El carrito vive en `localStorage`, por lo que todas las recetas están disponibles en el cliente. Se pagina client-side filtrando el array en memoria con un slice según `page` y `pageSize` (fijo en 5).

**Alternativa considerada**: Parámetros de URL para la paginación — descartado por complejidad innecesaria dado el volumen bajo de recetas esperadas en un carrito.

### D2: Reutilizar `RecipeCard` existente

El componente `recipe-card.tsx` ya existe y cumple los requisitos de visualización. Se reutiliza directamente sin modificaciones.

### D3: Leer el carrito con el hook existente

`use-recipe-pdf-cart` ya implementa la lectura/escritura de `localStorage["recipe-pdf-cart"]`. La página de checkout solo necesita leer el estado; no requiere modificar el carrito desde esta vista.

### D4: Ícono como imagen SVG en el header

El ícono del carrito usará el archivo `/public/mini-cart.svg` con el componente `<Image>` de Next.js para optimización. El ícono se envuelve en un `<Link>` a `/checkout`.

### D5: Página `/checkout/pdf` como placeholder

Se crea una página vacía en `app/checkout/pdf/page.tsx` para habilitar la navegación desde el botón "Continuar". El componente de PDF se implementará en un cambio futuro.

## Risks / Trade-offs

- **[Riesgo] Carrito vacío al navegar a `/checkout`** → Mostrar mensaje de estado vacío con enlace a `/recipes/select`
- **[Riesgo] `localStorage` no disponible en SSR** → El hook debe usar `useEffect` o verificar `typeof window !== 'undefined'` antes de acceder a localStorage. La página de checkout usa Client Component (`"use client"`)
- **[Trade-off] Paginación fija en 5** → Simplifica el diseño; el usuario siempre verá máximo 5 cards por página sin configuración adicional
