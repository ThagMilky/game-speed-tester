(() => {
  "use strict";
  const fields = ["hidePlayers", "hidePlayerEffects", "hideOwnEffects", "hideMonsterEffects",
    "hideMonsters", "hideNumbers", "reduceEnvironment", "reduceScreen", "simpleMap", "hideVegetation", "hideBuildings", "hideBosses", "hideBossEffects", "simpleMinimap", "minimapColors"];
  globalThis.GSTFpsOptions = {
    fields,
    normalize: (value) => Object.fromEntries(["enabled", ...fields].map((key) => [key, value?.[key] === true]))
  };
})();
