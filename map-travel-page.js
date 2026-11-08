(() => {
  "use strict";
  const key = "gst:map-return:v1";
  const finite = Number.isFinite;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  let preferences = { clickMove: false, returnDeath: false };
  let binding = null, job = null, lastAlive = null, seenDead = false;
  let revivedAt = null, watcher = null, suspended = false, message = "";
  let configured = false;
  let modalAt = -Infinity, modal = false;
  function modalOpen() {
    if (performance.now() - modalAt < 250) return modal;
    modalAt = performance.now();
    modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
      el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    return modal;
  }
  function readPending() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key));
      if (saved && typeof saved.map === "string" && typeof saved.profile === "string"
          && Number.isFinite(saved.x) && Number.isFinite(saved.y) && Number.isFinite(saved.at)
          && Date.now() - saved.at >= 0 && Date.now() - saved.at < 120000) return saved;
    } catch { /* Invalid or blocked session storage: do not restore a destination. */ }
    return null;
  }
  let pending = readPending();
  function savePending() {
    try {
      if (pending) sessionStorage.setItem(key, JSON.stringify(pending));
      else sessionStorage.removeItem(key);
    } catch { /* Only this tab's session is used; no persistent coordinate history. */ }
  }
  function release(reason, clearDeath = false) {
    const old = job;
    job = null;
    if (old) {
      GSTNavigation.cancel(old.scene, old.navigation);
      if (old.steer && old.scene.autoX === old.steer[0] && old.scene.autoY === old.steer[1])
        old.scene.autoX = old.scene.autoY = 0;
    }
    if (clearDeath) { pending = null; savePending(); }
    if (reason) message = reason;
  }
  function connected(scene) {
    const driver = scene?.driver;
    return !!driver && !driver.closing && !driver.reconnecting && !driver.displaced
      && (driver.online === false || driver.link?.open?.() === true);
  }
  function compatible(scene) {
    return scene?.sys?.isActive?.() && scene.self && scene.map && scene.collision
      && typeof scene.auto?.update === "function" && typeof scene.auto?.walk === "function"
      && typeof scene.autoHost === "function" && typeof scene.now === "function"
      && typeof scene.events?.on === "function" && typeof scene.events.off === "function"
      && finite(scene.px) && finite(scene.py);
  }
  function inside(scene, point) {
    return point && finite(point.x) && finite(point.y) && finite(scene.map?.w)
      && finite(scene.map?.h) && point.x >= 0 && point.y >= 0
      && point.x < scene.map.w && point.y < scene.map.h;
  }
  function begin(scene, point, mode) {
    if (!compatible(scene) || !inside(scene, point) || !connected(scene) || scene.leaving || scene.self.dead
        || typeof scene.collision?.blockedCell !== "function")
      return "Không thể di chuyển: nhân vật hoặc bản đồ chưa sẵn sàng.";
    if (scene.self.realm?.inside && mode === "return")
      return "Không quay lại vị trí chết trong bí cảnh.";
    let dest = { x: point.x, y: point.y };
    try {
      if (typeof scene.collision.blockedCell === "function" && scene.collision.blockedCell(dest.x, dest.y)) {
        // A marker may be centered on an occupied tile. Find only a nearby legal standing cell.
        let nearest = null, distance = Infinity;
        for (let radius = 0.5; radius <= 2.5; radius += 0.5) {
          for (let i = 0; i < 16; i++) {
            const candidate = { x: dest.x + radius * Math.cos(i * Math.PI / 8),
              y: dest.y + radius * Math.sin(i * Math.PI / 8) };
            const d = Math.hypot(candidate.x - dest.x, candidate.y - dest.y);
            if (d < distance && inside(scene, candidate)
                && !scene.collision.blockedCell(candidate.x, candidate.y)) {
              nearest = candidate; distance = d;
            }
          }
          if (nearest) break;
        }
        if (!nearest) return "Điểm được chọn bị chắn; hãy chọn vị trí trống gần đó.";
        dest = nearest;
      }
    } catch { return "Không kiểm tra được địa hình tại điểm đã chọn."; }
    release("", mode === "click");
    const time = scene.now();
    const navigation = Object.assign(Object.create(scene.auto), {
      path: [], pathAt: -Infinity, goalX: NaN, goalY: NaN,
      lastX: scene.px, lastY: scene.py, stillSince: time,
      stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0
    });
    job = { scene, map: scene.map.scene, destination: dest, mode, navigation,
      startedAt: performance.now(), progressAt: performance.now(), retries: 0,
      steer: null, checkpoint: null };
    message = mode === "return" ? "Đã hồi sinh; đang quay về vị trí chết."
      : "Đang đi tới điểm đã chọn trên bản đồ.";
    return message;
  }
  function yieldTravel(scene, current) {
    if (current.steer && scene.autoX === current.steer[0] && scene.autoY === current.steer[1])
      scene.autoX = scene.autoY = 0;
    current.steer = null;
    const now = performance.now();
    current.pausedAt ??= now;
    current.progressAt = now;
  }
  function update(host, time) {
    const scene = binding?.scene, current = job;
    if (!current || current.scene !== scene || binding.auto !== this) return false;
    if (!compatible(scene) || !connected(scene) || sceneNow() !== scene
        || scene.leaving || scene.map.scene !== current.map || scene.self.dead) {
      release("Hành trình đã dừng vì nhân vật hoặc bản đồ thay đổi.", true);
      return false;
    }
    if (GSTFarmInput.movement(scene)) {
      release("Đã hủy hành trình vì bạn điều khiển nhân vật.", true);
      return false;
    }
    if (current.mode === "return" && scene.self.realm?.inside) {
      release("Không quay lại vị trí chết trong bí cảnh.", true);
      return false;
    }
    if (!finite(time) || typeof scene.collision?.blockedCell !== "function"
        || !["clear", "route", "steer"].every((name) => typeof host?.[name] === "function")) {
      release("Game chưa cung cấp đường đi phù hợp.", true);
      return false;
    }
    // An imminent boss warning may preempt potion recovery. Otherwise the
    // game's own combat/pill logic keeps priority over this manual journey.
    const urgentDodge = globalThis.GSTFarmBossSafety?.emergency?.(scene, time) === true;
    if (urgentDodge) {
      yieldTravel(scene, current);
      return false;
    }
    if (scene.auto.resting || scene.self.combat || scene.pendingSkill || scene.aiming
        || scene.heldAttack || scene.dashT > 0
        || (scene.auto.on && globalThis.GSTHarvest?.needsRecovery?.(scene))) {
      yieldTravel(scene, current);
      return false;
    }
    if (scene.uiBlocked || scene.keyCapture || scene.overlay?.dialogOpen
        || scene.harvesting || scene.self.med || scene.self.fish
        || (scene.self.realm?.inside?.protection ?? 0) > 0
        || modalOpen()) {
      yieldTravel(scene, current);
      return true;
    }
    if (current.pausedAt !== undefined) {
      current.startedAt += performance.now() - current.pausedAt;
      current.pausedAt = undefined;
    }
    const pos = { x: scene.px, y: scene.py }, goal = current.destination;
    const distance = Math.hypot(goal.x - pos.x, goal.y - pos.y);
    if (distance <= 1.1) {
      release(current.mode === "return" ? "Đã quay lại gần vị trí chết."
        : "Đã tới điểm được chọn.", true);
      return true;
    }
    const owner = current;
    const steering = { ...host, steer: (x, y) => {
      scene.autoX = x; scene.autoY = y; owner.steer = [x, y];
    } };
    const leg = GSTNavigation.leg(scene, owner, host, goal.x, goal.y,
      (point) => inside(scene, point) && !scene.collision.blockedCell(point.x, point.y));
    const target = leg ?? goal;
    if (owner.legArrived || GSTNavigation.progressed(scene, owner, owner.navigation.path,
      target.x, target.y, 0.25)) owner.progressAt = performance.now();
    const now = performance.now();
    if (now - owner.startedAt > 120000 || now - owner.progressAt > 8000) {
      if (owner.retries++ >= 2 || now - owner.startedAt > 120000) {
        release("Không thể tới điểm đã chọn; đã dừng để tránh chạy vòng.", true);
        return true;
      }
      GSTNavigation.resetLeg(owner, true);
      owner.navigation.path = []; owner.navigation.pathAt = -Infinity;
      owner.progressAt = now;
    }
    if (!leg) {
      steering.steer(0, 0);
      message = "Đang tìm đường vòng tới điểm đã chọn.";
      return true;
    }
    if (!GSTNavigation.walk(scene, owner.navigation, steering, time, pos.x, pos.y,
      leg.x, leg.y, owner.checkpoint ? 0.8 : 1.1)) {
      GSTNavigation.resetLeg(owner, true);
      owner.navigation.path = []; owner.navigation.pathAt = -Infinity;
      if (++owner.retries > 2) {
        release("Đường đi bị chặn; đã dừng hành trình.", true);
        return true;
      }
      steering.steer(0, 0);
      owner.progressAt = now;
      return true;
    }
    message = (owner.mode === "return" ? "Đang quay về vị trí chết" : "Đang tới điểm đã chọn")
      + " · còn " + distance.toFixed(1) + " ô.";
    return true;
  }
  function observe() {
    const scene = binding?.scene;
    if (!scene || sceneNow() !== scene || !scene.self) return;
    const map = scene.map?.scene, profile = scene.profile?.name;
    const inRealm = !!scene.self.realm?.inside;
    if (scene.self.dead) {
      if (!seenDead) {
        seenDead = true;
        if (inRealm || lastAlive?.realm) {
          release("Chết trong bí cảnh: không quay lại vị trí chết.", true);
        } else {
          release("Nhân vật đã chết; chờ hồi sinh.");
          if (preferences.returnDeath && lastAlive && lastAlive.map === map
              && lastAlive.profile === profile && Date.now() - lastAlive.at < 10000) {
            pending = { x: lastAlive.x, y: lastAlive.y, map, profile, at: Date.now() };
            savePending();
          } else if (!(preferences.returnDeath && pending && pending.map === map
              && pending.profile === profile && inside(scene, pending)
              && Date.now() - pending.at >= 0 && Date.now() - pending.at < 120000)) {
            // Do not erase a valid same-tab destination restored during death.
            pending = null; savePending();
          }
        }
      }
      return;
    }
    if (seenDead) { seenDead = false; revivedAt = performance.now(); }
    // Native WorldScene skips auto.update while a skill is queued/aimed.
    // Freeze journey timeout even on frames where our update callback cannot run.
    if (job && (scene.auto?.resting || scene.self.med || scene.pendingSkill || scene.aiming))
      yieldTravel(scene, job);
    if (pending) {
      if (!preferences.returnDeath || !inside(scene, pending)
          || pending.map !== map || pending.profile !== profile
          || Date.now() - pending.at < 0 || Date.now() - pending.at >= 120000 || inRealm) {
        pending = null; savePending();
      } else if (GSTFarmInput.movement(scene)) {
        release("Đã hủy quay lại vị trí chết vì bạn điều khiển nhân vật.", true);
      } else if (!job && connected(scene) && !scene.leaving) {
        revivedAt ??= performance.now();
        if (performance.now() - revivedAt >= 2000 && !(scene.auto?.deadAt > 0)) {
          const reason = begin(scene, pending, "return");
          if (!job) { message = reason; pending = null; savePending(); }
        }
      }
    }
    if (finite(scene.px) && finite(scene.py) && typeof map === "string"
        && typeof profile === "string" && profile.length) {
      lastAlive = { x: scene.px, y: scene.py, map, profile, realm: inRealm, at: Date.now() };
    }
  }
  function detach() {
    const old = binding; binding = null;
    release();
    if (!old) return;
    old.remove(); old.removeInput();
    old.scene.events.off("postupdate", observe);
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
    lastAlive = null; seenDead = false; revivedAt = null;
  }
  function discover() {
    if (suspended || !(preferences.returnDeath || preferences.clickMove || job)) { detach(); return; }
    const scene = sceneNow();
    if (binding && (binding.scene !== scene || binding.auto !== scene?.auto
        || !GSTFarmUpdate.attached(scene) || !compatible(scene))) detach();
    if (binding || !compatible(scene)) return;
    try {
      const owner = { scene, auto: scene.auto };
      owner.remove = GSTFarmUpdate.add(scene, -0.5, update);
      owner.removeInput = GSTFarmInput.add(scene, (accepted) => {
        if (accepted && (job || pending)) release("Đã hủy vì bạn click điều khiển trong game.", true);
      });
      binding = owner;
      scene.events.on("postupdate", observe);
      scene.events.on("shutdown", detach);
      scene.events.on("destroy", detach);
      observe();
    } catch { detach(); }
  }
  function configure(options) {
    configured = true;
    preferences = { clickMove: options?.clickMove === true, returnDeath: options?.returnDeath === true };
    if (!preferences.returnDeath) {
      pending = null; savePending();
      if (job?.mode === "return") release("Đã tắt quay lại vị trí chết.");
    }
    if (!preferences.clickMove && job?.mode === "click") release("Đã tắt click để di chuyển.");
    if (preferences.returnDeath || preferences.clickMove) {
      if (watcher === null) watcher = setInterval(discover, 750);
      discover();
    } else {
      if (watcher !== null) clearInterval(watcher);
      watcher = null; detach();
    }
  }
  globalThis.GSTMapTravel = {
    configure,
    go(scene, x, y) {
      if (!preferences.clickMove) return "Hãy bật Click để di chuyển trước.";
      discover();
      if (!binding || binding.scene !== scene) return "Chưa kết nối được bộ di chuyển của game.";
      return begin(scene, { x, y }, "click");
    },
    cancel() { release("Đã dừng hành trình theo yêu cầu.", true); },
    active: (scene) => !!job && job.scene === scene,
    controls: (scene) => !!job && job.scene === scene,
    snapshot: (scene) => job?.scene === scene ? {
      x: job.destination.x, y: job.destination.y, mode: job.mode,
      path: Array.isArray(job.navigation.path) ? job.navigation.path.slice(0, 80) : []
    } : null,
    status: () => message
  };
  window.addEventListener("pagehide", () => {
    suspended = true;
    if (watcher !== null) clearInterval(watcher);
    watcher = null; detach();
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    // On an initial load, wait for area-map-content.js to read Chrome Storage.
    // A default false here would permanently erase a saved return destination.
    if (configured) configure(preferences);
  });
})();