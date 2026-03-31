## ADDED Requirements

### Requirement: Página de carrito de recetas

La aplicación SHALL proveer una ruta `/checkout` que muestre las recetas guardadas en el carrito del usuario (`localStorage["recipe-pdf-cart"]`) en un layout de dos columnas con proporción 2/1.

#### Scenario: Acceso con recetas en el carrito

- **WHEN** el usuario navega a `/checkout` y existen recetas en `localStorage["recipe-pdf-cart"]`
- **THEN** la página muestra las recetas del carrito usando `RecipeCard` en la columna izquierda y un panel de resumen en la columna derecha

#### Scenario: Acceso con carrito vacío

- **WHEN** el usuario navega a `/checkout` y `localStorage["recipe-pdf-cart"]` está vacío o no existe
- **THEN** la página muestra un mensaje indicando que el carrito está vacío y un enlace para volver a `/recipes/select`

---

### Requirement: Layout de dos columnas en la página de carrito

La página `/checkout` SHALL implementar un layout de dos columnas con proporción 2/1, donde la columna izquierda (más ancha) muestra las recetas y la columna derecha (más estrecha) muestra el resumen del carrito.

#### Scenario: Columna izquierda muestra recetas

- **WHEN** el usuario visualiza la página `/checkout`
- **THEN** la columna izquierda ocupa 2/3 del ancho disponible y muestra las `RecipeCard` de las recetas del carrito

#### Scenario: Columna derecha muestra resumen

- **WHEN** el usuario visualiza la página `/checkout`
- **THEN** la columna derecha ocupa 1/3 del ancho disponible y muestra el total de recetas en el carrito junto al botón "Continuar"

---

### Requirement: Paginación de recetas en el carrito

La página de carrito SHALL paginar las recetas mostrando máximo 5 por página cuando el carrito contiene más de 5 recetas.

#### Scenario: Carrito con 5 o menos recetas sin paginador

- **WHEN** el carrito contiene 5 o menos recetas
- **THEN** la página muestra todas las recetas sin paginador

#### Scenario: Carrito con más de 5 recetas muestra paginador

- **WHEN** el carrito contiene más de 5 recetas
- **THEN** la página muestra las primeras 5 recetas y un paginador para navegar entre páginas

#### Scenario: Navegar a la siguiente página del carrito

- **WHEN** el usuario hace clic en el control de página siguiente del paginador
- **THEN** la columna de recetas muestra las recetas correspondientes a la siguiente página (hasta 5 recetas)

#### Scenario: Navegar a la página anterior del carrito

- **WHEN** el usuario hace clic en el control de página anterior estando en una página mayor a 1
- **THEN** la columna de recetas muestra las recetas de la página anterior

---

### Requirement: Botón Continuar en el resumen del carrito

La columna de resumen SHALL incluir un botón "Continuar" que esté habilitado únicamente cuando el carrito tiene al menos una receta.

#### Scenario: Botón Continuar con recetas en el carrito

- **WHEN** el carrito tiene al menos una receta
- **THEN** el botón "Continuar" está habilitado

#### Scenario: Botón Continuar redirige a la página de PDF

- **WHEN** el usuario hace clic en el botón "Continuar"
- **THEN** la aplicación navega a `/checkout/pdf`

#### Scenario: Botón Continuar deshabilitado con carrito vacío

- **WHEN** el carrito está vacío
- **THEN** el botón "Continuar" está deshabilitado o no visible

---

### Requirement: Página placeholder de PDF

La aplicación SHALL proveer una ruta `/checkout/pdf` con una página vacía que sirva como placeholder para el futuro componente de generación de PDF.

#### Scenario: Acceso a la página de PDF

- **WHEN** el usuario navega a `/checkout/pdf`
- **THEN** la página se renderiza sin errores (puede estar vacía o con un mensaje de "próximamente")
