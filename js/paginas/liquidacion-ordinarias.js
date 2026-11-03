/* SLINT — INT-08 Horas ordinarias y nocturnas (ejemplo precargado) */
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

  var claves = ["ordinaria", "nocturna"];
  var segmentos = resultado.segmentos.filter(function (segmento) {
    return claves.indexOf(segmento.clave) !== -1;
  });

  contenedor.innerHTML =
    ui.avisoDemo() +
    '<div class="slint-mt-4">' + ui.encabezado(resultado) + "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Clasificación ilustrativa</h2>" +
    '<p class="slint-texto-suave">Franja nocturna del ejemplo: 19:00 a 06:00. ' +
    "Las horas extra o dominicales/festivas se muestran en sus propias vistas y no se suman aquí.</p>" +
    '<div class="slint-mt-3">' + ui.tablaConceptos(resultado, claves) + "</div>" +
    ui.notaPrecargado() +
    "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Intervalos del ejemplo</h2>" +
    '<div class="slint-mt-3">' + ui.tablaSegmentos(segmentos) + "</div>" +
    "</div>" +
    '<div class="slint-mt-4">' + ui.bloqueParametros(resultado) + "</div>" +
    '<div class="slint-flex slint-mt-4">' +
    '<a class="slint-boton" href="resumen-liquidacion.html">Volver al resumen (INT-11)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-horas-extra.html">Horas extra (INT-09)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-festivos.html">Domingos y festivos (INT-10)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-por-concepto.html">Detalle por concepto (INT-12)</a>' +
    "</div>";
})();
