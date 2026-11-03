/* SLINT — INT-09 Horas extra (ejemplo precargado) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var ui = window.SLINT.liquidacionUI;
  var contenedor = utils.qs("#detalle-liquidacion");
  if (!contenedor) {
    return;
  }

  var resultado = ui.actual();
  if (!resultado) {
    ui.renderVacio(contenedor, "Seleccione un ejemplo desde el flujo para consultar este detalle.");
    return;
  }

  var claves = ["extra_diurna", "extra_nocturna"];
  var segmentos = resultado.segmentos.filter(function (segmento) {
    return claves.indexOf(segmento.clave) !== -1;
  });

  var advertencias = (resultado.advertencias || []).length
    ? '<div class="slint-hallazgos slint-mt-3">' +
      resultado.advertencias
        .map(function (mensaje) {
          return (
            '<div class="slint-hallazgo slint-hallazgo--advertencia" role="status">' +
            '<span class="slint-badge slint-badge--advertencia">Supuesto demo</span>' +
            "<span>" + mensaje + "</span></div>"
          );
        })
        .join("") +
      "</div>"
    : "";

  var contenido =
    ui.avisoDemo() +
    '<div class="slint-mt-4">' + ui.encabezado(resultado) + "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Horas extra del ejemplo</h2>" +
    '<p class="slint-texto-suave">Las horas extra están precargadas en el ejemplo. ' +
    "No se obtienen de una jornada semanal ni de una regla automática.</p>" +
    advertencias;

  if (segmentos.length) {
    contenido +=
      '<div class="slint-mt-3">' + ui.tablaConceptos(resultado, claves) + "</div>" +
      ui.notaPrecargado();
  } else {
    contenido +=
      '<div class="slint-mt-3"><div class="slint-vacio">' +
      '<h3 class="slint-vacio__titulo">Este ejemplo no incluye horas extra</h3>' +
      "<p>Pruebe el ejemplo L-04 para ver el escenario con horas extra.</p>" +
      "</div></div>";
  }

  contenido +=
    "</div>" +
    (segmentos.length
      ? '<div class="slint-panel slint-mt-4">' +
        "<h2>Intervalos extra</h2>" +
        '<div class="slint-mt-3">' + ui.tablaSegmentos(segmentos, { mostrarMotivo: true }) + "</div>" +
        "</div>"
      : "") +
    '<div class="slint-mt-4">' + ui.bloqueParametros(resultado) + "</div>" +
    '<div class="slint-flex slint-mt-4">' +
    '<a class="slint-boton" href="resumen-liquidacion.html">Volver al resumen (INT-11)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-ordinarias-nocturnas.html">Horas ordinarias y nocturnas (INT-08)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-festivos.html">Domingos y festivos (INT-10)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-por-concepto.html">Detalle por concepto (INT-12)</a>' +
    "</div>";

  contenedor.innerHTML = contenido;
})();
