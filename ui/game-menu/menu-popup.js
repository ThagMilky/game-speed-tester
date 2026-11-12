(() => {
  "use strict";
  const embedded = new URLSearchParams(location.search).get("embedded") === "1";
  const button = document.getElementById("openGameMenu");
  if (embedded) {
    document.body.classList.add("embedded"); button.hidden = true;
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault(); event.stopImmediatePropagation();
        if (recording) { recording = false; shortcutFeedback.textContent = "Đã hủy."; return; }
        parent.postMessage({ channel: "gst:menu-close:v1" }, "https://nghichthienky.online");
      }
    }, true);
  }
  const controls = document.getElementById("menuPositionControls"), select = document.getElementById("menuPosition");
  const feedback = document.getElementById("menuPositionFeedback");
  const shortcutLabel = document.getElementById("menuShortcutLabel"), shortcutFeedback = document.getElementById("menuShortcutFeedback");
  let shortcut = { code: "Tab", ctrl: false, alt: false, shift: false, meta: false }, recording = false, shortcutRevision = 0;
  const showShortcut = () => { shortcutLabel.textContent = `${shortcut.ctrl ? "Ctrl + " : ""}${shortcut.alt ? "Alt + " : ""}${shortcut.shift ? "Shift + " : ""}${shortcut.meta ? "Meta + " : ""}${shortcut.code}`; };
  const storeShortcut = async (value) => {
    try { await chrome.storage.local.set({ menuShortcut: value }); shortcut = value; showShortcut(); shortcutFeedback.textContent = "Đã lưu phím mở Menu tool."; }
    catch { shortcutFeedback.textContent = "Chưa lưu được phím. Thử lại."; }
  };
  document.getElementById("captureMenuShortcut").addEventListener("click", () => {
    recording = true; shortcutFeedback.textContent = "Bấm một phím hoặc giữ Ctrl/Alt/Shift/Meta rồi bấm phím. Esc để hủy.";
  });
  document.getElementById("resetMenuShortcut").addEventListener("click", () => {
    recording = false; void storeShortcut({ code: "Tab", ctrl: false, alt: false, shift: false, meta: false });
  });
  window.addEventListener("keydown", (event) => {
    if (!recording) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.key === "Escape") { recording = false; shortcutFeedback.textContent = "Đã hủy."; return; }
    if (["Control", "Alt", "Shift", "Meta"].includes(event.key) || event.repeat) return;
    if (!event.code || event.code === "F5") { shortcutFeedback.textContent = "Phím này không dùng được."; return; }
    recording = false;
    void storeShortcut({ code: event.code, ctrl: event.ctrlKey, alt: event.altKey, shift: event.shiftKey, meta: event.metaKey });
  }, true);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.menuShortcut) { shortcutRevision++; shortcut = changes.menuShortcut.newValue ?? shortcut; showShortcut(); }
  });
  const initialShortcutRevision = shortcutRevision;
  chrome.storage.local.get("menuShortcut").then((value) => {
    if (shortcutRevision === initialShortcutRevision) shortcut = value.menuShortcut ?? shortcut;
    showShortcut();
  }).catch(() => { shortcutFeedback.textContent = "Chưa đọc được phím tắt."; });
  let saved = GSTMenuPosition.normalize(null), busy = false, revision = 0;
  function render() { select.value = saved.position; }
  async function savePosition(value) {
    if (busy) return;
    busy = true; controls.disabled = true;
    const before = revision;
    try { await chrome.storage.local.set({ menuPosition: value }); if (revision === before) saved = value; render(); feedback.textContent = "Đã lưu vị trí nút Menu tool."; }
    catch { render(); feedback.textContent = "Chưa lưu được vị trí. Thử lại."; }
    finally { busy = false; controls.disabled = false; }
  }
  select.addEventListener("change", () => savePosition(GSTMenuPosition.normalize({ ...saved, position: select.value })));
  document.getElementById("resetMenuPosition").addEventListener("click", () => savePosition(GSTMenuPosition.normalize(null)));
  document.getElementById("editMenuPosition").addEventListener("click", async () => {
    if (embedded) { parent.postMessage({ channel: "gst:menu-edit:v1" }, "https://nghichthienky.online"); return; }
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:menu-position-edit" });
      if (result.editing) window.close(); else feedback.textContent = "Chờ game tải xong rồi thử lại.";
    } catch { feedback.textContent = "Mở tab game và tải lại sau cập nhật để kéo nút."; }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.menuPosition) { revision++; saved = GSTMenuPosition.normalize(changes.menuPosition.newValue); render(); }
  });
  const initialRevision = revision;
  chrome.storage.local.get("menuPosition").then((value) => { if (revision === initialRevision) saved = GSTMenuPosition.normalize(value.menuPosition); render(); controls.disabled = false; })
    .catch(() => { feedback.textContent = "Chưa đọc được cài đặt vị trí. Mở lại menu để thử."; });
  button.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:open-menu" });
      if (result.opened) window.close();
    } catch { document.getElementById("feedback").textContent = "Mở tab game, tải lại sau cập nhật rồi thử lại."; }
  });
})();
