(() => {
  "use strict";
  const button = document.getElementById("copyFarmDiagnostics");
  const output = document.getElementById("farmDiagnosticsOutput"), feedback = document.getElementById("farmDiagnosticsFeedback");
  const skillEnabled = document.getElementById("farmSkillDiagnosticsEnabled");
  const clearSkill = document.getElementById("clearFarmSkillDiagnostics");
  let confirmedSkillEnabled = false, skillBusy = false;

  async function boundTarget() {
    await globalThis.GSTPopupAccountContextPromise;
    const session = globalThis.GSTPopupAccountSession;
    const expected = session?.current?.(), version = session?.version?.(), tabId = session?.tabId?.();
    if (!Number.isInteger(tabId) || !expected?.verified || !globalThis.GSTAccountProfiles?.identity) return null;
    const binding = await session.validate(expected, version);
    if (!binding?.valid || binding.tabId !== tabId || !binding.context?.verified) return null;
    return { tabId, profileIdentity: globalThis.GSTAccountProfiles.identity(binding.context) };
  }
  async function skillRequest(action, enabled) {
    const target = await boundTarget();
    if (!target) throw new Error("account_identity_mismatch");
    return chrome.tabs.sendMessage(target.tabId, { type: "gst:farm-skill-diagnostics",
      targetTabId: target.tabId, profileIdentity: target.profileIdentity,
      action, enabled: enabled === true });
  }
  async function refreshSkillStatus() {
    if (skillBusy) return;
    try {
      const result = await skillRequest("status");
      if (!result?.accepted) throw new Error("policy_change");
      confirmedSkillEnabled = result.enabled === true;
      skillEnabled.checked = confirmedSkillEnabled;
      skillEnabled.disabled = false;
      clearSkill.disabled = false;
    } catch {
      confirmedSkillEnabled = false;
      skillEnabled.checked = false;
      skillEnabled.disabled = true;
      clearSkill.disabled = true;
    }
  }

  // Compact only at export: collection, retention and the sanitized bridge remain unchanged.
  // In each record, flags lists true states; states absent from flags are false.
  function pick(row, fields, flagNames = []) {
    if (!row || typeof row !== "object") return null;
    const result = {};
    for (const [source, name] of fields) {
      const value = row[source];
      if (value === null || value === undefined || value === ""
          || (Array.isArray(value) && value.length === 0)) continue;
      result[name] = value;
    }
    const flags = flagNames.filter((name) => row[name] === true);
    if (flags.length) result.flags = flags;
    return result;
  }
  function merged(groups, convert, combineMovement = false) {
    const seen = new Set(), rows = [];
    for (const group of groups) for (const row of Array.isArray(group) ? group : []) {
      if (!row || typeof row !== "object") continue;
      // A record may exist in both recent events and persisted incidents.
      const key = JSON.stringify(row);
      if (seen.has(key)) continue;
      seen.add(key); rows.push(row);
    }
    const ordered = rows.sort((a, b) => (a.at || "").localeCompare(b.at || "")).map(convert).filter(Boolean);
    if (!combineMovement) return ordered;
    const compact = [], byState = new Map();
    for (const row of ordered) {
      if (row.event !== "state" && row.event !== "owner_change") { compact.push(row); continue; }
      // Same instant, same snapshot; only the event name and ownership transition differ.
      const common = { ...row };
      delete common.event; delete common.fromOwners; delete common.toOwners; delete common.ownerScope;
      const key = JSON.stringify(common), previous = byState.get(key);
      if (!previous) { compact.push(row); byState.set(key, row); continue; }
      if (previous.event === row.event || previous.also?.includes(row.event)) continue;
      if (row.event === "owner_change") {
        previous.also = [...(previous.also || []), previous.event];
        previous.event = "owner_change";
        for (const field of ["fromOwners", "toOwners", "ownerScope"]) if (row[field] !== undefined)
          previous[field] = row[field];
      } else previous.also = [...(previous.also || []), row.event];
    }
    return compact;
  }
  const farmFlags = ["hidden", "focused", "dead", "clickOrder", "reconnecting", "displaced"];
  const stopFields = [["at", "t"], ["event", "event"], ["cause", "cause"], ["on", "on"],
    ["deaths", "deaths"], ["uptimeMs", "uptimeMs"], ["callers", "callers"]];
  const moveFlags = ["auto", "manual", "clickOrder", "paused", "moved", "dead", "stunned",
    "rooted", "slowed", "moveLocked", "harvesting", "pendingSkill", "aiming", "resting",
    "target", "targetChanged", "hidden", "focused", "littleProgress", "panelOpen", "uiBlocked"];
  const moveFields = [["at", "t"], ["reason", "event"], ["fix", "fix"],
    ["elapsedMs", "elapsedMs"], ["distance", "distance"], ["stillMs", "stillMs"],
    ["pathLength", "pathLength"], ["radius", "radius"], ["moveMultiplier", "speed"],
    ["frameGapMs", "frameGapMs"], ["pauseMs", "pauseMs"], ["retryMs", "retryMs"],
    ["position", "pos"], ["serverPosition", "serverPos"], ["targetPosition", "targetPos"],
    ["center", "center"], ["home", "home"], ["steerBefore", "steerBefore"],
    ["steerAfter", "steerAfter"], ["waypoint", "waypoint"], ["scope", "scope"],
    ["panel", "panel"], ["owners", "owners"], ["fromId", "fromId"], ["toId", "toId"],
    ["switchSource", "source"], ["switchReason", "switchReason"],
    ["lootCount", "lootCount"], ["targetId", "targetId"], ["remaining", "remaining"], ["stuckMs", "stuckMs"], ["attempt", "attempt"],
    ["fromOwner", "fromOwner"], ["toOwner", "toOwner"], ["handoffReason", "handoffReason"],
    ["replanReason", "replanReason"], ["action", "action"], ["realmPhase", "realmPhase"], ["fromOwners", "fromOwners"],
    ["toOwners", "toOwners"], ["ownerScope", "ownerScope"]];
  const bgFlags = ["hidden", "focused", "auto", "dead", "connected", "reconnecting",
    "displaced", "active", "paused", "loopRunning", "wasDiscarded"];
  const vitalFlags = ["auto", "dead", "hidden", "connected"];
  const vitalFields = [["at", "t"], ["hp", "hp"], ["maxHp", "maxHp"], ["hpPct", "hpPct"],
    ["position", "pos"], ["serverPosition", "serverPos"], ["fix", "fix"]];
  const bgFields = [["at", "t"], ["reason", "event"], ["generation", "generation"],
    ["gapMs", "gapMs"], ["sinceFrameMs", "sinceFrameMs"], ["positionDelta", "positionDelta"],
    ["hp", "hp"], ["maxHp", "maxHp"], ["hpPct", "hpPct"], ["position", "pos"],
    ["serverPosition", "serverPos"], ["previousPosition", "previousPos"],
    ["fix", "fix"], ["previousFix", "previousFix"], ["navigationType", "navigationType"],
    ["redirectReason", "redirectReason"], ["persisted", "persisted"]];
  const bossFields = [["at", "t"], ["type", "event"], ["hp", "hp"], ["position", "pos"],
    ["cooldown", "cooldown"], ["direction", "direction"], ["distance", "distance"]];
  const flightFlags = ["always", "farm", "wanted", "flying", "auto", "requested",
    "hasScene", "fresh", "blocked"];
  const flightFields = [["pendingMs", "pendingMs"], ["retryMs", "retryMs"]];
  function move(row) { return pick(row, moveFields, moveFlags); }
  function background(row) {
    const result = pick(row, bgFields, bgFlags);
    if (result && row.before) result.before = pick(row.before, vitalFields, vitalFlags);
    return result;
  }
  function compact(data) {
    const movement = data.movement || {}, bg = data.background || {};
    const boss = data.bossSafety || {}, flight = data.flight || {};
    return {
      format: "gst-farm-agent-3",
      legend: "t=UTC; event=reason; also=other simultaneous events; flags lists true states (others false); missing fields=null; ownerScope=eligibility (not actual move)",
      farm: { tracking: data.tracking === true,
        current: pick(data.current, [["on", "on"], ["deaths", "deaths"]], farmFlags),
        events: (data.events || []).map((row) => pick(row, stopFields, farmFlags)) },
      movement: { build: movement.build, tracking: movement.tracking === true,
        current: move(movement.current),
        events: merged([movement.events, movement.incidents, movement.uiIncidents], move, true) },
      background: { build: bg.build, generation: bg.generation,
        current: background(bg.current),
        lastAlive: pick(bg.lastAlive, vitalFields, vitalFlags),
        lastObserved: pick(bg.lastObserved, vitalFields, vitalFlags),
        events: merged([bg.events, bg.incidents], background) },
      boss: { build: boss.build, active: boss.active === true, retreating: boss.retreating === true,
        events: (boss.events || []).map((row) => pick(row, bossFields, ["flying"])) },
      flight: { build: flight.build,
        state: pick(flight, flightFields, flightFlags),
        events: (flight.events || []).map((row) =>
          pick(row, [["at", "t"], ["type", "event"]], ["auto", "flying", "always", "farm"])) },
      skill: { build: data.skill?.build || "unavailable", enabled: data.skill?.enabled === true,
        tracking: data.skill?.tracking === true,
        legend: "guard_blocked/q_blocked=extension blocked before native; native_invoked/native_skill_invoked/native_return=call evidence only; local_state_changed=client state only; snapshot_cooldown=newer client snapshot; unconfirmed=not enough evidence; no stage proves server receipt or damage",
        events: (Array.isArray(data.skill?.events) ? data.skill.events : []).slice(-80).map((row) => {
          const result = pick(row, [["at", "t"], ["attemptId", "attempt"], ["skill", "skill"],
            ["source", "source"], ["stage", "stage"], ["reason", "reason"], ["method", "method"],
            ["returnKind", "return"], ["localCooldownDeltaMs", "localCooldownDeltaMs"],
            ["snapshotAdvanceMs", "snapshotAdvanceMs"], ["cooldownBeforeMs", "cooldownBeforeMs"],
            ["cooldownAfterMs", "cooldownAfterMs"], ["dashStarted", "dashStarted"],
            ["pendingSkillChanged", "pendingSkillChanged"]]);
          return result;
        }) }
    };
  }
  skillEnabled.addEventListener("change", async () => {
    skillBusy = true; skillEnabled.disabled = true; clearSkill.disabled = true;
    try {
      const result = await skillRequest("set", skillEnabled.checked);
      if (!result?.accepted) throw new Error(result?.reason || "policy_change");
      confirmedSkillEnabled = result.enabled === true;
      skillEnabled.checked = confirmedSkillEnabled;
      feedback.textContent = confirmedSkillEnabled ? "Đã bật thu thập log kỹ năng cho tab/tài khoản này." : "Đã tắt thu thập log kỹ năng.";
    } catch {
      skillEnabled.checked = confirmedSkillEnabled;
      feedback.textContent = "Không đổi được chẩn đoán: tab chưa xác minh, Farm không ở chế độ mở rộng hoặc bridge chưa sẵn sàng.";
    } finally { skillBusy = false; await refreshSkillStatus(); }
  });
  clearSkill.addEventListener("click", async () => {
    clearSkill.disabled = true;
    try {
      const result = await skillRequest("clear");
      if (!result?.accepted) throw new Error("policy_change");
      output.value = ""; output.hidden = true;
      feedback.textContent = "Đã xóa log kỹ năng của tab/tài khoản hiện tại.";
    } catch { feedback.textContent = "Không xóa được log: tab chưa xác minh hoặc bridge chưa sẵn sàng."; }
    finally { await refreshSkillStatus(); }
  });
  window.addEventListener("gst:popup-account-context-change", () => { void refreshSkillStatus(); });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && (changes.farmPreferences || changes[GSTAccountProfiles.profilesKey]))
      void refreshSkillStatus();
  });
  void refreshSkillStatus();
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      const target = await boundTarget();
      if (!target) throw new Error("No verified tab");
      let data = null, status = null;
      try { data = await chrome.tabs.sendMessage(target.tabId, { type: "gst:farm-diagnostics" }); } catch {}
      try { status = await chrome.tabs.sendMessage(target.tabId, { type: "gst:farm-status" }); } catch {}
      const available = data?.build === "farm-stop-1";
      const report = compact(available ? data : {});
      report.diagnosticsAvailable = available;
      report.farmStatus = {
        autoOn: typeof status?.autoOn === "boolean" ? status.autoOn : null,
        configuration: status?.configuration ? {
          policyHelper: status.configuration.policyHelper === true,
          loaded: status.configuration.loaded === true, sent: status.configuration.sent === true,
          received: status.configuration.received === true, ready: status.configuration.ready === true,
          error: typeof status.configuration.error === "string" ? status.configuration.error.slice(0, 160) : ""
        } : null,
        message: typeof status?.message === "string" ? status.message.slice(0, 240) : "Không nhận được trạng thái farm."
      };
      output.value = JSON.stringify(report); output.hidden = false;
      const notice = !available ? "Chưa nhận được log MAIN; bản xuất chỉ có trạng thái cầu nối. "
        : !data.tracking ? "Bộ theo dõi farm chưa hoạt động; đã xuất dữ liệu hiện có. " : "";
      let copied = false;
      try { copied = await globalThis.GSTClipboard?.write(output.value) === true; } catch {}
      if (copied) {
        feedback.textContent = notice + "Đã sao chép log một dòng. Dán vào chat để kiểm tra Auto Farm, di chuyển và chạy nền.";
      } else {
        output.focus(); output.select(); feedback.textContent = notice + "Đã chọn log một dòng; bấm Ctrl+C rồi dán vào chat.";
      }
    } catch { feedback.textContent = "Chưa đọc được chẩn đoán. Mở tab game, tải lại extension và game nếu vừa cập nhật."; }
    finally { button.disabled = false; }
  });
})();
