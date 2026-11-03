/* SLINT — datos ficticios de administración (solo demostración) */
(function () {
  "use strict";

  var roles = [
    {
      id: "auxiliar",
      nombre: "Auxiliar de nómina",
      permisos: [
        "Consultar turnos",
        "Registrar turnos",
        "Ver liquidaciones",
        "Exportar reportes"
      ]
    },
    {
      id: "coordinador",
      nombre: "Coordinador operativo",
      permisos: [
        "Validar turnos",
        "Consultar indicadores",
        "Ver historial de liquidaciones"
      ]
    },
    {
      id: "administrador",
      nombre: "Administrador",
      permisos: [
        "Gestionar usuarios y roles",
        "Gestionar parámetros laborales",
        "Acceder a todos los módulos"
      ]
    }
  ];

  var usuarios = [
    {
      id: "u1",
      nombre: "Usuario Demo 1",
      correo: "demo1@slint.local",
      rolId: "auxiliar",
      estado: "Activo"
    },
    {
      id: "u2",
      nombre: "Usuario Demo 2",
      correo: "demo2@slint.local",
      rolId: "coordinador",
      estado: "Activo"
    },
    {
      id: "u3",
      nombre: "Usuario Demo 3",
      correo: "demo3@slint.local",
      rolId: "administrador",
      estado: "Activo"
    },
    {
      id: "u4",
      nombre: "Usuario Demo 4",
      correo: "demo4@slint.local",
      rolId: "auxiliar",
      estado: "Inactivo"
    }
  ];

  var parametros = [
    {
      nombre: "Recargo nocturno",
      valor: "35 %",
      desde: "2099-01-01",
      hasta: "2099-12-31",
      estado: "Vigente"
    },
    {
      nombre: "Recargo extra diurna",
      valor: "25 %",
      desde: "2099-01-01",
      hasta: "2099-12-31",
      estado: "Vigente"
    },
    {
      nombre: "Recargo extra nocturna",
      valor: "75 %",
      desde: "2099-01-01",
      hasta: "2099-12-31",
      estado: "Vigente"
    },
    {
      nombre: "Recargo dominical/festivo",
      valor: "80 %",
      desde: "2099-01-01",
      hasta: "2099-12-31",
      estado: "Vigente"
    },
    {
      nombre: "Valor hora base",
      valor: "$ 12.000",
      desde: "2099-01-01",
      hasta: "2099-12-31",
      estado: "Vigente"
    },
    {
      nombre: "Valor hora base anterior",
      valor: "$ 11.500",
      desde: "2098-01-01",
      hasta: "2098-12-31",
      estado: "No vigente"
    }
  ];

  function rolPorId(id) {
    return (
      roles.find(function (rol) {
        return rol.id === id;
      }) || null
    );
  }

  window.SLINT = window.SLINT || {};
  window.SLINT.administracionDemo = {
    demo: true,
    roles: roles,
    usuarios: usuarios,
    parametros: parametros,
    rolPorId: rolPorId
  };
})();
