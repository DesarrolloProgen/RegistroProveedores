/* ------------------------------------------------------------------------------------- */
/*              REGISTRO DE PROVEEDORES CONTRA EL BACKEND (Portal PROGEN)                */
/* ------------------------------------------------------------------------------------- */
/*
  Contrato: portal-progen-backend/docs/zona-proveedores-api.md
  GET /formulario → POST / → por archivo: POST /:numero/adjuntos →
  PUT .../archivo → POST .../confirmar → POST /:numero/enviar.
*/

/* Catálogo de GET /formulario: listas, contactos, documentos y límites. */
let catalogo = null;
let tokenFormulario = null;
let tokenFormularioEn = 0;

/* Borrador creado en este envío ({ numero, token, datos }), para reintentar sin duplicarlo. */
let envio = null;
let enviando = false;

/* El token del formulario dura 4 h; se renueva antes de que venza. */
const RENOVAR_TOKEN_MS = 3.5 * 60 * 60 * 1000;
/* El backend rechaza un token usado antes de 3 s (así detecta bots). */
const TOKEN_ESPERA_MINIMA_MS = 3000;
/* La confirmación (y la IA) tiene un límite por IP por minuto: tras un 429 se espera
   la ventana y se reintenta sólo la confirmación, hasta estas veces. */
const LIMITE_ESPERA_MS = 60 * 1000;
const LIMITE_REINTENTOS = 3;

class ErrorApi extends Error {
  constructor(status, mensaje, detalles, reintentarEnMs) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
    this.reintentarEnMs = reintentarEnMs;
  }
}

function pausa(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

/** Llama la API. `registro: true` agrega X-Registro-Token; `archivo` va como cuerpo crudo. */
async function llamarApi(ruta, opciones) {
  opciones = opciones || {};
  const headers = {};
  let body;
  if (opciones.archivo) {
    headers["Content-Type"] = opciones.archivo.type;
    body = opciones.archivo;
  } else if (opciones.body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opciones.body);
  }
  if (opciones.registro) headers["X-Registro-Token"] = envio.token;

  let respuesta;
  try {
    respuesta = await fetch(ZONA_PROVEEDORES_API_URL + ruta, {
      method: opciones.method || "GET",
      headers: headers,
      body: body,
    });
  } catch (error) {
    throw new ErrorApi(0, "No hay conexión con el servidor. Intenta de nuevo.");
  }
  const datos = respuesta.status === 204 ? {} : await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    // Retry-After sólo se puede leer si el CORS del backend lo expone; si no, se usa LIMITE_ESPERA_MS.
    const reintentarEn = Number(respuesta.headers.get("Retry-After"));
    throw new ErrorApi(
      respuesta.status,
      datos.message || "Algo salió mal (" + respuesta.status + "). Intenta de nuevo.",
      datos.details,
      reintentarEn > 0 ? reintentarEn * 1000 : null,
    );
  }
  return datos;
}

/* ------------------------------  Catálogo del formulario  ----------------------------- */

/** Reemplaza las opciones de un select (deja la primera, "Selecciona…"). Acepta textos o { valor, texto }. */
function llenarSelect(select, opciones) {
  const anterior = select.value;
  while (select.options.length > 1) select.remove(1);
  opciones.forEach(function (o) {
    const valor = typeof o === "string" ? o : o.valor;
    select.appendChild(new Option(typeof o === "string" ? o : o.texto, valor));
  });
  select.value = anterior;
  if (select.selectedIndex < 0) select.selectedIndex = 0;
}

async function cargarCatalogo() {
  const aviso = document.getElementById("errorCatalogo");
  aviso.style.display = "none";
  document.getElementById("boton").disabled = true;
  try {
    catalogo = await llamarApi("/formulario");
  } catch (error) {
    document.getElementById("errorCatalogoTexto").textContent = "No se pudo cargar el formulario: " + error.message;
    aviso.style.display = "";
    return;
  }
  tokenFormulario = catalogo.token;
  tokenFormularioEn = Date.now();

  llenarSelect(document.getElementById("t_registro"), catalogo.tiposRegistro);
  llenarSelect(document.getElementById("t_empresa"), catalogo.tiposEmpresa);
  llenarSelect(document.getElementById("t_identificacion"), catalogo.tiposIdentificacion);
  llenarSelect(document.getElementById("moneda"), catalogo.monedas);
  llenarSelect(document.getElementById("tipoactividad"), catalogo.tiposActividad);
  [
    ["condicionPagoNacional", catalogo.condicionesPago.nacional],
    ["condicionPago", catalogo.condicionesPago.exterior],
  ].forEach(function (par) {
    llenarSelect(
      document.getElementById(par[0]),
      par[1].map(function (c) {
        return { valor: c.id, texto: c.texto };
      }),
    );
  });
  document.getElementById("textoAutorizacion").textContent = catalogo.autorizacionDatos.texto;

  configurarInputsDeArchivo();
  actualizarCondicionPago();
  actualizarContactoProgen();
  actualizarDocumentos();
  document.getElementById("boton").disabled = false;
}

