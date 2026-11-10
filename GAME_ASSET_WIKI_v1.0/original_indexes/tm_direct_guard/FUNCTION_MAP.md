# FUNCTION_MAP — feature to function

| Feature | File | Exact functions | Confidence |
|---|---|---|---|
| Install direct socket shim | tm-direct.js | IIFE, `WebSocketShim` | CONFIRMED |
| Production / URL eligibility | tm-direct.js | `production`, `gameUrl`, `allowed` | CONFIRMED |
| Direct attempt & event bridging | tm-direct.js | `DirectSocket`, `bind`, `fire` | CONFIRMED |
| Fallback and 5-minute backoff | tm-direct.js | `fallback`, `failed`, `allowed` | CONFIRMED |
| Transport route display | tm-direct.js | `note` | CONFIRMED |
| WebSocket facade, send, close | tm-direct.js | `DirectSocket` | CONFIRMED |
| Install guard socket wrapper | tm-guard.js | IIFE, `Wrapped` | CONFIRMED |
| Guard event decoding | tm-guard.js | `feed`, `show` | CONFIRMED |
| Guard countdown and close | tm-guard.js | `show`, `close`, local `paint` | CONFIRMED |
| Guard acknowledgement action | tm-guard.js | `show` click callback, `out` | CONFIRMED |
| Snapshot `tg` UI state | tm-guard.js | `feed`, `tribButton` | CONFIRMED |
| Mobile tribulation action | tm-guard.js | `tribButton`, local `send`, `out` | CONFIRMED |
| WebRTC / external message feed | tm-guard.js | `window.__tmGuard.feed`, `out` | CONFIRMED interface; UNKNOWN caller |
| Actual server punishment / eligibility | external | not present | UNKNOWN |

Join file and source anchors in `ASSET_INDEX.json` for source line, Unicode/UTF-16/UTF-8 offsets. There are no renamed/minified symbols in these files.
