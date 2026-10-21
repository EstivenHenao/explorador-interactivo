import { obtenerPersonajes } from "./api.js";
import { leerFavoritos, guardarFavoritos, esFavorito, cambiarFavorito } from "./favoritos.js";
import { filtrarPersonajes, textoEstado } from "./logica.js";

const $ = selector => document.querySelector(selector);
const grilla = $("#grilla-personajes"), busqueda = $("#busqueda"), estado = $("#filtro-estado"), especie = $("#filtro-especie");
const mensaje = $("#mensaje-resultados"), contador = $("#contador-resultados"), modal = $("#modal-personaje");
let personajes = [], siguiente = null, favoritos = leerFavoritos(), soloFavoritos = false, cargando = false;

function escapar(valor = "") {
    return String(valor).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function tarjetaHTML(p) {
    const fav = esFavorito(p.id, favoritos), clase = p.status === "Alive" ? "vivo" : p.status === "Dead" ? "muerto" : "";
    return `<article class="tarjeta-personaje"><div class="tarjeta-imagen"><img src="${p.image}" alt="Imagen de ${escapar(p.name)}" loading="lazy"><span class="estado"><i class="punto ${clase}"></i>${textoEstado(p.status)}</span></div>
    <div class="tarjeta-cuerpo"><h2>${escapar(p.name)}</h2><dl class="datos-personaje"><div class="dato"><dt>Especie</dt><dd>${escapar(p.species)}</dd></div><div class="dato"><dt>Origen</dt><dd>${escapar(p.origin?.name || "Desconocido")}</dd></div></dl>
    <div class="acciones-tarjeta"><button class="boton-detalle" data-accion="detalle" data-id="${p.id}">Ver detalle</button><button class="boton-favorito ${fav?"activo":""}" data-accion="favorito" data-id="${p.id}" aria-label="${fav?"Quitar de favoritos":"Agregar a favoritos"}" aria-pressed="${fav}">${fav?"♥":"♡"}</button></div></div></article>`;
}
function render() {
    const resultado = filtrarPersonajes(personajes, busqueda.value, estado.value, especie.value, soloFavoritos, favoritos);
    grilla.innerHTML = resultado.map(tarjetaHTML).join("");
    contador.textContent = `${resultado.length} personaje(s) visibles`;
    mensaje.textContent = soloFavoritos ? `Tus favoritos: ${resultado.length}` : `Personajes cargados: ${personajes.length}`;
    $("#contador-favoritos").textContent = favoritos.length;
    $("#estado-vacio").hidden = resultado.length > 0;
    $("#cargar-mas").hidden = soloFavoritos || !siguiente;
}
async function cargar(url, agregar = false) {
if (cargando || (agregar && !url)) return;
    cargando = true; $("#cargar-mas").disabled = true; mensaje.textContent = "Cargando personajes...";
    try {
        const datos = await obtenerPersonajes(url);
        personajes = agregar ? [...personajes, ...datos.results] : datos.results;
        siguiente = datos.info.next; render();
    } catch (error) {
        mensaje.textContent = error.message;
        if (!personajes.length) grilla.innerHTML = `<p>No se pudieron cargar los personajes. Revisa tu conexión y recarga la página.</p>`;
    } finally { cargando = false; $("#cargar-mas").disabled = false; }
}
function abrirDetalle(p) {
    $("#detalle-personaje").innerHTML = `<div class="detalle"><img src="${p.image}" alt="Imagen de ${escapar(p.name)}"><div><p class="etiqueta">FICHA DEL PERSONAJE</p><h2>${escapar(p.name)}</h2><p><b>Estado:</b> ${textoEstado(p.status)}</p><p><b>Especie:</b> ${escapar(p.species)}</p><p><b>Género:</b> ${escapar(p.gender)}</p><p><b>Origen:</b> ${escapar(p.origin?.name || "Desconocido")}</p><p><b>Ubicación:</b> ${escapar(p.location?.name || "Desconocida")}</p><button class="boton boton-principal" id="modal-fav">${esFavorito(p.id,favoritos)?"Quitar de favoritos":"Agregar a favoritos"}</button></div></div>`;
    modal.showModal();
    $("#modal-fav").addEventListener("click", () => { favoritos = cambiarFavorito(p,favoritos); guardarFavoritos(favoritos); render(); abrirDetalle(p); });
}
grilla.addEventListener("click", e => {
    const b = e.target.closest("button[data-accion]"); if (!b) return;
    const p = personajes.find(item => item.id === Number(b.dataset.id)); if (!p) return;
    if (b.dataset.accion === "detalle") abrirDetalle(p);
    else { favoritos = cambiarFavorito(p,favoritos); guardarFavoritos(favoritos); render(); }
});
[busqueda,estado,especie].forEach(c => c.addEventListener("input",render));
$("#limpiar-filtros").addEventListener("click", () => { busqueda.value=""; estado.value=""; especie.value=""; soloFavoritos=false; render(); });
$("#ver-favoritos").addEventListener("click", () => { soloFavoritos=!soloFavoritos; render(); $("#explorar").scrollIntoView({behavior:"smooth"}); });
$("#cargar-mas").addEventListener("click", () => cargar(siguiente,true));
$("#reiniciar-vacio").addEventListener("click", () => { busqueda.value="";estado.value="";especie.value="";soloFavoritos=false;render(); });
$("#cerrar-modal").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
$("#menu-boton").addEventListener("click", () => { const abierto=$("#menu").classList.toggle("abierto"); $("#menu-boton").setAttribute("aria-expanded",String(abierto)); });
$("#menu").querySelectorAll("a").forEach(a => a.addEventListener("click",()=>{$("#menu").classList.remove("abierto");$("#menu-boton").setAttribute("aria-expanded","false");}));
cargar();
