# Module 08 — TM-Direct (`tm-direct.js`)

## A. Identity
- **Original Filename:** `tm-direct.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_tm_direct_guard.zip`
- **Byte Size:** 5362 bytes
- **UTF-16 Code Units:** 5333
- **Line Count:** 72
- **SHA-256:** `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965`
- **Module Type:** Standalone IIFE Script
- **Primary Responsibilities:**
  1. Direct WebSocket connection shim, intercepting native `window.WebSocket`.
  2. Host route override, directing game network traffic to designated direct servers or proxies.
  3. Payload pass-through without browser extension interception.

### Imports / Exports
- No ES imports or exports. Runs as an Immediately Invoked Function Expression modifying `window.WebSocket`.

---

## B. Architecture & Technical Analysis
- Defines a `WebSocketShim` class inheriting from or wrapping native `WebSocket`.
- When `new WebSocket(url)` is called by `index-BIkbGDKp.js`, `WebSocketShim` intercepts the target URL.
- Inspects production host patterns and rewrites domain or port if specified by configuration.
- Transparently relays `send`, `onmessage`, `onopen`, `onclose`, `onerror`.

---

## C. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `WebSocketShim` | Class | WebSocket wrapper shim | `tm-direct.js`: Line 9 | CONFIRMED |
| `production` | Function | Host validation and route selector | `tm-direct.js`: Line 9 | CONFIRMED |

---

## D. Limitations
- Client-side runtime hook only; does not provide encryption or server authorization.

---
*For detailed analysis, see: [modules/tm_direct_guard/tm-direct.md](tm_direct_guard/tm-direct.md).*
