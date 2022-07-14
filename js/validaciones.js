/* ------------------------------------------------------------------------------------- */
/*                                       VARIABLES                                       */
/* ------------------------------------------------------------------------------------- */
    var tipo_registro = document.getElementById("t_registro");
    var tipo_empresa =  document.getElementById("t_empresa");
    var tipo_proveedor = document.getElementById("t_proveedor");

    /* Variables Provedores nivel 1 y 2*/

    var tipo_identificacion = document.getElementById("t_identificacion");
    var cedula = document.getElementById("cc");
    var numeroNIT =document.getElementById("numeroNIT");
    var codigoNIT =document.getElementById("codigoNIT");
    var nit = numeroNIT.value + "-" +codigoNIT.value;
    var nombre_usuario = document.getElementById("nombreUsuario");
    var nombre_contacto_nivel = document.getElementById("nombreContacto1");
    var telefono_contacto_nivel = document.getElementById("telefonoContacto1");
    var email_contacto_nivel = document.getElementById("correoContacto1");
    var plazo_pago_nivel = document.getElementById("plazoPago1");

    /*Variables Proveedores Externos */

    var razon_social =document.getElementById("razon_social");
    var direccion = document.getElementById("direccion")
    var ciudad = document.getElementById("ciudad");
    var pais = document.getElementById("pais");
    var nombre_contacto_externo = document.getElementById("nombreContacto");
    var telefono_contacto_externo =document.getElementById("telefonoContacto");
    var email_contacto_externo = document.getElementById("correoContacto");
    var cargo = document.getElementById("cargo");
    var moneda = document.getElementById("moneda");
    var plazoPago = document.getElementById("plazoPago");
    var tipoactividad = document.getElementById("tipoactividad");

    /* Variables de contacto con PROGEN*/

    var nombre_contactoProgen = document.getElementById("nombreContactoProgen");
    var email_contactoProgen =document.getElementById("emailContacto");
    
    /* Variables para el cargue de archivos */
    
    var natural = [];
    var juridica = [];

