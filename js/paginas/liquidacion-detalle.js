/* SLINT — INT-12 Detalle por concepto (ejemplo precargado) */
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
    ui.renderVacio(contenedor, "Seleccione un ejemplo desde el flujo para consultar el detalle.");
    return;
  }

  var p = resultado.parametros;
  var totalSegmentos = resultado.segmentos.length;
  var totalConceptos = resultado.conceptos.filter(function (concepto) {
    return concepto.horas > 0.0001;
  }).length;

  contenedor.innerHTML =
    ui.avisoDemo() +
    '<div class="slint-mt-4">' + ui.encabezado(resultado) + "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Desglose por intervalo</h2>" +
    '<p class="slint-texto-suave">Esta vista contiene dos tablas: <strong>' + totalSegmentos +
    " segmentos</strong> y <strong>" + totalConceptos + " conceptos agregados</strong>. " +
    "No son filas duplicadas: cada tabla responde a una agrupación distinta y el total es el mismo.</p>" +
    '<p class="slint-texto-suave">Cada fila de la primera tabla es un segmento precargado con un único concepto. ' +
    "La columna Día indica si el segmento cae en día ordinario, domingo o festivo.</p>" +
    '<div class="slint-mt-3">' + ui.tablaSegmentos(resultado.segmentos, { mostrarMotivo: true }) + "</div>" +
    ui.notaPrecargado() +
    "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Resumen por concepto (" + totalConceptos + ")</h2>" +
    '<p class="slint-texto-suave">La segunda tabla agrupa los mismos segmentos por concepto. ' +
    "No se suman las dos tablas entre sí.</p>" +
    '<div class="slint-mt-3">' + ui.tablaConceptos(resultado) + "</div>" +
    ui.total(resultado) +
    "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Explicación ilustrativa del importe</h2>" +
    '<dl class="slint-resumen slint-mt-3">' +
    '<div class="slint-resumen__dato"><dt>Valor base</dt><dd>horas × ' + ui.pesos(p.valorHoraBase) + "</dd></div>" +
    '<div class="slint-resumen__dato"><dt>Valor del recargo</dt><dd>valor base × (porcentaje / 100)</dd></div>' +
    '<div class="slint-resumen__dato"><dt>Factor multiplicador</dt><dd>1 + (porcentaje / 100)</dd></div>' +
    '<div class="slint-resumen__dato"><dt>Subtotal</dt><dd>valor base + valor del recargo</dd></div>' +
    "</dl>" +
    '<p class="slint-texto-suave slint-mt-3">Esta fórmula explica cómo se leen los valores ya precargados. ' +
    "No es un cálculo automático ni una regla laboral validada. El factor no es igual al porcentaje: " +
    "un recargo del 35 % corresponde a un factor de 1,35.</p>" +
    "</div>" +
    '<div class="slint-flex slint-mt-4">' +
    '<a class="slint-boton" href="resumen-liquidacion.html">Volver al resumen (INT-11)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-ordinarias-nocturnas.html">Horas ordinarias y nocturnas (INT-08)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-horas-extra.html">Horas extra (INT-09)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-festivos.html">Domingos y festivos (INT-10)</a>' +
    "</div>";
})();
