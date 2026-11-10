# tm-direct.js — WebSocket direct-route shim

Source: `source/tm-direct.js`. All findings below concern source code only; no runtime testing. Non-minified classic JavaScript IIFE with an early return if `window.WebSocket` is falsy; no class declarations, ES `import` or `export`.

## Symbols and scope (CONFIRMED)

- IIFE-local `Native` captures `window.WebSocket` at evaluation time. This may already be a wrapper from another script.
- Constants: `DIRECT = 'wss://ws.nghichthienky.online/ws'`, `KEY = 'tm-dws-fail'`, `OPEN_MS = 2500`, `RETRY_MS = 5 * 60 * 1000` (300,000 ms).
- Named functions: `production`, `allowed`, `failed`, `gameUrl`, `note`, `DirectSocket`, its nested `fire`, `bind`, `fallback`, and `WebSocketShim`.
- Per-`DirectSocket` state: `self`, `target`, `inner`, `done`, `closedByGame`, `binaryType`; `t0`, `direct`, `timer`. `inner` changes from `null` to the selected live native socket. `done` prevents multiple fallback/success paths. `closedByGame` marks explicit user close; `binaryType` defaults to `'blob'`.
- Global write: `window.WebSocket = WebSocketShim`. Mutable observability state: `window.__tmWsRoute` and optionally `window.__tmNet.route`. Session storage stores `KEY`.

## Function-by-function flow (CONFIRMED)

1. `production()` tests `location.hostname` against `/^(www\.)?nghichthienky\.online$/` — only apex or `www` production hosts match.
2. `allowed()` reads `sessionStorage.getItem(KEY)`, converts it to `Number`, and permits a new direct attempt unless `t` is truthy and `Date.now()-t < RETRY_MS`. A storage access exception permits attempts. It does not reject future timestamps: they remain within the backoff condition.
3. `failed()` attempts to write `String(Date.now())` into session storage, silently tolerating blocked storage.
4. `gameUrl(u)` constructs `new URL(String(u), location.href)` and checks `x.pathname === '/ws' && x.host === location.host`. It does not test query strings, fragments, username, or URL protocol separately. Parsing errors return `false`.
5. `note(route)` conditionally updates `window.__tmNet.route` when `__tmNet` exists and its current route string does not contain `'WebRTC'`; it unconditionally writes `window.__tmWsRoute = route`.
6. `WebSocketShim(url, protocols)` creates a `DirectSocket` only if `production() && !protocols && gameUrl(url) && allowed()`. Other cases construct `Native(url)` if `protocols === undefined`, otherwise `Native(url, protocols)`; falsy protocol arguments can be forwarded if not `undefined` in other cases.
7. `DirectSocket(url)` constructs an `EventTarget`-backed proxy object. It binds `addEventListener`, `removeEventListener`, `dispatchEvent` to `target`; defines own `url`, `onopen`, `onmessage`, `onclose`, `onerror`, `send`, `close` to avoid invoking native WebSocket accessors on this non-native object.
8. `fire(type, init)` synthesizes a `MessageEvent`, `CloseEvent`, or `Event`, dispatches on `target`, then explicitly invokes matching `self['on'+type]` if a function. It forwards selected message fields (`data`, `origin`) and close fields (`code`, `reason`, `wasClean`), but not all underlying event metadata.
9. `bind(ws)` selects `inner`, applies `binaryType`, and wires `open`, `message`, `error`, and `close` listeners. Each listener relays through `fire`.
10. Constructor initially executes `new Native(DIRECT)` and schedules `setTimeout(fallback, OPEN_MS)`. Both `direct.onerror` and `direct.onclose` point to `fallback` until opening.
11. `fallback()` returns if `done`; otherwise marks done, clears timeout, records failed timestamp, clears direct handlers, and closes direct socket in a try/catch. If not game-closed, records Cloudflare route and executes `bind(new Native(self.url))`. It **does not manually emit an open event**; the fallback socket's own later `open` event is relayed.
12. Successful `direct.onopen` checks `done`, marks done, clears timer and direct handlers, records elapsed milliseconds, calls `bind(direct)` and `fire('open')` directly. This avoids waiting for a second `open` event on an already-open socket.
13. `readyState` getter returns `inner.readyState`, or `3` if closed before binding, or `0` otherwise. `bufferedAmount`, `protocol`, `extensions` proxy to `inner` or use default values. `binaryType` getter/setter caches and updates inner socket.
14. `self.send(d)` throws `DOMException('Still in CONNECTING state.', 'InvalidStateError')` while `inner` is null; otherwise delegates. `self.close(code, reason)` marks `closedByGame`; if bound, delegates immediately. If unbound, marks done, clears timer, closes direct, and asynchronously emits a synthetic clean `close` event (`code || 1000`, `reason || ''`).
15. Prototype/constructor wiring: `WebSocketShim.prototype = Native.prototype`; `DirectSocket.prototype = Object.create(Native.prototype, {constructor: {value: WebSocketShim}})`; four numeric WebSocket constants `CONNECTING=0`, `OPEN=1`, `CLOSING=2`, `CLOSED=3` attached to `WebSocketShim` and the `DirectSocket` prototype. Then `window.WebSocket` is overwritten.

