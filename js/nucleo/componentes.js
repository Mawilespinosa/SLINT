/* SLINT — componentes compartidos: cabecera, menú, migas, avisos y pie */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var nav = window.SLINT.navegacion;

  function icono(nombre, clase) {
    return (
      '<svg class="' + (clase || "slint-menu__icono") + '" aria-hidden="true" focusable="false">' +
      '<use href="assets/iconos.svg#' + nombre + '"></use>' +
      "</svg>"
    );
  }

  function escapar(texto) {
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCabecera(mostrarMenu) {
    var contenedor = document.getElementById("slint-cabecera");
    if (!contenedor) {
      return;
    }
    var enAcceso = document.body.getAttribute("data-pagina") === "INT-01";
    var destinoMarca = enAcceso ? "index.html" : "dashboard.html";
    var botonMenu = mostrarMenu
      ? '<button class="slint-menu-toggle" type="button" id="slint-menu-toggle" ' +
        'aria-expanded="false" aria-controls="slint-menu" aria-label="Abrir menú de navegación">' +
        icono("i-menu", "slint-menu__icono") +
        "</button>"
      : "";

    var acciones = mostrarMenu
      ? '<div class="slint-cabecera__acciones">' +
        '<span class="slint-usuario">Sesión demo</span>' +
        '<a class="slint-boton slint-boton--fantasma slint-boton--pequeno" href="index.html" data-cerrar-sesion>' +
        "Salir (demo)" +
        "</a>" +
        "</div>"
      : '<div class="slint-cabecera__acciones">' +
        '<span class="slint-badge slint-badge--demo">DEMO</span>' +
        "</div>";

    contenedor.className = "slint-cabecera";
    contenedor.innerHTML =
      '<div class="slint-cabecera__interior">' +
      botonMenu +
      '<a class="slint-marca" href="' + destinoMarca + '" aria-label="SLINT, ir al inicio">' +
      '<span class="slint-marca__sigla">SLINT</span>' +
      '<span class="slint-marca__texto">Liquidación de turnos</span>' +
      "</a>" +
      (mostrarMenu ? '<span class="slint-badge slint-badge--demo">DEMO</span>' : "") +
      acciones +
      "</div>";
  }

  function renderMenu(paginaId) {
    var contenedor = document.getElementById("slint-menu");
    if (!contenedor) {
      return;
    }

    var bloques = nav.modulos
      .map(function (modulo) {
        var enlaces = modulo.paginas
          .map(function (pagina) {
            var activo = pagina.id === paginaId;
            var contenido =
              icono(pagina.icono) +
              '<span class="slint-menu__texto">' + escapar(pagina.nombre) + "</span>";

            if (pagina.estado === "listo") {
              return (
                '<li><a class="slint-menu__enlace' + (activo ? " is-activo" : "") + '" ' +
                'href="' + pagina.archivo + '"' +
                (activo ? ' aria-current="page"' : "") +
                ">" + contenido + "</a></li>"
              );
            }

            return (
              '<li><span class="slint-menu__enlace slint-menu__enlace--pendiente" ' +
              'aria-disabled="true">' + contenido +
              '<span class="slint-badge slint-badge--pendiente">Pendiente</span>' +
              "</span></li>"
            );
          })
          .join("");

        return (
          '<div class="slint-menu__grupo">' +
          '<p class="slint-menu__titulo">' + escapar(modulo.nombre) + "</p>" +
          '<ul class="slint-menu__lista">' + enlaces + "</ul>" +
          "</div>"
        );
      })
      .join("");

    contenedor.className = "slint-menu";
    contenedor.innerHTML =
      '<nav aria-label="Menú principal">' +
      '<p class="slint-menu__rotulo">Módulos SLINT</p>' +
      bloques +
      "</nav>";
  }

  function renderMigas(paginaId) {
    if (document.body.getAttribute("data-menu") === "false") {
      return;
    }
    var principal = document.getElementById("contenido");
    var pagina = nav.obtener(paginaId);
    if (!principal || !pagina) {
      return;
    }

    var migas = document.createElement("nav");
    migas.className = "slint-migas";
    migas.setAttribute("aria-label", "Ruta de navegación");

    var items;
    if (pagina.id === "INT-02") {
      items =
        '<li><span aria-current="page">Dashboard</span></li>';
    } else {
      items =
        '<li><a href="dashboard.html">Inicio</a></li>' +
        "<li>" + escapar(pagina.modulo) + "</li>" +
        '<li><span aria-current="page">' + escapar(pagina.nombre) + "</span></li>";
    }

    migas.innerHTML = "<ol>" + items + "</ol>";
    principal.insertBefore(migas, principal.firstChild);
  }

  function renderAvisoDemo() {
    var principal = document.getElementById("contenido");
    if (!principal) {
      return;
    }
    var aviso = document.createElement("div");
    aviso.className = "slint-demo-aviso";
    aviso.setAttribute("role", "note");
    aviso.innerHTML =
      "<strong>Demostración:</strong> datos ficticios y funciones simuladas. " +
      "No existe backend, autenticación real ni persistencia en base de datos.";
    principal.insertBefore(aviso, principal.firstChild);
  }

  function renderPie() {
    var contenedor = document.getElementById("slint-pie");
    if (!contenedor) {
      return;
    }
    contenedor.className = "slint-pie";
    contenedor.innerHTML =
      "SLINT · Prototipo académico · Datos ficticios · " +
      "HTML5, CSS3 y JavaScript puro · Sin backend";
  }

  function iniciarMenuMovil() {
    var boton = document.getElementById("slint-menu-toggle");
    var menu = document.getElementById("slint-menu");
    if (!boton || !menu) {
      return;
    }

    var velo = document.createElement("button");
    velo.type = "button";
    velo.className = "slint-velo";
    velo.setAttribute("aria-label", "Cerrar menú de navegación");
    velo.hidden = true;
    document.body.appendChild(velo);

    function abrir() {
      menu.classList.add("is-abierto");
      boton.setAttribute("aria-expanded", "true");
      boton.setAttribute("aria-label", "Cerrar menú de navegación");
      velo.hidden = false;
      var primerEnlace = menu.querySelector("a, button");
      if (primerEnlace) {
        primerEnlace.focus();
      }
    }

    function cerrar(devolverFoco) {
      menu.classList.remove("is-abierto");
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú de navegación");
      velo.hidden = true;
      if (devolverFoco) {
        boton.focus();
      }
    }

    boton.addEventListener("click", function () {
      if (menu.classList.contains("is-abierto")) {
        cerrar(true);
      } else {
        abrir();
      }
    });

    velo.addEventListener("click", function () {
      cerrar(true);
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("is-abierto")) {
        cerrar(true);
      }
    });

    menu.addEventListener("click", function (evento) {
      if (evento.target.closest("a")) {
        cerrar(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024 && menu.classList.contains("is-abierto")) {
        cerrar(false);
      }
    });
  }

  function iniciarCierreSesion() {
    utils.qsa("[data-cerrar-sesion]").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        utils.almacen.remove("sesion");
      });
    });
  }

  function iniciarDialogos() {
    utils.qsa("[data-abrir-dialogo]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var dialogo = document.getElementById(boton.getAttribute("data-abrir-dialogo"));
        if (dialogo && typeof dialogo.showModal === "function") {
          dialogo.showModal();
        }
      });
    });

    utils.qsa("dialog.slint-dialogo").forEach(function (dialogo) {
      dialogo.addEventListener("click", function (evento) {
        if (evento.target === dialogo) {
          dialogo.close();
        }
      });
    });
  }

  function alerta(tipo, mensaje) {
    var clases = {
      info: "slint-mensaje--info",
      exito: "slint-mensaje--exito",
      advertencia: "slint-mensaje--advertencia",
      error: "slint-mensaje--error",
      demo: "slint-mensaje--demo"
    };
    var rol = tipo === "error" ? "alert" : "status";
    return (
      '<div class="slint-mensaje ' + (clases[tipo] || clases.info) + '" role="' + rol + '">' +
      "<span>" + mensaje + "</span>" +
      "</div>"
    );
  }

  function tieneSesion() {
    return utils.almacen.get("sesion", null) !== null;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var paginaId = document.body.getAttribute("data-pagina") || "";
    var mostrarMenu = document.body.getAttribute("data-menu") !== "false";

    renderCabecera(mostrarMenu);
    if (mostrarMenu) {
      renderMenu(paginaId);
      iniciarMenuMovil();
    }
    if (document.body.getAttribute("data-demo") === "true") {
      renderAvisoDemo();
    }
    renderMigas(paginaId);
    renderPie();
    iniciarCierreSesion();
    iniciarDialogos();
  });

  window.SLINT = window.SLINT || {};
  window.SLINT.componentes = {
    icono: icono,
    alerta: alerta,
    tieneSesion: tieneSesion
  };
})();
