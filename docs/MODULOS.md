# Módulos funcionales — SLINT

## 1. Objetivo

Documentar los principales módulos del sistema SLINT, sus responsabilidades y las funcionalidades previstas, de acuerdo con el diseño del proyecto.

## 2. Gestión de usuarios y roles

Permite administrar los usuarios que accederán a la aplicación y definir permisos de acuerdo con sus responsabilidades.

Funciones previstas:

- Registro y administración de usuarios.
- Asignación de roles.
- Control de acceso.
- Activación y desactivación de usuarios.

## 3. Gestión de turnos

Permite programar y consultar los horarios laborales de los empleados.

Funciones previstas:

- Asignación de turnos por empleado y fecha.
- Registro de jornadas continuas y partidas.
- Cuatro campos de horario: entrada 1, salida 1, entrada 2 y salida 2.
- Validación de inconsistencias y superposición de horarios.
- Importación masiva de turnos desde archivos Excel.
- Consulta y modificación de programaciones.

## 4. Liquidación de horas laborales

Permite calcular las horas trabajadas de acuerdo con los registros y parámetros laborales establecidos.

Funciones previstas:

- Cálculo de horas ordinarias.
- Identificación de horas extras.
- Cálculo de recargos aplicables.
- Visualización del valor de cada tipo de hora.
- Generación de resúmenes de liquidación.
- Consulta de liquidaciones por empleado y período.

## 5. Dashboard

Presenta información consolidada para facilitar el seguimiento operativo.

Elementos previstos:

- Indicadores de empleados y turnos.
- Gráficos de distribución de horas.
- Resúmenes de liquidaciones.
- Alertas de inconsistencias.
- Filtros por período.

## 6. Parámetros laborales

Permite administrar los valores y condiciones utilizados en los cálculos.

Funciones previstas:

- Configuración de porcentajes de recargos.
- Definición de parámetros de jornadas.
- Actualización de valores aplicables.
- Consulta de parámetros vigentes.

Los cálculos deberán considerar la normativa laboral colombiana aplicable y la vigencia de cada parámetro.

## 7. Estado actual

El repositorio contiene vistas iniciales con datos simulados. Las funcionalidades descritas representan el alcance funcional proyectado y no deben interpretarse como módulos completamente implementados.

## 8. Tecnologías

- HTML, CSS y JavaScript para la interfaz.
- PHP y Laravel para la lógica de negocio prevista.
- MySQL para persistencia de datos.
- Laragon para desarrollo local.
- Git y GitHub para versionamiento.