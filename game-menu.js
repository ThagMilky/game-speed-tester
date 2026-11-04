(() => {
  "use strict";
  let root = null, panel = null, frame = null, opened = false;
  function close() {
    opened = false;
    if (root) root.dataset.open = "false";
    if (panel) panel.hidden = true;
    // Remove the iframe so its popup refresh interval stops while closed.
    frame?.remove(); frame = null;
  }
  function open() {
    mount(); if (!panel || opened) return;
    opened = true; root.dataset.open = "true"; panel.hidden = false;
    frame = document.createElement("iframe"); frame.title = "Menu Game Speed Tester";
    frame.src = chrome.runtime.getURL("popup.html?embedded=1");
    frame.style.cssText = "border:0;width:100%;flex:1;min-height:0;background:#11191f";
    panel.querySelector("section").append(frame); frame.focus();
  }
  function mount() {
    if (root || !document.body) return;
    root = document.createElement("div"); root.id = "gst-game-menu"; root.dataset.open = "false";
    const shadow = root.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `:host{all:initial!important;position:fixed!important;inset:0!important;z-index:2147483647!important;pointer-events:none!important}
      button{font:14px sans-serif;background:#183a30;color:#e6edf3;border:1px solid #69dfb7;border-radius:8px;padding:9px;cursor:pointer;pointer-events:auto}
      #launch{position:absolute;right:12px;bottom:12px}
      #panel{position:absolute;inset:0;background:#0008;pointer-events:auto;display:flex;align-items:center;justify-content:center}
      #panel[hidden]{display:none}section{display:flex;flex-direction:column;width:min(470px,calc(100vw - 24px));height:min(850px,calc(100vh - 32px));background:#11191f;border:1px solid #69dfb7;border-radius:12px;overflow:hidden}
      header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;color:#e6edf3;font:14px sans-serif}`;
    const launch = document.createElement("button"); launch.id = "launch"; launch.textContent = "Menu tool"; launch.title = "Mở menu điều khiển extension";
    launch.addEventListener("click", open);
    panel = document.createElement("div"); panel.id = "panel"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "true"); panel.setAttribute("aria-label", "Menu điều khiển extension");
    const section = document.createElement("section"), header = document.createElement("header"), title = document.createElement("span");
    title.textContent = "Menu điều khiển";
    const dismiss = document.createElement("button"); dismiss.textContent = "×"; dismiss.setAttribute("aria-label", "Đóng menu"); dismiss.addEventListener("click", close);
    header.append(title, dismiss); section.append(header); panel.append(section); shadow.append(style, launch, panel); document.body.append(root);
    for (const name of ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "wheel"]) shadow.addEventListener(name, (event) => event.stopPropagation());
  }
  window.addEventListener("keydown", (event) => {
    if (!opened) return;
    event.stopImmediatePropagation();
    if (event.key === "Escape") { event.preventDefault(); close(); }
  }, true);
  window.addEventListener("message", (event) => {
    if (frame && event.source === frame.contentWindow && event.origin === new URL(chrome.runtime.getURL("/")).origin
        && event.data?.channel === "gst:menu-close:v1") close();
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id === chrome.runtime.id && message?.type === "gst:open-menu") { open(); respond({ opened }); }
  });
  document.addEventListener("DOMContentLoaded", mount, { once: true }); mount();
  window.addEventListener("pagehide", () => { close(); root?.remove(); root = null; panel = null; });
  window.addEventListener("pageshow", mount);
})();
