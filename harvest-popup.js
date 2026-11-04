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
  const ranges = [["radius", byId("harvestRadius")], ["clearRadius", byId("harvestClearRadius")], ["reach", byId("harvestReach")]];
  let preferences = GSTHarvest.normalize(null);
  let catalog = [];
  let available = false;
  let saving = false;
  let busy = false;
  const fold = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  function renderList() {
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
      text.textContent = name;
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
        : "Bật Tự hái, chờ vào map để đọc danh sách cây từ game.";
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
        if (result?.navigating) feedback.textContent = "Đã lưu. Game đang tải lại để áp dụng Tự hái.";
        else if (!result?.accepted || !result.applied) throw new Error("Page has not confirmed configuration");
      } catch {
        feedback.textContent = "Đã lưu. Tải lại trang game nếu chưa áp dụng được.";
      }
      await refresh();
    } catch {
      preferences = previous;
      feedback.textContent = "Chưa lưu được Tự hái. Hãy mở lại popup.";
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
  function saveRanges() {
    if (!ranges.every(([, input]) => input.reportValidity())) return;
    save(Object.fromEntries(ranges.map(([key, input]) => [key, input.valueAsNumber])));
  }
  byId("saveHarvestRange").addEventListener("click", saveRanges);
  for (const [, input] of ranges) input.addEventListener("keydown", (event) => { if (event.key === "Enter") saveRanges(); });
  async function refresh() {
    if (busy) return;
    busy = true;
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab");
      const data = await chrome.tabs.sendMessage(tab.id, { type: "gst:harvest-status" });
      status.textContent = `Trạng thái: ${data.message}`;
      const next = Array.isArray(data.catalog) ? data.catalog : [];
      if (JSON.stringify(next) !== JSON.stringify(catalog) || available !== (data.available === true)) {
        catalog = next; available = data.available === true; renderList();
      }
    } catch {
      status.textContent = "Mở tab game và tải lại sau khi cập nhật extension để đọc Tự hái.";
      if (catalog.length || available) { catalog = []; available = false; renderList(); }
    } finally { busy = false; }
  }
  globalThis.GSTHarvestPopup = { refresh };
  chrome.storage.local.get("harvestPreferences").then((saved) => {
    preferences = GSTHarvest.normalize(saved.harvestPreferences);
    enabled.checked = preferences.enabled;
    allowFarm.checked = preferences.allowFarm;
    ignoreMonsters.checked = preferences.ignoreMonsters;
    mode.value = preferences.mode;
    for (const [key, input] of ranges) input.value = preferences[key];
    renderList(); controls.disabled = false; refresh();
  }).catch(() => { feedback.textContent = "Chưa đọc được cài đặt Tự hái; hãy mở lại popup."; });
})();
