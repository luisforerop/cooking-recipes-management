### Requirement: Página de selección de recetas

La aplicación SHALL proveer una ruta `/recipes/select` que muestre todas las recetas disponibles en una tabla paginada con soporte de selección múltiple.

#### Scenario: Acceso a la página

- **WHEN** el usuario navega a `/recipes/select`
- **THEN** la página muestra una tabla con las recetas de la primera página usando el tamaño de página por defecto (25)

#### Scenario: Sin recetas disponibles

- **WHEN** el usuario navega a `/recipes/select` y no existen recetas en la base de datos
- **THEN** la tabla muestra un mensaje indicando que no hay recetas disponibles

---

### Requirement: Selección individual de recetas

La tabla SHALL mostrar un checkbox por fila que permita al usuario seleccionar o deseleccionar una receta individual.

#### Scenario: Seleccionar una receta

- **WHEN** el usuario hace clic en el checkbox de una fila
- **THEN** la fila queda marcada como seleccionada y el checkbox muestra estado activo

#### Scenario: Deseleccionar una receta

- **WHEN** el usuario hace clic en el checkbox de una fila ya seleccionada
- **THEN** la fila queda desmarcada y el checkbox muestra estado inactivo

---

### Requirement: Selección de todas las recetas de la página actual

La tabla SHALL proveer un control (checkbox o botón) en el encabezado que permita seleccionar o deseleccionar todas las recetas de la página actual en un solo clic.

#### Scenario: Seleccionar todas en la página

- **WHEN** el usuario activa el control "seleccionar todo" en el encabezado de la tabla
- **THEN** todos los checkboxes de fila en la página actual quedan marcados

#### Scenario: Deseleccionar todas en la página

- **WHEN** todas las filas de la página están seleccionadas y el usuario hace clic en el control "seleccionar todo"
- **THEN** todos los checkboxes de fila en la página actual quedan desmarcados

#### Scenario: Estado indeterminado del control

- **WHEN** algunas (pero no todas) las filas de la página están seleccionadas
- **THEN** el control "seleccionar todo" muestra un estado indeterminado (parcial)

#### Scenario: Clic en estado indeterminado selecciona todo

- **WHEN** el control "seleccionar todo" está en estado indeterminado y el usuario hace clic en él
- **THEN** todos los checkboxes de fila en la página actual quedan marcados

---

### Requirement: Paginación de recetas

La página SHALL implementar paginación que permita navegar entre grupos de recetas, reflejando el estado en la URL mediante los parámetros `page` y `pageSize`.

#### Scenario: Navegar a la siguiente página

- **WHEN** el usuario hace clic en el control de página siguiente
- **THEN** la URL se actualiza con `page=<n+1>` y la tabla muestra las recetas correspondientes a esa página

#### Scenario: Navegar a la página anterior

- **WHEN** el usuario hace clic en el control de página anterior estando en una página mayor a 1
- **THEN** la URL se actualiza con `page=<n-1>` y la tabla muestra las recetas de esa página

#### Scenario: La primera página no tiene "anterior"

- **WHEN** el usuario está en la página 1
- **THEN** el control de página anterior está deshabilitado o no visible

#### Scenario: La última página no tiene "siguiente"

- **WHEN** el usuario está en la última página
- **THEN** el control de página siguiente está deshabilitado o no visible

---

### Requirement: Selector de cantidad de recetas por página

La página SHALL proveer un selector que permita al usuario cambiar cuántas recetas se muestran por página. Las opciones disponibles son 10, 25 y 50. El valor por defecto es 25.

#### Scenario: Cambiar el tamaño de página

- **WHEN** el usuario selecciona una opción diferente en el selector de tamaño de página
- **THEN** la URL se actualiza con `pageSize=<valor>` y `page=1`, y la tabla muestra la cantidad de recetas correspondiente

#### Scenario: Tamaño de página reflejado en URL

- **WHEN** el usuario carga la página con `?pageSize=50` en la URL
- **THEN** el selector muestra "50" como opción activa y la tabla muestra hasta 50 recetas

---

### Requirement: Persistencia de recetas seleccionadas en localStorage

El sistema SHALL persistir el conjunto de recetas seleccionadas por el usuario en `localStorage` bajo la clave `recipe-pdf-cart`, almacenando objetos de tipo `Recipe` con todos sus campos. La persistencia SHALL ocurrir de forma inmediata cada vez que el usuario interactúa con un checkbox (individual o de encabezado), sin necesidad de un botón de confirmación.

#### Scenario: Guardar receta al seleccionarla

- **WHEN** el usuario marca el checkbox de una fila
- **THEN** la receta correspondiente se añade inmediatamente a `localStorage["recipe-pdf-cart"]`

#### Scenario: Eliminar receta al deseleccionarla

- **WHEN** el usuario desmarca el checkbox de una fila que estaba seleccionada
- **THEN** la receta correspondiente se elimina inmediatamente de `localStorage["recipe-pdf-cart"]`

#### Scenario: Guardar todas al seleccionar la página completa

- **WHEN** el usuario activa el control "seleccionar todo" y todas las filas quedan marcadas
- **THEN** las recetas de la página que aún no estaban en el carrito se añaden inmediatamente a `localStorage["recipe-pdf-cart"]`

#### Scenario: Eliminar todas al deseleccionar la página completa

- **WHEN** el usuario desactiva el control "seleccionar todo" y todas las filas quedan desmarcadas
- **THEN** las recetas de la página se eliminan inmediatamente de `localStorage["recipe-pdf-cart"]`

#### Scenario: Deduplicación por id

- **WHEN** el usuario marca una receta cuyo `id` ya existe en `localStorage["recipe-pdf-cart"]`
- **THEN** la receta no se duplica en el array almacenado

#### Scenario: Recuperar recetas al recargar

- **WHEN** el usuario navega a `/recipes/select` y ya existen recetas en `localStorage["recipe-pdf-cart"]`
- **THEN** las filas correspondientes a esas recetas aparecen pre-seleccionadas (reflejando el estado del carrito)
