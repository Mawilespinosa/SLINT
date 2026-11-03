# SLINT — Fichas de especificación por interfaz (Fase 2, AA3-EV01/EV02) — Versión corregida

**Propósito:** documento de especificación previo a los mockups de baja fidelidad en Penpot. Cada ficha define código, nombre, propósito, trazabilidad HU/RF/EXT, elementos principales, acciones de navegación, validaciones y estados de demostración.

**Restricciones aplicadas:**
- HTML5, CSS3 y JavaScript puro. Sin frameworks ni backend.
- Autenticación solo demostrativa, sin servidor real.
- Importación Excel con validación de extensión, vista previa simulada y procesamiento real de contenido pendiente de fase frontend.
- Administración sin persistencia ni CRUD completo.
- Interfaces #8, #9 y #10 con información específica y diferenciada.
- Ninguna función se declara implementada hasta que se construya el frontend.

**Correcciones de esta versión (10 puntos del aprendiz):**
1. INT-03 admite turnos que cruzan medianoche con fecha de salida o indicador explícito.
2. INT-04 diferencia turno nocturno válido, tramo incompleto, duración inconsistente y solapamiento real.
3. INT-06 accesible desde INT-05 y INT-03.
4. INT-16 accesible desde INT-15 y menú de Administración.
5. Rutas de retorno representadas desde INT-08, INT-09, INT-10, INT-12, INT-13, INT-14, INT-15 e INT-16; menú global documentado.
6. INT-14 accesible directamente desde Reportes sin exigir liquidación previa.
7. INT-13: descarga CSV especificada como función futura de fase frontend, no como comprobada.
8. INT-06: se mantiene la diferencia entre selección/validación básica, vista previa simulada y procesamiento real pendiente.
9. Geometría del módulo Gestión de turnos ajustada en el mapa para contener INT-06 sin invadir Reportes.
10. Fichas y mapa coinciden en códigos, nombres, navegación, validaciones y estados.

---

## Módulo: Acceso

### INT-01 — Acceso / identificación demo
| Campo | Contenido |
|---|---|
| **Código** | INT-01 |
| **Nombre** | Acceso / identificación demo |
| **Módulo** | Acceso |
| **Propósito** | Permitir al usuario ingresar al prototipo con credenciales ficticias y mostrar el comportamiento de un formulario de login sin autenticación real. |
| **Trazabilidad** | Transversal (sin RF/EXT propio). Soporta el acceso al conjunto de HU-01 a HU-10. |
| **Elementos principales** | Formulario con campos usuario y contraseña; botón "Ingresar"; leyenda "Demostración: no existe autenticación real contra un servidor"; mensaje de error inline para credenciales incorrectas. |
| **Acciones de navegación** | "Ingresar" → INT-02 (Dashboard). |
| **Validaciones** | Campos obligatorios; si usuario o contraseña están vacíos, muestra mensaje asociado al campo sin borrar lo digitado. |
| **Estados de demostración** | Credenciales predefinidas (por ejemplo: `aprendiz` / `slint2026`) siempre aceptadas. Cualquier otra combinación muestra "Credenciales incorrectas (demo)". No existe petición a servidor, no se guardan sesiones, no se usan cookies ni tokens. |

---

## Módulo: Dashboard

### INT-02 — Dashboard de indicadores
| Campo | Contenido |
|---|---|
| **Código** | INT-02 |
| **Nombre** | Dashboard de indicadores |
| **Módulo** | Dashboard |
| **Propósito** | Presentar un panel de entrada con indicadores y gráficos construidos sin librerías, usando datos ficticios de turnos y liquidaciones. |
| **Trazabilidad** | HU-08; EXT-03. |
| **Elementos principales** | Tarjetas de indicadores (turnos registrados, liquidaciones pendientes, horas extra acumuladas, festivos del período); gráfico de barras o sectores dibujado con HTML/CSS o SVG; tabla textual equivalente al gráfico; leyenda "Datos ficticios de demostración". |
| **Acciones de navegación** | Acceso a módulos desde el menú global: Gestión de turnos (INT-03), Liquidaciones (INT-07), Reportes (INT-13 o INT-14), Administración (INT-15). |
| **Validaciones** | Ninguna de formulario. Los datos se cargan desde arreglos JavaScript ficticios. |
| **Estados de demostración** | Todos los indicadores y gráficos muestran datos de ejemplo. Los gráficos incluyen título, etiquetas y tabla textual con los mismos datos. No se afirma que los datos provengan de un sistema real. |

