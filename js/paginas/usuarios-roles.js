/* SLINT — INT-15 Usuarios y roles (demostración visual) */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var componentes = window.SLINT.componentes;
  var admin = window.SLINT.administracionDemo;

  var tabla = utils.qs("#tabla-usuarios");
  var listaRoles = utils.qs("#lista-roles");
  var contador = utils.qs("#contador-usuarios");
  var form = utils.qs("#form-usuario");
  var nombre = utils.qs("#usuario-nombre");
  var correo = utils.qs("#usuario-correo");
  var rol = utils.qs("#usuario-rol");
  var mensaje = utils.qs("#mensaje-usuario");
  var errorNombre = utils.qs("#error-usuario-nombre");
  var errorCorreo = utils.qs("#error-usuario-correo");
  var errorRol = utils.qs("#error-usuario-rol");

  if (!tabla || !form || !admin) {
    return;
  }

  function nombreRol(id) {
    var encontrado = admin.rolPorId(id);
    return encontrado ? encontrado.nombre : "Rol no identificado";
  }

  function renderUsuarios() {
    contador.textContent =
      admin.usuarios.length + (admin.usuarios.length === 1 ? " usuario" : " usuarios");

    var filas = admin.usuarios
      .map(function (usuario) {
        var infoRol = admin.rolPorId(usuario.rolId);
        var permisos = infoRol ? infoRol.permisos : [];
        return (
          "<tr>" +
          '<th scope="row" data-label="Nombre">' + usuario.nombre + "</th>" +
          '<td data-label="Correo">' + usuario.correo + "</td>" +
          '<td data-label="Rol">' + nombreRol(usuario.rolId) + "</td>" +
          '<td data-label="Estado"><span class="slint-badge ' +
          (usuario.estado === "Activo" ? "slint-badge--valido" : "slint-badge--neutro") +
          '">' + usuario.estado + "</span></td>" +
          '<td data-label="Permisos">' + permisos.length + " permisos</td>" +
          "</tr>"
        );
      })
      .join("");

    tabla.innerHTML =
      '<table class="slint-tabla slint-tabla--apilada">' +
      "<caption>Usuarios de demostración</caption>" +
      '<thead><tr><th scope="col">Nombre</th><th scope="col">Correo</th>' +
      '<th scope="col">Rol</th><th scope="col">Estado</th>' +
      '<th scope="col">Permisos</th></tr></thead>' +
      "<tbody>" + filas + "</tbody></table>";
  }

  function renderRoles() {
    listaRoles.innerHTML = admin.roles
      .map(function (infoRol) {
        return (
          '<article class="slint-tarjeta">' +
          '<h3 class="slint-tarjeta__titulo">' + infoRol.nombre + "</h3>" +
          '<ul class="slint-lista-pendientes slint-mt-2">' +
          infoRol.permisos
            .map(function (permiso) {
              return '<li><span class="slint-badge slint-badge--neutro">Permiso</span> ' +
                permiso + "</li>";
            })
            .join("") +
          "</ul></article>"
        );
      })
      .join("");
  }

  function llenarRoles() {
    admin.roles.forEach(function (infoRol) {
      var opcion = document.createElement("option");
      opcion.value = infoRol.id;
      opcion.textContent = infoRol.nombre;
      rol.appendChild(opcion);
    });
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
    marcar(correo, errorCorreo, "");
    marcar(rol, errorRol, "");
    mensaje.innerHTML = "";
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiar();

    var invalidos = [];
    var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());

    if (!nombre.value.trim()) {
      marcar(nombre, errorNombre, "Ingrese el nombre del usuario.");
      invalidos.push(nombre);
    }
    if (!correo.value.trim()) {
      marcar(correo, errorCorreo, "Ingrese el correo.");
      invalidos.push(correo);
    } else if (!correoValido) {
      marcar(correo, errorCorreo, "Ingrese un correo con formato válido.");
      invalidos.push(correo);
    }
    if (!rol.value) {
      marcar(rol, errorRol, "Seleccione un rol.");
      invalidos.push(rol);
    }

    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    mensaje.innerHTML = componentes.alerta(
      "demo",
      "<strong>Validación correcta.</strong> No se creó ningún usuario: " +
        "esta pantalla es una demostración sin persistencia."
    );
  });

  [nombre, correo, rol].forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo === nombre) {
        marcar(nombre, errorNombre, "");
      } else if (campo === correo) {
        marcar(correo, errorCorreo, "");
      } else {
        marcar(rol, errorRol, "");
      }
    });
    campo.addEventListener("change", function () {
      if (campo === rol) {
        marcar(rol, errorRol, "");
      }
    });
  });

  renderUsuarios();
  renderRoles();
  llenarRoles();
})();
