/* SLINT — utilidades compartidas (JavaScript puro) */
(function () {
  "use strict";

  var PREFIJO_ALMACEN = "slint.demo.";

  function qs(selector, contexto) {
    return (contexto || document).querySelector(selector);
  }

  function qsa(selector, contexto) {
    return Array.prototype.slice.call((contexto || document).querySelectorAll(selector));
  }

  function formatoCOP(valor) {
    var numero = Number(valor);
    if (!isFinite(numero)) {
      return "$ 0";
    }
    try {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
      }).format(numero);
    } catch (error) {
      return "$ " + numero.toFixed(0);
    }
  }

  function formatoNumero(valor, decimales) {
    var numero = Number(valor);
    if (!isFinite(numero)) {
      return "0";
    }
    var opciones = {
      minimumFractionDigits: decimales || 0,
      maximumFractionDigits: decimales || 0
    };
    try {
      return new Intl.NumberFormat("es-CO", opciones).format(numero);
    } catch (error) {
      return numero.toFixed(decimales || 0);
    }
  }

  /* Convierte "AAAA-MM-DD" en Date local sin desfase de zona horaria. */
  function parseFecha(texto) {
    if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      return null;
    }
    var partes = texto.split("-").map(Number);
    var fecha = new Date(partes[0], partes[1] - 1, partes[2]);
    if (
      fecha.getFullYear() !== partes[0] ||
      fecha.getMonth() !== partes[1] - 1 ||
      fecha.getDate() !== partes[2]
    ) {
      return null;
    }
    return fecha;
  }

  function sumarDias(fecha, dias) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
      return null;
    }
    var copia = new Date(fecha.getTime());
    copia.setDate(copia.getDate() + Number(dias || 0));
    return copia;
  }

  function esHoraValida(hora) {
    return typeof hora === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(hora);
  }

  function combinarFechaHora(fecha, hora) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime()) || !esHoraValida(hora)) {
      return null;
    }
    var partes = hora.split(":").map(Number);
    var copia = new Date(fecha.getTime());
    copia.setHours(partes[0], partes[1], 0, 0);
    if (copia.getHours() !== partes[0] || copia.getMinutes() !== partes[1]) {
      return null;
    }
    return copia;
  }

  function difHoras(inicio, fin) {
    if (!(inicio instanceof Date) || !(fin instanceof Date)) {
      return 0;
    }
    var diferencia = (fin.getTime() - inicio.getTime()) / 3600000;
    return diferencia > 0 ? diferencia : 0;
  }

  function formatoFecha(fecha) {
    if (!(fecha instanceof Date) || isNaN(fecha.getTime())) {
      return "";
    }
    var dia = String(fecha.getDate()).padStart(2, "0");
    var mes = String(fecha.getMonth() + 1).padStart(2, "0");
    return dia + "/" + mes + "/" + fecha.getFullYear();
  }

  /* --- CSV seguro ---------------------------------------------------------
     Mitiga inyección de fórmulas en hojas de cálculo: si un valor de texto
     comienza por =, +, - o @ (incluso tras espacios o controles), se antepone
     un apóstrofo. Los números tipados se conservan, incluidos los negativos.
     ---------------------------------------------------------------------- */
  function neutralizarFormulaCSV(valor) {
    var texto = String(valor).replace(/\u0000/g, "");
    if (/^[\s\u0000-\u001f]*[=+\-@]/.test(texto)) {
      return "'" + texto;
    }
    return texto;
  }

  function escaparCSV(valor) {
    if (typeof valor === "number" && isFinite(valor)) {
      return String(valor);
    }
    if (valor === null || valor === undefined) {
      return '""';
    }
    return '"' + neutralizarFormulaCSV(valor).replace(/"/g, '""') + '"';
  }

  function construirCSV(encabezados, filas) {
    var lineas = [];
    if (Array.isArray(encabezados) && encabezados.length) {
      lineas.push(encabezados.map(escaparCSV).join(";"));
    }
    (filas || []).forEach(function (fila) {
      lineas.push(fila.map(escaparCSV).join(";"));
    });
    return "\uFEFF" + lineas.join("\r\n");
  }

  /* Descarga CSV real con Blob. Datos de demostración, sin backend. */
  function descargarCSV(nombreArchivo, encabezados, filas) {
    var contenido = construirCSV(encabezados, filas);
    var blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo || "slint-datos-demo.csv";
    enlace.rel = "noopener";
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  var almacenDisponible = (function () {
    try {
      var clave = PREFIJO_ALMACEN + "prueba";
      window.sessionStorage.setItem(clave, "1");
      window.sessionStorage.removeItem(clave);
      return true;
    } catch (error) {
      return false;
    }
  })();

  var almacen = {
    disponible: almacenDisponible,
    get: function (clave, porDefecto) {
      if (!almacenDisponible) {
        return porDefecto;
      }
      try {
        var bruto = window.sessionStorage.getItem(PREFIJO_ALMACEN + clave);
        return bruto === null ? porDefecto : JSON.parse(bruto);
      } catch (error) {
        return porDefecto;
      }
    },
    set: function (clave, valor) {
      if (!almacenDisponible) {
        return false;
      }
      try {
        window.sessionStorage.setItem(PREFIJO_ALMACEN + clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        return false;
      }
    },
    remove: function (clave) {
      if (!almacenDisponible) {
        return false;
      }
      try {
        window.sessionStorage.removeItem(PREFIJO_ALMACEN + clave);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  window.SLINT = window.SLINT || {};
  window.SLINT.utils = {
    qs: qs,
    qsa: qsa,
    formatoCOP: formatoCOP,
    formatoNumero: formatoNumero,
    formatoFecha: formatoFecha,
    parseFecha: parseFecha,
    sumarDias: sumarDias,
    esHoraValida: esHoraValida,
    combinarFechaHora: combinarFechaHora,
    difHoras: difHoras,
    construirCSV: construirCSV,
    neutralizarFormulaCSV: neutralizarFormulaCSV,
    descargarCSV: descargarCSV,
    almacen: almacen
  };
})();
