(() => {
  "use strict";
  // Observe existing frames only. Never steer, pause, pick targets or send actions.
  const { clean } = GSTMovementLogSchema, events = [];
  let binding = null, preferences = {};
  const controllerNames = ["GSTHarvest", "GSTFarmBehavior", "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"];
  function snapshot(scene, reason, before = null) {
    const time = scene.now(), auto = scene.auto, self = scene.self, fx = typeof self?.fx === "string" ? self.fx : "";
    const owners = controllerNames.filter((name) => globalThis[name]?.controls?.(scene) === true);
    // Eligibility is context, not proof that the native controller issued a move.
    if (!owners.length && auto?.on && !GSTFarmInput.movement(scene) && time >= auto.pauseUntil) owners.push("native_farm_eligible");
    const home = globalThis.GSTHarvest?.farmOrigin?.(scene);
    const target = scene.views?.get?.(auto?.target);
    return clean({ at: new Date().toISOString(), reason, auto: auto?.on === true,
      manual: before?.manual ?? GSTFarmInput.movement(scene), clickOrder: !!scene.clickOrder,
      paused: time < auto?.pauseUntil, moved: auto?.moved === true, dead: self?.dead === true,
      stunned: fx.includes("s"), rooted: fx.includes("r"), slowed: fx.includes("w"),
      moveLocked: time < scene.moveLockUntil || self?.ml > 0.05,
      harvesting: !!scene.harvesting, pendingSkill: !!scene.pendingSkill, aiming: !!scene.aiming,
      resting: auto?.resting === true, target: !!auto?.target, hidden: document.hidden, focused: document.hasFocus(),
      fix: self?.fix, position: [scene.px, scene.py], serverPosition: [self?.x, self?.y],
      targetPosition: [target?.x, target?.y],
      center: [auto?.ax, auto?.ay], home: [home?.x, home?.y], owners,
      steerBefore: before?.steer, steerAfter: [scene.autoX, scene.autoY], waypoint: auto?.path?.[0],
      pathLength: auto?.path?.length, scope: preferences.searchScope, radius: preferences.radius,
      moveMultiplier: self?.ms });
  }
  function append(row) { if (row) { events.push(row); if (events.length > 120) events.shift(); } }
  function preframe() {
    try {
      if (!binding) return;
      const scene = binding.scene;
      binding.before = { manual: GSTFarmInput.movement(scene), steer: [scene.autoX, scene.autoY] };
    } catch { /* Diagnostics must not interrupt input. */ }
  }
  function frame() {
    try {
      const owner = binding; if (!owner) return;
      const scene = owner.scene, now = performance.now(), fix = scene.self?.fix;
      const corrected = owner.fix !== undefined && fix !== undefined && owner.fix !== fix;
      const targetChanged = owner.target !== scene.auto?.target;
      owner.fix = fix;
      if (!corrected && !targetChanged && now - owner.at < 250) return;
      const gap = now - owner.at > 1000;
      const row = snapshot(scene, corrected ? "correction" : gap ? "frame_gap" : "state", owner.before);
      row.targetChanged = targetChanged;
      row.elapsedMs = GSTMovementLogSchema.number(now - owner.at);
      row.distance = owner.position && row.position ? GSTMovementLogSchema.number(Math.hypot(row.position[0] - owner.position[0], row.position[1] - owner.position[1])) : null;
      const commanded = row.manual || row.steerBefore?.some((value) => value !== 0) || row.steerAfter?.some((value) => value !== 0);
      if (!commanded || corrected || gap || row.distance === null || row.distance >= 0.05) owner.stillAt = now;
      row.stillMs = GSTMovementLogSchema.number(now - owner.stillAt);
      row.littleProgress = row.stillMs >= 750;
      const signature = JSON.stringify([row.auto, row.manual, row.clickOrder, row.paused, row.moved, row.dead,
        row.stunned, row.rooted, row.slowed, row.moveLocked, row.harvesting, row.pendingSkill, row.aiming,
        row.resting, row.target, row.owners, row.scope, row.radius, row.littleProgress, row.hidden, row.focused]);
      if (corrected || gap || targetChanged || signature !== owner.signature || (commanded && now - owner.loggedAt >= 5000)) {
        if (!corrected && !gap && !targetChanged && signature === owner.signature) row.reason = "sample";
        append(row); owner.loggedAt = now;
      }
      owner.signature = signature; owner.at = now; owner.position = row.position; owner.target = scene.auto?.target;
    } catch { /* Optional read-only diagnostics. */ }
  }
  function detach() {
    if (!binding) return;
    const old = binding;
    try { append(snapshot(old.scene, "detach", old.before)); } catch {}
    binding = null;
    old.scene.events.off("preupdate", preframe); old.scene.events.off("postupdate", frame);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
  }
  globalThis.GSTMovementDiagnostics = {
    configure(value) { preferences = { searchScope: value.searchScope, radius: value.radius }; },
    attach(scene) {
      try {
        if (binding?.scene === scene) return;
        detach();
        if (!scene?.events?.on || !scene.events.off || typeof scene.now !== "function") return;
        const now = performance.now();
        binding = { scene, at: now, stillAt: now, loggedAt: now, fix: scene.self?.fix, target: scene.auto?.target, signature: "", position: null };
        scene.events.on("preupdate", preframe); scene.events.on("postupdate", frame);
        scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
        append(snapshot(scene, "attach"));
      } catch { detach(); }
    },
    snapshot() {
      let current = null;
      try { if (binding) current = snapshot(binding.scene, "sample", binding.before); } catch {}
      return { build: "movement-log-1", tracking: !!binding, scope: "Last 120 observations in this page; reset on reload", current, events: events.map((row) => clean(row)) };
    }
  };
  window.addEventListener("pagehide", detach);
})();
