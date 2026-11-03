/* SLINT — INT-13 Exportación de resultados demo a CSV */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var datos = window.SLINT.datos;
  var demo = window.SLINT.liquidacionesDemo;

  var form = utils.qs("#filtros-exportacion");
  var filtroColaborador = utils.qs("#filtro-colaborador");
  var filtroDesde = utils.qs("#filtro-desde");
  var filtroHasta = utils.qs("#filtro-hasta");
  var mensaje = utils.qs("#mensaje-exportacion");
  var tabla = utils.qs("#tabla-exportacion");
  var vacio = utils.qs("#sin-exportacion");
  var contador = utils.qs("#contador-exportacion");
  var boton = utils.qs("#btn-csv");

  if (!form || !tabla || !demo) {
    return;
  }

  var listaActual = [];

  function nombreColaborador(id) {
    var encontrado = datos.colaboradores.find(function (item) {
      return item.id === id;
    });
    return encontrado ? encontrado.nombre : "Colaborador no identificado";
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
      opcion.textContent = nombreColaborador(ejemplo.colaboradorId);
      filtroColaborador.appendChild(opcion);
    });
  }

  function fechaDe(ejemplo) {
    return utils.parseFecha(ejemplo.turno.fecha);
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
      var fecha = fechaDe(ejemplo);
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
    listaActual = filtrar();
    contador.textContent =
      listaActual.length + (listaActual.length === 1 ? " registro" : " registros");

    if (!listaActual.length) {
      tabla.innerHTML = "";
      vacio.hidden = false;
      boton.disabled = true;
      return;
    }

    vacio.hidden = true;
    boton.disabled = false;

    var filas = listaActual
      .map(function (ejemplo) {
        return (
          "<tr>" +
          '<th scope="row" data-label="ID">' + ejemplo.id + "</th>" +
          '<td data-label="Colaborador">' + nombreColaborador(ejemplo.colaboradorId) + "</td>" +
          '<td data-label="Fecha">' + ejemplo.turno.fecha + "</td>" +
          '<td data-label="Ejemplo">' + ejemplo.titulo + "</td>" +
          '<td data-label="Horas">' + utils.formatoNumero(ejemplo.totalHoras, 2) + "</td>" +
          '<td data-label="Total COP">' + utils.formatoCOP(ejemplo.total) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    tabla.innerHTML =
      '<table class="slint-tabla slint-tabla--numeros slint-tabla--apilada">' +
      "<caption>Liquidaciones de demostración para exportar</caption>" +
      '<thead><tr><th scope="col">ID</th><th scope="col">Colaborador</th>' +
      '<th scope="col">Fecha</th><th scope="col">Ejemplo</th>' +
      '<th scope="col">Horas</th><th scope="col">Total COP</th></tr></thead>' +
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

  boton.addEventListener("click", function () {
    if (!listaActual.length) {
      return;
    }

    var filas = listaActual.map(function (ejemplo) {
      return [
        ejemplo.id,
        nombreColaborador(ejemplo.colaboradorId),
        ejemplo.turno.fecha,
        ejemplo.titulo,
        ejemplo.totalHoras,
        ejemplo.total
      ];
    });

    utils.descargarCSV(
      "slint-liquidaciones-demo.csv",
      ["ID", "Colaborador", "Fecha", "Ejemplo", "Horas", "Total COP"],
      filas
    );

    mensaje.innerHTML =
      '<div class="slint-mensaje slint-mensaje--exito" role="status"><span>' +
      "<strong>CSV generado.</strong> Se descargaron " + listaActual.length +
      " registros ficticios en el navegador.</span></div>";
  });

  cargarColaboradores();

  var parametros = new URLSearchParams(window.location.search);
  var colaboradorSolicitado = parametros.get("colaborador");
  if (
    colaboradorSolicitado &&
    filtroColaborador.querySelector('option[value="' + colaboradorSolicitado + '"]')
  ) {
    filtroColaborador.value = colaboradorSolicitado;
  }

  render();
})();
