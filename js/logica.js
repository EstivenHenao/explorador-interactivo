export function filtrarPersonajes(lista, texto, estado, especie, soloFavoritos, favoritos) {
    const busqueda = texto.trim().toLowerCase();
    return lista.filter(p =>
        p.name.toLowerCase().includes(busqueda) &&
        (!estado || p.status === estado) &&
        (!especie || p.species === especie) &&
        (!soloFavoritos || favoritos.some(f => f.id === p.id))
    );
}
export function textoEstado(estado) {
    if (estado === "Alive") return "Vivo";
    if (estado === "Dead") return "Muerto";
    return "Desconocido";
}
