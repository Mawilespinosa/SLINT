# Bitácora — Fase 3.2 (Gestión de turnos)

**Fecha:** 28/10/2026
**Alcance autorizado:** CT-01, CT-02 e interfaces INT-03 a INT-06.
**Restricciones mantenidas:** HTML5, CSS3 y JavaScript puro; sin backend, sin frameworks; Fases 1 y 2 sin modificar.

---

## 1. Decisiones

| Tema | Decisión |
|---|---|
| Persistencia | `sessionStorage` con prefijo `slint.demo.`; si falla, memoria en la página |
| Claves | `sesion`, `turnos`, `flash` |
| Datos demo | `js/datos/datos-demo.js` sembrado una vez en `turnos` |
| Evaluación de turnos | `js/nucleo/turnos.js` calcula estado, hallazgos y duraciones sin persistir resultados derivados |
| Cruce de medianoche | Indicador explícito por tramo; la fecha absoluta se construye en la evaluación |
| Umbral de advertencia | 17,5 h como ejemplo configurable, nunca como límite legal |
| Importación Excel | Solo validación de selección, extensión y tamaño; sin leer ni procesar el archivo |
| Exportación CSV | Implementada como utilidad segura, pendiente de uso en INT-13 |

---

## 2. Correcciones técnicas

### CT-01 — Fecha y hora

- `combinarFechaHora()` valida `Date` y `HH:MM` real.
- Rechaza `24:00`, `29:75`, `12:60`, formatos incompletos y fechas inválidas.
- Se añadió `esHoraValida()`.
- Pruebas: 10 casos, todos OK.

### CT-02 — CSV

- `neutralizarFormulaCSV()` antepone apóstrofo a textos que empiezan por `=`, `+`, `-` o `@` tras espacios/controles.
- Números tipados se conservan; texto negativo se neutraliza.
- `construirCSV()` separa con `;`, entrecomilla y duplica comillas, conserva saltos de línea, añade BOM UTF-8.
- Pruebas: 8 casos, todos OK.

---

## 3. Incidencias y correcciones durante la implementación

| Incidencia | Corrección |
|---|---|
| Mensaje duplicado al detectar salida menor que entrada y duración cero | Se añadió bandera de cronología para no repetir el error genérico |
| Foco caía en salida 1 al detectar solapamiento del tramo 2 | Se prioriza la detección del tramo 2 y el foco va a salida 2 |
| Tamaño de archivo pequeño se mostraba como “0 KB” | `formatoBytes()` muestra bytes cuando el tamaño es menor a 1 KB |
| Parser HTML4 de PHP marca etiquetas HTML5 como inválidas | Es una limitación del parser, no un error estructural; no se usa como validador W3C |

---

## 4. Pruebas ejecutadas

### Automáticas

```powershell
node pruebas/utilidades.test.js
```

Resultado: **18 pruebas OK, 0 fallidas**.

### En navegador real (servidor HTTP local)

| Prueba | Resultado |
|---|---|
| INT-03 alta de turno nocturno 22:00→06:00 con cruce | Guardado en `sessionStorage`, sin errores de consola |
| INT-03 salida menor sin cruce | Bloqueado, mensaje específico, foco en salida 1 |
| INT-03 solapamiento de tramos | Bloqueado, mensaje de solapamiento, foco en salida 2 |
| INT-03 edición por `?turno=` | Formulario precargado, título “Editar turno” |
| INT-04 turno válido | Estado “Válido”, duración total 8 h, continuación habilitada |
| INT-04 turno con solapamiento | Estado “Con error”, hallazgo bloqueante, continuación deshabilitada |
| INT-05 consulta | 5 turnos; filtro por colaborador 2; filtro partido 1; filtro sin resultados muestra estado vacío |
| INT-06 extensión `.txt` | Rechazada con mensaje |
| INT-06 archivo `.xlsx` | Vista previa simulada, confirmación habilitada |
| INT-06 confirmación | No agrega turnos; mensaje de simulación; flash para INT-05 |
| INT-06 archivo de 6 MB | Rechazado por tamaño máximo de 5 MB |
| Regresión INT-01/INT-02 | Login, 4 KPI, 5 barras, menú con 5 enlaces y 10 pendientes |
| Consola del navegador | Sin errores en las páginas probadas |

---

## 5. Pendientes

- INT-13 a INT-16.
- Uso real de la descarga CSV en INT-13.
- Verificación visual móvil por el aprendiz (375×667 y 414×896).
- Alineación documental de la ficha Excel de Fase 2, sin modificar esa fase.
- No se declaran pruebas de accesibilidad automatizadas ni validación W3C.

---

## 6. Fase 3.3 — Ajuste de alcance de liquidaciones

**Fecha:** 28/10/2026

### Decisión

INT-07 a INT-12 se implementan como **interfaces frontend demostrativas**, sin motor de cálculo. El objetivo es cumplir la evidencia GA6-AA3-AA4, no desarrollar la lógica empresarial definitiva.

### Motor experimental archivado

