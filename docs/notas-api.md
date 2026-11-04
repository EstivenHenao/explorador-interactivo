# Notas de la API · Rick and Morty

- **URL de la lista:** https://rickandmortyapi.com/api/character
- **Dónde está el array:** `datos.results` (así lo leo en `js/app.js`)
- **Página siguiente:** `datos.info.next`. Es una URL completa; vale `null` en la última página.
- **¿Hace falta pedir detalle?** No. Cada personaje de la lista ya trae lo que muestran la tarjeta y el modal: `name`, `status`, `species`, `gender`, `origin`, `location` e `image`.
- **Paginación:** sí. Se usa el botón "Cargar más", que pide `info.next`.
- **Filtros:** la búsqueda y los filtros de estado y especie se aplican en el navegador sobre los personajes ya cargados.