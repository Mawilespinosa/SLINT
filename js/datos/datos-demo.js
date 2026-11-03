/* SLINT — datos ficticios de demostración (sin datos personales reales) */
(function () {
  "use strict";

  var colaboradores = [
    { id: "c1", nombre: "Colaborador Demo A", rol: "Vigilante" },
    { id: "c2", nombre: "Colaborador Demo B", rol: "Vigilante" },
    { id: "c3", nombre: "Colaborador Demo C", rol: "Supervisor" },
    { id: "c4", nombre: "Colaborador Demo D", rol: "Vigilante" }
  ];

  /*
   * Turnos de demostración con fechas ficticias (año 2099).
   * Nota: no son liquidaciones legales verificadas.
   */
  var turnos = [
    {
      id: "t1",
      colaboradorId: "c1",
      fecha: "2099-01-05",
      entrada1: "22:00",
      salida1: "06:00",
      cruce1: true,
      entrada2: null,
      salida2: null,
      cruce2: false,
      estado: "valido",
      nota: "Turno nocturno que cruza medianoche"
    },
    {
      id: "t2",
      colaboradorId: "c2",
      fecha: "2099-01-06",
      entrada1: "08:00",
      salida1: null,
      cruce1: false,
      entrada2: null,
      salida2: null,
      cruce2: false,
      estado: "error",
      nota: "Tramo incompleto: falta salida 1"
    },
    {
      id: "t3",
      colaboradorId: "c3",
      fecha: "2099-01-07",
      entrada1: "06:00",
      salida1: "23:30",
      cruce1: false,
      entrada2: null,
      salida2: null,
      cruce2: false,
      estado: "advertencia",
      nota: "Duración inconsistente (17,5 h) sobre umbral de ejemplo"
    },
    {
      id: "t4",
      colaboradorId: "c4",
      fecha: "2099-01-08",
      entrada1: "08:00",
      salida1: "12:00",
      cruce1: false,
      entrada2: "11:00",
      salida2: "16:00",
      cruce2: false,
      estado: "error",
      nota: "Solapamiento real entre tramos"
    }
  ];

  var liquidaciones = [
    {
      id: "l1",
      colaboradorId: "c1",
      fechaTurno: "2099-01-05",
      total: 140640,
      estado: "demo"
    }
  ];

  var parametros = [
    { nombre: "Recargo nocturno", valor: "35 %", desde: "2099-01-01", hasta: "2099-12-31", vigente: true },
    { nombre: "Recargo extra diurna", valor: "25 %", desde: "2099-01-01", hasta: "2099-12-31", vigente: true },
    { nombre: "Recargo extra nocturna", valor: "75 %", desde: "2099-01-01", hasta: "2099-12-31", vigente: true },
    { nombre: "Recargo dominical/festivo", valor: "80 %", desde: "2099-01-01", hasta: "2099-12-31", vigente: true },
    { nombre: "Valor hora base", valor: "$ 12.000", desde: "2099-01-01", hasta: "2099-12-31", vigente: true }
  ];

  var parametrosLiquidacion = {
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
    vigencia: "Demostración académica · no es norma legal"
  };

  var festivos = [
    { fecha: "2099-01-12", motivo: "Festivo trasladado (Reyes Magos)" }
  ];

  var indicadores = [
    { etiqueta: "Turnos registrados", valor: 4, unidad: "turnos", periodo: "Enero 2099" },
    { etiqueta: "Liquidaciones pendientes", valor: 3, unidad: "registros", periodo: "Enero 2099" },
    { etiqueta: "Horas extra acumuladas", valor: 28.5, unidad: "horas", periodo: "Enero 2099" },
    { etiqueta: "Festivos del período", valor: 1, unidad: "día", periodo: "Enero 2099" }
  ];

  var horasPorConcepto = [
    { concepto: "Ordinarias", horas: 60, tipo: "ordinaria" },
    { concepto: "Nocturnas", horas: 38.5, tipo: "nocturna" },
    { concepto: "Extra diurnas", horas: 18, tipo: "extra" },
    { concepto: "Extra nocturnas", horas: 10.5, tipo: "extra" },
    { concepto: "Festivas", horas: 12, tipo: "festiva" }
  ];

  window.SLINT = window.SLINT || {};
  window.SLINT.datos = {
    ficticios: true,
    periodo: "Enero 2099 · datos de demostración",
    colaboradores: colaboradores,
    turnos: turnos,
    liquidaciones: liquidaciones,
    parametros: parametros,
    parametrosLiquidacion: parametrosLiquidacion,
    festivos: festivos,
    indicadores: indicadores,
    horasPorConcepto: horasPorConcepto
  };
})();
