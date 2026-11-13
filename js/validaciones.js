/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */
/* Revisan en el navegador lo mismo que exige el backend (registroPublicoSchema), para
   avisar antes de enviar. Son sólo una ayuda: el backend vuelve a validar todo y su
   `message` es el que manda. */

const PESOS_DV = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

/** Dígito de verificación de la DIAN para un NIT (sólo los dígitos, sin el DV). */
function calcularDV(nit) {
  const digitos = nit.replace(/\D/g, "").split("").reverse();
  const suma = digitos.reduce(function (total, d, i) {
    return total + Number(d) * (PESOS_DV[i] || 0);
  }, 0);
  const residuo = suma % 11;
  return residuo > 1 ? 11 - residuo : residuo;
}

/* Validacion de Email general */

function validar_email(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validar_telefono(telefono) {
  return /^\+?[\d\s()-]{7,20}$/.test(telefono);
}

/* ------------------------------------------------------------------------------------- */
/*                         CAMPOS DEL CONTRATO → ELEMENTOS DEL HTML                       */
/* ------------------------------------------------------------------------------------- */

/** Para el caso actual, el id del elemento de cada campo de POST /. */
function camposDelCaso() {
  const campos = {
    tipoRegistro: "t_registro",
    tipoEmpresa: "t_empresa",
    pais: "pais",
    contactoProgenId: "nombreContactoProgen",
    aceptaTratamientoDatos: "aceptaTratamientoDatos",
  };
  if (esExterior()) {
    return Object.assign(campos, {
      ciudad: "ciudadExterior",
      nombre: "nombreProveedorExterior",
      direccion: "direccion",
      contactoNombre: "nombreContacto",
      contactoTelefono: "telefonoContacto",
      contactoCorreo: "correoContacto",
      contactoCargo: "cargo",
      moneda: "moneda",
      tipoActividad: "tipoactividad",
      condicionPagoId: "condicionPago",
    });
  }
  const nit = document.getElementById("t_identificacion").value === "NIT";
  return Object.assign(campos, {
    ciudad: "ciudad",
    nombre: "nombreUsuario",
    tipoIdentificacion: "t_identificacion",
    numeroIdentificacion: nit ? "numeroNIT" : "cc",
    digitoVerificacion: "codigoNIT",
    contactoNombre: "nombreContacto1",
    contactoTelefono: "telefonoContacto1",
    contactoCorreo: "correoContacto1",
    condicionPagoId: "condicionPagoNacional",
  });
}

function valorCampo(campo) {
  const id = camposDelCaso()[campo];
  return id ? document.getElementById(id).value.trim() : "";
}

/* ------------------------------------------------------------------------------------- */
/*                               MARCAS JUNTO A LOS CAMPOS                                */
/* ------------------------------------------------------------------------------------- */

function limpiarMarcas() {
  document.querySelectorAll("#formulario .is-invalid").forEach(function (el) {
    el.classList.remove("is-invalid");
  });
  document.querySelectorAll("#formulario .mensaje-campo").forEach(function (el) {
    el.remove();
  });
}

/** Marca un campo de POST / (`details[].field` del backend) con su mensaje. */
function marcarCampo(campo, mensaje) {
  const id = camposDelCaso()[campo];
  const el = id && document.getElementById(id);
  if (!el) return false;
  /* Los desplegables con buscador (Select2) se ven en su contenedor */
  const visible = $(el).hasClass("select2-hidden-accessible")
    ? el.nextElementSibling.querySelector(".select2-selection")
    : el;
  visible.classList.add("is-invalid");
  const casilla = el.closest(".form-check");
  const fila = casilla || el.closest(".row");
  if (fila.querySelector('.mensaje-campo[data-campo="' + campo + '"]')) return true;
  const aviso = document.createElement("div");
  aviso.className = casilla ? "mensaje-campo" : "mensaje-campo col-md-9 offset-md-3";
  aviso.setAttribute("data-campo", campo);
  aviso.textContent = mensaje;
  fila.appendChild(aviso);
  return true;
}

/* Al corregir un campo se quita su marca */
$(document).on("input change", "#formulario", function (e) {
  const el = e.target;
  if (!el || !el.id) return;
  el.classList.remove("is-invalid");
  if (el.nextElementSibling && el.nextElementSibling.querySelector) {
    const select2 = el.nextElementSibling.querySelector(".select2-selection");
    if (select2) select2.classList.remove("is-invalid");
  }
  const campo = Object.keys(camposDelCaso()).find(function (c) {
    return camposDelCaso()[c] === el.id;
  });
  if (campo) {
    document.querySelectorAll('.mensaje-campo[data-campo="' + campo + '"]').forEach(function (aviso) {
      aviso.remove();
    });
  }
});

/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */

/** Los problemas de los datos: [{ campo, mensaje }]. Vacío si están completos. */
function problemasEnDatos() {
  const problemas = [];
  const problema = function (campo, mensaje) {
    problemas.push({ campo: campo, mensaje: mensaje });
  };
  const vacio = function (campo) {
    return valorCampo(campo) === "";
  };

  if (vacio("tipoRegistro")) problema("tipoRegistro", "Elige si es inscripción o actualización.");
  if (vacio("tipoEmpresa")) problema("tipoEmpresa", "Elige el tipo de empresa.");
  if (vacio("pais")) {
    problema("pais", "Elige el país.");
    return problemas;
  }
  if (vacio("ciudad")) problema("ciudad", "Escribe la ciudad.");

  if (esExterior()) {
    if (vacio("nombre")) problema("nombre", "Escribe el nombre o la razón social.");
    if (vacio("direccion")) problema("direccion", "Escribe la dirección.");
  } else {
    const tipo = valorCampo("tipoIdentificacion");
    const numero = valorCampo("numeroIdentificacion");
    if (!tipo) problema("tipoIdentificacion", "Elige el tipo de identificación.");
    else if (!/^\d{5,20}$/.test(numero))
      problema("numeroIdentificacion", "Escribe el número de identificación sin el dígito de verificación.");
    else if (tipo === "NIT") {
      const dv = valorCampo("digitoVerificacion");
      if (!/^\d$/.test(dv)) problema("digitoVerificacion", "El dígito de verificación es un solo número.");
      else if (String(calcularDV(numero)) !== dv)
        problema("digitoVerificacion", "El dígito de verificación no corresponde al NIT; revísalo.");
    }
    if (vacio("nombre")) problema("nombre", "Escribe el nombre o la razón social.");
  }

  if (vacio("contactoNombre")) problema("contactoNombre", "Escribe el nombre de contacto.");
  if (!validar_telefono(valorCampo("contactoTelefono")))
    problema("contactoTelefono", "Escribe un teléfono de contacto válido.");
  if (!validar_email(valorCampo("contactoCorreo"))) problema("contactoCorreo", "El correo no es válido.");

  if (esExterior()) {
    if (vacio("contactoCargo")) problema("contactoCargo", "Escribe el cargo de la persona de contacto.");
    if (vacio("moneda")) problema("moneda", "Elige la moneda.");
    if (vacio("tipoActividad")) problema("tipoActividad", "Elige el tipo de actividad.");
  }
  if (esInscripcion() && vacio("condicionPagoId")) problema("condicionPagoId", "Elige la condición de pago.");
  if (!esTaller() && vacio("contactoProgenId")) problema("contactoProgenId", "Elige tu contacto en PROGEN.");
  if (!document.getElementById("aceptaTratamientoDatos").checked)
    problema("aceptaTratamientoDatos", "Debes autorizar el tratamiento de tus datos personales.");
  return problemas;
}

/** Categorías requeridas del caso que no tienen archivo elegido ni subido. */
function documentosSinArchivo() {
  const caso = casoActual();
  if (!caso) return [];
  const conArchivo = inputsDelCaso()
    .filter(function (input) {
      return (input.files && input.files[0]) || estadoArchivos[input.name].subido;
    })
    .map(function (input) {
      return categoriaPorCampo[input.name];
    });
  return caso.requeridos.filter(function (categoria) {
    return !conArchivo.includes(categoria);
  });
}

/** Revisa el formulario, marca lo que falta y lo muestra. true si se puede enviar. */
function validaciones() {
  limpiarMarcas();
  const problemas = problemasEnDatos();
  problemas.forEach(function (p) {
    marcarCampo(p.campo, p.mensaje);
  });
  const mensajes = problemas.map(function (p) {
    return p.mensaje;
  });
  /* Tamaño y tipo otra vez antes de subir: el caso pudo cambiar después de elegir el archivo */
  inputsDelCaso().forEach(function (input) {
    const file = input.files[0];
    const problema = file && problemaConArchivo(file, input);
    if (!problema) return;
    pintarEstado(input, "rechazado", problema);
    mensajes.push(documentoDe(input).label + ": " + problema);
  });
  const faltantes = documentosSinArchivo();
  marcarFaltantes(faltantes);

  if (faltantes.length) {
    mensajes.push("Faltan documentos obligatorios: " + faltantes.map(etiquetaDocumento).join(", ") + ".");
  }
  if (mensajes.length === 0) return true;
  mostrarError("Revisa los datos marcados en el formulario.", mensajes);
  return false;
}
