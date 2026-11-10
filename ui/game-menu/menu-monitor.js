(() => {
  "use strict";
  const keys = ["preferences", "farmPreferences", "harvestPreferences", "realmPreferences",
    "chestPreferences", "flightPreferences", "fpsPreferences", "displayPreferences", "fontPreferences", "realmNotices"];
  const values = {}, changed = new Set();
  const output = document.getElementById("activeFeatures");
  let loaded = false;
  function renderSummary() {
    const farm = document.getElementById("autoFarmValue").dataset.state;
    const quest = document.getElementById("questStatus").dataset.running;
    const summaries = {
      farm: farm === "on" ? "Auto Farm đang bật" : farm === "off" ? "Auto Farm đang tắt" : "Chưa đọc được trạng thái",
      harvest: !loaded ? "Đang đọc cài đặt…" : values.harvestPreferences?.enabled ? "Đã bật tự thu hoạch" : "Chưa bật thu hoạch",
      realm: !loaded ? "Đang đọc cài đặt…" : values.realmPreferences?.enabled || values.chestPreferences?.enabled
        ? "Đã bật tính năng bí cảnh / rương" : "Chưa bật tự động",
      quest: quest === "true" ? "Auto Quest đang chạy" : "Chưa xác nhận đang chạy",
      speed: !loaded ? "Đang đọc cài đặt…" : values.preferences?.enabled ? "Đang bật điều chỉnh tốc độ" : "Không điều chỉnh tốc độ",
      fps: !loaded ? "Đang đọc cài đặt…" : values.fpsPreferences?.enabled ? "Đã bật tối ưu FPS" : "Chưa bật tối ưu FPS"
    };
    for (const [id, label] of Object.entries(summaries)) {
      const item = document.querySelector(`[data-summary-for="${id}"]`);
      if (item && item.textContent !== label) item.textContent = label;
    }
  }
  function render() {
    renderSummary();
    const labels = [];
    if (document.getElementById("autoFarmValue").dataset.state === "on") { labels.push("Auto Farm"); if (values.farmPreferences?.noRetreat !== false) labels.push("Không nghỉ vì hết đan HP"); }
    if (document.getElementById("questStatus").dataset.running === "true") labels.push("Auto Quest");
    if (values.farmPreferences?.enabled === true) labels.push(values.farmPreferences.searchScope === "map" ? "Farm toàn map" : "Farm tự chọn ô");
    for (const [key, field, label] of [
      ["farmPreferences", "breakSeals", "Phong ấn"],
      ["harvestPreferences", "enabled", "Thu hoạch"],
      ["realmPreferences", "enabled", "Vào bí cảnh"],
      ["chestPreferences", "enabled", "Mở rương"],
      ["flightPreferences", "always", "Luôn bay"],
      ["preferences", "enabled", "Tốc độ"],
      ["fpsPreferences", "enabled", "FPS"]
    ]) if (values[key]?.[field] === true) labels.push(label);
    if (loaded && values.fontPreferences?.enabled !== false) labels.push("Đổi font");
    if (values.realmPreferences?.keepFarm !== false && loaded) labels.push("Giữ farm");
    if (values.displayPreferences?.visible !== false && loaded) labels.push("Bảng trạng thái");
    if (values.realmNotices === true) labels.push("Nhắc bí cảnh");
    const signature = JSON.stringify(labels);
    if (output.dataset.signature === signature) return;
    output.dataset.signature = signature;
    output.replaceChildren();
    for (const label of labels) {
      const chip = document.createElement("span"); chip.className = "active-feature";
      chip.textContent = label; output.append(chip);
    }
    if (!labels.length) output.textContent = loaded ? "Chưa có tính năng nào bật." : "Đang đọc cài đặt…";
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    for (const key of keys) if (changes[key]) { changed.add(key); values[key] = changes[key].newValue; }
    render();
  });
  chrome.storage.local.get(keys).then((saved) => {
    for (const key of keys) if (!changed.has(key)) values[key] = saved[key];
    loaded = true; render();
  }).catch(() => { output.textContent = "Chưa đọc được cài đặt. Mở lại menu để thử."; });
  for (const [id, attribute] of [["autoFarmValue", "data-state"], ["questStatus", "data-running"]]) {
    new MutationObserver(render).observe(document.getElementById(id), { attributes: true, attributeFilter: [attribute] });
  }
  globalThis.GSTMenuMonitor = { render };
})();
