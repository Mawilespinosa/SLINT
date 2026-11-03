# SLINT — Catálogo de componentes (Fase 3)

Documentación de los componentes reutilizables implementados en el Bloque 0 y usados por las interfaces del Bloque 1.

**Alcance:** HTML5, CSS3 y JavaScript puro. Sin frameworks, sin librerías, sin backend.

---

## 1. Archivos base

| Archivo | Función |
|---|---|
| `styles.css` | Única hoja de estilos. Tokens en `:root`, layout, componentes, responsive e impresión. |
| `js/nucleo/navegacion.js` | Mapa único de las 16 interfaces, módulos y estado (`listo` / `pendiente`). |
| `js/nucleo/utilidades.js` | Formato COP, fechas sin desfase, CSV con Blob y acceso seguro a `sessionStorage`. |
| `js/nucleo/componentes.js` | Genera cabecera, menú lateral, migas, aviso demo y pie. |
| `js/nucleo/turnos.js` | Almacenamiento temporal y evaluación de turnos: duraciones, solapamientos y advertencias. |
| `js/datos/liquidaciones-demo.js` | Cuatro ejemplos precargados de liquidación para las interfaces INT-07 a INT-12. Sin cálculo en tiempo real. |
| `js/datos/administracion-demo.js` | Usuarios, roles, permisos y parámetros ficticios para INT-15 e INT-16. |
| `js/paginas/*.js` | Lógica específica de cada interfaz implementada. |
| `plantilla.html` | Referencia canónica del esqueleto de página. |
| `componentes.html` | Galería visual y prueba de regresión. |
| `assets/iconos.svg` | Sprite SVG propio con símbolos. |

### Orden obligatorio de scripts

```html
<script src="js/nucleo/navegacion.js" defer></script>
<script src="js/nucleo/utilidades.js" defer></script>
<script src="js/nucleo/componentes.js" defer></script>
<script src="js/datos/datos-demo.js" defer></script>
<script src="js/paginas/<pagina>.js" defer></script>
```

`utilidades.js` debe cargarse antes de `componentes.js` porque este último consume `SLINT.utils` al inicializar.

---

## 2. Atributos de `<body>`

| Atributo | Valores | Efecto |
|---|---|---|
| `data-pagina` | `INT-01` … `INT-16`, `PLANTILLA`, `COMPONENTES` | Marca el ítem activo del menú y genera migas. |
| `data-menu` | `true` / `false` | Muestra u oculta el menú lateral. |
| `data-demo` | `true` / `false` | Inserta el aviso de datos ficticios. |

---

## 3. Componentes

### 3.1 Cabecera

Clases: `slint-cabecera`, `slint-cabecera__interior`, `slint-marca`, `slint-marca__sigla`, `slint-marca__texto`, `slint-cabecera__acciones`, `slint-usuario`, `slint-menu-toggle`.

- Se inyecta en `<header id="slint-cabecera"></header>`.
- Incluye marca, badge DEMO y botón "Salir (demo)" que borra la marca de sesión de `sessionStorage`.
- En móvil muestra el botón hamburguesa con `aria-expanded` y `aria-controls`.

### 3.2 Menú lateral

Clases: `slint-menu`, `slint-menu__grupo`, `slint-menu__titulo`, `slint-menu__lista`, `slint-menu__enlace`, `slint-menu__enlace--pendiente`, `slint-menu__icono`.

- Se inyecta en `<aside id="slint-menu">`.
- Se genera desde `navegacion.js`; **no se escribe a mano en cada página**.
- Ítem activo: clase `is-activo` + `aria-current="page"`.
- Interfaces no implementadas: `<span aria-disabled="true">` con badge "Pendiente"; **no generan enlaces rotos**.
- En móvil es un panel off-canvas con velo, cierre con `Esc` y retorno de foco al botón.

### 3.3 Migas de pan

Clases: `slint-migas`. Se insertan al inicio de `<main id="contenido">` según `data-pagina`. En el Dashboard muestran solo "Dashboard"; en el resto, "Inicio / Módulo / Página".

### 3.4 Botones

