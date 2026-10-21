const API = "https://rickandmortyapi.com/api/character";
export async function obtenerPersonajes(url = API) {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error al consultar la API: HTTP ${respuesta.status}`);
    return await respuesta.json();
}
