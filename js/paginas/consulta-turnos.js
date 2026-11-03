/* SLINT — INT-05 Consulta de turnos */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var datos = window.SLINT.datos;
  var turnos = window.SLINT.turnos;

  var form = utils.qs("#filtros-turnos");
  var filtroColaborador = utils.qs("#filtro-colaborador");
  var filtroFecha = utils.qs("#filtro-fecha");
  var filtroTipo = utils.qs("#filtro-tipo");
  var contenedor = utils.qs("#tabla-turnos");
  var sinResultados = utils.qs("#sin-resultados");
  var contador = utils.qs("#contador-turnos");
  var flash = utils.qs("#flash-turnos");

  if (!form || !contenedor) {
    return;
  }

  function nombreColaborador(id) {
    var encontrado = datos.colaboradores.find(function (item) {
      return item.id === id;
    });
    return encontrado ? encontrado.nombre : "Colaborador no identificado";
  }

  function mostrarFlash() {
    var mensaje = utils.almacen.get("flash", null);
    if (!mensaje || !flash) {
      return;
    }
    flash.innerHTML = componentes.alerta(mensaje.tipo || "info", mensaje.texto || "");
    utils.almacen.remove("flash");
  }

  function cargarFiltroColaboradores() {
    datos.colaboradores.forEach(function (item) {
      var opcion = document.createElement("option");
      opcion.value = item.id;
      opcion.textContent = item.nombre;
      filtroColaborador.appendChild(opcion);
    });
  }

  function rango(turno) {
    if (!turno.entrada1 || !turno.salida1) {
      return "—";
    }
    return (
      turno.entrada1 +
      " → " +
      turno.salida1 +
      (turno.cruce1 ? " (+1)" : "") +
      (turno.entrada2
        ? " / " + turno.entrada2 + " → " + (turno.salida2 || "—") + (turno.cruce2 ? " (+1)" : "")
        : "")
    );
  }

  function clasesEstado(estado) {
    if (estado === "valido") {
      return { clase: "slint-badge--valido", texto: "Válido" };
    }
    if (estado === "advertencia") {
      return { clase: "slint-badge--advertencia", texto: "Advertencia" };
    }
    return { clase: "slint-badge--error", texto: "Con error" };
  }

  function coincide(turno) {
    if (filtroColaborador.value && turno.colaboradorId !== filtroColaborador.value) {
      return false;
    }
    if (filtroFecha.value && turno.fecha !== filtroFecha.value) {
      return false;
    }
    if (filtroTipo.value && turnos.tipoDe(turno) !== filtroTipo.value) {
      return false;
    }
    return true;
  }

  function render() {
    var lista = turnos.listar().filter(coincide);

    contador.textContent =
      lista.length + (lista.length === 1 ? " turno" : " turnos");

    if (!lista.length) {
      contenedor.innerHTML = "";
      sinResultados.hidden = false;
      return;
    }

    sinResultados.hidden = true;

    var filas = lista
      .map(function (turno) {
        var resultado = turnos.evaluar(turno);
        var estado = clasesEstado(resultado.estado);
        var tipo = turnos.tipoDe(turno) === "partido" ? "Partido" : "Continuo";

        return (
          "<tr>" +
          '<th scope="row" data-label="Colaborador">' + nombreColaborador(turno.colaboradorId) + "</th>" +
          '<td data-label="Fecha">' + turno.fecha + "</td>" +
          '<td data-label="Tipo">' + tipo + "</td>" +
          '<td data-label="Horario">' + rango(turno) + "</td>" +
          '<td data-label="Duración">' +
          (resultado.duracionTotal > 0 ? utils.formatoNumero(resultado.duracionTotal, 1) + " h" : "—") +
          "</td>" +
          '<td data-label="Estado"><span class="slint-badge ' + estado.clase + '">' + estado.texto + "</span></td>" +
          '<td data-label="Acciones">' +
          '<div class="slint-acciones-tabla">' +
          '<a class="slint-enlace-accion" href="validacion-horarios.html?turno=' +
          encodeURIComponent(turno.id) + '">Validar</a>' +
          '<span class="slint-badge slint-badge--neutro" aria-disabled="true">Liquidar · pendiente</span>' +
          "</div>" +
          "</td>" +
          "</tr>"
        );
      })
      .join("");

    contenedor.innerHTML =
      '<table class="slint-tabla slint-tabla--apilada">' +
      "<caption>Turnos de demostración y registros de la sesión</caption>" +
      "<thead><tr>" +
      '<th scope="col">Colaborador</th>' +
      '<th scope="col">Fecha</th>' +
      '<th scope="col">Tipo</th>' +
      '<th scope="col">Horario</th>' +
      '<th scope="col">Duración</th>' +
      '<th scope="col">Estado</th>' +
      '<th scope="col">Acciones</th>' +
      "</tr></thead>" +
      "<tbody>" + filas + "</tbody>" +
      "</table>";
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    render();
  });

  form.addEventListener("reset", function () {
    window.setTimeout(render, 0);
  });

  cargarFiltroColaboradores();
  mostrarFlash();
  render();
})();
