/* ------------------------------------------------------------------------------------- */
/*                                  CARGUE DE ARCHIVOS                                   */
/* ------------------------------------------------------------------------------------- */
/*
  Los inputs de archivo conservan su `name`. Cada `documentos[i].camposFormulario`
  de GET /formulario dice qué inputs van a esa categoría, y `documentosPorCaso`
  qué categorías son requeridas u opcionales en cada caso. Nada de eso está fijo aquí.
*/

/* Dónde está cada grupo de inputs en el HTML (sólo diseño, no reglas). */
const CONTENEDOR_POR_TIPO_EMPRESA = {
  "Persona Natural": "Persona_Natural",
  "Persona Jurídica": "Persona_Juridica",
  "Taller de Servicio/Mecánico aliado": "Taller_Servicio",
};

/*
  Por `name` de input: { subido, pendiente, estado, mensaje }.
  - subido: { archivo, adjuntoId, validacionIa } ya confirmado en el borrador.
  - pendiente: { archivo, adjuntoId } ya subido pero sin confirmar (p. ej. tras un 429),
    para reintentar sólo la confirmación.
*/
const estadoArchivos = {};
let categoriaPorCampo = {};
let inputsConfigurados = false;

function inputsDeArchivo() {
  return Array.from(document.querySelectorAll("#formulario input[type=file]"));
}

/** Lee el mapeo input → categoría del catálogo y conecta los inputs (una sola vez). */
function configurarInputsDeArchivo() {
  categoriaPorCampo = {};
  catalogo.documentos.forEach(function (d) {
    d.camposFormulario.forEach(function (campo) {
      categoriaPorCampo[campo] = d.id;
    });
  });
  if (inputsConfigurados) return;
  inputsConfigurados = true;
  inputsDeArchivo().forEach(function (input) {
    estadoArchivos[input.name] = { subido: null, pendiente: null, estado: "", mensaje: "" };
    input.addEventListener("change", function () {
      archivoOnchange(input);
    });
  });
}

function documentoDe(input) {
  const id = categoriaPorCampo[input.name];
  return catalogo.documentos.find(function (d) {
    return d.id === id;
  });
}

function etiquetaDocumento(id) {
  const documento = catalogo.documentos.find(function (d) {
    return d.id === id;
  });
  return documento ? documento.label : id;
}

/** El caso de `documentosPorCaso` según país y tipo de empresa, o null si faltan datos. */
function casoActual() {
  if (!catalogo || !document.getElementById("pais").value) return null;
  const exterior = esExterior();
  const tipoEmpresa = document.getElementById("t_empresa").value;
  if (!exterior && !tipoEmpresa) return null;
  return (
    catalogo.documentosPorCaso.find(function (caso) {
      return exterior
        ? caso.tipoProveedor === "Exterior"
        : caso.tipoProveedor === "Nacional" && caso.tipoEmpresa === tipoEmpresa;
    }) || null
  );
}

/** Lo que revisa la IA en el caso actual: { categoria: "texto del requisito" }. */
function requisitosIa() {
  const caso = casoActual();
  return (caso && caso.validacionIa) || {};
}

function usaIa(input) {
  return Object.prototype.hasOwnProperty.call(requisitosIa(), categoriaPorCampo[input.name]);
}

function tiposParaIa() {
  return catalogo.adjuntos.tiposParaIa || catalogo.adjuntos.tiposPermitidos;
}

/** Texto del requisito de la IA debajo del input (o nada si el documento no pasa por la IA). */
function pintarRequisitoIa(input, texto) {
  const columna = input.closest(".custom-file").parentElement;
  let nota = columna.querySelector(".requisito-ia");
  if (!texto) {
    if (nota) nota.remove();
    return;
  }
  if (!nota) {
    nota = document.createElement("small");
    nota.className = "requisito-ia";
    columna.appendChild(nota);
  }
  nota.textContent = texto;
}

