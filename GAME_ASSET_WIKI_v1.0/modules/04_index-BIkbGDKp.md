# Module 04 — Index (`index-BIkbGDKp.js`)

## A. Identity
- **Original Filename:** `index-BIkbGDKp.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_index-BIkbGDKp.zip`
- **Byte Size:** 115984 bytes
- **UTF-16 Code Units:** 113882
- **Line Count:** 469
- **SHA-256:** `501ae57d733b2dd15554e606eb96352b4e6f1994e125890f32871dd411a78550`
- **Module Type:** ES Module (Bootstrap & Client Protocol)
- **Primary Responsibilities:**
  1. Client entry point, Vite bundle dependency mapping (`__vite__mapDeps`), and asset preloading.
  2. WebSocket connection management, authentication handshake, heartbeat, reconnect loop.
  3. Snapshot state decoding, command serialization, and packet framing.
  4. Local storage management (user credentials, profile preferences, audio volume, keybindings).
  5. Mobile virtual controls, on-screen joystick, and fullscreen display adaptation.

### Imports
- Leaf foundational module: 0 static imports.
- Dynamic imports: Loads `WorldScene`, `LocalDriver`, `boot` dynamically via `__vite__mapDeps`.

### Exports
Exports 68 named symbols: `mt as $, Ae as A, gn as B, To as C, ge as D, jt as E, fn as F, xn as G, ln as H, Pt as I, Te as J, pt as K...`.

---

## B. Architecture
### Major Subsystems
1. **Bootstrap Engine:** Evaluates browser environment, initializes Canvas/WebGL viewport, checks WebWorker support.
2. **Network Protocol Client:** Maintains persistent WebSocket session, generates packet headers, encodes binary/JSON payloads.
3. **Snapshot Decoder:** Unpacks delta snapshots, resolves state sequence IDs, and filters redundant frames.
4. **Auth & Storage Manager:** Persists authentication token, user character slots, audio settings, and graphic performance toggles.
5. **Mobile Virtual Joystick:** Touch event listener converting touch drag vectors to directional angle inputs.

---

## C. Technical Analysis
### Execution Flow: Connection & Handshake
```text
Window load
  → index bootstrap initializes DOM and config
  → Opens WebSocket to server URL
  → Sends AUTH_REQUEST with token from localStorage
  → Receives AUTH_RESPONSE (session confirmed, character list)
  → User selects character → Sends SELECT_CHARACTER
  → Server sends INITIAL_WORLD_SNAPSHOT
  → index dynamically imports and launches WorldScene(initialData)
  → Starts 10-second heartbeat ping loop
```

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `__vite__mapDeps` | Function | Vite dynamic module dependency resolver | `index-BIkbGDKp.js`: Line 1 | CONFIRMED |
| `Pt` | Class | WebSocket network client | `index-BIkbGDKp.js`: Line 1 | CONFIRMED |
| `Te` | Object | Client settings and audio storage | `index-BIkbGDKp.js`: Line 1 | CONFIRMED |
| `gn` | Function | Mobile virtual joystick controller | `index-BIkbGDKp.js`: Line 1 | CONFIRMED |

---

## E. Cross-Module Integration
- Used by all major modules (`WorldScene`, `sim`, `Character`, `ChieuMau`, `items`) as the foundational provider of network services, settings, and environment helpers.

---

## F. Limitations
- Server packet structure for encrypted opcode blocks cannot be determined purely from static client code without active session keys.

---
*For sub-module documentation, see: [modules/index/](index/).*
