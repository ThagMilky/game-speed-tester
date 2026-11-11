(() => {
  "use strict";
  const fields = ["hidePlayers", "hidePlayerEffects", "hideOwnEffects", "hideOwnCharacter", "hideResourceVisuals", "hideGameUI", "hideNPCVisuals", "hideMonsterEffects",
    "hideDisciples", "hidePets", "hideCompanionEffects", "hideBasicEffects",
    "hideMonsters", "hideNumbers", "reduceEnvironment", "reduceScreen", "simpleMap", "hideVegetation", "hideBuildings", "hideBosses", "hideBossEffects", "simpleMinimap", "minimapColors"];
  globalThis.GSTFpsOptions = {
    fields,
    normalize: (value) => ({ ...Object.fromEntries(["enabled", ...fields].map((key) => [key, value?.[key] === true])),
      minimapRange: [1, 2, 3, 4].includes(value?.minimapRange) ? value.minimapRange : 1 })
  };
})();
