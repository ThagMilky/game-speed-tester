(() => {
  "use strict";
  const bounded = (value, fallback, min, max) => typeof value === "number" && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value)) : fallback;
  globalThis.GSTHarvest = {
    normalize(value) {
      return {
        enabled: value?.enabled === true,
        allowFarm: value?.allowFarm === true,
        radius: bounded(value?.radius, 6, 1, 30),
        clearRadius: bounded(value?.clearRadius, 4, 2, 15),
        reach: bounded(value?.reach, 1.2, 0.5, 1.5),
        mode: value?.mode === "selected" ? "selected" : "all",
        items: [...new Set((Array.isArray(value?.items) ? value.items : [])
          .filter((name) => typeof name === "string" && name.trim() && name.length <= 120)
          .map((name) => name.trim().normalize("NFC")))].slice(0, 200)
      };
    },
    controls: () => false,
    farmOrigin: () => null
  };
})();
