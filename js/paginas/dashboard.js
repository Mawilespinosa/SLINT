/* SLINT — INT-02 Dashboard (datos ficticios de demostración) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var datos = window.SLINT.datos;

  var contenedorKpi = utils.qs("#kpi-lista");
  var contenedorGrafico = utils.qs("#grafico");
  var contenedorTabla = utils.qs("#tabla-grafico");
  var avisoSesion = utils.qs("#aviso-sesion");

  if (!contenedorKpi || !contenedorGrafico || !contenedorTabla || !datos) {
    return;
  }

  function tieneSesion() {
    return componentes && typeof componentes.tieneSesion === "function"
      ? componentes.tieneSesion()
      : false;
  }

  function renderAvisoSesion() {
    if (!avisoSesion) {
      return;
    }
    if (!tieneSesion()) {
      avisoSesion.innerHTML = componentes.alerta(
        "advertencia",
        "<strong>Acceso directo sin inicio de sesión.</strong> " +
          "Esta pantalla es una demostración: no valida identidad ni protege información real."
      );
    }
  }

  function formatearValor(valor) {
    var numero = Number(valor);
    if (Number.isInteger(numero)) {
      return utils.formatoNumero(numero, 0);
    }
    return utils.formatoNumero(numero, 1);
  }

  function renderKpi() {
    contenedorKpi.innerHTML = datos.indicadores
      .map(function (indicador) {
        return (
          '<article class="slint-kpi">' +
          '<p class="slint-kpi__etiqueta">' + indicador.etiqueta + "</p>" +
          '<strong class="slint-kpi__valor">' + formatearValor(indicador.valor) + "</strong>" +
          '<span class="slint-kpi__unidad">' + indicador.unidad +
          " · " + indicador.periodo + " · demo</span>" +
          "</article>"
        );
      })
      .join("");
  }

  function claseBarra(tipo) {
    if (tipo === "nocturna") {
      return " slint-grafico__barra--nocturna";
    }
    if (tipo === "extra") {
      return " slint-grafico__barra--extra";
    }
    if (tipo === "festiva") {
      return " slint-grafico__barra--festiva";
    }
    return "";
  }

  function renderGrafico() {
    var series = datos.horasPorConcepto;
    var maximo = series.reduce(function (max, item) {
      return Math.max(max, item.horas);
    }, 0);

    contenedorGrafico.innerHTML = series
      .map(function (item) {
        var porcentaje = maximo > 0 ? Math.max(4, Math.round((item.horas / maximo) * 100)) : 4;
        return (
          '<div class="slint-grafico__item">' +
          '<span class="slint-grafico__valor">' + utils.formatoNumero(item.horas, 1) + "</span>" +
          '<div class="slint-grafico__barra' + claseBarra(item.tipo) + '" ' +
          'style="--altura:' + porcentaje + '%" ' +
          'title="' + item.concepto + ": " + utils.formatoNumero(item.horas, 1) + ' horas"></div>' +
          '<span class="slint-grafico__etiqueta">' + item.concepto + "</span>" +
          "</div>"
        );
      })
      .join("");

    contenedorGrafico.setAttribute(
      "aria-label",
      "Gráfico de horas por concepto con datos de demostración: " +
        series
          .map(function (item) {
            return item.concepto + " " + utils.formatoNumero(item.horas, 1) + " horas";
          })
          .join("; ") +
        "."
    );
  }

  function renderTabla() {
    var filas = datos.horasPorConcepto
      .map(function (item) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Concepto">' + item.concepto + "</th>" +
          '<td data-label="Horas">' + utils.formatoNumero(item.horas, 1) + "</td>" +
          '<td data-label="Tipo">' + item.tipo + "</td>" +
          "</tr>"
        );
      })
      .join("");

    contenedorTabla.innerHTML =
      '<table class="slint-tabla slint-tabla--numeros slint-tabla--apilada">' +
      "<caption>Equivalente textual del gráfico de horas por concepto (datos ficticios)</caption>" +
      "<thead><tr>" +
      '<th scope="col">Concepto</th>' +
      '<th scope="col">Horas</th>' +
      '<th scope="col">Tipo</th>' +
      "</tr></thead>" +
      "<tbody>" + filas + "</tbody>" +
      "</table>";
  }

  renderAvisoSesion();
  renderKpi();
  renderGrafico();
  renderTabla();
})();