/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */

    /* Validacion de Email general */

    function validar_email( email ) {
        let regex = /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email) ? true : false;
    }

    /* Validacion de Email empresarial */

    function validar_email_progen(email){
      let regex1 = /([a-zA-Z0-9_\.\-])+\@((progen)+\.)+(com+\.)+(co)/;
      let regex2 = /([a-zA-Z0-9_\.\-])+\@((royalcondor)+\.)+(com)/;
      let regex3 = /([a-zA-Z0-9_\.\-])+\@((colinagro)+\.)+(com+\.)+(co)/;
      return regex1.test(email) || regex2.test(email) || regex3.test(email) ? true : false;
    }

    function validaciones() {
        if(tipo_registro.value == "" || tipo_registro.value == "Selecciona una opción" || tipo_registro.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de Registro';
            return false;
          }
    
          if(tipo_empresa.value == "" || tipo_empresa.value == "Selecciona una opción" || tipo_empresa.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de empresa';
            return false;
          }
          if(tipo_proveedor.value == "" || tipo_proveedor.value == "Selecciona una opción" || tipo_proveedor.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de Proveedor';
            return false;
          }
          
          /* Validaciones Proveedor Nivel 1 y 2 */
    
        if(tipo_proveedor.value == "Proveedor Nivel 1" || tipo_proveedor.value == "Proveedor Nivel 2"){
    
            if(tipo_identificacion.value == "" || tipo_identificacion.value == "Selecciona una opción" || tipo_identificacion.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de identificación';
            return false;
          }
    
          if(tipo_identificacion.value == "CC" && (cedula.value == null || cedula.value == "" || isNaN(parseInt(cedula.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su numero de cédula (Solo se aceptan números)';
            return false;
          }
    
          if(tipo_identificacion.value == "NIT" && (numeroNIT.value == null || numeroNIT.value == "" || isNaN(parseInt(numeroNIT.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su numero de NIT (Solo se aceptan números)';
            return false;
          }
    
          if(tipo_identificacion.value == "NIT" && (codigoNIT.value == null || codigoNIT.value == "" || isNaN(parseInt(codigoNIT.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su codigo de verificación del NIT (Solo se aceptan números)';
            return false;
          }
    
          if(nombre_usuario.value == "" || nombre_usuario.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su nombre';
            return false;
          }
    
            if(nombre_contacto_nivel.value == "" || nombre_contacto_nivel.value == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe ingresar un nombre de contacto';
              return false;
            }
    
            if(telefono_contacto_nivel.value == "" || telefono_contacto_nivel.value == null || isNaN(parseInt(telefono_contacto_nivel.value))){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe ingresar un telefono de contacto';
              return false;
            }
    
            if(email_contacto_nivel.value == "" || email_contacto_nivel.value == null || validar_email(email_contacto_nivel.value) == false){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe ingresar el email de la persona de contacto';
              return false;
            }
    
            if(plazo_pago_nivel.value == "" || plazo_pago_nivel.value == null || plazo_pago_nivel.value == "Selecciona una opción"){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe seleccionar un metodo de pago';
              return false;
            }
    
            if(tipo_proveedor.value == "Proveedor Nivel 1" && tipo_empresa.value == "Persona Natural"){
              if(natural.formato1 == null || natural.formato2 == null || natural.formato3 == null || natural.formato4 == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Recuerde que el unico Archivo opcional a subir es el de Certificaciones.';
                return false;
              }
            }
    
            if(tipo_proveedor.value == "Proveedor Nivel 1" && tipo_empresa.value == "Persona Jurídica"){
              if(juridica.formato1 == null || juridica.formato2 == null || juridica.formato3 == null || juridica.formato4 == null || juridica.formato5 == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Recuerde que el unico Archivo opcional a subir es el de Certificaciones.';
                return false;
              }
            }
    
            if(tipo_proveedor.value == "Proveedor Nivel 2" && tipo_empresa.value == "Persona Natural"){
              if( natural.formato3 == null || natural.formato4 == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Recuerde que los archivos de Copia de RUT y certificacion Bancaria son obligatorios';
                return false;
              }
            }
    
            if(tipo_proveedor.value == "Proveedor Nivel 2" && tipo_empresa.value == "Persona Jurídica"){
              if(juridica.formato4 == null || juridica.formato5 == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Recuerde que los archivos de Copia de RUT y certificacion Bancaria son obligatorios';
                return false;
              }
            }
    
            if(nombre_contactoProgen.value == "" || nombre_contactoProgen.value == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe ingresar una persona de contacto ';
              return false;
            }
    
            if(email_contactoProgen.value == "" || email_contactoProgen.value == null || validar_email_progen(email_contactoProgen.value) == false){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe ingresar el correo de la persona de contacto';
              return false;
            }
        }

        /* Validaciones Proveedor Exterior */

        if(tipo_proveedor.value == "Proveedor Exterior"){
            if(razon_social.value == "" || razon_social.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar el nombre de la razón Social';
            return false;
            }

            if(direccion.value == "" || direccion.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar una dirección';
            return false;
            }

            if(ciudad.value == "" || ciudad.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar una ciudad';
            return false;
            }

            if(pais.value == "" || pais.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un país';
            return false;
            }

            if(nombre_contacto_externo.value == "" || nombre_contacto_externo.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un nombre de contacto';
            return false;
            }

            if(telefono_contacto_externo.value == "" || telefono_contacto_externo.value == null || isNaN(parseInt(telefono_contacto_externo.value))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar el telefono de la persona de contacto (Solo se aceptan números)';
            return false;
            }

            if(email_contacto_externo.value == "" || email_contacto_externo.value == null || validar_email(email_contacto_externo.value) == false){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar el correo de la persona de contacto';
            return false;
            }

            if(cargo.value == "" || cargo.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un cargo';
            return false;
            }

            if(moneda.value == "" || moneda.value == null || moneda.value == "Selecciona una opción"){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de moneda ';
            return false;
            }
            if(plazoPago.value == "" || plazoPago.value == null || plazoPago.value == "Selecciona una opción"){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un plazo de pago ';
            return false;
            }

            if(tipoactividad.value == "" || tipoactividad.value == null || tipoactividad == "Selecciona una opción"){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de actividad ';
            return false;
            }
        }

        return true;
    }