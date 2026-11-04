(() => {
  "use strict";
  const controls = document.getElementById("realmControls");
  const status = document.getElementById("realmStatus"), feedback = document.getElementById("realmFeedback");
  const fields = [["enabled", document.getElementById("realmEnabled")],
    ["allowFarm", document.getElementById("realmAllowFarm")], ["keepFarm", document.getElementById("realmKeepFarm")]];
  let preferences = null, busy = false, saving = false;
  let revision = 0;
  const normalize = (value) => ({ enabled: value?.enabled === true, allowFarm: value?.allowFarm === true, keepFarm: value?.keepFarm !== false });
  function render() { for (const [key, input] of fields) input.checked = preferences[key]; }
  async function send(type) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");
    return chrome.tabs.sendMessage(tab.id, { type, preferences });
  }
  async function refresh() {
    if (!preferences || busy) return;
    busy = true;
    try {
      const data = await send("gst:realm-status");
      status.textContent = data.applied ? `Tự vào bí cảnh: ${data.enabled ? "BẬT" : "TẮT"} · ${data.message}`
        : `Cài đặt chưa được trang xác nhận. ${data.message}`;
    } catch { status.textContent = "Mở tab game; tải lại sau khi cập nhật extension."; }
    finally { busy = false; }
  }
  controls.addEventListener("change", async () => {
    if (saving || !preferences) return;
    const previous = preferences;
    preferences = Object.fromEntries(fields.map(([key, input]) => [key, input.checked]));
    controls.disabled = true; saving = true;
    try {
      await chrome.storage.local.set({ realmPreferences: preferences });
      feedback.textContent = "";
      try { await send("gst:realm-configure"); }
      catch { feedback.textContent = "Đã lưu. Tải lại game nếu chưa áp dụng được."; }
      await refresh();
    } catch { preferences = previous; render(); feedback.textContent = "Chưa lưu được lựa chọn bí cảnh."; }
    finally { saving = false; controls.disabled = false; }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.realmPreferences || saving) return;
    revision++; preferences = normalize(changes.realmPreferences.newValue); render(); refresh();
  });
  const initialRevision = revision;
  chrome.storage.local.get("realmPreferences").then(({ realmPreferences: value }) => {
    if (revision === initialRevision) preferences = normalize(value);
    render(); controls.disabled = false; refresh();
  }).catch(() => { feedback.textContent = "Chưa đọc được cài đặt bí cảnh; mở lại popup."; });
  globalThis.GSTRealmPopup = { refresh };
})();
