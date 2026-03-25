## Why

El campo de valor del editor de información adicional es un input de texto genérico que no da pistas al usuario sobre el formato esperado según el tipo seleccionado. Un usuario que elige `boolean` no sabe si debe escribir `true`/`false`, `1`/`0`, `sí`/`no`; uno que elige `json` no tiene un ejemplo de estructura. Esto genera errores de ingreso que son difíciles de diagnosticar.

## What Changes

- El placeholder del campo "Valor" cambia dinámicamente según el tipo seleccionado: `json` muestra un ejemplo de objeto JSON, `boolean` muestra las dos opciones válidas, `string` y `number` conservan un placeholder genérico.
- Se agrega validación inline para el tipo `boolean`: si el valor no es exactamente `"true"` o `"false"` al hacer clic en "Agregar", se muestra un error en el campo de valor sin agregar la entrada.

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `additional-info-editor`: se añade comportamiento de placeholder dinámico y validación de valor para el tipo `boolean`.

## Impact

- `components/add-recipes-modal.tsx` — único archivo afectado; cambios en el atributo `placeholder` del input de valor y en la función `handleAddEntry`.
