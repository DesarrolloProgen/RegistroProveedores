/* ------------------------------------------------------------------------------------- */
/*                       INICIALIZACIÓN DE LA INTERFAZ DEL FORMULARIO                     */
/* ------------------------------------------------------------------------------------- */
/* - Llena los desplegables de País y Ciudad con buscador (Select2).                     */
/* - Fuerza mayúsculas en los campos de texto (excepto correos).                         */
/* - Restringe NIT, DV y cédula a solo números.                                          */

$(document).ready(function () {
  /* ---------------------- Llenar desplegable de Países ---------------------- */
  const $pais = $("#pais");
  PAISES.forEach(function (pais) {
    $pais.append(new Option(pais, pais));
  });

  /* ---------------------- Llenar desplegable de Ciudades (Colombia) --------- */
  const $ciudad = $("#ciudad");
  CIUDADES_COLOMBIA.forEach(function (ciudad) {
    $ciudad.append(new Option(ciudad, ciudad));
  });

  /* ---------------------- Inicializar Select2 (con buscador) ---------------- */
  $pais.select2({
    placeholder: "Selecciona un país",
    width: "100%",
    language: {
      noResults: function () {
        return "No se encontraron resultados";
      },
    },
  });

  $ciudad.select2({
    placeholder: "Selecciona una ciudad",
    width: "100%",
    language: {
      noResults: function () {
        return "No se encontraron resultados";
      },
    },
  });

  /* ---------------------- Evento al cambiar el País ------------------------- */
  $pais.on("change", function () {
    paisOnchange(this);
  });

  /* ---------------------- Forzar mayúsculas en campos de texto -------------- */
  /* Se excluyen los correos (clase .email-input) para no afectar su validación */
  document
    .querySelectorAll("#formulario input[type=text]:not(.email-input)")
    .forEach(function (el) {
      el.addEventListener("input", function () {
        const inicio = el.selectionStart;
        const fin = el.selectionEnd;
        el.value = el.value.toUpperCase();
        try {
          el.setSelectionRange(inicio, fin);
        } catch (e) {
          /* algunos tipos de input no soportan setSelectionRange */
        }
      });
    });

  /* ---------------------- Guardar texto original de las etiquetas de archivo */
  /* Se usa luego para restaurar el label al reiniciar el formulario           */
  document.querySelectorAll(".custom-file-label").forEach(function (label) {
    label.setAttribute("data-default", label.innerHTML);
  });

  /* ---------------------- Solo números en NIT, DV y cédula ------------------ */
  ["numeroNIT", "codigoNIT", "cc"].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute("inputmode", "numeric");
    el.addEventListener("input", function () {
      el.value = el.value.replace(/\D/g, "");
    });
    /* Evita pegar texto con espacios, puntos, guiones, etc. */
    el.addEventListener("keypress", function (e) {
      if (!/\d/.test(e.key)) {
        e.preventDefault();
      }
    });
  });
});
