/* SLINT — INT-03 Registro de turno */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var datos = window.SLINT.datos;
  var turnos = window.SLINT.turnos;

  var form = utils.qs("#form-turno");
  if (!form) {
    return;
  }

  var colaborador = utils.qs("#colaborador");
  var fecha = utils.qs("#fecha");
  var entrada1 = utils.qs("#entrada1");
  var salida1 = utils.qs("#salida1");
  var cruce1 = utils.qs("#cruce1");
  var chkTramo2 = utils.qs("#chk-tramo2");
  var tramo2 = utils.qs("#tramo2");
  var entrada2 = utils.qs("#entrada2");
  var salida2 = utils.qs("#salida2");
  var cruce2 = utils.qs("#cruce2");
  var mensaje = utils.qs("#mensaje-registro");
  var titulo = utils.qs("#titulo-pagina");
  var botonGuardar = utils.qs("#btn-guardar");

  var errores = {
    colaborador: { campo: colaborador, contenedor: utils.qs("#error-colaborador") },
    fecha: { campo: fecha, contenedor: utils.qs("#error-fecha") },
    entrada1: { campo: entrada1, contenedor: utils.qs("#error-entrada1") },
    salida1: { campo: salida1, contenedor: utils.qs("#error-salida1") },
    entrada2: { campo: entrada2, contenedor: utils.qs("#error-entrada2") },
    salida2: { campo: salida2, contenedor: utils.qs("#error-salida2") }
  };

  function marcar(clave, texto) {
    var item = errores[clave];
    if (!item) {
      return;
    }
    if (texto) {
      item.campo.setAttribute("aria-invalid", "true");
      item.contenedor.textContent = texto;
      item.contenedor.hidden = false;
    } else {
      item.campo.removeAttribute("aria-invalid");
      item.contenedor.textContent = "";
      item.contenedor.hidden = true;
    }
  }

  function limpiarErrores() {
    Object.keys(errores).forEach(function (clave) {
      marcar(clave, "");
    });
    mensaje.innerHTML = "";
  }

  function cargarColaboradores() {
    datos.colaboradores.forEach(function (item) {
      var opcion = document.createElement("option");
      opcion.value = item.id;
      opcion.textContent = item.nombre + " · " + item.rol;
      colaborador.appendChild(opcion);
    });
  }

  function aplicarTramo2() {
    var activo = chkTramo2.checked;
    tramo2.hidden = !activo;
    [entrada2, salida2, cruce2].forEach(function (campo) {
      campo.disabled = !activo;
    });
    entrada2.required = activo;
    salida2.required = activo;
    if (!activo) {
      marcar("entrada2", "");
      marcar("salida2", "");
    }
  }

  var parametros = new URLSearchParams(window.location.search);
  var idEdicion = parametros.get("turno");
  var turnoEdicion = idEdicion ? turnos.obtener(idEdicion) : null;

  function precargar() {
    if (!turnoEdicion) {
      return;
    }
    colaborador.value = turnoEdicion.colaboradorId;
    fecha.value = turnoEdicion.fecha;
    entrada1.value = turnoEdicion.entrada1;
    salida1.value = turnoEdicion.salida1;
    cruce1.checked = Boolean(turnoEdicion.cruce1);
    if (turnoEdicion.entrada2 || turnoEdicion.salida2) {
      chkTramo2.checked = true;
      aplicarTramo2();
      entrada2.value = turnoEdicion.entrada2 || "";
      salida2.value = turnoEdicion.salida2 || "";
      cruce2.checked = Boolean(turnoEdicion.cruce2);
    }
    titulo.textContent = "Editar turno";
    botonGuardar.textContent = "Guardar cambios";
  }

  function validarCampos() {
    var invalidos = [];
    var fechaValida = utils.parseFecha(fecha.value);
    var activo2 = chkTramo2.checked;

    if (!colaborador.value) {
      marcar("colaborador", "Seleccione un colaborador.");
      invalidos.push(colaborador);
    }

    if (!fecha.value || !fechaValida) {
      marcar("fecha", "Seleccione una fecha válida.");
      invalidos.push(fecha);
    }

    if (!utils.esHoraValida(entrada1.value)) {
      marcar("entrada1", "Ingrese una hora de entrada válida (HH:MM).");
      invalidos.push(entrada1);
    }

    if (!utils.esHoraValida(salida1.value)) {
      marcar("salida1", "Ingrese una hora de salida válida (HH:MM).");
      invalidos.push(salida1);
    }

    if (activo2) {
      if (!utils.esHoraValida(entrada2.value)) {
        marcar("entrada2", "Ingrese una hora de entrada válida para el tramo 2.");
        invalidos.push(entrada2);
      }
      if (!utils.esHoraValida(salida2.value)) {
        marcar("salida2", "Ingrese una hora de salida válida para el tramo 2.");
        invalidos.push(salida2);
      }
    }

    return invalidos;
  }

  function construirTurno() {
    var activo2 = chkTramo2.checked;
    return {
      id: turnoEdicion ? turnoEdicion.id : turnos.crearId(),
      colaboradorId: colaborador.value,
      fecha: fecha.value,
      entrada1: entrada1.value,
      salida1: salida1.value,
      cruce1: cruce1.checked,
      entrada2: activo2 ? entrada2.value : null,
      salida2: activo2 ? salida2.value : null,
      cruce2: activo2 ? cruce2.checked : false,
      origen: turnoEdicion ? turnoEdicion.origen || "manual" : "manual",
      creado: turnoEdicion ? turnoEdicion.creado : new Date().toISOString()
    };
  }

  chkTramo2.addEventListener("change", aplicarTramo2);
  cargarColaboradores();
  aplicarTramo2();
  precargar();

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores();

    var invalidos = validarCampos();
    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    var turno = construirTurno();
    var resultado = turnos.evaluar(turno);
    var bloqueantes = resultado.hallazgos.filter(function (hallazgo) {
      return hallazgo.tipo === "error";
    });

    if (bloqueantes.length) {
      var detalle = bloqueantes
        .map(function (hallazgo) {
          return "<li>" + hallazgo.mensaje + "</li>";
        })
        .join("");
      mensaje.innerHTML = componentes.alerta(
        "error",
        "<strong>No se guardó el turno.</strong><ul>" + detalle + "</ul>"
      );
      if (bloqueantes.some(function (hallazgo) { return /tramo 2|salida 2|solapa/i.test(hallazgo.mensaje); })) {
        marcar("salida2", "Revise la cronología del tramo 2.");
        salida2.focus();
      } else if (bloqueantes.some(function (hallazgo) { return /tramo 1|salida 1/i.test(hallazgo.mensaje); })) {
        marcar("salida1", "Revise la cronología del tramo 1.");
        salida1.focus();
      }
      return;
    }

    turnos.guardar(turno);

    var advertencias = resultado.hallazgos.filter(function (hallazgo) {
      return hallazgo.tipo === "advertencia";
    });
    var notaAdvertencia = advertencias.length
      ? '<p class="slint-mt-2"><strong>Advertencia:</strong> ' + advertencias[0].mensaje + "</p>"
      : "";
    var accion = turnoEdicion ? "actualizado" : "registrado";

    mensaje.innerHTML =
      componentes.alerta(
        "exito",
        "<strong>Turno " + accion + " (demo).</strong> " +
          "Se guardó temporalmente en la sesión del navegador." +
          notaAdvertencia
      ) +
      '<div class="slint-flex slint-mt-3">' +
      '<a class="slint-boton" href="validacion-horarios.html?turno=' +
      encodeURIComponent(turno.id) + '">Validar ahora</a>' +
      '<a class="slint-boton slint-boton--secundario" href="consulta-turnos.html">Ir a consulta</a>' +
      '<a class="slint-boton slint-boton--secundario" href="registro-turno.html">Registrar otro</a>' +
      "</div>";
    mensaje.focus();
  });
})();
