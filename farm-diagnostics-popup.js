(() => {
  "use strict";
  const button = document.getElementById("copyFarmDiagnostics");
  const output = document.getElementById("farmDiagnosticsOutput"), feedback = document.getElementById("farmDiagnosticsFeedback");
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No tab");
      const data = await chrome.tabs.sendMessage(tab.id, { type: "gst:farm-diagnostics" });
      if (data?.build !== "farm-stop-1" || !data.tracking) throw new Error("No tracker");
      output.value = JSON.stringify(data, null, 2); output.hidden = false;
      if (await GSTClipboard.write(output.value)) {
        feedback.textContent = "Đã sao chép. Dán vào chat để kiểm tra khựng di chuyển, chạy nền và hồi sinh.";
      } else {
        output.focus(); output.select(); feedback.textContent = "Đã chọn chẩn đoán; bấm Ctrl+C rồi dán vào chat.";
      }
    } catch { feedback.textContent = "Chưa đọc được chẩn đoán. Mở tab game, tải lại extension và game nếu vừa cập nhật."; }
    finally { button.disabled = false; }
  });
})();
