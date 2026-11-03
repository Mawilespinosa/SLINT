/* SLINT — INT-16 Parámetros laborales (demostración visual) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var admin = window.SLINT.administracionDemo;

  var tabla = utils.qs("#tabla-parametros");
  var contador = utils.qs("#contador-parametros");
  var form = utils.qs("#form-parametro");
  var nombre = utils.qs("#parametro-nombre");
  var valor = utils.qs("#parametro-valor");
  var desde = utils.qs("#parametro-desde");
  var hasta = utils.qs("#parametro-hasta");
  var mensaje = utils.qs("#mensaje-parametro");
  var errorNombre = utils.qs("#error-parametro-nombre");
  var errorValor = utils.qs("#error-parametro-valor");
  var errorDesde = utils.qs("#error-parametro-desde");
  var errorHasta = utils.qs("#error-parametro-hasta");

  if (!tabla || !form || !admin) {
    return;
  }

  function renderParametros() {
    contador.textContent =
      admin.parametros.length +
      (admin.parametros.length === 1 ? " parámetro" : " parámetros");

    var filas = admin.parametros
      .map(function (parametro) {
        return (
          "<tr>" +
          '<th scope="row" data-label="Parámetro">' + parametro.nombre + "</th>" +
          '<td data-label="Valor">' + parametro.valor + "</td>" +
          '<td data-label="Vigente desde">' + parametro.desde + "</td>" +
          '<td data-label="Vigente hasta">' + parametro.hasta + "</td>" +
          '<td data-label="Estado"><span class="slint-badge ' +
          (parametro.estado === "Vigente" ? "slint-badge--valido" : "slint-badge--neutro") +
          '">' + parametro.estado + "</span></td>" +
          "</tr>"
        );
      })
      .join("");

    tabla.innerHTML =
      '<table class="slint-tabla slint-tabla--apilada">' +
      "<caption>Parámetros laborales de demostración</caption>" +
      '<thead><tr><th scope="col">Parámetro</th><th scope="col">Valor</th>' +
      '<th scope="col">Vigente desde</th><th scope="col">Vigente hasta</th>' +
      '<th scope="col">Estado</th></tr></thead>' +
      "<tbody>" + filas + "</tbody></table>";
  }

  function marcar(campo, contenedor, texto) {
    if (texto) {
      campo.setAttribute("aria-invalid", "true");
      contenedor.textContent = texto;
      contenedor.hidden = false;
    } else {
      campo.removeAttribute("aria-invalid");
      contenedor.textContent = "";
      contenedor.hidden = true;
    }
  }

  function limpiar() {
    marcar(nombre, errorNombre, "");
    marcar(valor, errorValor, "");
    marcar(desde, errorDesde, "");
    marcar(hasta, errorHasta, "");
    mensaje.innerHTML = "";
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiar();

    var invalidos = [];
    var fechaDesde = desde.value ? utils.parseFecha(desde.value) : null;
    var fechaHasta = hasta.value ? utils.parseFecha(hasta.value) : null;

    if (!nombre.value.trim()) {
      marcar(nombre, errorNombre, "Ingrese el nombre del parámetro.");
      invalidos.push(nombre);
    }
    if (!valor.value.trim()) {
      marcar(valor, errorValor, "Ingrese el valor del parámetro.");
      invalidos.push(valor);
    } else if (!/\d/.test(valor.value)) {
      marcar(valor, errorValor, "El valor debe incluir una cifra.");
      invalidos.push(valor);
    }
    if (!fechaDesde) {
      marcar(desde, errorDesde, "Seleccione una fecha de inicio válida.");
      invalidos.push(desde);
    }
    if (!fechaHasta) {
      marcar(hasta, errorHasta, "Seleccione una fecha de fin válida.");
      invalidos.push(hasta);
    }
    if (fechaDesde && fechaHasta && fechaDesde.getTime() > fechaHasta.getTime()) {
      marcar(hasta, errorHasta, "La fecha de fin no puede ser anterior a la de inicio.");
      invalidos.push(hasta);
    }

    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    mensaje.innerHTML = componentes.alerta(
      "demo",
      "<strong>Validación correcta.</strong> No se guardó el parámetro: " +
        "esta pantalla es una demostración sin persistencia."
    );
  });

  [nombre, valor, desde, hasta].forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo === nombre) {
        marcar(nombre, errorNombre, "");
      } else if (campo === valor) {
        marcar(valor, errorValor, "");
      } else if (campo === desde) {
        marcar(desde, errorDesde, "");
      } else {
        marcar(hasta, errorHasta, "");
      }
    });
  });

  renderParametros();
})();
