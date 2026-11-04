(() => {
  "use strict";
  const fields = ["hidePlayers", "hidePlayerEffects", "hideOwnEffects", "hideMonsterEffects",
    "hideMonsters", "hideNumbers", "reduceEnvironment", "reduceScreen", "simpleMap", "hideVegetation", "hideBuildings"];
  globalThis.GSTFpsOptions = {
    fields,
    normalize: (value) => Object.fromEntries(["enabled", ...fields].map((key) => [key, value?.[key] === true]))
  };
})();