/** Un token del formulario crea un solo registro: para otro registro se pide uno nuevo. */
async function renovarToken() {
  const nuevo = await llamarApi("/formulario");
  tokenFormulario = nuevo.token;
  tokenFormularioEn = Date.now();
}

/* -------------------------------------  Mensajes  ------------------------------------- */

function mostrarMensaje(tipo, titulo, texto, lista, opciones) {
  const colores = { error: "#ff3c37", exito: "#6EF05F", cargando: "#4040ff" };
  document.getElementById("headermensaje").style.background = colores[tipo];
  document.getElementById("titulomensaje").textContent = titulo;
  document.getElementById("botonRecargar").style.display = opciones && opciones.recargar ? "" : "none";
  const cuerpo = document.getElementById("mensaje");
  cuerpo.innerHTML = "";
  if (tipo === "cargando") {
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    cuerpo.appendChild(spinner);
  }
  const parrafo = document.createElement("span");
  parrafo.style.paddingLeft = tipo === "cargando" ? "10px" : "";
  parrafo.textContent = texto;
  cuerpo.appendChild(parrafo);
  if (lista && lista.length) {
    const ul = document.createElement("ul");
    ul.className = "mt-2 mb-0";
    lista.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    cuerpo.appendChild(ul);
  }
  $("#exampleModal").modal("show");
}

function mostrarError(texto, lista, opciones) {
  mostrarMensaje("error", "ERROR", texto, lista, opciones);
}

/** Cierra el modal; si aún se está abriendo (Bootstrap ignora el hide), lo cierra al terminar. */
function cerrarMensaje() {
  const modal = $("#exampleModal");
  const cerrar = function () {
    modal.modal("hide");
  };
  modal.one("shown.bs.modal", cerrar);
  modal.one("hidden.bs.modal", function () {
    modal.off("shown.bs.modal", cerrar);
  });
  cerrar();
}

function mostrarConfirmacion(numero) {
  cerrarMensaje();
  document.getElementById("formulario").style.display = "none";
  document.getElementById("numeroRegistro").textContent = numero;
  document.getElementById("confirmacion").style.display = "";
  window.scrollTo(0, 0);
}

/* ------------------------------------  Envío  --------------------------------------- */

/** Cuerpo de POST /: sólo los campos que el contrato pide para el caso. */
function datosRegistro() {
  const datos = {
    token: tokenFormulario,
    sitioWeb: document.getElementById("sitioWeb").value,
    aceptaTratamientoDatos: document.getElementById("aceptaTratamientoDatos").checked,
    tipoRegistro: valorCampo("tipoRegistro"),
    tipoEmpresa: valorCampo("tipoEmpresa"),
    pais: valorCampo("pais"),
    ciudad: valorCampo("ciudad"),
    nombre: valorCampo("nombre"),
    contactoNombre: valorCampo("contactoNombre"),
    contactoTelefono: valorCampo("contactoTelefono"),
    contactoCorreo: valorCampo("contactoCorreo"),
  };
  if (esExterior()) {
    datos.direccion = valorCampo("direccion");
    datos.contactoCargo = valorCampo("contactoCargo");
    datos.moneda = valorCampo("moneda");
    datos.tipoActividad = valorCampo("tipoActividad");
  } else {
    datos.tipoIdentificacion = valorCampo("tipoIdentificacion");
    datos.numeroIdentificacion = valorCampo("numeroIdentificacion");
    if (datos.tipoIdentificacion === "NIT") datos.digitoVerificacion = valorCampo("digitoVerificacion");
  }
  if (esInscripcion()) datos.condicionPagoId = valorCampo("condicionPagoId");
  if (!esTaller()) datos.contactoProgenId = valorCampo("contactoProgenId");
  return datos;
}

/** Crea el borrador, o reusa el de un intento anterior si los datos no cambiaron. */
async function crearBorrador() {
  const datos = datosRegistro();
  const huella = JSON.stringify(Object.assign({}, datos, { token: null }));
  if (envio && envio.datos === huella) return;
  if (envio || Date.now() - tokenFormularioEn > RENOVAR_TOKEN_MS) {
    // Cambiaron los datos tras un intento fallido: es otro registro. El borrador anterior lo borra el backend.
    await renovarToken();
    datos.token = tokenFormulario;
    Object.keys(estadoArchivos).forEach(function (nombre) {
      estadoArchivos[nombre].subido = null;
      estadoArchivos[nombre].pendiente = null;
    });
  }
  const espera = TOKEN_ESPERA_MINIMA_MS - (Date.now() - tokenFormularioEn);
  if (espera > 0) await pausa(espera);
  // 201 crea el borrador; 200 es un reintento con el mismo token y devuelve el mismo borrador.
  const r = await llamarApi("/", { method: "POST", body: datos });
  envio = { numero: r.numero, token: r.token, datos: huella };
}

