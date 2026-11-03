/* SLINT — INT-14 Historial de liquidaciones demo */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var ui = window.SLINT.liquidacionUI;
  var demo = window.SLINT.liquidacionesDemo;

  var form = utils.qs("#filtros-historial");
  var filtroColaborador = utils.qs("#historial-colaborador");
  var filtroDesde = utils.qs("#historial-desde");
  var filtroHasta = utils.qs("#historial-hasta");
  var mensaje = utils.qs("#mensaje-historial");
  var tabla = utils.qs("#tabla-historial");
  var vacio = utils.qs("#sin-historial");
  var contador = utils.qs("#contador-historial");

  if (!form || !tabla || !demo) {
    return;
  }

  function cargarColaboradores() {
    demo.ejemplos.forEach(function (ejemplo) {
      if (
        filtroColaborador.querySelector(
          'option[value="' + ejemplo.colaboradorId + '"]'
        )
      ) {
        return;
      }
      var opcion = document.createElement("option");
      opcion.value = ejemplo.colaboradorId;
      opcion.textContent = ui.nombreColaborador(ejemplo.colaboradorId);
      filtroColaborador.appendChild(opcion);
    });
  }

  function validarFiltros() {
    var desde = filtroDesde.value ? utils.parseFecha(filtroDesde.value) : null;
    var hasta = filtroHasta.value ? utils.parseFecha(filtroHasta.value) : null;
    if (filtroDesde.value && !desde) {
      return "La fecha desde no es válida.";
    }
    if (filtroHasta.value && !hasta) {
      return "La fecha hasta no es válida.";
    }
    if (desde && hasta && desde.getTime() > hasta.getTime()) {
      return "La fecha desde no puede ser posterior a la fecha hasta.";
    }
    return "";
  }

  function filtrar() {
    var colaborador = filtroColaborador.value;
    var desde = filtroDesde.value ? utils.parseFecha(filtroDesde.value) : null;
    var hasta = filtroHasta.value ? utils.parseFecha(filtroHasta.value) : null;

    return demo.ejemplos.filter(function (ejemplo) {
      var fecha = utils.parseFecha(ejemplo.turno.fecha);
      if (!fecha) {
        return false;
      }
      if (colaborador && ejemplo.colaboradorId !== colaborador) {
        return false;
      }
      if (desde && fecha.getTime() < desde.getTime()) {
        return false;
      }
      if (hasta && fecha.getTime() > hasta.getTime()) {
        return false;
      }
      return true;
    });
  }

  function render() {
    var lista = filtrar();
    var actual = ui.actual();

    contador.textContent =
      lista.length + (lista.length === 1 ? " registro" : " registros");

    if (!lista.length) {
      tabla.innerHTML = "";
      vacio.hidden = false;
      return;
    }

    vacio.hidden = true;

    var filas = lista
      .map(function (ejemplo) {
        var seleccionada = actual && actual.id === ejemplo.id;
        return (
          "<tr>" +
          '<th scope="row" data-label="ID">' + ejemplo.id + "</th>" +
          '<td data-label="Ejemplo">' + ejemplo.titulo + "</td>" +
          '<td data-label="Colaborador">' + ui.nombreColaborador(ejemplo.colaboradorId) + "</td>" +
          '<td data-label="Fecha">' + ejemplo.turno.fecha + "</td>" +
          '<td data-label="Horas">' + ui.horas(ejemplo.totalHoras) + "</td>" +
          '<td data-label="Total COP">' + ui.pesos(ejemplo.total) + "</td>" +
          '<td data-label="Estado"><span class="slint-badge slint-badge--demo">Demo</span>' +
          (seleccionada ? ' <span class="slint-badge slint-badge--valido">Seleccionada</span>' : "") +
          "</td>" +
          '<td data-label="Acciones">' +
          '<div class="slint-acciones-tabla">' +
          '<button class="slint-boton slint-boton--pequeno" type="button" data-accion="ver" data-id="' +
          ejemplo.id + '">Ver resumen</button>' +
          '<button class="slint-boton slint-boton--secundario slint-boton--pequeno" type="button" data-accion="exportar" data-colaborador="' +
          ejemplo.colaboradorId + '">Exportar</button>' +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");

    tabla.innerHTML =
      '<table class="slint-tabla slint-tabla--numeros slint-tabla--apilada">' +
      "<caption>Liquidaciones de demostración</caption>" +
      '<thead><tr><th scope="col">ID</th><th scope="col">Ejemplo</th>' +
      '<th scope="col">Colaborador</th><th scope="col">Fecha</th>' +
      '<th scope="col">Horas</th><th scope="col">Total COP</th>' +
      '<th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>' +
      "<tbody>" + filas + "</tbody></table>";
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var error = validarFiltros();
    if (error) {
      mensaje.innerHTML =
        '<div class="slint-mensaje slint-mensaje--error" role="alert"><span>' +
        error + "</span></div>";
      return;
    }
    mensaje.innerHTML = "";
    render();
  });

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      mensaje.innerHTML = "";
      render();
    }, 0);
  });

  tabla.addEventListener("click", function (evento) {
    var boton = evento.target.closest("button[data-accion]");
    if (!boton) {
      return;
    }

    if (boton.getAttribute("data-accion") === "ver") {
      var id = boton.getAttribute("data-id");
      if (!ui.seleccionar(id)) {
        mensaje.innerHTML =
          '<div class="slint-mensaje slint-mensaje--error" role="alert"><span>' +
          "No se pudo guardar la selección de la liquidación.</span></div>";
        return;
      }
      window.location.href = "resumen-liquidacion.html";
      return;
    }

    if (boton.getAttribute("data-accion") === "exportar") {
      window.location.href =
        "exportacion.html?colaborador=" +
        encodeURIComponent(boton.getAttribute("data-colaborador"));
    }
  });

  cargarColaboradores();
  render();
})();