---

## Módulo: Gestión de turnos

### INT-03 — Registro de turno (único, 2.º tramo opcional)
| Campo | Contenido |
|---|---|
| **Código** | INT-03 |
| **Nombre** | Registro de turno (único, 2.º tramo opcional) |
| **Módulo** | Gestión de turnos |
| **Propósito** | Registrar un turno de trabajo por colaborador en un único formulario, con segundo tramo opcional para turnos partidos y soporte de turnos que cruzan medianoche. |
| **Trazabilidad** | HU-01; RF-001; EXT-01. |
| **Elementos principales** | Select de colaborador; input **Fecha de inicio del turno** (aplica a la entrada 1); entrada 1 y salida 1; checkbox "La salida 1 es del día siguiente"; checkbox "Agregar segundo tramo" que muestra entrada 2 y salida 2; checkbox "La salida 2 es del día siguiente"; panel visible con la regla de determinación de fechas y un ejemplo ficticio; botón "Registrar turno"; área de mensajes de error. |
| **Acciones de navegación** | "Registrar turno" (tras validación) → INT-05 (Consulta de turnos). Enlace a INT-06 (Importar) desde el formulario y desde INT-05. |
| **Validaciones** | Colaborador y fecha de inicio obligatorios; entrada 1 y salida 1 obligatorios; **determinación de fechas:** la fecha de inicio aplica a la entrada 1; la fecha de salida 1 = fecha de inicio + 1 día si se marca "día siguiente", o la misma fecha si no se marca; la entrada 2 se ubica en la fecha de fin del tramo 1; la salida 2 = fecha de fin del tramo 1 + 1 día si se marca "día siguiente"; **no se rechaza automáticamente una salida con hora menor que la entrada**: se usa el indicador de día siguiente para construir la línea de tiempo absoluta; si la salida es menor y no se marcó el indicador, se muestra error "Indique si la salida es del día siguiente"; si se activa el 2.º tramo, entrada 2 y salida 2 obligatorios; en turno partido se valida el orden cronológico y la ausencia de solapamiento en la línea de tiempo absoluta; mensajes asociados a cada campo sin borrar datos. |
| **Estados de demostración** | El turno registrado se agrega a un arreglo JavaScript ficticio en memoria; no hay persistencia. Se muestra confirmación "Turno registrado (demo)". |

### INT-04 — Validación de horarios
| Campo | Contenido |
|---|---|
| **Código** | INT-04 |
| **Nombre** | Validación de horarios |
| **Módulo** | Gestión de turnos |
| **Propósito** | Detectar y mostrar inconsistencias en los turnos registrados antes de la liquidación, diferenciando turnos nocturnos válidos de errores reales. |
| **Trazabilidad** | HU-02; RF-009. |
| **Elementos principales** | Lista o tabla de turnos registrados; indicador de estado por turno (válido / con advertencia / con error); detalle del motivo de cada hallazgo (campo y causa); botón "Corregir" que lleva al formulario; botón "Volver a validar". |
| **Acciones de navegación** | "Corregir" → INT-03 con los datos del turno precargados. Enlace de retorno a INT-05. |
| **Validaciones** | **Reglas diferenciadas:** (a) turno nocturno válido: salida con hora menor que entrada con indicador de cruce de medianoche o fecha de salida posterior → estado "válido"; (b) tramo incompleto: falta entrada o salida en cualquiera de los dos tramos → estado "con error"; (c) duración inconsistente: la duración excede un **umbral configurable de ejemplo** (17,5 horas en el wireframe) o es nula → estado "con advertencia" (el umbral es un parámetro de demostración, no una regla legal); (d) solapamiento real: en turno partido, el tramo 2 comienza antes de que termine el tramo 1 en la línea de tiempo absoluta → estado "con error". No se asume que toda salida con hora menor que la entrada es inválida. |
| **Estados de demostración** | Se muestran turnos ficticios que ejemplifican cada caso: turno nocturno válido, turno incompleto, duración excesiva y solapamiento. La validación se ejecuta con JavaScript puro sobre el arreglo en memoria; no hay backend. |

