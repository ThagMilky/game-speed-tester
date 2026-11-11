(() => {
  "use strict";
  const controls = document.getElementById("questControls"), list = document.getElementById("questList");
  const search = document.getElementById("questSearch"), sort = document.getElementById("questSort");
  const status = document.getElementById("questStatus"), count = document.getElementById("questCount");
  let selected = [], quests = [], busy = false, ready = false, saving = Promise.resolve(), signature = "", commandBusy = false;
  function render() {
    const query = search.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
    const rows = quests.filter((q) => [q.title, q.npc, q.map, q.goals].join(" ").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().includes(query));
    rows.sort((a, b) => sort.value === "name" ? a.title.localeCompare(b.title, "vi")
      : (b[sort.value] ?? -1) - (a[sort.value] ?? -1) || a.title.localeCompare(b.title, "vi"));
    count.textContent = `Đã chọn ${selected.length} · Hiển thị ${rows.length}/${quests.length}`;
    const next = JSON.stringify([rows, selected]); if (next === signature) return;
    signature = next;
    const focused = list.contains(document.activeElement) ? document.activeElement.dataset.quest : null;
    list.replaceChildren();
    for (const q of rows) {
      const label = document.createElement("label"); label.className = "check-row";
      const input = document.createElement("input"); input.type = "checkbox"; input.dataset.quest = q.id; input.checked = selected.includes(q.id);
      const info = document.createElement("span"), title = document.createElement("strong"); title.textContent = q.title;
      info.append(title);
      for (const value of [q.accepted ? "Đang nhận" : "Offer đủ điều kiện · lặp được", `NPC: ${q.npc} · Map: ${q.map || "?"} · Mục tiêu: ${q.goals || "?"}`, q.reward, q.progress, q.support]) { const small = document.createElement("small"); small.textContent = value; info.append(small); }
      label.append(input, info); list.append(label);
      if (focused === q.id) input.focus({ preventScroll: true });
    }
    if (!rows.length) list.textContent = "Chưa có quest đã nhận hoặc offer lặp đủ điều kiện phù hợp.";
  }
  function showLogs(result) {
    document.getElementById("questCycles").textContent = String(result.cycles ?? 0);
    document.getElementById("questLog").value = Array.isArray(result.logs) ? result.logs.map((row) =>
      `${row.at} | #${row.cycle} ${row.action || row.kind} | ${row.questId} ${row.title} | ${row.phase} | ${row.map} ${row.npc} | ${row.progress} ${row.detail}`.trim()).join("\n") : "";
  }
  function save() {
    const value = [...selected];
    saving = saving.catch(() => {}).then(() => chrome.storage.local.set({ questPreferences: { selected: value } }));
    saving.catch(() => { status.textContent = "Chưa lưu được lựa chọn; hãy thử lại."; });
    render(); return saving;
  }
  async function send(command) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("Mở tab game để dùng Auto Quest.");
    try { return await chrome.tabs.sendMessage(tab.id, { type: "gst:quest", command, selected }); }
    catch { throw new Error("Không kết nối được Auto Quest; mở tab game rồi tải lại nếu cần."); }
  }
  list.addEventListener("change", (event) => {
    const id = event.target.dataset.quest; if (!id) return;
    selected = event.target.checked ? [...new Set([...selected, id])] : selected.filter((item) => item !== id);
    save();
  });
  search.addEventListener("input", render); sort.addEventListener("change", render);
  document.getElementById("questClear").addEventListener("click", () => { selected = []; save(); });
  document.getElementById("questLogCopy").addEventListener("click", async () => {
    const output = document.getElementById("questLog");
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(output.value);
      else { output.select(); if (!document.execCommand("copy")) throw new Error("copy failed"); }
      status.textContent = "Đã sao chép log đang hiển thị.";
    } catch { status.textContent = "Không sao chép được log; hãy chọn và sao chép nội dung thủ công."; }
  });
  document.getElementById("questLogClear").addEventListener("click", async () => {
    try { const result = await send("clear-log"); showLogs(result); status.textContent = "Đã xóa log của tab game hiện tại."; }
    catch { status.textContent = "Không kết nối được tab game để xóa log."; }
  });
  for (const command of ["start", "stop"]) document.getElementById(`quest${command === "start" ? "Start" : "Stop"}`).addEventListener("click", async () => {
    if (commandBusy) return; commandBusy = true; controls.disabled = true;
    try { if (command === "start") await saving; const result = await send(command); status.dataset.running = String(result.running === true); status.textContent = result.message; quests = result.quests ?? quests; showLogs(result); render(); }
    catch (error) { status.dataset.running = "false"; status.textContent = error.message || "Chưa kết nối được Auto Quest."; }
    finally { commandBusy = false; controls.disabled = !ready; }
  });
  chrome.storage.local.get("questPreferences").then((value) => {
    selected = Array.isArray(value.questPreferences?.selected) ? value.questPreferences.selected.filter((id) => typeof id === "string").slice(0, 200) : [];
    ready = true; controls.disabled = false; render();
  }).catch(() => { ready = true; controls.disabled = false; status.textContent = "Chưa đọc được lựa chọn đã lưu; vẫn có thể bấm Dừng Auto Quest."; });
  globalThis.GSTQuestPopup = { async refresh() {
    if (!ready || busy || commandBusy) return; busy = true;
    try { const result = await send("status"); status.dataset.running = String(result.running === true); status.textContent = result.message; quests = result.quests ?? []; showLogs(result); render(); }
    catch { status.dataset.running = "false"; status.textContent = "Mở tab game và tải lại extension/trang để đọc quest."; }
    finally { busy = false; }
  } };
})();
