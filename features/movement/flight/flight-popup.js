(() => {
  "use strict";
  const input = document.getElementById("alwaysFlying"), status = document.getElementById("flightStatus");
  let busy = false;
  input.disabled = true;
  chrome.storage.local.get("flightPreferences").then((value) => { input.checked = value.flightPreferences?.always === true; input.disabled = false; })
    .catch(() => { status.textContent = "Chưa đọc được cài đặt bay."; });
  input.addEventListener("change", async () => {
    const value = input.checked; input.disabled = true;
    try { await chrome.storage.local.set({ flightPreferences: { always: value } }); }
    catch { input.checked = !value; status.textContent = "Chưa lưu được cài đặt bay."; }
    finally { input.disabled = false; }
  });
  globalThis.GSTFlightPopup = { async refresh() {
    if (busy) return; busy = true;
    try { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:flight-status" }); status.textContent = result.message; }
    catch { status.textContent = "Mở tab game để đọc trạng thái bay."; }
    finally { busy = false; }
  } };
})();
