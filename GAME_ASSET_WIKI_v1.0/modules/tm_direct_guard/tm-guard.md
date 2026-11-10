# tm-guard.js — anti-macro guard UI and mobile tribulation button

Source: `source/tm-guard.js`. Code-only analysis without runtime tests. Non-minified classic JavaScript IIFE, no class declarations, ES `import` or `export`.

## Symbols and scope (CONFIRMED)

- IIFE-local `Native = window.WebSocket` with early return when falsy. This is the WebSocket constructor **at this script's execution time**, potentially another shim.
- State variables `sock` (last socket created by this wrapper), `box` (current guard dialog root), `timer` (interval identifier, initialized `0`), `trib` (lazy-created tribulation button). The `show` closure owns countdown `left`.
- Named functions: `out`, `show`, `close`, `tribButton`, `Wrapped`, `feed`; anonymous callbacks: button `onclick`, `paint`, `send`, `pointerdown`, WebSocket `message`, `forEach` constants.
- Exposed global `window.__tmGuard = {feed: feed}`; global replacement `window.WebSocket = Wrapped`.
- External network hook `window.__tmSend` and string-based in-band JSON messages.

## Function-by-function flow (CONFIRMED)

1. `out(m)`: inside a `try/catch`, if `window.__tmSend` is truthy, invoke it with **the message object** `m`; else if `sock && sock.readyState === 1`, call `sock.send(JSON.stringify(m))`. Exceptions are silently discarded. No success/failure acknowledgement is checked.
2. `show(ev)`: removes any existing dialog, clears prior interval, computes `left = Math.max(1, ev.seconds | 0)` (bitwise coerces to signed 32-bit integer), creates overlay, card, title, explanation, countdown, button in the DOM; inserts into `document.body`. The explanation includes `ev.reason || ''` as `textContent`; the countdown text claims a village reset/chat warning, but this is **only UI wording**.
3. On guard button click, sends `{t:'action', action:'guard-ok', arg:String(ev.id)}` through `out`, then invokes local `close()` to remove dialog and clear interval. There is no retry/ack mechanism in this file.
4. `paint()` updates countdown text to display current `left`, decrements it using `--left`, then invokes `close()` if `left < 0`; `paint()` is invoked immediately, then scheduled with `setInterval(paint,1000)`.
5. `close()` clears current interval and removes `box` when present, setting it to `null`. It does not affect `sock` or `trib`.
6. `tribButton(on)` forces `on=false` when `document.body` missing, `body.classList` lacks `mobile`, or `innerHeight > innerWidth` (portrait); hides existing button when not enabled. On first enable it creates a button, aria-label `Độ kiếp`, HTML icon/text, positioning styles, pointerdown propagation stop, and a click handler. On subsequent enables it toggles `display='block'`.
7. The tribulation button click handler prevents default and stops propagation, then calls `out({t:'action', action:'tribulation'})`. No server gate validation happens locally beyond state fed to `tribButton`.
8. `Wrapped(url, protocols)` delegates construction to the captured `Native` (with or without protocol argument), assigns `sock = ws`, attaches `ws.addEventListener('message', e => feed(e.data))`, and returns the constructed socket. All outgoing/incoming traffic remains handled by delegated WebSocket except for passive message inspection and the extra UI commands.
9. `feed(data)` rejects non-string input. For a fast path, `data.charCodeAt(6) === 115 && data.indexOf('"t":"snap"') === 1` triggers `tribButton(data.indexOf('"tg":1') > 0)`. This expects compact JSON formatting, not arbitrary equivalent whitespace or key order.
10. For `snap2`, if `data.indexOf('"t":"snap2"') === 1 && data.indexOf('"tg"') > 0`, `feed` runs `JSON.parse(data).self`, then iterates `gate` and applies `tribButton(gate[g][1] === 1)` when `gate[g][0] === 'tg'`. Parsing/access exceptions are swallowed. If no `tg` field is present, previous gate visibility is preserved (comment states compact snapshots carry changed fields).
11. If the input text does not contain `"guard"`, returns. Otherwise `JSON.parse(data)`, reads `m && m.ev`, traverses `list` and runs `show(list[i])` for each truthy entry with `e === 'guard'`; malformed payloads are swallowed. Multiple guard events in one message replace previous dialogs in order, leaving only last displayed.
12. `Wrapped.prototype = Native.prototype`; the four static `CONNECTING`, `OPEN`, `CLOSING`, `CLOSED` constants are copied from `Native`; finally `window.WebSocket = Wrapped`.

## State & event flows (CONFIRMED)

- Network: socket `message` event → `feed(e.data)`; alternate module may call `window.__tmGuard.feed(data)` directly (hook is exposed, invocation by other code **UNKNOWN**).
- Guard: parsed `m.ev[*].e === 'guard'` → `show` → overlay appears → countdown interval. Confirm click → `out(guard-ok)` → close. Countdown expiration → close without sending acknowledgement. `show` on later events resets countdown and dialog.
- Tribulation: `snap` with `tg` substring or `snap2` self-field `tg` update → `tribButton(boolean)` → button show/hide (depending on mobile and landscape) → click → `out(tribulation)`.
- Output transport: prefer `window.__tmSend(m)` when truthy; else latest `sock` if its `readyState === 1`; else silently no send.

## Formulas, thresholds, and exact matching (CONFIRMED)

- Guard timer `left = max(1, ev.seconds | 0)` seconds, interval `1000` ms; UI first paints before interval starts. `--left < 0` means label `0` is painted for an interval tick before closure. This is a local display countdown, not authoritative server deadline.
- UI overlay `z-index:2147483000`; mobile tribulation button `z-index:60`, dimensions `52px × 52px`. These are CSS only.
- Mobile condition `document.body.classList.contains('mobile')`; landscape condition `window.innerHeight <= window.innerWidth`.
- Raw matching depends on exact substrings `'"t":"snap"'`, `'"tg":1'`, and `'"t":"snap2"'`; it is not schema-agnostic JSON parsing.
- The `snap2` branch expects `JSON.parse(data).self` to be an iterable array of `[key,value]` pairs and uses strict numeric `1` for `tg`.

## Rendering and external boundaries

- **CONFIRMED:** UI uses DOM elements, inline CSS, `textContent` for reason, and hard-coded `innerHTML` for the tribulation icon/text. No Phaser/game-scene rendering is implemented here.
- **CONFIRMED:** Error and parse handlers suppress exceptions; no server acknowledgement is checked.
- **CONFIRMED:** `sock` retains the most recent socket created by this wrapper, regardless of URL.
- **INFERRED:** Rotation or resize alone will not refresh visibility; no resize/orientation listener appears here.
- **UNKNOWN:** Guard detection rules, timeout penalties, server handling of `guard-ok`, actual tribulation eligibility, WebRTC use, schema validity and runtime layout.

Exact symbol anchors and offsets are in `ASSET_INDEX.json`.
