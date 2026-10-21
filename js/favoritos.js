const CLAVE = "explorador-interactivo-favoritos";
export function leerFavoritos() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
    catch { return []; }
}
export function guardarFavoritos(lista) { localStorage.setItem(CLAVE, JSON.stringify(lista)); }
export function esFavorito(id, lista) { return lista.some(personaje => personaje.id === id); }
export function cambiarFavorito(personaje, lista) {
    return esFavorito(personaje.id, lista) ? lista.filter(item => item.id !== personaje.id) : [...lista, personaje];
}
