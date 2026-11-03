# SLINT — Frames de baja fidelidad (Fase 2)

16 wireframes en SVG (1280 × 800), en escala de grises, correspondientes a las interfaces INT-01 a INT-16 documentadas en `docs/fichas-interfaz.md` y en `docs/mapa-navegacion.drawio`.

> **Estado real:** los SVG existen y son válidos en disco. **No han sido importados ni enlazados en Penpot todavía.** La importación y el conexionado son tareas del aprendiz.

---

## 1. Inventario

| Archivo | Interfaz | Módulo |
|---|---|---|
| `01-acceso.svg` | INT-01 Acceso | Acceso |
| `02-dashboard.svg` | INT-02 Dashboard | Dashboard |
| `03-registro-turno.svg` | INT-03 Registro de turno | Gestión de turnos |
| `04-validacion-horarios.svg` | INT-04 Validación | Gestión de turnos |
| `05-consulta-turnos.svg` | INT-05 Consulta | Gestión de turnos |
| `06-importar-excel.svg` | INT-06 Importar Excel | Gestión de turnos |
| `07-flujo-liquidacion.svg` | INT-07 Flujo de liquidación | Liquidaciones |
| `08-detalle-ordinarias-nocturnas.svg` | INT-08 Detalle OH | Liquidaciones |
| `09-detalle-horas-extra.svg` | INT-09 Detalle HE | Liquidaciones |
| `10-detalle-festivos.svg` | INT-10 Detalle festivos | Liquidaciones |
| `11-resumen-liquidacion.svg` | INT-11 Resumen | Liquidaciones |
| `12-detalle-por-concepto.svg` | INT-12 Detalle por concepto | Liquidaciones |
| `13-exportacion.svg` | INT-13 Exportación | Reportes |
| `14-historial-liquidaciones.svg` | INT-14 Historial | Reportes |
| `15-usuarios-roles.svg` | INT-15 Usuarios y roles | Administración |
| `16-parametros-laborales.svg` | INT-16 Parámetros | Administración |

---

## 2. Organización recomendada en Penpot

### 2.1 Archivo y página
- Un único archivo llamado **`SLINT – Baja fidelidad`**.
- Una **página principal de prototipado** (no una página por pantalla), donde convivan los 16 tableros.

### 2.2 Tableros
- Crear **16 tableros** de 1280 × 800, uno por interfaz.
- Nombrar cada tablero con el código y nombre de la ficha, por ejemplo:
  - `INT-01 · Acceso`
  - `INT-02 · Dashboard`
  - … hasta `INT-16 · Parámetros laborales`.

### 2.3 Organización visual por módulos
Disponer los tableros en seis columnas o zonas rotuladas:

| Zona | Tableros |
|---|---|
| **Acceso** | INT-01 |
| **Dashboard** | INT-02 |
| **Gestión de turnos** | INT-03, INT-04, INT-05, INT-06 |
| **Liquidaciones** | INT-07, INT-08, INT-09, INT-10, INT-11, INT-12 |
| **Reportes** | INT-13, INT-14 |
| **Administración** | INT-15, INT-16 |

Puedes usar rectángulos de fondo con el nombre del módulo, igual que en el mapa de draw.io.

### 2.4 Conexiones interactivas
- Activar el modo **Prototipo / Interactivo** de Penpot.
- Enlazar cada elemento según `docs/mapa-navegacion.drawio`.
- Usar las mismas etiquetas de acción de las fichas ("Registrar", "Validar", "Liquidar", "Continuar a resumen", etc.).

---

## 3. Recorrido principal sugerido

```
INT-01 Acceso
  → INT-02 Dashboard
    → INT-03 Registro de turno
      → INT-04 Validación
        → INT-05 Consulta
          → INT-07 Flujo de liquidación
            → INT-08 / INT-09 / INT-10 (detalles)
              → INT-11 Resumen
                → INT-12 Detalle por concepto
                  → INT-13 Exportación
                    → INT-14 Historial
```

---

## 4. Rutas alternativas y de retorno

| Ruta | Origen → destino |
|---|---|
| Importación desde consulta | INT-05 → INT-06 |
| Importación desde registro | INT-03 → INT-06 |
| Confirmación de importación demo | INT-06 → INT-05 |
| Retorno de detalles | INT-08 / INT-09 / INT-10 → INT-07 |
| Retorno de detalle por concepto | INT-12 → INT-11 |
| Retorno de exportación | INT-13 → INT-11 |
| Retorno de historial | INT-14 → INT-11 |
| Historial directo desde Reportes | INT-02 → INT-14 |
| Administración | INT-02 → INT-15 ↔ INT-16 |
| Retorno de administración | INT-15 / INT-16 → INT-02 |

El menú global (Turnos · Liquidaciones · Reportes · Administración · Dashboard) debe repetirse en los 16 tableros.

---

## 5. Importación paso a paso

1. Abre Penpot y crea el archivo **`SLINT – Baja fidelidad`**.
2. Crea la página principal de prototipado.
3. Para cada SVG:
   - **Archivo → Importar** (o arrastra el archivo al lienzo).
   - Convierte el grupo importado en tablero (board) de 1280 × 800.
   - Renómbralo con el código de la interfaz.
4. Agrupa visualmente los tableros por módulo.
5. Pasa al modo interactivo y crea las conexiones de las secciones 3 y 4.
6. Revisa que cada botón del wireframe tenga su enlace correspondiente.

---

## 6. Capturas reales como evidencia

Las capturas deben obtenerlas el aprendiz, no el agente. Se recomienda guardar:

1. Vista general de la página con los 16 tableros organizados por módulo.
2. Vista del modo interactivo mostrando al menos 6 conexiones.
3. Recorrido principal: INT-01 → INT-02 → INT-03 → INT-05 → INT-07 → INT-11 → INT-13.
4. Al menos 2 capturas en vista móvil o con zoom reducido que muestren adaptación visual.
5. Captura de las rutas alternativas (INT-05 → INT-06 y INT-15 ↔ INT-16).
6. Captura del prompt y de la respuesta usados para generar los wireframes.

---

## 7. Aclaraciones de alcance

- Los SVG son **mockups de baja fidelidad**, no el frontend final.
- No incluyen HTML, CSS ni JavaScript de la aplicación.
- No se ha ejecutado ninguna prueba funcional: son piezas de diseño estáticas.
- El procesamiento real de archivos Excel **no está definido ni implementado**; la pantalla solo demuestra selección, validación de extensión y vista previa ficticia.
- La descarga CSV de INT-13 está **especificada como función futura**; no está implementada.
- Los datos y fechas son ficticios (las fechas de INT-10 usan el año 2099 para evitar coincidencias con el calendario real).
