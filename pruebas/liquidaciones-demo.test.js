/* Pruebas de coherencia de los ejemplos L-01 a L-04 — `node pruebas/liquidaciones-demo.test.js` */
"use strict";

const assert = require("node:assert");
const path = require("node:path");

global.window = {};
require(path.join(__dirname, "..", "js", "datos", "liquidaciones-demo.js"));

const datos = global.window.SLINT.liquidacionesDemo;
const esperados = {
  "L-01": { horas: 8, total: 96000 },
  "L-02": { horas: 8, total: 129600 },
  "L-03": { horas: 8, total: 162000 },
  "L-04": { horas: 10, total: 126000 }
};

let pasadas = 0;
let fallidas = 0;

function prueba(nombre, fn) {
  try {
    fn();
    pasadas += 1;
    console.log("OK      " + nombre);
  } catch (error) {
    fallidas += 1;
    console.error("FALLA   " + nombre + " -> " + error.message);
  }
}

prueba("Existen los cuatro ejemplos L-01 a L-04", () => {
  assert.strictEqual(datos.ejemplos.length, 4);
  ["L-01", "L-02", "L-03", "L-04"].forEach((id) => {
    assert.ok(datos.obtener(id), "Falta " + id);
  });
});

datos.ejemplos.forEach((ejemplo) => {
  prueba(ejemplo.id + " total coincide con conceptos y segmentos", () => {
    const sumaConceptos = ejemplo.conceptos.reduce((s, c) => s + c.subtotal, 0);
    const sumaSegmentos = ejemplo.segmentos.reduce((s, x) => s + x.subtotal, 0);
    assert.strictEqual(sumaConceptos, ejemplo.total);
    assert.strictEqual(sumaSegmentos, ejemplo.total);
    assert.strictEqual(ejemplo.verificacion.coincideTotal, true);
  });

  prueba(ejemplo.id + " horas coinciden entre conceptos, segmentos y total", () => {
    const horasConceptos = ejemplo.conceptos.reduce((s, c) => s + c.horas, 0);
    const horasSegmentos = ejemplo.segmentos.reduce((s, x) => s + x.horas, 0);
    assert.ok(Math.abs(horasConceptos - ejemplo.totalHoras) < 0.0001);
    assert.ok(Math.abs(horasSegmentos - ejemplo.totalHoras) < 0.0001);
    assert.strictEqual(ejemplo.verificacion.coincideHoras, true);
  });

  prueba(ejemplo.id + " cada segmento respeta base + recargo = subtotal", () => {
    ejemplo.segmentos.forEach((segmento) => {
      assert.ok(Number.isFinite(segmento.valorBase));
      assert.ok(Number.isFinite(segmento.valorRecargo));
      assert.strictEqual(segmento.valorBase + segmento.valorRecargo, segmento.subtotal);
      assert.ok(
        Math.abs(segmento.factor - (1 + segmento.porcentaje / 100)) < 0.0001,
        "Factor incorrecto en " + segmento.inicioTexto
      );
    });
  });

  prueba(ejemplo.id + " valores esperados", () => {
    assert.strictEqual(ejemplo.totalHoras, esperados[ejemplo.id].horas);
    assert.strictEqual(ejemplo.total, esperados[ejemplo.id].total);
  });
});

prueba("L-02 tiene 2 h + 6 h nocturnas", () => {
  const nocturna = datos.obtener("L-02").conceptos.find((c) => c.clave === "nocturna");
  assert.strictEqual(nocturna.horas, 8);
  assert.strictEqual(nocturna.subtotal, 129600);
  assert.strictEqual(datos.obtener("L-02").segmentos.length, 2);
});

prueba("L-03 separa 2 h nocturnas y 6 h dominicales", () => {
  const l03 = datos.obtener("L-03");
  const nocturna = l03.conceptos.find((c) => c.clave === "nocturna");
  const dominical = l03.conceptos.find((c) => c.clave === "dominical_festivo");
  assert.strictEqual(nocturna.horas, 2);
  assert.strictEqual(nocturna.subtotal, 32400);
  assert.strictEqual(dominical.horas, 6);
  assert.strictEqual(dominical.subtotal, 129600);
  assert.strictEqual(l03.diasEspeciales.length, 1);
});

prueba("L-04 incluye 8 h ordinarias y 2 h extra diurnas", () => {
  const l04 = datos.obtener("L-04");
  const ordinaria = l04.conceptos.find((c) => c.clave === "ordinaria");
  const extra = l04.conceptos.find((c) => c.clave === "extra_diurna");
  assert.strictEqual(ordinaria.horas, 8);
  assert.strictEqual(ordinaria.subtotal, 96000);
  assert.strictEqual(extra.horas, 2);
  assert.strictEqual(extra.subtotal, 30000);
});

prueba("Todos los segmentos tienen fecha explícita", () => {
  datos.ejemplos.forEach((ejemplo) => {
    ejemplo.segmentos.forEach((segmento) => {
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(segmento.fecha), "Fecha inválida en " + ejemplo.id);
    });
  });
});

prueba("L-03 distingue día ordinario y domingo en segmentos", () => {
  const l03 = datos.obtener("L-03");
  assert.deepStrictEqual(
    l03.segmentos.map((s) => s.fecha),
    ["2099-01-10", "2099-01-11"]
  );
  assert.deepStrictEqual(
    l03.segmentos.map((s) => s.clave),
    ["nocturna", "dominical_festivo"]
  );
  assert.deepStrictEqual(
    l03.dias.map((d) => d.motivo),
    ["ordinario", "domingo"]
  );
});

prueba("L-04 tiene exactamente 2 segmentos y 2 conceptos con horas", () => {
  const l04 = datos.obtener("L-04");
  assert.strictEqual(l04.segmentos.length, 2);
  assert.strictEqual(
    l04.conceptos.filter((c) => c.horas > 0).length,
    2
  );
  assert.strictEqual(l04.segmentos[0].clave, "ordinaria");
  assert.strictEqual(l04.segmentos[1].clave, "extra_diurna");
});

console.log("");
console.log("Resultado: " + pasadas + " pruebas OK, " + fallidas + " fallidas.");
process.exit(fallidas === 0 ? 0 : 1);
