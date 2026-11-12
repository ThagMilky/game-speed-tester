(() => {
  "use strict";
  let menuOrientation = "vertical", orientationRevision = 0;
  let menuShortcut = { code: "Tab", ctrl: false, alt: false, shift: false, meta: false }, shortcutRevision = 0;
  const setOrientation = (value) => {
    menuOrientation = value === "horizontal" ? "horizontal" : "vertical";
    if (root) root.dataset.orientation = menuOrientation;
  };
  const extensionId = chrome.runtime.id;
  const popupUrl = chrome.runtime.getURL("popup.html?embedded=1");
  const extensionOrigin = `chrome-extension://${extensionId}`;
  function contextAlive() {
    try { return chrome.runtime.id === extensionId; } catch { return false; }
  }
  let root = null, panel = null, frame = null, frameLoaded = false, opened = false, launch = null, editor = null, feedback = null, closeNotice = null, observer = null;
  let saved = GSTMenuPosition.normalize(null), draft = null, editing = false, dragging = null, saving = false, revision = 0;
  let closeRequest = 0, closing = false, cancelPendingClose = null;
  function bounds() {
    const rect = launch.getBoundingClientRect();
    const margin = 12;
    return { rect, margin, width: Math.max(0, innerWidth - rect.width - margin * 2), height: Math.max(0, innerHeight - rect.height - margin * 2) };
  }
  function position() {
    if (!launch?.isConnected) return;
    const box = bounds(), point = editing ? draft : saved;
    launch.style.left = `${Math.min(Math.max(0, innerWidth - box.rect.width), box.margin + point.x * box.width)}px`;
    launch.style.top = `${Math.min(Math.max(0, innerHeight - box.rect.height), box.margin + point.y * box.height)}px`;
  }
  function endEdit() {
    if (dragging && launch?.hasPointerCapture?.(dragging.id)) launch.releasePointerCapture(dragging.id);
    editing = false; dragging = null; draft = null;
    if (root) { root.dataset.open = String(opened); root.dataset.editing = "false"; }
    if (editor) editor.hidden = true;
    position();
  }
  async function beginEdit() {
    mount(); if (!launch || saving) return;
    if (!await close()) return;
    editing = true; draft = { ...saved, position: "custom" }; root.dataset.open = "true"; root.dataset.editing = "true";
    editor.hidden = false; feedback.textContent = "Kéo nút Menu tool tới chỗ muốn đặt, rồi bấm Lưu vị trí.";
    position();
  }
  async function savePosition() {
    if (!editing || saving) return;
    saving = true;
    const value = GSTMenuPosition.normalize(draft), before = revision;
    try { await chrome.storage.local.set({ menuPosition: value }); if (revision === before) saved = value; endEdit(); }
    catch { if (feedback) feedback.textContent = "Chưa lưu được. Thử Lưu vị trí lại hoặc bấm Hủy."; }
    finally { saving = false; }
  }
  async function requestFrameSave(target, { discardInactiveFarmDrafts = false } = {}) {
    if (!frameLoaded) {
      const loaded = await new Promise((resolve) => {
        let timer, settled = false;
        const cancel = () => finish(false);
        const onLoad = () => finish(frame === target);
        function finish(ok) {
          if (settled) return;
          settled = true;
          clearTimeout(timer); target.removeEventListener("load", onLoad);
          if (cancelPendingClose === cancel) cancelPendingClose = null;
          resolve(ok);
        }
        cancelPendingClose = cancel;
        target.addEventListener("load", onLoad);
        timer = setTimeout(cancel, 8000);
      });
      if (!loaded || frame !== target) return { saved: false, reason: "timeout" };
    }
    const id = ++closeRequest;
    return new Promise((resolve) => {
      let timer, settled = false;
      const cancel = () => finish({ saved: false, reason: "timeout" });
      const onLoad = () => cancel();
      const onMessage = (event) => {
        if (event.source !== target.contentWindow || event.origin !== extensionOrigin
            || event.data?.channel !== "gst:menu-before-close-result:v1" || event.data.id !== id) return;
        const result = event.data.saved === true ? { saved: true } : {
          saved: false,
          reason: ["invalid", "persistence", "load", "inactive-draft", "policy-changed"].includes(event.data.reason) ? event.data.reason : "timeout",
          writeFailed: event.data.writeFailed === true,
          field: ["radius", "min", "max", "potionHpPercent", "potionMpPercent",
            "harvestRadius", "harvestReach", "walkingSpeed", "flyingSpeed",
            "farmWalkingSpeed", "farmFlyingSpeed", "retreatHpPercent"].includes(event.data.field) ? event.data.field : null
        };
        finish(result);
      };
      function finish(result) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        target.removeEventListener("load", onLoad);
        window.removeEventListener("message", onMessage);
        if (cancelPendingClose === cancel) cancelPendingClose = null;
        resolve(result);
      }
      cancelPendingClose = cancel;
      target.addEventListener("load", onLoad);
      window.addEventListener("message", onMessage);
      timer = setTimeout(cancel, 8000);
      try {
        target.contentWindow.postMessage({ channel: "gst:menu-before-close:v1", id, discardInactiveFarmDrafts }, extensionOrigin);
      } catch { cancel(); }
    });
  }
  async function close(force = false) {
    if (force) { cancelPendingClose?.(); closing = false; }
    else if (closing) return false;
    const activeFrame = frame;
    if (!force && activeFrame && contextAlive()) {
      closing = true;
      let result;
      try { result = await requestFrameSave(activeFrame); }
      catch { result = { saved: false, reason: "timeout" }; }
      closing = false;
      if (frame !== activeFrame) return true;
      if (result.reason === "inactive-draft") {
        const saveMessage = result.writeFailed ? " Lần lưu bản nháp vừa rồi chưa thành công." : "";
        const discard = window.confirm(`Cài đặt Auto Farm đang không hoạt động và còn bản nháp chưa lưu.${saveMessage} Bấm OK để bỏ bản nháp này và đóng menu; bấm Hủy để tiếp tục chỉnh sửa.`);
        if (!discard) {
          if (closeNotice) { closeNotice.textContent = `Chưa đóng menu: bản nháp Auto Farm vẫn được giữ.${saveMessage} Hãy tiếp tục chỉnh sửa hoặc lưu ở chế độ Tool hỗ trợ.`; closeNotice.hidden = false; }
          return false;
        }
        closing = true;
        try { result = await requestFrameSave(activeFrame, { discardInactiveFarmDrafts: true }); }
        catch { result = { saved: false, reason: "timeout" }; }
        closing = false;
        if (frame !== activeFrame) return true;
      }
      if (result.reason === "policy-changed") {
        if (closeNotice) { closeNotice.textContent = "Chế độ Auto Farm vừa đổi; hãy xem lại bản nháp trước khi đóng menu."; closeNotice.hidden = false; }
        return false;
      }
      if (!result.saved) {
        const notice = result.reason === "invalid"
          ? ({
            radius: "Giới hạn vùng farm",
            retreatHpPercent: "Cặp ngưỡng rút lui/quay lại HP",
            min: "Tu vi tối thiểu",
            max: "Tu vi tối đa / khoảng tu vi",
            potionHpPercent: "Ngưỡng HP dùng đan",
            potionMpPercent: "Ngưỡng MP dùng đan",
            harvestRadius: "Bán kính thu hoạch",
            harvestReach: "Khoảng cách dừng thu hoạch",
            walkingSpeed: "Tốc độ đi bộ",
            flyingSpeed: "Tốc độ bay",
            farmWalkingSpeed: "Tốc độ đi bộ khi farm",
            farmFlyingSpeed: "Tốc độ bay khi farm"
          }[result.field] || "Ô nhập")
          : null;
        const message = notice ? `Chưa đóng menu: ${notice} chưa hợp lệ. Hãy sửa giá trị.`
          : result.reason === "persistence" ? "Chưa đóng menu: lưu cài đặt thất bại. Hãy thử lưu lại."
          : result.reason === "load" ? "Chưa đóng menu: chưa tải được cài đặt. Hãy thử mở lại menu."
          : "Chưa đóng menu: không nhận được phản hồi từ menu nhúng. Hãy thử lại.";
        if (closeNotice) { closeNotice.textContent = message; closeNotice.hidden = false; }
        return false;
      }
    }
    opened = false;
    if (root) root.dataset.open = "false";
    if (panel) panel.hidden = true;
    if (closeNotice) { closeNotice.textContent = ""; closeNotice.hidden = true; }
    // Remove the iframe so its popup refresh interval stops while closed.
    frame?.remove(); frame = null; frameLoaded = false;
    return true;
  }
  function open() {
    if (!contextAlive()) {
      void close(true);
      if (launch) { launch.textContent = "Tải lại trang để cập nhật tool"; launch.disabled = true; }
      return;
    }
    mount(); if (!panel || opened || editing) return;
    opened = true; root.dataset.open = "true"; panel.hidden = false;
    frame = document.createElement("iframe"); frameLoaded = false; frame.title = "Menu Game Speed Tester";
    const currentFrame = frame;
    frame.addEventListener("load", () => { if (frame === currentFrame) frameLoaded = true; });
    frame.src = popupUrl;
    frame.style.cssText = "border:0;width:100%;flex:1;min-height:0;background:#11191f";
    panel.querySelector("section").append(frame); frame.focus();
  }
  function matchesShortcut(event) {
    return event.code === menuShortcut.code && event.ctrlKey === menuShortcut.ctrl
      && event.altKey === menuShortcut.alt && event.shiftKey === menuShortcut.shift
      && event.metaKey === menuShortcut.meta;
  }
  window.addEventListener("keydown", (event) => {
    if (event.repeat || editing || opened || !matchesShortcut(event)) return;
    if (event.target?.matches?.("input, textarea, select, [contenteditable='true']")) return;
    event.preventDefault(); event.stopImmediatePropagation(); open();
  }, true);
  function mount() {
    if (root || !document.body) return;
    root = document.createElement("div"); root.id = "gst-game-menu"; root.dataset.orientation = menuOrientation; root.dataset.open = "false";
    const shadow = root.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `:host{all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important}
      button{font:18px sans-serif;background:#183a30;color:#e6edf3;border:1px solid #69dfb7;border-radius:8px;padding:9px;cursor:pointer;pointer-events:auto}
      #launch{position:absolute;left:50%;top:12px;max-width:calc(100vw - 16px);overflow-wrap:anywhere}
      :host([data-editing="true"]){pointer-events:auto!important}
      :host([data-editing="true"]) #launch{cursor:move;touch-action:none;outline:2px dashed #fff;outline-offset:3px}
      #editor{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:min(440px,calc(100vw - 24px));padding:12px;background:#11191f;border:1px solid #69dfb7;border-radius:8px;pointer-events:auto;color:#e6edf3;font:13px sans-serif}
      #editor[hidden]{display:none}#editor p{margin:0 0 10px}
      #panel{position:absolute;inset:0;background:#0008;pointer-events:auto;display:flex;align-items:center;justify-content:center}
      #panel[hidden]{display:none}section{display:flex;flex-direction:column;width:min(760px,calc(100vw - 24px));height:min(960px,calc(100vh - 24px));background:#11191f;border:1px solid #69dfb7;border-radius:12px;overflow:hidden}
      :host([data-orientation="horizontal"]) section{width:min(1120px,calc(100vw - 24px));height:min(720px,calc(100vh - 24px))}
      header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;color:#e6edf3;font:18px sans-serif}`;
    launch = document.createElement("button"); launch.id = "launch"; launch.textContent = "Menu tool"; launch.title = "Mở menu điều khiển extension";
    launch.addEventListener("click", () => { if (!editing) open(); });
    launch.addEventListener("pointerdown", (event) => {
      if (!editing || saving || event.button !== 0) return;
      event.preventDefault(); const rect = launch.getBoundingClientRect();
      dragging = { id: event.pointerId, x: event.clientX - rect.left, y: event.clientY - rect.top };
      launch.setPointerCapture(event.pointerId);
    });
    launch.addEventListener("pointermove", (event) => {
      if (!dragging || dragging.id !== event.pointerId || !editing || saving) return;
      const box = bounds();
      draft.x = box.width ? Math.max(0, Math.min(1, (event.clientX - dragging.x - box.margin) / box.width)) : 0;
      draft.y = box.height ? Math.max(0, Math.min(1, (event.clientY - dragging.y - box.margin) / box.height)) : 0;
      position();
    });
    const stopDrag = () => {
      if (dragging && launch.hasPointerCapture(dragging.id)) launch.releasePointerCapture(dragging.id);
      dragging = null;
    };
    launch.addEventListener("pointerup", stopDrag); launch.addEventListener("pointercancel", stopDrag);
    editor = document.createElement("div"); editor.id = "editor"; editor.hidden = true;
    feedback = document.createElement("p"); feedback.setAttribute("role", "status");
    const save = document.createElement("button"), cancel = document.createElement("button");
    save.textContent = "Lưu vị trí"; cancel.textContent = "Hủy";
    save.addEventListener("click", savePosition); cancel.addEventListener("click", () => { if (!saving) endEdit(); });
    editor.append(feedback, save, cancel);
    panel = document.createElement("div"); panel.id = "panel"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Menu điều khiển extension");
    const section = document.createElement("section"), header = document.createElement("header"), title = document.createElement("span");
    title.textContent = "Menu điều khiển";
    const dismiss = document.createElement("button"); dismiss.textContent = "×"; dismiss.setAttribute("aria-label", "Đóng menu"); dismiss.addEventListener("click", () => { void close(); });
    closeNotice = document.createElement("p"); closeNotice.hidden = true; closeNotice.setAttribute("role", "status");
    closeNotice.style.cssText = "margin:6px 0;color:#ffb4a8;font:12px sans-serif";
    header.append(title, dismiss); section.append(header, closeNotice); panel.append(section); shadow.append(style, launch, panel, editor); document.body.append(root);
    position(); observer = new ResizeObserver(position); observer.observe(launch);
    for (const name of ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "wheel"]) root.addEventListener(name, (event) => event.stopPropagation());
  }
  window.addEventListener("keydown", (event) => {
    if (!opened && !editing) return;
    event.stopImmediatePropagation();
    if (event.key === "Escape") { event.preventDefault(); if (editing) { if (!saving) endEdit(); } else void close(); }
  }, true);
  window.addEventListener("message", (event) => {
    if (frame && event.source === frame.contentWindow && event.origin === extensionOrigin
        && ["gst:menu-close:v1", "gst:menu-edit:v1"].includes(event.data?.channel)) {
      if (event.data.channel === "gst:menu-edit:v1") void beginEdit(); else void close();
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id === chrome.runtime.id && message?.type === "gst:menu-position-edit") {
      beginEdit().then(() => respond({ editing })); return true;
    }
    if (sender.id === chrome.runtime.id && message?.type === "gst:open-menu") { open(); respond({ opened }); }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.menuPosition) return;
    revision++; saved = GSTMenuPosition.normalize(changes.menuPosition.newValue);
    if (editing) endEdit(); else position();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.menuShortcut) return;
    shortcutRevision++; menuShortcut = normalizeShortcut(changes.menuShortcut.newValue);
  });
  function normalizeShortcut(value) {
    const code = typeof value?.code === "string" && /^[A-Za-z][A-Za-z0-9]*$/.test(value.code) ? value.code : "Tab";
    return { code, ctrl: value?.ctrl === true, alt: value?.alt === true,
      shift: value?.shift === true, meta: value?.meta === true };
  }
  const initialShortcutRevision = shortcutRevision;
  chrome.storage.local.get("menuShortcut").then((value) => {
    if (shortcutRevision === initialShortcutRevision) menuShortcut = normalizeShortcut(value.menuShortcut);
  }).catch(() => {});
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.menuOrientation) { orientationRevision++; setOrientation(changes.menuOrientation.newValue); }
  });
  const initialOrientationRevision = orientationRevision;
  chrome.storage.local.get("menuOrientation").then((value) => {
    if (orientationRevision === initialOrientationRevision) setOrientation(value.menuOrientation);
  }).catch(() => {});
  const initialRevision = revision;
  chrome.storage.local.get("menuPosition").then((value) => {
    if (revision !== initialRevision) return;
    saved = GSTMenuPosition.normalize(value.menuPosition); position();
  }).catch(() => {});
  window.addEventListener("resize", position);
  document.addEventListener("DOMContentLoaded", mount, { once: true }); mount();
  window.addEventListener("pagehide", () => { void close(true); endEdit(); observer?.disconnect(); observer = null; root?.remove(); root = null; panel = null; launch = null; editor = null; feedback = null; closeNotice = null; });
  window.addEventListener("pageshow", mount);
})();
