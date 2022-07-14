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
        }
        else if(selected.value == "Persona Jurídica"){
            divNatural.style.display = "none";
            divJuridica.style.display = "";
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
          divnivel.style.display = "none";
          divexterior.style.display = "";
          divarchivos.style.display = "none";
          divdatos.style.display = "none";
        }
        else{
          divcontacto.style.display = "";
          divnivel.style.display = "";
          divexterior.style.display = "none";
          divarchivos.style.display = "";
          divdatos.style.display = "";
        }
      }