| Variante | Clase |
|---|---|
| Primario | `slint-boton` |
| Secundario | `slint-boton slint-boton--secundario` |
| Peligro | `slint-boton slint-boton--peligro` |
| Pequeño | `slint-boton slint-boton--pequeno` |
| Deshabilitado | atributo `disabled` |
| Pendiente | `is-pendiente` + `aria-disabled="true"` |

Altura mínima 44 px. Enter/Espacio funcionan de forma nativa en `<button>`.

### 3.5 Campos

Clases: `slint-formulario`, `slint-formulario--dos-columnas`, `slint-campo`, `slint-campo__label`, `slint-campo__requerido`, `slint-campo__control`, `slint-campo__ayuda`, `slint-campo__error`, `slint-check`, `slint-check__texto`.

Reglas:
- `label for` siempre presente.
- Error: `aria-invalid="true"` + `aria-describedby` apuntando al mensaje.
- El mensaje de error no reemplaza al valor digitado.

### 3.6 Mensajes

Clases: `slint-mensaje` + `--info`, `--exito`, `--advertencia`, `--error`, `--demo`.

- `role="alert"` para errores.
- `role="status"` para información, éxito, advertencia y demo.

### 3.7 Badges

Clases: `slint-badge` + `--valido`, `--advertencia`, `--error`, `--neutro`, `--demo`, `--pendiente`.

El estado se comunica con texto, no solo con color.

### 3.8 Tarjetas y KPI

Clases: `slint-tarjeta`, `slint-tarjeta__titulo`, `slint-tarjeta__texto`, `slint-panel`, `slint-kpi`, `slint-kpi__etiqueta`, `slint-kpi__valor`, `slint-kpi__unidad`.

### 3.9 Tablas

Clases: `slint-tabla-contenedor`, `slint-tabla`, `slint-tabla--numeros`, `slint-tabla--apilada`.

- Requieren `<caption>` y `th scope`.
- En móvil (`< 768 px`) las filas se apilan usando `data-label` en cada celda.
- Las tablas anchas usan contenedor con scroll.

### 3.10 Gráfico sin librerías

Clases: `slint-grafico`, `slint-grafico__item`, `slint-grafico__barra`, `slint-grafico__valor`, `slint-grafico__etiqueta`.

Variantes: `--nocturna`, `--extra`, `--festiva`. La altura se controla con la variable `--altura`. Siempre se acompaña de una tabla textual equivalente.

### 3.11 Estado vacío y diálogo

- `slint-vacio`, `slint-vacio__titulo`.
- `dialog.slint-dialogo` con `slint-dialogo__cabecera`, `__cuerpo`, `__pie`. Se abre con `data-abrir-dialogo="id"`; se cierra con un formulario `method="dialog"`.

### 3.12 Formularios ampliados y turnos

| Componente | Clases | Uso |
|---|---|---|
| Fieldset de tramo | `slint-fieldset`, `slint-fieldset__leyenda` | Agrupar entradas y salidas de un tramo |
| Acciones de formulario | `slint-formulario__acciones` | Botones de guardar y cancelar |
| Filtros | `slint-filtros`, `slint-filtros__acciones` | Filtros de consulta responsive |
| Resumen de datos | `slint-resumen`, `slint-resumen__dato` | Datos clave del turno o liquidación |
| Hallazgos | `slint-hallazgos`, `slint-hallazgo--error`, `slint-hallazgo--advertencia` | Errores bloqueantes y advertencias configurables |
| Archivo | `slint-archivo`, `slint-archivo__info` | Selección y metadatos del archivo |
| Acciones de tabla | `slint-acciones-tabla`, `slint-enlace-accion` | Validar, ver o acciones pendientes |

### 3.13 Persistencia temporal de demostración

Claves de `sessionStorage` (prefijo `slint.demo.`):

| Clave | Contenido | Notas |
|---|---|---|
| `sesion` | Usuario demo e instante de inicio | Nunca contiene contraseña |
| `turnos` | Arreglo de turnos ficticios | Se siembra con datos de demostración la primera vez |
| `flash` | Mensaje temporal entre páginas | Se elimina después de mostrarse |

