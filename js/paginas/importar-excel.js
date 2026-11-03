/* SLINT — INT-06 Importación simulada desde Excel (sin lectura real) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;

  var archivo = utils.qs("#archivo");
  var errorArchivo = utils.qs("#error-archivo");
  var archivoInfo = utils.qs("#archivo-info");
  var mensaje = utils.qs("#mensaje-importacion");
  var vistaPrevia = utils.qs("#vista-previa");
  var btnConfirmar = utils.qs("#btn-confirmar");
  var resultado = utils.qs("#resultado-importacion");

  if (!archivo || !btnConfirmar) {
    return;
  }

  var MAXIMO_BYTES = 5 * 1024 * 1024;
  var EXTENSIONES = ["xlsx", "xls"];

  function formatoBytes(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    }
    if (bytes < 1024 * 1024) {
      return utils.formatoNumero(bytes / 1024, 1) + " KB";
    }
    return utils.formatoNumero(bytes / (1024 * 1024), 2) + " MB";
  }

  function extensionDe(nombre) {
    var partes = nombre.toLowerCase().split(".");
    return partes.length > 1 ? partes[partes.length - 1] : "";
  }

  function mostrarError(texto) {
    archivo.setAttribute("aria-invalid", "true");
    errorArchivo.textContent = texto;
    errorArchivo.hidden = false;
    vistaPrevia.hidden = true;
    btnConfirmar.disabled = true;
    archivoInfo.textContent = "";
    mensaje.innerHTML = "";
    resultado.innerHTML = "";
  }

  function limpiarError() {
    archivo.removeAttribute("aria-invalid");
    errorArchivo.textContent = "";
    errorArchivo.hidden = true;
  }

  archivo.addEventListener("change", function () {
    limpiarError();
    resultado.innerHTML = "";

    var seleccionado = archivo.files && archivo.files[0];

    if (!seleccionado) {
      mostrarError("Seleccione un archivo .xlsx o .xls.");
      return;
    }

    if (EXTENSIONES.indexOf(extensionDe(seleccionado.name)) === -1) {
      mostrarError("Extensión no permitida. Seleccione un archivo .xlsx o .xls.");
      return;
    }

    if (seleccionado.size === 0) {
      mostrarError("El archivo está vacío. Seleccione otro archivo.");
      return;
    }

    if (seleccionado.size > MAXIMO_BYTES) {
      mostrarError("El archivo supera el tamaño máximo de 5 MB.");
      return;
    }

    archivoInfo.textContent =
      "Archivo seleccionado: " + seleccionado.name + " · " + formatoBytes(seleccionado.size);
    vistaPrevia.hidden = false;
    btnConfirmar.disabled = false;
    mensaje.innerHTML = componentes.alerta(
      "info",
      "<strong>Archivo válido para la demostración.</strong> " +
        "La extensión y el tamaño son correctos. El contenido no se ha leído."
    );
  });

  btnConfirmar.addEventListener("click", function () {
    var seleccionado = archivo.files && archivo.files[0];

    resultado.innerHTML = componentes.alerta(
      "demo",
      "<strong>Importación simulada completada.</strong> " +
        "No se agregaron turnos a la consulta. " +
        (seleccionado ? "Archivo de referencia: " + seleccionado.name + "." : "")
    );
    btnConfirmar.disabled = true;

    utils.almacen.set("flash", {
      tipo: "demo",
      texto:
        "<strong>Importación simulada.</strong> El archivo no se procesó y no se agregaron turnos."
    });
  });
})();
