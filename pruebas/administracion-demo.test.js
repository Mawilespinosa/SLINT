/* Pruebas de datos de administración — `node pruebas/administracion-demo.test.js` */
"use strict";

const assert = require("node:assert");
const path = require("node:path");

global.window = {};
require(path.join(__dirname, "..", "js", "datos", "administracion-demo.js"));

const admin = global.window.SLINT.administracionDemo;

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

function fecha(valor) {
  const [a, m, d] = valor.split("-").map(Number);
  return new Date(a, m - 1, d);
}

prueba("Existen 3 roles, 4 usuarios y 6 parámetros", () => {
  assert.strictEqual(admin.roles.length, 3);
  assert.strictEqual(admin.usuarios.length, 4);
  assert.strictEqual(admin.parametros.length, 6);
});

prueba("Los usuarios tienen ids y correos únicos", () => {
  const ids = new Set();
  const correos = new Set();
  admin.usuarios.forEach((usuario) => {
    assert.ok(usuario.id);
    assert.ok(!ids.has(usuario.id), "ID duplicado: " + usuario.id);
    ids.add(usuario.id);
    assert.ok(!correos.has(usuario.correo), "Correo duplicado: " + usuario.correo);
    correos.add(usuario.correo);
    assert.ok(/@slint\.local$/.test(usuario.correo));
  });
});

prueba("Cada usuario referencia un rol existente", () => {
  admin.usuarios.forEach((usuario) => {
    assert.ok(admin.rolPorId(usuario.rolId), "Rol inexistente: " + usuario.rolId);
  });
});

prueba("Cada rol tiene permisos", () => {
  admin.roles.forEach((rol) => {
    assert.ok(Array.isArray(rol.permisos));
    assert.ok(rol.permisos.length > 0, "Rol sin permisos: " + rol.id);
  });
});

prueba("Los parámetros tienen fechas válidas y orden correcto", () => {
  admin.parametros.forEach((parametro) => {
    const desde = fecha(parametro.desde);
    const hasta = fecha(parametro.hasta);
    assert.ok(!isNaN(desde.getTime()), "Fecha desde inválida: " + parametro.nombre);
    assert.ok(!isNaN(hasta.getTime()), "Fecha hasta inválida: " + parametro.nombre);
    assert.ok(desde.getTime() <= hasta.getTime(), "Rango invertido: " + parametro.nombre);
    assert.ok(parametro.valor && /\d/.test(parametro.valor));
    assert.ok(["Vigente", "No vigente"].includes(parametro.estado));
  });
});

console.log("");
console.log("Resultado: " + pasadas + " pruebas OK, " + fallidas + " fallidas.");
process.exit(fallidas === 0 ? 0 : 1);
