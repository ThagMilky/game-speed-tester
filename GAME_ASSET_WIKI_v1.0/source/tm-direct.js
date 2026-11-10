// Đường WebSocket thẳng về VPS Hà Nội (owner 2026-11-01 "có cách nào về thẳng VN"). Independent of the game bundle (the live
// bundle is built elsewhere): wraps window.WebSocket so the game's own `new WebSocket(<same origin>/ws)` first tries
// wss://ws.nghichthienky.online/ws (DNS only → Caddy on the VPS, skipping Cloudflare's Hong Kong edge). If that socket has not
// opened within 2.5 s, or fails before opening, the same-origin Cloudflare socket is opened instead — the game only ever sees
// one socket object — and the failure is remembered for 5 minutes in this tab. WebRTC still upgrades on top as before.
(function () {
  var Native = window.WebSocket; if (!Native) return;
  var DIRECT = 'wss://ws.nghichthienky.online/ws', KEY = 'tm-dws-fail', OPEN_MS = 2500, RETRY_MS = 5 * 60 * 1000;
  function production() { return /^(www\.)?nghichthienky\.online$/.test(location.hostname); }
  function allowed() { try { var t = Number(sessionStorage.getItem(KEY) || 0); return !(t && Date.now() - t < RETRY_MS); } catch (e) { return true; } }
  function failed() { try { sessionStorage.setItem(KEY, String(Date.now())); } catch (e) { /* storage blocked */ } }
  function gameUrl(u) { try { var x = new URL(String(u), location.href); return x.pathname === '/ws' && x.host === location.host; } catch (e) { return false; } }
  function note(route) { var n = window.__tmNet; if (n && String(n.route).indexOf('WebRTC') < 0) n.route = route; window.__tmWsRoute = route; }

  function DirectSocket(url) {
    var self = this, target = new EventTarget(), inner = null, done = false, closedByGame = false, binaryType = 'blob';
    ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (k) { self[k] = target[k].bind(target); });
    // Own data properties: the WebSocket.prototype accessors (url, onopen, …) would throw "Illegal invocation" on this object.
    Object.defineProperty(self, 'url', { value: String(url), enumerable: true });
    ['onopen', 'onmessage', 'onclose', 'onerror'].forEach(function (k) { Object.defineProperty(self, k, { value: null, writable: true, enumerable: true }); });
    ['send', 'close'].forEach(function (k) { Object.defineProperty(self, k, { value: null, writable: true }); });
    function fire(type, init) {
      var ev = type === 'message' ? new MessageEvent('message', init) : type === 'close' ? new CloseEvent('close', init) : new Event(type);
      target.dispatchEvent(ev); var h = self['on' + type]; if (typeof h === 'function') h.call(self, ev);
    }
    function bind(ws) {
      inner = ws; ws.binaryType = binaryType;
      ws.addEventListener('open', function () { fire('open'); });
      ws.addEventListener('message', function (e) { fire('message', { data: e.data, origin: e.origin }); });
      ws.addEventListener('error', function () { fire('error'); });
      ws.addEventListener('close', function (e) { fire('close', { code: e.code, reason: e.reason, wasClean: e.wasClean }); });
    }
    function fallback() {
      if (done) return; done = true; clearTimeout(timer); failed();
      try { direct.onopen = direct.onerror = direct.onclose = null; direct.close(); } catch (e) { /* never opened */ }
      if (closedByGame) return;
      note('WebSocket (Cloudflare)'); bind(new Native(self.url));
    }
    var t0 = Date.now(), direct = new Native(DIRECT), timer = setTimeout(fallback, OPEN_MS);
    direct.onerror = fallback; direct.onclose = fallback;
    direct.onopen = function () {
      if (done) return; done = true; clearTimeout(timer); direct.onopen = direct.onerror = direct.onclose = null;
      note('WebSocket (thẳng VN · ' + (Date.now() - t0) + ' ms)'); bind(direct); fire('open');
    };
    Object.defineProperties(self, {
      readyState: { get: function () { return inner ? inner.readyState : (closedByGame ? 3 : 0); } },
      bufferedAmount: { get: function () { return inner ? inner.bufferedAmount : 0; } },
      protocol: { get: function () { return inner ? inner.protocol : ''; } },
      extensions: { get: function () { return inner ? inner.extensions : ''; } },
      binaryType: { get: function () { return binaryType; }, set: function (v) { binaryType = v; if (inner) inner.binaryType = v; } },
    });
    self.send = function (d) { if (!inner) throw new DOMException('Still in CONNECTING state.', 'InvalidStateError'); inner.send(d); };
    self.close = function (code, reason) {
      closedByGame = true;
      if (inner) { inner.close(code, reason); return; }
      done = true; clearTimeout(timer); try { direct.onopen = direct.onerror = direct.onclose = null; direct.close(); } catch (e) { /* not open */ }
      setTimeout(function () { fire('close', { code: code || 1000, reason: reason || '', wasClean: true }); }, 0);
    };
  }

  function WebSocketShim(url, protocols) {
    if (production() && !protocols && gameUrl(url) && allowed()) return new DirectSocket(url);
    return protocols === undefined ? new Native(url) : new Native(url, protocols);
  }
  WebSocketShim.prototype = Native.prototype;
  DirectSocket.prototype = Object.create(Native.prototype, { constructor: { value: WebSocketShim } });
  ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (k, i) {
    WebSocketShim[k] = i; Object.defineProperty(DirectSocket.prototype, k, { value: i });
  });
  window.WebSocket = WebSocketShim;
})();
