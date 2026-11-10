(() => {
  "use strict";
  let enabled = false, suspended = false, binding = null, episode = null;
  let message = "Đang chờ kỳ ngộ.", lastTick = -Infinity, manualAttempt = null;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const finite = Number.isFinite;
  function reset(note) {
    episode = null; manualAttempt = null;
    if (note) message = note;
  }
  function detach() {
    const old = binding; binding = null; reset();
    if (!old) return;
    old.scene.events.off("preupdate", tick);
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
  }
  function validConnection(scene) {
    const d = scene.driver;
    try {
      return !!d && d.online === true && !d.closing && !d.reconnecting && !d.displaced
        && typeof d.link?.open === "function" && d.link.open();
    } catch { return false; }
  }
  function identity(scene) {
    if (!Number.isSafeInteger(scene?.you) || typeof scene.map?.scene !== "string" || !scene.map.scene) return null;
    return `${scene.you}:${scene.map.scene}:${scene.self?.kh?.[0] ?? 0}`;
  }
  function blocked(scene) {
    return !scene.self || scene.self.dead || scene.leaving || scene.keyCapture || scene.uiBlocked
      || scene.overlay?.dialogOpen || (scene.self.realm?.inside?.protection ?? 0) > 0
      || [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
  }
  function same(a, b) { return a.k === b.k && a.s === b.s && a.x === b.x && a.y === b.y; }
  function total(scene) {
    const value = scene.profile?.kt?.kyngo?.total;
    return Number.isSafeInteger(value) && value >= 0 ? value : null;
  }
  function button(scene) {
    const bar = scene.kyNgoBar, root = bar?.root, go = bar?.go;
    if (!(root instanceof HTMLElement) || root.id !== "kyngo-bar" || !root.isConnected || root.hidden
        || !(go instanceof HTMLButtonElement) || !root.contains(go) || !go.isConnected || go.disabled || go.matches(":disabled")
        || typeof go.onclick !== "function" || !root.getClientRects().length
        || getComputedStyle(root).visibility !== "visible") return null;
    return go;
  }
  function manual(event) {
    if (!event.isTrusted || !binding || event.target !== binding.scene.kyNgoBar?.go) return;
    const scene = binding.scene, current = scene.self?.kt?.kyngo;
    const appearance = current && typeof current.k === "string" && current.k
      && typeof current.s === "string" && current.s && finite(current.x) && finite(current.y)
      && finite(current.left) && current.left > 0
      ? { k: current.k, s: current.s, x: current.x, y: current.y } : null;
    manualAttempt = { at: performance.now(), context: identity(scene), snapshot: scene.selfAt, appearance };
    if (episode && appearance && same(episode, appearance) && episode.attempts < 2) {
      episode.attempts++; episode.lastAttempt = manualAttempt.at; episode.pending = true;
      message = "Đã yêu cầu gặp kỳ ngộ; chờ xác nhận.";
    }
  }
  function tick(force = false) {
    const scene = binding?.scene, now = performance.now();
    if (!scene || !enabled || suspended || (force !== true && now - lastTick < 500)) return;
    lastTick = now;
    try {
      const key = identity(scene);
      if (sceneNow() !== scene || !scene.sys?.isActive?.() || !key || key !== binding.identity || !validConnection(scene)) {
        reset("Kỳ ngộ: chờ kết nối và nhân vật ổn định.");
        binding.identity = key; binding.freshAfter = finite(scene.selfAt) ? scene.selfAt : -Infinity;
        return;
      }
      const time = scene.now?.(), stamp = scene.selfAt;
      if (!finite(time) || !finite(stamp) || time < stamp || time - stamp > 2 || stamp <= binding.freshAfter) {
        message = "Kỳ ngộ: đang chờ dữ liệu mới."; return;
      }
      if (!scene.self || (scene.self.kt != null && typeof scene.self.kt !== "object")) {
        message = "Kỳ ngộ: đang chờ dữ liệu nhân vật."; return;
      }
      // The snapshot omits kt entirely when no subsystem has live data.
      const current = scene.self.kt?.kyngo, savedTotal = total(scene);
      if (episode?.pending && current == null && episode.baselineTotal !== null && savedTotal !== null && savedTotal > episode.baselineTotal
          && stamp > episode.startSnapshot && stamp > episode.snapshot && scene.profile !== episode.profile) {
        episode.confirmed = true; episode.pending = false; message = "Đã xác nhận nhận kỳ ngộ.";
      }
      if (current == null) {
        if (episode && stamp > episode.snapshot && !episode.ended) {
          episode.ended = true;
          episode.absentSnapshot = stamp;
          manualAttempt = null;
          if (!episode.confirmed) message = "Kỳ ngộ không còn; chưa xác nhận đã nhận.";
        } else if (!episode) message = "Đang chờ kỳ ngộ.";
        return;
      }
      if (typeof current.k !== "string" || !current.k || typeof current.s !== "string" || !current.s
          || !finite(current.x) || !finite(current.y) || !finite(current.left) || current.left <= 0) {
        message = "Kỳ ngộ: dữ liệu không hợp lệ hoặc đã hết hạn."; return;
      }
      const changedAppearance = episode && !episode.ended && stamp > episode.snapshot
        && !same(episode, current);
      const manualForCurrent = manualAttempt && now - manualAttempt.at < 5000
        && manualAttempt.context === key && manualAttempt.appearance
        && finite(manualAttempt.snapshot) && stamp >= manualAttempt.snapshot
        && same(manualAttempt.appearance, current);
      if (changedAppearance) {
        // The game creates each appearance with a five-minute `until` deadline.
        // A changed kind, map, or coordinate on a newer complete snapshot marks
        // a new appearance even when the intervening absent snapshot was missed.
        episode.ended = true;
        episode.absentSnapshot = stamp;
        if (!manualForCurrent) manualAttempt = null;
        if (!episode.confirmed) message = "Kỳ ngộ cũ không còn; chưa xác nhận đã nhận.";
      }
      if (!episode || (episode.ended && (changedAppearance || stamp > episode.absentSnapshot))) {
        episode = { k: current.k, s: current.s, x: current.x, y: current.y, attempts: 0,
          lastAttempt: -Infinity, pending: false, confirmed: false, baselineTotal: savedTotal,
          profile: scene.profile, startSnapshot: stamp, snapshot: stamp, deadline: now + Math.max(0, current.left - 1 - (time - stamp)) * 1000 };
        if (manualForCurrent) {
          episode.attempts = 1; episode.lastAttempt = manualAttempt.at; episode.pending = true;
        }
      } else if (episode.ended) {
        return; // A new appearance requires a later fresh snapshot.
      } else if (stamp > episode.snapshot) {
        episode.snapshot = stamp;
        episode.deadline = Math.min(episode.deadline, now + Math.max(0, current.left - 1 - (time - stamp)) * 1000);
      }
      if (episode.confirmed) return;
      if (now >= episode.deadline) { message = "Kỳ ngộ đã hết hạn; chưa xác nhận đã nhận."; return; }
      if (current.s !== scene.map.scene) { message = "Kỳ ngộ ở bản đồ khác; đang chờ."; return; }
      if (blocked(scene)) { message = "Kỳ ngộ: đang chờ đóng hộp thoại hoặc hồi phục."; return; }
      const go = button(scene);
      if (!go) { message = "Kỳ ngộ: nút Gặp của game chưa khả dụng."; return; }
      if (episode.pending) message = "Đã yêu cầu gặp kỳ ngộ; chờ xác nhận.";
      if (episode.attempts >= 2 || now - episode.lastAttempt < 5000 || manualForCurrent) return;
      // Re-read the snapshot immediately before invoking the one native button path.
      const fresh = scene.self?.kt?.kyngo, latestTime = scene.now();
      if (sceneNow() !== scene || identity(scene) !== binding.identity || !validConnection(scene) || blocked(scene)
          || !fresh || !same(episode, fresh) || !finite(fresh.left) || fresh.left <= 0
          || !finite(scene.selfAt) || scene.selfAt <= binding.freshAfter || !finite(latestTime)
          || latestTime < scene.selfAt || latestTime - scene.selfAt > 2
          || fresh.left - 1 - (latestTime - scene.selfAt) <= 0 || performance.now() >= episode.deadline
          || fresh.s !== scene.map.scene || button(scene) !== go) return;
      episode.attempts++; episode.lastAttempt = performance.now(); episode.pending = true;
      message = "Đã yêu cầu gặp kỳ ngộ; chờ xác nhận.";
      go.click();
    } catch { message = "Kỳ ngộ: giao diện game chưa khả dụng."; }
  }
  function attach(scene) {
    if (!enabled || suspended) { detach(); return; }
    if (binding?.scene === scene && sceneNow() === scene && scene?.sys?.isActive?.()) return;
    detach();
    if (!scene?.events?.on || !scene.events.off || !scene.sys?.isActive?.() || !identity(scene)) {
      message = "Kỳ ngộ: đang chờ scene và nhân vật."; return;
    }
    binding = { scene, identity: identity(scene), freshAfter: finite(scene.selfAt) ? scene.selfAt : -Infinity };
    lastTick = -Infinity;
    scene.events.on("preupdate", tick); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmEncounter = {
    configure(scene, value) {
      const next = value.autoEncounter === true;
      if (enabled !== next) { enabled = next; detach(); }
      attach(scene);
    },
    attach,
    status(scene) {
      if (!enabled || !scene || sceneNow() !== scene) return "";
      if (!binding || binding.scene !== scene || identity(scene) !== binding.identity) return "Kỳ ngộ: đang chờ scene.";
      return message;
    }
  };
  document.addEventListener("click", manual, true);
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; attach(sceneNow()); });
})();
