## Why

Los usuarios no pueden visualizar fácilmente las recetas que han agregado a su carrito. Actualmente el carrito persiste en `localStorage` pero no existe una página dedicada para revisarlo antes de continuar al flujo de generación de PDF.

## What Changes

- Nueva página `/checkout` que muestra las recetas guardadas en el carrito (`localStorage["recipe-pdf-cart"]`)
- Ícono de carrito en el header de la aplicación que enlaza a `/checkout` usando `/public/mini-cart.svg`
- Layout de dos columnas (proporción 2/1): columna izquierda con cards de recetas, columna derecha con resumen
- Paginador en la columna de recetas cuando hay más de 5 recetas en el carrito
- Botón "Continuar" en la columna de resumen que redirige a una página vacía `/checkout/pdf` (para el componente de PDF futuro)

## Capabilities

### New Capabilities

- `checkout-page`: Página `/checkout` con layout dos columnas que muestra las recetas del carrito y un panel de resumen con botón "Continuar"
- `cart-header-icon`: Ícono de carrito en el header de la aplicación que permite navegar a `/checkout`

### Modified Capabilities

- `recipe-selection-page`: El contador de recetas seleccionadas en la página de selección debe reflejar el estado del carrito (no cambia requisitos de selección, solo se añade visibilidad del total seleccionado)

## Impact

- Nuevo archivo `app/checkout/page.tsx`
- Nuevo archivo `app/checkout/pdf/page.tsx` (página vacía, placeholder)
- Modificación de `app/layout.tsx` para incluir el ícono de carrito en el header
- Reutilización del componente `components/recipe-card.tsx`
- Reutilización del hook `lib/hooks/use-recipe-pdf-cart.ts` para leer el carrito desde `localStorage`
- Sin cambios en base de datos ni en Supabase
