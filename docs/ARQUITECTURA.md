# Arquitectura de software — SLINT

## 1. Descripción general

SLINT es un sistema web orientado a la gestión de turnos laborales, validación de horarios y liquidación de horas trabajadas.

Su arquitectura propuesta es de tres capas, con el propósito de separar la interfaz gráfica, las reglas de negocio y el acceso a los datos.

## 2. Arquitectura de tres capas

### Capa 1. Interfaz gráfica

Responsable de la interacción con los usuarios del sistema.

Tecnologías: HTML, CSS y JavaScript, con integración prevista a Laravel.

Componentes principales:

- Inicio de sesión y gestión de usuarios.
- Dashboard con indicadores y gráficos.
- Registro y consulta de turnos.
- Formularios para jornadas partidas.
- Visualización de liquidaciones.
- Administración de parámetros laborales.

### Capa 2. Reglas de negocio

Responsable de procesar la información y aplicar las validaciones necesarias.

Tecnología propuesta: PHP con Laravel.

Responsabilidades:

- Validación de horarios y jornadas laborales.
- Procesamiento de turnos partidos.
- Validación de archivos Excel para carga masiva.
- Cálculo de horas ordinarias, extras y recargos.
- Aplicación de parámetros laborales configurables.
- Control de permisos según roles.

### Capa 3. Repositorio de datos

Responsable del almacenamiento, consulta y actualización de la información.

Tecnología propuesta: MySQL.

Entidades principales previstas:

- Usuarios.
- Roles.
- Empleados.
- Turnos.
- Registros de horarios.
- Parámetros laborales.
- Liquidaciones.

## 3. Flujo de información

1. El usuario registra o consulta información desde la interfaz gráfica.
2. La solicitud llega a la capa de reglas de negocio.
3. Laravel valida los datos y ejecuta las operaciones correspondientes.
4. La capa de repositorio consulta o actualiza MySQL.
5. El sistema devuelve los resultados a la interfaz.

## 4. Entorno de desarrollo

Se contempla el uso de Laragon como entorno local, Visual Studio Code como editor, Git para control de versiones y GitHub para alojar el repositorio remoto.

## 5. Estado de implementación

Actualmente SLINT dispone de un prototipo de interfaces con datos simulados. La implementación de las reglas de negocio, la persistencia en MySQL y la integración completa con Laravel corresponden a las siguientes etapas de desarrollo.

## 6. Justificación

La arquitectura de tres capas facilita el mantenimiento, la organización del código, las pruebas y la evolución del sistema. También permite modificar una capa con menor impacto sobre las demás, siempre que se respeten sus interfaces de comunicación.