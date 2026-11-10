(() => {
  "use strict";
  const select = document.getElementById("menuOrientation");
  const feedback = document.getElementById("menuOrientationFeedback");
  let saved = "vertical", revision = 0;
  function apply(value) {
    saved = value === "horizontal" ? "horizontal" : "vertical";
    select.value = saved;
    document.body.dataset.orientation = saved;
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.menuOrientation) { revision++; apply(changes.menuOrientation.newValue); }
  });
  const initialRevision = revision;
  chrome.storage.local.get("menuOrientation").then((value) => {
    if (revision === initialRevision) apply(value.menuOrientation);
    select.disabled = false;
  }).catch(() => { feedback.textContent = "Chưa đọc được bố cục. Mở lại menu để thử."; });
  select.addEventListener("change", async () => {
    const next = select.value, before = revision;
    select.disabled = true;
    try {
      await chrome.storage.local.set({ menuOrientation: next });
      if (revision === before) apply(next);
      feedback.textContent = "";
    } catch { apply(saved); feedback.textContent = "Chưa lưu được bố cục. Hãy thử lại."; }
    finally { select.disabled = false; }
  });
})();
