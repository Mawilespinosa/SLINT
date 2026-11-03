/* SLINT — INT-11 Resumen de liquidación (ejemplo precargado) */
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
    ui.renderVacio(contenedor, "Seleccione un ejemplo desde el flujo para consultar el resumen.");
    return;
  }

  var advertencias = (resultado.advertencias || []).length
    ? '<div class="slint-hallazgos slint-mt-4">' +
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

  contenedor.innerHTML =
    ui.avisoDemo() +
    '<div class="slint-mt-4">' + ui.encabezado(resultado) + "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Conceptos del ejemplo</h2>" +
    '<div class="slint-mt-3">' + ui.tablaConceptos(resultado) + "</div>" +
    ui.total(resultado) +
    "</div>" +
    '<div class="slint-mt-4">' + ui.verificacion(resultado) + "</div>" +
    advertencias +
    '<div class="slint-mt-4">' + ui.bloqueParametros(resultado) + "</div>" +
    '<div class="slint-flex slint-mt-4">' +
    '<a class="slint-boton" href="detalle-por-concepto.html">Detalle por concepto (INT-12)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-ordinarias-nocturnas.html">Horas ordinarias y nocturnas (INT-08)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-horas-extra.html">Horas extra (INT-09)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-festivos.html">Domingos y festivos (INT-10)</a>' +
    "</div>" +
    '<div class="slint-flex slint-mt-3">' +
    '<a class="slint-boton slint-boton--secundario" href="exportacion.html">Exportar resultados (INT-13)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="historial-liquidaciones.html">Ver historial (INT-14)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="flujo-liquidacion.html">Cambiar ejemplo (INT-07)</a>' +
    "</div>" +
    ui.notaPrecargado();
})();
