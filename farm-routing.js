(() => {
  "use strict";
  let enabled = false, binding = null, suspended = false;
  let modalAt = -Infinity, modal = false;
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  const point = (p) => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);
  function blocked(scene) {
    if (scene.keyCapture || scene.overlay?.dialogOpen) return true;
    if (document.body?.classList.contains("mobile") && innerHeight > innerWidth) return true;
    const now = performance.now();
    if (now - modalAt >= 250) {
      modalAt = now;
      modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    }
    if (modal) return true;
    // The native move/useSkill methods already allow these panels while auto.on.
    // Never override the game's getter or its equipment/action restrictions.
    return !!scene.uiBlocked && !(scene.panels?.open || scene.chat?.typing || scene.inputFieldActive?.());
  }
  function manual(scene) {
    return GSTFarmInput.movement(scene);
  }
  function otherOwner(scene) {
    return ["GSTHarvest", "GSTFarmBehavior", "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"]
      .some((name) => globalThis[name]?.controls?.(scene));
  }
  function ready(scene, time) {
    const d = scene.driver;
    return scene.auto.on && scene.self && !scene.self.dead && !scene.leaving && d
      && !d.closing && !d.reconnecting && !d.displaced && (d.online === false || d.link?.open?.() === true)
      && !scene.auto.resting && !scene.self.med && !scene.harvesting && !scene.pendingSkill && !scene.aiming
      && !scene.auto.moved && time >= scene.auto.pauseUntil && !manual(scene)
      && !(scene.self.realm?.inside?.protection > 0) && !blocked(scene) && !otherOwner(scene);
  }
  function detach() {
    const old = binding; binding = null;
    if (!old) return;
    GSTNavigation.cancel(old.scene, old.auto);
    old.remove();
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    if (old.auto.walk === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.auto, "walk", old.descriptor);
      else delete old.auto.walk;
    }
  }
  function attach(scene) {
    if (!enabled || suspended) { detach(); return; }
    if (binding?.scene === scene && binding.auto === scene?.auto && scene.auto.walk === binding.wrapper
        && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.walk !== "function" || typeof scene.auto.update !== "function"
        || typeof scene.now !== "function" || !scene.events?.on || !scene.events.off) return;
    const auto = scene.auto, original = auto.walk;
    const owner = { scene, auto, descriptor: Object.getOwnPropertyDescriptor(auto, "walk"), track: null,
      paused: false, note: "", noteUntil: 0 };
    owner.wrapper = function (host, time, x, y, gx, gy, reach) {
      // Private navigation objects inherit walk(); leave their existing owners in control.
      if (this !== auto || !ready(scene, time) || !auto.target || ![time, x, y, gx, gy, reach].every(Number.isFinite)
          || typeof host.clear !== "function") {
        if (this === auto) { owner.track = null; GSTNavigation.cancel(scene, auto); }
        return original.apply(this, arguments);
      }
      let track = owner.track;
      if (!track || track.id !== auto.target || time - track.seenAt > 1 || Math.hypot(gx - track.gx, gy - track.gy) > 1.5) {
        track = owner.track = { id: auto.target, gx, gy, since: time, progressAt: time,
          seenAt: time, retries: 0, remaining: Math.hypot(gx - x, gy - y), point: null, pointDistance: 0, fix: scene.self.fix };
      }
      track.seenAt = time;
      const remaining = Math.hypot(gx - x, gy - y);
      const waypointProgress = point(track.point) && point(auto.path?.[0])
        && auto.path[0][0] === track.point[0] && auto.path[0][1] === track.point[1]
        && track.pointDistance - Math.hypot(track.point[0] - x, track.point[1] - y) >= 0.25;
      if (track.fix === scene.self.fix && (track.remaining - remaining >= 0.25 || waypointProgress)) {
        if (waypointProgress && remaining >= track.remaining && time >= owner.noteUntil) {
          owner.note = "Đang theo đường vòng tới mục tiêu; vẫn có tiến triển."; owner.noteUntil = time + 1;
        }
        track.progressAt = time; track.remaining = remaining;
        track.point = null;
        // Allow real detours, but never keep an unreachable chase alive forever.
        if (remaining > 3 && time - track.since < 120) auto.chaseSince = time;
      }
      if (track.fix !== scene.self.fix) {
        track.remaining = remaining; track.point = null; track.progressAt = time;
        track.settleUntil = time + 0.45;
        auto.path = []; auto.pathAt = -Infinity; auto.sideUntil = 0;
        owner.note = "Game vừa chỉnh vị trí; đang chờ ổn định rồi tính lại đường."; owner.noteUntil = time + 1;
      }
      track.fix = scene.self.fix;
      if (time < track.settleUntil) { host.steer(0, 0); return true; }
      if (remaining > reach && time - track.progressAt > 2 && track.retries < 2
          && (!track.replanAt || time - track.replanAt >= 2)) {
        auto.path = []; auto.pathAt = -Infinity;
        track.replanAt = time; track.retries++;
        owner.note = "Đường chưa tiến triển; đang tính lại bằng đường đi của game."; owner.noteUntil = time + 2;
      }
      if (remaining > reach && time - track.progressAt > 7) {
        host.steer(0, 0); owner.track = null;
        owner.note = "Đường bị kẹt; nhường game tạm bỏ mục tiêu và chọn quái khác."; owner.noteUntil = time + 3;
        return false;
      }
      // Skip only a crossed intermediate corner with a collision-clear next segment.
      GSTNavigation.prune(scene, auto, host, true);
      const result = original.apply(this, arguments);
      if (result) GSTNavigation.schedule(scene, auto, gx, gy, reach);
      GSTNavigation.remember(scene, auto, gx, gy);
      const next = auto.path?.[0];
      if (point(next) && (!track.point || track.point[0] !== next[0] || track.point[1] !== next[1])) {
        track.point = [...next]; track.pointDistance = Math.hypot(next[0] - x, next[1] - y);
      }
      return result;
    };
    owner.remove = GSTFarmUpdate.add(scene, 1, function (host, time) {
      if (sceneNow() !== scene || !scene.sys?.isActive?.() || scene.auto !== auto) { detach(); return false; }
      if (!auto.on) { GSTNavigation.cancel(scene, auto); owner.track = null; owner.paused = false; owner.note = ""; return false; }
      if (blocked(scene) && scene.self && !scene.self.dead && !(auto.deadAt > 0)) {
        owner.track = null; host.steer(0, 0);
        owner.paused = true;
        // Death and revival handling still run through the native update.
        owner.note = "Auto Farm vẫn bật; tạm chờ đóng hội thoại NPC hoặc bảng bảo vệ."; owner.noteUntil = time + 1;
        return true;
      }
      if (owner.paused) {
        owner.paused = false;
        // A conversation is not a failed chase. Start a fresh native route once.
        auto.chaseSince = time; auto.stillSince = time; auto.think = 0; auto.path = [];
        owner.note = "Đã đóng hội thoại; Auto Farm đang tiếp tục."; owner.noteUntil = time + 2;
      }
      if (!ready(scene, time)) owner.track = null;
      return false;
    });
    auto.walk = owner.wrapper; binding = owner;
    scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmRouting = {
    blocked,
    configure(scene, value) { enabled = value.enabled === true; detach(); attach(scene); },
    attach,
    status: (scene) => binding?.scene === scene && scene.auto.on && scene.now() < binding.noteUntil ? binding.note : ""
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; attach(sceneNow()); });
})();