- `js/nucleo/liquidacion.js` y `pruebas/liquidacion.test.js` se copiaron a:
  `C:\laragon\archivo-tecnico\SLINT\fase-3.3\`
- Se verificó la copia por hash SHA-256 antes de retirar los originales.
- El motor **no se carga** desde ninguna página.
- Se documenta como experimental, fuera de alcance y no aprobado como motor definitivo.

### Datos demostrativos

`js/datos/liquidaciones-demo.js` contiene los ejemplos:

| ID | Caso | Total |
|---|---|---:|
| L-01 | Diurno, 8 h ordinarias | $ 96.000 |
| L-02 | Nocturno, 8 h | $ 129.600 |
| L-03 | Sábado a domingo, 2 h + 6 h | $ 162.000 |
| L-04 | 8 h ordinarias + 2 h extra | $ 126.000 |

Los valores están precargados y no se calculan en tiempo real.

### Pruebas

- `pruebas/utilidades.test.js`: 18/18 OK (CT-01 y CT-02).
- `pruebas/liquidaciones-demo.test.js`: 20/20 OK (sumas, horas, factores y totales).
- `node --check`: 19 archivos JS sin errores de sintaxis.
- Navegador real:
  - INT-07 muestra 4 ejemplos y permite seleccionar.
  - Selección de L-03 y L-04 guardada en `sessionStorage`.
  - INT-08, INT-09, INT-10, INT-11 e INT-12 cargan el ejemplo seleccionado.
  - L-03 muestra 2 h nocturnas + 6 h dominicales y total $162.000.
  - L-04 muestra 2 h extra diurnas y total $126.000.
  - Estado vacío visible al borrar `liquidacionActual`.
  - 11 enlaces de menú activos y 4 rutas pendientes sin enlaces.
  - Sin errores de consola ni respuestas 4xx/5xx en las pruebas.
  - INT-01 a INT-06 conservan login, dashboard, registro y consulta.
- No se ejecutaron capturas ni pruebas móviles por el agente.

---

## 7. Correcciones posteriores a la revisión de Fase 3.3

### Observación 1 — INT-10

- Se agregó `fecha` explícita a cada segmento en `liquidaciones-demo.js`.
- La tabla de INT-10 ahora separa:
  - **Tipo de día:** ordinario, domingo o festivo.
  - **Clasificación del segmento:** horas ordinarias, nocturnas, extra o dominicales/festivas.
- En L-03 se lee: sábado 10/01/2099 = día ordinario con 2 h nocturnas; domingo 11/01/2099 = día domingo con 6 h dominicales.
- Se añadió la nota: “Un día ordinario no implica que la hora sea ordinaria”.
- No se cambiaron horas ni valores monetarios.

### Observación 2 — INT-12

- La vista contiene dos tablas distintas:
  - Segmentos: 2 filas para L-04.
  - Conceptos agregados: 2 filas para L-04.
- El total de 4 filas del informe anterior era la suma de ambas tablas, no una duplicación.
- Se añadieron contadores visibles y una nota que explica que las tablas no se suman entre sí.
- Se agregó `data-tabla="segmentos"` y `data-tabla="conceptos"` para facilitar la verificación.
- No se modificaron importes ni horas.

### Pruebas adicionales

- `pruebas/liquidaciones-demo.test.js`: **23/23 OK**.
- Nuevas comprobaciones: fecha en todos los segmentos, separación día/concepto en L-03 y dos segmentos/dos conceptos en L-04.

---

## 8. Fase 3.4 — Cierre de interfaces INT-13 a INT-16

**Fecha:** 29/10/2026

### Implementado

- INT-13: filtros, vista previa y CSV real con datos ficticios.
- INT-14: historial de L-01 a L-04 con acciones de resumen y exportación.
- INT-15: usuarios, roles, permisos y formulario con validación frontend.
- INT-16: parámetros con vigencia y formulario con validación frontend.

### Datos

- `js/datos/administracion-demo.js`: 3 roles, 4 usuarios y 6 parámetros ficticios.
- No hay persistencia: los formularios solo confirman validación en pantalla.

### Pruebas

- `node --check`: 24 archivos JS sin errores.
- `pruebas/utilidades.test.js`: 18/18 OK.
- `pruebas/liquidaciones-demo.test.js`: 23/23 OK.
- `pruebas/administracion-demo.test.js`: 5/5 OK.
- Navegador:
  - Menú con 15 enlaces y 0 pendientes.
  - 17 rutas HTML responden 200.
  - INT-13: 4 registros, filtro por colaborador, validación de fechas y descarga CSV de 372 bytes con totales numéricos.
  - INT-14: 4 registros, 8 acciones, “Ver resumen” selecciona L-03 y abre INT-11; “Exportar” filtra por colaborador.
  - INT-15: 4 usuarios, 3 roles, errores de campos vacíos y correo inválido, confirmación demo sin crear usuario.
  - INT-16: 6 parámetros, error de rango de fechas, confirmación demo sin guardar.
  - Sin errores de consola en las pantallas probadas.

### Limitaciones

- CSV generado en el navegador; no hay backend ni base de datos.
- Historial y administración son demostraciones sin persistencia.
- No se ejecutaron capturas ni pruebas móviles por el agente.
- No se declara cumplimiento WCAG automatizado.

---

## 9. Ajuste visual de la pantalla de acceso (29/10/2026)

- Se reestructuró `index.html` en tres bloques: presentación, panel del formulario y pie con credenciales/nota.
- Se corrigió la herencia de la rejilla general que colocaba el acceso en la columna del menú lateral.
- A partir de 900 px:
  - `#contenido` mide como máximo **880 px** (el doble de los 440 px anteriores).
  - La tarjeta usa **dos tercios de la altura visible** (`min-height: 66.67vh`).
  - El contenido se distribuye en dos columnas y permanece centrado.
- Verificación real a 1492 × 1044: main de **880 × 697 px**, centrado, con formulario operativo.
- Se comprobó el envío vacío (errores y foco) y el acceso correcto al Dashboard.
- No se modificaron datos, rutas ni funcionalidades.

### Limitaciones

- No hay cálculo automático ni reglas laborales.
- No se integran los turnos de INT-03 con las liquidaciones.
- No hay capturas generadas por el agente.
- La verificación visual y móvil queda a cargo del aprendiz.
