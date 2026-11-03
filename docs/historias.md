# SLINT — Historias de usuario (borrador para revisión en OpenCode)

**Estado:** propuesta inicial elaborada a partir de la especificación de requisitos y decisiones posteriores de SLINT. No afirmar que estas HU fueron generadas por OpenCode hasta ejecutar y registrar el proceso real.

## HU-01 — Registrar un turno | Prioridad: Alta
**Como** auxiliar de nómina, **quiero** registrar los horarios de un colaborador, **para** disponer de información para su liquidación.
- CA1: Permite seleccionar colaborador y fecha.
- CA2: Solicita entrada y salida del primer tramo.
- CA3: Permite opcionalmente un segundo tramo con entrada y salida.
- CA4: Informa campos obligatorios y errores sin borrar datos.
**Trazabilidad:** RF-001, EXT-01 (turno partido en dos tramos).
**Nota de agrupación:** agrupa el registro básico y el segundo tramo porque forman un mismo flujo de captura de turno.

## HU-02 — Validar horarios | Prioridad: Alta
**Como** coordinador operativo, **quiero** identificar horarios inconsistentes, **para** corregirlos antes de liquidar.
- CA1: Detecta campos incompletos y tramos inválidos.
- CA2: Identifica solapamientos entre tramos.
- CA3: Presenta mensajes que indican el campo y el motivo.
- CA4: Permite corregir y volver a validar.
**Trazabilidad:** RF-009.

## HU-03 — Clasificar horas ordinarias y nocturnas | Prioridad: Alta
**Como** auxiliar de nómina, **quiero** distinguir horas ordinarias y nocturnas, **para** revisar los conceptos aplicables al turno.
- CA1: Muestra el desglose por concepto y cantidad.
- CA2: Presenta correctamente los tramos que cruzan la medianoche (por ejemplo, entrada 22:00 del día 1 y salida 06:00 del día 2) sin duplicar ni perder horas.
- CA3: Identifica los parámetros utilizados y su vigencia; si no hay parámetros configurados, muestra un aviso de "datos de ejemplo".
**Trazabilidad:** RF-002, RF-003.
**Nota de agrupación:** agrupa horas ordinarias y nocturnas porque son conceptos estrechamente relacionados dentro del mismo flujo de clasificación de horas.

## HU-04 — Identificar horas extra | Prioridad: Alta
**Como** auxiliar de nómina, **quiero** distinguir horas extra diurnas y nocturnas, **para** revisar su valoración.
- CA1: Presenta cantidades separadas para ambos conceptos.
- CA2: Explica el criterio o parámetro aplicado en el prototipo.
- CA3: Muestra una leyenda visible junto a los valores de horas extra que indique "cálculo simulado" o "datos de ejemplo".
**Trazabilidad:** RF-004, RF-005.
**Nota de agrupación:** agrupa horas extra diurnas y nocturnas porque son conceptos estrechamente relacionados dentro del mismo flujo de valoración de horas extra.

## HU-05 — Identificar domingos y festivos | Prioridad: Alta
**Como** auxiliar de nómina, **quiero** identificar tiempo laborado en domingos y festivos, **para** aplicar los conceptos correspondientes.
- CA1: Señala los días clasificados como domingo o festivo.
- CA2: En el detalle del turno, muestra la fecha exacta clasificada y el motivo ("domingo" o "festivo").
- CA3: Advierte si no existe calendario de festivos o parámetros configurados.
**Trazabilidad:** RF-006.

## HU-06 — Liquidar un turno y revisar valores | Prioridad: Alta
**Como** auxiliar de nómina, **quiero** consultar la liquidación de un turno por concepto, **para** verificar horas, tarifa y total.
- CA1: Muestra un resumen de conceptos de liquidación.
- CA2: Presenta por cada concepto la cantidad de horas, el valor base por hora, el porcentaje de recargo aplicado, el factor multiplicador cuando corresponda y el subtotal en pesos colombianos.
- CA3: Presenta total en pesos colombianos.
- CA4: Identifica datos de ejemplo cuando el cálculo es simulado.
**Trazabilidad:** RF-007, RF-008, EXT-04 (detalle de liquidación con tarifa, porcentaje y valor por concepto).
**Nota de agrupación:** agrupa el resumen de liquidación y el detalle por concepto porque son operaciones estrechamente relacionadas dentro de un mismo flujo funcional de liquidación.

## HU-07 — Exportar un reporte | Prioridad: Media
**Como** auxiliar de nómina, **quiero** exportar resultados de liquidación, **para** revisarlos y compartirlos en un proceso autorizado.
- CA1: Permite filtrar por período y colaborador.
- CA2: Presenta una vista previa de los resultados.
- CA3: Permite descargar un archivo CSV con JavaScript puro que contenga los datos filtrados de demostración, identificados como tales.
**Trazabilidad:** RF-010.

## HU-08 — Consultar indicadores | Prioridad: Media
**Como** coordinador operativo, **quiero** visualizar un panel de turnos y liquidaciones, **para** identificar pendientes y novedades.
- CA1: Cada indicador muestra título, valor numérico y unidad o periodo de referencia.
- CA2: Cada gráfico incluye título, etiquetas y una tabla o lista textual con los mismos datos.
- CA3: Señala cuándo se utilizan datos ficticios.
**Trazabilidad:** EXT-03 (indicadores y gráficos de turnos y liquidaciones).

## HU-09 — Importar turnos desde Excel | Prioridad: Media
**Como** auxiliar de nómina, **quiero** cargar una plantilla de turnos, **para** reducir la digitación repetitiva.
- CA1: Existe un control de selección de archivo con indicaciones de formato.
- CA2: La pantalla distingue filas válidas, filas con error y filas no procesadas, con una leyenda que explique cada estado.
- CA3: Muestra una leyenda de "importación simulada" y no incorpora filas a la tabla de turnos sin confirmación explícita del usuario.
**Trazabilidad:** EXT-02 (importación masiva de turnos desde Excel).

## HU-10 — Administrar usuarios y parámetros | Prioridad: Media
**Como** administrador, **quiero** consultar y configurar usuarios y parámetros, **para** controlar el acceso y mantener reglas actualizables.
- CA1: Cada rol muestra una lista visible de permisos asociados (por ejemplo: "puede editar turnos", "solo consulta").
- CA2: Los formularios validan datos obligatorios.
- CA3: Los parámetros muestran su fecha de vigencia.
**Trazabilidad:** EXT-05 (gestión de usuarios, roles y parámetros laborales).
**Nota de agrupación:** agrupa usuarios y parámetros porque son operaciones estrechamente relacionadas dentro de un mismo flujo de administración del sistema.

## Revisión obligatoria del aprendiz
- Comparar esta propuesta con la respuesta real de OpenCode.
- Registrar al menos un cambio propio justificado (si corresponde).
- Guardar capturas del prompt, respuesta y versión final validada.
