(() => {
  "use strict";
  // Speed override plus native Auto Farm approach scheduling; no combat engine.
  const COMMAND = "gst:command:v1";
  const STATUS = "gst:status:v1";
  const origin = "https://nghichthienky.online";
  let enabled = false;
  // Keep the user's ON preference even while automation temporarily suspends speed overrides.
  let automationPaused = false, automationReason = "";
  let walkingSpeed = 3.5;
  let flyingSpeed = 2;
  let farmWalkingSpeed = 2, farmFlyingSpeed = 1.5;
  const modeDelayMs = 1000;
  let activeMode = null;
  let pendingMode = null;
  let pendingSince = 0;
  let timer = null;
  let suspended = false;
  let tracked = null;
  let naturalSpeed = null;
  let naturalFlying = null;
  let lastWritten = null;
  let problem = null;
  let monitoredSpeed = null;
  let lastRawFix = null;
  let fixCount = 1;
  let approachScene = null;
  let approachPosition = null;

  function detachApproach() {
    approachScene?.events?.off?.("preupdate", onSpeedFrame);
    approachScene?.events?.off?.("shutdown", detachApproach);
    approachScene?.events?.off?.("destroy", detachApproach);
    approachScene = null;
    approachPosition = null;
  }

  function attachApproach(scene) {
    if (approachScene === scene) return;
    detachApproach();
    if (typeof scene?.events?.on !== "function" || typeof scene.events.off !== "function") return;
    approachScene = scene;
    scene.events.on("preupdate", onSpeedFrame);
    scene.events.on("shutdown", detachApproach);
    scene.events.on("destroy", detachApproach);
  }

  function onSpeedFrame() {
    if (!enabled || suspended) return;
    try {
      if (syncAutomation(approachScene)) return;
      applySpeed(approachScene);
      stabilizeApproach();
    } catch {
      problem = "World/player temporarily unavailable; retrying.";
    }
  }

  function stabilizeApproach() {
    const scene = approachScene;
      if (GSTHarvest.controls(scene) || globalThis.GSTFarmSeals?.controls(scene) || globalThis.GSTRealm?.controls(scene)
          || globalThis.GSTChest?.controls(scene) || globalThis.GSTFarmMap?.controls(scene)
          || globalThis.GSTFarmBehavior?.controls(scene)) { approachPosition = null; return; }
    const auto = scene?.auto;
    const self = scene?.self;
    const previous = approachPosition;
    const currentWaypoint = Array.isArray(auto?.path?.[0]) ? auto.path[0] : null;
    approachPosition = numeric(scene?.px) && numeric(scene?.py) ? {
      x: scene.px, y: scene.py, fix: self?.fix, path: auto?.path,
      waypoint: currentWaypoint ? [...currentWaypoint] : null
    } : null;
    // Only assist movement actually accelerated by this override, not a new
    // untouched server snapshot or the game's ordinary movement/combat loop.
    if (!enabled || suspended || !scene?.sys?.isActive?.() || self !== tracked
        || !numeric(lastWritten) || self?.ms !== lastWritten
        || !numeric(naturalSpeed) || self.ms <= naturalSpeed || self.dead || scene.leaving
        || !auto?.on || auto.resting || !numeric(auto.think) || auto.think <= 0
        || scene.pendingSkill || scene.aiming || scene.uiBlocked
        || !numeric(scene.autoX) || !numeric(scene.autoY)
        || Math.hypot(scene.autoX, scene.autoY) === 0
        || !numeric(scene.px) || !numeric(scene.py)) return;
    if (typeof scene.now !== "function" || scene.now() < auto.pauseUntil) return;
    if (passedWaypoint(scene, auto, self, previous)) auto.think = 0;
    // Native decisions normally run every .2s. At higher ms that may carry the
    // player across a waypoint/attack range before its next decision. Wake the
    // same native decision once near those points; never invoke basic()/cast().
    const travel = 7.5 * self.ms * Math.min(0.2, auto.think);
    const target = typeof scene.views?.get === "function" ? scene.views.get(auto.target) : null;
    const waypoint = Array.isArray(auto.path) ? auto.path[0] : null;
    const nearTarget = target && !target.dead && numeric(target.x) && numeric(target.y)
      && numeric(target.radius) && Math.hypot(target.x - scene.px, target.y - scene.py) <= 1.6 + target.radius + travel;
    const nearWaypoint = Array.isArray(waypoint) && numeric(waypoint[0]) && numeric(waypoint[1])
      && Math.hypot(waypoint[0] - scene.px, waypoint[1] - scene.py) <= 0.35 + travel;
    if (nearTarget || nearWaypoint) auto.think = 0;
  }

  function passedWaypoint(scene, auto, self, previous) {
    const point = auto.path?.[0];
    const next = auto.path?.[1];
    if (!previous || previous.path !== auto.path || !Array.isArray(point) || !Array.isArray(next)
        || !previous.waypoint || previous.waypoint[0] !== point[0] || previous.waypoint[1] !== point[1]
        || !point.every(numeric) || !next.every(numeric) || point.length !== 2 || next.length !== 2
        || !numeric(self.fix) || self.fix !== previous.fix) return false;
    const dx = scene.px - previous.x;
    const dy = scene.py - previous.y;
    const squared = dx * dx + dy * dy;
    if (squared < 1e-10) return false;
    const fraction = ((point[0] - previous.x) * dx + (point[1] - previous.y) * dy) / squared;
    if (fraction <= 0 || fraction >= 1
        || Math.hypot(previous.x - point[0], previous.y - point[1]) < 0.35
        || Math.hypot(scene.px - point[0], scene.py - point[1]) < 0.35
        || Math.hypot(previous.x + fraction * dx - point[0], previous.y + fraction * dy - point[1]) >= 0.35) return false;
    try {
      const host = scene.autoHost?.();
      if (typeof host?.clear !== "function" || !host.clear(scene.px, scene.py, next[0], next[1])) return false;
    } catch { return false; }
    // Complete just the crossed node, never the final node. Native collision,
    // route following, target selection and attack checks handle the next step.
    auto.path.shift();
    return true;
  }

  function worldScene() {
    return window.game?.scene?.getScene?.("world") ?? null;
  }

  function player() {
    return worldScene()?.self ?? null;
  }

  function automationBlocker(scene) {
    // Feature intent, not movement ownership: also suppress when an auto feature
    // is enabled but temporarily idle or waiting for its target to appear.
    if (scene?.auto?.on === true) return "Auto Farm";
    if (globalThis.GSTHarvest?.isEnabled?.() === true) return "Auto Thu Hoạch";
    if (globalThis.GSTChest?.isEnabled?.() === true) return "Tìm Rương";
    if (globalThis.GSTRealm?.isEnabled?.() === true) return "Tìm Cổng Bí Cảnh";
    if (globalThis.GSTQuest?.active?.(scene) === true) return "Auto Quest";
    return "";
  }

  function syncAutomation(scene) {
    const reason = automationBlocker(scene);
    if (reason) {
      if (!automationPaused) {
        restoreOnce();
        approachPosition = null;
      }
      automationPaused = true;
      automationReason = reason;
      return true;
    }
    if (automationPaused) {
      automationPaused = false;
      automationReason = "";
      // After the final automation turns off, apply the saved normal speed
      // to the freshly restored client value; never force the popup switch ON.
      resetMode();
      approachPosition = null;
    }
    return false;
  }

  function numeric(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function resetMode() {
    activeMode = null;
    pendingMode = null;
    pendingSince = 0;
  }

  function displayedFix(rawFix) {
    if (monitoredSpeed === null || !numeric(rawFix)) return null;
    if (lastRawFix !== null) {
      if (rawFix < lastRawFix) fixCount = 1;
      else fixCount += rawFix - lastRawFix;
    }
    lastRawFix = rawFix;
    return fixCount;
  }

  function speedFor(self, scene) {
    // Debounce the whole speed profile: changing farm and flight together
    // must settle for one second, without stacking two separate delays.
    const mode = `${scene.auto?.on === true ? "farm" : "normal"}:${self.fly ? "flying" : "walking"}`;
    const now = performance.now();
    if (activeMode === null) activeMode = mode;
    if (mode === activeMode) {
      pendingMode = null;
    } else if (pendingMode !== mode) {
      pendingMode = mode;
      pendingSince = now;
    } else if (now - pendingSince >= modeDelayMs) {
      activeMode = mode;
      pendingMode = null;
    }
    const flying = activeMode.endsWith(":flying");
    if (activeMode.startsWith("farm:")) return flying ? farmFlyingSpeed : farmWalkingSpeed;
    return flying ? flyingSpeed : walkingSpeed;
  }

  function forgetPlayer() {
    tracked = null;
    naturalSpeed = null;
    naturalFlying = null;
    lastWritten = null;
  }

  function restoreOnce() {
    // Do not overwrite a newer value chosen by the game.
    try {
      if (tracked && tracked === player() && lastWritten !== null
          && tracked.ms === lastWritten && numeric(naturalSpeed)) {
        if (!!tracked.fly === naturalFlying) {
          tracked.ms = naturalSpeed;
        } else {
          problem = "Disabled; waiting for the game's speed update after a movement-state change.";
        }
      }
    } catch {
      problem = "Could not restore the observed speed; reload with override off.";
    }
    forgetPlayer();
    resetMode();
    monitoredSpeed = null;
    lastRawFix = null;
    fixCount = 1;
  }

  function publish(requestId = null) {
    let current = null;
    let fix = null;
    let state = "unknown";
    let message = problem;
    try {
      const self = player();
      // Match the game's movement/rendering checks, independently of ms.
      if (self) state = self.fly ? "flying" : "walking";
      current = numeric(self?.ms) ? self.ms : null;
      // Relative display counter only; never assign to the game's self.fix.
      fix = displayedFix(self?.fix);
      message ||= !enabled ? "Disabled; movement speed is controlled by the game."
        : automationPaused ? `Tạm tắt tăng tốc vì ${automationReason} đang bật; sẽ tự khôi phục khi tất cả tính năng tự động tắt.`
        : !window.game ? "Waiting for window.game (requires timer URL parameter)."
        : !self ? "Waiting for world scene / player."
        : current === null ? "Waiting for a numeric self.ms."
        : pendingMode !== null ? "Waiting for movement / Auto Farm state to remain stable for 1 second."
        : "Enabled; monitoring movement speed.";
    } catch {
      message ||= "Waiting for an accessible world scene.";
    }
    window.postMessage({
      channel: STATUS, requestId,
      status: { enabled, suppressed: enabled && automationPaused, current, fix, state, message }
    }, origin);
  }

  function applySpeed(scene) {
    if (!enabled || suspended || !scene?.sys?.isActive?.()) return;
    const self = scene?.self ?? null;
    if (self !== tracked) {
      forgetPlayer();
      tracked = self;
    }
    // Snapshots replace self frequently; debounce belongs to the mode, not its object.
    if (!self) resetMode();
    if (self && numeric(self.ms)) {
      const speed = speedFor(self, scene);
      const current = self.ms;
      if (lastWritten === null || current !== lastWritten) {
        naturalSpeed = current;
        naturalFlying = !!self.fly;
      }
      if (current !== speed) {
        // The game's delta decoder retains its original self object. Mutating
        // that object pollutes later snapshots when ms is omitted from a delta.
        // Give the scene its own shallow copy: every value except ms is kept.
        const overridden = { ...self, ms: speed };
        scene.self = overridden;
        tracked = overridden;
        lastWritten = speed;
      }
      if (monitoredSpeed !== speed) {
        monitoredSpeed = speed;
        lastRawFix = numeric(self.fix) ? self.fix : null;
        fixCount = 1;
      }
    }
  }

  function tick() {
    if (!enabled || suspended) return;
    try {
      const scene = worldScene();
      attachApproach(scene);
      if (!syncAutomation(scene)) applySpeed(scene);
      problem = null;
    } catch {
      problem = "World/player temporarily unavailable; retrying.";
    }
    // Feed the on-page display using the existing monitoring timer.
    publish();
  }

  function stopTimer() {
    detachApproach();
    if (timer !== null) clearInterval(timer);
    timer = null;
  }

  function startTimer() {
    if (enabled && !suspended && timer === null) {
      tick();
      timer = setInterval(tick, 500);
    }
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin) return;
    const data = event.data;
    if (data?.channel !== COMMAND) return;
    if (data.type === "snapshot") {
      publish(typeof data.requestId === "string" ? data.requestId : null);
      return;
    }
    if (data.type !== "configure" || typeof data.enabled !== "boolean"
        || !numeric(data.walkingSpeed) || data.walkingSpeed < 1 || data.walkingSpeed > 6
        || !numeric(data.flyingSpeed) || data.flyingSpeed < 1 || data.flyingSpeed > 6) return;
    const wasEnabled = enabled;
    const nextFarmWalking = numeric(data.farmWalkingSpeed) ? Math.max(1, Math.min(6, data.farmWalkingSpeed)) : 2;
    const nextFarmFlying = numeric(data.farmFlyingSpeed) ? Math.max(1, Math.min(6, data.farmFlyingSpeed)) : 1.5;
    const changedSpeed = walkingSpeed !== data.walkingSpeed || flyingSpeed !== data.flyingSpeed
      || farmWalkingSpeed !== nextFarmWalking || farmFlyingSpeed !== nextFarmFlying;
    farmWalkingSpeed = nextFarmWalking; farmFlyingSpeed = nextFarmFlying;
    enabled = data.enabled;
    walkingSpeed = data.walkingSpeed;
    flyingSpeed = data.flyingSpeed;
    if (!enabled) {
      stopTimer();
      if (wasEnabled) restoreOnce();
      automationPaused = false;
      automationReason = "";
    } else {
      startTimer();
      if (wasEnabled && changedSpeed) tick();
    }
    publish();
  });

  // Preserve BFCache support: pause on leave and resume the same single timer.
  window.addEventListener("pagehide", () => {
    suspended = true;
    stopTimer();
    restoreOnce();
    automationPaused = false;
    automationReason = "";
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    startTimer();
  });
  window.postMessage({ channel: STATUS, ready: true }, origin);
})();
