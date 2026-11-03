/* SLINT — presentación de liquidaciones demostrativas (sin motor de cálculo) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var CLAVE_ACTUAL = "liquidacionActual";

  function listar() {
    var datos = window.SLINT.liquidacionesDemo;
    return datos && Array.isArray(datos.ejemplos) ? datos.ejemplos : [];
  }

  function obtener(id) {
    var datos = window.SLINT.liquidacionesDemo;
    return datos && typeof datos.obtener === "function" ? datos.obtener(id) : null;
  }

  function actual() {
    var id = utils.almacen.get(CLAVE_ACTUAL, null);
    return id ? obtener(id) : null;
  }

  function seleccionar(id) {
    if (!obtener(id)) {
      return false;
    }
    return utils.almacen.set(CLAVE_ACTUAL, id);
  }

  function nombreColaborador(id) {
    var datos = window.SLINT.datos;
    var encontrado =
      datos &&
      datos.colaboradores.find(function (item) {
        return item.id === id;
      });
    return encontrado ? encontrado.nombre : "Colaborador no identificado";
  }

  function tipoTurno(resultado) {
    return resultado.turno.entrada2 || resultado.turno.salida2
      ? "Turno partido"
      : "Turno continuo";
  }

  function horas(valor) {
    var redondeado = Math.round(valor * 100) / 100;
    return utils.formatoNumero(redondeado, Number.isInteger(redondeado) ? 0 : 2) + " h";
  }

  function porcentaje(valor) {
    var numero = Number(valor);
    return utils.formatoNumero(numero, Number.isInteger(numero) ? 0 : 2) + " %";
  }

  function factor(valor) {
    return utils.formatoNumero(valor, 2);
  }

  function pesos(valor) {
    return utils.formatoCOP(valor);
  }

  function etiquetaMotivo(motivo) {
    if (motivo === "domingo") {
      return "Domingo";
    }
    if (motivo === "festivo") {
      return "Festivo";
    }
    return "Día ordinario";
  }

  function avisoDemo() {
    return (
      '<div class="slint-mensaje slint-mensaje--demo" role="note">' +
      "<span><strong>Ejemplo de demostración.</strong> " +
      "Los datos están precargados y no se calculan en tiempo real. " +
      "No constituyen una liquidación legal certificada.</span>" +
      "</div>"
    );
  }

  function notaPrecargado() {
    return (
      '<p class="slint-texto-suave">Este contenido proviene de un ejemplo precargado de ' +
      "demostración. No representa una liquidación de los turnos registrados en INT-03.</p>"
    );
  }

  function renderVacio(contenedor, mensaje) {
    contenedor.innerHTML =
      '<div class="slint-vacio">' +
      '<h2 class="slint-vacio__titulo">Sin ejemplo seleccionado</h2>' +
      "<p>" + mensaje + "</p>" +
      '<p class="slint-mt-3"><a class="slint-boton" href="flujo-liquidacion.html">Ir al flujo de liquidación (INT-07)</a></p>' +
      "</div>";
  }

  function encabezado(resultado) {
    var turno = resultado.turno;
    return (
      '<div class="slint-panel">' +
      '<div class="slint-seccion__cabecera">' +
      "<div><h2>" + resultado.titulo + "</h2>" +
      '<p class="slint-texto-suave">' + resultado.id + " · " +
      nombreColaborador(resultado.colaboradorId) + " · " + tipoTurno(resultado) +
      " · fecha " + turno.fecha + "</p></div>" +
      '<span class="slint-badge slint-badge--demo">Demostración</span>' +
      "</div>" +
      '<dl class="slint-resumen slint-mt-3">' +
      '<div class="slint-resumen__dato"><dt>Ejemplo</dt><dd>' + resultado.id + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Horas del ejemplo</dt><dd>' + horas(resultado.totalHoras) + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Total ilustrativo</dt><dd>' + pesos(resultado.total) + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Horario</dt><dd>' +
      turno.entrada1 + " a " + turno.salida1 + (turno.cruce1 ? " (+1 día)" : "") + "</dd></div>" +
      "</dl>" +
      "</div>"
    );
  }

  function tablaConceptos(resultado, claves) {
    var lista = resultado.conceptos.filter(function (concepto) {
      if (claves && claves.indexOf(concepto.clave) === -1) {
        return false;
      }
      return concepto.horas > 0.0001 || concepto.subtotal > 0;
    });

    if (!lista.length) {
      return (
        '<div class="slint-vacio"><h3 class="slint-vacio__titulo">Sin horas en estos conceptos</h3>' +
        "<p>Este ejemplo no incluye horas para la selección consultada.</p></div>"
      );
    }

    var filas = lista
      .map(function (concepto) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Concepto">' + concepto.etiqueta + "</th>" +
          '<td data-label="Horas">' + horas(concepto.horas) + "</td>" +
          '<td data-label="Valor base">' + pesos(concepto.valorBase) + "</td>" +
          '<td data-label="% recargo">' + porcentaje(concepto.porcentaje) + "</td>" +
          '<td data-label="Factor">' + factor(concepto.factor) + "</td>" +
          '<td data-label="Subtotal">' + pesos(concepto.subtotal) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="slint-tabla-contenedor">' +
      '<table class="slint-tabla slint-tabla--numeros slint-tabla--apilada" data-tabla="conceptos">' +
      "<caption>Conceptos del ejemplo precargado (" + lista.length + ")</caption>" +
      '<thead><tr><th scope="col">Concepto</th><th scope="col">Horas</th>' +
      '<th scope="col">Valor base</th><th scope="col">% recargo</th>' +
      '<th scope="col">Factor</th><th scope="col">Subtotal</th></tr></thead>' +
      "<tbody>" + filas + "</tbody>" +
      "</table></div>"
    );
  }

  function tablaSegmentos(segmentos, opciones) {
    opciones = opciones || {};
    if (!segmentos.length) {
      return (
        '<div class="slint-vacio"><h3 class="slint-vacio__titulo">Sin intervalos</h3>' +
        "<p>El ejemplo no contiene segmentos para esta vista.</p></div>"
      );
    }

    var filas = segmentos
      .map(function (segmento) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Concepto">' + segmento.etiqueta + "</th>" +
          (opciones.mostrarMotivo
            ? '<td data-label="Día">' + etiquetaMotivo(segmento.motivo) + "</td>"
            : "") +
          '<td data-label="Intervalo">' + segmento.inicioTexto + " → " + segmento.finTexto + "</td>" +
          '<td data-label="Horas">' + horas(segmento.horas) + "</td>" +
          '<td data-label="Valor base">' + pesos(segmento.valorBase) + "</td>" +
          '<td data-label="% recargo">' + porcentaje(segmento.porcentaje) + "</td>" +
          '<td data-label="Factor">' + factor(segmento.factor) + "</td>" +
          '<td data-label="Subtotal">' + pesos(segmento.subtotal) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    return (
      '<div class="slint-tabla-contenedor">' +
      '<table class="slint-tabla slint-tabla--numeros slint-tabla--apilada" data-tabla="segmentos">' +
      "<caption>Desglose por intervalo (" + segmentos.length + " segmentos)</caption>" +
      "<thead><tr><th scope=\"col\">Concepto</th>" +
      (opciones.mostrarMotivo ? '<th scope="col">Día</th>' : "") +
      '<th scope="col">Intervalo</th><th scope="col">Horas</th>' +
      '<th scope="col">Valor base</th><th scope="col">% recargo</th>' +
      '<th scope="col">Factor</th><th scope="col">Subtotal</th></tr></thead>' +
      "<tbody>" + filas + "</tbody>" +
      "</table></div>"
    );
  }

  function bloqueParametros(resultado) {
    var p = resultado.parametros;
    return (
      '<div class="slint-panel">' +
      "<h2>Parámetros ilustrativos del ejemplo</h2>" +
      '<dl class="slint-resumen slint-mt-3">' +
      '<div class="slint-resumen__dato"><dt>Valor hora base</dt><dd>' + pesos(p.valorHoraBase) + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Franja nocturna</dt><dd>' +
      String(p.franjaNocturna.inicio).padStart(2, "0") + ":00 a " +
      String(p.franjaNocturna.fin).padStart(2, "0") + ":00</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Recargos</dt><dd>Nocturno ' + p.recargos.nocturna +
      " % · Extra diurna " + p.recargos.extraDiurna + " % · Extra nocturna " +
      p.recargos.extraNocturna + " % · Dominical/festivo " + p.recargos.dominicalFestivo + " %</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Vigencia</dt><dd>' + p.vigencia + "</dd></div>" +
      "</dl>" +
      "</div>"
    );
  }

  function total(resultado) {
    return (
      '<div class="slint-total">' +
      "<span>Total ilustrativo del ejemplo</span>" +
      "<strong>" + pesos(resultado.total) + "</strong>" +
      "</div>"
    );
  }

  function verificacion(resultado) {
    var v = resultado.verificacion || {};
    var ok = v.coincideTotal && v.coincideHoras;
    return ok
      ? '<div class="slint-mensaje slint-mensaje--exito" role="status">' +
        "<span><strong>Coherencia del ejemplo.</strong> La suma de subtotales coincide con el total y " +
        "las horas de los segmentos coinciden con las horas de los conceptos.</span></div>"
      : '<div class="slint-mensaje slint-mensaje--error" role="alert">' +
        "<span><strong>Inconsistencia en el ejemplo.</strong> Revise los datos demostrativos.</span></div>";
  }

  window.SLINT = window.SLINT || {};
  window.SLINT.liquidacionUI = {
    listar: listar,
    obtener: obtener,
    actual: actual,
    seleccionar: seleccionar,
    nombreColaborador: nombreColaborador,
    tipoTurno: tipoTurno,
    horas: horas,
    pesos: pesos,
    porcentaje: porcentaje,
    factor: factor,
    etiquetaMotivo: etiquetaMotivo,
    avisoDemo: avisoDemo,
    notaPrecargado: notaPrecargado,
    renderVacio: renderVacio,
    encabezado: encabezado,
    tablaConceptos: tablaConceptos,
    tablaSegmentos: tablaSegmentos,
    bloqueParametros: bloqueParametros,
    total: total,
    verificacion: verificacion
  };
})();
