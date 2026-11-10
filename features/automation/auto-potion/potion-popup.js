(() => {
  "use strict";
  const controls = document.getElementById("potionControls");
  const hpEnabled = document.getElementById("potionHpEnabled"), mpEnabled = document.getElementById("potionMpEnabled");
  const hpPercent = document.getElementById("potionHpPercent"), mpPercent = document.getElementById("potionMpPercent");
  const feedback = document.getElementById("potionFeedback"), save = document.getElementById("savePotionPreferences");

  function sync() {
    hpPercent.disabled = !hpEnabled.checked;
    mpPercent.disabled = !mpEnabled.checked;
  }
  for (const input of [hpEnabled, mpEnabled]) input.addEventListener("change", sync);
  save.addEventListener("click", async () => {
    if ((hpEnabled.checked && !hpPercent.reportValidity()) || (mpEnabled.checked && !mpPercent.reportValidity())) return;
    const hp = hpPercent.valueAsNumber, mp = mpPercent.valueAsNumber;
    if (hpEnabled.checked && (!Number.isSafeInteger(hp) || hp < 1 || hp > 99)) return;
    if (mpEnabled.checked && (!Number.isSafeInteger(mp) || mp < 1 || mp > 99)) return;
    const potionPreferences = { hpEnabled: hpEnabled.checked, mpEnabled: mpEnabled.checked,
      hpPercent: Number.isSafeInteger(hp) && hp >= 1 && hp <= 99 ? hp : 40,
      mpPercent: Number.isSafeInteger(mp) && mp >= 1 && mp <= 99 ? mp : 25 };
    controls.disabled = true;
    try {
      await chrome.storage.local.set({ potionPreferences });
      feedback.textContent = potionPreferences.hpEnabled || potionPreferences.mpEnabled
        ? "Đã lưu. Đan tự dùng theo ngưỡng này cả khi Auto Farm tắt."
        : "Đã tắt tự dùng đan của tool; Auto Farm dùng lại ngưỡng gốc của game.";
    } catch {
      feedback.textContent = "Chưa lưu được cài đặt đan. Hãy thử lại.";
    } finally { controls.disabled = false; sync(); }
  });
  chrome.storage.local.get("potionPreferences").then(({ potionPreferences: value }) => {
    hpEnabled.checked = value?.hpEnabled === true; mpEnabled.checked = value?.mpEnabled === true;
    hpPercent.value = Number.isSafeInteger(value?.hpPercent) && value.hpPercent >= 1 && value.hpPercent <= 99 ? value.hpPercent : 40;
    mpPercent.value = Number.isSafeInteger(value?.mpPercent) && value.mpPercent >= 1 && value.mpPercent <= 99 ? value.mpPercent : 25;
    controls.disabled = false; sync();
  }).catch(() => { feedback.textContent = "Chưa đọc được cài đặt đan. Hãy mở lại menu."; });
})();
