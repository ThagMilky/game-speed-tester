(() => {
  "use strict";
  const keys = ["preferences", "farmPreferences", "harvestPreferences", "realmPreferences",
    "chestPreferences", "flightPreferences", "fpsPreferences", "displayPreferences", "fontPreferences", "realmNotices"];
  const values = {}, changed = new Set();
  const output = document.getElementById("activeFeatures");
  let loaded = false;
  function render() {
    const labels = [];
    if (document.getElementById("autoFarmValue").dataset.state === "on") labels.push("Auto Farm");
    if (document.getElementById("questStatus").dataset.running === "true") labels.push("Auto Quest");
    for (const [key, field, label] of [
      ["farmPreferences", "enabled", "Phạm vi farm"],
      ["farmPreferences", "breakSeals", "Phong ấn"],
      ["farmPreferences", "avoidEnabled", "Né quái"],
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
  globalThis.GSTMenuMonitor = { render };
})();
