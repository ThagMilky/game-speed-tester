(() => {
  "use strict";
  const notes = [], anchors = new Map();
  let sequence = 0;
  function closeAll(except = null) {
    for (const note of notes) if (note !== except) { note.pinned = false; note.tip.hidden = true; note.button.setAttribute("aria-expanded", "false"); }
    for (const help of document.querySelectorAll(".field-help[data-open]")) { delete help.dataset.open; help.setAttribute("aria-expanded", "false"); }
  }
  function place(note) {
    const rect = note.button.getBoundingClientRect(), width = Math.min(360, innerWidth - 24);
    note.tip.style.width = `${width}px`; note.tip.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - width - 12))}px`;
    note.tip.style.top = `${Math.max(8, Math.min(rect.bottom + 6, innerHeight - note.tip.offsetHeight - 8))}px`;
  }
  for (const hint of document.querySelectorAll(".card p.hint, footer p.hint")) {
    if (hint.id || hint.hasAttribute("role") || !hint.textContent.trim()) continue;
    let anchor = hint.dataset.helpFor ? document.querySelector(hint.dataset.helpFor) : hint.previousElementSibling;
    if (!anchor) continue;
    if (anchor.matches("input, select") && anchor.id) anchor = document.querySelector(`label[for="${anchor.id}"]`) ?? anchor;
    if (anchor.matches("div:not(.compact-help-row)")) anchor = [...anchor.querySelectorAll("label")].at(-1) ?? anchor;
    let note = anchors.get(anchor);
    if (!note) {
      const row = document.createElement("div"); row.className = "compact-help-row";
      const wrap = document.createElement("span"); wrap.className = "compact-help";
      const button = document.createElement("button"); button.type = "button"; button.className = "compact-help-button"; button.textContent = "?";
      button.setAttribute("aria-label", `Giải thích: ${anchor.textContent.trim().slice(0, 70)}`); button.setAttribute("aria-expanded", "false");
      const tip = document.createElement("span"); tip.className = "compact-tooltip"; tip.id = `compactHelp${++sequence}`; tip.role = "tooltip"; tip.hidden = true;
      button.setAttribute("aria-describedby", tip.id);
      anchor.before(row); row.append(anchor, wrap); wrap.append(button, tip);
      note = { button, tip, wrap, pinned: false }; notes.push(note); anchors.set(anchor, note); anchors.set(row, note);
      const current = note;
      const show = () => { closeAll(current); tip.hidden = false; button.setAttribute("aria-expanded", "true"); place(current); };
      wrap.addEventListener("mouseenter", show);
      wrap.addEventListener("mouseleave", () => { if (!current.pinned && !wrap.contains(document.activeElement)) { tip.hidden = true; button.setAttribute("aria-expanded", "false"); } });
      button.addEventListener("focus", show);
      wrap.addEventListener("focusout", () => queueMicrotask(() => { if (!current.pinned && !wrap.contains(document.activeElement)) { tip.hidden = true; button.setAttribute("aria-expanded", "false"); } }));
      button.addEventListener("click", () => { current.pinned = !current.pinned; if (current.pinned) show(); else { tip.hidden = true; button.setAttribute("aria-expanded", "false"); } });
    }
    const paragraph = document.createElement("span"); paragraph.className = "compact-help-paragraph"; paragraph.textContent = hint.textContent;
    note.tip.append(paragraph); hint.remove();
  }
  // Distance help uses the same viewport positioning as the other help buttons.
  for (const help of document.querySelectorAll(".field-help")) {
    const tip = help.querySelector(".help-tooltip");
    const position = () => { if (tip) place({ button: help, tip }); };
    help.addEventListener("mouseenter", position);
    help.addEventListener("focus", position);
    help.setAttribute("role", "button"); help.setAttribute("aria-expanded", "false");
    const toggle = (event) => {
      if (event.target.closest(".help-tooltip")) return;
      event.preventDefault(); event.stopPropagation();
      const open = help.dataset.open !== "true"; closeAll();
      if (open) { help.dataset.open = "true"; help.setAttribute("aria-expanded", "true"); position(); }
    };
    help.addEventListener("click", toggle);
    help.addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) toggle(event); });
  }
  document.addEventListener("click", (event) => { if (!event.target.closest(".compact-help, .field-help")) closeAll(); });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (notes.some((note) => !note.tip.hidden) || document.querySelector('.field-help[data-open="true"]'))) {
      closeAll(); event.preventDefault(); event.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener("toggle", () => closeAll(), true);
  for (const tab of document.querySelectorAll("[data-category-tab]")) tab.addEventListener("click", () => closeAll());
  window.addEventListener("resize", () => closeAll());
  document.addEventListener("scroll", (event) => { if (!event.target.closest?.(".compact-tooltip, .help-tooltip")) closeAll(); }, true);
})();
