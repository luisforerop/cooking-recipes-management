### Requirement: Ícono de carrito en el header

La aplicación SHALL mostrar un ícono de carrito en el header de la aplicación (layout raíz) usando el archivo `/public/mini-cart.svg`. El ícono SHALL ser un enlace navegable a la página `/checkout`.

#### Scenario: Ícono visible en todas las páginas

- **WHEN** el usuario visualiza cualquier página de la aplicación
- **THEN** el header muestra el ícono de carrito (`mini-cart.svg`) en la barra de navegación

#### Scenario: Clic en el ícono navega al carrito

- **WHEN** el usuario hace clic en el ícono de carrito en el header
- **THEN** la aplicación navega a `/checkout`

#### Scenario: Ícono optimizado con Next.js Image

- **WHEN** se renderiza el ícono del carrito
- **THEN** el ícono usa el componente `<Image>` de Next.js apuntando a `/mini-cart.svg`
