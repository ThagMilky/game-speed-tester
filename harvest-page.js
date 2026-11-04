(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let settings = GSTHarvest.normalize(null);
  let binding = null;
  let recovery = null;
  let job = null;
  let watcher = null;
  let suspended = false;
  let message = "Tự hái đang tắt.";
  let safeSince = null;
  let manualUntil = 0;
  let lastStep = -Infinity;
  let modalAt = -Infinity;
  let modal = false;
  let debugEnabled = false;
  let attempt = 0;
  const skipped = new Map();
  const finite = Number.isFinite;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const connected = (scene) => {
    const d = scene?.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  };
  function compatible(scene) {
    return scene?.sys?.isActive?.() && scene.self && scene.views instanceof Map
      && Array.isArray(scene.nodes) && typeof scene.auto?.update === "function"
      && typeof scene.auto.on === "boolean" && typeof scene.autoHost === "function"
      && typeof scene.now === "function"
      && typeof scene.pickTarget === "function" && typeof scene.interact === "function"
      && typeof scene.move === "function" && typeof scene.useSkill === "function"
      && typeof scene.startClickOrder === "function"
      && typeof scene.sendMove === "function" && typeof scene.act === "function"
      && typeof scene.events?.on === "function" && typeof scene.events.off === "function";
  }
  function modalOpen(fresh = false) {
    if (!fresh && performance.now() - modalAt < 200) return modal;
    modalAt = performance.now();
    modal = [...document.querySelectorAll('[role="alertdialog"]')]
      .some((el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
    return modal;
  }
  function manualMovement(scene) {
    const keyboardActive = !scene.chat?.typing && !scene.inputFieldActive?.() && !scene.keyCapture;
    return (keyboardActive && ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"]
      .some((key) => scene.keys?.[key]?.isDown)) || !!scene.joyX || !!scene.joyY || !!scene.clickOrder;
  }
  function browsingUI(scene) {
    return !!(scene.panels?.open || scene.chat?.typing || scene.inputFieldActive?.());
  }
  function needsRecovery(scene) {
    if (!scene.auto.on) return false;
    // Read the game's existing thresholds; do not change pills or their cooldowns.
    let hp = 0.4, mp = 0.25;
    try {
      const h = Number(localStorage.getItem("tm-auto-hp"));
      const m = Number(localStorage.getItem("tm-auto-mp"));
      if ([0.3, 0.4, 0.5, 0.6].includes(h)) hp = h;
      if ([0.15, 0.25, 0.35, 0.5].includes(m)) mp = m;
    } catch { /* The native defaults remain conservative. */ }
    const host = scene.autoHost();
    if (typeof host.hp !== "function" || typeof host.mp !== "function" || typeof host.pills !== "function") return true;
    return host.hp?.() < hp || (host.mp?.() < mp
      && (host.pills?.("mp") ?? []).some((count) => count > 0));
  }
  function blockedReason(scene, fresh = false) {
    if (!settings.enabled) return "Tự hái đang tắt.";
    if (suspended) return "Tạm dừng vì trang đang rời đi.";
    if (!compatible(scene)) return "Chưa đọc đủ interface thu hoạch của game.";
    if (!connected(scene)) return "Chờ kết nối game ổn định.";
    if (scene.self.dead) return "Nhân vật đã chết; chờ hồi sinh.";
    if (scene.leaving) return "Đang chuyển map.";
    if (modalOpen(fresh)) return "Chờ bạn xử lý hộp kiểm tra người chơi.";
    if (scene.keyCapture) return "Chờ kết thúc đổi phím trong game.";
    if (scene.overlay?.dialogOpen) return "Chờ đóng hộp thoại tương tác trong game.";
    if (document.body.classList.contains("mobile") && innerHeight > innerWidth) return "Chờ xoay ngang màn hình game.";
    if (scene.uiBlocked && !browsingUI(scene)) return "Giao diện game đang chặn thao tác thu hoạch.";
    if (scene.pendingSkill || scene.aiming || scene.heldAttack) return "Chờ thả phím đánh hoặc kết thúc ngắm/tung chiêu.";
    if (scene.self.med || scene.auto.resting) return "Chờ kết thúc bế quan hoặc hồi máu.";
    if (scene.self.fish) return "Chờ kết thúc câu cá.";
    if (manualMovement(scene)) return "Chờ nhân vật kết thúc lệnh đi tay; thả WASD/phím mũi tên.";
    if (scene.auto.on && (scene.auto.moved || scene.now() < scene.auto.pauseUntil)) return "Chờ Auto Farm xử lý lệnh di chuyển tay.";
    if (performance.now() < manualUntil) return "Tạm dừng 3 giây sau lệnh di chuyển, chiến đấu hoặc tương tác tay.";
    if (needsRecovery(scene)) return "Chờ cơ chế hồi HP/MP của Auto Farm.";
    return null;
  }
  const blocked = (scene, fresh = false) => blockedReason(scene, fresh) !== null;
  function danger(scene, node) {
    if (settings.ignoreMonsters) return false;
    // Read the scene's full monster set, never the level/boss-filtered host.
    const here = { x: scene.px, y: scene.py };
    for (const enemy of scene.views.values()) {
      if (enemy.k !== "m" || enemy.st?.cls === "pet" || enemy.dead) continue;
      const st = enemy.st;
      const hostile = !enemy.passive || (st?.hp ?? 0) < (st?.mh ?? 0)
        || st?.cls === "gu" || st?.cls === "boss" || !!st?.wb;
      if (!hostile) continue;
      if (!finite(enemy.x) || !finite(enemy.y)) return true;
      const radius = settings.clearRadius + (finite(enemy.radius) ? Math.max(0, enemy.radius) : 0);
      if (dist(enemy, here) <= radius || dist(enemy, node) <= radius) return true;
    }
    return false;
  }
  function fighting(scene) {
    if (!scene.auto.on || !scene.auto.target) return false;
    const target = scene.views.get(scene.auto.target);
    return !target || !target.dead;
  }
  function farmAllowed(scene) {
    // Revoking permission does not interrupt a harvest already acknowledged by the game.
    return !scene.auto.on || settings.allowFarm
      || (job?.phase === "harvesting" && scene.harvesting && scene.harvestNode === job.index);
  }
  function steer(scene, x, y) {
    if (scene.autoX !== x) scene.autoX = x;
    if (scene.autoY !== y) scene.autoY = y;
    if (job) job.steer = [x, y];
  }
  function trace(event, code) {
    if (!debugEnabled || !job || !binding) return;
    const scene = binding.scene;
    const distance = dist({ x: scene.px, y: scene.py }, job.node);
    window.postMessage({ channel: "gst:harvest-status:v1", type: "harvest-event",
      event, code, attempt: job.attempt, node: job.index, phase: job.phase,
      elapsedMs: Math.round(performance.now() - job.startAt),
      distance: finite(distance) ? Math.round(distance * 100) / 100 : null,
      ready: job.node.ready === true,
      fixChanged: finite(job.startFix) && finite(scene.self?.fix) ? scene.self.fix !== job.startFix : null }, origin);
  }
  function release(reason, cooldown = 0, code = "yield") {
    trace("harvest.release", code);
    if (job && binding) {
      const scene = binding.scene;
      if (job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1]) {
        scene.autoX = 0;
        scene.autoY = 0;
      }
      if (cooldown) skipped.set(job.node, performance.now() + cooldown);
    }
    job = null;
    safeSince = null;
    if (reason) message = reason;
  }
  function detach() {
    release(undefined, 0, "detach");
    window.removeEventListener("keydown", onKey, true);
    const old = binding;
    binding = null;
    if (!old) return;
    old.scene.events.off("preupdate", onFrame);
    old.scene.events.off("shutdown", onShutdown);
    old.scene.events.off("destroy", onShutdown);
    if (old.auto.update === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.auto, "update", old.descriptor);
      else delete old.auto.update;
    }
    for (const { key, wrapper, descriptor } of old.methods) {
      if (old.scene[key] !== wrapper) continue;
      if (descriptor) Object.defineProperty(old.scene, key, descriptor);
      else delete old.scene[key];
    }
    skipped.clear();
  }
  function wrapMethod(scene, key, makeWrapper) {
    const descriptor = Object.getOwnPropertyDescriptor(scene, key);
    const wrapper = makeWrapper(scene[key]);
    scene[key] = wrapper;
    binding.methods.push({ key, wrapper, descriptor });
  }
  function pauseManual(reason, code) {
    manualUntil = performance.now() + 3000;
    release(reason, 0, code);
  }
  function onShutdown() {
    detach();
    recovery = null;
    message = "Đã rời scene; chờ map mới.";
    watch();
  }
  function watch() {
    if (settings.enabled && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000);
  }
  function discover() {
    if (!settings.enabled || suspended || binding) return;
    try {
      const scene = sceneNow();
      if (recovery && recovery.scene !== scene) recovery = null;
      if (!compatible(scene) || !connected(scene) || scene.leaving || !finite(scene.px) || !finite(scene.py)) {
        message = "Chờ game, kết nối hoặc dữ liệu thu hoạch.";
        return;
      }
      if (scene.self.dead) {
        recovery ??= { scene, home: null, aliveAt: null };
        recovery.aliveAt = null;
        if (modalOpen(true) || scene.overlay?.dialogOpen || scene.keyCapture) {
          message = "Đã chết; chờ bạn xử lý hộp thoại trước khi tự hồi sinh.";
        } else message = settings.autoRespawn ? GSTHarvest.respawn(scene)
          : "Đã chết; bật Tự hồi sinh rồi tiếp tục hái, hoặc hồi sinh bằng tay.";
        return;
      }
      if (recovery) {
        GSTHarvest.respawn(scene); // Alive: clear the shared once-per-death request state.
        if (scene.auto.on && scene.auto.deadAt > 0) {
          recovery.aliveAt = null;
          message = "Đã hồi sinh; chờ Auto Farm hoàn tất xử lý hồi sinh.";
          return;
        }
        recovery.aliveAt ??= performance.now();
        if (performance.now() - recovery.aliveAt < 2000) {
          message = "Đã hồi sinh; chờ ổn định 2 giây rồi tiếp tục Tự hái.";
          return;
        }
      }
      const auto = scene.auto;
      const original = auto.update;
      const descriptor = Object.getOwnPropertyDescriptor(auto, "update");
      const home = recovery?.home ?? GSTHarvest.farmOrigin(scene)
        ?? (auto.on ? { x: auto.ax, y: auto.ay } : { x: scene.px, y: scene.py });
      if (!finite(home.x) || !finite(home.y)) { message = "Chờ vị trí gốc hợp lệ."; return; }
      const wrapper = function (...args) {
        // Native update remains responsible for combat/death/respawn whenever we yield.
        if (binding?.auto === this && job) {
          try {
            if (!blocked(scene) && farmAllowed(scene) && !fighting(scene) && !danger(scene, job.node)) return;
          } catch { /* Yield to the native update if a runtime interface changes. */ }
          release("Nhường lại cho game; tạm dừng thu hoạch.", 0, "yield_native");
        }
        return original.apply(this, args);
      };
      auto.update = wrapper;
      binding = { scene, auto, wrapper, descriptor, home: { ...home }, farmOn: auto.on, methods: [] };
      wrapMethod(scene, "move", (originalMove) => function (...args) {
        if (binding?.scene !== this || !job || this.auto.on || !browsingUI(this) || blocked(this)) {
          return originalMove.apply(this, args);
        }
        // Native move otherwise freezes with a panel/chat open when Auto Farm is off.
        // Scope the exception to this synchronous movement call only. Native keyboard
        // guards, collision, locks, death and harvesting checks still run unchanged.
        const own = Object.getOwnPropertyDescriptor(this, "uiBlocked");
        if (own && !own.configurable) return originalMove.apply(this, args);
        Object.defineProperty(this, "uiBlocked", { configurable: true, get: () => false });
        try { return originalMove.apply(this, args); }
        finally {
          if (own) Object.defineProperty(this, "uiBlocked", own);
          else delete this.uiBlocked;
        }
      });
      wrapMethod(scene, "useSkill", (originalSkill) => function (...args) {
        // Game calls from its Auto Farm/held attack/queued skill pass manual=false.
        // Default/manual calls also cover clicking a skill button, without changing it.
        if (binding?.scene === this && args[2] !== false && !this.dead
            && !(this.uiBlocked && !this.auto.on)) {
          pauseManual("Tạm dừng 3 giây sau lệnh đánh/tung chiêu tay.", "manual_skill");
        }
        return originalSkill.apply(this, args);
      });
      wrapMethod(scene, "startClickOrder", (originalOrder) => function (...args) {
        if (binding?.scene === this) {
          pauseManual("Tạm dừng 3 giây sau lệnh chuột di chuyển/chiến đấu.", "manual_pointer");
        }
        return originalOrder.apply(this, args);
      });
      GSTHarvest.controls = (current) => binding?.scene === current && job !== null;
      scene.events.on("preupdate", onFrame);
      scene.events.on("shutdown", onShutdown);
      scene.events.on("destroy", onShutdown);
      window.addEventListener("keydown", onKey, true);
      recovery = null;
      clearInterval(watcher);
      watcher = null;
      lastStep = -Infinity;
      message = "Đang tìm cây trong vùng đã chọn.";
    } catch {
      detach();
      message = "Chưa tương thích dữ liệu thu hoạch; chờ game.";
    }
  }
  function matches(node) {
    return node && !node.ore && typeof node.item === "string" && finite(node.x) && finite(node.y)
      && (settings.mode === "all" || settings.items.includes(node.item.normalize("NFC")));
  }
  function passedPoint(scene, pos, point, next, host) {
    const previous = job.previous;
    if (!previous || !finite(scene.self.fix) || scene.self.fix !== previous.fix) return false;
    const dx = pos.x - previous.x, dy = pos.y - previous.y;
    const square = dx * dx + dy * dy;
    if (square < 1e-10) return false;
    const along = ((point[0] - previous.x) * dx + (point[1] - previous.y) * dy) / square;
    return along > 0 && along < 1
      && Math.hypot(previous.x + along * dx - point[0], previous.y + along * dy - point[1]) < 0.5
      && host.clear(pos.x, pos.y, next[0], next[1]);
  }
  function step(scene, now) {
    const reason = blockedReason(scene)
      || (!farmAllowed(scene) ? "Tạm dừng: chưa cho phép hái khi Auto Farm bật." : null)
      || (fighting(scene) ? "Chờ Auto Farm kết thúc mục tiêu chiến đấu hiện tại." : null)
      || (!finite(scene.px) || !finite(scene.py) ? "Chờ tọa độ nhân vật hợp lệ." : null);
    if (reason) {
      release(reason, 0, "blocked");
      return;
    }
    if (job?.phase === "request" || job?.phase === "harvesting") {
      steer(scene, 0, 0);
      if (scene.harvesting && scene.harvestNode === job.index) {
        if (job.phase !== "harvesting") {
          job.phase = "harvesting";
          trace("harvest.ack", "started");
        }
        message = `Đang hái ${job.node.item}.`;
      } else if (job.phase === "harvesting") release("Lượt hái đã kết thúc; đang quan sát lại.", 20000, "harvest_ended");
      else if (!job.node.ready || now - job.requestedAt > 4000) release("Chưa xác nhận lượt hái; tạm bỏ qua cây này.", 20000,
        !job.node.ready ? "node_unavailable_before_ack" : "request_timeout");
      return;
    }
    if (scene.harvesting) {
      release("Chờ lượt thu hoạch hiện tại kết thúc.");
      return;
    }
    if (settings.mode === "selected" && !settings.items.length) {
      release("Chưa chọn loại cây; không tự hái.");
      return;
    }
    const host = scene.autoHost();
    if (typeof host?.route !== "function" || typeof host.clear !== "function") {
      release("Game chưa cung cấp đường đi phù hợp.");
      return;
    }
    if (!job && scene.auto.on && typeof host.loot === "function" && host.loot().some((loot) =>
      dist(loot, { x: scene.px, y: scene.py }) < 11
      && !scene.auto.lootSkip?.has(`${loot.x.toFixed(1)},${loot.y.toFixed(1)}`))) {
      message = "Chờ Auto Farm nhặt chiến lợi phẩm.";
      safeSince = null;
      return;
    }
    if (!job) {
      const candidates = scene.nodes.map((node, index) => ({ node, index }))
        .filter(({ node }) => matches(node) && node.ready && dist(node, binding.home) <= settings.radius
          && (skipped.get(node) ?? 0) <= now)
        .sort((a, b) => dist(a.node, { x: scene.px, y: scene.py }) - dist(b.node, { x: scene.px, y: scene.py }));
      const next = candidates.find(({ node }) => !danger(scene, node));
      if (!next) {
        message = candidates.length ? "Chờ sạch quái quanh nhân vật và cây." : "Không có cây phù hợp sẵn sàng trong vùng.";
        safeSince = null;
        return;
      }
      if (!safeSince || safeSince.node !== next.node) safeSince = { node: next.node, at: now };
      if (now - safeSince.at < 1000) {
        message = settings.ignoreMonsters ? "Chờ 1 giây trước khi tới cây; đang bỏ qua quái gần."
          : "Chờ khu vực an toàn ổn định 1 giây.";
        return;
      }
      job = { ...next, attempt: ++attempt, startFix: scene.self.fix, phase: "moving", path: [], routeAt: -Infinity, startAt: now,
        progressAt: now, x: scene.px, y: scene.py, steer: null };
      trace("harvest.start", "selected");
    }
    const node = job.node;
    if (scene.nodes[job.index] !== node || !matches(node) || !node.ready || dist(node, binding.home) > settings.radius) {
      release("Cây đã thay đổi hoặc không còn phù hợp.", 5000, "target_changed");
      return;
    }
    if (danger(scene, node)) { release("Có quái gần; nhường lại cho game.", 0, "danger"); return; }
    const pos = { x: scene.px, y: scene.py };
    if (dist(pos, node) <= settings.reach) {
      steer(scene, 0, 0);
      const picked = scene.pickTarget();
      const cached = scene.target;
      if (picked?.node !== job.index || "gate" in picked || "realm" in picked) {
        release("Mục tiêu F chưa đúng cây; bỏ qua để tránh cổng/NPC.", 20000, "interaction_target_other");
        return;
      }
      if (cached?.node !== job.index || "gate" in cached || "realm" in cached) {
        job.targetWaitAt ??= now;
        if (now - job.targetWaitAt > 500) release("Mục tiêu F của game chưa cập nhật đúng cây; tạm bỏ qua.", 20000, "interaction_cache_timeout");
        else message = "Chờ game cập nhật mục tiêu F đúng cây.";
        return;
      }
      job.targetWaitAt = null;
      // Recheck directly before the native F action; never force scene.target.
      if (blocked(scene, true) || danger(scene, node) || !node.ready) { release("Tạm dừng tương tác.", 0, "pre_interaction_blocked"); return; }
      job.phase = "request";
      job.requestedAt = now;
      trace("harvest.request", "native_F");
      try {
        if (scene.panels?.open) {
          // Exact native node branch: interact() would close the inventory and return.
          // Target guards above still apply; never synthesize F or close the user's UI.
          scene.sendMove();
          scene.harvestNode = job.index;
          scene.act("harvest", String(job.index));
        } else scene.interact();
      }
      catch { release("Lỗi khi gọi tương tác của game; tạm bỏ qua.", 20000, "interact_error"); return; }
      message = `Đã yêu cầu hái ${node.item}; chờ game xác nhận.`;
      return;
    }
    if (dist(pos, { x: job.x, y: job.y }) > 0.2) {
      job.x = pos.x; job.y = pos.y; job.progressAt = now;
    }
    if (now - job.progressAt > 5000 || now - job.startAt > 15000) {
      release("Không tới được cây; tạm bỏ qua.", 20000, now - job.progressAt > 5000 ? "stalled" : "approach_timeout");
      return;
    }
    let goal = node;
    if (!host.clear(pos.x, pos.y, node.x, node.y)) {
      if (!job.path.length || now - job.routeAt > 1500) {
        const path = host.route(pos.x, pos.y, node.x, node.y);
        if (!Array.isArray(path) || !path.length || path.some((p) => !Array.isArray(p) || p.length !== 2 || !p.every(finite))) {
          release("Không tìm được đường tới cây.", 20000, "no_path"); return;
        }
        job.path = path.map((p) => [...p]);
        job.previous = null;
        job.routeAt = now;
      }
      while (job.path.length > 1 && (dist(pos, { x: job.path[0][0], y: job.path[0][1] }) < 0.5
          || passedPoint(scene, pos, job.path[0], job.path[1], host))) job.path.shift();
      goal = { x: job.path[0][0], y: job.path[0][1] };
      if (!host.clear(pos.x, pos.y, goal.x, goal.y)) { release("Đường bị chặn; tạm bỏ qua cây.", 20000, "path_blocked"); return; }
    } else job.path = [];
    const length = dist(pos, goal);
    steer(scene, length > 0.05 ? (goal.x - pos.x) / length : 0, length > 0.05 ? (goal.y - pos.y) / length : 0);
    job.previous = { ...pos, fix: scene.self.fix };
    message = `Đang tới ${node.item}.`;
  }
  function onFrame() {
    try {
      const scene = binding?.scene;
      if (sceneNow() !== scene || !compatible(scene) || scene.auto !== binding.auto
          || scene.auto.update !== binding.wrapper || !connected(scene) || scene.leaving) {
        detach(); message = "Tạm dừng: scene hoặc kết nối thay đổi."; watch(); return;
      }
      if (scene.self.dead) {
        recovery = { scene, home: { ...binding.home }, aliveAt: null };
        detach(); message = "Đã chết; dừng di chuyển và chờ hồi sinh để tiếp tục hái."; watch(); return;
      }
      if (scene.auto.on !== binding.farmOn) {
        binding.farmOn = scene.auto.on;
        if (scene.auto.on) {
          if (job?.phase !== "harvesting") release();
          binding.home = { ...(GSTHarvest.farmOrigin(scene) ?? { x: scene.auto.ax, y: scene.auto.ay }) };
        }
      }
      const now = performance.now();
      if (!job && now - lastStep < 200) return;
      lastStep = now;
      step(scene, now);
    } catch {
      detach(); message = "Lỗi interface thu hoạch; đã dọn điều khiển, chờ game."; watch();
    }
  }
  function status(requestId) {
    const scene = sceneNow();
    const names = new Set();
    for (const area of scene?.world?.herbs?.scenes ?? []) {
      for (const node of area.nodes ?? []) if (!node.ore && typeof node.item === "string") names.add(node.item.normalize("NFC"));
    }
    const here = new Set((scene?.nodes ?? []).filter((n) => !n.ore && typeof n.item === "string")
      .map((n) => n.item.normalize("NFC")));
    window.postMessage({ channel: "gst:harvest-status:v1", requestId, message,
      enabled: settings.enabled, configKey: JSON.stringify(settings),
      available: names.size > 0,
      catalog: [...names].slice(0, 200).map((name) => ({ name, inMap: here.has(name) })) }, origin);
  }
  function applyPreferences(value) {
    const next = GSTHarvest.normalize(value);
    const changed = JSON.stringify(next) !== JSON.stringify(settings);
    settings = next;
    if (!changed) {
      if (settings.enabled) { watch(); discover(); }
      return;
    }
    if (job?.phase === "request" && binding?.scene.harvesting && binding.scene.harvestNode === job.index) {
      job.phase = "harvesting";
      trace("harvest.ack", "started");
    }
    if (!settings.enabled) {
      detach();
      recovery = null;
      clearInterval(watcher); watcher = null;
      message = "Tự hái đã tắt; không hủy lượt hái game đã bắt đầu.";
    } else {
      // Keep an outstanding F request until its acknowledgement/timeout even
      // when options change, so toggling a checkbox cannot resend it early.
      if (job?.phase === "moving") release("Đã đổi cài đặt; đang quan sát lại.");
      watch(); discover();
    }
    safeSince = null;
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:harvest:v1") return;
    if (event.data.type === "debug-configure") { debugEnabled = event.data.enabled === true; return; }
    if (event.data.type === "diagnostics") {
      if (event.data.enabled === true) debugEnabled = true;
      window.postMessage({ channel: "gst:harvest-status:v1", type: "diagnostics", requestId: event.data.requestId,
        debug: { build: "harvest-main-log-4-revive", world: "MAIN", helper: typeof globalThis.GSTHarvest,
          normalize: typeof globalThis.GSTHarvest?.normalize,
          optionsBuild: globalThis.__gstHarvestOptionsLoad?.build ?? "missing",
          enabled: settings.enabled, scene: binding !== null, controlling: job !== null } }, origin);
      return;
    }
    if (event.data.type === "status" || event.data.type === "synchronize") {
      try {
        // A synchronized read applies the stored intent before reporting state
        // in this same handler; ordinary overlay status requests remain read-only.
        if (event.data.type === "synchronize") applyPreferences(event.data.preferences);
        status(event.data.requestId);
      } catch {
        window.postMessage({ channel: "gst:harvest-status:v1", requestId: event.data.requestId,
          message: "Chờ dữ liệu tài nguyên của game.", enabled: settings.enabled, configKey: JSON.stringify(settings),
          available: false, catalog: [] }, origin);
      }
      return;
    }
    if (event.data.type !== "configure") return;
    applyPreferences(event.data.preferences);
    window.postMessage({ channel: "gst:harvest-status:v1", type: "configured", requestId: event.data.requestId,
      enabled: settings.enabled, configKey: JSON.stringify(settings) }, origin);
  });
  function onKey(event) {
    if (!binding || !event.isTrusted || document.hidden || !document.hasFocus()) return;
    const scene = binding.scene;
    if (event.isComposing || scene.chat?.typing || scene.inputFieldActive?.() || scene.keyCapture
        || event.target?.closest?.("input,textarea,select,[contenteditable]:not([contenteditable='false'])")) return;
    const keys = ["W", "A", "S", "D", "SPACE", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "Q", "H", "F"];
    if (keys.some((key) => scene.controls?.bindings?.[key] === event.keyCode)
        || [37, 38, 39, 40].includes(event.keyCode)) {
      pauseManual("Tạm dừng 3 giây sau lệnh di chuyển/chiến đấu/tương tác tay.", "manual_key");
    }
  }
  window.addEventListener("pagehide", () => {
    suspended = true; detach(); recovery = null; clearInterval(watcher); watcher = null;
  });
  window.addEventListener("pageshow", () => {
    suspended = false; watch(); discover();
  });
  window.postMessage({ channel: "gst:harvest-status:v1", ready: true }, origin);
})();
