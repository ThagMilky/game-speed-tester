(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const controls = byId("harvestControls");
  const enabled = byId("harvestEnabled");
  const allowFarm = byId("harvestAllowFarm");
  const ignoreMonsters = byId("harvestIgnoreMonsters");
  const mode = byId("harvestMode");
  const search = byId("harvestSearch");
  const list = byId("harvestItems");
  const feedback = byId("harvestFeedback");
  const status = byId("harvestStatus");
  const scope = byId("harvestSearchScope");
  const ranges = [["radius", byId("harvestRadius")], ["clearRadius", byId("harvestClearRadius")], ["reach", byId("harvestReach")]];
  let preferences = GSTHarvest.normalize(null);
  let catalog = [];
  let available = false;
  let saving = false;
  let busy = false;
  let loaded = false;
  const debugPanel = byId("harvestDebugPanel");
  const debugToggle = byId("harvestDebugEnabled");
  const debugOutput = byId("harvestDebugOutput");
  const debugFeedback = byId("harvestDebugFeedback");
  const debugDetails = byId("harvestDebugDetails");
  let debugBusy = false;
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
      output.value = JSON.stringify({ build: "harvest-history-1", scope: "Last 10 completed attempts in this game tab; no runtime credentials", attempts: data.recentAttempts }, null, 2);
      if (!data.recentAttempts.length) { feedback.textContent = "Chưa có lượt kết thúc. Cho Thu hoạch chạy rồi sao chép lại."; return; }
      try { await navigator.clipboard.writeText(output.value); feedback.textContent = "Đã sao chép. Dán log vào chat để kiểm tra."; }
      catch { output.hidden = false; output.focus(); output.select(); feedback.textContent = "Đã chọn log; bấm Ctrl+C để sao chép."; }
    } catch { feedback.textContent = "Chưa đọc được lịch sử. Reload extension rồi tải lại game nếu vừa cập nhật."; }
    finally { button.disabled = false; }
  });
  async function refreshDebug() {
    if (debugBusy || !debugToggle.checked || !debugPanel.open) return;
    debugBusy = true;
    try {
      const data = await debugMessage("gst:harvest-debug-get");
      if (data?.build !== "harvest-bridge-log-2-events") throw new Error("Old bridge");
      const value = JSON.stringify(data, null, 2);
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
      debugOutput.value = JSON.stringify(data, null, 2);
      debugFeedback.textContent = "";
      await refreshDebug();
    } catch { debugFeedback.textContent = "Đã yêu cầu ghi log; tải lại trang game nếu chưa nhận được log."; }
    finally { debugToggle.disabled = false; }
  });
  debugPanel.addEventListener("toggle", refreshDebug);
  byId("copyHarvestDebug").addEventListener("click", async () => {
    if (!debugOutput.value) { debugFeedback.textContent = "Bật ghi log và chờ đọc được dữ liệu trước."; return; }
    try {
      await navigator.clipboard.writeText(debugOutput.value);
      debugFeedback.textContent = "Đã sao chép. Bạn có thể dán log vào chat.";
    } catch {
      debugOutput.focus(); debugOutput.select();
      debugFeedback.textContent = "Đã chọn log; bấm Ctrl+C để sao chép.";
    }
  });
  byId("clearHarvestDebug").addEventListener("click", async () => {
    try {
      debugOutput.value = JSON.stringify(await debugMessage("gst:harvest-debug-clear"), null, 2);
      debugFeedback.textContent = "Đã xóa log.";
    } catch { debugFeedback.textContent = "Chưa xóa được log; tab có thể đang tải lại."; }
  });
  const fold = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  const kind = byId("harvestKind");
  kind.addEventListener("change", () => save({ kind: kind.value }));
  function renderList() {
    byId("harvestShowTargetLine").checked = preferences.showTargetLine;
    kind.value = preferences.kind;
    scope.value = preferences.searchScope;
    byId("harvestRadius").disabled = preferences.searchScope === "map";
    byId("harvestCount").textContent = `Đã chọn ${preferences.items.length} loại`;
    byId("clearHarvestItems").disabled = !preferences.items.length;
    const focused = document.activeElement?.dataset?.item;
    const inMap = new Map(catalog.map((item) => [item.name, item.inMap]));
    const names = [...new Set([...preferences.items, ...inMap.keys()])]
      .filter((name) => fold(name).includes(fold(search.value.trim())))
      .sort((a, b) => Number(preferences.items.includes(b)) - Number(preferences.items.includes(a)) || a.localeCompare(b, "vi"));
    const nodes = names.map((name) => {
      const row = document.createElement("label");
      row.className = "check-row";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.item = name;
      checkbox.checked = preferences.items.includes(name);
      checkbox.disabled = preferences.mode !== "selected";
      const text = document.createElement("span");
      const type = catalog.find((item) => item.name === name)?.kind;
      text.textContent = `${type === "ore" ? "[Đào] " : type === "plant" ? "[Hái] " : type === "both" ? "[Hái/đào] " : ""}${name}`;
      if (!inMap.get(name)) {
        const hint = document.createElement("small");
        hint.textContent = available ? "Không có trong map" : "Đã lưu · chưa đọc được dữ liệu map";
        text.append(hint);
      }
      row.append(checkbox, text);
      return row;
    });
    if (!nodes.length) {
      const empty = document.createElement("p");
      empty.className = "hint";
      empty.textContent = available ? "Không có loại cây khớp tìm kiếm."
        : "Bật Thu hoạch, chờ vào map để đọc danh sách cây từ game.";
      nodes.push(empty);
    }
    list.replaceChildren(...nodes);
    if (focused) [...list.querySelectorAll("input")].find((input) => input.dataset.item === focused)?.focus();
  }
  async function save(patch) {
    if (saving) return;
    const previous = preferences;
    preferences = GSTHarvest.normalize({ ...preferences, ...patch });
    saving = true;
    controls.disabled = true;
    try {
      await chrome.storage.local.set({ harvestPreferences: preferences });
      feedback.textContent = "";
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) throw new Error("No active tab");
        const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:harvest-configure", preferences });
        if (result?.navigating) feedback.textContent = "Đã lưu. Game đang tải lại để áp dụng Thu hoạch.";
        else if (!result?.accepted || !result.applied) throw new Error("Page has not confirmed configuration");
      } catch {
        feedback.textContent = "Đã lưu. Tải lại trang game nếu chưa áp dụng được.";
      }
      await refresh();
    } catch {
      preferences = previous;
      feedback.textContent = "Chưa lưu được Thu hoạch. Hãy mở lại popup.";
    } finally {
      enabled.checked = preferences.enabled;
      allowFarm.checked = preferences.allowFarm;
      ignoreMonsters.checked = preferences.ignoreMonsters;
      mode.value = preferences.mode;
      renderList();
      controls.disabled = false;
      saving = false;
    }
  }
  byId("harvestShowTargetLine").addEventListener("change", (event) => save({ showTargetLine: event.target.checked }));
  enabled.addEventListener("change", () => save({ enabled: enabled.checked }));
  allowFarm.addEventListener("change", () => save({ allowFarm: allowFarm.checked }));
  ignoreMonsters.addEventListener("change", () => save({ ignoreMonsters: ignoreMonsters.checked }));
  mode.addEventListener("change", () => save({ mode: mode.value }));
  search.addEventListener("input", renderList);
  byId("clearHarvestItems").addEventListener("click", () => save({ items: [] }));
  list.addEventListener("change", (event) => {
    const name = event.target.dataset?.item;
    if (!name) return;
    const items = new Set(preferences.items);
    if (event.target.checked) items.add(name); else items.delete(name);
    save({ items: [...items] });
  });
  scope.addEventListener("change", () => save({ searchScope: scope.value }));
  function saveRanges() {
    if (!ranges.every(([, input]) => input.reportValidity())) return;
    save(Object.fromEntries(ranges.filter(([key]) => key !== "radius" || preferences.searchScope !== "map").map(([key, input]) => [key, input.valueAsNumber])));
  }
  byId("saveHarvestRange").addEventListener("click", saveRanges);
  for (const [, input] of ranges) input.addEventListener("keydown", (event) => { if (event.key === "Enter") saveRanges(); });
  async function refresh() {
    if (busy || !loaded) return;
    busy = true;
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab");
      const data = await chrome.tabs.sendMessage(tab.id, { type: "gst:harvest-status", preferences });
      if (typeof data.applied !== "boolean") {
        status.textContent = "Tab game vẫn dùng cầu nối cũ. Tải lại extension tại chrome://extensions, rồi tải lại trang game.";
      } else if (typeof data.enabled !== "boolean") {
        status.textContent = `Trạng thái: ${data.message}`;
      } else if (!data.applied || data.enabled !== preferences.enabled) {
        status.textContent = `Đã lưu: ${preferences.enabled ? "BẬT" : "TẮT"} · Trang game: ${data.enabled ? "BẬT" : "TẮT"}. ${data.message}`;
      } else {
        status.textContent = `Thu hoạch: ${data.enabled ? "BẬT" : "TẮT"} · ${data.message}`;
      }
      const next = Array.isArray(data.catalog) ? data.catalog : [];
      if (JSON.stringify(next) !== JSON.stringify(catalog) || available !== (data.available === true)) {
        catalog = next; available = data.available === true; renderList();
      }
    } catch {
      status.textContent = "Mở tab game và tải lại sau khi cập nhật extension để đọc Thu hoạch.";
      if (catalog.length || available) { catalog = []; available = false; renderList(); }
    } finally { busy = false; refreshDebug(); }
  }
  globalThis.GSTHarvestPopup = { refresh };
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.harvestPreferences || saving) return;
    preferences = GSTHarvest.normalize(changes.harvestPreferences.newValue);
    enabled.checked = preferences.enabled;
    allowFarm.checked = preferences.allowFarm;
    ignoreMonsters.checked = preferences.ignoreMonsters;
    mode.value = preferences.mode;
    renderList();
  });
  chrome.storage.local.get(["harvestPreferences", "harvestDebugEnabled"]).then((saved) => {
    debugToggle.checked = saved.harvestDebugEnabled === true;
    debugDetails.hidden = !debugToggle.checked;
    debugToggle.disabled = false;
    preferences = GSTHarvest.normalize(saved.harvestPreferences);
    enabled.checked = preferences.enabled;
    allowFarm.checked = preferences.allowFarm;
    ignoreMonsters.checked = preferences.ignoreMonsters;
    mode.value = preferences.mode;
    for (const [key, input] of ranges) input.value = preferences[key];
    loaded = true;
    renderList(); controls.disabled = false; refresh();
  }).catch(() => {
    debugToggle.disabled = false;
    feedback.textContent = "Chưa đọc được cài đặt Thu hoạch; hãy mở lại popup.";
  });
})();
