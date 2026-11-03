/* SLINT — INT-01 Acceso (demostración, sin autenticación real) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;

  var form = utils.qs("#form-acceso");
  if (!form) {
    return;
  }

  var usuario = utils.qs("#usuario");
  var contrasena = utils.qs("#contrasena");
  var errorUsuario = utils.qs("#error-usuario");
  var errorContrasena = utils.qs("#error-contrasena");
  var mensajeGeneral = utils.qs("#mensaje-acceso");

  var CREDENCIALES = {
    usuario: "aprendiz",
    contrasena: "slint2026"
  };

  function marcarCampo(campo, contenedorError, mensaje) {
    if (mensaje) {
      campo.setAttribute("aria-invalid", "true");
      contenedorError.textContent = mensaje;
      contenedorError.hidden = false;
    } else {
      campo.removeAttribute("aria-invalid");
      contenedorError.textContent = "";
      contenedorError.hidden = true;
    }
  }

  function limpiarGeneral() {
    mensajeGeneral.innerHTML = "";
  }

  function limpiarErrores() {
    marcarCampo(usuario, errorUsuario, "");
    marcarCampo(contrasena, errorContrasena, "");
    limpiarGeneral();
  }

  function validar() {
    var errores = [];
    var usuarioTexto = usuario.value.trim();
    var contrasenaTexto = contrasena.value;

    if (!usuarioTexto) {
      marcarCampo(usuario, errorUsuario, "Ingrese el usuario.");
      errores.push(usuario);
    } else {
      marcarCampo(usuario, errorUsuario, "");
    }

    if (!contrasenaTexto) {
      marcarCampo(contrasena, errorContrasena, "Ingrese la contraseña.");
      errores.push(contrasena);
    } else {
      marcarCampo(contrasena, errorContrasena, "");
    }

    return errores;
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarGeneral();

    var invalidos = validar();
    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    var usuarioTexto = usuario.value.trim().toLowerCase();
    var contrasenaTexto = contrasena.value;

    if (usuarioTexto === CREDENCIALES.usuario && contrasenaTexto === CREDENCIALES.contrasena) {
      utils.almacen.set("sesion", {
        usuario: CREDENCIALES.usuario,
        demo: true,
        inicio: new Date().toISOString()
      });
      window.location.href = "dashboard.html";
      return;
    }

    mensajeGeneral.innerHTML = componentes.alerta(
      "error",
      "<strong>Credenciales incorrectas (demo).</strong> " +
        "Use el usuario <code>aprendiz</code> y la contraseña <code>slint2026</code>."
    );
    contrasena.focus();
    contrasena.select();
  });

  [usuario, contrasena].forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo === usuario) {
        marcarCampo(usuario, errorUsuario, "");
      } else {
        marcarCampo(contrasena, errorContrasena, "");
      }
      limpiarGeneral();
    });
  });
})();
