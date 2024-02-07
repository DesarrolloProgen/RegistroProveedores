/* ------------------------------------------------------------------------------------- */
/*                                       VARIABLES                                       */
/* ------------------------------------------------------------------------------------- */
var tipo_registro = document.getElementById("t_registro");
var tipo_empresa = document.getElementById("t_empresa");
var tipo_proveedor = document.getElementById("t_proveedor");

/* Variables Provedores nivel 1 y 2*/

var tipo_identificacion = document.getElementById("t_identificacion");
var cedula = document.getElementById("cc");
var numeroNIT = document.getElementById("numeroNIT");
var codigoNIT = document.getElementById("codigoNIT");
var nit = numeroNIT.value + "-" + codigoNIT.value;
var nombre_usuario = document.getElementById("nombreUsuario");
var nombre_contacto_nivel = document.getElementById("nombreContacto1");
var telefono_contacto_nivel = document.getElementById("telefonoContacto1");
var email_contacto_nivel = document.getElementById("correoContacto1");
var plazo_pago_nivel = document.getElementById("plazoPago1");
console.log(nit);

/*Variables Proveedores Externos */

var razon_social = document.getElementById("razon_social");
var direccion = document.getElementById("direccion")
var ciudad = document.getElementById("ciudad");
var pais = document.getElementById("pais");
var nombre_contacto_externo = document.getElementById("nombreContacto");
var telefono_contacto_externo = document.getElementById("telefonoContacto");
var email_contacto_externo = document.getElementById("correoContacto");
var cargo = document.getElementById("cargo");
var moneda = document.getElementById("moneda");
var plazoPago = document.getElementById("plazoPago");
var tipoactividad = document.getElementById("tipoactividad");

/* Variables de contacto con PROGEN*/

var nombre_contactoProgen = document.getElementById("nombreContactoProgen");
var email_contactoProgen = document.getElementById("emailContacto");

/* Variables para el cargue de archivos */

var natural = [];
var juridica = [];

const PersonaNatural = {
  FormularioNatural: "Formulario registro",
  copiacedula: "Copia de Cedula",
  copiaRut: "Copia Rut",
  certBancariaNatural: "Certificacion Bancaria",
  certificaciones: "Certificaciones"
}

const PersonaJuridica = {
  Formulariojuridico: "Formulario registro",
  certificadoExistencia: "Camara y Comercio",
  representanteLegal: "Copia de Cedula",
  RUT: "Copia Rut",
  certBancariaJuridica: "Certificacion Bancaria",
  certBASC: "Certificaciones"
}

/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */

/* Validacion de Email general */

function validar_email(email) {
  let regex = /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email) ? true : false;
}

/* Validacion de Email empresarial */

function validar_email_progen(email) {
  let regex1 = /([a-zA-Z0-9_\.\-])+\@((progen)+\.)+(com+\.)+(co)/;
  let regex2 = /([a-zA-Z0-9_\.\-])+\@((royalcondor)+\.)+(com)/;
  let regex3 = /([a-zA-Z0-9_\.\-])+\@((colinagro)+\.)+(com+\.)+(co)/;
  return regex1.test(email) || regex2.test(email) || regex3.test(email) ? true : false;
}

function validaciones() {
  if (tipo_registro.value == "" || tipo_registro.value == "Selecciona una opción" || tipo_registro.value == null) {
    document.getElementById("headermensaje").style.background = '#ff3c37';
    document.getElementById('titulomensaje').innerHTML = 'ERROR';
    document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de Registro';
    return false;
  }

  if (tipo_empresa.value == "" || tipo_empresa.value == "Selecciona una opción" || tipo_empresa.value == null) {
    document.getElementById("headermensaje").style.background = '#ff3c37';
    document.getElementById('titulomensaje').innerHTML = 'ERROR';
    document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de empresa';
    return false;
  }
  if (tipo_proveedor.value == "" || tipo_proveedor.value == "Selecciona una opción" || tipo_proveedor.value == null) {
    document.getElementById("headermensaje").style.background = '#ff3c37';
    document.getElementById('titulomensaje').innerHTML = 'ERROR';
    document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de Proveedor';
    return false;
  }

  /* Validaciones Proveedor Nivel 1 y 2 */

  if (tipo_proveedor.value == "Proveedor Nivel 1" || tipo_proveedor.value == "Proveedor Nivel 2") {

    if (tipo_identificacion.value == "" || tipo_identificacion.value == "Selecciona una opción" || tipo_identificacion.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de identificación';
      return false;
    }

    if (tipo_identificacion.value == "CC" && (cedula.value == null || cedula.value == "" || isNaN(parseInt(cedula.value)))) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar su numero de cédula (Solo se aceptan números)';
      return false;
    }

    if (tipo_identificacion.value == "NIT" && (numeroNIT.value == null || numeroNIT.value == "" || isNaN(parseInt(numeroNIT.value)))) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar su numero de NIT (Solo se aceptan números)';
      return false;
    }

    if (tipo_identificacion.value == "NIT" && (codigoNIT.value == null || codigoNIT.value == "" || isNaN(parseInt(codigoNIT.value)))) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar su codigo de verificación del NIT (Solo se aceptan números)';
      return false;
    }

    console.log(numeroNIT.value);