/** Quita del borrador un adjunto que quedó a medias, para no ocupar cupo. Si ya no existe, no importa. */
function descartarAdjunto(adjuntoId) {
  llamarApi("/" + envio.numero + "/adjuntos/" + adjuntoId, { method: "DELETE", registro: true }).catch(function () {});
}

/** La IA rechazó el archivo: 400 de /confirmar con el detalle de las reglas. El backend ya lo borró. */
function esRechazoIa(error) {
  const d = error.detalles;
  return error.status === 400 && !!d && !Array.isArray(d) && (!!d.reglas || d.field === "archivo");
}

/** POST .../confirmar; ante un 429 espera la ventana del límite (con cuenta regresiva) y reintenta. */
async function confirmarConEspera(input, adjuntoId, avisar) {
  const ruta = "/" + envio.numero + "/adjuntos/" + adjuntoId + "/confirmar";
  for (let intento = 0; ; intento++) {
    pintarEstado(input, usaIa(input) ? "verificando" : "subiendo");
    avisar(usaIa(input) ? "Verificando con IA" : "Confirmando");
    try {
      return await llamarApi(ruta, { method: "POST", registro: true });
    } catch (error) {
      if (error.status !== 429 || intento >= LIMITE_REINTENTOS) throw error;
      for (let s = Math.ceil((error.reintentarEnMs || LIMITE_ESPERA_MS) / 1000); s > 0; s--) {
        const texto = "Muchas verificaciones seguidas; reintento en " + s + " s…";
        pintarEstado(input, "esperando", texto);
        avisar("Esperando para verificar", "(" + texto + ")");
        await pausa(1000);
      }
    }
  }
}

/**
 * Registra el archivo, lo sube (al backend o directo a S3) y lo confirma. Si ya
 * estaba subido sin confirmar (p. ej. tras un 429), sólo reintenta la confirmación.
 * `avisar(fase, detalle)` muestra el progreso; un rechazo de la IA lanza `error.rechazoIa`.
 */
async function subirDocumento(input, avisar) {
  avisar = avisar || function () {};
  const estado = estadoArchivos[input.name];
  const file = input.files[0];
  if (estado.subido && estado.subido.archivo === file) return;

  if (!estado.pendiente || estado.pendiente.archivo !== file) {
    if (estado.pendiente) descartarAdjunto(estado.pendiente.adjuntoId);
    estado.pendiente = null;
    const pedido = {
      categoria: categoriaPorCampo[input.name],
      nombre: file.name,
      tipoContenido: file.type,
      tamano: file.size,
    };
    if (estado.subido) pedido.reemplazaId = estado.subido.adjuntoId;

    pintarEstado(input, "subiendo");
    avisar("Subiendo");
    const ruta = "/" + envio.numero + "/adjuntos";
    const subida = await llamarApi(ruta, { method: "POST", body: pedido, registro: true });
    try {
      if (SUBIDA_POR_BACKEND) {
        await llamarApi(ruta + "/" + subida.adjuntoId + "/archivo", { method: "PUT", archivo: file, registro: true });
      } else {
        let respuesta;
        try {
          respuesta = await fetch(subida.url, { method: subida.metodo, headers: subida.encabezados, body: file });
        } catch (error) {
          respuesta = null;
        }
        if (!respuesta || !respuesta.ok)
          throw new ErrorApi(respuesta ? respuesta.status : 0, "No se pudo subir el archivo. Intenta de nuevo.");
      }
    } catch (error) {
      descartarAdjunto(subida.adjuntoId);
      throw error;
    }
    estado.pendiente = { archivo: file, adjuntoId: subida.adjuntoId };
  }

  const adjuntoId = estado.pendiente.adjuntoId;
  let confirmado;
  try {
    confirmado = await confirmarConEspera(input, adjuntoId, avisar);
  } catch (error) {
    // Sin conexión, 429 agotado o falla del servidor: el archivo ya está arriba; se reintenta sólo la confirmación.
    if (error.status === 0 || error.status === 429 || error.status >= 500) throw error;
    estado.pendiente = null;
    // Un 400 de /confirmar ya borró el archivo (no coincide o lo rechazó la IA); otro error lo deja a medias.
    if (error.status !== 400) descartarAdjunto(adjuntoId);
    error.rechazoIa = esRechazoIa(error);
    throw error;
  }
  estado.pendiente = null;
  estado.subido = { archivo: file, adjuntoId: adjuntoId, validacionIa: confirmado.validacionIa || null };
}