### INT-05 — Consulta de turnos
| Campo | Contenido |
|---|---|
| **Código** | INT-05 |
| **Nombre** | Consulta de turnos |
| **Módulo** | Gestión de turnos |
| **Propósito** | Listar los turnos registrados, permitir filtrarlos y servir de punto de entrada a validación, importación y liquidación. |
| **Trazabilidad** | HU-01, HU-02; RF-001, RF-009 (apoyo). |
| **Elementos principales** | Tabla con columnas: colaborador, fecha, entrada 1, salida 1, entrada 2, salida 2, indicador de cruce de medianoche, estado; filtros por colaborador y rango de fechas; acciones por fila: "Validar", "Liquidar"; botón "Importar turnos". |
| **Acciones de navegación** | "Validar" → INT-04. "Liquidar" → INT-07 (Flujo de liquidación). "Importar turnos" → INT-06. "Registrar nuevo" → INT-03. |
| **Validaciones** | Filtros con campos opcionales; si no hay turnos que coincidan, se muestra "No hay turnos para los filtros seleccionados". |
| **Estados de demostración** | Lista poblada con turnos ficticios, incluyendo al menos un turno nocturno válido. El filtrado se realiza con JavaScript puro en el navegador. |

### INT-06 — Importar turnos desde Excel
| Campo | Contenido |
|---|---|
| **Código** | INT-06 |
| **Nombre** | Importar turnos desde Excel |
| **Módulo** | Gestión de turnos |
| **Propósito** | Ofrecer una interfaz de carga masiva de turnos desde archivo, diferenciando claramente la selección y validación básica, la vista previa simulada y el procesamiento real de contenido aún no implementado. |
| **Trazabilidad** | HU-09; EXT-02. |
| **Elementos principales** | Input de tipo archivo con indicaciones de formato; botón "Seleccionar archivo"; **tabla de vista previa simulada** que distingue filas válidas, filas con error y filas no procesadas; leyenda por estado; leyenda "Vista previa simulada: el contenido del archivo no se procesa todavía"; leyenda "Importación simulada: no se incorporan datos reales"; botón "Confirmar importación (demo)". |
| **Acciones de navegación** | "Confirmar importación (demo)" → INT-05. Enlace a INT-03 para registro manual. Accesible desde INT-05 ("Importar turnos") y desde INT-03 (enlace lateral "¿Prefiere cargar un archivo?"). |
| **Validaciones** | **Selección y validación básica (implementada en el frontend):** extensión del archivo debe ser `.xlsx`, `.xls` o `.csv`; si la extensión no es válida, mensaje de error sin borrar la selección; si no se selecciona archivo, mensaje "Seleccione un archivo". **Vista previa simulada:** al seleccionar un archivo con extensión válida, se muestra una tabla ficticia de 5 filas (3 válidas, 1 con error, 1 no procesada). **Procesamiento real de contenido:** no está definido ni implementado en esta fase; requeriría una estrategia técnica explícita (lectura de archivo, mapeo de columnas y validación) y autorización posterior. No se lee el archivo con librería alguna y no se afirma que se importaron datos reales. |
| **Estados de demostración** | Tres niveles claramente diferenciados en la interfaz: (1) selección y validación de extensión — funcional en el navegador; (2) vista previa de filas — simulada con datos ficticios; (3) incorporación de datos — no implementada, solo se muestra mensaje de demostración al confirmar. |

---

## Módulo: Liquidaciones

