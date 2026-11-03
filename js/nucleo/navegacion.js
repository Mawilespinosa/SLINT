/* SLINT — mapa único de rutas y navegación (JavaScript puro) */
(function () {
  "use strict";

  /*
   * Estado de cada interfaz:
   *   "listo"     -> el archivo existe y el enlace se habilita.
   *   "pendiente" -> el archivo aún no se ha creado; se muestra deshabilitado.
   * Mantener este mapa como única fuente de verdad de módulos y archivos.
   */
  var PAGINAS = [
    { id: "INT-01", nombre: "Acceso", archivo: "index.html", modulo: "Acceso", estado: "listo", icono: "i-usuario" },
    { id: "INT-02", nombre: "Dashboard", archivo: "dashboard.html", modulo: "Dashboard", estado: "listo", icono: "i-dashboard" },
    { id: "INT-03", nombre: "Registro de turno", archivo: "registro-turno.html", modulo: "Gestión de turnos", estado: "listo", icono: "i-turnos" },
    { id: "INT-04", nombre: "Validación de horarios", archivo: "validacion-horarios.html", modulo: "Gestión de turnos", estado: "listo", icono: "i-turnos" },
    { id: "INT-05", nombre: "Consulta de turnos", archivo: "consulta-turnos.html", modulo: "Gestión de turnos", estado: "listo", icono: "i-turnos" },
    { id: "INT-06", nombre: "Importar turnos desde Excel", archivo: "importar-excel.html", modulo: "Gestión de turnos", estado: "listo", icono: "i-turnos" },
    { id: "INT-07", nombre: "Flujo de liquidación", archivo: "flujo-liquidacion.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-08", nombre: "Horas ordinarias y nocturnas", archivo: "detalle-ordinarias-nocturnas.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-09", nombre: "Horas extra", archivo: "detalle-horas-extra.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-10", nombre: "Domingos y festivos", archivo: "detalle-festivos.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-11", nombre: "Resumen de liquidación", archivo: "resumen-liquidacion.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-12", nombre: "Detalle por concepto", archivo: "detalle-por-concepto.html", modulo: "Liquidaciones", estado: "listo", icono: "i-liquidacion" },
    { id: "INT-13", nombre: "Exportación de resultados", archivo: "exportacion.html", modulo: "Reportes", estado: "listo", icono: "i-reportes" },
    { id: "INT-14", nombre: "Historial de liquidaciones", archivo: "historial-liquidaciones.html", modulo: "Reportes", estado: "listo", icono: "i-reportes" },
    { id: "INT-15", nombre: "Usuarios y roles", archivo: "usuarios-roles.html", modulo: "Administración", estado: "listo", icono: "i-admin" },
    { id: "INT-16", nombre: "Parámetros laborales", archivo: "parametros-laborales.html", modulo: "Administración", estado: "listo", icono: "i-admin" }
  ];

  var ORDEN_MODULOS = ["Dashboard", "Gestión de turnos", "Liquidaciones", "Reportes", "Administración"];

  var MODULOS = ORDEN_MODULOS.map(function (nombreModulo) {
    return {
      nombre: nombreModulo,
      paginas: PAGINAS.filter(function (pagina) {
        return pagina.modulo === nombreModulo;
      })
    };
  });

  function obtener(id) {
    return PAGINAS.find(function (pagina) {
      return pagina.id === id;
    }) || null;
  }

  function urlDe(id) {
    var pagina = obtener(id);
    if (!pagina || pagina.estado !== "listo") {
      return null;
    }
    return pagina.archivo;
  }

  function estaDisponible(id) {
    return urlDe(id) !== null;
  }

  window.SLINT = window.SLINT || {};
  window.SLINT.navegacion = {
    paginas: PAGINAS,
    modulos: MODULOS,
    obtener: obtener,
    urlDe: urlDe,
    estaDisponible: estaDisponible
  };
})();
