/* Pruebas automatizadas de CT-01 y CT-02 — ejecutar con `node pruebas/utilidades.test.js` */
"use strict";

const assert = require("node:assert");
const path = require("node:path");

/* Stub mínimo de sessionStorage para cargar utilidades.js en Node. */
global.window = {
  sessionStorage: {
    _datos: Object.create(null),
    getItem(clave) {
      return Object.prototype.hasOwnProperty.call(this._datos, clave)
        ? this._datos[clave]
        : null;
    },
    setItem(clave, valor) {
      this._datos[clave] = String(valor);
    },
    removeItem(clave) {
      delete this._datos[clave];
    }
  }
};

require(path.join(__dirname, "..", "js", "nucleo", "utilidades.js"));

const u = global.window.SLINT.utils;

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

/* ----------------------------- CT-01 ----------------------------- */
const fechaValida = new Date(2099, 0, 5);

prueba("CT-01 acepta 00:00", () => {
  const resultado = u.combinarFechaHora(fechaValida, "00:00");
  assert.ok(resultado instanceof Date);
  assert.strictEqual(resultado.getHours(), 0);
  assert.strictEqual(resultado.getMinutes(), 0);
});

prueba("CT-01 acepta 23:59", () => {
  const resultado = u.combinarFechaHora(fechaValida, "23:59");
  assert.ok(resultado instanceof Date);
  assert.strictEqual(resultado.getHours(), 23);
  assert.strictEqual(resultado.getMinutes(), 59);
});

prueba("CT-01 acepta 12:30", () => {
  const resultado = u.combinarFechaHora(fechaValida, "12:30");
  assert.ok(resultado instanceof Date);
  assert.strictEqual(resultado.getHours(), 12);
  assert.strictEqual(resultado.getMinutes(), 30);
});

prueba("CT-01 rechaza 24:00", () => {
  assert.strictEqual(u.combinarFechaHora(fechaValida, "24:00"), null);
});

prueba("CT-01 rechaza 29:75", () => {
  assert.strictEqual(u.combinarFechaHora(fechaValida, "29:75"), null);
});

prueba("CT-01 rechaza 12:60", () => {
  assert.strictEqual(u.combinarFechaHora(fechaValida, "12:60"), null);
});

prueba("CT-01 rechaza formatos incompletos", () => {
  ["9:30", "12:3", "12", "12:30:00", "", " ", "doce:treinta"].forEach((hora) => {
    assert.strictEqual(u.combinarFechaHora(fechaValida, hora), null, "hora: " + hora);
  });
});

prueba("CT-01 rechaza fecha inválida", () => {
  assert.strictEqual(u.combinarFechaHora(new Date(NaN), "12:00"), null);
  assert.strictEqual(u.combinarFechaHora("2099-01-05", "12:00"), null);
});

prueba("CT-01 no normaliza fechas imposibles", () => {
  assert.strictEqual(u.parseFecha("2099-02-30"), null);
  assert.strictEqual(u.parseFecha("2099-13-01"), null);
  assert.ok(u.parseFecha("2099-02-28") instanceof Date);
});

prueba("CT-01 esHoraValida acepta solo HH:MM reales", () => {
  assert.strictEqual(u.esHoraValida("00:00"), true);
  assert.strictEqual(u.esHoraValida("23:59"), true);
  assert.strictEqual(u.esHoraValida("24:00"), false);
  assert.strictEqual(u.esHoraValida("12:60"), false);
  assert.strictEqual(u.esHoraValida("7:00"), false);
});

/* ----------------------------- CT-02 ----------------------------- */
prueba("CT-02 neutraliza fórmulas al inicio", () => {
  assert.strictEqual(u.neutralizarFormulaCSV("=2+2"), "'=2+2");
  assert.strictEqual(u.neutralizarFormulaCSV("+SUM(A1)"), "'+SUM(A1)");
  assert.strictEqual(u.neutralizarFormulaCSV("-10"), "'-10");
  assert.strictEqual(u.neutralizarFormulaCSV("@cmd"), "'@cmd");
});

prueba("CT-02 neutraliza fórmulas tras espacios o controles", () => {
  assert.strictEqual(u.neutralizarFormulaCSV(" +SUM(A1)"), "' +SUM(A1)");
  assert.strictEqual(u.neutralizarFormulaCSV("\t=cmd"), "'\t=cmd");
  assert.strictEqual(u.neutralizarFormulaCSV("\u0000@cmd"), "'@cmd");
});

prueba("CT-02 conserva texto normal", () => {
  assert.strictEqual(u.neutralizarFormulaCSV("Colaborador Demo A"), "Colaborador Demo A");
});

prueba("CT-02 conserva números negativos tipados", () => {
  const csv = u.construirCSV(["Concepto", "Valor"], [["Ordinarias", -10]]);
  assert.ok(csv.includes('"Ordinarias";-10'), "salida: " + JSON.stringify(csv));
});

prueba("CT-02 neutraliza negativos en texto", () => {
  const csv = u.construirCSV(["Concepto", "Valor"], [["-10 texto", 5]]);
  assert.ok(csv.includes('"\'-10 texto";5'), "salida: " + JSON.stringify(csv));
});

prueba("CT-02 escapa comillas, separador y salto de línea", () => {
  const csv = u.construirCSV(
    ["Concepto", "Detalle"],
    [["Texto", 'comillas "x"; salto\nlinea']]
  );
  assert.ok(
    csv.includes('"comillas ""x""; salto\nlinea"'),
    "salida: " + JSON.stringify(csv)
  );
});

prueba("CT-02 neutraliza encabezados no confiables", () => {
  const csv = u.construirCSV(["=Titulo", "Valor"], []);
  assert.ok(csv.includes('"\'=Titulo";"Valor"'), "salida: " + JSON.stringify(csv));
});

prueba("CT-02 el CSV generado no deja celdas con fórmula al inicio", () => {
  const csv = u.construirCSV(
    ["A", "B"],
    [
      ["=2+2", "@cmd"],
      [" +SUM(A1:A2)", "-1+1"],
      ["\t=HYPERLINK(1)", "normal"]
    ]
  );
  const lineas = csv.replace(/^\uFEFF/, "").split("\r\n");
  lineas.forEach((linea, indice) => {
    linea.split(";").forEach((celda) => {
      assert.ok(
        !/^"?(?:[\s\u0000-\u001f]*)[=+\-@]/.test(celda),
        "celda no neutralizada en línea " + indice + ": " + celda
      );
    });
  });
});

console.log("");
console.log("Resultado: " + pasadas + " pruebas OK, " + fallidas + " fallidas.");
process.exit(fallidas === 0 ? 0 : 1);
