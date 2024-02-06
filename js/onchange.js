/* ------------------------------------------------------------------------------------- */
/*                                 FUNCIONES ONCHAGE                                     */
/* ------------------------------------------------------------------------------------- */
/* Funciones Onchange para las condiciones de mostrar diferentes 
                                     DIV dependiendo de selecciones por parte del usuario*/

/*                            DEPENDIENTO DEL TIPO DE PERSONA                            */
    function tipopersonaOnchange(selected){
        divNatural = document.getElementById("Persona_Natural");
        divJuridica = document.getElementById("Persona_Juridica");
        if( selected.value == "Persona Natural"){
            divNatural.style.display = "";
            divJuridica.style.display = "none";
            document.getElementsByName("FormularioNatural")[0].required = true;
            document.getElementsByName("copiacedula")[0].required = true;
            document.getElementsByName("copiaRut")[0].required = true;
            document.getElementsByName("certBancariaNatural")[0].required = true;
            document.getElementsByName("Formulariojuridico")[0].required = false;
            document.getElementsByName("certificadoExistencia")[0].required = false;
            document.getElementsByName("representanteLegal")[0].required = false;
            document.getElementsByName("RUT")[0].required = false;
            document.getElementsByName("certBancariaJuridica")[0].required = false;

        }
        else if(selected.value == "Persona Jurídica"){
            divNatural.style.display = "none";
            divJuridica.style.display = "";
            document.getElementsByName("Formulariojuridico")[0].required = true;
            document.getElementsByName("certificadoExistencia")[0].required = true;
            document.getElementsByName("representanteLegal")[0].required = true;
            document.getElementsByName("RUT")[0].required = true;
            document.getElementsByName("certBancariaJuridica")[0].required = true;
            document.getElementsByName("FormularioNatural")[0].required = false;
            document.getElementsByName("copiacedula")[0].required = false;
            document.getElementsByName("copiaRut")[0].required = false;
            document.getElementsByName("certBancariaNatural")[0].required = false;

        }
    }
/*                            DEPENDIENTO DEL TIPO DE IDENTIFICACION                            */

    function tipoindentificacionOnchange(selected){
        divCC = document.getElementById("cedula");
        divNIT = document.getElementById("nit");

        if(selected.value == "CC"){
        divCC.style.display = "";
        divNIT.style.display = "none";
        }
        else if(selected.value == "NIT"){
        divCC.style.display = "none";
        divNIT.style.display = "";
        }
    }

/*                            DEPENDIENTO DEL TIPO DE PROVEEDOR                            */

    function tipoproveedorOnchange(selected){
        divcontacto = document.getElementById("contacto");
        divexterior = document.getElementById("exterior");
        divnivel = document.getElementById("contacto_nivel_1_2");
        divarchivos = document.getElementById("archivos");
        divdatos = document.getElementById("datos");
        if(selected.value == "Proveedor Exterior"){
          divcontacto.style.display = "";
          divexterior.style.display = "";
          divnivel.style.display = "none";
          divarchivos.style.display = "none";
          divdatos.style.display = "none";
          document.getElementsByName("Formulariojuridico")[0].required = false;
            document.getElementsByName("certificadoExistencia")[0].required = false;
            document.getElementsByName("representanteLegal")[0].required = false;
            document.getElementsByName("RUT")[0].required = false;
            document.getElementsByName("certBancariaJuridica")[0].required = false;
            document.getElementsByName("FormularioNatural")[0].required = false;
            document.getElementsByName("copiacedula")[0].required = false;
            document.getElementsByName("copiaRut")[0].required = false;
            document.getElementsByName("certBancariaNatural")[0].required = false;
        }
        else if(selected.value == "Proveedor Nivel 1"){
          divcontacto.style.display = "";
          divnivel.style.display = "";
          divarchivos.style.display = "";
          divdatos.style.display = "";

          divexterior.style.display = "none";
        } else{
            divcontacto.style.display = "";
          divnivel.style.display = "";
          divarchivos.style.display = "";
          divdatos.style.display = "";
          divexterior.style.display = "none";
        }
      }