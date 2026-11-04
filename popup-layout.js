"use strict";

// Popup-only layout: never send these preferences to the game.
(() => {
  const container = document.getElementById("featurePanels");
  const feedback = document.getElementById("layoutFeedback");
  const panels = new Map([...container.children].map((panel) => [panel.dataset.panel, panel]));
  let dragged = null;
  let dropPanel = null;
  let dropAfter = false;
  let saveQueue = Promise.resolve();

  function clearDrop() {
    dropPanel?.classList.remove("drop-before", "drop-after");
    dropPanel = null;
  }

  function saveOrder() {
    const popupPanelOrder = [...container.children].map((panel) => panel.dataset.panel);
    saveQueue = saveQueue.then(() => chrome.storage.local.set({ popupPanelOrder })).then(() => {
      feedback.textContent = "Đã lưu thứ tự. Kéo ⠿ để sắp xếp lại.";
    }).catch(() => {
      feedback.textContent = "Chưa lưu được thứ tự. Hãy thử di chuyển nhóm lần nữa.";
    });
  }

  for (const panel of panels.values()) {
    const summary = panel.querySelector(":scope > summary");
    const name = summary.querySelector("strong").textContent;
    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "panel-handle";
    handle.textContent = "⠿";
    handle.draggable = true;
    handle.disabled = true;
    handle.title = `Kéo để di chuyển ${name}; hoặc Alt + mũi tên lên/xuống`;
    handle.setAttribute("aria-label", handle.title);
    summary.prepend(handle);
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    handle.addEventListener("keydown", (event) => {
      if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      const sibling = event.key === "ArrowUp" ? panel.previousElementSibling : panel.nextElementSibling;
      if (!sibling) return;
      container.insertBefore(panel, event.key === "ArrowUp" ? sibling : sibling.nextElementSibling);
      handle.focus();
      saveOrder();
    });
    handle.addEventListener("dragstart", (event) => {
      dragged = panel;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", panel.dataset.panel);
      panel.classList.add("dragging");
    });
    handle.addEventListener("dragend", () => {
      panel.classList.remove("dragging");
      dragged = null;
      clearDrop();
    });
  }

  container.addEventListener("dragover", (event) => {
    if (!dragged) return;
    const target = event.target.closest(".card[data-panel]");
    clearDrop();
    if (!target || target === dragged || target.parentElement !== container) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const rect = target.getBoundingClientRect();
    dropPanel = target;
    dropAfter = event.clientY > rect.top + rect.height / 2;
    target.classList.add(dropAfter ? "drop-after" : "drop-before");
  });
  container.addEventListener("dragleave", (event) => {
    if (!container.contains(event.relatedTarget)) clearDrop();
  });
  container.addEventListener("drop", (event) => {
    if (!dragged || !dropPanel) return;
    event.preventDefault();
    container.insertBefore(dragged, dropAfter ? dropPanel.nextElementSibling : dropPanel);
    clearDrop();
    saveOrder();
  });

  chrome.storage.local.get("popupPanelOrder").then(({ popupPanelOrder }) => {
    // Ignore unknown/duplicate IDs; append any newly introduced panels normally.
    const order = Array.isArray(popupPanelOrder) ? popupPanelOrder : [];
    for (const id of new Set([...order, ...panels.keys()])) {
      if (panels.has(id)) container.append(panels.get(id));
    }
  }).catch(() => {
    feedback.textContent = "Chưa đọc được thứ tự đã lưu. Bạn vẫn có thể sắp xếp lại.";
  }).finally(() => {
    for (const handle of container.querySelectorAll(".panel-handle")) handle.disabled = false;
  });
})();