### INT-07 — Flujo de liquidación (clasificación integrada)
| Campo | Contenido |
|---|---|
| **Código** | INT-07 |
| **Nombre** | Flujo de liquidación (clasificación integrada) |
| **Módulo** | Liquidaciones |
| **Propósito** | Presentar en una sola vista la clasificación de horas de un turno: ordinarias, nocturnas, extra diurnas, extra nocturnas, domingos y festivos, sin exigir cálculos manuales en páginas aisladas. |
| **Trazabilidad** | HU-03, HU-04, HU-05; RF-002, RF-003, RF-004, RF-005, RF-006. |
| **Elementos principales** | Encabezado con datos del turno (colaborador, fecha, tramos, indicador de cruce de medianoche); tabla resumen por tipo de hora (ordinaria, nocturna, extra diurna, extra nocturna, domingo, festivo) con cantidad de horas; enlaces "Ver detalle" por tipo; leyenda de parámetros utilizados y su vigencia o aviso de "datos de ejemplo"; botón "Continuar a resumen". |
| **Acciones de navegación** | "Ver detalle OH" → INT-08. "Ver detalle HE" → INT-09. "Ver detalle festivos" → INT-10. "Continuar a resumen" → INT-11. Retorno a INT-05. |
| **Validaciones** | El turno seleccionado debe tener tramos completos; si el turno tiene errores de validación, se muestra aviso y enlace a INT-04. |
| **Estados de demostración** | La clasificación se calcula con JavaScript puro sobre datos ficticios y parámetros de ejemplo. Los turnos nocturnos que cruzan medianoche se clasifican correctamente en horas ordinarias y nocturnas según el rango de horas. No se presentan como liquidaciones legales verificadas. |

### INT-08 — Detalle de horas ordinarias y nocturnas
| Campo | Contenido |
|---|---|
| **Código** | INT-08 |
| **Nombre** | Detalle de horas ordinarias y nocturnas |
| **Módulo** | Liquidaciones |
| **Propósito** | Explicar de forma específica cómo se distribuyen las horas ordinarias y nocturnas de un turno, incluyendo el cruce de medianoche. |
| **Trazabilidad** | HU-03; RF-002, RF-003. |
| **Elementos principales** | Tabla desglosada por tramo con columnas: tramo, rango de horas, horas ordinarias, horas nocturnas; indicación visual del período nocturno; ejemplo de turno que cruza medianoche; leyenda de parámetros o "datos de ejemplo". |
| **Acciones de navegación** | Retorno a INT-07 (botón "Volver al flujo de liquidación"). |
| **Validaciones** | Ninguna de formulario. La información se deriva del turno seleccionado en INT-07. |
| **Estados de demostración** | Datos ficticios. Si no hay parámetros configurados, se muestra el aviso "datos de ejemplo". |

### INT-09 — Detalle de horas extra
| Campo | Contenido |
|---|---|
| **Código** | INT-09 |
| **Nombre** | Detalle de horas extra |
| **Módulo** | Liquidaciones |
| **Propósito** | Explicar de forma específica las horas extra diurnas y nocturnas identificadas en el turno, con el criterio o parámetro aplicado. |
| **Trazabilidad** | HU-04; RF-004, RF-005. |
| **Elementos principales** | Tabla con columnas: tipo (extra diurna / extra nocturna), cantidad de horas, parámetro o criterio aplicado, vigencia; leyenda visible "Cálculo simulado / datos de ejemplo" junto a los valores. |
| **Acciones de navegación** | Retorno a INT-07 (botón "Volver al flujo de liquidación"). |
| **Validaciones** | Ninguna de formulario. |
| **Estados de demostración** | Datos ficticios. No se presentan como definitivos; la leyenda es obligatoria en todos los valores mostrados. |

