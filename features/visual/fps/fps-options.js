(() => {
  "use strict";
  const fields = ["hidePlayers", "hidePlayerEffects", "hideOwnEffects", "hideOwnCharacter", "hideResourceVisuals", "hideGameUI", "hideNPCVisuals", "hideMonsterEffects",
    "hideOwnDisciples", "hideOtherDisciples", "hideCompanionEffects", "hideBasicEffects",
    "hideMonsters", "hideNumbers", "reduceEnvironment", "reduceScreen", "simpleMap", "hideVegetation", "hideBuildings", "hideBosses", "hideBossEffects", "simpleMinimap", "minimapColors", "limit30Fps"];
  globalThis.GSTFpsOptions = {
    fields,
    normalize: (value) => {
      const legacyCompanions = value?.hideDisciples === true || value?.hidePets === true;
      return {
        ...Object.fromEntries(["enabled", ...fields].map((key) => [key, value?.[key] === true])),
        hideOwnDisciples: value?.hideOwnDisciples === undefined ? legacyCompanions : value.hideOwnDisciples === true,
        hideOtherDisciples: value?.hideOtherDisciples === undefined ? legacyCompanions : value.hideOtherDisciples === true,
        minimapRange: [1, 2, 3, 4].includes(value?.minimapRange) ? value.minimapRange : 1
      };
    }
  };
})();
