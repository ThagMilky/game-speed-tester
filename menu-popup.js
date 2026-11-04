(() => {
  "use strict";
  const embedded = new URLSearchParams(location.search).get("embedded") === "1";
  const button = document.getElementById("openGameMenu");
  if (embedded) {
    document.body.classList.add("embedded"); button.hidden = true;
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); parent.postMessage({ channel: "gst:menu-close:v1" }, "https://nghichthienky.online"); }
    }, true);
  }
  button.addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:open-menu" });
      if (result.opened) window.close();
    } catch { document.getElementById("feedback").textContent = "Mở tab game, tải lại sau cập nhật rồi thử lại."; }
  });
})();