Si `sessionStorage` no está disponible, `turnos.js` mantiene los datos en memoria durante la página actual y la aplicación sigue funcionando.

---

## 4. Paleta y contraste verificado

Contraste calculado con la fórmula WCAG 2.x (luminancia relativa). Valores reales:

| Combinación | Uso | Ratio | AA texto |
|---|---|---|---|
| `#1C2733` sobre `#FFFFFF` | Texto principal / superficie | 15,14 | Sí |
| `#1C2733` sobre `#F4F6F8` | Texto principal / fondo | 13,97 | Sí |
| `#52606D` sobre `#FFFFFF` | Texto suave / superficie | 6,46 | Sí |
| `#52606D` sobre `#F4F6F8` | Texto suave / fondo | 5,96 | Sí |
| `#FFFFFF` sobre `#0B2E4F` | Texto / azul 900 | 13,83 | Sí |
| `#FFFFFF` sobre `#12507E` | Texto / azul 700 | 8,49 | Sí |
| `#D7E3EE` sobre `#0B2E4F` | Cabecera secundaria | 10,61 | Sí |
| `#E8F0F7` sobre `#0B2E4F` | Enlaces del menú | 12,02 | Sí |
| `#9FB6CC` sobre `#0B2E4F` | Menú pendiente | 6,61 | Sí |
| `#C7D6E4` sobre `#0B2E4F` | Títulos del menú | 9,33 | Sí |
| `#FFD166` sobre `#0B2E4F` | Anillo de foco en oscuro | 9,59 | Sí |
| `#1D4ED8` sobre `#FFFFFF` | Anillo de foco en claro | 6,70 | Sí |
| `#B42318` sobre `#FDECEA` | Texto de error | 7,84 | Sí |
| `#145C39` sobre `#E8F5EE` | Texto de éxito | 7,15 | Sí |
| `#6B4600` sobre `#FFF4E0` | Texto de advertencia | 7,70 | Sí |
| `#4E3675` sobre `#F1ECFA` | Texto demo | 8,59 | Sí |
| `#1A3A8F` sobre `#E8EEFD` | Texto informativo | 8,84 | Sí |
| `#0B2E4F` sobre `#E6EEF5` | Encabezado de tabla | 11,80 | Sí |
| `#46525E` sobre `#EEF1F4` | Badge neutro | 7,05 | Sí |

**Nota:** `#C9A227` sobre blanco da **2,42** y **no se usa para texto**. Se emplea únicamente como borde decorativo (franja superior de KPI y acento del menú activo), sin depender de él para transmitir información.

---

## 5. Convenciones

- Prefijo `slint-` para todas las clases.
- Sin estilos en línea en el HTML, salvo la variable `--altura` del gráfico.
- Sin `!important` salvo utilidades de accesibilidad justificadas.
- Fechas internas en `AAAA-MM-DD`; visualización en `DD/MM/AAAA`.
- Moneda con `Intl.NumberFormat("es-CO", { currency: "COP" })`.
- No se usa `new Date("AAAA-MM-DD")` para mostrar, por el desfase de zona horaria.

---

## 6. Estado de implementación

| Componente | Estado |
|---|---|
| Cabecera, menú, migas, pie | Implementado |
| Botones, campos, mensajes, badges | Implementado |
| Tarjetas KPI, tablas, estado vacío, diálogo | Implementado |
| Gráfico de barras CSS | Implementado en Dashboard |
| Fieldset, filtros, resumen, hallazgos y archivo | Implementado en Fase 3.2 |
| Almacenamiento y evaluación de turnos | Implementado en `js/nucleo/turnos.js` |
| Ejemplos de liquidación precargados | Implementado en `js/datos/liquidaciones-demo.js` (sin motor) |
| Descarga CSV | Implementado en `utilidades.js`; se usará en INT-13 |
| Importación Excel | Simulada; sin lectura real de archivos |
| Autenticación | Simulada con credenciales fijas |
| Persistencia | Solo `sessionStorage` de demostración |

