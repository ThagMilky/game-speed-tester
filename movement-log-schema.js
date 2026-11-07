(() => {
  "use strict";
  const reasons = ["attach", "state", "correction", "frame_gap", "sample", "detach",
    "panel_open", "panel_close", "panel_switch", "panel_gap"];
  const owners = ["native_farm_eligible", "GSTHarvest", "GSTFarmBehavior", "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"];
  const number = (value) => Number.isFinite(value) ? Math.round(Math.max(-1e8, Math.min(1e8, value)) * 1000) / 1000 : null;
  const point = (value) => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite) ? value.map(number) : null;
  function clean(row) {
    if (!reasons.includes(row?.reason)) return null;
    const result = { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", reason: row.reason };
    for (const key of ["auto", "manual", "clickOrder", "paused", "moved", "dead", "stunned", "rooted", "slowed", "moveLocked", "harvesting", "pendingSkill", "aiming", "resting", "target", "targetChanged", "hidden", "focused", "littleProgress", "panelOpen", "uiBlocked"]) result[key] = row[key] === true;
    for (const key of ["fix", "elapsedMs", "distance", "stillMs", "pathLength", "radius", "moveMultiplier", "frameGapMs"]) result[key] = number(row[key]);
    for (const key of ["position", "serverPosition", "targetPosition", "center", "home", "steerBefore", "steerAfter", "waypoint"]) result[key] = point(row[key]);
    result.scope = ["radius", "map"].includes(row.scope) ? row.scope : null;
    result.panel = ["none", "skills", "workshop", "other"].includes(row.panel) ? row.panel : "none";
    result.owners = (Array.isArray(row.owners) ? row.owners : []).filter((name) => owners.includes(name)).slice(0, owners.length);
    return result;
  }
  globalThis.GSTMovementLogSchema = { clean, point, number };
})();
