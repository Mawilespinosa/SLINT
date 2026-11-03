/* SLINT — INT-07 selección de ejemplo de liquidación (sin cálculo) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var ui = window.SLINT.liquidacionUI;

  var selector = utils.qs("#turno-select");
  var estado = utils.qs("#estado-turno");
  var aviso = utils.qs("#aviso-flujo");
  var boton = utils.qs("#btn-usar");
  var resultado = utils.qs("#resultado-flujo");
  var panel = utils.qs("#panel-seleccion");

  if (!selector || !boton) {
    return;
  }

  var ejemplos = ui.listar();

  if (!ejemplos.length) {
    panel.hidden = true;
    resultado.innerHTML =
      '<div class="slint-vacio">' +
      '<h2 class="slint-vacio__titulo">No hay ejemplos disponibles</h2>' +
      "<p>No se encontró el archivo de datos demostrativos.</p>" +
      '<p class="slint-mt-3"><a class="slint-boton" href="consulta-turnos.html">Volver a consulta</a></p>' +
      "</div>";
    return;
  }

  function obtenerSeleccionado() {
    return ui.obtener(selector.value);
  }

  function llenarSelector() {
    selector.innerHTML = ejemplos
      .map(function (ejemplo) {
        return (
          '<option value="' + ejemplo.id + '">' +
          ejemplo.id + " · " + ejemplo.titulo + " · " + ui.pesos(ejemplo.total) +
          "</option>"
        );
      })
      .join("");
  }

  function renderPreview() {
    var ejemplo = obtenerSeleccionado();
    if (!ejemplo) {
      estado.innerHTML = "";
      boton.disabled = true;
      return;
    }

    estado.innerHTML =
      ui.encabezado(ejemplo) +
      '<div class="slint-panel slint-mt-4">' +
      "<h2>Vista previa del ejemplo</h2>" +
      '<p class="slint-texto-suave">' + ejemplo.descripcion + "</p>" +
      '<div class="slint-mt-3">' + ui.tablaConceptos(ejemplo) + "</div>" +
      ui.notaPrecargado() +
      "</div>";

    boton.disabled = false;
    resultado.innerHTML = "";
    aviso.innerHTML = "";
  }

  function renderSeleccion(ejemplo) {
    resultado.innerHTML =
      '<div class="slint-mensaje slint-mensaje--exito" role="status">' +
      "<span><strong>" + ejemplo.id + " seleccionado.</strong> " +
      "Ya puede recorrer las vistas de detalle y el resumen.</span></div>" +
      '<div class="slint-flex slint-mt-4">' +
      '<a class="slint-boton" href="resumen-liquidacion.html">Ver resumen (INT-11)</a>' +
      '<a class="slint-boton slint-boton--secundario" href="detalle-ordinarias-nocturnas.html">Ordinarias y nocturnas (INT-08)</a>' +
      '<a class="slint-boton slint-boton--secundario" href="detalle-horas-extra.html">Horas extra (INT-09)</a>' +
      '<a class="slint-boton slint-boton--secundario" href="detalle-festivos.html">Domingos y festivos (INT-10)</a>' +
      '<a class="slint-boton slint-boton--secundario" href="detalle-por-concepto.html">Detalle por concepto (INT-12)</a>' +
      "</div>";
  }

  llenarSelector();

  var parametros = new URLSearchParams(window.location.search);
  var solicitado = parametros.get("ejemplo");
  var actual = ui.actual();

  if (solicitado && ui.obtener(solicitado)) {
    selector.value = solicitado;
  } else if (actual) {
    selector.value = actual.id;
  }

  renderPreview();

  selector.addEventListener("change", renderPreview);

  boton.addEventListener("click", function () {
    var ejemplo = obtenerSeleccionado();
    if (!ejemplo) {
      return;
    }
    if (!ui.seleccionar(ejemplo.id)) {
      aviso.innerHTML =
        '<div class="slint-mensaje slint-mensaje--advertencia" role="alert">' +
        "<span><strong>No se pudo guardar la selección.</strong> " +
        "El almacenamiento de la sesión no está disponible.</span></div>";
      return;
    }
    renderSeleccion(ejemplo);
  });
})();
