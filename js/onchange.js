/* ------------------------------------------------------------------------------------- */
/*                                 FUNCIONES ONCHAGE                                     */
/* ------------------------------------------------------------------------------------- */
/* Funciones Onchange para las condiciones de mostrar diferentes 
                                     DIV dependiendo de selecciones por parte del usuario*/

/*                       CONTACTO PROGEN: AUTOCOMPLETAR EMAIL                            */
function contactoProgenOnchange(selected) {
  document.getElementById("emailContacto").value = CONTACTOS_PROGEN[selected.value] || "";
}

/*                            DEPENDIENTO DEL TIPO DE PERSONA                            */
function tipopersonaOnchange(selected) {
  divNatural = document.getElementById("Persona_Natural");
  divJuridica = document.getElementById("Persona_Juridica");
  divTaller = document.getElementById("Taller_Servicio");
  if (selected.value == "Persona Natural") {
    divNatural.style.display = "";
    divJuridica.style.display = "none";
    divTaller.style.display = "none";
    document.getElementsByName("FormularioNatural")[0].required = true;
    document.getElementsByName("copiacedula")[0].required = true;
    document.getElementsByName("copiaRut")[0].required = true;
    document.getElementsByName("certBancariaNatural")[0].required = true;
    document.getElementsByName("Formulariojuridico")[0].required = false;
    document.getElementsByName("certificadoExistencia")[0].required = false;
    document.getElementsByName("representanteLegal")[0].required = false;
    document.getElementsByName("RUT")[0].required = false;
    document.getElementsByName("certBancariaJuridica")[0].required = false;
    document.getElementsByName("acuerdoTrabajo")[0].required = false;
    document.getElementsByName("cedulaRutTaller")[0].required = false;
    document.getElementsByName("certBancariaTaller")[0].required = false;
  } else if (selected.value == "Persona Jurídica") {
    divNatural.style.display = "none";
    divJuridica.style.display = "";
    divTaller.style.display = "none";
    document.getElementsByName("Formulariojuridico")[0].required = true;
    document.getElementsByName("certificadoExistencia")[0].required = true;
    document.getElementsByName("representanteLegal")[0].required = true;
    document.getElementsByName("RUT")[0].required = true;
    document.getElementsByName("certBancariaJuridica")[0].required = true;
    document.getElementsByName("FormularioNatural")[0].required = false;
    document.getElementsByName("copiacedula")[0].required = false;
    document.getElementsByName("copiaRut")[0].required = false;
    document.getElementsByName("certBancariaNatural")[0].required = false;
    document.getElementsByName("acuerdoTrabajo")[0].required = false;
    document.getElementsByName("cedulaRutTaller")[0].required = false;
    document.getElementsByName("certBancariaTaller")[0].required = false;
  } else if (selected.value == "Taller de Servicio/Mecánico aliado") {
    divNatural.style.display = "none";
    divJuridica.style.display = "none";
    divTaller.style.display = "";
    document.getElementsByName("acuerdoTrabajo")[0].required = true;
    document.getElementsByName("cedulaRutTaller")[0].required = true;
    document.getElementsByName("certBancariaTaller")[0].required = true;
    document.getElementsByName("FormularioNatural")[0].required = false;
    document.getElementsByName("copiacedula")[0].required = false;
    document.getElementsByName("copiaRut")[0].required = false;
    document.getElementsByName("certBancariaNatural")[0].required = false;
    document.getElementsByName("Formulariojuridico")[0].required = false;
    document.getElementsByName("certificadoExistencia")[0].required = false;
    document.getElementsByName("representanteLegal")[0].required = false;
    document.getElementsByName("RUT")[0].required = false;
    document.getElementsByName("certBancariaJuridica")[0].required = false;
  }
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

function paisOnchange(selected) {
  const divcontacto = document.getElementById("contacto");
  const divexterior = document.getElementById("exterior");
  const divnivel = document.getElementById("contacto_nivel_1_2");
  const divarchivos = document.getElementById("archivos");
  const divarchivosExterior = document.getElementById("archivosExterior");
  const divdatos = document.getElementById("datos");
  const filaCiudadColombia = document.getElementById("filaCiudadColombia");
  const tipoProveedor = document.getElementById("t_proveedor");

  const esColombia = selected.value === "COLOMBIA";

  if (esColombia) {
    /* ----------------------------- PROVEEDOR NACIONAL ----------------------------- */
    tipoProveedor.value = "Proveedor Nacional";

    filaCiudadColombia.style.display = "";
    divcontacto.style.display = "";
    divnivel.style.display = "";
    divarchivos.style.display = "";
    divdatos.style.display = "";

    divexterior.style.display = "none";
    divarchivosExterior.style.display = "none";
  } else {
    /* ----------------------------- PROVEEDOR EXTERIOR ----------------------------- */
    tipoProveedor.value = "Proveedor Exterior";

    filaCiudadColombia.style.display = "none";
    divcontacto.style.display = "";
    divexterior.style.display = "";
    divarchivosExterior.style.display = "";

    divarchivos.style.display = "none";
    divnivel.style.display = "none";
    divdatos.style.display = "none";

    document.getElementsByName("RegistroFiscal")[0].required = false;
    document.getElementsByName("certificadoBancarioExterior")[0].required = false;
  }
}