### INT-10 — Detalle de domingos y festivos
| Campo | Contenido |
|---|---|
| **Código** | INT-10 |
| **Nombre** | Detalle de domingos y festivos |
| **Módulo** | Liquidaciones |
| **Propósito** | Explicar de forma específica qué días del turno fueron clasificados como domingo o festivo, con la fecha exacta y el motivo. |
| **Trazabilidad** | HU-05; RF-006. |
| **Elementos principales** | Tabla con columnas: fecha, motivo (domingo / festivo), horas laboradas en ese día; calendario o lista de fechas del turno; leyenda "Calendario de festivos ficticio"; aviso si no hay calendario configurado. |
| **Acciones de navegación** | Retorno a INT-07 (botón "Volver al flujo de liquidación"). |
| **Validaciones** | Ninguna de formulario. |
| **Estados de demostración** | Fechas ficticias del año 2099 con día de la semana real: 05/01/2099 (lunes, día hábil de demostración), 11/01/2099 (domingo) y 12/01/2099 (lunes, festivo trasladado por Reyes Magos en Colombia, **sujeto a verificación normativa**). Turnos, horas y valores monetarios son datos de demostración y no constituyen una liquidación legal verificada. Si no existe calendario de festivos configurado, se muestra el aviso correspondiente. |

### INT-11 — Resumen de liquidación
| Campo | Contenido |
|---|---|
| **Código** | INT-11 |
| **Nombre** | Resumen de liquidación |
| **Módulo** | Liquidaciones |
| **Propósito** | Mostrar el resumen de la liquidación del turno completo con el total en pesos colombianos y la identificación de datos simulados. |
| **Trazabilidad** | HU-06; RF-007. |
| **Elementos principales** | Encabezado con colaborador y fecha; tabla resumen por concepto (tipo de hora, cantidad de horas, subtotal); total en pesos colombianos; leyenda "Liquidación de demostración, no es un documento legal". |
| **Acciones de navegación** | "Ver detalle por concepto" → INT-12. "Exportar" → INT-13. "Ver historial" → INT-14. Retorno a INT-07. |
| **Validaciones** | El turno debe haber completado el flujo de clasificación; si no, mensaje de aviso. |
| **Estados de demostración** | Cálculo simulado con JavaScript puro sobre datos ficticios. Los subtotales y el total se muestran como valores de ejemplo. |

### INT-12 — Detalle de liquidación por concepto
| Campo | Contenido |
|---|---|
| **Código** | INT-12 |
| **Nombre** | Detalle de liquidación por concepto |
| **Módulo** | Liquidaciones |
| **Propósito** | Desglosar la liquidación por cada concepto con horas, valor base por hora, porcentaje de recargo, factor multiplicador y subtotal. |
| **Trazabilidad** | HU-06; RF-008; EXT-04. |
| **Elementos principales** | Tabla por concepto con columnas: concepto, cantidad de horas, valor base por hora, porcentaje de recargo, factor multiplicador (cuando corresponda), subtotal en pesos colombianos; total general; leyenda "Cálculo simulado". |
| **Acciones de navegación** | Retorno a INT-11 (botón "Volver al resumen"). Enlace a INT-13 (Exportar). |
| **Validaciones** | Ninguna de formulario. |
| **Estados de demostración** | Porcentaje de recargo y factor multiplicador se presentan como conceptos separados, no como sinónimos. Datos ficticios identificados como tales. |

---

## Módulo: Reportes

### INT-13 — Exportación de resultados
| Campo | Contenido |
|---|---|
| **Código** | INT-13 |
| **Nombre** | Exportación de resultados |
| **Módulo** | Reportes |
| **Propósito** | Especificar la futura exportación de liquidaciones filtradas a un archivo CSV, que se implementará y probará durante la fase de frontend con JavaScript puro. |
| **Trazabilidad** | HU-07; RF-010. |
| **Elementos principales** | Filtros: fecha desde, fecha hasta, colaborador; tabla de vista previa de resultados; botón "Descargar CSV (pendiente de implementación)"; leyenda "Especificación futura: la descarga CSV se implementará y probará en la fase de frontend"; leyenda "Archivo de demostración con datos ficticios". |
| **Acciones de navegación** | Retorno a INT-11 o INT-14. Accesible desde menú global de Reportes y desde INT-11. |
| **Validaciones** | Fecha desde no puede ser posterior a fecha hasta; filtros opcionales; si no hay resultados, mensaje "No hay liquidaciones para los filtros seleccionados". |
| **Estados de demostración** | **La descarga CSV no está implementada ni probada en esta fase.** Se especifica que, en la fase de frontend, deberá implementarse con JavaScript puro (Blob + enlace de descarga) y probarse con datos ficticios. No se afirma funcionamiento comprobado. |

