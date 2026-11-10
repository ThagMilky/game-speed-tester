(() => {
  "use strict";
  const families = Object.freeze({
    "Times New Roman": '"Times New Roman", Times, serif',
    "Arial": 'Arial, Helvetica, sans-serif',
    "Calibri": 'Calibri, Arial, sans-serif',
    "Segoe UI": '"Segoe UI", Arial, sans-serif',
    "Verdana": 'Verdana, Arial, sans-serif',
    "Tahoma": 'Tahoma, Arial, sans-serif',
    "Georgia": 'Georgia, "Times New Roman", serif',
    "Cambria": 'Cambria, Georgia, serif',
    "Consolas": 'Consolas, "Courier New", monospace',
    "Courier New": '"Courier New", Courier, monospace'
  });
  globalThis.GSTFont = Object.freeze({
    families,
    normalize(value) {
      return {
        enabled: value?.enabled !== false,
        font: Object.hasOwn(families, value?.font) ? value.font : "Times New Roman"
      };
    }
  });
})();
