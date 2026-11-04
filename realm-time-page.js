(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let timer = null, display = false, notices = false, stamp = 0, serverNow = null, toast = null, toastUntil = 0;
  let suspended = false;
  let sent = new Set();
  try { sent = new Set(JSON.parse(sessionStorage.getItem("gst:realm-notices:v1") ?? "[]")); } catch {}
  const format = (seconds) => {
    const n = Math.max(0, Math.ceil(seconds));
    return n >= 3600 ? `${Math.floor(n / 3600)} giờ ${Math.floor(n % 3600 / 60)} phút`
      : n >= 60 ? `${Math.floor(n / 60)} phút ${n % 60} giây` : `${n} giây`;
  };
  function notify(key, text) {
    if (!notices || document.hidden || sent.has(key)) return;
    sent.add(key); sent = new Set([...sent].slice(-60));
    try { sessionStorage.setItem("gst:realm-notices:v1", JSON.stringify([...sent])); } catch {}
    toast?.remove(); toast = document.createElement("div"); toast.textContent = text;
    toast.style.cssText = "position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:2147483647;background:#182b35;color:#fff;padding:12px;border:1px solid #69dfb7;border-radius:8px;pointer-events:none;font:14px sans-serif";
    document.body?.append(toast); toastUntil = performance.now() + 8000;
  }
  function tick() {
    if (toast && performance.now() > toastUntil) { toast.remove(); toast = null; }
    let text = "Bí cảnh: chưa cập nhật dữ liệu.";
    try {
      const scene = window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
      const realm = scene?.self?.realm;
      if (Number.isFinite(realm?.now) && realm.now !== serverNow) { serverNow = realm.now; stamp = performance.now(); }
      const driver = scene?.driver;
      const online = driver && !driver.closing && !driver.reconnecting && !driver.displaced
        && (driver.online === false || driver.link?.open?.() === true);
      if (realm && online && serverNow !== null && performance.now() - stamp <= 10000) {
        const now = serverNow + (performance.now() - stamp) / 1000;
        const open = (realm.events ?? []).filter((event) => !event.closing && event.ends > now);
        if (realm.inside && Number.isFinite(realm.inside.ends)) {
          const left = realm.inside.ends - now;
          text = left > 0 ? `Bí cảnh: còn ${format(left)} để rút lui.` : "Bí cảnh: đang chờ game xác nhận kết thúc.";
          if (left > 0 && left <= 120) notify(`exit:${realm.inside.ends}`, "Bí cảnh còn dưới 2 phút: chuẩn bị rút lui!");
        } else if (open.length) {
          text = `Bí cảnh: có cổng đang mở · còn ${format(Math.min(...open.map((event) => event.ends)) - now)} (kiểm tra bậc cấp).`;
          notify(`open:${open.map((event) => event.id).sort().join(":")}`, "Game đang có cổng bí cảnh mở; kiểm tra bậc cấp trước khi vào.");
        } else if (Number.isFinite(realm.next)) {
          const left = realm.next - now;
          text = left > 0 ? `Bí cảnh: đợt tiếp sau ${format(left)}.` : "Bí cảnh: chờ game xác nhận đợt mới.";
          if (left > 0 && left <= 300) notify(`next:${realm.next}`, "Bí cảnh còn dưới 5 phút đến đợt tiếp theo.");
        }
        if (realm.retryAt > now && !realm.inside) text += ` Tái nhập sau ${format(realm.retryAt - now)}.`;
      }
    } catch { /* Missing or changed game state is not a schedule. */ }
    window.postMessage({ channel: "gst:realm-time-status:v1", message: text }, origin);
  }
  function monitor() {
    if (timer !== null) clearInterval(timer); timer = null;
    if (!suspended && (display || notices)) { tick(); timer = setInterval(tick, 1000); }
    else { toast?.remove(); toast = null; }
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:realm-time:v1") return;
    display = event.data.display === true; notices = event.data.notices === true; monitor();
  });
  window.addEventListener("pagehide", () => { suspended = true; monitor(); });
  window.addEventListener("pageshow", () => { suspended = false; monitor(); });
  window.postMessage({ channel: "gst:realm-time-ready:v1" }, origin);
})();