### INT-14 — Historial de liquidaciones
| Campo | Contenido |
|---|---|
| **Código** | INT-14 |
| **Nombre** | Historial de liquidaciones |
| **Módulo** | Reportes |
| **Propósito** | Listar las liquidaciones del prototipo para consultarlas, volver a ver su resumen o exportarlas, sin exigir que el usuario haya generado una liquidación previamente en la sesión. |
| **Trazabilidad** | HU-06, HU-07; RF-007, RF-010 (apoyo). |
| **Elementos principales** | Tabla con columnas: colaborador, fecha del turno, total, estado; acciones por fila: "Ver resumen", "Exportar"; leyenda "Datos ficticios de demostración"; estado vacío "Aún no hay liquidaciones en esta vista". |
| **Acciones de navegación** | "Ver resumen" → INT-11. "Exportar" → INT-13. **Accesible directamente desde el menú global de Reportes (INT-02 → Reportes → INT-14), sin exigir liquidación previa.** |
| **Validaciones** | Si no hay liquidaciones en el historial, mensaje "Aún no se han generado liquidaciones en esta sesión"; la pantalla es accesible igualmente. |
| **Estados de demostración** | Al iniciar sesión, el historial puede estar vacío o poblado con liquidaciones ficticias de referencia. Se llena conforme el usuario recorre el flujo de liquidación en la sesión actual (en memoria), pero su acceso no depende de ello. |

---

## Módulo: Administración

### INT-15 — Usuarios y roles
| Campo | Contenido |
|---|---|
| **Código** | INT-15 |
| **Nombre** | Usuarios y roles |
| **Módulo** | Administración |
| **Propósito** | Demostrar visualmente la consulta de usuarios y roles con sus permisos, y un formulario con validaciones frontend. |
| **Trazabilidad** | HU-10; EXT-05. |
| **Elementos principales** | Tabla de usuarios ficticios (nombre, rol, estado); detalle de permisos por rol visible; formulario de nuevo usuario con campos nombre, correo, rol; botón "Guardar (demo)"; leyenda "Demostración visual: no hay persistencia ni operaciones CRUD completas". |
| **Acciones de navegación** | "Guardar (demo)" muestra confirmación sin agregar a una base de datos. Enlace a INT-16 (Parámetros laborales). Retorno a INT-02 (menú global o botón "Volver al dashboard"). |
| **Validaciones** | Campos obligatorios (nombre, correo, rol); correo con formato válido; mensajes asociados al campo sin borrar datos. |
| **Estados de demostración** | Lista de usuarios ficticia. El formulario valida en el navegador pero no almacena. No se afirma que se creó, editó ni eliminó un usuario real. |

### INT-16 — Parámetros laborales
| Campo | Contenido |
|---|---|
| **Código** | INT-16 |
| **Nombre** | Parámetros laborales |
| **Módulo** | Administración |
| **Propósito** | Demostrar visualmente la consulta de parámetros laborales con su fecha de vigencia, y un formulario con validaciones frontend. |
| **Trazabilidad** | HU-10; EXT-05. |
| **Elementos principales** | Tabla de parámetros ficticios (nombre, valor, vigente desde, vigente hasta, estado vigente/no vigente); formulario de nuevo parámetro con campos nombre, valor, fecha de vigencia; botón "Guardar (demo)"; leyenda "Demostración visual: no hay persistencia ni operaciones CRUD completas". |
| **Acciones de navegación** | "Guardar (demo)" muestra confirmación sin agregar a una base de datos. Enlace a INT-15 (Usuarios y roles). Retorno a INT-02 (menú global o botón "Volver al dashboard"). **Accesible desde INT-15 y desde el menú de Administración en el menú global.** |
| **Validaciones** | Campos obligatorios; valor numérico; fecha de vigencia con formato válido; si la fecha de fin es anterior a la de inicio, mensaje de error. |
| **Estados de demostración** | Lista de parámetros ficticia. El formulario valida en el navegador pero no almacena. Los parámetros muestran su fecha de vigencia tal como exige HU-10 CA3. No se afirma persistencia. |

