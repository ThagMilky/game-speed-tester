(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:quest:v1";
  let binding = null, watcher = null, suspended = false, run = null;
  let selected = [], message = "Auto Quest đang tắt. Chọn quest đã nhận rồi bấm Bắt đầu.";
  const finite = Number.isFinite, text = (v) => typeof v === "string" ? v.slice(0, 500) : "";
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  const connected = (s) => s.driver && !s.driver.closing && !s.driver.reconnecting && !s.driver.displaced
    && (s.driver.online === false || s.driver.link?.open?.() === true);
  const active = (s) => s.quests.active().filter((q) => q && Array.isArray(q.goals) && !s.quests.claimed(q.id));
  const counts = (s, q) => s.quests.progress(q.id);
  const complete = (s, q) => { const p = counts(s, q); return Array.isArray(p) && q.goals.length > 0
    && q.goals.every((g, i) => finite(g[2]) && finite(p[i]) && p[i] >= g[2]); };
  const localKill = (s, q) => q.goals.length > 0 && q.goals.every((g, i) => counts(s, q)?.[i] >= g[2]
    || (typeof g[0] === "string" && g[0] === `kill-in:${s.map.scene}`));
  const npcFor = (s, q) => s.npcs?.find((n) => n.info?.id === (q.turnIn ?? q.giver ?? "dan-dao-su"));
  const owns = (s) => !!run && binding?.scene === s;
  function zero() {
    const s = binding?.scene;
    if (s && run?.steer && s.autoX === run.steer[0] && s.autoY === run.steer[1]) s.autoX = s.autoY = 0;
  }
  function stop(reason) {
    const s = binding?.scene, old = run;
    zero(); run = null;
    if (old?.ownedAuto && s?.auto === binding?.auto) {
      try { if (s.auto.on) s.toggleAutoFarm(); }
      catch { /* Continue cleanup even if the native scene is being destroyed. */ }
      try { globalThis.GSTFarmSession?.forget(s); } catch { /* The old session may already be gone. */ }
    }
    if (reason) message = reason;
  }
  function capture(title, body) {
    const s = binding?.scene;
    if (!s || !body?.querySelectorAll) return;
    if (title === "Hành trình") {
      const quests = active(s), cards = [...body.querySelectorAll(".q")];
      binding.rewards.clear(); binding.rewardLevel = s.profile.level;
      quests.forEach((q, i) => {
        const card = cards[i];
        if (card?.querySelector("h3")?.textContent === q.title) {
          const reward = text(card.querySelector(".quest-reward")?.textContent);
          const match = reward.match(/Thưởng:\s*([\d.,]+)\s*tu vi\s*·\s*([\d.,]+)\s*linh thạch/);
          binding.rewards.set(String(q.id), { text: reward, xp: match ? Number(match[1].replace(/[.,]/g, "")) : null,
            coins: match ? Number(match[2].replace(/[.,]/g, "")) : null });
        }
      });
    }
    if (run?.phase === "dialog" && title === run.npc?.info?.name) {
      run.body = body;
      const handIn = s.quests.forNpc(run.npc.info.id)?.handIn ?? [];
      const index = handIn.findIndex((q) => String(q.id) === run.id);
      const card = [...body.querySelectorAll(".q")][index];
      const button = card?.querySelector("button");
      if (index >= 0 && card.querySelector("h3")?.textContent === run.title && button?.textContent === "Nhận thưởng") {
        run.body = body; run.button = button;
      }
    }
  }
  function snapshot() {
    const s = binding?.scene;
    if (!s) return { running: false, message, quests: [] };
    const quests = active(s).slice(0, 200).map((q) => {
      const progress = counts(s, q), done = complete(s, q), npc = npcFor(s, q);
      const reward = binding.rewardLevel === s.profile.level ? binding.rewards.get(String(q.id)) : null;
      const supported = done ? !!npc : localKill(s, q);
      return { id: String(q.id), title: text(q.title), done, supported,
        support: supported ? (done ? "Sẵn sàng trả quest trong map này" : "Hỗ trợ đánh quái trong map này")
          : "Chưa hỗ trợ mục tiêu này hoặc cần đổi map",
        progress: q.goals.map((g, i) => `${text(g[1])}: ${finite(progress?.[i]) ? progress[i] : "?"}/${g[2]}`).join(" · "),
        reward: reward?.text || "Mở N (Hành trình) của game để đọc thưởng hiện tại.", xp: reward?.xp ?? null, coins: reward?.coins ?? null };
    });
    return { running: !!run, message, quests };
  }
  function manual(s) { return GSTFarmInput.movement(s) || s.pendingSkill || s.aiming || s.heldAttack; }
  function pause(time) { run.pausedAt ??= time; zero(); }
  function tick(host, time) {
    const s = binding?.scene;
    if (!run || !s) return false;
    try {
      if (sceneNow() !== s || s.auto !== binding.auto || !connected(s) || s.leaving || !s.self || !s.profile || s.self.dead
          || s.map.scene !== run.map || s.profile.name !== run.name) {
        stop("Auto Quest đã dừng: chết, mất kết nối, đổi nhân vật hoặc đổi map. Bấm Bắt đầu để chạy lại."); return false;
      }
      const now = performance.now();
      if (now - binding.modalAt >= 250) {
        binding.modalAt = now;
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
          el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
      }
      if (manual(s)) { run.manualUntil = now + 3000; pause(time); message = "Auto Quest nhường thao tác tay; chờ ổn định 3 giây."; return true; }
      const ownedDialog = run.phase === "dialog" && run.body?.isConnected && s.panels.open;
      if (now < run.manualUntil || (!ownedDialog && GSTFarmRouting.blocked(s)) || (!ownedDialog && s.panels.open)
          || s.keyCapture || s.overlay?.dialogOpen || binding.modal
          || (document.body.classList.contains("mobile") && innerHeight > innerWidth)
          || (s.self.med && !s.auto.resting) || s.self.fish || s.harvesting || s.self.realm?.inside?.protection > 0) {
        pause(time); message = "Auto Quest đang chờ thao tác/giao diện hoặc trạng thái nhân vật ổn định."; return true;
      }
      if (run.pausedAt !== undefined) {
        const elapsed = Math.max(0, time - run.pausedAt);
        if (finite(run.progressAt)) run.progressAt += elapsed;
        if (finite(run.startedAt)) run.startedAt += elapsed;
        delete run.pausedAt;
        if (run.phase === "farm" && s.auto.on) { s.auto.chaseSince = time; s.auto.stillSince = time; s.auto.think = 0; }
      }
      // This basic version never auto-resumes an OFF toggle or revives/re-enters a map.
      if (run.phase === "farm" && !s.auto.on) { stop("Auto Farm đã tắt; Auto Quest cũng dừng."); return false; }
      if (now - run.at < 250) return run.phase !== "farm";
      run.at = now;
      const q = active(s).find((item) => String(item.id) === run.id);
      if (run.id && !q) {
        if (s.quests.claimed(run.nativeId)) {
          if (run.body?.isConnected && s.panels.open) s.panels.close();
          run.finished.add(run.id); run.id = null; run.phase = "choose";
          message = `Đã xác nhận trả quest: ${run.title}.`;
        } else { stop("Quest không còn trong danh sách; đã dừng để bạn kiểm tra."); return false; }
      }
      if (!run.id) {
        const next = active(s).find((item) => selected.includes(String(item.id)) && !run.finished.has(String(item.id))
          && (complete(s, item) ? !!npcFor(s, item) : localKill(s, item)));
        if (!next) { stop("Đã xong các quest đã chọn có thể xử lý trong map này; quest khác không bị can thiệp."); return false; }
        run.id = String(next.id); run.nativeId = next.id; run.title = next.title; run.phase = "choose";
        delete run.requestedAt; delete run.body; delete run.button;
        return true;
      }
      if (!q) return true;
      if (!complete(s, q)) {
        if (!GSTFarmQuest.ready()) { stop("Bộ lọc farm đã đổi; dừng Auto Quest để không đánh sai mục tiêu."); return false; }
        if (!localKill(s, q)) { stop("Mục tiêu còn lại chưa được bản cơ bản hỗ trợ."); return false; }
        if (run.phase !== "farm") {
          if (s.auto.on) { stop("Auto Farm bị bật ngoài lượt quest; đã dừng để tránh xung đột."); return false; }
          run.phase = "farm";
          GSTFarmQuest.prepare(s);
          s.toggleAutoFarm();
          if (!s.auto.on) { stop("Chưa bật được Auto Farm gốc; kiểm tra điều kiện trong game."); return false; }
          run.ownedAuto = true;
        }
        message = `Đang làm quest: ${q.title}. Dùng Auto Farm gốc trong phạm vi đã cài.`;
        return false;
      }
      if (s.auto.on) {
        if (!run.ownedAuto) { stop("Bạn bật Auto Farm ngoài lượt quest; Auto Quest đã nhường điều khiển."); return false; }
        s.toggleAutoFarm(); run.ownedAuto = false;
      }
      if (run.phase === "farm" || run.phase === "choose") {
        run.phase = "return"; run.npc = npcFor(s, q); run.nav = Object.assign(Object.create(s.auto), {
          path: [], pathAt: -Infinity, lastX: s.px, lastY: s.py, stillSince: time, stuckCount: 0, sideUntil: 0 });
        run.progressAt = time; run.startedAt = time;
      }
      if (!run.npc || !s.npcs.includes(run.npc)) { stop("NPC trả quest không ở map hiện tại; cần bạn tự đổi map."); return false; }
      const npc = run.npc;
      if (run.phase === "dialog") {
        zero();
        if (run.requestedAt !== undefined) {
          if (now - run.requestedAt > 8000) stop("Chưa xác nhận nhận thưởng; dừng, không tự bấm lại.");
          return true;
        }
        if (!run.body?.isConnected || !run.button?.isConnected || !s.panels.open || run.button.disabled
            || Math.hypot(npc.x - s.px, npc.y - s.py) > 1.8 || s.pickTarget() !== npc
            || !(s.quests.forNpc(npc.info.id)?.handIn ?? []).some((item) => String(item.id) === run.id)) {
          stop("Hội thoại/điều kiện trả quest thay đổi; đã dừng."); return false;
        }
        run.requestedAt = now; run.button.click();
        message = `Đã bấm Nhận thưởng cho ${q.title}; chờ game xác nhận.`;
        return true;
      }
      if (GSTNavigation.progressed(s, run.nav, run.nav.path, npc.x, npc.y)) run.progressAt = time;
      if (time - run.progressAt > 8 || time - run.startedAt > 120) { stop("Chưa tới được NPC; đã dừng để tránh chạy vòng."); return false; }
      if (Math.hypot(npc.x - s.px, npc.y - s.py) > 1.8 || !host.clear(s.px, s.py, npc.x, npc.y)) {
        const walking = { ...host, steer: (x, y) => { s.autoX = x; s.autoY = y; run.steer = [x, y]; } };
        if (!GSTNavigation.walk(s, run.nav, walking, time, s.px, s.py, npc.x, npc.y, 1.5)) {
          stop("Không có đường tới NPC trả quest."); return false;
        }
        message = `Đang về ${npc.info.name} để trả ${q.title}.`; return true;
      }
      zero();
      if (s.pickTarget() !== npc || s.target !== npc) { message = "Chờ mục tiêu F đúng NPC trả quest."; return true; }
      if (!(s.quests.forNpc(npc.info.id)?.handIn ?? []).some((item) => String(item.id) === run.id)) {
        stop("Game chưa cho phép trả quest này."); return false;
      }
      run.phase = "dialog"; s.interact();
      message = "Đã mở đúng hội thoại NPC; đang kiểm tra nút nhận thưởng.";
      return true;
    } catch { stop("Interface Auto Quest chưa tương thích; đã dừng, không tự thử lặp."); return false; }
  }
  function detach() {
    stop("Auto Quest dừng khi rời scene/trang; lựa chọn quest vẫn được giữ.");
    const old = binding; binding = null;
    if (!old) return;
    old.remove(); old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown);
    if (old.scene.panels.show === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.scene.panels, "show", old.descriptor); else delete old.scene.panels.show;
    }
  }
  function shutdown() { detach(); watch(); }
  function guard() {
    if (!run || !binding) return;
    const s = binding.scene;
    try {
      if (sceneNow() !== s || s.auto !== binding.auto || !s.sys?.isActive?.() || !connected(s) || s.leaving
          || !s.self || !s.profile || s.self.dead || s.map?.scene !== run.map || s.profile.name !== run.name) {
        stop("Auto Quest dừng do nhân vật, map hoặc kết nối thay đổi; không tự bật lại.");
      } else if (run.phase === "farm" && !s.auto.on) stop("Auto Farm đã tắt; Auto Quest cũng dừng.");
    } catch { stop("Interface quest thay đổi; đã dừng Auto Quest."); }
  }
  function discover() {
    if (binding && (sceneNow() !== binding.scene || binding.scene.auto !== binding.auto || !binding.scene.sys?.isActive?.())) detach();
    if (binding || suspended) return;
    try {
      const s = sceneNow();
      if (!s?.sys?.isActive?.() || !s.self || !s.profile || !s.map || !s.auto || !s.panels
          || !["active", "progress", "claimed", "forNpc"].every((key) => typeof s.quests?.[key] === "function")
          || !["now", "autoHost", "toggleAutoFarm", "interact", "pickTarget"].every((key) => typeof s[key] === "function")
          || typeof s.auto.walk !== "function" || typeof s.auto.update !== "function" || typeof s.panels.show !== "function") return;
      const original = s.panels.show;
      const owner = { scene: s, auto: s.auto, rewards: new Map(), modalAt: -Infinity, modal: false,
        descriptor: Object.getOwnPropertyDescriptor(s.panels, "show") };
      owner.wrapper = function (title, subtitle, body, ...rest) {
        const result = original.call(this, title, subtitle, body, ...rest);
        try { capture(title, body); } catch { /* Reading a reward must not break the game's panel. */ }
        return result;
      };
      owner.remove = GSTFarmUpdate.add(s, 3, tick); binding = owner; s.panels.show = owner.wrapper;
      s.events.on("preupdate", guard); s.events.on("shutdown", shutdown); s.events.on("destroy", shutdown);
      clearInterval(watcher); watcher = null;
    } catch { detach(); }
  }
  function watch() { if (!binding && !suspended && watcher === null) watcher = setInterval(discover, 1000); }
  globalThis.GSTQuest = {
    active: owns,
    controls: (s) => owns(s) && run.phase !== "farm"
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== channel) return;
    const data = event.data;
    try {
      discover();
      if (data.type === "configure") {
        const ids = Array.isArray(data.selected) ? data.selected.filter((id) => typeof id === "string" && id.length <= 150).slice(0, 200) : [];
        if (run && JSON.stringify(ids) !== JSON.stringify(selected)) stop("Đã đổi lựa chọn quest; bấm Bắt đầu để chạy danh sách mới.");
        selected = [...new Set(ids)];
      }
      if (data.type === "stop") stop("Bạn đã dừng Auto Quest.");
      if (data.type === "start" && !run) {
        const s = binding?.scene;
        if (!s || !connected(s) || s.self.dead || s.leaving || GSTFarmRouting.blocked(s) || s.panels.open || manual(s)) message = "Đóng bảng game và chờ nhân vật ổn định trước khi bắt đầu.";
        else if (s.auto.on) message = "Tắt Auto Farm trước; Auto Quest sẽ tự bật khi cần và tắt khi đủ mục tiêu.";
        else if (!selected.length) message = "Chọn ít nhất một quest đã nhận.";
        else if (!GSTFarmQuest.ready() && active(s).some((q) => selected.includes(String(q.id)) && !complete(s, q) && localKill(s, q))) message = "Bản cơ bản cần Quái muốn farm = Tất cả quái. Lưu lựa chọn farm rồi thử lại.";
        else if (!active(s).some((q) => selected.includes(String(q.id)) && (complete(s, q) ? npcFor(s, q) : localKill(s, q)))) message = "Chưa có quest đã chọn được hỗ trợ trong map hiện tại.";
        else { globalThis.GSTFarmSession?.forget(s); run = { map: s.map.scene, name: s.profile.name, phase: "choose", id: null, at: -Infinity,
          ownedAuto: false, manualUntil: 0, finished: new Set(), steer: null }; message = "Auto Quest đã bắt đầu; chỉ xử lý quest đã tick."; }
      }
      window.postMessage({ channel: "gst:quest-status:v1", requestId: data.requestId, ...snapshot() }, origin);
    } catch { stop("Không đọc được quest; đã dừng để kiểm tra interface game."); }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  watch();
  window.postMessage({ channel: "gst:quest-status:v1", ready: true }, origin);
})();