console.log(codigoNIT.value);
    if (nombre_usuario.value == "" || nombre_usuario.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar su nombre';
      return false;
    }

    if (nombre_contacto_nivel.value == "" || nombre_contacto_nivel.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar un nombre de contacto';
      return false;
    }

    if (telefono_contacto_nivel.value == "" || telefono_contacto_nivel.value == null || isNaN(parseInt(telefono_contacto_nivel.value))) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar un telefono de contacto';
      return false;
    }

    if (email_contacto_nivel.value == "" || email_contacto_nivel.value == null || validar_email(email_contacto_nivel.value) == false) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar el email de la persona de contacto';
      return false;
    }

    if (plazo_pago_nivel.value == "" || plazo_pago_nivel.value == null || plazo_pago_nivel.value == "Selecciona una opción") {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe seleccionar un metodo de pago';
      return false;
    }

    /* Validaciones de Documentos obligatorios para Persona Natural */
    if (tipo_empresa.value == "Persona Natural") {
      let obligatoriosNatural = document.querySelectorAll("#Persona_Natural input[required]");
      console.log(obligatoriosNatural);
      for (let i = 0; i < obligatoriosNatural.length; i++) {
        if (!(natural.find((archivo) => archivo.archivo === PersonaNatural[obligatoriosNatural[i].name]))) {
          document.getElementById("headermensaje").style.background = '#ff3c37';
          document.getElementById('titulomensaje').innerHTML = 'ERROR';
          document.getElementById('mensaje').innerHTML = 'Debe subir un archivo para el documento ' + PersonaNatural[obligatoriosNatural[i].name];
          return false;
        }
      }
    } else {
      let obligatoriosJuridica = document.querySelectorAll("#Persona_Juridica input[required]");
      console.log(obligatoriosJuridica);
      for (let i = 0; i < obligatoriosJuridica.length; i++) {
        if (!(juridica.find((archivo) => archivo.archivo === PersonaJuridica[obligatoriosJuridica[i].name]))) {
          document.getElementById("headermensaje").style.background = '#ff3c37';
          document.getElementById('titulomensaje').innerHTML = 'ERROR';
          document.getElementById('mensaje').innerHTML = 'Debe subir un archivo para el documento ' + PersonaJuridica[obligatoriosJuridica[i].name];
          return false;
        }
      }
    }
  }

  /* Validaciones Proveedor Exterior */

  if (tipo_proveedor.value == "Proveedor Exterior") {
    if (razon_social.value == "" || razon_social.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar el nombre de la razón Social';
      return false;
    }

    if (direccion.value == "" || direccion.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar una dirección';
      return false;
    }

    if (ciudad.value == "" || ciudad.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar una ciudad';
      return false;
    }

    if (pais.value == "" || pais.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar un país';
      return false;
    }

    if (nombre_contacto_externo.value == "" || nombre_contacto_externo.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar un nombre de contacto';
      return false;
    }

    if (telefono_contacto_externo.value == "" || telefono_contacto_externo.value == null || isNaN(parseInt(telefono_contacto_externo.value))) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar el telefono de la persona de contacto (Solo se aceptan números)';
      return false;
    }

    if (email_contacto_externo.value == "" || email_contacto_externo.value == null || validar_email(email_contacto_externo.value) == false) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar el correo de la persona de contacto';
      return false;
    }

    if (cargo.value == "" || cargo.value == null) {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe ingresar un cargo';
      return false;
    }

    if (moneda.value == "" || moneda.value == null || moneda.value == "Selecciona una opción") {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de moneda ';
      return false;
    }
    if (plazoPago.value == "" || plazoPago.value == null || plazoPago.value == "Selecciona una opción") {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe seleccionar un plazo de pago ';
      return false;
    }

    if (tipoactividad.value == "" || tipoactividad.value == null || tipoactividad == "Selecciona una opción") {
      document.getElementById("headermensaje").style.background = '#ff3c37';
      document.getElementById('titulomensaje').innerHTML = 'ERROR';
      document.getElementById('mensaje').innerHTML = 'Debe seleccionar un tipo de actividad ';
      return false;
    }
  }

  if (nombre_contactoProgen.value == "" || nombre_contactoProgen.value == null) {
    document.getElementById("headermensaje").style.background = '#ff3c37';
    document.getElementById('titulomensaje').innerHTML = 'ERROR';
    document.getElementById('mensaje').innerHTML = 'Debe ingresar Nombre de la persona de contacto en Progen';
    return false;
  }
  if (email_contactoProgen.value == "" || email_contactoProgen.value == null) {
    document.getElementById("headermensaje").style.background = '#ff3c37';
    document.getElementById('titulomensaje').innerHTML = 'ERROR';
    document.getElementById('mensaje').innerHTML = 'Debe ingresar el email de la persona de contacto en Progen';
    return false;
  }

  submitForm()
}