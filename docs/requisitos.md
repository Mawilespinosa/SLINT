# SLINT — Matriz de requisitos funcionales y trazabilidad

**Fuente principal:** especificación original GA1 (RF-001 a RF-010). **Ampliaciones:** decisiones posteriores de diseño, identificadas como EXT para no alterar la numeración original. Prioridades propuestas para validar con el aprendiz.

| Código | Descripción verificable | HU origen | Prioridad | Origen |
|---|---|---|---|---|
| RF-001 | El sistema debe permitir registrar horarios de trabajo por colaborador. | HU-01 | Alta | GA1 |
| RF-002 | El sistema debe calcular y mostrar horas ordinarias de un turno. | HU-03 | Alta | GA1 |
| RF-003 | El sistema debe calcular y mostrar horas nocturnas de un turno. | HU-03 | Alta | GA1 |
| RF-004 | El sistema debe calcular y mostrar horas extra diurnas. | HU-04 | Alta | GA1 |
| RF-005 | El sistema debe calcular y mostrar horas extra nocturnas. | HU-04 | Alta | GA1 |
| RF-006 | El sistema debe identificar trabajo en domingos y festivos. | HU-05 | Alta | GA1 |
| RF-007 | El sistema debe generar un resumen de liquidación del turno completo. | HU-06 | Alta | GA1 |
| RF-008 | El sistema debe valorar los conceptos y totales en pesos colombianos. | HU-06 | Alta | GA1 |
| RF-009 | El sistema debe validar turnos inconsistentes y mostrar alertas para corregirlos. | HU-02 | Alta | GA1 |
| RF-010 | El sistema debe permitir exportar resultados de liquidación. | HU-07 | Media | GA1 |
| EXT-01 | El sistema debe permitir capturar un turno partido en dos tramos. | HU-01 | Alta | Evolución SLINT |
| EXT-02 | El sistema debe ofrecer una interfaz para importación masiva de turnos desde Excel. | HU-09 | Media | Evolución SLINT |
| EXT-03 | El sistema debe mostrar indicadores y gráficos de turnos y liquidaciones. | HU-08 | Media | Evolución SLINT |
| EXT-04 | El sistema debe mostrar tarifa, porcentaje y valor por tipo de hora en el detalle de liquidación. | HU-06 | Alta | Evolución SLINT |
| EXT-05 | El sistema debe permitir gestionar usuarios, roles y parámetros laborales. | HU-10 | Media | Evolución SLINT |

## Restricciones no funcionales para el frontend de la evidencia
- HTML5 semántico, CSS3 y JavaScript puro, sin frameworks ni librerías.
- Interfaz completamente en español.
- Accesibilidad: etiquetas, teclado, foco visible, contraste y errores asociados a los controles.
- Diseño responsive adaptable a celular, tableta y escritorio.
- Un único `styles.css` con variables `:root` y plantilla compartida `plantilla.html`.
- Datos ficticios y sin credenciales reales.
- Demostraciones visuales identificadas como tales; no prometer integración backend ni cálculos legales verificados.

## Entregables de evidencia
- Incluir al menos dos capturas de pantalla en ancho móvil que demuestren el diseño responsive.
- Guardar capturas del prompt, respuesta y versión final validada de la revisión de historias y requisitos.

## Control de trazabilidad para fases siguientes
Cada pantalla (mínimo 12) deberá registrar: nombre, archivo, RF/EXT, HU, descripción y decisión de usabilidad/accesibilidad. Cada pantalla deberá enlazar con el mapa de navegación y reutilizar estilos de `styles.css`.

## Correspondencia bidireccional verificada
Cada RF/EXT tiene una HU origen declarada y cada HU declara en su trazabilidad al menos un RF o EXT. No se han creado ni eliminado requisitos; se conservan los códigos RF-001 a RF-010 y EXT-01 a EXT-05.

## Pendiente de validación
Revisar con el aprendiz los requisitos EXT y las prioridades antes de dar por aprobada esta matriz. No confundir ampliaciones de interfaz con el conjunto original de diez RF.
