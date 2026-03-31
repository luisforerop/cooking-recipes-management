## 1. Recursos estáticos

- [x] 1.1 Verificar que el archivo `mini-cart.svg` existe en `/public/` (añadirlo si no está presente)

## 2. Ícono de carrito en el header

- [x] 2.1 Modificar `app/layout.tsx` para añadir un header con el ícono de carrito
- [x] 2.2 Envolver el ícono en un componente `<Link href="/checkout">` de Next.js
- [x] 2.3 Usar el componente `<Image>` de Next.js apuntando a `/mini-cart.svg` con `alt` descriptivo

## 3. Página de carrito `/checkout`

- [x] 3.1 Crear `app/checkout/page.tsx` como Client Component (`"use client"`)
- [x] 3.2 Leer las recetas del carrito usando el hook `use-recipe-pdf-cart`
- [x] 3.3 Implementar el layout de dos columnas con proporción 2/1 usando Tailwind (`grid-cols-3` o `col-span-2` / `col-span-1`)
- [x] 3.4 Renderizar `RecipeCard` para cada receta en la columna izquierda
- [x] 3.5 Implementar paginación client-side con `pageSize` fijo de 5 recetas
- [x] 3.6 Mostrar el componente paginador solo cuando el carrito tiene más de 5 recetas
- [x] 3.7 Mostrar estado vacío con mensaje y enlace a `/recipes/select` cuando el carrito está vacío

## 4. Panel de resumen

- [x] 4.1 Implementar la columna derecha con el total de recetas en el carrito
- [x] 4.2 Añadir el botón "Continuar" que navega a `/checkout/pdf`
- [x] 4.3 Deshabilitar el botón "Continuar" cuando el carrito está vacío

## 5. Página placeholder `/checkout/pdf`

- [x] 5.1 Crear `app/checkout/pdf/page.tsx` como página vacía (placeholder para el componente de PDF)
