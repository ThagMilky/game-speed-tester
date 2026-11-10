(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const allowed = /^(?:Period|Comma|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal|Backquote|Key[A-Z]|Digit[0-9]|F(?:[1-9]|10))$/;
  const names = { Period: ".", Comma: ",", Slash: "/", Semicolon: ";",
    Quote: "'", BracketLeft: "[", BracketRight: "]", Backslash: "\\",
    Minus: "-", Equal: "=", Backquote: "Backquote" };
  const codes = { Period: 190, Comma: 188, Slash: 191, Semicolon: 186,
    Quote: 222, BracketLeft: 219, BracketRight: 221, Backslash: 220,
    Minus: 189, Equal: 187, Backquote: 192 };
  const controls = document.getElementById("areaMapShortcutControls");
  const label = document.getElementById("areaMapShortcutLabel");
  const feedback = document.getElementById("areaMapFeedback");
  const capture = document.getElementById("areaMapShortcutCapture");
  const reset = document.getElementById("areaMapShortcutReset");
  const open = document.getElementById("areaMapOpen");
  let recording = false, savedFarmKey = null, storageRevision = 0;
  function numeric(code) {
    if (codes[code]) return codes[code];
    if (/^Key[A-Z]$/.test(code)) return code.charCodeAt(3);
    if (/^Digit[0-9]$/.test(code)) return code.charCodeAt(5);
    return /^F(?:[1-9]|10)$/.test(code) ? Number(code.slice(1)) + 111 : null;
  }
  function name(code) {
    if (!code) return ". (mặc định)";
    return names[code] ?? code.replace(/^Key/, "").replace(/^Digit/, "");
  }
  async function save(code) {
    controls.disabled = true;
    try {
      await chrome.storage.local.set({ areaMapShortcut: { code } });
      label.textContent = name(code);
      feedback.textContent = "Đã lưu phím mở bản đồ.";
    } catch { feedback.textContent = "Chưa lưu được. Hãy thử lại."; }
    finally { controls.disabled = false; }
  }
  capture.addEventListener("click", () => {
    recording = true; feedback.textContent = "Bấm phím muốn dùng… (Esc để hủy).";
  });
  reset.addEventListener("click", () => { recording = false; save(null); });
  window.addEventListener("keydown", (event) => {
    if (!recording) return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (event.key === "Escape") { recording = false; feedback.textContent = "Đã hủy."; return; }
    const code = event.code;
    if (event.repeat || event.isComposing || event.ctrlKey || event.altKey || event.shiftKey || event.metaKey
        || !allowed.test(code) || ["F5", "KeyM", "KeyV"].includes(code) || numeric(code) === savedFarmKey) {
      feedback.textContent = "Phím trùng thao tác game/Auto Farm hoặc không hợp lệ. Chọn chữ, số, dấu câu hoặc F1–F10 (trừ F5, M, V), không kèm Ctrl/Alt/Shift.";
      return;
    }
    recording = false; save(code);
  }, true);
  open.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:area-map-toggle" });
      if (!result?.accepted) throw new Error("Map bridge unavailable");
      if (new URLSearchParams(location.search).get("embedded") === "1")
        parent.postMessage({ channel: "gst:menu-close:v1" }, origin);
      else window.close();
    } catch { feedback.textContent = "Không mở được bản đồ. Hãy tải lại tab game sau khi cập nhật extension."; }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.areaMapShortcut) { storageRevision++; label.textContent = name(changes.areaMapShortcut.newValue?.code); }
    if (changes.farmShortcut) {
      storageRevision++; savedFarmKey = Number.isSafeInteger(changes.farmShortcut.newValue?.code)
        ? changes.farmShortcut.newValue.code : 86;
    }
  });
  const version = storageRevision;
  chrome.storage.local.get(["areaMapShortcut", "farmShortcut"]).then((value) => {
    if (version !== storageRevision) return;
    savedFarmKey = Number.isSafeInteger(value.farmShortcut?.code) ? value.farmShortcut.code : 86;
    label.textContent = name(value.areaMapShortcut?.code);
    controls.disabled = false;
  }).catch(() => { feedback.textContent = "Chưa đọc được phím tắt; hãy mở lại Menu tool."; });
})();
