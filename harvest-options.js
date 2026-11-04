// Canonical helper. Regenerate harvest-main-options.js from this file with:
// Copy-Item -LiteralPath .\harvest-options.js -Destination .\harvest-main-options.js
(() => {
  "use strict";
  const bounded = (value, fallback, min, max) => typeof value === "number" && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value)) : fallback;
  globalThis.GSTHarvest = {
    normalize(value) {
      return {
        enabled: value?.enabled === true,
        kind: ["ore", "both"].includes(value?.kind) ? value.kind : "plant",
        autoRespawn: true,
        allowFarm: value?.allowFarm === true,
        ignoreMonsters: value?.ignoreMonsters === true,
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
    needsRecovery: () => false,
    farmOrigin: () => null,
    respawn: () => "Chưa đọc được cơ chế hồi sinh; chờ game."
  };
  // Per-world marker: lets diagnostics distinguish not loaded from overwritten.
  globalThis.__gstHarvestOptionsLoad = {
    build: "harvest-options-log-2-split-worlds", normalizeAtLoad: typeof globalThis.GSTHarvest.normalize
  };
})();
