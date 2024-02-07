
    var now = new Date();
    var fecha = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear();
    var minutos = now.getMinutes()
    if(minutos<10) minutos="0"+minutos;
    var hora = now.getHours() + ':' + minutos;
    var fechayHora = fecha + ' ' + hora;
    const url = "https://prod-27.brazilsouth.logic.azure.com:443/workflows/50bd776c30de43d4a4abfbc497c59763/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tGPvC-XO_cwP3ZQKWgnqCnTptzNMtLMDmCbLuoaHcBM";
    var data = {};
/*-------------------------------------------------------------------------------------------- */
/*                                  Configurar la Petición                                     */
/*-------------------------------------------------------------------------------------------- */ 
    function submitForm(){
        nit = numeroNIT.value + " - " + codigoNIT.value
        /* Creacion de Data para Proveedor Nivel 1 y 2*/
        if (tipo_identificacion.value == "CC"){
            var data = {
              fecha: fechayHora,
              tipo_registro: tipo_registro.value,
              tipo_empresa: tipo_empresa.value,
              tipo_proveedor: tipo_proveedor.value,
              tipo_identificacion: tipo_identificacion.value,
              cedula: cedula.value,
              nombre_proveedor: nombre_usuario.value,
              nombre_contacto_nivel: nombre_contacto_nivel.value,
              telefono_contacto_nivel: telefono_contacto_nivel.value,
              email_contacto_nivel: email_contacto_nivel.value,
              plazo_pago_nivel: plazo_pago_nivel.value,
              nombre_contactoProgen: nombre_contactoProgen.value,
              email_contactoProgen: email_contactoProgen.value,
              natural: natural,
              juridica: juridica
            }
          } else if (tipo_identificacion.value == "NIT"){
            var data = {
              fecha: fechayHora,
              tipo_registro: tipo_registro.value,
              tipo_empresa: tipo_empresa.value,
              tipo_proveedor: tipo_proveedor.value,
              tipo_identificacion: tipo_identificacion.value,
              nit: nit,
              nombre_proveedor: nombre_usuario.value,
              nombre_contacto_nivel: nombre_contacto_nivel.value,
              telefono_contacto_nivel: telefono_contacto_nivel.value,
              email_contacto_nivel: email_contacto_nivel.value,
              plazo_pago_nivel: plazo_pago_nivel.value,
              nombre_contactoProgen: nombre_contactoProgen.value,
              email_contactoProgen: email_contactoProgen.value,
              natural: natural,
              juridica: juridica
              }
            }
            
            /* Creacion de Data para Proveedor Exterior*/

            else{
                var data = {
                    fecha: fechayHora,
                    tipo_registro: tipo_registro.value,
                    tipo_empresa: tipo_empresa.value,
                    tipo_proveedor: tipo_proveedor.value,
                    razon_social: razon_social.value,
                    direccion: direccion.value,
                    ciudad: ciudad.value,
                    pais: pais.value,
                    nombre_contacto_externo: nombre_contacto_externo.value,
                    telefono_contacto_externo: telefono_contacto_externo.value,
                    email_contacto_externo: email_contacto_externo.value,
                    cargo: cargo.value,
                    moneda: moneda.value,
                    plazoPago: plazoPago.value,
                    tipoactividad: tipoactividad.value,
                    nombre_contactoProgen: nombre_contactoProgen.value,
                    email_contactoProgen: email_contactoProgen.value
                }
            }
            console.log("Se creo la data:");
            console.log(data);
            const settings = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            cargando();
            // enviarPeticion(settings);       
    };
/*-------------------------------------------------------------------------------------------- */
/*                                       Enviar Peticion                                       */
/*-------------------------------------------------------------------------------------------- */
    function enviarPeticion(settings) {
        fetch(url, settings)
        .then(response => {
            console.log(response);
            document.getElementById("headermensaje").style.background = '#6EF05F';
            document.getElementById('titulomensaje').innerHTML='Realizado';
            document.getElementById('mensaje').innerHTML='Se registro correctamente su registro';        
            document.getElementById("formulario").reset();  
            $(".custom-file-label").addClass("selected").html("Choose File");
            natural = {};
            juridica = {};
            return response.json;
        })
        .catch(err => {
            console.log("Promesa Rechazada");
            console.log(err);
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Algo salio mal.... Recargue la pagina e intete nuevamente<br>' + err;
        })
    }

    function cargando() {
        document.getElementById("headermensaje").style.background = '#4040ff';
        document.getElementById('titulomensaje').innerHTML='Cargando';
        document.getElementById('mensaje').innerHTML='<img src="https://acegif.com/wp-content/uploads/loading-25.gif" alt="Cargando" width="50px" height="50px"><span style="padding-left: 10px">Cargando...</span>';
    }


/*-------------------------------------------------------------------------------------------- */
/*                                  Funciones Adicionales                                      */
/*-------------------------------------------------------------------------------------------- */

/*--------------------------------  Guardar Archivo en Array  ---------------------------------*/

    function saveFileJuridica(f) {
        const file = f.files[0];
        const fr = new FileReader();
        fr.addEventListener("load", function () {
        let contenido = fr.result.split(",");
        const obj = {
            archivo: PersonaJuridica[f.name],
            filename: file.name,
            mimeType: file.type,
            contenido: {
            "$content-type" : file.type,
            "$content" : contenido[1]
            }
        };
        juridica.push(obj)
        });

        if (file) {
        fr.readAsDataURL(file);
        }
        console.log(juridica);
    }

    function saveFileNatural(f) {
        const file = f.files[0];
        const fr = new FileReader();
        fr.addEventListener("load", function () {
          let contenido = fr.result.split(",");
          const obj = {
            archivo: PersonaNatural[f.name],
            filename: file.name,
            mimeType: file.type,
            contenido: {
              "$content-type" : file.type,
              "$content" : contenido[1]
            }
          };
          natural.push(obj)
        });
        if (file) {
          fr.readAsDataURL(file);
        }
        console.log(natural);
      }
/*--------------------------------  Nombre al cargar archivo  ---------------------------------*/
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
      });
      
      $('#boton').on('click',function () {
        $('#modal').toggleClass('hidden');
        setTimeout(function () {
          $('#modal').toggleClass('hidden');
        },5000);
      });  
