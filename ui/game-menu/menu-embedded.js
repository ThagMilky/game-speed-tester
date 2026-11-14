(() => {
  "use strict";
  if (new URLSearchParams(location.search).get("embedded") !== "1") return;
  document.documentElement.dataset.embedded = "true";
  const origin = "https://nghichthienky.online";
  let shortcut = { code: "Tab", ctrl: false, alt: false, shift: false, meta: false }, shortcutRevision = 0;
  const setShortcut = (value) => {
    shortcut = { code: typeof value?.code === "string" ? value.code : "Tab",
      ctrl: value?.ctrl === true, alt: value?.alt === true, shift: value?.shift === true, meta: value?.meta === true };
  };
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.menuShortcut) { shortcutRevision++; setShortcut(changes.menuShortcut.newValue); }
  });
  const initialRevision = shortcutRevision;
  chrome.storage.local.get("menuShortcut").then((saved) => {
    if (shortcutRevision === initialRevision) setShortcut(saved.menuShortcut);
  }).catch(() => {});
  const report = (type, detail = {}) => {
    console.info("[GST Menu tool popup]", type, detail);
    parent.postMessage({ channel: "gst:menu-frame:v1", type, ...detail }, origin);
  };
  // Do not export exception messages, URLs, form contents or rejection values.
  window.addEventListener("error", (event) => {
    const resource = event.target;
    report("error", { kind: resource instanceof HTMLScriptElement ? "script-resource"
      : resource instanceof HTMLLinkElement ? "style-resource" : "javascript",
      line: Number.isInteger(event.lineno) ? event.lineno : 0 });
  }, true);
  window.addEventListener("unhandledrejection", () => report("error", { kind: "promise" }));
  // Later popup handlers can consume Escape for shortcut recording. If they
  // failed to initialize, retain an escape route from the focused iframe.
  window.addEventListener("keydown", (event) => {
    const escape = event.key === "Escape";
    const matches = !event.repeat && event.code === shortcut.code && event.ctrlKey === shortcut.ctrl
      && event.altKey === shortcut.alt && event.shiftKey === shortcut.shift && event.metaKey === shortcut.meta;
    if (!escape && (!matches || event.target?.closest?.("input,textarea,select,[contenteditable='true']"))) return;
    queueMicrotask(() => {
      if (!event.defaultPrevented) parent.postMessage({ channel: "gst:menu-close:v1" }, origin);
    });
  }, true);
  document.addEventListener("DOMContentLoaded", () => report("dom-ready"), { once: true });
  window.addEventListener("load", () => report("loaded"), { once: true });
  report("boot");
})();
