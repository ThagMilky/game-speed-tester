(() => {
  "use strict";
  for (const kind of ["chest", "portal"]) {
    const button = document.getElementById(`copy${kind}History`), output = document.getElementById(`history${kind}Output`), feedback = document.getElementById(`history${kind}Feedback`);
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const data = await chrome.tabs.sendMessage(tab.id, { type: "gst:realm-history", kind });
        if (data?.build !== "realm-history-1") throw new Error("Unavailable");
        output.value = JSON.stringify(data);
        if (await GSTClipboard.write(output.value)) feedback.textContent = "Đã sao chép. Dán log vào chat để kiểm tra.";
        else { output.hidden = false; output.focus(); output.select(); feedback.textContent = "Bấm Ctrl+C để sao chép log đã chọn."; }
      } catch { feedback.textContent = "Chưa đọc được log. Reload extension và game nếu vừa cập nhật."; }
      finally { button.disabled = false; }
    });
  }
})();
