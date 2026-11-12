(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const controls = byId("harvestControls");
  const enabled = byId("harvestEnabled");
  const allowFarm = byId("harvestAllowFarm");
  const mode = byId("harvestMode");
  const search = byId("harvestSearch");
  const list = byId("harvestItems");
  const feedback = byId("harvestFeedback");
  const status = byId("harvestStatus");
  const scope = byId("harvestSearchScope");
  const ranges = [["radius", byId("harvestRadius")], ["reach", byId("harvestReach")]];
  let preferences = GSTHarvest.normalize(null);
  let catalog = [];
  let available = false;
  let confirmed = GSTHarvest.normalize(null);
  let queue = Promise.resolve(), pending = [], storageRevision = 0;
  let mapAvailable = false, saveMessage = "";
  const rangeErrors = new Map();
  const dirty = new Set(), editVersions = new Map(), failedFields = new Set();
  const rangeWrites = new Map();
  let busy = false;
  let loaded = false;
  let harvestAccountContext = null;
  let harvestAccountContextVersion = 0;
  let harvestProfileBindingRequired = false;
  const harvestAccountSession = globalThis.GSTPopupAccountSession ?? null;
  const harvestAccountContextPromise = globalThis.GSTPopupAccountContextPromise
    ?? GSTAccountProfiles.activeContext().catch(() => null);
  void harvestAccountContextPromise.then((context) => {
    harvestAccountContext = harvestAccountSession ? harvestAccountSession.current() : context;
    harvestAccountContextVersion = harvestAccountSession?.version?.() ?? 0;
    harvestProfileBindingRequired = harvestAccountSession?.bindingRequired?.() === true;
    if (loaded) controls.disabled = !!context && context.verified !== true
      || harvestProfileBindingRequired && context?.verified !== true;
    if (context && context.verified !== true)
      status.textContent = "Chưa xác nhận nick trong tab hiện tại; cài đặt Thu hoạch bị khóa.";
  });
  const debugPanel = byId("harvestDebugPanel");
  const debugToggle = byId("harvestDebugEnabled");
  const debugOutput = byId("harvestDebugOutput");
  const debugFeedback = byId("harvestDebugFeedback");
  const debugDetails = byId("harvestDebugDetails");
  let debugBusy = false;
  const shortcutLabel = byId("harvestShortcutLabel");
  const shortcutFeedback = byId("harvestShortcutFeedback");
  const shortcutCapture = byId("captureHarvestShortcut");
  const shortcutReset = byId("resetHarvestShortcut");
  let capturingShortcut = false;
  function showShortcut(value) {
    const code = typeof value?.code === "string" && /^(Key[A-Z]|Digit[0-9])$/.test(value.code) ? value.code : "KeyH";
    shortcutLabel.textContent = `Alt + ${code.startsWith("Key") ? code.slice(3) : code.slice(5)}${code === "KeyH" && value?.code == null ? " (mặc định)" : ""}`;
  }
  async function saveShortcut(code) {
    shortcutCapture.disabled = shortcutReset.disabled = true;
    try {
      await chrome.storage.local.set({ harvestShortcut: { code } });
      showShortcut({ code });
      shortcutFeedback.textContent = "Đã lưu phím tắt Thu hoạch.";
    } catch { shortcutFeedback.textContent = "Không lưu được phím tắt. Thử lại."; }
    finally { shortcutCapture.disabled = shortcutReset.disabled = false; }
  }
  shortcutCapture.addEventListener("click", () => {
    capturingShortcut = true;
    shortcutFeedback.textContent = "Giữ Alt rồi bấm chữ hoặc số muốn dùng (Esc để hủy).";
  });
  shortcutReset.addEventListener("click", () => {
    capturingShortcut = false;
    void saveShortcut(null);
  });
  window.addEventListener("keydown", (event) => {
    if (!capturingShortcut) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.key === "Escape") {
      capturingShortcut = false;
      shortcutFeedback.textContent = "Đã hủy đặt phím.";
      return;
    }
    if (event.repeat || event.isComposing || !event.altKey || event.ctrlKey || event.shiftKey || event.metaKey
        || !/^(Key[A-Z]|Digit[0-9])$/.test(event.code)) {
      shortcutFeedback.textContent = "Chỉ hỗ trợ Alt + chữ hoặc số, không kèm Ctrl/Shift."; return;
    }
    capturingShortcut = false;
    void saveShortcut(event.code);
  }, true);
  async function debugMessage(type, extra = {}) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");
    return chrome.tabs.sendMessage(tab.id, { type, ...extra });
  }
  byId("copyHarvestHistory").addEventListener("click", async () => {
    const button = byId("copyHarvestHistory"), output = byId("harvestHistoryOutput"), feedback = byId("harvestHistoryFeedback");
    button.disabled = true;
    try {
      const data = await debugMessage("gst:harvest-history");
      if (!Array.isArray(data.recentAttempts)) throw new Error("History unavailable");
      output.value = JSON.stringify({ build: "harvest-history-3", scope: "Last 10 completed attempts in this game tab; no runtime credentials", attempts: data.recentAttempts });
      if (!data.recentAttempts.length) { feedback.textContent = "Chưa có lượt kết thúc. Cho Thu hoạch chạy rồi sao chép lại."; return; }
      if (await GSTClipboard.write(output.value)) feedback.textContent = "Đã sao chép. Dán log vào chat để kiểm tra.";
      else { output.hidden = false; output.focus(); output.select(); feedback.textContent = "Đã chọn log; bấm Ctrl+C để sao chép."; }
    } catch { feedback.textContent = "Chưa đọc được lịch sử. Reload extension rồi tải lại game nếu vừa cập nhật."; }
    finally { button.disabled = false; }
  });
  async function refreshDebug() {
    if (debugBusy || !debugToggle.checked || !debugPanel.open) return;
    debugBusy = true;
    try {
      const data = await debugMessage("gst:harvest-debug-get");
      if (data?.build !== "harvest-bridge-log-2-events") throw new Error("Old bridge");
      const value = JSON.stringify(data);
      if (debugOutput.value !== value) debugOutput.value = value;
    } catch {
      debugFeedback.textContent = "Chưa nhận được log bản mới. Tải lại extension rồi tải lại tab game.";
    } finally { debugBusy = false; }
  }
  debugToggle.addEventListener("change", async () => {
    debugDetails.hidden = !debugToggle.checked;
    debugToggle.disabled = true;
    try {
      await chrome.storage.local.set({ harvestDebugEnabled: debugToggle.checked });
      const data = await debugMessage("gst:harvest-debug-set", { enabled: debugToggle.checked });
      debugOutput.value = JSON.stringify(data);
      debugFeedback.textContent = "";
      await refreshDebug();
    } catch { debugFeedback.textContent = "Đã yêu cầu ghi log; tải lại trang game nếu chưa nhận được log."; }
    finally { debugToggle.disabled = false; }
  });
  debugPanel.addEventListener("toggle", refreshDebug);
  byId("copyHarvestDebug").addEventListener("click", async () => {
    if (!debugOutput.value) { debugFeedback.textContent = "Bật ghi log và chờ đọc được dữ liệu trước."; return; }
    if (await GSTClipboard.write(debugOutput.value)) {
      debugFeedback.textContent = "Đã sao chép. Bạn có thể dán log vào chat.";
    } else {
      debugOutput.focus(); debugOutput.select();
      debugFeedback.textContent = "Đã chọn log; bấm Ctrl+C để sao chép.";
    }
  });
  byId("clearHarvestDebug").addEventListener("click", async () => {
    try {
      debugOutput.value = JSON.stringify(await debugMessage("gst:harvest-debug-clear"));
      debugFeedback.textContent = "Đã xóa log.";
    } catch { debugFeedback.textContent = "Chưa xóa được log; tab có thể đang tải lại."; }
  });
  const fold = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  const kind = byId("harvestKind"), line = byId("harvestShowTargetLine");
  function updateMessage() {
    const draft = dirty.size ? " · Có số chưa lưu; rời ô nhập để lưu." : "";
    feedback.textContent = ([...rangeErrors.values()][0] || (failedFields.size ? "Một lựa chọn chưa lưu; hãy kiểm tra và thử lại." : pending.length ? "Đang lưu…" : saveMessage)) + draft;
  }
  function derivePreferences() {
    preferences = pending.reduce((value, action) => GSTHarvest.normalize({ ...value, ...action(value) }), confirmed);
  }
  function renderList() {
    enabled.checked = preferences.enabled; allowFarm.checked = preferences.allowFarm;
    line.checked = preferences.showTargetLine; kind.value = preferences.kind;
    scope.value = preferences.searchScope; mode.value = preferences.mode;
    byId("harvestRadiusField").hidden = preferences.searchScope === "map";
    byId("harvestEmptySelection").hidden = preferences.mode !== "selected" || preferences.items.length !== 0;
    byId("harvestCoordSummary").textContent = `Phối hợp & hiển thị · farm ${confirmed.allowFarm ? "bật" : "tắt"} · đường ${confirmed.showTargetLine ? "bật" : "tắt"}`;
    byId("harvestAdvancedSummary").textContent = `Nâng cao · dừng ${confirmed.reach} ô`;
    byId("harvestCount").textContent = `Đã chọn ${preferences.items.length} loại`;
    byId("clearHarvestItems").disabled = !preferences.items.length;
    const focused = document.activeElement?.dataset?.item, scroll = list.scrollTop;
    const index = new Map(catalog.map((item) => [item.name, item]));
    const names = [...new Set([...preferences.items, ...index.keys()])]
      .filter((name) => fold(name).includes(fold(search.value.trim())))
      .sort((a, b) => Number(preferences.items.includes(b)) - Number(preferences.items.includes(a)) || a.localeCompare(b, "vi"));
    const nodes = names.map((name) => {
      const row = document.createElement("label"); row.className = "check-row";
      const checkbox = document.createElement("input"); checkbox.type = "checkbox";
      checkbox.dataset.item = name; checkbox.checked = preferences.items.includes(name);
      checkbox.disabled = preferences.mode !== "selected";
      const text = document.createElement("span"), item = index.get(name), type = item?.kind;
      text.textContent = `${type === "ore" ? "[Đào] " : type === "plant" ? "[Hái] " : type === "both" ? "[Hái & đào] " : ""}${name}`;
      if (!mapAvailable || !item || item.inMap !== true) {
        const hint = document.createElement("small");
        hint.textContent = !mapAvailable ? "Chưa đọc được dữ liệu map"
          : !item ? "Đã lưu · không có trong danh mục hiện tại" : "Không có trong map hiện tại";
        text.append(hint);
      }
      row.append(checkbox, text); return row;
    });
    if (!nodes.length) {
      const empty = document.createElement("p"); empty.className = "hint";
      empty.textContent = available ? "Không có tài nguyên khớp tìm kiếm." : "Chưa đọc được danh mục tài nguyên từ game.";
      nodes.push(empty);
    }
    list.replaceChildren(...nodes);
    if (focused) [...list.querySelectorAll("input")].find((input) => input.dataset.item === focused)?.focus({ preventScroll: true });
    list.scrollTop = scroll;
  }
  function save(action, field) {
    const expectedContext = harvestAccountContext;
    const expectedVersion = harvestAccountContextVersion;
    if ((expectedContext && expectedContext.verified !== true)
        || (harvestProfileBindingRequired && expectedContext?.verified !== true)) {
      saveMessage = "Chưa xác nhận nick trong tab game; chưa lưu cài đặt.";
      updateMessage();
      return Promise.resolve(false);
    }
    pending.push(action); derivePreferences(); renderList();
    saveMessage = "Đang lưu…"; updateMessage();
    const operation = queue.catch(() => {}).then(async () => {
      await harvestAccountContextPromise;
      const binding = harvestAccountSession
        ? await harvestAccountSession.validate(expectedContext, expectedVersion)
        : { valid: harvestAccountContext === expectedContext, context: expectedContext };
      if (!binding.valid || (binding.context && binding.context.verified !== true)
          || (harvestProfileBindingRequired && binding.context?.verified !== true))
        throw new Error("Account identity changed or is not confirmed.");
      const context = binding.context;
      const applied = GSTHarvest.normalize(await GSTAccountProfiles.updateFeature(context, "harvest",
        (saved) => action(GSTHarvest.normalize(saved)), async () => {
          const latest = harvestAccountSession
            ? await harvestAccountSession.validate(expectedContext, expectedVersion)
            : { valid: harvestAccountContext === expectedContext };
          return latest.valid && (!harvestProfileBindingRequired || latest.context?.verified === true);
        }));
      let resultMessage = "Đã lưu cài đặt trên máy.";
      const latest = harvestAccountSession
        ? await harvestAccountSession.validate(expectedContext, expectedVersion)
        : { valid: harvestAccountContext === expectedContext, context };
      try {
        if (!latest.valid) throw new Error("Account identity changed.");
        if (!context?.verified || !Number.isInteger(binding.tabId)) throw new Error("Verified tab unavailable.");
        const result = await chrome.tabs.sendMessage(binding.tabId, { type: "gst:harvest-configure",
          preferences: applied, targetTabId: binding.tabId,
          profileIdentity: GSTAccountProfiles.identity(context) });
        if (result?.navigating) resultMessage = "Đã lưu; game đang tải lại để áp dụng.";
        else if (result?.accepted && result.applied) resultMessage = "Đã lưu và game xác nhận áp dụng.";
        else resultMessage = "Đã lưu; game chưa xác nhận áp dụng.";
      } catch {
        resultMessage = context?.verified
          ? "Đã lưu; danh tính tab đã đổi hoặc game chưa xác nhận áp dụng."
          : "Đã lưu mặc định chung; chưa có tab nhân vật đã xác nhận để áp dụng.";
      }
      return { applied, resultMessage, revision: storageRevision, contextVersion: expectedVersion };
    });
    queue = operation;
    operation.then(({ applied, resultMessage, revision }) => {
      if (expectedVersion !== harvestAccountContextVersion) return;
      if (storageRevision === revision) confirmed = applied;
      failedFields.delete(field); saveMessage = resultMessage;
    }, () => {
      if (expectedVersion !== harvestAccountContextVersion) return;
      failedFields.add(field); saveMessage = "Chưa lưu được cài đặt; giá trị đã lưu vẫn được giữ.";
    }).finally(() => {
      pending = pending.filter((item) => item !== action);
      derivePreferences(); renderList(); updateMessage();
      if (!pending.length) refresh();
    });
    return operation;
  }
  const change = (key, input) => input.addEventListener("change", () => {
    const value = input.type === "checkbox" ? input.checked : input.value;
    save(() => ({ [key]: value }), key);
  });
  for (const [key, input] of [["showTargetLine", line], ["enabled", enabled], ["allowFarm", allowFarm],
    ["mode", mode], ["searchScope", scope], ["kind", kind]]) change(key, input);
  search.addEventListener("input", renderList);
  byId("clearHarvestItems").addEventListener("click", () => save(() => ({ items: [] }), "items"));
  list.addEventListener("change", (event) => {
    const name = event.target.dataset?.item;
    if (!name) return;
    const selected = event.target.checked;
    save((current) => {
      const items = new Set(current.items);
      if (selected) items.add(name); else items.delete(name);
      return { items: GSTHarvest.normalize({ ...current, items: [...items] }).items };
    }, "items");
  });
  function commitRange(key, input) {
    if (!loaded) return Promise.resolve(false);
    const value = input.valueAsNumber;
    if (!input.checkValidity() || !Number.isFinite(value)) {
      rangeErrors.set(key, "Số không hợp lệ; hãy kiểm tra giới hạn và bước nhập.");
      updateMessage();
      return Promise.resolve(false);
    }
    rangeErrors.delete(key);
    const version = editVersions.get(key) ?? 0;
    const active = rangeWrites.get(key);
    if (active?.version === version) return active.promise;
    if (!active && value === confirmed[key]) {
      dirty.delete(key);
      failedFields.delete(key);
      updateMessage();
      return Promise.resolve(true);
    }
    const operation = save(() => ({ [key]: value }), key);
    // Only clear the draft if the user has not edited again during persistence.
    const done = operation.then(() => {
      if ((editVersions.get(key) ?? 0) === version && input.valueAsNumber === value && input.checkValidity()) dirty.delete(key);
      return true;
    }, () => false).finally(() => {
      if (rangeWrites.get(key)?.promise === done) rangeWrites.delete(key);
      updateMessage();
    });
    rangeWrites.set(key, { version, promise: done });
    return done;
  }
  for (const [key, input] of ranges) {
    input.addEventListener("input", () => {
      dirty.add(key);
      editVersions.set(key, (editVersions.get(key) ?? 0) + 1);
      if (input.checkValidity()) rangeErrors.delete(key);
      updateMessage();
    });
    input.addEventListener("blur", () => { void commitRange(key, input); });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      void commitRange(key, input);
    });
  }
  async function flushNumericDrafts() {
    if (!loaded) return { saved: false, reason: "load" };
    for (const [key, input] of ranges)
      if (!input.checkValidity() || !Number.isFinite(input.valueAsNumber))
        return { saved: false, reason: "invalid", field: key === "radius" ? "harvestRadius" : "harvestReach" };
    const results = await Promise.all(ranges.map(([key, input]) => commitRange(key, input)));
    const queued = await queue.then(() => true, () => false);
    return results.every(Boolean) && queued && !dirty.size && !failedFields.size
      ? { saved: true } : { saved: false, reason: "persistence" };
  }
  async function refresh() {
    if (busy || !loaded || pending.length) return;
    busy = true;
    try {
      const tabId = harvestAccountSession?.tabId?.();
      if (!Number.isInteger(tabId)) throw new Error("No bound game tab");
      const data = await chrome.tabs.sendMessage(tabId, { type: "gst:harvest-status" });
      if (typeof data.applied !== "boolean") {
        status.textContent = "Tab game vẫn dùng cầu nối cũ. Tải lại extension tại chrome://extensions, rồi tải lại trang game.";
      } else if (typeof data.enabled !== "boolean") {
        status.textContent = `Trạng thái: ${data.message}`;
      } else if (!data.applied || data.enabled !== confirmed.enabled) {
        status.textContent = `Đã lưu: ${confirmed.enabled ? "BẬT" : "TẮT"} · Trang game: ${data.enabled ? "BẬT" : "TẮT"}. ${data.message}`;
      } else {
        status.textContent = `Thu hoạch: ${data.enabled ? "BẬT" : "TẮT"} · ${data.message}`;
      }
      const next = Array.isArray(data.catalog) ? data.catalog : [];
      if (JSON.stringify(next) !== JSON.stringify(catalog) || available !== (data.available === true)
          || mapAvailable !== (data.mapAvailable === true)) {
        catalog = next; available = data.available === true; mapAvailable = data.mapAvailable === true; renderList();
      }
    } catch {
      status.textContent = "Mở tab game và tải lại sau khi cập nhật extension để đọc Thu hoạch.";
      if (catalog.length || available || mapAvailable) { catalog = []; available = false; mapAvailable = false; renderList(); }
    } finally { busy = false; refreshDebug(); }
  }
  globalThis.GSTHarvestPopup = { refresh, flushNumericDrafts };
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.harvestShortcut) showShortcut(changes.harvestShortcut.newValue);
    if (!changes.harvestPreferences && !changes[GSTAccountProfiles.profilesKey]) return;
    storageRevision++;
    if (!loaded) return;
    void reloadPreferences();
  });
  async function reloadPreferences(contextOverride) {
    const version = harvestAccountContextVersion;
    const context = arguments.length ? contextOverride : harvestAccountSession?.current?.() ?? harvestAccountContext;
    const saved = await chrome.storage.local.get(["harvestPreferences", GSTAccountProfiles.profilesKey]);
    if (version !== harvestAccountContextVersion) return;
    harvestAccountContext = context;
    harvestProfileBindingRequired = harvestAccountSession?.bindingRequired?.() === true;
    controls.disabled = !!context && context.verified !== true
      || harvestProfileBindingRequired && context?.verified !== true;
    if (context && context.verified !== true)
      status.textContent = "Chưa xác nhận nick trong tab hiện tại; cài đặt Thu hoạch bị khóa.";
    confirmed = GSTHarvest.normalize(harvestProfileBindingRequired && context?.verified !== true
      ? null : GSTAccountProfiles.currentProfile(context, "harvest", saved));
    for (const [key, input] of ranges) if (!dirty.has(key)) input.value = confirmed[key];
    derivePreferences(); renderList(); updateMessage();
  }
  window.addEventListener("gst:popup-account-context-change", (event) => {
    const context = event.detail?.context ?? null;
    harvestAccountContextVersion = event.detail?.version ?? harvestAccountContextVersion + 1;
    harvestAccountContext = context;
    harvestProfileBindingRequired = harvestAccountSession?.bindingRequired?.() === true;
    pending = [];
    dirty.clear();
    for (const [key] of ranges) editVersions.set(key, (editVersions.get(key) ?? 0) + 1);
    rangeErrors.clear(); rangeWrites.clear(); failedFields.clear(); saveMessage = "";
    void reloadPreferences(context);
  });
  chrome.storage.local.get(["harvestPreferences", GSTAccountProfiles.profilesKey,
    "harvestDebugEnabled", "harvestShortcut"]).then(async (saved) => {
    showShortcut(saved.harvestShortcut);
    debugToggle.checked = saved.harvestDebugEnabled === true;
    debugDetails.hidden = !debugToggle.checked;
    debugToggle.disabled = false;
    harvestAccountContext = harvestAccountSession
      ? harvestAccountSession.current() : await harvestAccountContextPromise;
    harvestAccountContextVersion = harvestAccountSession?.version?.() ?? harvestAccountContextVersion;
    harvestProfileBindingRequired = harvestAccountSession?.bindingRequired?.() === true;
    confirmed = GSTHarvest.normalize(harvestProfileBindingRequired && harvestAccountContext?.verified !== true
      ? null : GSTAccountProfiles.currentProfile(harvestAccountContext, "harvest", saved));
    preferences = confirmed;
    enabled.checked = preferences.enabled;
    allowFarm.checked = preferences.allowFarm;
    mode.value = preferences.mode;
    for (const [key, input] of ranges) input.value = preferences[key];
    loaded = true;
    renderList(); controls.disabled = !!harvestAccountContext && harvestAccountContext.verified !== true
      || harvestProfileBindingRequired && harvestAccountContext?.verified !== true;
    if (harvestAccountContext && harvestAccountContext.verified !== true)
      status.textContent = "Chưa xác nhận nick trong tab hiện tại; cài đặt Thu hoạch bị khóa.";
    refresh();
  }).catch(() => {
    debugToggle.disabled = false;
    feedback.textContent = "Chưa đọc được cài đặt Thu hoạch; hãy mở lại popup.";
  });
})();
