/* ------------------------------------------------------------------------------------- */
/*                                 FUNCIONES ONCHAGE                                     */
/* ------------------------------------------------------------------------------------- */
/* Funciones Onchange para las condiciones de mostrar diferentes
                                     DIV dependiendo de selecciones por parte del usuario.
   Las listas y las reglas (contactos, documentos por caso) salen de GET /formulario.  */

const TALLER = "Taller de Servicio/Mecánico aliado";

/* El país decide el tipo de proveedor: COLOMBIA es nacional; cualquier otro, del exterior. */
function esExterior() {
  const pais = document.getElementById("pais").value;
  return !!pais && pais.trim().toUpperCase() !== "COLOMBIA";
}

function esTaller() {
  return document.getElementById("t_empresa").value === TALLER;
}

/*                       CONTACTO PROGEN: SEGÚN EL TIPO DE PROVEEDOR                      */
/* - Taller de Servicio/Mecánico aliado -> no elige: el backend le asigna el de talleres
   - Proveedor Nacional (Colombia)      -> contactosProgen.nacional
   - Proveedor Exterior                -> contactosProgen.exterior                       */
function actualizarContactoProgen() {
  const filaNombre = document.getElementById("filaNombreContactoProgen");
  const filaTaller = document.getElementById("filaContactoTaller");
  const selectNombre = document.getElementById("nombreContactoProgen");

  filaNombre.style.display = esTaller() ? "none" : "";
  filaTaller.style.display = esTaller() ? "" : "none";
  if (!catalogo) return;

  const contactos = catalogo.contactosProgen[esExterior() ? "exterior" : "nacional"];
  llenarSelect(
    selectNombre,
    contactos.map(function (c) {
      return { valor: c.id, texto: c.nombre };
    }),
  );
}

/*                  CONDICIÓN DE PAGO: SOLO VISIBLE EN INSCRIPCIÓN                        */
function esInscripcion() {
  return document.getElementById("t_registro").value === "Inscripción";
}

function actualizarCondicionPago() {
  const mostrar = esInscripcion();
  ["condicionPago", "condicionPagoNacional"].forEach(function (id) {
    const select = document.getElementById(id);
    select.closest(".row").style.display = mostrar ? "" : "none";
    if (!mostrar) select.selectedIndex = 0;
  });
}

/*                            DEPENDIENTO DEL TIPO DE PERSONA                            */
function tipopersonaOnchange() {
  actualizarDocumentos();
  actualizarContactoProgen();
}
/*                            DEPENDIENTO DEL TIPO DE IDENTIFICACION                            */

function tipoindentificacionOnchange(selected) {
  divCC = document.getElementById("cedula");
  divNIT = document.getElementById("nit");

  if (selected.value == "CC") {
    divCC.style.display = "";
    divNIT.style.display = "none";
  } else if (selected.value == "NIT") {
    divCC.style.display = "none";
    divNIT.style.display = "";
  }
}

/*                            DEPENDIENDO DEL PAÍS SELECCIONADO                            */
/* El tipo de proveedor se asigna automáticamente:
   - Colombia            -> "Proveedor Nacional"  (flujo nacional)
   - Cualquier otro país -> "Proveedor Exterior"  (flujo exterior)            */

function paisOnchange() {
  const divcontacto = document.getElementById("contacto");
  const divexterior = document.getElementById("exterior");
  const divnivel = document.getElementById("contacto_nivel_1_2");
  const divarchivos = document.getElementById("archivos");
  const divarchivosExterior = document.getElementById("archivosExterior");
  const divdatos = document.getElementById("datos");
  const filaCiudadColombia = document.getElementById("filaCiudadColombia");

  if (!esExterior()) {
    /* ----------------------------- PROVEEDOR NACIONAL ----------------------------- */
    filaCiudadColombia.style.display = "";
    divcontacto.style.display = "";
    divnivel.style.display = "";
    divarchivos.style.display = "";
    divdatos.style.display = "";

    divexterior.style.display = "none";
    divarchivosExterior.style.display = "none";
  } else {
    /* ----------------------------- PROVEEDOR EXTERIOR ----------------------------- */
    filaCiudadColombia.style.display = "none";
    divcontacto.style.display = "";
    divexterior.style.display = "";
    divarchivosExterior.style.display = "";

    divarchivos.style.display = "none";
    divnivel.style.display = "none";
    divdatos.style.display = "none";
  }
  actualizarDocumentos();
  actualizarContactoProgen();
}