function bloquearEnvio(bloquear) {
  enviando = bloquear;
  document.getElementById("boton").disabled = bloquear;
}

async function submitForm() {
  if (enviando || !catalogo) return;
  if (!validaciones()) return;
  bloquearEnvio(true);
  let documentoActual = null;
  try {
    mostrarMensaje("cargando", "Cargando", "Creando la solicitud...");
    await crearBorrador();

    const pendientes = inputsDelCaso().filter(function (input) {
      const estado = estadoArchivos[input.name];
      return input.files[0] && !(estado.subido && estado.subido.archivo === input.files[0]);
    });
    // Un rechazo de la IA no detiene los demás archivos; al final se pide otro para cada uno.
    const rechazados = [];
    for (let i = 0; i < pendientes.length; i++) {
      documentoActual = pendientes[i];
      const etiqueta = documentoDe(documentoActual).label;
      const avisar = function (fase, detalle) {
        const texto = fase + " " + (i + 1) + " de " + pendientes.length + ": " + etiqueta + "…";
        mostrarMensaje("cargando", "Cargando", detalle ? texto + " " + detalle : texto);
      };
      try {
        await subirDocumento(documentoActual, avisar);
        pintarEstado(documentoActual, "listo");
      } catch (error) {
        if (!error.rechazoIa) throw error;
        rechazarArchivo(documentoActual, error.message);
        rechazados.push(error.message);
      }
    }
    documentoActual = null;
    if (rechazados.length) {
      mostrarError(
        "Algunos documentos no pasaron la verificación. Elige otro archivo para cada uno y vuelve a enviar.",
        rechazados,
      );
      return;
    }

    mostrarMensaje("cargando", "Cargando", "Enviando la solicitud...");
    const enviado = await llamarApi("/" + envio.numero + "/enviar", { method: "POST", registro: true });
    mostrarConfirmacion(enviado.numero);
  } catch (error) {
    manejarErrorEnvio(error, documentoActual);
  } finally {
    bloquearEnvio(false);
  }
}

/** Vuelve a subir sólo ese archivo, sobre el mismo borrador. */
async function reintentarArchivo(input) {
  if (enviando) return;
  if (!envio || !input.files[0]) return submitForm();
  bloquearEnvio(true);
  try {
    await subirDocumento(input);
    pintarEstado(input, "listo");
  } catch (error) {
    if (error.rechazoIa) {
      rechazarArchivo(input, error.message);
      mostrarError(error.message, ["Elige otro archivo para ese documento y vuelve a enviar."]);
    } else manejarErrorEnvio(error, input);
  } finally {
    bloquearEnvio(false);
  }
}

function manejarErrorEnvio(error, documentoActual) {
  console.error("Error en el envío del registro:", error);
  const detalles = error.detalles;

  // El token del registro venció o el borrador ya no existe: el próximo intento lo recupera o crea otro.
  if (error.status === 404) envio = null;

  // Falló la subida de un archivo: se reintenta sólo ese, sin volver a crear el registro.
  if (documentoActual) {
    pintarEstado(documentoActual, "error", error.message);
    if (error.status !== 404) {
      mostrarError(
        "No se pudo subir «" + documentoDe(documentoActual).label + "»: " + error.message,
        ["Usa «Reintentar» en ese documento o vuelve a pulsar «Enviar Registro»."],
      );
      return;
    }
  }

  // El token del formulario venció: hay que recargar la página.
  if (error.status === 400 && /venci/i.test(error.message)) {
    mostrarError(error.message, null, { recargar: true });
    return;
  }

  // Documentos faltantes: se marcan para subirlos y volver a enviar.
  if (error.status === 409 && detalles && Array.isArray(detalles.faltantes)) {
    marcarFaltantes(detalles.faltantes);
    mostrarError(error.message, detalles.faltantes.map(etiquetaDocumento));
    return;
  }

  // Errores de un campo: `details` es [{ field, message }] (validación) o { field } (regla del backend).
  if (detalles) {
    const lista = Array.isArray(detalles) ? detalles : [Object.assign({ message: error.message }, detalles)];
    const mensajes = [];
    lista.forEach(function (d) {
      if (!d) return;
      if (d.field) marcarCampo(d.field, d.message || error.message);
      if (d.message && d.message !== error.message && !mensajes.includes(d.message)) mensajes.push(d.message);
    });
    mostrarError(error.message, mensajes);
    return;
  }

  mostrarError(error.message);
}

$(document).ready(cargarCatalogo);