## State transitions (CONFIRMED)

`new WebSocket(<matching /ws>)` → eligibility check → `DirectSocket` (state `inner=null`, exposed `readyState=0`) → direct connection pending. On direct open before timeout: `done=true` → `inner=direct` → route note → synthetic `open` event. On direct error/close before open, or 2,500 ms timeout: `done=true` → record backoff → close direct → create same-origin `Native(self.url)` unless explicitly closed → bind its events. If game closes before binding: `closedByGame=true`, `done=true`, clear timer, close pending direct, emit synthetic close. Once `done=true`, delayed direct fallback callbacks are ignored.

## Timing, formulas, events, and constraints (CONFIRMED)

- Direct open timeout: 2,500 milliseconds; backoff: 300,000 milliseconds based on `Date.now()` and session storage.
- Latency string uses `Date.now()-t0`; this is client-observed connect duration, **not** validated ping or server round-trip latency.
- The condition `!protocols` means non-empty specified subprotocols bypass the direct route; an empty array is truthy and bypasses it, too.
- `gameUrl` matches only path `/ws` and exact host (including port), after standard URL parsing. Hostname is independently checked against the production regex.
- Route label `'WebSocket (Cloudflare)'` describes an assumed network path. Fallback connects to original same-origin URL, but actual CDN routing is **UNKNOWN** from this file.
- Native `EventTarget` listener calls and `on*` property callbacks are distinct forwarding paths.

## Caveats and boundaries

- **CONFIRMED:** No game-world logic, damage formulas, player data structures, map/pathfinding, farming controls, inventory, or authoritative anti-cheat rules appear in this asset.
- **CONFIRMED:** DirectSocket is a wrapper, not a native WebSocket object; setting prototypes to `Native.prototype` does not supply native internal WebSocket slots. Native methods/accessors beyond explicitly shimmed members may fail on it, depending on callers.
- **CONFIRMED:** Calling `send()` before `inner` is selected raises; the code has no outgoing-message queue. Handling or ignoring that exception belongs to consumers.
- **INFERRED:** Fallback after 2.5 s may increase time to a usable socket because the fallback socket is only constructed after the delay; actual timing unmeasured.
- **INFERRED:** `DirectSocket` listeners registered after its synthetic `open` event do not receive that event; whether callers attach in time requires runtime observation.
- **UNKNOWN:** Whether direct host exists, DNS-only bypasses a CDN, Caddy serves the route, Cloudflare is fallback transport, WebRTC upgrades, or server accepts this connection.
- **UNKNOWN:** Compatibility with all callers' `instanceof`, native brand checks, subprotocol handling and failure races in production.

## Source anchors

All named functions, state, thresholds, WebSocket event bridges, global reads/writes and source positions are in `ASSET_INDEX.json` with codepoint, UTF-16, byte, line and column offsets. Source is preserved byte-for-byte.
