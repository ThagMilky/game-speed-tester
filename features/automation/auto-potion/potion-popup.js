(() => {
  "use strict";
  const controls = document.getElementById("potionControls");
  const hpEnabled = document.getElementById("potionHpEnabled"), mpEnabled = document.getElementById("potionMpEnabled");
  const hpPercent = document.getElementById("potionHpPercent"), mpPercent = document.getElementById("potionMpPercent");
  const feedback = document.getElementById("potionFeedback");
  let confirmed = {}, queue = Promise.resolve(), loaded = false;
  const thresholdWrites = new Map();
  function summary() { document.getElementById("potionSummary").textContent = `Đan · HP ${confirmed.hpEnabled ? "bật" : "tắt"} · MP ${confirmed.mpEnabled ? "bật" : "tắt"}`; }
  function sync() { hpPercent.disabled = !hpEnabled.checked; mpPercent.disabled = !mpEnabled.checked; }
  function message(text) {
    const draft = hpPercent.value !== String(confirmed.hpPercent) || mpPercent.value !== String(confirmed.mpPercent);
    feedback.textContent = text + (draft ? " · Có ngưỡng chưa xác nhận." : "");
  }
  async function save(patch, rollback) {
    message("Đang lưu…");
    const operation = queue.catch(() => {}).then(() => navigator.locks.request("gst:potion-preferences", async () => {
      const saved = await chrome.storage.local.get("potionPreferences");
      await chrome.storage.local.set({ potionPreferences: { ...saved.potionPreferences, ...patch } });
    }));
    queue = operation;
    try { await operation; Object.assign(confirmed, patch); summary(); message("Đã lưu lựa chọn."); return true; }
    catch { rollback?.(); sync(); message("Chưa lưu được lựa chọn; cài đặt cũ được giữ."); return false; }
  }
  for (const [input, key] of [[hpEnabled, "hpEnabled"], [mpEnabled, "mpEnabled"]]) {
    input.addEventListener("change", async () => {
      const next = input.checked;
      input.disabled = true; sync();
      await save({ [key]: next }, () => { input.checked = confirmed[key]; });
      input.disabled = false;
    });
  }
  function validThreshold(input) {
    const value = input.valueAsNumber;
    return input.checkValidity() && Number.isSafeInteger(value) && value >= 1 && value <= 99;
  }
  function commitThreshold(input, key) {
    if (!loaded) return Promise.resolve(false);
    if (thresholdWrites.has(key)) return thresholdWrites.get(key);
    if (!validThreshold(input)) {
      feedback.textContent = `${key === "hpPercent" ? "Ngưỡng HP" : "Ngưỡng MP"} phải là số nguyên từ 1 đến 99; cài đặt cũ được giữ.`;
      return Promise.resolve(false);
    }
    const value = input.valueAsNumber;
    if (value === confirmed[key]) {
      input.value = String(confirmed[key]);
      return Promise.resolve(true);
    }
    input.disabled = true;
    const operation = save({ [key]: value }).then((saved) => {
      if (saved) input.value = String(confirmed[key]);
      return saved;
    }).finally(() => {
      thresholdWrites.delete(key);
      sync();
    });
    thresholdWrites.set(key, operation);
    return operation;
  }
  const thresholds = [[hpPercent, "hpPercent"], [mpPercent, "mpPercent"]];
  for (const [input, key] of thresholds) {
    input.addEventListener("input", () => message("Bản nháp chưa lưu; rời ô nhập để lưu."));
    input.addEventListener("blur", () => { void commitThreshold(input, key); });
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      void commitThreshold(input, key);
    });
  }
  async function flushNumericDrafts() {
    if (!loaded) return { saved: false, reason: "load" };
    for (const [input, key] of thresholds)
      if (!validThreshold(input)) return { saved: false, reason: "invalid", field: key === "hpPercent" ? "potionHpPercent" : "potionMpPercent" };
    const results = await Promise.all(thresholds.map(([input, key]) => commitThreshold(input, key)));
    const queued = await queue.then(() => true, () => false);
    return results.every(Boolean) && queued ? { saved: true } : { saved: false, reason: "persistence" };
  }
  globalThis.GSTPotionPopup = { flushNumericDrafts };
  chrome.storage.local.get("potionPreferences").then(({ potionPreferences: value }) => {
    confirmed = { hpEnabled: value?.hpEnabled === true, mpEnabled: value?.mpEnabled === true,
      hpPercent: Number.isSafeInteger(value?.hpPercent) && value.hpPercent >= 1 && value.hpPercent <= 99 ? value.hpPercent : 40,
      mpPercent: Number.isSafeInteger(value?.mpPercent) && value.mpPercent >= 1 && value.mpPercent <= 99 ? value.mpPercent : 25 };
    hpEnabled.checked = confirmed.hpEnabled; mpEnabled.checked = confirmed.mpEnabled;
    hpPercent.value = confirmed.hpPercent; mpPercent.value = confirmed.mpPercent;
    controls.disabled = false; loaded = true; sync(); summary();
  }).catch(() => { feedback.textContent = "Chưa đọc được cài đặt đan. Hãy mở lại menu."; });
})();
