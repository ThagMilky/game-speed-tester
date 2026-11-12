(() => {
  "use strict";
  const skillKeys = new Set(["1", "2", "3", "4", "5", "6", "Q"]);
  const sources = new Set(["farm_cast", "auto_q"]);
  const reasons = new Set(["player_target", "player_lock", "player_aim", "targeting_unavailable",
    "dodge_preference_off", "native_method_unavailable", "extension_throttle", "dash_active",
    "facing_unavailable", "local_cooldown", "snapshot_cooldown", "rooted", "stunned",
    "no_safe_direction", "hazard_window", "overlapping_attempt", "manual_input", "observation_timeout",
    "collection_disabled", "capacity", "scene_change", "manual_tracking_unavailable", "policy_change"]);
  const maxEvents = 80, maxPending = 8, observationMs = 10000, blockThrottleMs = 900;
  let scene = null, identityKey = "", profileKey = "", policyAllowed = false;
  let enabled = false, pending = [], events = [], nextAttemptId = 0, activeAttempt = null, hook = null;
  const lastBlocked = new Map();
  const clampMs = (value) => Number.isFinite(value) ? Math.round(Math.max(0, Math.min(120000, value))) : null;
  const time = () => performance.now();
  const cleanSkill = (key) => skillKeys.has(key) ? key : "";
  function snapshotState(owner, key) {
    let now = null, selfAt = null;
    let localDeadline = null, nativeRaw = null;
    try {
      if (typeof owner?.now === "function") {
        const value = owner.now();
        if (Number.isFinite(value)) now = value;
      }
      if (Number.isFinite(owner?.selfAt)) selfAt = owner.selfAt;
      if (Number.isFinite(owner?.cdLocal?.[key])) localDeadline = owner.cdLocal[key];
      const self = owner?.self;
      const cooldowns = self && typeof self === "object" && !Array.isArray(self)
        && self.cd && typeof self.cd === "object" && !Array.isArray(self.cd) ? self.cd : null;
      // Native cooldown reads use cd[key] ?? 0. A valid map may omit a skill,
      // but absent/invalid map data must remain unknown for evidence checks.
      if (cooldowns) {
        const value = cooldowns[key] ?? 0;
        if (Number.isFinite(value)) nativeRaw = value;
      }
    } catch { /* Invalid snapshot objects are unknown diagnostic evidence. */ }
    const nativeSnapshotValid = Number.isFinite(nativeRaw) && Number.isFinite(now) && Number.isFinite(selfAt);
    const nativeElapsed = nativeSnapshotValid ? Math.max(0, now - selfAt) : null;
    return {
      localDeadline,
      localCooldownMs: Number.isFinite(localDeadline) && Number.isFinite(now)
        ? clampMs((localDeadline - now) * 1000) : null,
      nativeCooldownMs: nativeSnapshotValid ? clampMs((nativeRaw - nativeElapsed) * 1000) : null,
      selfAt: Number.isFinite(selfAt) ? selfAt : null,
      dashActive: key === "Q" && Number.isFinite(owner?.dashT) && owner.dashT > 0,
      pendingSkill: owner?.pendingSkill?.key === key
    };
  }
  function append(attempt, stage, reason = "", extra = {}) {
    if (!attempt || !skillKeys.has(attempt.key) || !sources.has(attempt.source)) return;
    const row = { at: new Date().toISOString(), attemptId: attempt.id, skill: attempt.key,
      source: attempt.source, stage };
    if (reasons.has(reason)) row.reason = reason;
    if (["host.cast", "scene.useSkill"].includes(extra.method)) row.method = extra.method;
    if (["true", "false", "undefined", "other"].includes(extra.returnKind)) row.returnKind = extra.returnKind;
    if (extra.localCooldownDeltaMs !== undefined) row.localCooldownDeltaMs = clampMs(extra.localCooldownDeltaMs);
    if (typeof extra.dashStarted === "boolean") row.dashStarted = extra.dashStarted;
    if (typeof extra.pendingSkillChanged === "boolean") row.pendingSkillChanged = extra.pendingSkillChanged;
    if (extra.snapshotAdvanceMs !== undefined) row.snapshotAdvanceMs = clampMs(extra.snapshotAdvanceMs);
    if (extra.cooldownBeforeMs !== undefined) row.cooldownBeforeMs = clampMs(extra.cooldownBeforeMs);
    if (extra.cooldownAfterMs !== undefined) row.cooldownAfterMs = clampMs(extra.cooldownAfterMs);
    events.push(row);
    if (events.length > maxEvents) events.splice(0, events.length - maxEvents);
  }
  function closeUnconfirmed(attempt, reason) {
    if (!attempt || attempt.closed) return;
    attempt.closed = true;
    clearTimeout(attempt.timer);
    append(attempt, "unconfirmed", reason);
    pending = pending.filter((row) => row !== attempt);
  }
  function markAmbiguous(attempt, reason) {
    if (!attempt || attempt.closed) return;
    attempt.ambiguous = true;
    append(attempt, "ambiguous", reason);
  }
  function detachHooks() {
    const old = hook;
    hook = null;
    if (!old) return;
    old.scene.events.off("postupdate", observe);
    old.scene.events.off("shutdown", onSceneEnd);
    old.scene.events.off("destroy", onSceneEnd);
    if (old.scene.useSkill === old.wrapper) {
      try {
        if (old.descriptor) Object.defineProperty(old.scene, "useSkill", old.descriptor);
        else delete old.scene.useSkill;
      } catch { /* The game may have replaced the native method. */ }
    }
  }
  function observeInterveningUse(owner, key, reason) {
    if (!enabled) return;
    for (const attempt of [...pending]) {
      if (attempt.key !== key) continue;
      markAmbiguous(attempt, reason);
      closeUnconfirmed(attempt, reason);
    }
  }
  function installHooks() {
    if (!enabled || !policyAllowed || !scene?.events?.on || !scene.events.off || hook?.scene === scene) return hook?.scene === scene;
    const original = scene.useSkill;
    if (typeof original !== "function") return false;
    const descriptor = Object.getOwnPropertyDescriptor(scene, "useSkill");
    const ownerScene = scene;
    const wrapper = function (key, ...args) {
      const skill = cleanSkill(key), attempt = activeAttempt;
      if (attempt && attempt === activeAttempt && attempt.key === skill
          && ["farm_cast", "auto_q"].includes(attempt.source)) {
        attempt.nativeSkillEntered = true;
        if (attempt.source === "farm_cast")
          append(attempt, "native_skill_invoked", "", { method: "scene.useSkill" });
      } else if (skill) observeInterveningUse(ownerScene, skill,
        args[1] !== false ? "manual_input" : "overlapping_attempt");
      return original.apply(this, [key, ...args]);
    };
    try { ownerScene.useSkill = wrapper; }
    catch { return false; }
    if (ownerScene.useSkill !== wrapper) return false;
    hook = { scene: ownerScene, original, descriptor, wrapper };
    ownerScene.events.on("postupdate", observe);
    ownerScene.events.once?.("shutdown", onSceneEnd);
    ownerScene.events.once?.("destroy", onSceneEnd);
    return true;
  }
  function stateAfter(attempt) {
    const after = snapshotState(attempt.scene, attempt.key), before = attempt.before;
    const localDelta = Number.isFinite(after.localDeadline)
      ? Number.isFinite(before.localDeadline) ? (after.localDeadline - before.localDeadline) * 1000
        : after.localCooldownMs : null;
    const dashStarted = !before.dashActive && after.dashActive;
    const pendingStarted = !before.pendingSkill && after.pendingSkill;
    if (!attempt.localChangeRecorded
        && ((Number.isFinite(localDelta) && localDelta > 25) || dashStarted || pendingStarted)) {
      attempt.localChangeRecorded = true;
      append(attempt, "local_state_changed", "", { localCooldownDeltaMs: localDelta,
        dashStarted, pendingSkillChanged: pendingStarted });
    }
    return after;
  }
  function observe() {
    if (!enabled || !hook || hook.scene !== scene) return;
    const now = time();
    for (const attempt of [...pending]) {
      if (attempt.scene !== scene) { closeUnconfirmed(attempt, "scene_change"); continue; }
      const after = stateAfter(attempt);
      if (!attempt.ambiguous && attempt.nativeSkillEntered
          && Number.isFinite(attempt.before.selfAt) && Number.isFinite(after.selfAt)
          && after.selfAt > attempt.before.selfAt && Number.isFinite(attempt.before.nativeCooldownMs)
          && Number.isFinite(after.nativeCooldownMs)
          && after.nativeCooldownMs > attempt.before.nativeCooldownMs + 50) {
        append(attempt, "snapshot_cooldown", "", {
          snapshotAdvanceMs: (after.selfAt - attempt.before.selfAt) * 1000,
          cooldownBeforeMs: attempt.before.nativeCooldownMs, cooldownAfterMs: after.nativeCooldownMs
        });
        attempt.closed = true;
        clearTimeout(attempt.timer);
        pending = pending.filter((row) => row !== attempt);
        continue;
      }
      if (now >= attempt.expiresAt) closeUnconfirmed(attempt, "observation_timeout");
    }
  }
  function start(sceneNow, key, source, method) {
    if (!enabled || !hook || hook.scene !== scene || sceneNow !== scene || !policyAllowed
        || !cleanSkill(key) || !sources.has(source)) return null;
    for (const previous of [...pending]) {
      if (previous.key !== key) continue;
      markAmbiguous(previous, "overlapping_attempt");
      closeUnconfirmed(previous, "overlapping_attempt");
    }
    if (pending.length >= maxPending) closeUnconfirmed(pending[0], "capacity");
    nextAttemptId = nextAttemptId >= 1e9 ? 1 : nextAttemptId + 1;
    const attempt = { id: nextAttemptId, scene: sceneNow, key, source,
      expiresAt: time() + observationMs, before: snapshotState(sceneNow, key),
      method, nativeSkillEntered: method === "scene.useSkill",
      ambiguous: false, closed: false };
    pending.push(attempt);
    attempt.timer = setTimeout(() => closeUnconfirmed(attempt, "observation_timeout"), observationMs);
    return attempt;
  }
  function invoke(sceneNow, key, source, method, action) {
    if (typeof action !== "function") return undefined;
    const attempt = start(sceneNow, key, source, method);
    if (!attempt) return action();
    append(attempt, "native_invoked", "", { method });
    const previous = activeAttempt;
    activeAttempt = attempt;
    let returned = false, result;
    try {
      result = action();
      returned = true;
      append(attempt, "native_return", "", { method,
        returnKind: typeof result === "boolean" ? String(result) : result === undefined ? "undefined" : "other" });
      stateAfter(attempt);
      return result;
    } finally {
      activeAttempt = previous;
      if (!returned) stateAfter(attempt);
    }
  }
  function blocked(sceneNow, key, source, reason) {
    if (!enabled || sceneNow !== scene || !policyAllowed || !cleanSkill(key) || !sources.has(source)
        || !reasons.has(reason)) return;
    const stamp = time(), throttleKey = `${key}:${source}:${reason}`;
    if (stamp - (lastBlocked.get(throttleKey) ?? -Infinity) < blockThrottleMs) return;
    lastBlocked.set(throttleKey, stamp);
    if (lastBlocked.size > 32) lastBlocked.delete(lastBlocked.keys().next().value);
    nextAttemptId = nextAttemptId >= 1e9 ? 1 : nextAttemptId + 1;
    append({ id: nextAttemptId, key, source }, source === "auto_q" ? "q_blocked" : "guard_blocked", reason);
  }
  function disable(reason = "collection_disabled") {
    enabled = false;
    for (const attempt of [...pending]) closeUnconfirmed(attempt, reason);
    detachHooks();
  }
  function setContext(sceneNow, value = {}) {
    const verified = value.identityVerified === true && value.identityBlocked !== true
      && typeof value.accountProfileKey === "string" && !!value.accountProfileKey;
    const nextIdentity = verified ? [value.accountProfileKey, value.accountId ?? "", value.slot ?? "",
      value.character ?? "", value.classId ?? "", value.characterId ?? ""].join("\u0000") : "";
    const identityChanged = nextIdentity !== identityKey;
    const sceneChanged = sceneNow !== scene;
    if (identityChanged) {
      disable("policy_change"); events = []; pending = []; lastBlocked.clear(); nextAttemptId = 0;
      identityKey = nextIdentity; profileKey = verified ? value.accountProfileKey : "";
    }
    if (sceneChanged) {
      for (const attempt of [...pending]) closeUnconfirmed(attempt, "scene_change");
      detachHooks(); scene = sceneNow?.events?.on && sceneNow?.events?.off ? sceneNow : null;
    }
    policyAllowed = verified && value.policyMode === "extended" && !!scene;
    if (!policyAllowed && enabled) disable("policy_change");
    else if (enabled && !installHooks()) disable("manual_tracking_unavailable");
  }
  function control(sceneNow, action, requestedEnabled, expectedProfileKey) {
    if (!scene || sceneNow !== scene || !profileKey) return { accepted: false, enabled: false, reason: "policy_change" };
    if (expectedProfileKey !== profileKey) return { accepted: false, enabled, reason: "policy_change" };
    if (action === "status") return { accepted: true, enabled: enabled && policyAllowed };
    if (action === "clear") {
      for (const attempt of pending) clearTimeout(attempt.timer);
      events = []; pending = []; lastBlocked.clear(); return { accepted: true, enabled: enabled && policyAllowed };
    }
    if (action !== "set" || typeof requestedEnabled !== "boolean") return { accepted: false, enabled, reason: "policy_change" };
    if (!requestedEnabled) disable("collection_disabled");
    else {
      if (!policyAllowed) return { accepted: false, enabled: false, reason: "policy_change" };
      enabled = true;
      if (!installHooks()) { enabled = false; return { accepted: false, enabled, reason: "manual_tracking_unavailable" }; }
    }
    return { accepted: true, enabled };
  }
  function onSceneEnd() {
    for (const attempt of [...pending]) closeUnconfirmed(attempt, "scene_change");
    detachHooks(); scene = null; policyAllowed = false;
  }
  function onPageHide() { disable("scene_change"); pending = []; scene = null; policyAllowed = false; }
  function snapshot(sceneNow = scene) {
    return { build: "farm-skill-1", enabled: enabled && sceneNow === scene,
      tracking: !!hook && sceneNow === scene, events: sceneNow === scene ? events.slice(-maxEvents).map((row) => ({ ...row })) : [] };
  }
  function isEnabled(sceneNow) { return enabled && policyAllowed && sceneNow === scene; }
  globalThis.GSTFarmSkillDiagnostics = { setContext, control, invoke, blocked, snapshot, isEnabled };
  window.addEventListener("pagehide", onPageHide);
})();
