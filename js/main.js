
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
              pais: pais.value,
              ciudad: ciudad.value,
              nombre_proveedor: nombre_usuario.value,
              nombre_contacto: nombre_contacto_nivel.value,
              telefono_contacto: telefono_contacto_nivel.value,
              email_contacto: email_contacto_nivel.value,
              nombre_contactoProgen: nombre_contactoProgen.value,
              email_contactoProgen: email_contactoProgen.value,
              natural: natural,
              juridica: juridica,
              taller: taller
            }
          } else if (tipo_identificacion.value == "NIT"){
            var data = {
              fecha: fechayHora,
              tipo_registro: tipo_registro.value,
              tipo_empresa: tipo_empresa.value,
              tipo_proveedor: tipo_proveedor.value,
              tipo_identificacion: tipo_identificacion.value,
              nit: nit,
              pais: pais.value,
              ciudad: ciudad.value,
              nombre_proveedor: nombre_usuario.value,
              nombre_contacto: nombre_contacto_nivel.value,
              telefono_contacto: telefono_contacto_nivel.value,
              email_contacto: email_contacto_nivel.value,
              nombre_contactoProgen: nombre_contactoProgen.value,
              email_contactoProgen: email_contactoProgen.value,
              natural: natural,
              juridica: juridica,
              taller: taller
              }
            }
            
            /* Creacion de Data para Proveedor Exterior*/

            else{
                var data = {
                    fecha: fechayHora,
                    tipo_registro: tipo_registro.value,
                    tipo_empresa: tipo_empresa.value,
                    tipo_proveedor: tipo_proveedor.value,
                    nombre_proveedor: nombre_proveedor_exterior.value,
                    ciudad: ciudad_exterior.value,
                    pais: pais.value,
                    nombre_contacto: nombre_contacto_externo.value,
                    telefono_contacto: telefono_contacto_externo.value,
                    email_contacto: email_contacto_externo.value,
                    cargo: cargo.value,
                    moneda: moneda.value,
                    tipoactividad: tipoactividad.value,
                    nombre_contactoProgen: nombre_contactoProgen.value,
                    email_contactoProgen: email_contactoProgen.value,
                    exterior: exterior
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
            enviarPeticion(settings);       
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
            // Reiniciar los desplegables con buscador (Select2) sin disparar paisOnchange
            $('#pais').val(null).trigger('change.select2');
            $('#ciudad').val(null).trigger('change.select2');
            // Ocultar nuevamente las secciones condicionales y limpiar el tipo de proveedor
            document.getElementById("t_proveedor").value = "";
            ["contacto", "exterior", "contacto_nivel_1_2", "archivos", "archivosExterior", "datos", "filaCiudadColombia", "cedula", "nit"].forEach(function (id) {
              var el = document.getElementById(id);
              if (el) el.style.display = "none";
            });
            $(".custom-file-label").removeClass("selected").each(function () {
              this.innerHTML = this.getAttribute("data-default") || "";
            });
            natural = [];
            juridica = [];
            exterior = [];
            taller = [];
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

      function saveFileTaller(f) {
        const file = f.files[0];
        const fr = new FileReader();
        fr.addEventListener("load", function () {
          let contenido = fr.result.split(",");
          const obj = {
            archivo: TallerServicio[f.name],
            filename: file.name,
            mimeType: file.type,
            contenido: {
              "$content-type" : file.type,
              "$content" : contenido[1]
            }
          };
          taller.push(obj)
        });
        if (file) {
          fr.readAsDataURL(file);
        }
        console.log(taller);
      }

      function saveFileExterior(f) {
        const file = f.files[0];
        const fr = new FileReader();
        fr.addEventListener("load", function () {
          let contenido = fr.result.split(",");
          const obj = {
            archivo: PersonaExterior[f.name],
            filename: file.name,
            mimeType: file.type,
            contenido: {
              "$content-type" : file.type,
              "$content" : contenido[1]
            }
          };
          exterior.push(obj)
        });
        if (file) {
          fr.readAsDataURL(file);
        }
        console.log(exterior);
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