function contenedorDelCaso() {
  if (esExterior()) return document.getElementById("archivosExterior");
  const id = CONTENEDOR_POR_TIPO_EMPRESA[document.getElementById("t_empresa").value];
  return id ? document.getElementById(id) : null;
}

/** Los inputs que aplican al caso actual (en su contenedor y con categoría requerida u opcional). */
function inputsDelCaso() {
  const caso = casoActual();
  const contenedor = contenedorDelCaso();
  if (!caso || !contenedor) return [];
  const aplica = caso.requeridos.concat(caso.opcionales);
  return inputsDeArchivo().filter(function (input) {
    return contenedor.contains(input) && aplica.includes(categoriaPorCampo[input.name]);
  });
}

/** Muestra sólo los documentos del caso y marca como obligatorios los `requeridos`. */
function actualizarDocumentos() {
  const caso = casoActual();
  const tipoEmpresa = document.getElementById("t_empresa").value;
  Object.keys(CONTENEDOR_POR_TIPO_EMPRESA).forEach(function (tipo) {
    document.getElementById(CONTENEDOR_POR_TIPO_EMPRESA[tipo]).style.display =
      !esExterior() && tipo === tipoEmpresa ? "" : "none";
  });
  if (!catalogo) return;

  const activos = inputsDelCaso();
  const requisitos = requisitosIa();
  inputsDeArchivo().forEach(function (input) {
    const activo = activos.includes(input);
    const requisito = activo ? requisitos[categoriaPorCampo[input.name]] : undefined;
    input.closest(".row").style.display = activo ? "" : "none";
    input.required = activo && caso.requeridos.includes(categoriaPorCampo[input.name]);
    /* Los documentos que revisa la IA sólo se aceptan en PDF o imagen */
    if (requisito !== undefined) input.accept = tiposParaIa().join(",");
    else input.removeAttribute("accept");
    pintarRequisitoIa(input, requisito);
    pintarEstado(input);
  });
}

/* ------------------------------  Selección de archivos  ------------------------------- */

/** Tamaño y tipo contra `adjuntos` del catálogo. El backend lo vuelve a revisar. */
function problemaConArchivo(file, input) {
  const limites = catalogo.adjuntos;
  const tipo = (file.type || "").toLowerCase();
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > limites.tamanoMaximoBytes) {
    const mb = Math.round(limites.tamanoMaximoBytes / (1024 * 1024));
    return "El archivo supera los " + mb + " MB.";
  }
  if (!limites.tiposPermitidos.includes(tipo)) {
    return "Sólo se permiten PDF, imágenes y documentos de Word o Excel.";
  }
  if (usaIa(input) && !tiposParaIa().includes(tipo)) {
    return "Este documento se verifica con IA: súbelo en PDF o imagen (PNG, JPG o WEBP).";
  }
  return null;
}

function etiquetaDe(input) {
  return input.parentElement.querySelector(".custom-file-label");
}

function restaurarEtiqueta(input) {
  const label = etiquetaDe(input);
  label.classList.remove("selected");
  label.innerHTML = label.getAttribute("data-default") || "";
}

function archivoOnchange(input) {
  const file = input.files[0];
  if (!file) {
    restaurarEtiqueta(input);
    if (estadoArchivos[input.name].subido) quitarArchivo(input);
    else pintarEstado(input, "");
    return;
  }
  const problema = problemaConArchivo(file, input);
  if (problema) {
    input.value = "";
    restaurarEtiqueta(input);
    pintarEstado(input, "rechazado", problema);
    return;
  }
  const label = etiquetaDe(input);
  label.classList.add("selected");
  label.textContent = file.name;
  pintarEstado(input, "");
}

/** Quita el archivo; si ya estaba en el borrador, lo borra con DELETE /:numero/adjuntos/:adjuntoId. */
async function quitarArchivo(input) {
  const estado = estadoArchivos[input.name];
  if (estado.subido && envio) {
    if (enviando) return;
    pintarEstado(input, "subiendo", "Quitando…");
    try {
      await llamarApi("/" + envio.numero + "/adjuntos/" + estado.subido.adjuntoId, {
        method: "DELETE",
        registro: true,
      });
    } catch (error) {
      if (error.status !== 404) {
        pintarEstado(input, "error", error.message);
        return;
      }
    }
  }
  estado.subido = null;
  input.value = "";
  restaurarEtiqueta(input);
  pintarEstado(input, "");
}

