# Module 09 — TM-Guard (`tm-guard.js`)

## A. Identity
- **Original Filename:** `tm-guard.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_tm_direct_guard.zip`
- **Byte Size:** 5,286 bytes
- **UTF-16 Code Units:** 5,201
- **Unicode Code Points:** 5,201
- **Line Count:** 67
- **SHA-256:** `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47`
- **Module Type:** Standalone IIFE Script
- **Primary Responsibilities (CONFIRMED):**
  1. Passive WebSocket stream inspection for anti-macro/guard challenge messages (`{e: 'guard'}`).
  2. Rendering client-side countdown modal popup (`role="alertdialog"`) prompting human confirmation ("Tôi đang chơi").
  3. Dispatching player confirmation response `{t: 'action', action: 'guard-ok', arg: id}` back to server via `window.__tmSend` or active socket.
  4. Rendering mobile tribulation button ("Độ kiếp") in landscape mode when server gate flag `tg === 1` is present in snapshot data (`snap` or `snap2`).
  5. Providing global fallback feed interface `window.__tmGuard = { feed: feed }`.

### Imports / Exports
- Standalone classic JavaScript IIFE. No ES module imports or exports. Replaces global `window.WebSocket` with wrapped proxy `Wrapped`.

---

## B. Architecture & Technical Analysis (CONFIRMED)

### 1. WebSocket Proxy & Stream Interception
- Captures `Native = window.WebSocket`.
- Defines wrapper `Wrapped(url, protocols)` delegating connection creation to `Native`.
- Attaches event listener `ws.addEventListener('message', e => feed(e.data))`.
- Copies WebSocket prototype and connection states (`CONNECTING`, `OPEN`, `CLOSING`, `CLOSED`).
- Replaces `window.WebSocket = Wrapped`.

### 2. Guard Event Handling (`feed` & `show`)
- Inspects incoming JSON strings. Fast check for substring `"guard"`.
- If found, parses JSON and checks `m.ev` array for objects with `e === 'guard'`.
- Invokes `show(ev)`:
  - Clears existing dialog and countdown interval.
  - Computes `left = Math.max(1, ev.seconds | 0)`.
  - Creates modal popup card with countdown timer (`setInterval(paint, 1000)`).
  - Displays reason string `(ev.reason || '')`.
  - On confirm click ("Tôi đang chơi"), dispatches `{t: 'action', action: 'guard-ok', arg: String(ev.id)}` via `out(m)` and closes dialog.
  - If countdown expires (`--left < 0`), dialog closes locally without sending confirmation.

### 3. Mobile Tribulation Button (`tribButton`)
- Triggered by snapshot events containing `tg` flag:
  - Substring matching `data.indexOf('"t":"snap"') === 1` and `data.indexOf('"tg":1') > 0`.
  - Incremental snapshot `snap2` self-array checking `gate[g][0] === 'tg' && gate[g][1] === 1`.
- Condition: Enabled only when `document.body.classList.contains('mobile')` and in landscape mode (`window.innerHeight <= window.innerWidth`).
- Creates circular overlay button with lightning emoji ⚡ and text "Độ kiếp".
- Click dispatches `{t: 'action', action: 'tribulation'}` via `out(m)`.

---

## C. Symbol Reference (CONFIRMED)

| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `out` | Function | Dispatches payload via `window.__tmSend` or `sock.send` | Line 8 (chars 562–577) | CONFIRMED |
| `show` | Function | Renders anti-macro guard alert dialog with countdown | Line 9 (chars 716–733) | CONFIRMED |
| `close` | Function | Cleans up guard modal and countdown timer | Line 28 (chars 2512–2528) | CONFIRMED |
| `tribButton` | Function | Manages visibility and rendering of mobile tribulation button | Line 31 (chars 2737–2760) | CONFIRMED |
| `Wrapped` | Function | WebSocket constructor wrapper capturing messages | Line 46 (chars 4045–4077) | CONFIRMED |
| `feed` | Function | Fast stream parser checking snapshot flags and guard events | Line 52 (chars 4269–4288) | CONFIRMED |
| `window.__tmGuard` | Interface | External hook exposing `{ feed: feed }` for WebRTC/DataChannel | Line 62 (chars 4993–5026) | CONFIRMED |

---

## D. Limitations & Clarifications

> [!NOTE]
> - **Previous Incorrect Claims Corrected:** Earlier documentation described `tm-guard.js` as an "Anti-tamper & prototype watchdog" performing debugger detection. Static source analysis confirms the file is a WebSocket message interceptor: it displays an anti-macro guard alertdialog (`show`) and toggles a mobile tribulation button (`feed`). No prototype checking or debugger timing sidechannel code is present.
> - **Server Authority:** The countdown and timeout consequences (village reset, chat warning) are purely UI text notices. Authoritative enforcement, timing deadlines, and macro detection algorithms reside entirely on the server.
