(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const channel = "gst:farm:v1";
  globalThis.GSTFarmConfigurationReady = false;
  let settings = { policyMode: "native", enabled: false, radius: 22, autoRespawn: true, autoMeditate: true, targetMode: "all", targetLevel: 1, targetMinLevel: 1, targetMaxLevel: 20,
    searchScope: "radius", idleMode: "hold", preferLoot: true, excludeBoss: false,
    bossDodge: true, eliteDodge: false, bossRetreat: true, retreatHpPercent: 40, recoveryHpPercent: 100 };
  let filterBinding = null;
  let excludedBossChange = null;
  let death = null;
  let respawnMessage = "";
  let watcher = null;
  let session = null;
  let blockedAuto = null;
  let revival = null;
  let suspended = false;
  let shortcut = null;
  let shortcutMessage = "";
  let message = "Chưa nhận được cấu hình Auto Farm từ extension.";
  let configurationError = "";
  let configurationReceived = false;
  let activationLock = null;
  let activationWatcher = null;
  const finite = (value) => typeof value === "number" && Number.isFinite(value);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const nativeEligible = (enemy) => enemy?.hostile === true || enemy?.aggro === false;
  const nativeRadius = (scene) => globalThis.GSTFarmCompatibility?.nativeRadius(scene?.auto?.radius) ?? null;
  const nativeMapKey = (host) => {
    try { return typeof host?.mapKey === "function" ? host.mapKey() : null; }
    catch { return null; }
  };
  GSTHarvest.farmOrigin = (scene) => session?.scene === scene ? { ...session.home } : null;
  // Both features share the same once-per-death request state.
  GSTHarvest.respawn = (scene) => checkRespawn(scene, true);
  GSTHarvest.autoRespawnEnabled = () => settings.autoRespawn;
  const targetMode = (value) => value === "level" ? "maxLevel" : value === "bossFirst" ? "bossLevel"
    : ["maxLevel", "minLevel", "range", "boss", "bossLevel", "highLevel", "lowLevel"].includes(value) ? value : "all";
  const isBoss = (enemy) => globalThis.GSTFarmMonsterClassification
    ? globalThis.GSTFarmMonsterClassification.isBoss(enemy) === true
    : enemy?.cls === "boss" || enemy?.wb === true;
  const ranked = () => ["bossLevel", "highLevel", "lowLevel"].includes(settings.targetMode);
  function comparePriority(a, b) {
    if (settings.targetMode === "bossLevel" && isBoss(a) !== isBoss(b)) return isBoss(a) ? -1 : 1;
    const descending = settings.targetMode !== "lowLevel";
    const left = finite(a?.lv) ? a.lv : descending ? -Infinity : Infinity;
    const right = finite(b?.lv) ? b.lv : descending ? -Infinity : Infinity;
    return left === right ? 0 : descending ? (left > right ? -1 : 1) : (left < right ? -1 : 1);
  }
  function switchReason(current, challenger, pos, elapsed) {
    if (!ranked() || !current || !challenger || comparePriority(challenger, current) >= 0) return "";
    if (settings.targetMode === "bossLevel" && isBoss(challenger) && !isBoss(current)) return "boss_priority";
    const gain = settings.targetMode === "lowLevel" ? current.lv - challenger.lv : challenger.lv - current.lv;
    // Allow a substantially better camp when it is nearby, but never turn
    // around for a distant respawn after already committing to a long trip.
    const challengerDistance = distance(challenger, pos);
    return finite(gain) && gain >= 4 && elapsed >= 2
      && challengerDistance <= 20 && challengerDistance <= distance(current, pos) + 3
      ? "level_priority" : "";
  }
  function realmBossEligible(scene) {
    if (settings.policyMode !== "extended") return true;
    if (settings.excludeBoss || ["highLevel", "lowLevel"].includes(settings.targetMode)) return false;
    const levelRequired = ["maxLevel", "minLevel", "range"].includes(settings.targetMode);
    if (!levelRequired) return true;
    // A boss hidden by the level filter is not a reason to block chest
    // collection. Unknown levels are not treated as confirmed eligible.
    const actors = [...(scene?.views?.values?.() ?? [])]
      .filter((actor) => actor?.k === "m" && !actor.dead && isBoss(actor.st)
        && finite(actor.st?.lv));
    const level = scene?.self?.realm?.inside?.boss?.lv;
    return actors.some((actor) => matchesTarget(actor.st))
      || (finite(level) && matchesTarget({ cls: "boss", lv: level }));
  }
  globalThis.GSTFarmPriority = { compare: (a, b) => settings.policyMode !== "extended" ? 0 : comparePriority(a, b),
    ranked: () => settings.policyMode === "extended" && ranked(),
    switchReason: (...args) => settings.policyMode !== "extended" ? "" : switchReason(...args),
    matches: (enemy) => settings.policyMode !== "extended" || matchesTarget(enemy),
    excludesBoss: () => settings.policyMode === "extended" && (settings.excludeBoss || ["highLevel", "lowLevel"].includes(settings.targetMode)),
    realmBossEligible,
    bossFocus: (scene) => settings.policyMode === "extended" && ["boss", "bossLevel"].includes(settings.targetMode)
      && realmBossEligible(scene) };
  function filterLabel() {
    if (settings.targetMode === "bossLevel") return "Ưu tiên boss, rồi quái tu vi cao đến thấp";
    if (settings.targetMode === "highLevel") return "Ưu tiên quái thường tu vi cao đến thấp";
    if (settings.targetMode === "lowLevel") return "Ưu tiên quái thường tu vi thấp đến cao";
    if (settings.targetMode === "boss") return "Chỉ farm boss";
    if (settings.targetMode === "maxLevel") return `Chỉ farm ≤ ${globalThis.GSTFarmCompatibility?.describe(settings.targetLevel, "max") ?? "Mức đã lưu (giữ nguyên)"}`;
    if (settings.targetMode === "minLevel") return `Chỉ farm ≥ ${globalThis.GSTFarmCompatibility?.describe(settings.targetLevel, "min") ?? "Mức đã lưu (giữ nguyên)"}`;
    if (settings.targetMode === "range") return settings.targetMinLevel <= settings.targetMaxLevel
      ? `Chỉ farm trong khoảng ${globalThis.GSTFarmCompatibility?.describe(settings.targetMinLevel, "min") ?? "Mức đã lưu (giữ nguyên)"} đến ${globalThis.GSTFarmCompatibility?.describe(settings.targetMaxLevel, "max") ?? "Mức đã lưu (giữ nguyên)"}`
      : "Khoảng cảnh giới chưa hợp lệ; không chọn quái";
    return "Farm tất cả quái";
  }
  function matchesTarget(enemy) {
    if (settings.policyMode !== "extended") return true;
    if ((settings.excludeBoss || settings.targetMode === "highLevel" || settings.targetMode === "lowLevel") && isBoss(enemy)) return false;
    if (settings.targetMode === "boss") return isBoss(enemy);
    if (["all", "bossLevel", "highLevel", "lowLevel"].includes(settings.targetMode)) return true;
    if (!finite(enemy?.lv)) return false;
    if (settings.targetMode === "range") return enemy.lv >= settings.targetMinLevel && enemy.lv <= settings.targetMaxLevel;
    return settings.targetMode === "maxLevel" ? enemy.lv <= settings.targetLevel : enemy.lv >= settings.targetLevel;
  }

  function sceneNow() {
    return window.game?.scene?.getScene?.("world")
      ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  }

  function clearActivationLock() {
    const old = activationLock; activationLock = null;
    if (!old) return;
    if (old.auto.toggle === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.auto, "toggle", old.descriptor);
      else delete old.auto.toggle;
    }
  }
  function needsActivationTracking() {
    return settings.policyMode === "disabled"
      || globalThis.GSTMeditation?.wantsFarmActivationObserver?.() === true;
  }
  function maintainActivationLock() {
    if (!needsActivationTracking()) { clearActivationLock(); return; }
    const scene = sceneNow();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.on !== "boolean"
        || typeof scene.auto?.toggle !== "function" || typeof scene.toggleAutoFarm !== "function") return;
    if (activationLock?.scene !== scene || activationLock.auto !== scene.auto
        || scene.auto.toggle !== activationLock.wrapper) {
      clearActivationLock();
      const original = scene.auto.toggle;
      const descriptor = Object.getOwnPropertyDescriptor(scene.auto, "toggle");
      const owner = { scene, auto: scene.auto, original, descriptor, stopRequested: false };
      owner.wrapper = function (...args) {
        if (settings.policyMode === "disabled" && this.on === false) {
          message = "Auto Farm đang bị khóa bởi chế độ Disabled. Hãy đổi chế độ rồi bật lại bằng tay.";
          return undefined;
        }
        const wasOn = this.on === true;
        const result = original.apply(this, args);
        if (!wasOn && this.on === true) globalThis.GSTMeditation?.farmStarted?.(scene);
        return result;
      };
      try { scene.auto.toggle = owner.wrapper; }
      catch {
        message = "Không nhận diện được controller Auto Farm để áp khóa Disabled.";
        return;
      }
      activationLock = owner;
    }
    const owner = activationLock;
    if (scene.auto.on && !owner.stopRequested) {
      owner.stopRequested = true;
      if (settings.policyMode === "disabled") {
        // The lock is installed first; this is the single native OFF request.
        scene.toggleAutoFarm();
      } else globalThis.GSTMeditation?.farmStarted?.(scene);
    }
  }
  function syncActivationTracking() {
    if (needsActivationTracking()) {
      maintainActivationLock();
      if (activationWatcher === null) activationWatcher = setInterval(maintainActivationLock, 500);
    } else {
      clearActivationLock();
      clearInterval(activationWatcher); activationWatcher = null;
    }
  }
  globalThis.GSTFarmActivation = Object.freeze({ sync: syncActivationTracking });

  function guardFarmKey(event) {
    if (settings.policyMode === "native") return;
    if (document.getElementById("gst-game-menu")?.dataset.open === "true") return;
    // Alt shortcuts (including configurable Harvest) belong to their own handlers.
    if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) return;
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
    if (shortcut === null && typeof scene?.toggleAutoFarm !== "function"
        && settings.policyMode !== "disabled") return;
    event.stopImmediatePropagation();
    if (shortcut !== null && !customKey && settings.policyMode !== "disabled") return;
    event.preventDefault();
    const conflict = customKey && Object.entries(scene?.controls?.bindings ?? {})
      .some(([action, binding]) => action !== "V" && binding === shortcut);
    if (conflict) {
      shortcutMessage = "Phím tùy chỉnh trùng thao tác khác trong game. Hãy chọn phím khác (ví dụ F6).";
      return;
    }
    if (!scene?.sys?.isActive?.() || typeof scene.toggleAutoFarm !== "function" || !scene.self) {
      shortcutMessage = "Chưa truy cập được Auto Farm; cần tải game với tham số timer.";
      return;
    }
    if (settings.policyMode === "disabled" && scene.auto?.on === false) {
      shortcutMessage = "Auto Farm đang bị khóa bởi chế độ Disabled.";
      message = `${shortcutMessage} Hãy đổi chế độ rồi bật lại bằng tay.`;
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
  function syncFarmKeyGuard() {
    window.removeEventListener("keydown", guardFarmKey, true);
    if (settings.policyMode !== "native") window.addEventListener("keydown", guardFarmKey, true);
  }
  syncFarmKeyGuard();

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
    if (!settings.enabled && settings.searchScope === "map") return "Toàn map chưa áp dụng: cần bật Mở rộng vùng tìm quái và lưu phạm vi.";
    if (scene.keyCapture) return "Đang đặt phím trong game; kết thúc đặt phím để tiếp tục.";
    if (scene.pendingSkill || scene.aiming) return "Đang chờ/ngắm chiêu tay; kết thúc hoặc hủy ngắm để farm tiếp.";
    if (scene.self.med && globalThis.GSTFarmBehavior?.ownsMeditation?.(scene))
      return "Auto Farm đang thiền chờ quái trong vùng tìm.";
    if (scene.self.med && !scene.auto.resting) return "Game vẫn ghi nhận đang bế quan; chờ game xác nhận thoát bế quan để farm tiếp.";
    if (scene.auto.resting) return "Auto Farm đang rút lui/hồi máu; chưa tiếp tục tìm quái.";
    if (GSTHarvest.controls(scene)) return "Đang nhường di chuyển cho Tự hái.";
    if (globalThis.GSTQuest?.controls(scene)) return "Auto Quest đang về NPC/trả nhiệm vụ.";
    if (globalThis.GSTChest?.controls(scene)) return "Đang nhường di chuyển để tìm và mở rương bí cảnh.";
    if (globalThis.GSTRealm?.controls(scene)) return "Đang nhường di chuyển để tới/vào bí cảnh.";
    if (globalThis.GSTFarmSeals?.controls(scene)) return "Đang nhường di chuyển để phá phong ấn.";
    if (GSTFarmRouting.blocked(scene)) return "Auto Farm vẫn bật; chờ đóng hội thoại NPC hoặc bảng bảo vệ để tiếp tục.";
    const routing = GSTFarmRouting.status(scene);
    if (routing) return routing;
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

  function boundaryHome(scene) {
    return session?.scene === scene ? session.home : { x: scene.auto?.ax, y: scene.auto?.ay };
  }
  function insideFarmBoundary(scene, actor) {
    if (!settings.enabled || settings.searchScope !== "radius") return true;
    const home = boundaryHome(scene);
    return [home?.x, home?.y, settings.radius, actor?.x, actor?.y].every(finite)
      && settings.radius >= 1 && distance(home, actor) <= settings.radius;
  }

  function clearExcludedBossTarget(scene) {
    if (!(settings.excludeBoss || ["highLevel", "lowLevel"].includes(settings.targetMode)) || !scene?.auto?.on) return;
    const actor = scene.views?.get?.(scene.auto.target);
    if (actor?.k !== "m" || !isBoss(actor.st)) return;
    const replacementPath = [];
    excludedBossChange = { auto: scene.auto, target: actor.id,
      path: Array.isArray(scene.auto.path) ? [...scene.auto.path] : null,
      replacementPath };
    // Retain the numeric target sentinel required by the native interface.
    scene.auto.target = 0;
    if (Array.isArray(scene.auto.path)) scene.auto.path = replacementPath;
    scene.auto.think = 0;
    if (session?.scene === scene) session.rankTarget = null;
  }
  function restoreExcludedBossTarget(scene) {
    const change = excludedBossChange;
    excludedBossChange = null;
    if (!change || scene?.auto !== change.auto) return;
    const actor = scene.views?.get?.(change.target);
    let restoredTarget = false;
    if (scene.auto.target === 0 && actor?.k === "m" && !actor.dead && isBoss(actor.st)
        && nativeEligible(actor.st)) {
      scene.auto.target = change.target;
      restoredTarget = true;
    }
    if (change.path && scene.auto.path === change.replacementPath) scene.auto.path = change.path;
    if (restoredTarget) scene.auto.think = 0;
  }
  function restoreRankedTarget(owner) {
    const change = owner?.targetOverride;
    if (!change) return;
    owner.targetOverride = null;
    if (owner.auto.target !== change.to) return;
    const previous = owner.scene.views?.get?.(change.target);
    owner.auto.target = change.target === 0 || previous?.k === "m" && !previous.dead && nativeEligible(previous.st)
      ? change.target : 0;
    if (change.path && owner.auto.path === change.replacementPath) {
      owner.auto.path = change.path;
      if (owner.auto.chaseSince === change.chaseSinceSet) owner.auto.chaseSince = change.chaseSince;
    }
    owner.auto.think = 0;
  }
  function syncFilter(scene) {
    const filteringActive = () => settings.targetMode !== "all" || settings.excludeBoss;
    const boundaryActive = () => settings.enabled && settings.searchScope === "radius";
    if (!filteringActive() && !boundaryActive()) { clearFilter(); return; }
    clearExcludedBossTarget(scene);
    if (filterBinding?.scene === scene && scene.autoHost === filterBinding.wrapper) return;
    clearFilter();
    const original = scene.autoHost;
    if (typeof original !== "function") throw new Error("Auto Farm host unavailable.");
    if (typeof original.call(scene)?.enemies !== "function") throw new Error("Enemy list unavailable.");
    const descriptor = Object.getOwnPropertyDescriptor(scene, "autoHost");
    const wrapper = function (...args) {
      const host = original.apply(this, args);
      if ((!filteringActive() && !boundaryActive()) || !this.auto?.on) return host;
      // Keep the wrapper through recovery; the enemy getter exposes raw threats while resting.
      const eligible = (enemy) => nativeEligible(enemy) && (
        insideFarmBoundary(this, enemy) && matchesTarget(enemy)
        // Only a validated, opt-in nearby group may temporarily join native
        // combat. This never includes an excluded boss or a distant actor.
        || globalThis.GSTFarmDefense?.allowsNearbyTarget?.(this, enemy) === true);
      const allEligibleEnemies = () => {
        const enemies = typeof host?.enemies === "function" ? host.enemies() : [];
        return Array.isArray(enemies) ? enemies.filter(eligible) : [];
      };
      return { ...host,
        // Chest safety must see actual nearby monsters, not farm-targeting filters.
        gstRawEnemies: () => host.enemies(),
        allEligibleEnemies, enemies: () => {
          const enemies = typeof host?.enemies === "function" ? host.enemies() : [];
          if (!Array.isArray(enemies)) return [];
          // Native update can enter recovery after this host wrapper is created.
          if (this.auto?.resting) return enemies;
          const filtered = enemies.filter(eligible);
          return ranked() && !this.auto?.resting ? filtered.sort(comparePriority) : filtered;
        }, loot: () => {
          const loot = typeof host?.loot === "function" ? host.loot() : [];
          return Array.isArray(loot) ? loot.filter((item) => insideFarmBoundary(this, item)) : [];
        } };
    };
    scene.autoHost = wrapper;
    filterBinding = { scene, descriptor, wrapper };
    scene.events.on("shutdown", clearFilter);
    scene.events.on("destroy", clearFilter);
  }

  function pickRanked(s, host, time, pos, candidates, moveCenter, searchRadius) {
    // Native combat may already be fighting a nearby attacker. Do not
    // repeatedly restore an old ranked target while that fight is active.
    const native = s.scene.views?.get?.(s.auto.target);
    if (host.inCombat?.() && native?.k === "m" && !native.dead
        && finite(native.x) && finite(native.y) && distance(native, pos) <= 5.5) {
      s.rankTarget = null;
      return true;
    }
    const ordered = candidates.filter((enemy) => finite(enemy?.id) && finite(enemy.x) && finite(enemy.y)
      && !enemy.dead && nativeEligible(enemy) && !(s.auto.skipped.get(enemy.id) > time))
      .sort((a, b) => comparePriority(a, b) || distance(a, pos) - distance(b, pos));
    const previous = s.rankTarget;
    const held = previous && ordered.find((enemy) => enemy.id === previous.id);
    const better = held && ordered[0] && ordered[0].id !== held.id
      ? switchReason(held, ordered[0], pos, time - previous.at) : "";
    const first = better ? ordered[0] : held ?? ordered[0];
    if (!first) { s.rankTarget = null; return false; }
    for (const enemy of [first, ...ordered.filter((item) => item.id !== first.id)]) {
      const selected = s.auto.pick(host, time, [enemy], [], pos.x, pos.y);
      if (!selected || selected.id !== enemy.id) continue;
      // Native pick() only returns a candidate; native update() normally
      // applies target, chaseSince and path on a target switch.
      if (s.auto.target !== selected.id) {
        const previousOverride = s.targetOverride;
        const stillOwned = previousOverride && s.auto.target === previousOverride.to;
        const replacementPath = [];
        const override = stillOwned ? previousOverride : {
          target: s.auto.target,
          path: Array.isArray(s.auto.path) ? [...s.auto.path] : null,
          chaseSince: s.auto.chaseSince
        };
        override.to = selected.id;
        override.replacementPath = replacementPath;
        override.chaseSinceSet = time;
        s.targetOverride = override;
        s.auto.target = selected.id;
        s.auto.chaseSince = time;
        s.auto.path = replacementPath;
        s.auto.think = 0;
      }
      if (previous && previous.id !== enemy.id) {
        globalThis.GSTMovementDiagnostics?.event?.(s.scene, "target_switch", {
          fromId: previous.id, toId: enemy.id, switchSource: "radius",
          switchReason: better && first.id === enemy.id ? better
            : held ? "pick_failed" : "target_unavailable" });
      }
      s.rankTarget = { id: enemy.id, at: previous?.id === enemy.id ? previous.at : time };
      if (moveCenter) shiftToward(s, enemy, searchRadius);
      return true;
    }
    s.rankTarget = null;
    return false;
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
    if (block || (settings.targetMode === "all" && !settings.excludeBoss)) clearFilter();
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

  function stopForLockedPolicy() {
    if (watcher !== null) clearInterval(watcher);
    watcher = null;
    const oldSession = session;
    if (session) stop("Auto Farm gốc đang được dùng; hỗ trợ farm mở rộng đã dừng.", true);
    else clearFilter();
    restoreRankedTarget(oldSession);
    restoreExcludedBossTarget(sceneNow());
    death = null; revival = null; blockedAuto = null;
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
    if (!settings.autoRespawn) return "Tự hồi sinh đang tắt; bạn có thể hồi sinh bằng tay.";
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
    if (scene.auto?.on && typeof scene.auto.update === "function" && finite(scene.auto.reviveTry)) {
      respawnMessage = "Built-in Auto Farm controls revival; waiting for its next attempt.";
      return "Auto Farm gốc đang xử lý hồi sinh; chờ game.";
    }
    if (death.requested) {
      respawnMessage = "Đã gửi yêu cầu hồi sinh qua bộ điều khiển gốc; đang chờ game.";
      return "Đã gửi yêu cầu hồi sinh một lần; chờ game xác nhận. Có thể thử lại bằng tay nếu cần.";
    }
    const host = typeof scene.autoHost === "function" ? scene.autoHost() : null;
    if (typeof host?.respawn !== "function") {
      respawnMessage = "Không có bộ chọn cách hồi sinh của game; nhường xử lý cho giao diện gốc.";
      return "Thiếu bộ chọn kiểu hồi sinh của game; nhường xử lý cho giao diện gốc.";
    }
    death.requested = true;
    globalThis.GSTBackgroundDiagnostics?.record("revive_request", scene);
    host.respawn();
    respawnMessage = "Đã yêu cầu bộ điều khiển gốc chọn cách hồi sinh; đang chờ game.";
    return "Đã yêu cầu bộ điều khiển gốc chọn cách hồi sinh; chờ game xác nhận.";
  }

  function ensureFlying(s) {
    const ready = globalThis.GSTFlight?.ensure(s.scene) === true;
    if (!ready) message = globalThis.GSTFlight?.status() ?? "Chờ bộ điều khiển bay.";
    return ready;
  }

  function watch() {
    // Independent defense/meditation helpers still need a scene watcher when
    // the user disables respawn and expanded filtering.
    if (settings.policyMode === "extended" && !suspended && !session && watcher === null) {
      watcher = setInterval(discover, 1000);
    }
  }

  function discover() {
    if (settings.policyMode !== "extended" || suspended || session) return;
    try {
      const scene = sceneNow();
      globalThis.GSTFarmCombat?.attach(scene);
      globalThis.GSTFarmRevivePolicy?.attach(scene);
      globalThis.GSTFarmBehavior?.attach(scene);
      globalThis.GSTFarmDefense?.attach(scene);
      globalThis.GSTFarmEncounter?.attach(scene);
      globalThis.GSTFarmBossSafety?.attach(scene);
      globalThis.GSTFarmMap?.attach(scene);
      globalThis.GSTFarmVisual?.attach(scene);
      globalThis.GSTFarmRouting?.attach(scene);
      globalThis.GSTFarmDiagnostics?.attach(scene);
      checkRespawn(scene);
      if (!settings.enabled && settings.targetMode === "all" && !settings.excludeBoss) return;
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
      session = { scene, auto: scene.auto, home: point, center: { ...point }, mapKey: nativeMapKey(scene.autoHost()), at: -Infinity,
        reanchor: false, targetOverride: null };
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
      globalThis.GSTFarmEncounter?.attach(s.scene);
      if (globalThis.GSTFarmDefense?.controls(s.scene)) return;
      const time = s.scene.now();
      const host = s.scene.autoHost();
      const mapKey = nativeMapKey(host);
      if (mapKey !== null && s.mapKey !== mapKey) {
        s.mapKey = mapKey;
        s.home = { x: s.auto.ax, y: s.auto.ay };
        s.center = { ...s.home };
        s.rankTarget = null;
        s.reanchor = false;
      }
      const searchRadius = nativeRadius(s.scene);
      if (searchRadius === null && (settings.enabled || settings.targetMode !== "all"
          || settings.excludeBoss)) {
        clearFilter();
        message = "Bán kính Auto Farm gốc không được hỗ trợ; phần chọn mục tiêu mở rộng đang nhường cho game.";
        return;
      }
      globalThis.GSTFarmBehavior?.attach(s.scene);
      clearExcludedBossTarget(s.scene);
      // Follow native target changes even when the user farms all monsters.
      // Refresh periodically because a boss actor can appear/disappear
      // without the native target ID changing.
      if (finite(time) && (s.bossSafetyTarget !== s.auto.target
          || time - (s.bossSafetyAt ?? -Infinity) >= 0.5)) {
        s.bossSafetyTarget = s.auto.target;
        s.bossSafetyAt = time;
        globalThis.GSTFarmBossSafety?.attach?.(s.scene);
      }
      syncFilter(s.scene);
      // A native handoff moves the game's search center to the remote camp.
      // It is not a manual relocation of the user's configured farm origin.
      const aligned = globalThis.GSTFarmMap?.consumeCenter?.(s.scene);
      if (aligned && s.auto.ax === aligned.x && s.auto.ay === aligned.y)
        s.center = { ...aligned };
      if (globalThis.GSTFarmSeals?.pending?.(s.scene)) {
        message = globalThis.GSTFarmSeals.status(s.scene)
          || "Còn phong ấn bí cảnh; chờ phá xong trước khi tìm boss.";
        return;
      }
      if (globalThis.GSTFarmBehavior?.pendingLoot(s.scene)) {
        message = "Đang ưu tiên nhặt đồ tại bãi vừa đánh trước khi chọn bãi tiếp theo.";
        return;
      }
      if (globalThis.GSTMapTravel?.active(s.scene)) {
        message = GSTMapTravel.status(s.scene); return;
      }
      if (globalThis.GSTFarmMap?.controls(s.scene) || globalThis.GSTFarmMap?.nativeHandling(s.scene)) {
        message = GSTFarmMap.status(s.scene); return;
      }
      if (globalThis.GSTQuest?.controls(s.scene)) { message = "Nhường di chuyển để Auto Quest về NPC/trả nhiệm vụ."; return; }
      if (GSTHarvest.controls(s.scene)) {
        message = "Tạm nhường di chuyển cho Tự hái; giữ nguyên tâm farm.";
        return;
      }
      if (globalThis.GSTChest?.controls(s.scene)) {
        message = "Tạm nhường di chuyển để mở rương bí cảnh; giữ nguyên tâm farm.";
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
      if (!settings.enabled) {
        if (s.auto.moved || time < s.auto.pauseUntil || GSTFarmInput.movement(s.scene)) s.rankTarget = null;
        if (ranked() && !s.auto.moved && time >= s.auto.pauseUntil && !s.auto.resting
            && !s.scene.pendingSkill && !s.scene.aiming && !GSTFarmInput.movement(s.scene)
            && !GSTFarmRouting.blocked(s.scene) && typeof host.pos === "function") {
          const point = host.pos();
          const enemies = host.allEligibleEnemies ? host.allEligibleEnemies() : host.enemies();
          if (Array.isArray(point) && point.length === 2 && point.every(finite) && Array.isArray(enemies)) {
            const centerPoint = { x: s.auto.ax, y: s.auto.ay };
            pickRanked(s, host, time, { x: point[0], y: point[1] },
              enemies.filter((enemy) => finite(enemy?.x) && finite(enemy.y)
                && distance(enemy, centerPoint) < searchRadius), false, searchRadius);
          }
        }
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
        s.rankTarget = null;
        message = "Paused for manual movement.";
        return;
      }
      if (s.reanchor || !owned(s)) {
        s.home = { x: s.auto.ax, y: s.auto.ay };
        s.center = { ...s.home };
        s.reanchor = false;
        s.rankTarget = null;
      }
      if (s.auto.resting || host.meditating() || s.scene.pendingSkill || s.scene.aiming || GSTFarmRouting.blocked(s.scene)) {
        message = "Waiting for built-in healing, skill or UI handling.";
        return;
      }
      if (!ensureFlying(s, time)) return;
      const position = host.pos();
      if (!Array.isArray(position) || !position.every(finite) || position.length !== 2) {
        stop("Invalid Auto Farm position data; stopped.", true);
        return;
      }
      const pos = { x: position[0], y: position[1] };
      const enemies = ranked() && host.allEligibleEnemies ? host.allEligibleEnemies() : host.enemies();
      if (!Array.isArray(enemies)) {
        stop("Invalid Auto Farm enemy data; stopped.", true);
        return;
      }
      const eligible = enemies.filter((enemy) => finite(enemy?.id) && finite(enemy.x) && finite(enemy.y)
        && !enemy.dead && nativeEligible(enemy) && (settings.searchScope === "map" ? finite(s.scene.map?.w) && finite(s.scene.map?.h)
          && enemy.x >= 0 && enemy.y >= 0 && enemy.x < s.scene.map.w && enemy.y < s.scene.map.h
          : distance(enemy, s.home) < settings.radius)
        && !(s.auto.skipped.has(enemy.id) && s.auto.skipped.get(enemy.id) > time));
      // Match the built-in skipped expiry without deleting its records ourselves.
      const candidates = eligible.filter((enemy) => !(s.auto.skipped.get(enemy.id) > time)
        // The map navigator approaches all distant targets with native walk/hop first.
        // Probing a full long route with pick() here would repeatedly mark them skipped.
        && !(distance(enemy, pos) > 6));
      const target = candidates.find((enemy) => enemy.id === s.auto.target);
      if (ranked() && settings.searchScope !== "map"
          && pickRanked(s, host, time, pos, candidates, true, searchRadius)) {
        message = "Giữ mục tiêu theo ưu tiên boss/cảnh giới cho tới khi cần đổi.";
        return;
      }
      if (target) {
        if (distance(target, s.center) >= searchRadius - 0.5) shiftToward(s, target, searchRadius);
        message = "Keeping the built-in target.";
        return;
      }
      const local = candidates.filter((enemy) => distance(enemy, s.center) < searchRadius);
      const aggro = host.inCombat() ? local.filter((enemy) => enemy.aggro && distance(enemy, pos) < 3.2) : [];
      // Use the game's picker, including its reachability cache and skip backoff.
      if (local.length && s.auto.pick(host, time, local, aggro, pos.x, pos.y)) {
        message = "Built-in Auto Farm has local targets.";
        return;
      }
      // Let idle() collect its pending local loot before moving the search center.
      if (host.loot().some((loot) => finite(loot.x) && finite(loot.y)
          && distance(loot, s.center) < searchRadius
          && !(s.auto.lootSkip?.has(`${loot.x.toFixed(1)},${loot.y.toFixed(1)}`)))) {
        message = "Waiting for built-in loot collection.";
        return;
      }
      const remote = candidates.slice()
        .sort((a, b) => distance(a, pos) - distance(b, pos));
      let next = null;
      for (const enemy of remote.slice(0, 4)) {
        if (s.auto.pick(host, time, [enemy], [], pos.x, pos.y)) {
          next = enemy;
          break;
        }
      }
      if (next) {
        shiftToward(s, next, searchRadius);
        message = "Search center extended; built-in Auto Farm will choose/pursue a target.";
      } else {
        center(s, s.home);
        message = settings.idleMode === "hold" ? "Không có quái phù hợp; nhặt đồ rồi đứng chờ trong vùng farm."
          : settings.idleMode === "seek" ? (globalThis.GSTFarmMap?.status(s.scene) || "Đang dò vùng tìm quái mới sau khi nhặt đồ.")
          : "Không có quái phù hợp; Auto Farm quay về tâm farm gốc.";
      }
    } catch {
      stop("Auto Farm interface error; extended range stopped.", true);
    }
  }

  function shiftToward(s, enemy, searchRadius) {
    if (settings.searchScope === "map") { center(s, { x: enemy.x, y: enemy.y }); return; }
    const length = distance(enemy, s.home);
    // Keep the entire native search circle inside the configured farm boundary.
    const shift = Math.min(length, Math.max(0, settings.radius - searchRadius));
    const point = length > 0 ? {
      x: s.home.x + (enemy.x - s.home.x) / length * shift,
      y: s.home.y + (enemy.y - s.home.y) / length * shift
    } : s.home;
    if (distance(point, s.center) > 0.25 || distance(enemy, s.center) >= searchRadius) center(s, point);
  }

  globalThis.GSTFarmQuest = {
    ready: () => globalThis.GSTFarmConfigurationReady === true
      && settings.policyMode === "extended" && settings.targetMode === "all",
    prepare(scene) {
      if (!this.ready() || !compatible(scene)) throw new Error("Farm configuration unavailable");
      blockedAuto = null; revival = null;
      globalThis.GSTFarmCombat?.attach(scene);
      globalThis.GSTFarmRevivePolicy?.attach(scene);
      globalThis.GSTFarmBehavior?.attach(scene);
      globalThis.GSTFarmBossSafety?.attach(scene);
      globalThis.GSTFarmRouting?.attach(scene);
    }
  };

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
        && finite(data.radius) && data.radius >= 1 && data.radius <= 1000) {
      configurationReceived = true;
      let stage = "settings";
      globalThis.GSTFarmConfigurationReady = false;
      configurationError = "";
      try {
      const scopeChanged = settings.searchScope !== (data.searchScope === "map" ? "map" : "radius");
      const filterChanged = settings.searchScope !== data.searchScope || settings.targetMode !== targetMode(data.targetMode)
        || settings.targetLevel !== data.targetLevel
        || settings.targetMinLevel !== data.targetMinLevel || settings.targetMaxLevel !== data.targetMaxLevel
        || settings.excludeBoss !== (data.excludeBoss === true);
      const retreatHpPercent = data.retreatHpPercent, recoveryHpPercent = data.recoveryHpPercent;
      const hpThresholds = Number.isSafeInteger(retreatHpPercent) && retreatHpPercent >= 1
        && Number.isSafeInteger(recoveryHpPercent) && retreatHpPercent < recoveryHpPercent && recoveryHpPercent <= 100
        ? { retreatHpPercent, recoveryHpPercent } : { retreatHpPercent: 40, recoveryHpPercent: 100 };
      settings = { policyMode: globalThis.GSTFarmPolicy?.normalize(data.policyMode) ?? "extended",
        enabled: data.enabled, radius: data.radius, autoRespawn: data.autoRespawn !== false,
        autoMeditate: data.autoMeditate !== false, noRetreat: data.noRetreat !== false,
        bossDodge: data.bossDodge !== false, eliteDodge: data.eliteDodge === true, bossRetreat: data.bossRetreat !== false,
        ...hpThresholds,
        showTargetLine: data.showTargetLine === true, showRange: data.showRange === true,
        nearbyClear: data.nearbyClear === true,
        nearbyRadius: Number.isSafeInteger(data.nearbyRadius)
          ? Math.max(1, Math.min(6, data.nearbyRadius)) : 2,
        searchScope: data.searchScope === "map" ? "map" : "radius",
        targetMode: targetMode(data.targetMode),
        targetLevel: Number.isSafeInteger(data.targetLevel) && data.targetLevel > 0 ? data.targetLevel : 1,
        targetMinLevel: Number.isSafeInteger(data.targetMinLevel) && data.targetMinLevel > 0 ? data.targetMinLevel : 1,
        targetMaxLevel: Number.isSafeInteger(data.targetMaxLevel) && data.targetMaxLevel > 0 ? data.targetMaxLevel : 20,
        idleMode: ["home", "seek"].includes(data.idleMode) ? data.idleMode : "hold",
        preferLoot: data.preferLoot !== false, selfDefense: data.selfDefense === true, autoEncounter: data.autoEncounter === true, excludeBoss: data.excludeBoss === true };
      stage = "policy";
      globalThis.GSTFarmPolicy?.setMode(settings.policyMode);
      syncFarmKeyGuard();
      stage = "session";
      globalThis.GSTFarmSession?.setPolicyMode?.(settings.policyMode, sceneNow());
      if (settings.policyMode !== "extended") stopForLockedPolicy();
      stage = "revive";
      globalThis.GSTFarmRevivePolicy?.configure(settings.autoRespawn);
      stage = "combat";
      globalThis.GSTFarmCombat?.configure(sceneNow(), settings.noRetreat);
      stage = "boss-safety";
      globalThis.GSTFarmBossSafety?.configure(sceneNow(), settings);
      stage = "behavior";
      globalThis.GSTFarmBehavior?.configure(sceneNow(), settings);
      stage = "defense";
      globalThis.GSTFarmDefense?.configure(sceneNow(), settings);
      stage = "encounter";
      globalThis.GSTFarmEncounter?.configure(sceneNow(), settings);
      stage = "map";
      globalThis.GSTFarmMap?.configure(sceneNow(), settings.policyMode !== "extended"
        ? { ...settings, enabled: false, searchScope: "radius", targetMode: "all", excludeBoss: false }
        : settings);
      stage = "visual";
      globalThis.GSTFarmVisual?.configure(sceneNow(), settings);
      stage = "routing";
      globalThis.GSTFarmRouting?.configure(sceneNow(), settings);
      stage = "diagnostics";
      globalThis.GSTMovementDiagnostics?.configure(settings);
      globalThis.GSTFarmDiagnostics?.attach(sceneNow());
      stage = "activation";
      syncActivationTracking();
      globalThis.GSTFarmCombat?.attach(sceneNow());
      globalThis.GSTFarmRevivePolicy?.attach(sceneNow());
      stage = "filter";
      if (settings.targetMode === "all" && !settings.excludeBoss) clearFilter();
      if (settings.policyMode === "extended") clearExcludedBossTarget(sceneNow());
      if (session) {
        if (scopeChanged) { restore(session); session.at = -Infinity; }
        syncFilter(session.scene);
        if (filterChanged) { session.auto.think = 0; session.rankTarget = null; }
        if (!settings.enabled) restore(session);
      }
      if (!settings.autoRespawn) respawnMessage = "";
      stage = "start";
      if (settings.policyMode === "native") {
        if (watcher !== null) clearInterval(watcher);
        watcher = null;
        shortcutMessage = "";
        message = "Chế độ Native: Auto Farm do game điều khiển; hỗ trợ farm của extension đang tắt.";
      } else if (settings.policyMode === "disabled") {
        shortcutMessage = "";
        message = "Auto Farm đang bị khóa bởi chế độ Disabled; tùy chọn đã lưu vẫn được giữ.";
      } else if (!settings.enabled && settings.targetMode === "all" && !settings.excludeBoss) {
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
      } catch (error) {
        // Export only a fixed stage and standard error class, never raw messages/stacks.
        const kind = ["TypeError", "ReferenceError", "RangeError", "SyntaxError"].includes(error?.name)
          ? error.name : "Error";
        configurationError = `Chưa áp dụng xong cấu hình Auto Farm: ${stage} (${kind}).`;
      }
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
      const scene = sceneNow();
      const defense = globalThis.GSTFarmDefense?.status(scene) || "";
      const network = globalThis.GSTConnectionRecovery?.status(scene) || "";
      const primary = configurationError || (settings.policyMode === "disabled" ? message
        : network || defense || globalThis.GSTFarmBossSafety?.status(scene) || waitReason
        || globalThis.GSTFarmMap?.status(scene) || globalThis.GSTFarmBehavior?.status(scene)
        || globalThis.GSTFarmSession?.status(scene) || globalThis.GSTFarmSeals?.status(scene) || message);
      const defenseInfo = autoOn === false && !defense ? globalThis.GSTFarmDefense?.status(scene, true) : "";
      const encounterInfo = globalThis.GSTFarmEncounter?.status(scene) || "";
      window.postMessage({ channel: "gst:farm-status:v1", requestId: data.requestId,
        configurationReceived, configurationReady: globalThis.GSTFarmConfigurationReady === true,
        message: (settings.policyMode === "extended" && settings.targetMode !== "all" ? `${filterLabel()}. ` : "") + (shortcutMessage
          || (dead && respawnMessage ? respawnMessage : primary)) + (defenseInfo ? ` · ${defenseInfo}` : ""),
        encounterStatus: encounterInfo,
        autoOn, dead, active: session !== null, radius: settings.radius }, origin);
    }
  });
  window.addEventListener("pagehide", () => {
    window.removeEventListener("keydown", guardFarmKey, true);
    suspended = true;
    clearActivationLock(); clearInterval(activationWatcher); activationWatcher = null;
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
    syncFarmKeyGuard();
    suspended = false;
    syncActivationTracking();
    watch();
    discover();
  });
  window.postMessage({ channel: "gst:farm-status:v1", ready: true }, origin);
})();
