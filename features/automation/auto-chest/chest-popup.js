(() => {
  "use strict";
  const controls = document.getElementById("chestControls"), enabled = document.getElementById("chestEnabled");
  const allowFarm = document.getElementById("chestAllowFarm"), kind = document.getElementById("chestKind"), status = document.getElementById("chestStatus");
  let saved = null, busy = false;
  function render() { enabled.checked = saved?.enabled === true; allowFarm.checked = saved?.allowFarm === true; kind.value = ["common", "hidden", "treasure"].includes(saved?.kind) ? saved.kind : "all"; }
  controls.addEventListener("change", async () => {
    controls.disabled = true;
    const next = { enabled: enabled.checked, allowFarm: allowFarm.checked, kind: kind.value };
    try { await chrome.storage.local.set({ chestPreferences: next }); saved = next; }
    catch { render(); status.textContent = "Chưa lưu được cài đặt rương."; }
    finally { controls.disabled = false; }
  });
  chrome.storage.local.get("chestPreferences").then((value) => { saved = value.chestPreferences ?? {}; render(); controls.disabled = false; }).catch(() => {});
  globalThis.GSTChestPopup = { async refresh() {
    if (busy) return; busy = true;
    try { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:chest-status" }); status.textContent = result.message; }
    catch { status.textContent = "Mở tab game và tải lại sau khi cập nhật."; }
    finally { busy = false; }
  } };
})();
