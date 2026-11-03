/* SLINT — almacenamiento temporal y evaluación de turnos de demostración */
(function () {
  "use strict";

  var utils = window.SLINT.utils;
  var CLAVE = "turnos";
  var UMBRAL_ADVERTENCIA_HORAS = 17.5;
  var memoria = null;

  function copia(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function turnosDemo() {
    var datos = window.SLINT.datos;
    return datos && Array.isArray(datos.turnos) ? copia(datos.turnos) : [];
  }

  function cargar() {
    if (memoria) {
      return memoria;
    }
    var guardados = utils.almacen.disponible ? utils.almacen.get(CLAVE, null) : null;
    if (Array.isArray(guardados)) {
      memoria = guardados;
      return memoria;
    }
    memoria = turnosDemo();
    if (utils.almacen.disponible) {
      utils.almacen.set(CLAVE, memoria);
    }
    return memoria;
  }

  function persistir(lista) {
    memoria = lista;
    if (utils.almacen.disponible) {
      utils.almacen.set(CLAVE, lista);
    }
  }

  function listar() {
    return cargar().slice();
  }

  function obtener(id) {
    return (
      cargar().find(function (turno) {
        return turno.id === id;
      }) || null
    );
  }

  function crearId() {
    return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  }

  function guardar(turno) {
    var lista = cargar().slice();
    var indice = lista.findIndex(function (item) {
      return item.id === turno.id;
    });
    if (indice >= 0) {
      lista[indice] = turno;
    } else {
      lista.unshift(turno);
    }
    persistir(lista);
    return turno;
  }

  function tipoDe(turno) {
    return turno.entrada2 || turno.salida2 ? "partido" : "continuo";
  }

  function horaDe(fecha) {
    if (!(fecha instanceof Date)) {
      return "—";
    }
    var horas = String(fecha.getHours()).padStart(2, "0");
    var minutos = String(fecha.getMinutes()).padStart(2, "0");
    return horas + ":" + minutos;
  }

  /*
   * Evalúa un turno sin modificar los datos.
   * Devuelve estado ("valido" | "advertencia" | "error"), hallazgos y duraciones.
   */
  function evaluar(turno) {
    var hallazgos = [];
    var inicio1 = null;
    var fin1 = null;
    var inicio2 = null;
    var fin2 = null;
    var duracion1 = 0;
    var duracion2 = 0;

    function error(mensaje) {
      hallazgos.push({ tipo: "error", mensaje: mensaje });
    }

    function advertencia(mensaje) {
      hallazgos.push({ tipo: "advertencia", mensaje: mensaje });
    }

    if (!turno || !turno.colaboradorId) {
      error("Seleccione un colaborador para el turno.");
    }

    var fecha = utils.parseFecha(turno ? turno.fecha : null);
    if (!fecha) {
      error("La fecha del turno no es válida.");
    }

    var hora1Ok = utils.esHoraValida(turno ? turno.entrada1 : null);
    var hora2Ok = utils.esHoraValida(turno ? turno.salida1 : null);
    if (!hora1Ok) {
      error("La hora de entrada del tramo 1 no es válida (use HH:MM entre 00:00 y 23:59).");
    }
    if (!hora2Ok) {
      error("La hora de salida del tramo 1 no es válida (use HH:MM entre 00:00 y 23:59).");
    }

    var cronologia1 = false;
    if (
      fecha &&
      hora1Ok &&
      hora2Ok &&
      !turno.cruce1 &&
      turno.salida1 < turno.entrada1
    ) {
      error("La salida 1 es menor que la entrada 1. Marque que la salida corresponde al día siguiente.");
      cronologia1 = true;
    }

    if (fecha && hora1Ok && hora2Ok) {
      inicio1 = utils.combinarFechaHora(fecha, turno.entrada1);
      var diaFin1 = utils.sumarDias(fecha, turno.cruce1 ? 1 : 0);
      fin1 = utils.combinarFechaHora(diaFin1, turno.salida1);
      if (inicio1 && fin1) {
        duracion1 = utils.difHoras(inicio1, fin1);
        if (duracion1 <= 0 && !cronologia1) {
          error("La duración del tramo 1 debe ser mayor que cero.");
        }
      }
    }

    var tieneTramo2 = Boolean(turno && (turno.entrada2 || turno.salida2 || turno.cruce2));
    if (tieneTramo2) {
      var entrada2Ok = utils.esHoraValida(turno.entrada2);
      var salida2Ok = utils.esHoraValida(turno.salida2);
      if (!entrada2Ok) {
        error("La hora de entrada del tramo 2 no es válida.");
      }
      if (!salida2Ok) {
        error("La hora de salida del tramo 2 no es válida.");
      }
      var cronologia2 = false;
      if (
        fin1 &&
        entrada2Ok &&
        salida2Ok &&
        !turno.cruce2 &&
        turno.salida2 < turno.entrada2
      ) {
        error("La salida 2 es menor que la entrada 2. Marque que la salida corresponde al día siguiente.");
        cronologia2 = true;
      }
      if (fin1 && entrada2Ok && salida2Ok) {
        var diaBase2 = new Date(fin1.getFullYear(), fin1.getMonth(), fin1.getDate());
        inicio2 = utils.combinarFechaHora(diaBase2, turno.entrada2);
        var diaFin2 = utils.sumarDias(diaBase2, turno.cruce2 ? 1 : 0);
        fin2 = utils.combinarFechaHora(diaFin2, turno.salida2);
        if (inicio2 && fin2) {
          duracion2 = utils.difHoras(inicio2, fin2);
          if (duracion2 <= 0 && !cronologia2) {
            error("La duración del tramo 2 debe ser mayor que cero.");
          }
          if (inicio2 < fin1) {
            error("El tramo 2 se solapa con el tramo 1. Verifique el orden cronológico.");
          }
        }
      }
    }

    var duracionTotal = duracion1 + duracion2;
    if (duracionTotal > UMBRAL_ADVERTENCIA_HORAS) {
      advertencia(
        "La duración total (" +
          utils.formatoNumero(duracionTotal, 1) +
          " h) supera el umbral de ejemplo de 17,5 h. Es una advertencia configurable, no un límite legal."
      );
    }

    var tieneErrores = hallazgos.some(function (hallazgo) {
      return hallazgo.tipo === "error";
    });
    var estado = tieneErrores ? "error" : hallazgos.length ? "advertencia" : "valido";

    return {
      estado: estado,
      hallazgos: hallazgos,
      inicio1: inicio1,
      fin1: fin1,
      inicio2: inicio2,
      fin2: fin2,
      duracion1: duracion1,
      duracion2: duracion2,
      duracionTotal: duracionTotal,
      tipo: tipoDe(turno || {})
    };
  }

  window.SLINT = window.SLINT || {};
  window.SLINT.turnos = {
    umbralAdvertencia: UMBRAL_ADVERTENCIA_HORAS,
    listar: listar,
    obtener: obtener,
    guardar: guardar,
    crearId: crearId,
    evaluar: evaluar,
    tipoDe: tipoDe,
    horaDe: horaDe
  };
})();
