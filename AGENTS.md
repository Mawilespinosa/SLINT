# SLINT — Sistema de Liquidación de Turnos Laborales

Prototipo frontend académico para registrar, validar, clasificar y presentar liquidaciones de turnos de una empresa de vigilancia privada colombiana. Usuarios: auxiliar de nómina, coordinador operativo y administrador.

## Reglas obligatorias
- Usar exclusivamente HTML5, CSS3 y JavaScript puro. No React, Vue, Bootstrap, Tailwind, jQuery ni librerías frontend.
- Toda la interfaz, mensajes y documentación de usuario estarán en español.
- Usar HTML semántico (`header`, `nav`, `main`, `section`, `form`, `table`) y `label` asociado a cada control.
- Centralizar los estilos en un único `styles.css`, con variables de diseño en `:root`.
- Todas las pantallas deben partir de la estructura común de `plantilla.html` y utilizar las clases definidas en `styles.css`.
- Crear `componentes.html` como guía de componentes reutilizables y `docs/componentes.md` como catálogo.
- Diseño adaptable a celular, tableta y escritorio; navegación con teclado, foco visible, contraste legible y mensajes de error asociados a los campos.
- Usar solo datos ficticios. No incluir datos personales reales, claves, tokens ni credenciales.
- Antes de crear o modificar archivos, mostrar un plan de trabajo, indicar los archivos afectados y **esperar mi confirmación explícita**.
- Mantener el alcance en frontend demostrativo. No crear backend Laravel, conectar MySQL ni Supabase durante esta evidencia sin autorización.
- No presentar simulaciones como liquidaciones legales verificadas; las reglas y tasas laborales requieren revisión de vigencia.
- Preservar los identificadores RF-001 a RF-010 de la especificación original y documentar por separado ampliaciones posteriores.
- Asegurar turnos continuos y partidos: entrada 1, salida 1, entrada 2 y salida 2 (segundo tramo opcional). Prever carga masiva Excel como interfaz de demostración, sin prometer procesamiento real no implementado.
- Dashboard con gráficos construidos sin librerías externas; detalle de liquidación con horas, tarifa, porcentaje y valor por concepto.
- Mantener trazabilidad entre historias, requisitos, pantallas y componentes.
- Documentar decisiones, errores y correcciones para la bitácora del agente. No fabricar capturas ni pruebas.

## Estructura de referencia
- `AGENTS.md`
- `docs/historias.md`
- `docs/requisitos.md`
- `docs/componentes.md` (fase posterior)
- `prototipo/` (fase posterior)
- `styles.css`, `plantilla.html`, `componentes.html` (fase posterior)
- `index.html` y pantallas HTML (fase posterior)

## Flujo de trabajo
1. Leer `docs/historias.md` y `docs/requisitos.md` antes de programar.
2. Proponer plan con archivos, riesgos y correspondencia HU/RF.
3. Esperar aprobación del aprendiz.
4. Implementar cambios pequeños y comprobables.
5. Explicar lo realizado y cómo verificarlo manualmente.
