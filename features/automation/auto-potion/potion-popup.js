(() => {
  "use strict";
  const controls = document.getElementById("potionControls");
  const hpEnabled = document.getElementById("potionHpEnabled"), mpEnabled = document.getElementById("potionMpEnabled");
  const hpPercent = document.getElementById("potionHpPercent"), mpPercent = document.getElementById("potionMpPercent");
  const feedback = document.getElementById("potionFeedback");
  let confirmed = {}, queue = Promise.resolve();
  function summary() { document.getElementById("potionSummary").textContent = `Đan · HP ${confirmed.hpEnabled ? "bật" : "tắt"} · MP ${confirmed.mpEnabled ? "bật" : "tắt"}`; }
  function sync() { hpPercent.disabled = !hpEnabled.checked; mpPercent.disabled = !mpEnabled.checked; }
  function message(text) {
    const draft = hpPercent.value !== String(confirmed.hpPercent) || mpPercent.value !== String(confirmed.mpPercent);
    feedback.textContent = text + (draft ? " · Có ngưỡng chưa xác nhận." : "");
  }
  async function save(patch, rollback) {
    message("Đang lưu…");
    const operation = queue.catch(() => {}).then(async () => {
      const saved = await chrome.storage.local.get("potionPreferences");
      await chrome.storage.local.set({ potionPreferences: { ...saved.potionPreferences, ...patch } });
    });
    queue = operation;
    try { await operation; Object.assign(confirmed, patch); summary(); message("Đã lưu lựa chọn."); }
    catch { rollback(); sync(); message("Chưa lưu được lựa chọn; cài đặt cũ được giữ."); }
  }
  for (const [input, key] of [[hpEnabled, "hpEnabled"], [mpEnabled, "mpEnabled"]]) {
    input.addEventListener("change", async () => {
      const next = input.checked;
      input.disabled = true; sync();
      await save({ [key]: next }, () => { input.checked = confirmed[key]; });
      input.disabled = false;
    });
  }
  for (const [input, key] of [[hpPercent, "hpPercent"], [mpPercent, "mpPercent"]]) {
    input.addEventListener("input", () => message("Bản nháp chưa lưu; nhấn Enter để xác nhận."));
    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const value = input.valueAsNumber;
      if (!input.checkValidity() || !Number.isSafeInteger(value) || value < 1 || value > 99) {
        feedback.textContent = "Ngưỡng phải là số nguyên từ 1 đến 99; cài đặt cũ được giữ."; return;
      }
      input.disabled = true;
      await save({ [key]: value }, () => { input.value = String(confirmed[key]); });
      sync();
    });
  }
  chrome.storage.local.get("potionPreferences").then(({ potionPreferences: value }) => {
    confirmed = { hpEnabled: value?.hpEnabled === true, mpEnabled: value?.mpEnabled === true,
      hpPercent: Number.isSafeInteger(value?.hpPercent) && value.hpPercent >= 1 && value.hpPercent <= 99 ? value.hpPercent : 40,
      mpPercent: Number.isSafeInteger(value?.mpPercent) && value.mpPercent >= 1 && value.mpPercent <= 99 ? value.mpPercent : 25 };
    hpEnabled.checked = confirmed.hpEnabled; mpEnabled.checked = confirmed.mpEnabled;
    hpPercent.value = confirmed.hpPercent; mpPercent.value = confirmed.mpPercent;
    controls.disabled = false; sync(); summary();
  }).catch(() => { feedback.textContent = "Chưa đọc được cài đặt đan. Hãy mở lại menu."; });
})();
