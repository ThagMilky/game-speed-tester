(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:quest:v1";
  let binding = null, watcher = null, suspended = false, run = null;
  let selected = [], configured = false, message = "Auto Quest đang tắt. Chọn quest rồi bấm Bắt đầu.";
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
    try { owner?.manualClickOff?.(); } catch { /* Input observer was already removed. */ }
    if (owner?.nativeRouteTarget) globalThis.GSTQuestHandoff?.clearNavigation(owner.nativeRouteTarget);
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
    const current = globalThis.GSTQuestHandoff?.route?.();
    if (owner?.nativeRouteTarget && current && globalThis.GSTQuestHandoff?.sameTarget(current.target, owner.nativeRouteTarget)) return true;
    try { if (owner?.nativeRouteValue && sessionStorage.getItem("kt-nav") === owner.nativeRouteValue) return true; }
    catch { /* Check the in-memory native navigation object below. */ }
    return !!owner?.nativeNav && s?.nav === owner.nativeNav;
  }
  function nativeNavMatchesRoute(s, nav, target) {
    if (!nav || !target || nav.scene !== target.scene || nav.label !== target.label) return false;
    if (nav.x === target.x && nav.y === target.y) return true;
    const gate = Number.isInteger(nav.gate) && nav.gate >= 0 ? s.map?.gates?.[nav.gate] : null;
    return !!gate && gate.x === nav.x && gate.y === nav.y;
  }
  function ownsNativeClickOrder(s) {
    const nav = run?.nativeNav ?? s?.nav, order = s?.clickOrder;
    const targetMatches = nativeNavMatchesRoute(s, nav, run?.nativeRouteTarget);
    const owned = run?.nativeRouteTarget ? targetMatches && ownsNativeNavigation(s, run) : nav === run?.nativeNav;
    if (!nav || s?.nav !== nav || !owned || !order || order.target !== 0) return false;
    const leg = nav.legs?.[0] ?? [nav.gx, nav.gy];
    return Array.isArray(leg) && Number.isFinite(order.x) && Number.isFinite(order.y)
      && Math.hypot(order.x - leg[0], order.y - leg[1]) < .06;
  }
  function observeManualClicks(s, owner) {
    if (owner?.manualClickOff || typeof GSTFarmInput?.add !== "function") return;
    try {
      owner.manualClickOff = GSTFarmInput.add(s, (accepted) => {
        if (accepted && run === owner && (owner.nativeTravel || ownsNativeNavigation(s, owner))) owner.manualCanvasUntil = performance.now() + 750;
      });
    } catch { /* The click order check below remains available as a fallback. */ }
  }
  function manual(s) {
    const typing = s.chat?.typing || s.inputFieldActive?.() || s.keyCapture;
    const keyboard = !typing && ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"]
      .some((key) => s.keys?.[key]?.isDown);
    return !!keyboard || !!s.joyX || !!s.joyY || !!s.pendingSkill || !!s.aiming || !!s.heldAttack
      || !!run?.manualCanvasUntil && performance.now() < run.manualCanvasUntil || !!s.clickOrder && !ownsNativeClickOrder(s);
  }
  function clearPendingAction(owner) {
    for (const key of ["requestedAt", "snapshotAt", "requestQuestRevision", "requestBody", "requestButton", "awaitingLogged"]) delete owner[key];
  }
  function resetNavigation(owner) {
    try { owner.manualClickOff?.(); } catch { /* Input observer was already removed. */ }
    owner.manualClickOff = null;
    owner.nativeTravel = false; owner.expectedMap = ""; owner.nativeTravelAt = undefined;
    owner.nativeNav = null; owner.nativeRouteValue = null; owner.nativeRouteTarget = null;
    owner.nativeRouteAttempted = false; owner.nativeLeaveObserved = null; owner.arrivalWaitAt = undefined;
    owner.manualCanvasUntil = 0;
  }
  function closeRequestedDialogue(s, owner) {
    if (owner.requestBody && owner.body === owner.requestBody && owner.button === owner.requestButton
        && owner.requestBody.isConnected && owner.requestBody.contains(owner.requestButton)
        && owner.requestButton.isConnected && owner.requestButton.textContent === (owner.action === "accept" ? "Nhận nhiệm vụ" : "Nhận thưởng")
        && s.panels.open && s.panels.title === owner.npc?.info?.name) {
      try { s.panels.close(); } catch { /* A native panel may already have closed itself. */ }
    }
  }
  function clearStoredHandoff(owner) {
    const handoff = globalThis.GSTQuestHandoff;
    if (!handoff) return;
    const state = handoff.inspect();
    if (state.record) handoff.clear(state.record, state.record.route);
    else { handoff.discard?.(); handoff.clearNavigation(owner?.nativeRouteTarget); }
  }
  function writeHandoff(s) {
    const handoff = globalThis.GSTQuestHandoff, leave = run?.nativeLeaveObserved;
    if (!handoff || !run || !s?.leaving || !leave?.connected || leave.dead
        || leave.name !== run.name || leave.classId !== run.classId || leave.classId !== s.profile?.classId
        || leave.characterId !== run.characterId || leave.characterId !== s.you || run.phase !== "return"
        || run.requestedAt !== undefined || manual(s)
        || !run.nativeTravel || !leave || leave.scene !== run.expectedMap && !leave.intermediate
        || Date.now() - leave.at > 15000 || !ownsNativeNavigation(s, run) || !run.nativeRouteTarget) return false;
    const quest = definition(s, run.nativeId);
    if (!quest || !selected.includes(run.id)) return false;
    if (run.action === "accept") {
      if (active(s).some((item) => String(item.id) === run.id)
          || !eligibleOffers(s).some((item) => String(item.id) === run.id)) return false;
    } else if (run.action === "claim") {
      const current = active(s).find((item) => String(item.id) === run.id);
      if (!current || !complete(s, current)) return false;
    } else return false;
    const record = handoff.write({ expectedMap: run.expectedMap, hopMap: leave.scene, route: run.nativeRouteTarget,
      online: leave.online, expectedSearch: leave.expectedSearch, name: run.name, classId: s.profile.classId,
      characterId: s.you, selected: [...selected],
      run: { id: run.id, nativeId: run.nativeId, title: run.title, action: run.action,
        phase: run.phase, cycles: run.cycles, finished: [...run.finished] } });
    if (!record) return false;
    log("handoff-written", { detail: `${leave.scene} → ${run.expectedMap}` });
    return true;
  }
  function observeLeave(s, owner, destination, x, y) {
    const nav = s.nav, route = nativeRouteRecord();
    const navMatchesRoute = nativeNavMatchesRoute(s, nav, owner?.nativeRouteTarget);
    const teleport = owner?.nativeTeleportObserved;
    const directTeleport = !!teleport && typeof teleport.stationId === "string" && Date.now() <= teleport.expires
      && Date.now() - teleport.at <= 15000 && destination === owner.expectedMap
      && globalThis.GSTQuestHandoff?.sameTarget(route?.target, owner.nativeRouteTarget)
      && globalThis.GSTQuestHandoff?.sameTarget(teleport.route, owner.nativeRouteTarget)
      && teleport.scene === destination;
    if (!owner?.nativeTravel || !route || !globalThis.GSTQuestHandoff?.sameTarget(route.target, owner.nativeRouteTarget)
        || !(nav && navMatchesRoute || directTeleport)) return;
    const intermediate = nav?.scene === owner.expectedMap && Number.isInteger(nav?.gate) && nav.gate >= 0
      && s.map?.gates?.[nav.gate]?.to === destination;
    if (destination !== owner.expectedMap && !intermediate) return;
    const online = s.driver?.online === true, params = new URLSearchParams(location.search);
    if (online) { params.delete("map"); params.delete("at"); }
    else { params.set("map", destination); params.set("at", `${x},${y}`); }
    params.delete("level");
    owner.nativeLeaveObserved = { scene: destination, x, y, online, expectedSearch: params.toString() ? `?${params}` : "",
      connected: connected(s), dead: !!s.self?.dead, name: s.profile?.name, classId: s.profile?.classId, characterId: s.you,
      at: Date.now(), intermediate };
  }
  function wrapQuestNavigation(s, owner) {
    const originalGoTo = s.goTo, originalTeleport = s.teleport;
    owner.goToDescriptor = Object.getOwnPropertyDescriptor(s, "goTo");
    owner.teleportDescriptor = Object.getOwnPropertyDescriptor(s, "teleport");
    owner.goToWrapper = function (scene, x, y, label, ...rest) {
      const current = run, request = current?.nativeRequest;
      const initial = request && scene === request.scene && label === request.label;
      const resumed = current?.nativeTravel && performance.now() <= (current.nativeResumeUntil ?? -Infinity)
        && nativeNavMatchesRoute(s, { scene, x, y, label }, current.nativeRouteTarget);
      if (!initial && !resumed) return originalGoTo.call(this, scene, x, y, label, ...rest);
      current.nativeTeleportCandidate = null;
      current.nativeGoToContext = { scene, label };
      let result, station;
      try { result = originalGoTo.call(this, scene, x, y, label, ...rest); }
      finally {
        delete current.nativeGoToContext;
        station = current.nativeTeleportCandidate;
        delete current.nativeTeleportCandidate;
      }
      const route = nativeRouteRecord();
      if (result && station?.scene === scene && route?.target?.scene === scene && route.target.label === label
          && (!resumed || route.target.x === x && route.target.y === y)) {
        current.nativeTeleportObserved = { scene, route: { scene: route.target.scene, x: route.target.x,
          y: route.target.y, label: route.target.label }, stationId: station.id, at: Date.now(), expires: Date.now() + 15000 };
      }
      return result;
    };
    owner.teleportWrapper = function (station, ...rest) {
      if (run?.nativeGoToContext && station?.scene === run.nativeGoToContext.scene
          && typeof station.id === "string" && Number.isFinite(station.x) && Number.isFinite(station.y)) {
        run.nativeTeleportCandidate = { scene: station.scene, id: station.id, x: station.x, y: station.y };
      }
      return originalTeleport.call(this, station, ...rest);
    };
    s.goTo = owner.goToWrapper; s.teleport = owner.teleportWrapper;
  }
  function restoreHandoff(s) {
    if (!binding || binding.handoffChecked || !configured) return false;
    binding.handoffChecked = true;
    const handoff = globalThis.GSTQuestHandoff;
    if (!handoff) return false;
    const state = handoff.inspect();
    if (state.none) return false;
    const invalidate = (reason) => {
      if (state.record) handoff.clear(state.record, state.record.route); else handoff.discard?.();
      log("handoff-invalid", { detail: reason }); message = `Quest chưa tiếp tục: ${reason}`; return false;
    };
    if (state.invalid) return invalidate(state.reason);
    const saved = state.record, details = saved.run;
    const sameSelection = Array.isArray(saved.selected) && [...saved.selected].sort().join("\0") === [...selected].sort().join("\0");
    if (!details || details.phase !== "return" || !["accept", "claim"].includes(details.action)
        || typeof details.id !== "string" || typeof saved.classId !== "string" || !saved.classId
        || !sameSelection
        || saved.name !== s.profile?.name || saved.classId !== s.profile?.classId || saved.characterId !== s.you
        || saved.hopMap !== s.map?.scene || !connected(s) || s.self?.dead || s.leaving
        || !selected.includes(details.id)) return invalidate("The destination map, character, selection, or run state did not match.");
    const quest = definition(s, details.nativeId), current = active(s).find((item) => String(item.id) === details.id);
    if (details.action === "accept" && (!quest || current || !eligibleOffers(s).some((item) => String(item.id) === details.id)))
      return invalidate("The selected offer is no longer eligible or has already been accepted.");
    if (details.action === "claim" && (!current || !complete(s, current)))
      return invalidate("The accepted quest is no longer complete at the destination.");
    const route = handoff.route();
    if (!route || !handoff.sameTarget(route.target, saved.route) || route.target.scene !== saved.expectedMap)
      return invalidate("The native destination record no longer matches this quest.");
    const qInfo = details.action === "accept" ? npcInfo(s, quest, true) : npcInfo(s, quest);
    if (!qInfo) return invalidate("The exact giver or recipient is unavailable in the native quest data.");
    run = { map: s.map.scene, name: saved.name, classId: saved.classId, characterId: saved.characterId,
      phase: "return", id: details.id, nativeId: details.nativeId,
      title: text(details.title), action: details.action, at: -Infinity, cycles: Number(details.cycles) || 0,
      finished: new Set(Array.isArray(details.finished) ? details.finished.filter((id) => typeof id === "string").slice(0, 200) : []),
      ownedAuto: false, manualUntil: 0, steer: null, npc: s.npcs?.find((n) => n.info?.id === qInfo.id) ?? null,
      nav: Object.assign(Object.create(s.auto), { path: [], pathAt: -Infinity, lastX: s.px, lastY: s.py, stillSince: s.now(), stuckCount: 0, sideUntil: 0 }),
      nativeTravel: s.map.scene !== saved.expectedMap, expectedMap: saved.expectedMap,
      nativeTravelAt: performance.now(), nativeRouteTarget: { ...saved.route }, nativeRouteValue: route.value,
      nativeNav: nativeNavMatchesRoute(s, s.nav, saved.route) ? s.nav : null,
      nativeRouteAttempted: true, arrivalWaitAt: performance.now(), nativeLeaveObserved: null,
      nativeResumeUntil: performance.now() + 5000 };
    observeManualClicks(s, run);
    handoff.consume(saved);
    globalThis.GSTFarmSession?.forget(s);
    log("handoff-resumed", { detail: `Arrived at ${s.map.scene}; returning to selected NPC.` });
    message = `Đã xác nhận tới map ${s.map.scene}; tiếp tục quest ${run.title}.`;
    return true;
  }
  function stop(reason, preserveAutoFarm = false) {
    const s = binding?.scene, old = run;
    if (old && reason) log("stopped", { detail: reason });
    stopOwnedNativeNavigation(s, old);
    clearStoredHandoff(old);
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
      if (run.requestedAt !== undefined) return;
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
        stopOwnedNativeNavigation(s, run); resetNavigation(run);
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
      if (run.requestedAt !== undefined && binding.questRevision > run.requestQuestRevision && now - run.requestedAt > 2000) {
        if (run.action === "claim" && q && complete(s, q)) { log("rejected", { detail: "Quest remains active and complete after fresh state." }); stop("Game chưa xác nhận trả thưởng; quest vẫn đang nhận. Đã dừng mà không bấm lại."); return false; }
        if (run.action === "accept" && !active(s).some((item) => String(item.id) === run.id)
            && eligibleOffers(s).some((item) => String(item.id) === run.id)) {
          log("rejected", { detail: "Offer remains eligible after fresh state." });
          stop("Game chưa xác nhận nhận quest; offer vẫn còn đủ điều kiện. Đã dừng mà không bấm lại."); return false;
        }
      }
      if (run.action === "claim" && run.requestedAt !== undefined && binding.questRevision > run.requestQuestRevision) {
        const def = definition(s, run.nativeId);
        if (s.quests.claimed(run.nativeId) || (def?.repeatable === true && !s.quests.rec?.(run.nativeId)
            && s.quests.available?.(def) === true)) {
          closeRequestedDialogue(s, run);
          run.cycles = confirmedCycles() + 1;
          try { sessionStorage.setItem(cycleKey, String(run.cycles)); } catch { /* Keep controller operation independent of storage. */ }
          log("cycle-confirmed", { detail: `Confirmed claim; completed cycles ${run.cycles}` });
          message = `Đã xác nhận chu kỳ ${run.cycles}: ${run.title}.`;
          clearPendingAction(run); resetNavigation(run); run.action = null; run.phase = "choose"; run.npc = null;
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
      const acceptedQuest = run.action === "accept" && binding.questRevision > run.requestQuestRevision
        ? active(s).find((item) => String(item.id) === run.id) : null;
      if (acceptedQuest) {
        closeRequestedDialogue(s, run); clearPendingAction(run); resetNavigation(run);
        run.action = null; run.phase = "choose"; run.startedAt = time; run.progressAt = time;
        message = `Đã xác nhận nhận quest: ${run.title}.`; log("accept-confirmed", { progress: counts(s, acceptedQuest)?.join("/") });
        run.lastProgress = undefined;
      }
      if (run.action === "accept" && run.requestedAt !== undefined && !acceptedQuest) {
        if (!run.awaitingLogged) { log("waiting", { detail: "Waiting for fresh accepted quest records." }); run.awaitingLogged = true; }
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
        clearPendingAction(run); resetNavigation(run);
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
            run.nativeRequest = { scene: target.scene, label: target.name ?? run.title };
            let accepted;
            try { accepted = nativeNpc(target.id, target.name ?? run.title); }
            finally { delete run.nativeRequest; }
            if (!accepted) {
              stop("Native navigation từ chối đường tới NPC (có thể map đang khóa). "); return false;
            }
            const route = nativeRouteRecord();
            const nativeNav = s.nav;
            const expectedMap = route?.target?.scene ?? nativeNav?.scene;
            const expectedLabel = route?.target?.label ?? nativeNav?.label;
            if (typeof expectedMap !== "string" || expectedMap !== target.scene
                || expectedLabel !== (target.name ?? run.title)) {
              stop("Không xác nhận được đích hành trình gốc của NPC quest đã chọn; đã dừng."); return false;
            }
            run.nativeTravel = expectedMap !== s.map.scene; run.expectedMap = run.nativeTravel ? expectedMap : ""; run.nativeTravelAt = now;
            run.nativeNav = nativeNav ?? null; run.nativeRouteValue = route?.value ?? null;
            run.nativeRouteTarget = route?.target ? { scene: route.target.scene, x: route.target.x, y: route.target.y, label: route.target.label } : null;
            observeManualClicks(s, run);
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
        run.requestedAt = now; run.snapshotAt = s.selfAt; run.requestQuestRevision = binding.questRevision;
        run.requestBody = run.body; run.requestButton = run.button;
        run.button.click(); log(`${run.action}-requested`);
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
  function detach(allowHandoff = false) {
    const old = binding, s = old?.scene;
    if (!old) { if (run) stop("Auto Quest dừng khi rời scene/trang; lựa chọn quest vẫn được giữ."); return; }
    const handedOff = !!(allowHandoff && run && writeHandoff(s));
    if (handedOff) { try { run?.manualClickOff?.(); } catch { /* Scene is leaving. */ } run = null; }
    else stop("Auto Quest dừng khi rời scene/trang; lựa chọn quest vẫn được giữ.");
    binding = null;
    old.remove(); old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown);
    if (old.scene.leave === old.leaveWrapper) {
      if (old.leaveDescriptor) Object.defineProperty(old.scene, "leave", old.leaveDescriptor); else delete old.scene.leave;
    }
    if (old.scene.quests.load === old.questLoadWrapper) {
      if (old.questLoadDescriptor) Object.defineProperty(old.scene.quests, "load", old.questLoadDescriptor); else delete old.scene.quests.load;
    }
    if (old.scene.goTo === old.goToWrapper) {
      if (old.goToDescriptor) Object.defineProperty(old.scene, "goTo", old.goToDescriptor); else delete old.scene.goTo;
    }
    if (old.scene.teleport === old.teleportWrapper) {
      if (old.teleportDescriptor) Object.defineProperty(old.scene, "teleport", old.teleportDescriptor); else delete old.scene.teleport;
    }
    if (old.scene.panels.show === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.scene.panels, "show", old.descriptor); else delete old.scene.panels.show;
    }
  }
  function shutdown() { detach(true); watch(); }
  function guard() {
    if (!run || !binding) return;
    const s = binding.scene;
    try {
      const mapChanged = s.map?.scene !== run.map;
      if (s.leaving) { detach(true); watch(); return; }
      if (sceneNow() !== s || s.auto !== binding.auto || !s.sys?.isActive?.() || !connected(s)
          || !s.self || !s.profile || s.self.dead || (mapChanged && (!run.nativeTravel || !ownsNativeNavigation(s, run)
            || performance.now() - run.nativeTravelAt > 180000)) || s.profile.name !== run.name || s.profile.classId !== run.classId
          || s.you !== run.characterId) {
        stop("Auto Quest dừng do nhân vật, map hoặc kết nối thay đổi; không tự bật lại.");
      } else if (globalThis.GSTMapTravel?.active(s)) {
        run.pausedAt ??= s.now();
      } else if (run.phase === "farm" && !s.auto.on) stop("Auto Farm đã tắt; Auto Quest cũng dừng.");
    } catch { stop("Interface quest thay đổi; đã dừng Auto Quest."); }
  }
  function discover() {
    if (binding && (sceneNow() !== binding.scene || binding.scene.auto !== binding.auto || !binding.scene.sys?.isActive?.())) detach(true);
    if (binding || suspended) return;
    try {
      const s = sceneNow();
      if (!s?.sys?.isActive?.() || s.leaving || !s.self || !s.profile || !s.map || !s.auto || !s.panels
          || !["active", "progress", "claimed", "forNpc"].every((key) => typeof s.quests?.[key] === "function")
          || !["now", "autoHost", "toggleAutoFarm", "interact", "pickTarget"].every((key) => typeof s[key] === "function")
          || typeof s.auto.walk !== "function" || typeof s.auto.update !== "function" || typeof s.panels.show !== "function"
          || typeof s.quests.load !== "function" || typeof s.leave !== "function"
          || typeof s.goTo !== "function" || typeof s.teleport !== "function") return;
      const original = s.panels.show;
      const owner = { scene: s, auto: s.auto, rewards: new Map(), modalAt: -Infinity, modal: false, questRevision: 0,
        descriptor: Object.getOwnPropertyDescriptor(s.panels, "show"),
        questLoadDescriptor: Object.getOwnPropertyDescriptor(s.quests, "load"), leaveDescriptor: Object.getOwnPropertyDescriptor(s, "leave") };
      const originalLoad = s.quests.load;
      owner.questLoadWrapper = function (...args) { const result = originalLoad.apply(this, args); owner.questRevision++; return result; };
      s.quests.load = owner.questLoadWrapper;
      const originalLeave = s.leave;
      owner.leaveWrapper = function (scene, x, y, ...rest) {
        observeLeave(s, run, scene, x, y);
        return originalLeave.call(this, scene, x, y, ...rest);
      };
      s.leave = owner.leaveWrapper;
      wrapQuestNavigation(s, owner);
      owner.wrapper = function (title, subtitle, body, ...rest) {
        const result = original.call(this, title, subtitle, body, ...rest);
        try { capture(title, body); } catch { /* Reading a reward must not break the game's panel. */ }
        return result;
      };
      owner.remove = GSTFarmUpdate.add(s, 3, tick); binding = owner; s.panels.show = owner.wrapper;
      s.events.on("preupdate", guard); s.events.on("shutdown", shutdown); s.events.on("destroy", shutdown);
      restoreHandoff(s);
      clearInterval(watcher); watcher = null;
    } catch { detach(); }
  }
  function watch() { if (!binding && !suspended && watcher === null) watcher = setInterval(discover, 100); }
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
        configured = true;
        if (binding) restoreHandoff(binding.scene);
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
        else { globalThis.GSTFarmSession?.forget(s); run = { map: s.map.scene, name: s.profile.name, classId: s.profile.classId,
          characterId: s.you, phase: "choose", id: null, at: -Infinity,
          ownedAuto: false, manualUntil: 0, finished: new Set(), steer: null, cycles: confirmedCycles() }; log("started"); message = "Auto Quest đã bắt đầu; chỉ xử lý quest đã tick."; }
      }
      window.postMessage({ channel: "gst:quest-status:v1", requestId: data.requestId, ...snapshot() }, origin);
    } catch { stop("Không đọc được quest; đã dừng để kiểm tra interface game."); }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(true); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  watch();
  window.postMessage({ channel: "gst:quest-status:v1", ready: true }, origin);
})();
