// Kiểm tra auto-click / macro (2026-10-26). Independent of the game bundle: watches the game socket for a {e:'guard'} event
// and shows a confirm popup with a countdown; the answer is sent as {t:'action',action:'guard-ok',arg:id}.
(function () {
  var Native = window.WebSocket; if (!Native) return;
  var sock = null, box = null, timer = 0;
  // The game may move to a WebRTC DataChannel (2026-10-26): the bundle then feeds messages in via __tmGuard.feed and
  // sends through window.__tmSend; the WebSocket wrapper below still covers the Cloudflare path.
  function out(m) { try { if (window.__tmSend) window.__tmSend(m); else if (sock && sock.readyState === 1) sock.send(JSON.stringify(m)); } catch (e) {} }
  function show(ev) {
    if (box) box.remove(); clearInterval(timer);
    var left = Math.max(1, ev.seconds | 0);
    box = document.createElement('div');
    box.setAttribute('role', 'alertdialog');
    box.style.cssText = 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);font-family:inherit';
    var card = document.createElement('div');
    card.style.cssText = 'max-width:360px;margin:16px;padding:18px 20px;background:#1d1414;border:2px solid #e8c46a;color:#f3e6c8;text-align:center;box-shadow:0 0 24px #000';
    var title = document.createElement('div'); title.textContent = 'Kiểm tra người chơi'; title.style.cssText = 'font-size:20px;color:#e8c46a;margin-bottom:8px';
    var text = document.createElement('div'); text.style.cssText = 'font-size:14px;line-height:1.4;margin-bottom:12px';
    text.textContent = 'Hệ thống phát hiện thao tác nghi dùng auto-click / macro (' + (ev.reason || '') + '). Bấm xác nhận để tiếp tục chơi.';
    var count = document.createElement('div'); count.style.cssText = 'font-size:13px;color:#ff9b60;margin-bottom:12px';
    var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Tôi đang chơi';
    btn.style.cssText = 'min-height:44px;padding:0 22px;font-size:16px;background:#e8c46a;color:#1d1414;border:0;cursor:pointer';
    btn.onclick = function () { out({ t: 'action', action: 'guard-ok', arg: String(ev.id) }); close(); };
    card.append(title, text, count, btn); box.appendChild(card); document.body.appendChild(box);
    var paint = function () { count.textContent = 'Không xác nhận sau ' + left + ' giây: bị đưa về thôn tân thủ và cảnh báo trên kênh chat.'; if (--left < 0) close(); };
    paint(); timer = setInterval(paint, 1000);
  }
  function close() { clearInterval(timer); if (box) { box.remove(); box = null; } }
  // Nút Độ kiếp gọn trên điện thoại (owner 2026-10-26): shown only on mobile while the server says độ kiếp is available.
  var trib = null;
  function tribButton(on) {
    if (!document.body || !document.body.classList.contains('mobile')) on = false;
    if (window.innerHeight > window.innerWidth) on = false;   // portrait shows the 'xoay ngang' screen
    if (!on) { if (trib) trib.style.display = 'none'; return; }
    if (!trib) {
      trib = document.createElement('button'); trib.type = 'button'; trib.setAttribute('aria-label', 'Độ kiếp');
      trib.innerHTML = '<span style="display:block;font-size:20px;line-height:20px">⚡</span><span style="display:block;font-size:10px;line-height:12px">Độ kiếp</span>';
      trib.style.cssText = 'position:fixed;right:calc(36px + env(safe-area-inset-right));bottom:calc(118px + env(safe-area-inset-bottom));z-index:60;width:52px;height:52px;border-radius:50%;border:2px solid #e8c46a;background:radial-gradient(circle at 50% 40%,#5a3a8a,#1d1430);color:#ffe9a8;box-shadow:0 0 10px #b07cff;padding:0;touch-action:manipulation;-webkit-user-select:none;user-select:none';
      var send = function (e) { e.preventDefault(); e.stopPropagation(); out({ t: 'action', action: 'tribulation' }); };
      trib.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
      trib.addEventListener('click', send);
      document.body.appendChild(trib);
    }
    trib.style.display = 'block';
  }
  function Wrapped(url, protocols) {
    var ws = protocols === undefined ? new Native(url) : new Native(url, protocols);
    sock = ws;
    ws.addEventListener('message', function (e) { feed(e.data); });
    return ws;
  }
  function feed(data) {
    if (typeof data !== 'string') return;
    if (data.charCodeAt(6) === 115 && data.indexOf('"t":"snap"') === 1) tribButton(data.indexOf('"tg":1') > 0);
    // Compact snapshots carry only changed self fields, so keep the last gate state.
    if (data.indexOf('"t":"snap2"') === 1 && data.indexOf('"tg"') > 0) {
      try { var gate = JSON.parse(data).self; for (var g = 0; g < gate.length; g++) if (gate[g][0] === 'tg') tribButton(gate[g][1] === 1); } catch (err) {}
    }
    if (data.indexOf('"guard"') < 0) return;
    try { var m = JSON.parse(data); var list = m && m.ev; if (list) for (var i = 0; i < list.length; i++) if (list[i] && list[i].e === 'guard') show(list[i]); } catch (err) {}
  }
  window.__tmGuard = { feed: feed };
  Wrapped.prototype = Native.prototype;
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (k) { Wrapped[k] = Native[k]; });
  window.WebSocket = Wrapped;
})();
