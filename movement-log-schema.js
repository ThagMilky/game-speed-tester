(() => {
  "use strict";
  const reasons = ["attach", "state", "correction", "frame_gap", "sample", "detach",
    "panel_open", "panel_close", "panel_switch", "panel_gap",
    "short_frame_gap", "movement_stall", "owner_change", "routing_correction",
    "routing_replan", "routing_stuck", "map_correction", "map_replan", "map_stuck",
    "portal_combat_yield", "chest_combat_yield", "chest_target_yield", "target_switch",
      "map_handoff", "map_resume", "loot_begin", "loot_done", "loot_skip"];
  const owners = ["native_farm_eligible", "GSTHarvest", "GSTFarmBehavior", "GSTFarmBossSafety", "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"];
  const number = (value) => Number.isFinite(value) ? Math.round(Math.max(-1e8, Math.min(1e8, value)) * 1000) / 1000 : null;
  const point = (value) => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite) ? value.map(number) : null;
  function clean(row) {
    if (!reasons.includes(row?.reason)) return null;
    const result = { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", reason: row.reason };
    for (const key of ["auto", "manual", "clickOrder", "paused", "moved", "dead", "stunned", "rooted", "slowed", "moveLocked", "harvesting", "pendingSkill", "aiming", "resting", "target", "targetChanged", "hidden", "focused", "littleProgress", "panelOpen", "uiBlocked"]) result[key] = row[key] === true;
    for (const key of ["fix", "elapsedMs", "distance", "stillMs", "pathLength", "radius", "moveMultiplier", "frameGapMs", "pauseMs", "retryMs"]) result[key] = number(row[key]);
    for (const key of ["position", "serverPosition", "targetPosition", "center", "home", "steerBefore", "steerAfter", "waypoint"]) result[key] = point(row[key]);
    result.lootCount = Number.isSafeInteger(row.lootCount) && row.lootCount >= 0 ? row.lootCount : null;
    result.targetId = Number.isSafeInteger(row.targetId) && row.targetId >= 0 ? row.targetId : null;
    result.remaining = number(row.remaining);
    result.stuckMs = number(row.stuckMs);
    result.attempt = Number.isSafeInteger(row.attempt) && row.attempt >= 0 && row.attempt <= 2 ? row.attempt : null;
    result.fromOwner = ["GSTFarmMap", "native_farm_eligible"].includes(row.fromOwner) ? row.fromOwner : null;
    result.toOwner = ["GSTFarmMap", "native_farm_eligible"].includes(row.toOwner) ? row.toOwner : null;
    result.handoffReason = ["near_target", "native_target", "native_engaged", "target_unavailable",
      "handoff_timeout", "native_out_of_range", "manual_override", "priority_preempt", "loot_priority"]
      .includes(row.handoffReason) ? row.handoffReason : null;
    result.replanReason = ["no_progress", "walk_failed", "blocked", "timeout", "boss_blocked"]
      .includes(row.replanReason) ? row.replanReason : null;
    result.action = ["retry", "defer"].includes(row.action) ? row.action : null;
    const ownerKeys = ["native_farm_eligible", "GSTHarvest", "GSTFarmBehavior", "GSTFarmBossSafety",
      "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"];
    result.fromOwners = Array.isArray(row.fromOwners)
      ? row.fromOwners.filter((name) => ownerKeys.includes(name)).slice(0, ownerKeys.length) : [];
    result.toOwners = Array.isArray(row.toOwners)
      ? row.toOwners.filter((name) => ownerKeys.includes(name)).slice(0, ownerKeys.length) : [];
    result.ownerScope = row.ownerScope === "eligibility" ? "eligibility" : null;
    result.fromId = Number.isSafeInteger(row.fromId) && row.fromId >= 0 ? row.fromId : null;
    result.toId = Number.isSafeInteger(row.toId) && row.toId >= 0 ? row.toId : null;
    result.switchSource = ["map", "radius"].includes(row.switchSource) ? row.switchSource : null;
    result.switchReason = ["boss_priority", "level_priority", "target_unavailable", "pick_failed"]
      .includes(row.switchReason) ? row.switchReason : null;
    result.scope = ["radius", "map"].includes(row.scope) ? row.scope : null;
    result.panel = ["none", "skills", "workshop", "other"].includes(row.panel) ? row.panel : "none";
    result.owners = (Array.isArray(row.owners) ? row.owners : []).filter((name) => owners.includes(name)).slice(0, owners.length);
    return result;
  }
  globalThis.GSTMovementLogSchema = { clean, point, number };
})();