---

## Rutas de navegación (resumen)

### Rutas principales
1. INT-01 → INT-02 (ingreso)
2. INT-02 → INT-03 (menú Turnos)
3. INT-03 → INT-04 → INT-05 → INT-07 → INT-11 → INT-12 (flujo completo de liquidación)
4. INT-07 → INT-08 / INT-09 / INT-10 (vistas de detalle) → retorno a INT-07
5. INT-11 → INT-13 / INT-14 (reportes)

### Rutas de importación
6. INT-05 → INT-06 (botón "Importar turnos")
7. INT-03 → INT-06 (enlace "¿Prefiere cargar un archivo?")
8. INT-06 → INT-05 (confirmar importación demo)

### Rutas de administración
9. INT-02 → INT-15 (menú Administración)
10. INT-15 → INT-16 (enlace a parámetros)
11. INT-16 → INT-15 (enlace a usuarios)
12. INT-15 / INT-16 → INT-02 (retorno al dashboard)

### Rutas de reportes sin liquidación previa
13. INT-02 → INT-14 (menú Reportes → Historial, accesible sin liquidación previa)
14. INT-02 → INT-13 (menú Reportes → Exportación)

### Menú global
Tras iniciar sesión (INT-01 → INT-02), todas las pantallas comparten un menú superior con acceso directo a: Turnos, Liquidaciones, Reportes, Administración y Dashboard. Las rutas punteadas del mapa muestran retornos específicos además del menú global.

---

## Matriz resumen de cobertura

| Interfaz | Módulo | HU | RF/EXT |
|---|---|---|---|
| INT-01 | Acceso | — (transversal) | — |
| INT-02 | Dashboard | HU-08 | EXT-03 |
| INT-03 | Gestión de turnos | HU-01 | RF-001, EXT-01 |
| INT-04 | Gestión de turnos | HU-02 | RF-009 |
| INT-05 | Gestión de turnos | HU-01, HU-02 | RF-001, RF-009 |
| INT-06 | Gestión de turnos | HU-09 | EXT-02 |
| INT-07 | Liquidaciones | HU-03, HU-04, HU-05 | RF-002 a RF-006 |
| INT-08 | Liquidaciones | HU-03 | RF-002, RF-003 |
| INT-09 | Liquidaciones | HU-04 | RF-004, RF-005 |
| INT-10 | Liquidaciones | HU-05 | RF-006 |
| INT-11 | Liquidaciones | HU-06 | RF-007 |
| INT-12 | Liquidaciones | HU-06 | RF-008, EXT-04 |
| INT-13 | Reportes | HU-07 | RF-010 |
| INT-14 | Reportes | HU-06, HU-07 | RF-007, RF-010 |
| INT-15 | Administración | HU-10 | EXT-05 |
| INT-16 | Administración | HU-10 | EXT-05 |

**Cobertura completa:** HU-01 a HU-10, RF-001 a RF-010, EXT-01 a EXT-05. Los documentos de la Fase 1 no fueron modificados.

---

## Decisiones pendientes de revisión del aprendiz

1. Abrir `docs/mapa-navegacion.drawio` en [diagrams.net](https://app.diagrams.net) y validar que las conexiones reflejan el flujo esperado, incluidas las rutas de retorno punteadas y el menú global.
2. Revisar las 16 fichas y confirmar que propósito, elementos, validaciones y estados de demostración son coherentes con su intención.
3. Confirmar o ajustar las credenciales demo propuestas para INT-01 (`aprendiz` / `slint2026`).
4. Confirmar que INT-03 admite turnos de cruce de medianoche como se especifica.
5. Confirmar que INT-04 diferencia los cuatro casos de validación.
6. Autorizar el inicio de los 16 frames de baja fidelidad en Penpot.
