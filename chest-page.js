(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let settings = { enabled: false, allowFarm: false, kind: "all" }, binding = null, job = null, timer = null;
  let suspended = false, manualUntil = 0, message = "Auto nhặt rương đang tắt.";
  const skipped = new Map();
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  const finite = Number.isFinite;
  function release(text, skip = false, outcome = "ended") {
    if (job) globalThis.GSTRealmHistory?.record("chest", binding?.scene, job, text, outcome);
    if (job && binding) {
      if (skip) skipped.set(job.id, performance.now() + 30000);
      const scene = binding.scene;
      GSTNavigation.cancel(scene, job.navigation);
      if (scene.auto === binding.auto && job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1]) scene.autoX = scene.autoY = 0;
      if (scene.auto === binding.auto && scene.auto?.on && scene.auto.target === job.target) { scene.auto.chaseSince = scene.now(); scene.auto.think = 0; }
    }
    job = null; if (text) message = text;
  }
  function manual(scene) {
    return scene.pendingSkill || scene.aiming || scene.heldAttack || GSTFarmInput.movement(scene)
      || (scene.auto.on && (scene.auto.moved || scene.now() < scene.auto.pauseUntil));
  }
  function blockedReason(scene) {
    const driver = scene.driver;
    if (!settings.enabled) return "Tự tìm và mở rương đang tắt.";
    if (!scene.self || scene.self.dead) return "Nhân vật đã chết/chưa sẵn sàng; chờ hồi sinh.";
    if (scene.leaving || !driver || driver.closing || driver.reconnecting || driver.displaced
        || !(driver.online === false || driver.link?.open?.() === true)) return "Chờ kết nối game/scene ổn định.";
    if (!scene.self.realm?.inside) return "Chờ vào bí cảnh để tìm rương.";
    if (globalThis.GSTQuest?.active(scene)) return "Đang nhường Auto Quest. Bấm Dừng Auto Quest nếu muốn mở rương.";
    if (scene.self.realm.inside.protection > 0) return `Chờ hết bảo vệ bí cảnh · còn ${Math.ceil(scene.self.realm.inside.protection)} giây.`;
    if (scene.keyCapture) return "Chờ kết thúc đặt phím trong game.";
    if (scene.uiBlocked || scene.overlay?.dialogOpen) return "Đóng bảng/hội thoại của game để mục tiêu F rương hoạt động.";
    if (scene.harvesting) return "Game đang ghi nhận một lượt thu hoạch; chờ kết thúc.";
    if (scene.self.med || scene.auto.resting) return "Chờ kết thúc bế quan/hồi phục của game.";
    if (scene.self.fish) return "Chờ kết thúc câu cá.";
    if (GSTFarmBehavior.controls(scene)) return "Đang nhường lượt né quái.";
    if (GSTFarmMap.controls(scene)) return "Đang nhường di chuyển tới mục tiêu farm. Dừng Auto Farm nếu muốn chỉ mở rương.";
    if (GSTFarmSeals?.controls(scene)) return "Đang nhường phá phong ấn.";
    if (scene.auto.on && !settings.allowFarm) return "Auto Farm đang bật: tick Cho phép nhặt khi Auto Farm bật, hoặc tắt Auto Farm.";
    if (scene.auto.on && GSTHarvest.needsRecovery(scene)) return "Chờ Auto Farm hồi HP/MP theo cài đặt của game.";
    if (manual(scene)) return "Chờ kết thúc lệnh đi tay/ngắm chiêu/giữ phím đánh.";
    if (performance.now() < manualUntil) return "Nhường thao tác tay; chờ ổn định 3 giây.";
    return "";
  }
  const blocked = (scene) => blockedReason(scene) !== "";
  function guard() {
    try {
      const scene = binding?.scene; if (!scene) return;
      if (sceneNow() !== scene || !scene.sys?.isActive?.() || scene.auto !== binding.auto) { detach(); watch(); return; }
      if (manual(scene) || job && scene.castAt !== job.castAt) { manualUntil = performance.now() + 3000; release("Nhường thao tác tay; tiếp tục sau 3 giây."); }
      if (job && blocked(scene)) release(blockedReason(scene));
      if (scene.self?.dead && settings.enabled) GSTHarvest.respawn(scene);
    } catch { detach(); watch(); }
  }
  function danger(scene, chest) {
    return [...scene.views.values()].some((actor) => actor.k === "m" && !actor.dead && actor.st?.cls !== "pet"
      && Math.min(Math.hypot(actor.x - scene.px, actor.y - scene.py), Math.hypot(actor.x - chest.x, actor.y - chest.y)) < 6);
  }
  function update(host, time) {
    const scene = binding?.scene;
    try {
      if (!scene) return false;
      const reason = blockedReason(scene);
      if (reason) { release(reason); return false; }
      if (typeof host.inCombat !== "function" || typeof host.enemies !== "function") { release(); return false; }
      if (host.inCombat() || scene.auto.on && host.enemies().some((enemy) => enemy.id === scene.auto.target && !enemy.dead)) {
        release("Chờ Auto Farm kết thúc mục tiêu/giao tranh hiện tại."); return false;
      }
      if (performance.now() - binding.modalAt > 250) {
        binding.modalAt = performance.now();
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
      }
      if (binding.modal) { release("Chờ bạn xử lý hộp kiểm tra người chơi."); return false; }
      const list = scene.self.realm.inside.chests;
      if (!Array.isArray(list) || !finite(time)) { release(); return false; }
      for (const [id, at] of skipped) if (performance.now() >= at) skipped.delete(id);
      const chests = list.filter((chest) => (typeof chest.id === "string" || Number.isSafeInteger(chest.id))
        && finite(chest.x) && finite(chest.y) && finite(scene.map?.w) && finite(scene.map?.h)
        && chest.x >= 0 && chest.y >= 0 && chest.x < scene.map.w && chest.y < scene.map.h && (!chest.owner || chest.owner === scene.profile?.name)
        && (settings.kind === "all" || chest.kind === settings.kind));
      if (job && !chests.some((chest) => chest.id === job.id)) {
        const stillExists = list.some((chest) => chest.id === job.id);
        release(stillExists ? "Rương còn nhưng quyền sở hữu/loại/tọa độ không còn phù hợp; đã bỏ mục tiêu."
          : "Rương không còn trong danh sách game; chưa xác nhận nhận đồ.", false, stillExists ? "ended" : "disappeared"); return false;
      }
      if (!job) {
        if (performance.now() - binding.scanAt < 1000) return false; binding.scanAt = performance.now();
        const next = chests.filter((chest) => !skipped.has(chest.id) && !danger(scene, chest))
          .sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py) - Math.hypot(b.x - scene.px, b.y - scene.py))[0];
        if (!next) {
          message = !list.length ? "Game chưa gửi rương trong bí cảnh này; chưa có tọa độ để tự đi tới."
            : !chests.length ? `Có ${list.length} rương nhưng không khớp loại, quyền sở hữu hoặc tọa độ hợp lệ.`
            : chests.every((chest) => skipped.has(chest.id)) ? `Có ${chests.length} rương phù hợp đang tạm bỏ; chờ tối đa 30 giây.`
            : "Có rương phù hợp nhưng đang có quái trong 6 ô quanh nhân vật hoặc rương; chờ an toàn.";
          return false;
        }
        const navigation = Object.assign(Object.create(scene.auto), { path: [], pathAt: -Infinity,
          lastX: scene.px, lastY: scene.py, stillSince: time, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0 });
        job = { id: next.id, point: { x: next.x, y: next.y }, logStartedAt: performance.now(), phase: "moving", navigation, target: scene.auto.target, castAt: scene.castAt,
          progressAt: time,
          startedAt: time, replans: 0, replanAt: -Infinity,
          requestedAt: null, steer: null };
      }
      const chest = chests.find((item) => item.id === job.id);
      if (danger(scene, chest)) { release("Có quái gần rương; tạm bỏ qua.", true); return false; }
      const distance = Math.hypot(chest.x - scene.px, chest.y - scene.py), owner = job;
      const walking = { ...host, steer: (x, y) => { scene.autoX = x; scene.autoY = y; owner.steer = [x, y]; } };
      if (job.requestedAt !== null) {
        walking.steer(0, 0);
        if (time - job.requestedAt > 8) { release("Chưa xác nhận mở rương; bỏ qua 30 giây, không spam F.", true); return false; }
        return true;
      }
      if (GSTNavigation.progressed(scene, job, job.navigation.path, chest.x, chest.y)) job.progressAt = time;
      if (time - job.progressAt > 8 || time - job.startedAt > 120) {
        release("Chưa tiếp cận/mở được rương trong thời gian cho phép; bỏ qua 30 giây.", true); return false;
      }
      if (distance > 1.8) {
        if (time - job.progressAt > 2 && job.replans < 2 && time - job.replanAt >= 2) {
          job.navigation.path = []; job.navigation.pathAt = -Infinity;
          job.replans++; job.replanAt = time;
        }
        if (!GSTNavigation.walk(scene, job.navigation, walking, time, scene.px, scene.py, chest.x, chest.y, 1.5)) {
          release("Đường tới rương bị chặn; tạm bỏ qua.", true); return false;
        }
        message = `${time - job.replanAt < 1 ? "Đang tính lại đường tới rương" : "Đang tự đi tới rương bí cảnh"} · còn ${distance.toFixed(1)} ô.`;
        return true;
      }
      walking.steer(0, 0);
      const fresh = scene.pickTarget();
      job.freshTarget = globalThis.GSTRealmHistory?.target(fresh);
      const picked = fresh?.realm, cached = scene.target?.realm;
      job.targetMatched = picked?.action === "realm-chest" && picked.arg === job.id && cached?.action === "realm-chest" && cached.arg === job.id;
      if (picked?.action !== "realm-chest" || picked.arg !== job.id || cached?.action !== "realm-chest" || cached.arg !== job.id) {
        job.phase = "waiting_target";
        const action = picked?.action ?? "chưa có";
        message = picked?.action === "realm-chest" && picked.arg === job.id
          ? "Đã nhận đúng rương; chờ game cập nhật mục tiêu F đã lưu."
          : `Đã tới rương nhưng mục tiêu F là ${action}; chưa bấm để tránh nhầm cổng/rương khác.`;
        return true;
      }
      if (blocked(scene)) { release(); return false; }
      job.phase = "request"; job.requestedAt = time; scene.interact(); message = "Đã yêu cầu mở đúng rương; chờ game xác nhận."; return true;
    } catch { release("Interface rương chưa phù hợp; nhường lại game.", true); return false; }
  }
  function detach() {
    release(); const old = binding; binding = null;
    if (old) { old.remove(); old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown); }
    skipped.clear();
  }
  function shutdown() { detach(); watch(); }
  function discover() {
    try {
      const scene = sceneNow();
      if (!settings.enabled || suspended || binding || !scene?.sys?.isActive?.() || !scene.self
          || typeof scene.auto?.walk !== "function" || typeof scene.pickTarget !== "function" || typeof scene.interact !== "function"
          || typeof scene.now !== "function" || typeof scene.auto.update !== "function"
          || typeof scene.views?.values !== "function" || !scene.events?.on || !scene.events.off) return;
      binding = { scene, auto: scene.auto, remove: GSTFarmUpdate.add(scene, 15, update), modalAt: -Infinity, modal: false, scanAt: -Infinity };
      scene.events.on("preupdate", guard); scene.events.on("shutdown", shutdown); scene.events.on("destroy", shutdown);
      clearInterval(timer); timer = null;
    } catch { detach(); }
  }
  function watch() { if (settings.enabled && !suspended && !binding && timer === null) timer = setInterval(discover, 1000); }
  globalThis.GSTChest = {
    controls: (scene) => !!binding && binding.scene === scene && job !== null,
    ready(scene) {
      try {
        if (binding?.scene !== scene || blocked(scene) || binding.modal) return false;
        const host = scene.autoHost();
        if (host.inCombat() || host.enemies().some((enemy) => enemy.id === scene.auto.target && !enemy.dead)) return false;
        return (scene.self.realm.inside.chests ?? []).some((chest) =>
          (typeof chest.id === "string" || Number.isSafeInteger(chest.id)) && finite(chest.x) && finite(chest.y)
          && chest.x >= 0 && chest.y >= 0 && chest.x < scene.map.w && chest.y < scene.map.h
          && (!chest.owner || chest.owner === scene.profile?.name) && (settings.kind === "all" || chest.kind === settings.kind)
          && !(skipped.get(chest.id) > performance.now()) && Math.hypot(chest.x - scene.px, chest.y - scene.py) <= 6
          && !danger(scene, chest));
      } catch { return false; }
    }
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:chest:v1") return;
    const data = event.data;
    if (data.type === "configure") {
      const value = data.preferences;
      const next = { enabled: value?.enabled === true, allowFarm: value?.allowFarm === true,
        kind: ["common", "hidden", "treasure"].includes(value?.kind) ? value.kind : "all" };
      if (JSON.stringify(next) !== JSON.stringify(settings)) release("Đã đổi cài đặt rương.");
      settings = next;
      if (!settings.enabled) { detach(); clearInterval(timer); timer = null; message = "Auto nhặt rương đang tắt."; }
      else { message = "Auto nhặt rương đã bật; chờ vào bí cảnh và có rương phù hợp/an toàn."; watch(); discover(); }
    }
    let current = message;
    try {
      if (settings.enabled) current = binding ? (blockedReason(binding.scene) || message)
        : "Đã bật nhưng chưa gắn được bộ điều khiển rương; kiểm tra timer và tải lại game.";
    } catch { current = "Chưa đọc được điều kiện mở rương của game; tải lại trang để kết nối lại."; }
    window.postMessage({ channel: "gst:chest-status:v1", requestId: data.requestId, message: [current, globalThis.GSTBackground?.status()].filter(Boolean).join(" "), enabled: settings.enabled }, origin);
  });
  globalThis.GSTRealmHistory?.register("chest", () => {
    const scene = binding?.scene;
    return { enabled: settings.enabled, attached: !!binding, phase: job?.phase || "idle",
      message, count: Array.isArray(scene?.self?.realm?.inside?.chests) ? scene?.self?.realm?.inside?.chests.length : 0,
      autoOn: scene?.auto?.on === true, allowFarm: settings.allowFarm,
      protection: Number.isFinite(scene?.self?.realm?.inside?.protection) ? scene.self.realm.inside.protection : null };
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(timer); timer = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  window.postMessage({ channel: "gst:chest-status:v1", ready: true }, origin);
})();