**Interfaces implementadas:** INT-01 a INT-16.
**Pendientes:** ninguna. El frontend demostrativo está completo.

---

## 7. Pendientes documentales

- La ficha `docs/fichas-interfaz.md` (Fase 2) aún contiene una frase en sus restricciones iniciales que describe el procesamiento Excel como "pendiente de fase frontend", mientras la ficha INT-06 aclara que no está definido. **No se modifica la Fase 2**; queda registrado aquí como pendiente de alineación documental.
- No quedan interfaces pendientes de maqueta. INT-13 a INT-16 son demostrativas y no incorporan backend, persistencia real ni autenticación.

---

## 8. Correcciones CT-01 y CT-02 (Fase 3.2)

### CT-01 — Validación estricta de fecha y hora

`combinarFechaHora()` ahora:

- Exige una instancia `Date` válida (`!isNaN(getTime())`).
- Acepta únicamente `HH:MM` con horas `00–23` y minutos `00–59`.
- Rechaza `24:00`, `29:75`, `12:60`, `9:30`, `12:3`, `12:30:00` y cadenas vacías.
- Compara el resultado con los componentes solicitados para impedir que `Date` normalice valores inválidos.

También se añadió `esHoraValida()` y se reforzó `parseFecha()` (ya rechazaba fechas imposibles como `2099-02-30`).

### CT-02 — Exportación CSV segura

`construirCSV()` y `descargarCSV()` ahora:

- Neutralizan valores de texto que comienzan por `=`, `+`, `-` o `@`, incluso tras espacios, tabuladores o caracteres de control, anteponiendo un apóstrofo.
- Conservan los números tipados, incluidos los negativos (`-10`), sin anteponer apóstrofo.
- Escapan comillas dobles, separador `;` y saltos de línea dentro de celdas entrecomilladas.
- Eliminan bytes nulos.
- Exportan con BOM UTF-8 y separador `;`.

**Pruebas:** `pruebas/utilidades.test.js` — **18/18 OK** (10 de CT-01 y 8 de CT-02).

---

## 9. Fase 3.3 — Liquidaciones demostrativas

Ajuste de alcance: INT-07 a INT-12 son **interfaces frontend demostrativas**, no un motor de liquidación.

- Los datos provienen de `js/datos/liquidaciones-demo.js` (L-01 a L-04).
- No hay cálculos laborales automáticos, reglas semanales ni precedencias ejecutadas.
- La selección se conserva en `sessionStorage` con la clave `liquidacionActual`.
- El motor experimental `js/nucleo/liquidacion.js` y su prueba fueron archivados en
  `C:\laragon\archivo-tecnico\SLINT\fase-3.3\` y retirados del frontend.
- No se cargan referencias al motor desde ninguna página.
- Los totales de los ejemplos están verificados por `pruebas/liquidaciones-demo.test.js` (23/23 OK).
- Todos los importes están identificados como ilustrativos y no como liquidaciones legales.

---

## 10. Fase 3.4 — Reportes y administración

Se completaron las últimas cuatro interfaces demostrativas:

| Interfaz | Implementación |
|---|---|
| INT-13 Exportación | Filtros, vista previa y descarga CSV real con `descargarCSV()` sobre datos ficticios |
| INT-14 Historial | Tabla de L-01 a L-04, filtros y acciones para ver resumen o exportar |
| INT-15 Usuarios y roles | Tabla de usuarios, permisos por rol y formulario con validación sin persistencia |
| INT-16 Parámetros | Tabla con vigencia y formulario con validación sin persistencia |

- Datos de administración en `js/datos/administracion-demo.js`.
- No hay backend, autenticación real, CRUD ni almacenamiento permanente.
- Todas las rutas del menú están habilitadas (**15 enlaces de menú**, sin pendientes).
- Pruebas: `node --check` 24/24, `liquidaciones-demo.test.js` 23/23, `administracion-demo.test.js` 5/5, `utilidades.test.js` 18/18.
- Navegador: las 17 rutas HTML responden 200; sin errores de consola en las pantallas probadas.
