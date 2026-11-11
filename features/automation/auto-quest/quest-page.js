(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:quest:v1";
  let binding = null, watcher = null, suspended = false, run = null;
  let selected = [], message = "Auto Quest đang tắt. Chọn quest rồi bấm Bắt đầu.";
  const logKey = "gst:quest-log:v1", cycleKey = "gst:quest-cycles:v1", logLimit = 300;
  const finite = Number.isFinite, text = (v) => typeof v === "string" ? v.slice(0, 500) : "";
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  const connected = (s) => s.driver && !s.driver.closing && !s.driver.reconnecting && !s.driver.displaced
    && (s.driver.online === false || s.driver.link?.open?.() === true);
  const active = (s) => s.quests.active().filter((q) => q && Array.isArray(q.goals) && !s.quests.claimed(q.id));
  const definition = (s, id) => s.quests.def?.(id) ?? s.quests.data?.quests?.find((q) => String(q.id) === String(id));
  const eligibleOffers = (s) => (s.quests.data?.quests ?? []).filter((q) => q?.repeatable === true && Array.isArray(q.goals)
    && !active(s).some((a) => String(a.id) === String(q.id)) && s.quests.available?.(q) === true);
  const counts = (s, q) => s.quests.progress(q.id);
  const complete = (s, q) => { const p = counts(s, q); return Array.isArray(p) && q.goals.length > 0
    && q.goals.every((g, i) => finite(g[2]) && finite(p[i]) && p[i] >= g[2]); };
  const localKill = (s, q) => q.goals.length > 0 && q.goals.every((g, i) => counts(s, q)?.[i] >= g[2]
    || (typeof g[0] === "string" && g[0] === `kill-in:${s.map.scene}`));
  const npcFor = (s, q) => s.npcs?.find((n) => n.info?.id === (q.turnIn ?? q.giver ?? "dan-dao-su"));
  const giverFor = (s, q) => s.npcs?.find((n) => n.info?.id === (q.giver ?? "dan-dao-su"));
  const npcInfo = (s, q, accepting = false) => {
    const id = accepting ? (q.giver ?? "dan-dao-su") : (q.turnIn ?? q.giver ?? "dan-dao-su");
    const info = s.world?.world?.npcs?.find((n) => n.id === id);
    return info ? { ...info, id } : null;
  };
  function log(kind, extra = {}) {
    const s = binding?.scene, row = { at: new Date().toISOString(), kind, cycle: run?.cycles ?? 0,
      action: run?.action ?? "", questId: run?.id ?? "", title: text(run?.title), phase: run?.phase ?? "idle",
      map: text(s?.map?.scene), npc: text(run?.npc?.info?.name), progress: extra.progress ?? "", detail: text(extra.detail ?? "") };
    try { const rows = JSON.parse(sessionStorage.getItem(logKey) || "[]"); rows.push(row); sessionStorage.setItem(logKey, JSON.stringify(rows.slice(-logLimit))); } catch { /* Logging must not interrupt game control. */ }
  }
  function logs() { try { const rows = JSON.parse(sessionStorage.getItem(logKey) || "[]"); return Array.isArray(rows) ? rows.slice(-logLimit) : []; } catch { return []; } }
  function confirmedCycles() { try { const value = Number(sessionStorage.getItem(cycleKey)); return Number.isSafeInteger(value) && value >= 0 ? value : 0; } catch { return 0; } }
  const owns = (s) => !!run && binding?.scene === s;
  function zero() {
    const s = binding?.scene;
    if (s && run?.steer && s.autoX === run.steer[0] && s.autoY === run.steer[1]) s.autoX = s.autoY = 0;
  }
  function stopOwnedNativeNavigation(s, owner) {
    if (owner?.nativeNav && s?.nav === owner.nativeNav && typeof s.stopNav === "function") {
      try { s.stopNav(); } catch { /* The game may already have released its navigation state. */ }
    }
    if (owner?.nativeRouteValue) {
      try { if (sessionStorage.getItem("kt-nav") === owner.nativeRouteValue) sessionStorage.removeItem("kt-nav"); }
      catch { /* The game's navigation record may already have expired. */ }
    }
  }
  function nativeRouteRecord() {
    try {
      const value = sessionStorage.getItem("kt-nav"), target = value ? JSON.parse(value) : null;
      return target && target.until >= Date.now() ? { value, target } : null;
    } catch { return null; }
  }
  function ownsNativeNavigation(s, owner) {
    try { if (owner?.nativeRouteValue && sessionStorage.getItem("kt-nav") === owner.nativeRouteValue) return true; }
    catch { /* Check the in-memory native navigation object below. */ }
    return !!owner?.nativeNav && s?.nav === owner.nativeNav;
  }
  function stop(reason, preserveAutoFarm = false) {
    const s = binding?.scene, old = run;
    if (old && reason) log("stopped", { detail: reason });
    stopOwnedNativeNavigation(s, old);
    zero(); run = null;
    if (old?.ownedAuto && !preserveAutoFarm && s?.auto === binding?.auto) {
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
      const native = s.quests.forNpc(run.npc.info.id) ?? {}, rows = run.action === "accept" ? native.offers ?? [] : native.handIn ?? [];
      const label = run.action === "accept" ? "Nhận nhiệm vụ" : "Nhận thưởng";
      const index = rows.findIndex((q) => String(q.id) === run.id);
      const cardIndex = index + (run.action === "accept" ? (native.handIn?.length ?? 0) : 0);
      const card = [...body.querySelectorAll(".q")][cardIndex], button = card?.querySelector("button");
      if (index >= 0 && card?.querySelector("h3")?.textContent === run.title && button?.textContent === label) run.button = button;
    }
  }
  function snapshot() {
    const s = binding?.scene;
    if (!s) return { running: false, message, quests: [] };
    const candidates = [...active(s).slice(0, 200).map((q) => ({ q, accepted: true })),
      ...eligibleOffers(s).slice(0, 200).map((q) => ({ q, accepted: false }))];
    const quests = candidates.map(({ q, accepted }) => {
      const progress = counts(s, q), done = complete(s, q), npc = npcFor(s, q);
      const reward = binding.rewardLevel === s.profile.level ? binding.rewards.get(String(q.id)) : null;
      const giver = accepted ? (q.turnIn ?? q.giver ?? "dan-dao-su") : (q.giver ?? "dan-dao-su");
      const listNpc = accepted ? npc : giverFor(s, q);
      const map = s.world?.world?.npcs?.find((n) => n.id === giver)?.scene ?? "";
      const goals = q.goals.map((g) => String(g[0] ?? "").split(":")[0]).join(", ");
      const canRun = accepted ? (done ? !!npc || !!npcInfo(s, q) : localKill(s, q))
        : localKill(s, q) && (!!listNpc || !!npcInfo(s, q, true));
      return { id: String(q.id), title: text(q.title), done, supported: canRun,
        accepted, repeatable: q.repeatable === true, npc: text(listNpc?.info?.name ?? s.world?.world?.npcs?.find((n) => n.id === giver)?.name ?? giver),
        map: text(map), goals: text(goals),
        support: canRun ? (accepted ? (done ? "Sẵn sàng trả quest trong map này" : "Hỗ trợ đánh quái trong map này") : "Có thể nhận và đánh trong map này")
          : "Chưa hỗ trợ mục tiêu này hoặc cần đổi map",
        progress: q.goals.map((g, i) => `${text(g[1])}: ${finite(progress?.[i]) ? progress[i] : "?"}/${g[2]}`).join(" · "),
        reward: reward?.text || "Mở N (Hành trình) của game để đọc thưởng hiện tại.", xp: reward?.xp ?? null, coins: reward?.coins ?? null };
    });
    return { running: !!run, message, quests, logs: logs(), cycles: confirmedCycles() };
  }
  function manual(s) { return GSTFarmInput.movement(s) || s.pendingSkill || s.aiming || s.heldAttack; }
  function pause(time) { if (run.pausedAt === undefined) log("paused", { detail: message }); run.pausedAt ??= time; zero(); }
  function tick(host, time) {
    const s = binding?.scene;
    if (!run || !s) return false;
    try {
      if (run.phase === "farm" && !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) {
        const disabled = globalThis.GSTFarmPolicy?.isDisabled?.() === true;
        stop(disabled
          ? "Auto Quest đã dừng: chế độ Disabled khóa Auto Farm; quest cần đánh quái không thể tiếp tục."
          : "Auto Quest đã dừng: chế độ Native không dùng hỗ trợ farm của extension. Auto Farm đang bật được giữ nguyên.", true);
        return false;
      }
      // The map's higher-priority owner may return false while native Auto Farm heals.
      // Keep the quest timer paused even on those native-recovery frames.
      if (globalThis.GSTMapTravel?.active(s)) {
        pause(time);
        return false;
      }
      const now = performance.now();
      if (sceneNow() !== s || s.auto !== binding.auto || !connected(s) || s.leaving || !s.self || !s.profile || s.self.dead
          || (s.map.scene !== run.map && (!run.nativeTravel || !ownsNativeNavigation(s, run) || now - run.nativeTravelAt > 180000)) || s.profile.name !== run.name) {
        stop("Auto Quest đã dừng: chết, mất kết nối, đổi nhân vật hoặc đổi map. Bấm Bắt đầu để chạy lại."); return false;
      }
      if (run.nativeTravel && s.map.scene === run.expectedMap) {
        run.map = s.map.scene; run.nativeTravel = false; run.expectedMap = "";
        run.nativeNav = s.nav ?? null;
        run.progressAt = time; run.startedAt = time; run.arrivalWaitAt = now; log("map-arrived");
      }
      if (now - binding.modalAt >= 250) {
        binding.modalAt = now;
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
          el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
      }
      if (manual(s)) {
        stopOwnedNativeNavigation(s, run); run.nativeNav = null; run.nativeRouteValue = null;
        if (run.nativeTravel) { run.nativeTravel = false; run.expectedMap = ""; }
        run.nativeRouteAttempted = false;
        run.manualUntil = now + 3000; message = "Auto Quest nhường thao tác tay; chờ ổn định 3 giây."; pause(time); return true;
      }
      const ownedDialog = run.phase === "dialog" && run.body?.isConnected && s.panels.open;
      if (now < run.manualUntil || (!ownedDialog && GSTFarmRouting.blocked(s)) || (!ownedDialog && s.panels.open)
          || s.keyCapture || s.overlay?.dialogOpen || binding.modal
          || (document.body.classList.contains("mobile") && innerHeight > innerWidth)
          || (s.self.med && !s.auto.resting) || s.self.fish || s.harvesting || s.self.realm?.inside?.protection > 0) {
        message = "Auto Quest đang chờ thao tác/giao diện hoặc trạng thái nhân vật ổn định."; pause(time); return true;
      }
      if (run.pausedAt !== undefined) {
        const elapsed = Math.max(0, time - run.pausedAt);
        if (finite(run.progressAt)) run.progressAt += elapsed;
        if (finite(run.startedAt)) run.startedAt += elapsed;
        delete run.pausedAt;
        if (run.phase === "farm" && s.auto.on) { s.auto.chaseSince = time; s.auto.stillSince = time; s.auto.think = 0; }
      }
      // Auto Farm OFF does not resume automatically; revival and re-entry remain manual.
      if (run.phase === "farm" && !s.auto.on) { stop("Auto Farm đã tắt; Auto Quest cũng dừng."); return false; }
      if (now - run.at < 250) return run.phase !== "farm";
      run.at = now;
      const q = active(s).find((item) => String(item.id) === run.id)
        ?? (run.action === "accept" ? eligibleOffers(s).find((item) => String(item.id) === run.id) : null);
      if (run.requestedAt !== undefined && finite(s.selfAt) && s.selfAt > run.snapshotAt && now - run.requestedAt > 2000) {
        if (run.action === "claim" && q && complete(s, q)) { log("rejected", { detail: "Quest remains active and complete after fresh state." }); stop("Game chưa xác nhận trả thưởng; quest vẫn đang nhận. Đã dừng mà không bấm lại."); return false; }
        if (run.action === "accept" && !active(s).some((item) => String(item.id) === run.id)
            && eligibleOffers(s).some((item) => String(item.id) === run.id)) {
          log("rejected", { detail: "Offer remains eligible after fresh state." });
          stop("Game chưa xác nhận nhận quest; offer vẫn còn đủ điều kiện. Đã dừng mà không bấm lại."); return false;
        }
      }
      if (run.action === "claim" && run.requestedAt !== undefined && finite(s.selfAt) && s.selfAt > run.snapshotAt) {
        const def = definition(s, run.nativeId);
        if (s.quests.claimed(run.nativeId) || (def?.repeatable === true && !s.quests.rec?.(run.nativeId)
            && s.quests.available?.(def) === true)) {
          if (run.body?.isConnected && s.panels.open) s.panels.close();
          run.cycles = confirmedCycles() + 1;
          try { sessionStorage.setItem(cycleKey, String(run.cycles)); } catch { /* Keep controller operation independent of storage. */ }
          log("cycle-confirmed", { detail: `Confirmed claim; completed cycles ${run.cycles}` });
          message = `Đã xác nhận chu kỳ ${run.cycles}: ${run.title}.`;
          run.requestedAt = undefined; run.action = null; run.phase = "choose"; run.npc = null;
          delete run.body; delete run.button;
          if (def?.repeatable !== true) run.finished.add(run.id);
          run.id = null;
        } else if (!q) { stop("Quest biến mất nhưng chưa có trạng thái mới xác nhận nhận thưởng; đã dừng."); return false; }
      }
      if (!run.id) {
        const next = active(s).find((item) => selected.includes(String(item.id)) && !run.finished.has(String(item.id))
          && (complete(s, item) ? (!!npcFor(s, item) || !!npcInfo(s, item)) : localKill(s, item)))
          ?? eligibleOffers(s).find((item) => selected.includes(String(item.id)) && !run.finished.has(String(item.id))
            && localKill(s, item) && (!!giverFor(s, item) || !!npcInfo(s, item, true)));
        if (!next) { stop("Chưa có quest đã chọn đủ điều kiện và hỗ trợ ngay trong map hiện tại."); return false; }
        run.id = String(next.id); run.nativeId = next.id; run.title = next.title;
        run.action = active(s).some((item) => String(item.id) === run.id) ? null : "accept";
        run.phase = "choose";
        log("cycle-started", { detail: `Repeatable=${next.repeatable === true}` });
        delete run.requestedAt; delete run.body; delete run.button;
        return true;
      }
      if (run.action === "accept" && q && finite(s.selfAt) && s.selfAt > (run.snapshotAt ?? Infinity)) {
        run.action = null; run.phase = "choose"; run.startedAt = time; run.progressAt = time;
        message = `Đã xác nhận nhận quest: ${run.title}.`; log("accept-confirmed", { progress: counts(s, q)?.join("/") });
      }
      if (run.action === "accept" && !q && run.requestedAt !== undefined) {
        if (now - run.requestedAt > 8000) { log("timeout", { detail: "accept confirmation timed out." }); stop("Hết thời gian chờ xác nhận nhận quest; dừng, không tự bấm lại."); return false; }
        return true;
      }
      if (run.action === "accept" && !q && !eligibleOffers(s).some((item) => String(item.id) === run.id)) {
        stop("Quest đã chọn không còn là offer đủ điều kiện theo game."); return false;
      }
      if (!q) return true;
      const progressText = counts(s, q)?.join("/");
      if (progressText !== run.lastProgress) { run.lastProgress = progressText; log("progress", { progress: progressText }); }
      if (!complete(s, q) && run.action !== "accept") {
        if (!GSTFarmQuest.ready()) {
          const lockedMode = !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.();
          const disabled = globalThis.GSTFarmPolicy?.isDisabled?.() === true;
          stop(lockedMode ? (disabled ? "Auto Quest đã dừng: chế độ Disabled khóa hỗ trợ farm của extension."
            : "Auto Quest đã dừng: chế độ Native không dùng hỗ trợ farm của extension.")
            : "Bộ lọc farm đã đổi; dừng Auto Quest để không đánh sai mục tiêu.", lockedMode);
          return false;
        }
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
        if (!run.action) run.action = "claim";
        run.phase = "return"; run.npc = run.action === "accept" ? s.npcs?.find((n) => n.info?.id === (q.giver ?? "dan-dao-su")) : npcFor(s, q); run.nav = Object.assign(Object.create(s.auto), {
          path: [], pathAt: -Infinity, lastX: s.px, lastY: s.py, stillSince: time, stuckCount: 0, sideUntil: 0 });
        run.progressAt = time; run.startedAt = time;
      }
      if (!run.npc || !s.npcs.includes(run.npc)) {
        const npcId = run.action === "accept" ? (q.giver ?? "dan-dao-su") : (q.turnIn ?? q.giver ?? "dan-dao-su");
        const target = npcInfo(s, q, run.action === "accept"), nativeNpc = s.ktHost?.()?.goNpc;
        if (ownsNativeNavigation(s, run)) return true;
        if (run.nativeRouteAttempted) {
          if (now - run.arrivalWaitAt < 5000) return true;
          stop("Đường đi gốc đã kết thúc nhưng NPC quest chưa xuất hiện; đã dừng."); return false;
        }
        if (target && !run.npc && typeof nativeNpc === "function") {
          if (!run.nativeTravel) {
            if (s.nav || nativeRouteRecord()) { stop("Đang có hành trình gốc khác; Auto Quest nhường và dừng để không ghi đè."); return false; }
            if (!nativeNpc(target.id, target.name ?? run.title)) {
              stop("Native navigation từ chối đường tới NPC (có thể map đang khóa). "); return false;
            }
            const route = nativeRouteRecord();
            const nativeNav = s.nav;
            const expectedMap = route?.target?.scene ?? nativeNav?.scene;
            const expectedLabel = route?.target?.label ?? nativeNav?.label;
            if (typeof expectedMap !== "string" || expectedLabel !== (target.name ?? run.title)) {
              stop("Không xác nhận được đích hành trình gốc của NPC quest đã chọn; đã dừng."); return false;
            }
            run.nativeTravel = expectedMap !== s.map.scene; run.expectedMap = run.nativeTravel ? expectedMap : ""; run.nativeTravelAt = now;
            run.nativeNav = nativeNav ?? null; run.nativeRouteValue = route?.value ?? null;
            run.nativeRouteAttempted = true; run.arrivalWaitAt = now;
            run.nav = null; log("navigation-requested", { detail: `${expectedMap} / ${target.name ?? run.title}` });
          }
          message = `Đang dùng đường đi gốc tới NPC ${run.action === "accept" ? "giao" : "trả"} quest.`; return true;
        }
        run.npc = s.npcs?.find((n) => n.info?.id === npcId);
        if (!run.npc) {
          if (run.nativeTravel) return true;
          if (target?.scene === s.map.scene) { run.arrivalWaitAt ??= now; if (now - run.arrivalWaitAt < 5000) return true; }
          stop("NPC quest chưa có trong map hiện tại hoặc native tracker không xác nhận đúng quest."); return false;
        }
      }
      const npc = run.npc;
      if (run.nativeNav && s.nav === run.nativeNav && Math.hypot(npc.x - s.px, npc.y - s.py) > 1.8) return true;
      if (run.phase === "dialog") {
        zero();
        if (run.requestedAt !== undefined) {
          if (now - run.requestedAt > 8000) { log("timeout", { detail: `${run.action} confirmation timed out.` }); stop(`Hết thời gian chờ xác nhận ${run.action === "accept" ? "nhận quest" : "nhận thưởng"}; dừng, không tự bấm lại.`); }
          return true;
        }
        const actionKey = run.action === "accept" ? "offers" : "handIn", buttonLabel = run.action === "accept" ? "Nhận nhiệm vụ" : "Nhận thưởng";
        if (!run.body?.isConnected || !run.button?.isConnected || !s.panels.open || run.button.disabled
            || Math.hypot(npc.x - s.px, npc.y - s.py) > 1.8 || s.pickTarget() !== npc
            || !(s.quests.forNpc(npc.info.id)?.[actionKey] ?? []).some((item) => String(item.id) === run.id)
            || run.button.textContent !== buttonLabel) {
          stop("Hội thoại hoặc điều kiện quest thay đổi; đã dừng."); return false;
        }
        run.requestedAt = now; run.snapshotAt = s.selfAt; run.button.click(); log(`${run.action}-requested`);
        message = `Đã gửi thao tác ${run.action === "accept" ? "nhận quest" : "nhận thưởng"} cho ${q.title}; đang chờ game xác nhận.`;
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
      const offers = s.quests.forNpc(npc.info.id) ?? {};
      if (!(offers[run.action === "accept" ? "offers" : "handIn"] ?? []).some((item) => String(item.id) === run.id)) {
        stop("Game chưa cho phép thao tác quest này."); return false;
      }
      run.phase = "dialog"; s.interact();
      message = `Đã mở hội thoại đúng NPC; kiểm tra nút ${run.action === "accept" ? "nhận quest" : "nhận thưởng"}.`;
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
      const mapChanged = s.map?.scene !== run.map;
      if (sceneNow() !== s || s.auto !== binding.auto || !s.sys?.isActive?.() || !connected(s) || s.leaving
          || !s.self || !s.profile || s.self.dead || (mapChanged && (!run.nativeTravel || !ownsNativeNavigation(s, run)
            || performance.now() - run.nativeTravelAt > 180000)) || s.profile.name !== run.name) {
        stop("Auto Quest dừng do nhân vật, map hoặc kết nối thay đổi; không tự bật lại.");
      } else if (globalThis.GSTMapTravel?.active(s)) {
        run.pausedAt ??= s.now();
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
      if (data.type === "clear-log") { try { sessionStorage.removeItem(logKey); } catch { /* Optional per-tab storage. */ } }
      if (data.type === "stop") stop("Bạn đã dừng Auto Quest.");
      if (data.type === "start" && !run) {
        const s = binding?.scene;
        if (!s || !connected(s) || s.self.dead || s.leaving || GSTFarmRouting.blocked(s) || s.panels.open || manual(s)) message = "Đóng bảng game và chờ nhân vật ổn định trước khi bắt đầu.";
        else if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()
            && (active(s).some((q) => selected.includes(String(q.id)) && !complete(s, q) && localKill(s, q))
              || eligibleOffers(s).some((q) => selected.includes(String(q.id)) && localKill(s, q))))
          message = globalThis.GSTFarmPolicy?.isDisabled?.()
            ? "Chế độ Disabled khóa Auto Farm; quest cần đánh quái chưa thể chạy."
            : "Chế độ Native không cho Auto Quest mượn hỗ trợ farm của extension; các quest cần đánh quái chưa thể chạy.";
        else if (s.auto.on) message = "Tắt Auto Farm trước; Auto Quest sẽ tự bật khi cần và tắt khi đủ mục tiêu.";
        else if (!selected.length) message = "Chọn ít nhất một quest đã nhận hoặc offer lặp.";
        else if (!GSTFarmQuest.ready() && (active(s).some((q) => selected.includes(String(q.id)) && !complete(s, q) && localKill(s, q))
          || eligibleOffers(s).some((q) => selected.includes(String(q.id)) && localKill(s, q)))) message = "Bản cơ bản cần Quái muốn farm = Tất cả quái. Lưu lựa chọn farm rồi thử lại.";
        else if (!active(s).some((q) => selected.includes(String(q.id)) && (complete(s, q)
            ? (npcFor(s, q) || npcInfo(s, q)) : localKill(s, q)))
            && !eligibleOffers(s).some((q) => selected.includes(String(q.id)) && localKill(s, q)
              && (giverFor(s, q) || npcInfo(s, q, true)))) message = "Chưa có quest đã chọn đủ điều kiện native và có mục tiêu được hỗ trợ trong map này.";
        else { globalThis.GSTFarmSession?.forget(s); run = { map: s.map.scene, name: s.profile.name, phase: "choose", id: null, at: -Infinity,
          ownedAuto: false, manualUntil: 0, finished: new Set(), steer: null, cycles: confirmedCycles() }; log("started"); message = "Auto Quest đã bắt đầu; chỉ xử lý quest đã tick."; }
      }
      window.postMessage({ channel: "gst:quest-status:v1", requestId: data.requestId, ...snapshot() }, origin);
    } catch { stop("Không đọc được quest; đã dừng để kiểm tra interface game."); }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  watch();
  window.postMessage({ channel: "gst:quest-status:v1", ready: true }, origin);
})();
