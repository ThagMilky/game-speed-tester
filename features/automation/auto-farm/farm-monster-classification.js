(() => {
  "use strict";
  const worldBossMarker = (value) => value?.wb === true || value?.wb === 1;
  function metadata(value) {
    if (value?.k !== undefined) {
      if (value.k !== "m" || value.dead === true) return null;
      value = value.st ?? (worldBossMarker(value) ? value : null);
    }
    if (!value || ((typeof value.cls !== "string") && !worldBossMarker(value)) || value.cls === "pet") return null;
    return value;
  }
  function classify(value) {
    const state = metadata(value);
    if (!state) return null;
    if (state.cls === "boss" || worldBossMarker(state)) return "boss";
    if (state.cls === "elite") return "elite";
    return "ordinary";
  }
  globalThis.GSTFarmMonsterClassification = Object.freeze({
    classify,
    isBoss: (value) => classify(value) === "boss",
    isWorldBoss: (value) => worldBossMarker(metadata(value)),
    isElite: (value) => classify(value) === "elite"
  });
})();
