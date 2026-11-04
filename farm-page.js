(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const channel = "gst:farm:v1";
  const baseRadius = 11;
  globalThis.GSTFarmConfigurationReady = false;
  let settings = { enabled: false, radius: 22, autoRespawn: true, targetMode: "all", targetLevel: 1, targetMinLevel: 1, targetMaxLevel: 20,
    idleMode: "hold", avoidEnabled: false, avoidLevel: 10, avoidDistance: 2 };
  let filterBinding = null;
  let death = null;
  let respawnMessage = "";
  let watcher = null;
  let session = null;
  let blockedAuto = null;
  let revival = null;
  let suspended = false;
  let shortcut = null;
  let shortcutMessage = "";
  let message = "Extended range disabled.";
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  GSTHarvest.farmOrigin = (scene) => session?.scene === scene ? { ...session.home } : null;
  // Both features share the same once-per-death request state.
  GSTHarvest.respawn = (scene) => checkRespawn(scene, true);
  const targetMode = (value) => value === "level" ? "maxLevel"
    : ["maxLevel", "minLevel", "range", "boss"].includes(value) ? value : "all";
  function filterLabel() {
    if (settings.targetMode === "boss") return "Chỉ farm boss";
    if (settings.targetMode === "maxLevel") return `Chỉ farm level ≤ ${settings.targetLevel}`;
    if (settings.targetMode === "minLevel") return `Chỉ farm level ≥ ${settings.targetLevel}`;
    if (settings.targetMode === "range") return settings.targetMinLevel <= settings.targetMaxLevel
      ? `Chỉ farm level ${settings.targetMinLevel}–${settings.targetMaxLevel}` : "Khoảng level chưa hợp lệ; không chọn quái";
    return "Farm tất cả quái";
  }
  function matchesTarget(enemy) {
    if (settings.avoidEnabled && (!finite(enemy?.lv) || enemy.lv >= settings.avoidLevel)) return false;
    if (settings.targetMode === "boss") return enemy?.cls === "boss" || enemy?.wb === true;
    if (settings.targetMode === "all") return true;
    if (!finite(enemy?.lv)) return false;
    if (settings.targetMode === "range") return enemy.lv >= settings.targetMinLevel && enemy.lv <= settings.targetMaxLevel;
    return settings.targetMode === "maxLevel" ? enemy.lv <= settings.targetLevel : enemy.lv >= settings.targetLevel;
  }

  function sceneNow() {
    return window.game?.scene?.getScene?.("world")
      ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  }

  function guardFarmKey(event) {
    let code = 86;
    let scene = null;
    try {
      scene = sceneNow();
      const binding = scene?.controls?.bindings?.V;
      if (Number.isInteger(binding)) code = binding;
    } catch { /* The default V binding remains guarded while the scene loads. */ }
    // Let the game's focused key-binding capture validate and assign this key.
    // Background events still pass through the guard below.
    if (scene?.keyCapture && !document.hidden && document.hasFocus()) return;
    const customKey = shortcut !== null && event.keyCode === shortcut;
    if (event.keyCode !== code && !customKey) return;
    const editing = [document.activeElement, ...event.composedPath()].some((node) =>
      node instanceof HTMLElement && (node.isContentEditable
        || node.matches("input, textarea, select, [role='textbox']")));
    const ignored = document.hidden || !document.hasFocus() || editing || event.isComposing
      || event.repeat || event.ctrlKey || event.altKey || event.metaKey || !event.isTrusted
      || (shortcut !== null && event.shiftKey);
    if (ignored) {
      // Block background/editing events without cancelling normal text entry.
      event.stopImmediatePropagation();
      return;
    }
    // With no exposed scene, keep the game's focused native binding usable.
    // Otherwise handle the native binding here too, so Phaser cannot queue a
    // toggle for a later update after the tab loses focus.
    if (shortcut === null && typeof scene?.toggleAutoFarm !== "function") return;
    event.stopImmediatePropagation();
    if (shortcut !== null && !customKey) return;
    event.preventDefault();
    const conflict = Object.entries(scene?.controls?.bindings ?? {})
      .some(([action, binding]) => action !== "V" && binding === shortcut);
    if (conflict) {
      shortcutMessage = "Phím tùy chỉnh trùng thao tác khác trong game. Hãy chọn phím khác (ví dụ F6).";
      return;
    }
    if (!scene?.sys?.isActive?.() || typeof scene.toggleAutoFarm !== "function" || !scene.self) {
      shortcutMessage = "Chưa truy cập được Auto Farm; cần tải game với tham số timer.";
      return;
    }
    if (scene.chat?.typing || scene.keyCapture || (!scene.auto?.on
        && (scene.self.dead || scene.uiBlocked || !connected(scene)))) return;
    shortcutMessage = "";
    globalThis.GSTFarmRevivePolicy?.attach(scene);
    globalThis.GSTFarmBehavior?.attach(scene);
    const previousAuto = scene.auto;
    const wasOn = previousAuto?.on;
    if (wasOn === false && session) stop("Đã kết thúc phiên hỗ trợ cũ trước khi bật lại Auto Farm.");
    if (globalThis.GSTFarmDiagnostics) GSTFarmDiagnostics.toggleByUser(scene);
    else scene.toggleAutoFarm();
    if (wasOn === false && scene.auto === previousAuto && scene.auto.on) {
      // An explicit new session must not inherit the old extension block or
      // native navigation failure counters left behind by native toggle().
      blockedAuto = null;
      revival = null;
      const time = typeof scene.now === "function" ? scene.now() : NaN;
      if (compatible(scene) && finite(time) && finite(scene.px) && finite(scene.py)) {
        Object.assign(scene.auto, { moved: false, lastX: scene.px, lastY: scene.py,
          stillSince: time, chaseSince: time, sideUntil: time, sideX: 0, sideY: 0, stuckCount: 0 });
        scene.auto.reachable.clear();
      }
      watch();
      discover();
    }
  }
  window.addEventListener("keydown", guardFarmKey, true);

  function connected(scene) {
    const driver = scene.driver;
    return !!driver && !driver.closing && !driver.reconnecting && !driver.displaced
      && (driver.online === false || (typeof driver.link?.open === "function" && driver.link.open()));
  }

  function compatible(scene) {
    const auto = scene?.auto;
    return scene?.sys?.isActive?.() && typeof scene.autoHost === "function"
      && typeof scene.now === "function" && typeof scene.events?.on === "function"
      && typeof scene.events?.off === "function" && typeof auto?.on === "boolean"
      && finite(auto.ax) && finite(auto.ay) && finite(auto.think)
      && Array.isArray(auto.path) && auto.skipped instanceof Map && auto.reachable instanceof Map
      && typeof auto.pick === "function" && typeof auto.target === "number"
      && finite(auto.pauseUntil) && typeof auto.resting === "boolean";
  }

  function nativeWaitReason(scene) {
    if (!scene?.auto?.on || !scene.self) return "";
    if (!connected(scene)) return "Auto Farm đã bật nhưng đang chờ kết nối game.";
    if (scene.self.dead) return "Nhân vật đã chết; chờ hồi sinh.";
    if (scene.leaving) return "Đang chuyển map; chờ scene ổn định.";
    if (scene.keyCapture) return "Đang đặt phím trong game; kết thúc đặt phím để tiếp tục.";
    if (scene.pendingSkill || scene.aiming) return "Đang chờ/ngắm chiêu tay; kết thúc hoặc hủy ngắm để farm tiếp.";
    if (scene.self.med && !scene.auto.resting) return "Game vẫn ghi nhận đang bế quan; chờ game xác nhận thoát bế quan để farm tiếp.";
    if (scene.auto.resting) return "Auto Farm đang rút lui/hồi máu; chưa tiếp tục tìm quái.";
    if (globalThis.GSTFarmBehavior?.controls(scene)) return globalThis.GSTFarmBehavior.status(scene);
    if (GSTHarvest.controls(scene)) return "Đang nhường di chuyển cho Tự hái.";
    if (globalThis.GSTRealm?.controls(scene)) return "Đang nhường di chuyển để tới/vào bí cảnh.";
    if (globalThis.GSTFarmSeals?.controls(scene)) return "Đang nhường di chuyển để phá phong ấn.";
    if (scene.chat?.typing || scene.inputFieldActive?.()) return "Đang mở chat/ô nhập; phần mở rộng tìm quái đang chờ.";
    if (scene.panels?.open || scene.overlay?.dialogOpen || scene.uiBlocked) return "Giao diện game đang mở; đóng bảng/hộp thoại nếu farm chưa tiếp tục.";
    if (typeof scene.now === "function" && scene.now() < scene.auto.pauseUntil) return "Đang tạm dừng sau lệnh di chuyển tay; chờ hết khoảng nghỉ của game.";
    return "";
  }

  function owned(s) {
    return s.auto.ax === s.center.x && s.auto.ay === s.center.y;
  }

  function clearFilter() {
    const binding = filterBinding;
    filterBinding = null;
    if (!binding) return;
    binding.scene.events.off("shutdown", clearFilter);
    binding.scene.events.off("destroy", clearFilter);
    if (binding.scene.autoHost !== binding.wrapper) return;
    if (binding.descriptor) Object.defineProperty(binding.scene, "autoHost", binding.descriptor);
    else delete binding.scene.autoHost;
  }

  function syncFilter(scene) {
    if (settings.targetMode === "all" && !settings.avoidEnabled) { clearFilter(); return; }
    if (filterBinding?.scene === scene && scene.autoHost === filterBinding.wrapper) return;
    clearFilter();
    const original = scene.autoHost;
    if (typeof original !== "function") throw new Error("Auto Farm host unavailable.");
    if (typeof original.call(scene)?.enemies !== "function") throw new Error("Enemy list unavailable.");
    const descriptor = Object.getOwnPropertyDescriptor(scene, "autoHost");
    const wrapper = function (...args) {
      const host = original.apply(this, args);
      if ((settings.targetMode === "all" && !settings.avoidEnabled) || !this.auto?.on) return host;
      return { ...host, enemies: () => {
        const enemies = typeof host?.enemies === "function" ? host.enemies() : [];
        if (this.auto?.resting) return Array.isArray(enemies) ? enemies : [];
        // Use only the native host's level/boss metadata, never names or HP guesses.
        return Array.isArray(enemies) ? enemies.filter((enemy) => matchesTarget(enemy)
          && (globalThis.GSTFarmBehavior?.allowsTarget(this, enemy) ?? true)) : [];
      } };
    };
    scene.autoHost = wrapper;
    filterBinding = { scene, descriptor, wrapper };
    scene.events.on("shutdown", clearFilter);
    scene.events.on("destroy", clearFilter);
  }

  function center(s, point) {
    if (s.auto.ax === point.x && s.auto.ay === point.y) return;
    s.auto.ax = point.x;
    s.auto.ay = point.y;
    s.auto.think = 0; // Reconsider the area; skill/pill cooldowns are untouched.
    s.center = { ...point };
  }

  function restore(s) {
    // A manual V toggle or movement may have already supplied a new center.
    if (owned(s)) center(s, s.home);
  }

  function stop(reason, block = false) {
    // Keep the inert filter attached through death/off so the next native
    // update after revival/re-enable cannot select an unfiltered target.
    if (block || (settings.targetMode === "all" && !settings.avoidEnabled)) clearFilter();
    if (block) revival = null;
    if (session) {
      const old = session;
      session = null;
      old.scene.events.off("preupdate", onFrame);
      old.scene.events.off("shutdown", onShutdown);
      old.scene.events.off("destroy", onShutdown);
      restore(old);
      if (block) blockedAuto = old.auto;
    }
    message = reason;
    watch();
  }

  function onShutdown() {
    stop("Scene ended; extended range stopped.", true);
  }

  function checkRespawn(scene, harvestRequest = false) {
    if (!scene?.self || !scene.sys?.isActive?.() || scene.leaving || !connected(scene)) return "Chờ kết nối và scene ổn định để hồi sinh.";
    if (!scene.self.dead) {
      death = null;
      respawnMessage = "";
      return;
    }
    if (!death || death.scene !== scene) death = { scene, requested: false };
    if (!settings.autoRespawn && !harvestRequest) return;
    if (!harvestRequest && !scene.auto?.on) return;
    if ([...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
      el.getClientRects().length && getComputedStyle(el).visibility !== "hidden")) return "Chờ bạn xử lý hộp kiểm tra người chơi trước khi hồi sinh.";
    const button = scene.hud?.deathBtn;
    if (!(button instanceof HTMLButtonElement) || !button.isConnected
        || scene.hud?.death?.style.display === "none") {
      respawnMessage = "Revive button unavailable; waiting for game UI.";
      return "Chờ game hiển thị nút hồi sinh.";
    }
    if (button.disabled) {
      respawnMessage = "Waiting for the game's revival countdown.";
      return "Chờ hết thời gian hồi sinh của game.";
    }
    if (death.requested) {
      respawnMessage = "Revive clicked once; waiting for the game. Manual retry is available.";
      return "Đã bấm hồi sinh một lần; chờ game xác nhận. Có thể thử lại bằng tay nếu cần.";
    }
    // The built-in farm retries every 2 seconds. Do not duplicate its pending attempt.
    if (scene.auto?.on && finite(scene.auto.reviveTry) && scene.auto.reviveTry > scene.now()) {
      respawnMessage = "Built-in Auto Farm already requested revival; waiting.";
      return "Auto Farm đang xử lý hồi sinh; chờ game.";
    }
    death.requested = true;
    button.click();
    respawnMessage = "Clicked the game's ready revive button; waiting for confirmation.";
    return "Đã bấm hồi sinh; chờ game xác nhận rồi tiếp tục Tự hái.";
  }

  function ensureFlying(s, time) {
    if (s.scene.self.fly) {
      s.groundedAt = null;
      s.flightRequestedAt = null;
      return true;
    }
    if (s.flightRequestedAt !== null) {
      message = time - s.flightRequestedAt < 8
        ? "Waiting for the game to confirm flight; no repeated toggle sent."
        : "Flight not confirmed. Check game conditions or press R; no repeated toggle sent.";
      return false;
    }
    if (typeof s.scene.act !== "function") {
      message = "Flight action unavailable. Enable flight with the game's control.";
      return false;
    }
    if (s.groundedAt === null) s.groundedAt = time;
    if (time - s.groundedAt < 1) {
      message = "Preparing to enable flight for Auto Farm.";
      return false;
    }
    // The native R action is a toggle. Send once per grounded episode and wait
    // for self.fly; never write fly, synthesize a key or resend an unacked toggle.
    s.flightRequestedAt = time;
    s.scene.act("fly");
    message = "Flight requested through the game's action; waiting for confirmation.";
    return false;
  }

  function watch() {
    if ((settings.enabled || settings.autoRespawn || settings.targetMode !== "all") && !suspended && !session && watcher === null) {
      watcher = setInterval(discover, 1000);
    }
  }

  function discover() {
    if ((!settings.enabled && !settings.autoRespawn && settings.targetMode === "all") || suspended || session) return;
    try {
      const scene = sceneNow();
      globalThis.GSTFarmRevivePolicy?.attach(scene);
      globalThis.GSTFarmBehavior?.attach(scene);
      globalThis.GSTFarmDiagnostics?.attach(scene);
      checkRespawn(scene);
      if (!settings.enabled && settings.targetMode === "all" && !settings.avoidEnabled) return;
      if (compatible(scene) && scene.self && !scene.leaving
          && connected(scene) && scene.auto !== blockedAuto) syncFilter(scene);
      else clearFilter();
      if (revival && (revival.scene !== scene || revival.auto !== scene?.auto)) revival = null;
      if (!scene?.auto?.on) {
        revival = null;
        if (scene?.auto === blockedAuto) blockedAuto = null;
        message = "Waiting for built-in Auto Farm; press its configured shortcut in the game.";
        return;
      }
      if (!compatible(scene)) {
        message = "Auto Farm interface unsupported; no changes made.";
        return;
      }
      if (scene.auto === blockedAuto) return;
      if (!scene.self || scene.leaving || !connected(scene)) {
        revival = null;
        blockedAuto = scene.auto;
        message = "Player/connection unavailable. Toggle Auto Farm off/on after recovery.";
        return;
      }
      if (scene.self.dead) {
        revival = { scene, auto: scene.auto, aliveAt: null };
        message = "Player dead; waiting for the game's revival. No flight request sent.";
        return;
      }
      if (revival) {
        // Give the native death/revive handler time to stop Auto Farm if needed.
        if (scene.auto.deadAt > 0) {
          revival.aliveAt = null;
          message = "Waiting for built-in Auto Farm to finish revival handling.";
          return;
        }
        if (revival.aliveAt === null) revival.aliveAt = performance.now();
        if (performance.now() - revival.aliveAt < 2000) {
          message = "Revived; waiting 2 seconds before checking flight and resuming range.";
          return;
        }
        revival = null;
      }
      const point = { x: scene.auto.ax, y: scene.auto.ay };
      session = { scene, auto: scene.auto, home: point, center: { ...point }, at: -Infinity,
        reanchor: false, groundedAt: null, flightRequestedAt: null };
      clearInterval(watcher);
      watcher = null;
      scene.events.on("preupdate", onFrame);
      scene.events.on("shutdown", onShutdown);
      scene.events.on("destroy", onShutdown);
      message = "Extended range active.";
    } catch {
      message = "Waiting for an accessible world scene.";
    }
  }

  function onFrame() {
    const s = session;
    if (!s) return;
    try {
      if (sceneNow() !== s.scene || s.scene.auto !== s.auto || !compatible(s.scene)) {
        stop("Scene or Auto Farm changed; stopped.", true);
        return;
      }
      if (!s.auto.on) {
        stop("Built-in Auto Farm is off.");
        return;
      }
      if (!s.scene.self || s.scene.leaving || !connected(s.scene)) {
        stop("Stopped for disconnect or scene exit. Toggle Auto Farm off/on after recovery.", true);
        return;
      }
      if (s.scene.self.dead) {
        checkRespawn(s.scene);
        revival = { scene: s.scene, auto: s.auto, aliveAt: null };
        stop("Player dead; extended range paused until revival.");
        return;
      }
      const time = s.scene.now();
      globalThis.GSTFarmBehavior?.attach(s.scene);
      syncFilter(s.scene);
      if (globalThis.GSTFarmBehavior?.controls(s.scene)) {
        message = globalThis.GSTFarmBehavior.status(s.scene);
        return;
      }
      if (GSTHarvest.controls(s.scene)) {
        message = "Tạm nhường di chuyển cho Tự hái; giữ nguyên tâm farm.";
        return;
      }
      if (globalThis.GSTFarmSeals?.controls(s.scene)) {
        message = "Đang hỗ trợ phá phong ấn; giữ nguyên tâm và mục tiêu boss.";
        return;
      }
      if (globalThis.GSTRealm?.controls(s.scene)) {
        message = "Tạm nhường di chuyển để tới cổng bí cảnh; giữ nguyên tâm farm.";
        return;
      }
      if (!finite(time) || time - s.at < 0.5) return;
      s.at = time;
      const host = s.scene.autoHost();
      if (!settings.enabled) {
        message = `${filterLabel()}; dùng bán kính gốc của game.`;
        return;
      }
      if (!["enemies", "pos", "clear", "route", "inCombat", "level", "loot", "meditating"]
        .every((key) => typeof host?.[key] === "function")) {
        stop("Auto Farm host interface unsupported; stopped.", true);
        return;
      }
      if (s.auto.moved || time < s.auto.pauseUntil) {
        restore(s);
        s.reanchor = true;
        message = "Paused for manual movement.";
        return;
      }
      if (s.reanchor || !owned(s)) {
        s.home = { x: s.auto.ax, y: s.auto.ay };
        s.center = { ...s.home };
        s.reanchor = false;
      }
      if (s.auto.resting || host.meditating() || s.scene.pendingSkill || s.scene.aiming || s.scene.uiBlocked) {
        s.groundedAt = null;
        message = "Waiting for built-in healing, skill or UI handling.";
        return;
      }
      if (!ensureFlying(s, time)) return;
      const position = host.pos();
      const enemies = host.enemies();
      if (!Array.isArray(position) || !position.every(finite) || position.length !== 2 || !Array.isArray(enemies)) {
        stop("Invalid Auto Farm runtime data; stopped.", true);
        return;
      }
      const pos = { x: position[0], y: position[1] };
      const eligible = enemies.filter((enemy) => finite(enemy?.id) && finite(enemy.x) && finite(enemy.y)
        && !enemy.dead && enemy.hostile && distance(enemy, s.home) < settings.radius
        && !(s.auto.skipped.has(enemy.id) && s.auto.skipped.get(enemy.id) > time));
      // Match the built-in skipped expiry without deleting its records ourselves.
      const candidates = eligible.filter((enemy) => !s.auto.skipped.has(enemy.id));
      const target = candidates.find((enemy) => enemy.id === s.auto.target);
      if (target) {
        if (distance(target, s.center) >= baseRadius - 0.5) shiftToward(s, target);
        message = "Keeping the built-in target.";
        return;
      }
      const local = candidates.filter((enemy) => distance(enemy, s.center) < baseRadius);
      const aggro = host.inCombat() ? local.filter((enemy) => enemy.aggro && distance(enemy, pos) < 3.2) : [];
      // Use the game's picker, including its reachability cache and skip backoff.
      if (local.length && s.auto.pick(host, time, local, aggro, pos.x, pos.y)) {
        message = "Built-in Auto Farm has local targets.";
        return;
      }
      // Let idle() collect its pending local loot before moving the search center.
      if (host.loot().some((loot) => finite(loot.x) && finite(loot.y)
          && distance(loot, s.center) < baseRadius
          && !(s.auto.lootSkip?.has(`${loot.x.toFixed(1)},${loot.y.toFixed(1)}`)))) {
        message = "Waiting for built-in loot collection.";
        return;
      }
      const remote = candidates.filter((enemy) => !s.auto.skipped.has(enemy.id))
        .sort((a, b) => distance(a, pos) - distance(b, pos));
      let next = null;
      for (const enemy of remote.slice(0, 4)) {
        if (s.auto.pick(host, time, [enemy], [], pos.x, pos.y)) {
          next = enemy;
          break;
        }
      }
      if (next) {
        shiftToward(s, next);
        message = "Search center extended; built-in Auto Farm will choose/pursue a target.";
      } else {
        center(s, s.home);
        message = settings.idleMode === "hold" ? "Không có quái phù hợp; nhặt đồ rồi đứng chờ trong vùng farm."
          : "Không có quái phù hợp; Auto Farm quay về tâm farm gốc.";
      }
    } catch {
      stop("Auto Farm interface error; extended range stopped.", true);
    }
  }

  function shiftToward(s, enemy) {
    const length = distance(enemy, s.home);
    // Keep the entire built-in 11-unit circle inside the configured home radius.
    const shift = Math.min(length, settings.radius - baseRadius);
    const point = length > 0 ? {
      x: s.home.x + (enemy.x - s.home.x) / length * shift,
      y: s.home.y + (enemy.y - s.home.y) / length * shift
    } : s.home;
    if (distance(point, s.center) > 0.25 || distance(enemy, s.center) >= baseRadius) center(s, point);
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== channel) return;
    const data = event.data;
    if (data.type === "shortcut" && (data.code === null || Number.isInteger(data.code)
        && ((data.code >= 48 && data.code <= 57) || (data.code >= 65 && data.code <= 90)
          || (data.code >= 112 && data.code <= 121 && data.code !== 116)))) {
      shortcut = data.code;
      shortcutMessage = "";
    }
    if (data.type === "configure" && typeof data.enabled === "boolean"
        && finite(data.radius) && data.radius >= 11 && data.radius <= 100) {
      const filterChanged = settings.targetMode !== targetMode(data.targetMode)
        || settings.targetLevel !== data.targetLevel
        || settings.targetMinLevel !== data.targetMinLevel || settings.targetMaxLevel !== data.targetMaxLevel
        || settings.avoidEnabled !== (data.avoidEnabled === true) || settings.avoidLevel !== data.avoidLevel;
      settings = { enabled: data.enabled, radius: data.radius, autoRespawn: true,
        targetMode: targetMode(data.targetMode),
        targetLevel: Number.isSafeInteger(data.targetLevel) && data.targetLevel > 0 ? data.targetLevel : 1,
        targetMinLevel: Number.isSafeInteger(data.targetMinLevel) && data.targetMinLevel > 0 ? data.targetMinLevel : 1,
        targetMaxLevel: Number.isSafeInteger(data.targetMaxLevel) && data.targetMaxLevel > 0 ? data.targetMaxLevel : 20,
        idleMode: data.idleMode === "home" ? "home" : "hold", avoidEnabled: data.avoidEnabled === true,
        avoidLevel: Number.isSafeInteger(data.avoidLevel) && data.avoidLevel > 0 ? data.avoidLevel : 10,
        avoidDistance: finite(data.avoidDistance) ? Math.max(1, Math.min(6, data.avoidDistance)) : 2 };
      globalThis.GSTFarmBehavior?.configure(sceneNow(), settings);
      globalThis.GSTFarmDiagnostics?.attach(sceneNow());
      globalThis.GSTFarmRevivePolicy?.attach(sceneNow());
      if (settings.targetMode === "all" && !settings.avoidEnabled) clearFilter();
      if (session) {
        syncFilter(session.scene);
        if (filterChanged) session.auto.think = 0;
        if (!settings.enabled) restore(session);
      }
      if (!settings.autoRespawn) respawnMessage = "";
      if (!settings.enabled && settings.targetMode === "all" && !settings.avoidEnabled) {
        if (watcher !== null) clearInterval(watcher);
        watcher = null;
        stop("Extended range disabled; original center restored where owned.");
        blockedAuto = null;
        revival = null;
      } else {
        watch();
        discover();
      }
      globalThis.GSTFarmConfigurationReady = true;
    }
    if (data.type === "status") {
      let autoOn = null;
      let dead = null;
      let waitReason = "";
      try {
        const scene = sceneNow();
        if (typeof scene?.auto?.on === "boolean") autoOn = scene.auto.on;
        if (scene?.self) dead = !!scene.self.dead;
        waitReason = nativeWaitReason(scene);
      } catch { /* Read-only status must not start or restart gameplay. */ }
      window.postMessage({ channel: "gst:farm-status:v1", requestId: data.requestId,
        message: (settings.targetMode !== "all" ? `${filterLabel()}. ` : "") + (shortcutMessage
          || (dead && respawnMessage ? respawnMessage : (waitReason || globalThis.GSTFarmBehavior?.status(sceneNow())
            || globalThis.GSTFarmSession?.status(sceneNow()) || globalThis.GSTFarmSeals?.status(sceneNow()) || message))),
        autoOn, dead, active: session !== null, radius: settings.radius }, origin);
    }
  });
  window.addEventListener("pagehide", () => {
    window.removeEventListener("keydown", guardFarmKey, true);
    suspended = true;
    death = null;
    revival = null;
    respawnMessage = "";
    if (watcher !== null) clearInterval(watcher);
    watcher = null;
    clearFilter();
    // A BFCache pause is not a disconnect: retain any existing disconnect
    // block, but do not create one for the healthy session being suspended.
    stop("Page left; extended range stopped.");
  });
  window.addEventListener("pageshow", () => {
    window.addEventListener("keydown", guardFarmKey, true);
    suspended = false;
    watch();
    discover();
  });
  window.postMessage({ channel: "gst:farm-status:v1", ready: true }, origin);
})();