/** La IA rechazó el archivo (el backend ya lo borró): se pide otro sin tocar los demás. */
function rechazarArchivo(input, mensaje) {
  estadoArchivos[input.name].pendiente = null;
  input.value = "";
  restaurarEtiqueta(input);
  pintarEstado(input, "rechazado", mensaje + " Elige otro archivo.");
}

/* ------------------------------  Estado de cada archivo  ------------------------------ */

function botonEnlace(texto, accion) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "btn btn-link btn-sm p-0 ml-2";
  boton.textContent = texto;
  boton.addEventListener("click", accion);
  return boton;
}

/**
 * Pinta la columna de estado del documento. `estado`: "" (pendiente), "subiendo",
 * "verificando" (la IA lo revisa), "esperando" (límite de verificaciones), "listo",
 * "error" (falló la subida: se puede reintentar), "rechazado" (no pasó la revisión
 * del navegador o de la IA: hay que elegir otro) o "faltante" (obligatorio sin archivo).
 * Sin argumentos, repinta con el estado guardado.
 */
function pintarEstado(input, estado, mensaje) {
  const guardado = estadoArchivos[input.name];
  if (!guardado) return;
  if (estado !== undefined) {
    guardado.estado = estado;
    guardado.mensaje = mensaje || "";
  }
  const fila = input.closest(".row");
  const celda = fila.querySelector(".estado-archivo");
  celda.innerHTML = "";
  fila.classList.toggle("fila-error", ["error", "rechazado", "faltante"].includes(guardado.estado));

  const requisito = document.createElement("small");
  requisito.className = "requisito";
  requisito.textContent = input.required ? "Obligatorio" : "Opcional";
  celda.appendChild(requisito);

  const detalle = document.createElement("div");
  detalle.className = "detalle-archivo";
  if (["subiendo", "verificando", "esperando"].includes(guardado.estado)) {
    const textos = { subiendo: "Subiendo…", verificando: "Verificando con IA…" };
    const spinner = document.createElement("span");
    spinner.className = "spinner spinner-sm";
    detalle.appendChild(spinner);
    detalle.appendChild(document.createTextNode(guardado.mensaje || textos[guardado.estado] || ""));
  } else if (guardado.estado === "listo") {
    /* "sin_validar": la IA no respondió; no es un error, Finanzas lo revisa */
    const ia = guardado.subido && guardado.subido.validacionIa;
    const textoListo =
      ia && ia.estado === "valido"
        ? "✔ Verificado"
        : ia && ia.estado === "sin_validar"
          ? "✓ Subido (lo revisará Finanzas)"
          : "✓ Subido";
    detalle.appendChild(document.createTextNode(textoListo));
    detalle.appendChild(botonEnlace("Quitar", function () {
      quitarArchivo(input);
    }));
  } else if (guardado.estado === "error") {
    detalle.appendChild(document.createTextNode(guardado.mensaje));
    detalle.appendChild(botonEnlace("Reintentar", function () {
      reintentarArchivo(input);
    }));
    detalle.appendChild(botonEnlace("Quitar", function () {
      quitarArchivo(input);
    }));
  } else if (guardado.estado === "rechazado") {
    detalle.textContent = guardado.mensaje;
  } else if (guardado.estado === "faltante") {
    detalle.textContent = "Falta este documento.";
  }
  celda.appendChild(detalle);
}

/** Marca como faltantes los documentos de estas categorías (409 de /enviar o revisión del navegador). */
function marcarFaltantes(categorias) {
  inputsDelCaso().forEach(function (input) {
    if (categorias.includes(categoriaPorCampo[input.name])) pintarEstado(input, "faltante");
  });
}
