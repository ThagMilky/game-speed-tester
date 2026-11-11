(() => {
  "use strict";
  function metadata(value) {
    if (value?.k !== undefined) {
      if (value.k !== "m" || value.dead === true) return null;
      value = value.st ?? (value.wb === true ? { cls: "", wb: true } : null);
    }
    if (!value || ((typeof value.cls !== "string") && value.wb !== true) || value.cls === "pet") return null;
    return value;
  }
  function classify(value) {
    const state = metadata(value);
    if (!state) return null;
    if (state.cls === "boss" || state.wb === true) return "boss";
    if (state.cls === "elite") return "elite";
    return "ordinary";
  }
  globalThis.GSTFarmMonsterClassification = Object.freeze({
    classify,
    isBoss: (value) => classify(value) === "boss",
    isElite: (value) => classify(value) === "elite"
  });
})();
