/* SLINT — INT-10 Domingos y festivos (ejemplo precargado) */
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

  var segmentosEspeciales = resultado.segmentos.filter(function (segmento) {
    return segmento.motivo === "domingo" || segmento.motivo === "festivo";
  });

  var filasDias = resultado.dias
    .map(function (dia) {
      var especial = dia.motivo === "domingo" || dia.motivo === "festivo";
      var clasificacion = resultado.segmentos
        .filter(function (segmento) { return segmento.fecha === dia.fecha; })
        .map(function (segmento) {
          return segmento.etiqueta + " (" + ui.horas(segmento.horas) + ")";
        })
        .join(", ") || "—";
      return (
        "<tr>" +
        '<th scope="row" data-label="Fecha">' + dia.fecha + "</th>" +
        '<td data-label="Tipo de día">' + ui.etiquetaMotivo(dia.motivo) + "</td>" +
        '<td data-label="Clasificación del segmento">' + clasificacion + "</td>" +
        '<td data-label="Horas">' + ui.horas(dia.horas) + "</td>" +
        '<td data-label="Marca">' +
        (especial
          ? '<span class="slint-badge slint-badge--advertencia">Día especial</span>'
          : '<span class="slint-badge slint-badge--neutro">Día ordinario</span>') +
        "</td></tr>"
      );
    })
    .join("");

  var contenido =
    ui.avisoDemo() +
    '<div class="slint-mt-4">' + ui.encabezado(resultado) + "</div>" +
    '<div class="slint-panel slint-mt-4">' +
    "<h2>División por día</h2>" +
    '<p class="slint-texto-suave">El ejemplo ya viene dividido por fecha. ' +
    "El motivo se toma de la fecha ficticia (domingo) o del calendario de festivos demo; " +
    "no se deduce de una etiqueta de texto.</p>" +
    '<p class="slint-texto-suave">Un día ordinario no implica que la hora sea ordinaria: ' +
    "en L-03 el sábado es día ordinario y su segmento es de 2 h nocturnas.</p>" +
    '<div class="slint-mt-3">' +
    '<div class="slint-tabla-contenedor">' +
    '<table class="slint-tabla slint-tabla--apilada" data-tabla="dias">' +
    "<caption>Fechas del ejemplo</caption>" +
    '<thead><tr><th scope="col">Fecha</th><th scope="col">Tipo de día</th>' +
    '<th scope="col">Clasificación del segmento</th>' +
    '<th scope="col">Horas</th><th scope="col">Marca</th></tr></thead>' +
    "<tbody>" + filasDias + "</tbody></table></div>" +
    "</div>" +
    ui.notaPrecargado() +
    "</div>";

  if (segmentosEspeciales.length) {
    contenido +=
      '<div class="slint-panel slint-mt-4">' +
      "<h2>Intervalos en domingo o festivo</h2>" +
      '<p class="slint-texto-suave">Los importes ya están incluidos en el total del ejemplo. ' +
      "No se vuelven a sumar en esta vista.</p>" +
      '<div class="slint-mt-3">' + ui.tablaSegmentos(segmentosEspeciales, { mostrarMotivo: true }) + "</div>" +
      "</div>";
  } else {
    contenido +=
      '<div class="slint-panel slint-mt-4">' +
      '<div class="slint-vacio"><h3 class="slint-vacio__titulo">Este ejemplo no incluye domingos ni festivos</h3>' +
      "<p>Pruebe el ejemplo L-03 para ver el cruce de sábado a domingo.</p></div></div>";
  }

  contenido +=
    '<div class="slint-panel slint-mt-4">' +
    "<h2>Calendario de festivos de demostración</h2>" +
    "<p>Fechas configuradas:</p>" +
    '<ul class="slint-lista-pendientes slint-mt-3">' +
    resultado.festivos
      .map(function (festivo) {
        return "<li><code>" + festivo.fecha + "</code> · " + festivo.motivo + "</li>";
      })
      .join("") +
    "</ul>" +
    '<p class="slint-texto-suave slint-mt-3">Calendario ficticio. No corresponde al calendario oficial colombiano.</p>' +
    "</div>" +
    '<div class="slint-flex slint-mt-4">' +
    '<a class="slint-boton" href="resumen-liquidacion.html">Volver al resumen (INT-11)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-ordinarias-nocturnas.html">Horas ordinarias y nocturnas (INT-08)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-horas-extra.html">Horas extra (INT-09)</a>' +
    '<a class="slint-boton slint-boton--secundario" href="detalle-por-concepto.html">Detalle por concepto (INT-12)</a>' +
    "</div>";

  contenedor.innerHTML = contenido;
})();
