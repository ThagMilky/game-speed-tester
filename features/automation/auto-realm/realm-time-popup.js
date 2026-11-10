(() => {
  "use strict";
  const input = document.getElementById("realmNotices");
  chrome.storage.local.get("realmNotices").then((saved) => { input.checked = saved.realmNotices === true; input.disabled = false; }).catch(() => {});
  input.addEventListener("change", async () => {
    input.disabled = true;
    try { await chrome.storage.local.set({ realmNotices: input.checked }); }
    catch { input.checked = !input.checked; }
    finally { input.disabled = false; }
  });
})();
