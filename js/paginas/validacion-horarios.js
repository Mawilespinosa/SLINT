/* SLINT — INT-04 Validación de horarios */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var datos = window.SLINT.datos;
  var turnos = window.SLINT.turnos;

  var selector = utils.qs("#selector-turno");
  var detalle = utils.qs("#detalle-turno");
  var sinTurno = utils.qs("#sin-turno");
  if (!selector || !detalle || !sinTurno) {
    return;
  }

  var lista = turnos.listar();
  var parametros = new URLSearchParams(window.location.search);
  var idSolicitado = parametros.get("turno");

  function nombreColaborador(id) {
    var encontrado = datos.colaboradores.find(function (item) {
      return item.id === id;
    });
    return encontrado ? encontrado.nombre : "Colaborador no identificado";
  }

  function horas(valor) {
    var redondeado = Math.round(valor * 10) / 10;
    return utils.formatoNumero(redondeado, Number.isInteger(redondeado) ? 0 : 1) + " h";
  }

  function textoHora(fecha) {
    return fecha instanceof Date ? turnos.horaDe(fecha) : "—";
  }

  function textoFecha(fecha) {
    return fecha instanceof Date ? utils.formatoFecha(fecha) : "—";
  }

  function clasesEstado(estado) {
    if (estado === "valido") {
      return { clase: "slint-badge--valido", texto: "Válido" };
    }
    if (estado === "advertencia") {
      return { clase: "slint-badge--advertencia", texto: "Con advertencia" };
    }
    return { clase: "slint-badge--error", texto: "Con error" };
  }

  function llenarSelector() {
    selector.innerHTML = lista
      .map(function (turno) {
        var tipo = turnos.tipoDe(turno) === "partido" ? "partido" : "continuo";
        var etiqueta =
          nombreColaborador(turno.colaboradorId) + " · " + turno.fecha + " · " + tipo;
        return '<option value="' + turno.id + '">' + etiqueta + "</option>";
      })
      .join("");
  }

  function filaTramo(nombre, inicio, fin, duracion) {
    return (
      "<tr>" +
      '<th scope="row" data-label="Tramo">' + nombre + "</th>" +
      '<td data-label="Inicio">' + textoFecha(inicio) + " " + textoHora(inicio) + "</td>" +
      '<td data-label="Fin">' + textoFecha(fin) + " " + textoHora(fin) + "</td>" +
      '<td data-label="Duración">' + (duracion > 0 ? horas(duracion) : "—") + "</td>" +
      "</tr>"
    );
  }

  function render(id) {
    var turno = turnos.obtener(id) || lista[0];
    if (!turno) {
      selector.disabled = true;
      detalle.innerHTML = "";
      sinTurno.hidden = false;
      return;
    }

    sinTurno.hidden = true;
    selector.disabled = false;
    selector.value = turno.id;

    var resultado = turnos.evaluar(turno);
    var estado = clasesEstado(resultado.estado);
    var tipo = resultado.tipo === "partido" ? "Turno partido" : "Turno continuo";
    var filas =
      filaTramo("Tramo 1", resultado.inicio1, resultado.fin1, resultado.duracion1) +
      (resultado.tipo === "partido"
        ? filaTramo("Tramo 2", resultado.inicio2, resultado.fin2, resultado.duracion2)
        : "");

    var hallazgos = resultado.hallazgos.length
      ? resultado.hallazgos
          .map(function (hallazgo) {
            return (
              '<div class="slint-hallazgo slint-hallazgo--' + hallazgo.tipo + '"' +
              (hallazgo.tipo === "error" ? ' role="alert"' : ' role="status"') +
              ">" +
              '<span class="slint-badge slint-badge--' +
              (hallazgo.tipo === "error" ? "error" : "advertencia") +
              '">' +
              (hallazgo.tipo === "error" ? "Error" : "Advertencia") +
              "</span>" +
              "<span>" + hallazgo.mensaje + "</span>" +
              "</div>"
            );
          })
          .join("")
      : '<div class="slint-mensaje slint-mensaje--exito" role="status"><span><strong>Sin hallazgos.</strong> El turno es válido para continuar.</span></div>';

    var continuar =
      resultado.estado === "error"
        ? '<span class="slint-boton is-pendiente" aria-disabled="true">Corrija los errores para continuar</span>'
        : '<a class="slint-boton" href="consulta-turnos.html">Continuar a consulta (INT-05)</a>';

    detalle.innerHTML =
      '<div class="slint-turno-resumen">' +
      '<div class="slint-panel">' +
      '<div class="slint-seccion__cabecera">' +
      "<h2>" + nombreColaborador(turno.colaboradorId) + "</h2>" +
      '<span class="slint-badge ' + estado.clase + '">' + estado.texto + "</span>" +
      "</div>" +
      '<dl class="slint-resumen slint-mt-3">' +
      '<div class="slint-resumen__dato"><dt>Fecha</dt><dd>' + turno.fecha + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Tipo</dt><dd>' + tipo + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Duración total</dt><dd>' + horas(resultado.duracionTotal) + "</dd></div>" +
      '<div class="slint-resumen__dato"><dt>Origen</dt><dd>' + (turno.origen === "demo" ? "Demostración" : "Registro manual") + "</dd></div>" +
      "</dl>" +
      "</div>" +
      '<div class="slint-panel">' +
      "<h3>Tramos y duraciones</h3>" +
      '<div class="slint-tabla-contenedor slint-mt-3">' +
      '<table class="slint-tabla slint-tabla--apilada">' +
      "<caption>Detalle temporal del turno</caption>" +
      "<thead><tr><th scope=\"col\">Tramo</th><th scope=\"col\">Inicio</th><th scope=\"col\">Fin</th><th scope=\"col\">Duración</th></tr></thead>" +
      "<tbody>" + filas + "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>" +
      '<div class="slint-panel">' +
      "<h3>Hallazgos</h3>" +
      '<div class="slint-hallazgos slint-mt-3">' + hallazgos + "</div>" +
      "</div>" +
      '<div class="slint-flex">' +
      '<a class="slint-boton slint-boton--secundario" href="registro-turno.html?turno=' +
      encodeURIComponent(turno.id) + '">Corregir en INT-03</a>' +
      continuar +
      '<a class="slint-boton slint-boton--secundario" href="consulta-turnos.html">Volver a consulta</a>' +
      "</div>" +
      "</div>";

    if (window.location.search.indexOf("turno=" + turno.id) === -1) {
      window.history.replaceState(null, "", "?turno=" + encodeURIComponent(turno.id));
    }
  }

  llenarSelector();

  if (!lista.length) {
    selector.disabled = true;
    sinTurno.hidden = false;
    detalle.innerHTML = "";
    return;
  }

  var idInicial = idSolicitado && turnos.obtener(idSolicitado) ? idSolicitado : lista[0].id;
  render(idInicial);

  selector.addEventListener("change", function () {
    render(selector.value);
  });
})();
