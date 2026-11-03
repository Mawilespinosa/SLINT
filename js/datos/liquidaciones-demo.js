/* SLINT — Ejemplos precargados de liquidación (solo demostración visual)
 *
 * Estos valores NO se calculan en tiempo real ni constituyen una liquidación
 * legal. Cada ejemplo es un conjunto de datos ficticios coherente para las
 * pantallas INT-07 a INT-12.
 */
(function () {
  "use strict";

  var ORDEN = [
    "ordinaria",
    "nocturna",
    "extra_diurna",
    "extra_nocturna",
    "dominical_festivo"
  ];

  var ETIQUETAS = {
    ordinaria: "Horas ordinarias",
    nocturna: "Horas nocturnas",
    extra_diurna: "Horas extra diurnas",
    extra_nocturna: "Horas extra nocturnas",
    dominical_festivo: "Horas dominicales y festivas"
  };

  var PARAMETROS = {
    valorHoraBase: 12000,
    recargos: {
      nocturna: 35,
      extraDiurna: 25,
      extraNocturna: 75,
      dominicalFestivo: 80
    },
    franjaNocturna: { inicio: 19, fin: 6 },
    jornadaSemanalHoras: 42,
    moneda: "COP",
    vigencia: "Parámetros ilustrativos de demostración; no son norma legal"
  };

  var FESTIVOS = [{ fecha: "2099-01-12", motivo: "Festivo de demostración" }];

  function crearSegmento(datos) {
    var valorBase = Math.round(datos.horas * PARAMETROS.valorHoraBase);
    var valorRecargo = Math.round(valorBase * (datos.porcentaje / 100));
    return {
      clave: datos.clave,
      etiqueta: ETIQUETAS[datos.clave],
      fecha: datos.fecha,
      motivo: datos.motivo,
      inicioTexto: datos.inicioTexto,
      finTexto: datos.finTexto,
      horas: datos.horas,
      valorBase: valorBase,
      porcentaje: datos.porcentaje,
      factor: 1 + datos.porcentaje / 100,
      valorRecargo: valorRecargo,
      subtotal: valorBase + valorRecargo
    };
  }

  function completarConceptos(segmentos) {
    return ORDEN.map(function (clave) {
      var propios = segmentos.filter(function (segmento) {
        return segmento.clave === clave;
      });
      return {
        clave: clave,
        etiqueta: ETIQUETAS[clave],
        horas: propios.reduce(function (suma, item) { return suma + item.horas; }, 0),
        valorBase: propios.reduce(function (suma, item) { return suma + item.valorBase; }, 0),
        porcentaje: propios.length ? propios[0].porcentaje : 0,
        factor: propios.length ? propios[0].factor : 1,
        valorRecargo: propios.reduce(function (suma, item) { return suma + item.valorRecargo; }, 0),
        subtotal: propios.reduce(function (suma, item) { return suma + item.subtotal; }, 0)
      };
    });
  }

  function crearEjemplo(configuracion) {
    var segmentos = configuracion.segmentos.map(crearSegmento);
    var conceptos = completarConceptos(segmentos);
    var total = conceptos.reduce(function (suma, concepto) {
      return suma + concepto.subtotal;
    }, 0);
    var totalHoras = segmentos.reduce(function (suma, segmento) {
      return suma + segmento.horas;
    }, 0);
    var sumaSubtotales = segmentos.reduce(function (suma, segmento) {
      return suma + segmento.subtotal;
    }, 0);
    var sumaHorasConceptos = conceptos.reduce(function (suma, concepto) {
      return suma + concepto.horas;
    }, 0);

    return {
      demo: true,
      id: configuracion.id,
      titulo: configuracion.titulo,
      descripcion: configuracion.descripcion,
      colaboradorId: configuracion.colaboradorId,
      turno: configuracion.turno,
      totalHoras: totalHoras,
      total: total,
      conceptos: conceptos,
      segmentos: segmentos,
      dias: configuracion.dias,
      diasEspeciales: configuracion.dias.filter(function (dia) {
        return dia.motivo === "domingo" || dia.motivo === "festivo";
      }),
      parametros: PARAMETROS,
      festivos: FESTIVOS,
      advertencias: configuracion.advertencias || [],
      verificacion: {
        sumaSubtotales: sumaSubtotales,
        sumaHorasSegmentos: totalHoras,
        sumaHorasConceptos: sumaHorasConceptos,
        coincideTotal: total === sumaSubtotales,
        coincideHoras: Math.abs(totalHoras - sumaHorasConceptos) < 0.0001
      }
    };
  }

  var ejemplos = [
    crearEjemplo({
      id: "L-01",
      titulo: "Turno diurno continuo",
      descripcion: "Ocho horas ordinarias en un día hábil ficticio.",
      colaboradorId: "c1",
      turno: {
        id: "demo-L01",
        fecha: "2099-01-05",
        entrada1: "08:00",
        salida1: "16:00",
        cruce1: false,
        entrada2: null,
        salida2: null,
        cruce2: false
      },
      segmentos: [
        {
          clave: "ordinaria",
          fecha: "2099-01-05",
          motivo: "ordinario",
          inicioTexto: "05/01/2099 08:00",
          finTexto: "05/01/2099 16:00",
          horas: 8,
          porcentaje: 0
        }
      ],
      dias: [{ fecha: "2099-01-05", motivo: "ordinario", horas: 8 }],
      advertencias: []
    }),
    crearEjemplo({
      id: "L-02",
      titulo: "Turno nocturno con cruce de medianoche",
      descripcion: "Ocho horas nocturnas repartidas entre dos fechas ficticias.",
      colaboradorId: "c2",
      turno: {
        id: "demo-L02",
        fecha: "2099-01-05",
        entrada1: "22:00",
        salida1: "06:00",
        cruce1: true,
        entrada2: null,
        salida2: null,
        cruce2: false
      },
      segmentos: [
        {
          clave: "nocturna",
          fecha: "2099-01-05",
          motivo: "ordinario",
          inicioTexto: "05/01/2099 22:00",
          finTexto: "06/01/2099 00:00",
          horas: 2,
          porcentaje: 35
        },
        {
          clave: "nocturna",
          fecha: "2099-01-06",
          motivo: "ordinario",
          inicioTexto: "06/01/2099 00:00",
          finTexto: "06/01/2099 06:00",
          horas: 6,
          porcentaje: 35
        }
      ],
      dias: [
        { fecha: "2099-01-05", motivo: "ordinario", horas: 2 },
        { fecha: "2099-01-06", motivo: "ordinario", horas: 6 }
      ],
      advertencias: ["Las horas nocturnas son una clasificación ilustrativa precargada."]
    }),
    crearEjemplo({
      id: "L-03",
      titulo: "Sábado a domingo",
      descripcion: "Dos horas nocturnas del sábado y seis horas dominicales del domingo.",
      colaboradorId: "c3",
      turno: {
        id: "demo-L03",
        fecha: "2099-01-10",
        entrada1: "22:00",
        salida1: "06:00",
        cruce1: true,
        entrada2: null,
        salida2: null,
        cruce2: false
      },
      segmentos: [
        {
          clave: "nocturna",
          fecha: "2099-01-10",
          motivo: "ordinario",
          inicioTexto: "10/01/2099 22:00",
          finTexto: "11/01/2099 00:00",
          horas: 2,
          porcentaje: 35
        },
        {
          clave: "dominical_festivo",
          fecha: "2099-01-11",
          motivo: "domingo",
          inicioTexto: "11/01/2099 00:00",
          finTexto: "11/01/2099 06:00",
          horas: 6,
          porcentaje: 80
        }
      ],
      dias: [
        { fecha: "2099-01-10", motivo: "ordinario", horas: 2 },
        { fecha: "2099-01-11", motivo: "domingo", horas: 6 }
      ],
      advertencias: [
        "El domingo se determina por la fecha ficticia del ejemplo, no por una etiqueta de texto."
      ]
    }),
    crearEjemplo({
      id: "L-04",
      titulo: "Turno con horas extra",
      descripcion: "Ocho horas ordinarias y dos horas extra diurnas precargadas.",
      colaboradorId: "c4",
      turno: {
        id: "demo-L04",
        fecha: "2099-01-05",
        entrada1: "08:00",
        salida1: "18:00",
        cruce1: false,
        entrada2: null,
        salida2: null,
        cruce2: false
      },
      segmentos: [
        {
          clave: "ordinaria",
          fecha: "2099-01-05",
          motivo: "ordinario",
          inicioTexto: "05/01/2099 08:00",
          finTexto: "05/01/2099 16:00",
          horas: 8,
          porcentaje: 0
        },
        {
          clave: "extra_diurna",
          fecha: "2099-01-05",
          motivo: "ordinario",
          inicioTexto: "05/01/2099 16:00",
          finTexto: "05/01/2099 18:00",
          horas: 2,
          porcentaje: 25
        }
      ],
      dias: [{ fecha: "2099-01-05", motivo: "ordinario", horas: 10 }],
      advertencias: [
        "Las 2 h extra son un supuesto ilustrativo precargado; no se calculan automáticamente."
      ]
    })
  ];

  window.SLINT = window.SLINT || {};
  window.SLINT.liquidacionesDemo = {
    demo: true,
    ejemplos: ejemplos,
    parametros: PARAMETROS,
    festivos: FESTIVOS,
    obtener: function (id) {
      return (
        ejemplos.find(function (ejemplo) {
          return ejemplo.id === id;
        }) || null
      );
    }
  };
})();
