(() => {
  "use strict";
  // Observe existing frames only. Never steer, pause, pick targets or send actions.
  const { clean } = GSTMovementLogSchema, events = [], uiIncidents = [];
  const uiLogKey = "gst:movement-ui:v1";
  let binding = null, preferences = {};
  try {
    const previous = JSON.parse(sessionStorage.getItem(uiLogKey) ?? "[]");
    if (Array.isArray(previous)) uiIncidents.push(...previous.slice(-36).map(clean)
      .filter((row) => row && ["panel_open", "panel_close", "panel_switch", "panel_gap"].includes(row.reason)));
  } catch { /* Diagnostics are optional. */ }
  function panelType(scene) {
    if (!scene.panels?.open) return "none";
    const node = document.querySelector(".panel[data-title]") ?? document.querySelector(".panel");
    const heading = node?.getAttribute("data-title") ?? node?.querySelector("header h2")?.textContent ?? "";
    if (heading.startsWith("Xưởng")) return "workshop";
    if (heading.startsWith("Kỹ năng") || heading.startsWith("Đường tu")) return "skills";
    return "other";
  }
  function appendUi(row) {
    const cleaned = clean(row);
    if (!cleaned) return;
    uiIncidents.push(cleaned);
    if (uiIncidents.length > 36) uiIncidents.shift();
    try { sessionStorage.setItem(uiLogKey, JSON.stringify(uiIncidents)); } catch {}
  }
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
      panelOpen: !!scene.panels?.open, uiBlocked: !!scene.uiBlocked, panel: panelType(scene),
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
      const rawGap = now - owner.lastFrameAt;
      owner.lastFrameAt = now;
      if (now - owner.panelCheckAt >= 150) {
        const currentPanel = panelType(scene), previousPanel = owner.panel;
        owner.panelCheckAt = now;
        if (currentPanel !== previousPanel) {
          owner.panel = currentPanel;
          const reason = previousPanel === "none" ? "panel_open"
            : currentPanel === "none" ? "panel_close" : "panel_switch";
          const row = snapshot(scene, reason, owner.before);
          row.frameGapMs = GSTMovementLogSchema.number(rawGap);
          append(row); appendUi(row); owner.loggedAt = now;
        }
      }
      if (!document.hidden && rawGap >= 500 && owner.panel !== "none" && now - owner.lastPanelGapAt >= 2000) {
        owner.lastPanelGapAt = now;
        const row = snapshot(scene, "panel_gap", owner.before);
        row.frameGapMs = GSTMovementLogSchema.number(rawGap);
        append(row); appendUi(row); owner.loggedAt = now;
      }
      const corrected = owner.fix !== undefined && fix !== undefined && owner.fix !== fix;
      const targetChanged = owner.target !== scene.auto?.target;
      owner.fix = fix;
      if (!corrected && !targetChanged && now - owner.at < 250) return;
      const gap = now - owner.at > 1000;
      const row = snapshot(scene, corrected ? "correction" : gap ? "frame_gap" : "state", owner.before);
      row.targetChanged = targetChanged;
      row.elapsedMs = GSTMovementLogSchema.number(now - owner.at);
      row.frameGapMs = GSTMovementLogSchema.number(rawGap);
      row.distance = owner.position && row.position ? GSTMovementLogSchema.number(Math.hypot(row.position[0] - owner.position[0], row.position[1] - owner.position[1])) : null;
      const commanded = row.manual || row.steerBefore?.some((value) => value !== 0) || row.steerAfter?.some((value) => value !== 0);
      if (!commanded || corrected || gap || row.distance === null || row.distance >= 0.05) owner.stillAt = now;
      row.stillMs = GSTMovementLogSchema.number(now - owner.stillAt);
      row.littleProgress = row.stillMs >= 750;
      const signature = JSON.stringify([row.auto, row.manual, row.clickOrder, row.paused, row.moved, row.dead,
        row.stunned, row.rooted, row.slowed, row.moveLocked, row.harvesting, row.pendingSkill, row.aiming,
        row.resting, row.target, row.owners, row.scope, row.radius, row.littleProgress, row.hidden, row.focused,
        row.panelOpen, row.uiBlocked, row.panel]);
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
        binding = { scene, at: now, stillAt: now, loggedAt: now, lastFrameAt: now,
          panelCheckAt: -Infinity, panel: "none", lastPanelGapAt: -Infinity,
          fix: scene.self?.fix, target: scene.auto?.target, signature: "", position: null };
        scene.events.on("preupdate", preframe); scene.events.on("postupdate", frame);
        scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
        append(snapshot(scene, "attach"));
      } catch { detach(); }
    },
    snapshot() {
      let current = null;
      try { if (binding) current = snapshot(binding.scene, "sample", binding.before); } catch {}
      return { build: "movement-log-2", tracking: !!binding, scope: "Last 120 observations in this page; reset on reload",
        current, events: events.map((row) => clean(row)),
        uiIncidents: uiIncidents.slice(-36).map((row) => clean(row)).filter(Boolean) };
    }
  };
  window.addEventListener("pagehide", detach);
})();
