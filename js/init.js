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

  /* ---------------------- Llenar Condiciones de Pago (exterior y nacional) -- */
  [
    ["condicionPago", CONDICIONES_PAGO_EXTERIOR],
    ["condicionPagoNacional", CONDICIONES_PAGO_NACIONAL],
  ].forEach(function (par) {
    const sel = document.getElementById(par[0]);
    if (!sel) return;
    par[1].forEach(function (c) {
      const texto = c.codigo + " - " + c.descripcion;
      sel.appendChild(new Option(texto, texto));
    });
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

/* ------------------------------------------------------------------------------------- */
/*            AVISO DE "SEGUIR BAJANDO" (el formulario se muestra en un iframe)           */
/* ------------------------------------------------------------------------------------- */
/* Al mostrarse secciones nuevas el contenido crece y el botón de enviar puede quedar     */
/* fuera de la parte visible del iframe. El indicador aparece mientras quede contenido    */
/* por debajo y al pulsarlo se baja un poco.                                              */

function bajarUnPoco() {
  const alto = window.innerHeight || document.documentElement.clientHeight;
  window.scrollBy({ top: Math.round(alto * 0.8), behavior: "smooth" });
}

$(document).ready(function () {
  const indicador = document.getElementById("indicadorScroll");
  if (!indicador) return;

  function actualizarIndicadorScroll() {
    const doc = document.documentElement;
    const faltaPorBajar = doc.scrollHeight - window.pageYOffset - window.innerHeight;
    indicador.classList.toggle("visible", faltaPorBajar > 40);
  }

  window.addEventListener("scroll", actualizarIndicadorScroll, { passive: true });
  window.addEventListener("resize", actualizarIndicadorScroll);

  /* El contenido cambia al mostrarse u ocultarse secciones del formulario */
  if (window.ResizeObserver) {
    new ResizeObserver(actualizarIndicadorScroll).observe(document.body);
  } else {
    setInterval(actualizarIndicadorScroll, 800);
  }

  actualizarIndicadorScroll();
});
