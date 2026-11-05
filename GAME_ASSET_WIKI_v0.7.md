# Game Asset Source Map

**Wiki version:** 0.7 (reconstructed reference edition)  
**Updated:** 2026-11-05  
**Coverage:** 8 analyzed JavaScript assets (6 application/engine bundles and 2 standalone browser scripts).  
**Purpose:** English-language navigation reference for Codex. Read this wiki to identify relevant current source files; ask the user for the full current file before implementation. This wiki is not a substitute for source code.

> **Provenance notice:** This v0.7 file was reconstructed from the verified findings and asset mapping of v0.6 plus direct inspection of `tm-guard.js` and `tm-direct.js`. The original v0.6 Markdown is not mounted in this session, so this is **not a byte-for-byte append to the earlier document**; it retains the known systems, search anchors, feature routing and caveats but may not contain every paragraph or detail of v0.6. For a lossless merge, provide the previously downloaded v0.6 Wiki. The two new scripts and their hashes were inspected directly in this session.

## Evidence and usage conventions

- **CONFIRMED:** directly observed during static analysis of the relevant uploaded file in this conversation or the prior analysis of that file.
- **INFERRED:** plausible relationship derived from imports, exposed symbols, comments or other files; independently verify before coding.
- **UNKNOWN:** an important behavior, exact build match or server-side rule not established by the provided assets.
- Minified identifiers (e.g. `Lf`, `lm`, `Pa`, `Et`, `yt`) and hashed asset names are **build-local**; always search the current version again.
- Browser `self`, `hp`, `fx`, position and UI fields are **not authoritative proof** of server-computed damage, invulnerability, stealth or NPC aggro.
- To avoid excessive context, start from the routing table; ask for **only** relevant current complete files. Do not request `phaser-DRI6y8R5.js` for ordinary gameplay modifications.

## Asset registry

| Asset | Role / distinguishing search anchors | Status |
| --- | --- | --- |
| `economy-BhEd6Dz4.js` | Shared economy and game rules: progression, classes, skill/equipment configs, forge, loot, potions, mount data; `stealthLong`, `an-than` data | CONFIRMED (prior static analysis) |
| `giftcodes-DtRLIkN2.js` | Client/offline combat and shared gameplay services; `class Pa`, `class tt`, `class xs`, `class Wa`, `class fo`, `class ko`, `class Oa`, `class Ua`, `class Qs` | CONFIRMED (prior static analysis) |
| `items-DiH_Rqzx.js` | UI item metadata, gear/icons, keybind defaults and local settings; `tm-controls-v1`, `nn`, `ln`, `x`, `P`, `on`, `un`, `cn`, `an` | CONFIRMED (prior static analysis) |
| `phaser-DRI6y8R5.js` | Third-party **Phaser 3.90.0** runtime: scene, camera, renderer, input, physics, animation, audio, maps; `VERSION:"3.90.0"` | CONFIRMED (prior static analysis) |
| `index.js` | App bootstrap, auth, WebSocket/WebRTC, `snap2` decoder, mobile controls, loading, Phaser scene startup; `class Et`, `class yt`, `class ko`, `mo`, `Vt` | CONFIRMED (prior static analysis); filename un-hashed |
| `WorldScene.js` | Main world/scene logic: Auto Farm, player movement, target selection, skill input, entities/snapshots, HUD, fishing, PvP presentation; `class Lf`, `class lm`, `za=11` | CONFIRMED (prior static analysis); filename un-hashed |
| `tm-guard.js` | Independent browser anti-macro **challenge UI** and mobile tribulation button; `window.__tmGuard`, `guard-ok`, `tribButton` | CONFIRMED (directly re-inspected in v0.7) |
| `tm-direct.js` | Independent browser WebSocket route wrapper: tries direct Vietnamese endpoint, falls back to same-origin server; `DirectSocket`, `WebSocketShim`, `tm-dws-fail` | CONFIRMED (directly re-inspected in v0.7) |

## Feature-to-asset routing

| User request / feature | Primary source to request | Search anchors | Other dependencies / caveats |
| --- | --- | --- | --- |
| Auto Farm radius, target selection, pursuit, navigation, avoiding unreachable mobs | **`WorldScene.js`** | `class lm`, `za=11`, `lm.pick`, `lm.walk`, `lm.update`, `Lf.autoHost`, `Lf.toggleAutoFarm` | `giftcodes` for route/collision helpers; current hashed `WorldScene` must be confirmed |
| Auto Farm potions, meditation, death/revive, loot or hidden-tab updates | **`WorldScene.js`** | `lm.drink`, `lm.rest`, `lm.idle`, `lm.backOff`, `Lf.backgroundAuto`, `tm-auto-hp` | Server/local driver decides whether actions are accepted |
| Character movement, click-to-move, dash, collision | **`WorldScene.js`**, `giftcodes-DtRLIkN2.js` | `Lf.move`, `Lf.sendMove`, `Lf.startClickOrder`, `Lf.clickDirection`, `tt.blocked`, `tt.move` | Game map JSON; server may correct client motion |
| Attack, status effects, skill mechanics and damage | **`giftcodes-DtRLIkN2.js`**, `economy-BhEd6Dz4.js`, `WorldScene.js` | `Pa.basic`, `Pa.selfEffects`, `Pa.incomingScale`, `Lf.useSkill` | Combat presentation and skill sending do **not** establish server damage authority |
| Stealth / invisibility (Ảnh Sát) and monster aggro | **`giftcodes`**, **`economy`**, `WorldScene.js` | `an-than`, `stealthUntil`, `stealthLong`, `Pa.flags`, `Lf.updateViews`, `fx` | `fx` containing `i` can affect rendering; server monster AI must be checked separately |
| Login, registration, guest, session persistence | **`index.js`** | `Vt`, `Lt`, `Te`, `Qe`, `Ne`, `pe` | Server auth validation unknown; do not log credentials |
| WebSocket/WebRTC transport, disconnect/reconnect, RTT overlay | **`index.js`**, `tm-direct.js`, `tm-guard.js` | `class Et`, `Et.upgrade`, `Et.reconnect`, `window.__tmNet`, `window.WebSocket` | Inspect script **load order** and active transport; WebRTC upgrade is a distinct path |
| Direct Vietnam WebSocket route, 2.5 s timeout, Cloudflare fallback | **`tm-direct.js`** | `DIRECT`, `OPEN_MS`, `RETRY_MS`, `DirectSocket`, `fallback`, `WebSocketShim`, `tm-dws-fail` | Only eligible same-origin `/ws` game connections on production host; not a global WebSocket redirect |
| Anti-macro challenge UI, confirmation button, countdown | **`tm-guard.js`** | `show`, `feed`, `out`, `window.__tmGuard`, `guard-ok` | Detection criteria, penalties and token validation are **server-side / unknown** |
| Mobile button for Độ kiếp | **`tm-guard.js`** | `tribButton`, `tg`, `tribulation` | Shows only in mobile landscape when snapshot reports eligibility |
| Compact server snapshots, `hp`, `fx`, changed entity fields | **`index.js`**, `WorldScene.js` | `class yt`, `yt.decode`, `snap2`, `Lf.onSnap`, `Lf.updateViews` | Decoder reconstructs state; server encoder/authority not indexed |
| Keyboard mappings, controls and item icons | **`items-DiH_Rqzx.js`**, `WorldScene.js` | `tm-controls-v1`, `nn`, `ln`, `Lf.bindKeys`, `on`, `P` | `index.js` and `WorldScene.js` have additional mobile controls |
| UI, HUD, inventory, crafting, quests, titles, ranks and world map | **`WorldScene.js`** plus `items`/`economy` | `Lf.openBag`, `Lf.openSkills`, `Lf.openWorldMap`, `Lf.openRanks`, `Lf.questGuide` | Authoritative inventory/quest mutation happens in driver/server |
| Fishing / Đồ sát and presentation | **`WorldScene.js`** | `wd`, `Md`, `fish`, `ngu-ong` | `data/fishing.json` and live driver for awards/rules |
| Renderer, Phaser camera/input/animation/asset-loading issue | **`WorldScene.js`** caller, then `phaser-DRI6y8R5.js` if necessary | `VERSION:"3.90.0"`, `Game`, `Scene`, `Camera`, `Animations`, `Loader` | Do not modify vendor engine for a regular feature |
| Server/local offline monster simulation | **`LocalDriver-CPHqzZNU.js`** (NOT uploaded or indexed) or server source | Name observed as dynamic chunk in `index.js` | Not visible in the earlier browser asset list; do not claim it exists or is currently deployed |

## Asset: `economy-BhEd6Dz4.js`

**Type:** Shared game data/rules and calculation module (approximately 154 KB in the prior upload). Imports and exact symbols should be checked against the current build.

### Areas to inspect

- Level progression, classes, stat formulas and calculated attributes.
- Skills, unlock prerequisites, power, cooldowns and class configuration.
- Equipment definitions, sets, bonuses, forging, enhancement and loot chances.
- Potions, mounts, inventory-related data and premium/progression configuration.
- `stealthLong`: equipment-related extension relevant to the Ảnh Sát `vo-anh` set. This is **not** monster AI, nor proof of live invisibility.
- `an-than`: class skill data; the associated status effects are implemented by gameplay logic elsewhere.

**Request for:** changes to formula display/calculations or understanding skill/set data. **Also request:** `giftcodes` for gameplay implementation and the current `WorldScene` for command invocation/rendering. **Unknown:** which shared formulas a live server independently enforces.

## Asset: `giftcodes-DtRLIkN2.js`

**Type:** Shared feature module (approximately 190 KB in prior upload), not simply a gift-code list.

| Anchor | Scope |
| --- | --- |
| `class Pa` | Combat resolution and status effects in shared/local logic; `Pa.selfEffects`, `Pa.incomingScale`, `Pa.flags`, `Pa.basic` |
| `class tt` | Collision, blocked-path, cast/raycast and movement helpers: `tt.blocked`, `tt.cast`, `tt.sweep`, `tt.move` |
| `class xs` | Equipment effects |
| `class Wa` | Quest-related systems |
| `class fo` | Realm and boss events |
| `class ko` | Gift code management (distinct from `index.js` mobile `class ko`) |
| `class Oa` | Forging functions |
| `class Ua`, `class Qs` | Ranking and leaderboard helpers |

### Stealth behavior (observed in prior inspection)

- Ảnh Sát `an-than` unlocks at level 10. Reference configuration: 5-second stealth, 16-second cooldown and 50% incoming damage reduction (check current class stats before relying on exact values).
- `Pa.selfEffects` applies `stealthUntil` and clears monsters presently targeting the player in that combat implementation.
- `Pa.flags` derives visible status flag `i` while relevant effects are active. `Pa.basic` cancels stealth.
- **Crucial limitation:** monster re-acquisition and live server target selection are not established by the `fx` flag. A client-only `self.fx` edit cannot be relied on for stealth.

**Imports observed previously:** `economy-BhEd6Dz4.js`, `index-Cj0KitBn.js`. Build versions and the current full source must be rechecked before implementation.

## Asset: `items-DiH_Rqzx.js`

**Type:** Item and UI-facing metadata utilities rather than the live server inventory handler.

| Anchor | Function |
| --- | --- |
| `tm-controls-v1` | Local storage key for customized controls |
| `nn`, `ln` | Read/save user input mappings, including defaults (33 bindings in prior analysis); `V` toggles Auto Farm |
| `x` | Tooltip/description resolver |
| `M` | Potion-related display information |
| `P` | Equipment icon paths |
| `on` | Item icon rendering |
| `un` | Currency icons |
| `cn` | Fetch item metadata (`data/items/items-meta.json`, `data/items.json`) |
| `an` | Fetch gear metadata (`data/gear/gear.json`) |

**Imports observed previously:** economy and index bundle. For actual auto-farm logic, read `WorldScene.js`, not this binding module. Item info fetched via JSON is not authority over server inventory.

## Asset: `phaser-DRI6y8R5.js`

**Type:** Third-party **Phaser 3.90.0** browser-based 2D engine bundle (approximately 1.21 MB in prior analysis). Not a game-specific gameplay file.

### Important code/module anchors

| Anchor | Phaser responsibility |
| --- | --- |
| `VERSION:"3.90.0"`, internal module `8054` | Version and renderer constants |
| `85454` / `t.g.Phaser=h` | Root Phaser namespace |
| `50127` | Phaser.Game game initialization/update/lifecycle |
| `60903`, `97482` | Scene management and scene class |
| `32743`, `38058`, `71911` | Cameras |
| `60421`, `60848`, `9674` | Animations |
| `14350`, `7003` | Input |
| `77856` | Game objects, sprites, shapes, text |
| `36909`, `86054` | Renderer and WebGL/Canvas |
| `44563` | Generic Arcade/Matter physics namespace |
| `62501`, `27458` | Tilemaps and textures |
| `57777`, `23717` | Loader and sound |
| `43066`, `90291` | Tweens and timers |
| `export{Ot as P,Dt as p}` | Final ESM exports of this build |

`index.js` imports the Phaser bundle dynamically, constructs `Phaser.Game`, then starts the `world` scene. **Do not request this large vendor bundle** for Auto Farm radius, monster AI, damage, macros, controls or WebSocket routing unless a confirmed generic Phaser bug requires it.

## Asset: `index.js`

**Type:** Browser bootstrap and communication UI module (previously uploaded un-hashed `index.js`; approximately 113.6 KB). Another bundle imports `index-Cj0KitBn.js`: their byte-for-byte equivalence remains **UNKNOWN**.

### Main symbol map

| Anchor | What it does |
| --- | --- |
| `mo` | Loads game data, chooses online/local driver, loads Phaser and the WorldScene, creates the game |
| `po` | Login/online join and retry flow |
| `j` | Fetch JSON resources |
| `class Et` | Online driver: WebSocket connection, queue, ping, reconnection and optional WebRTC upgrade |
| `Et.receive`, `Et.send`, `Et.upgrade`, `Et.reconnect` | Receive and forward messages, send commands, upgrade/restore transport |
| `class yt`, `yt.decode` | Decode compact `snap2` deltas for self/entities; entity field order `x,y,d,a,hp,fx` |
| `Lt` | Connect and perform initial online authorization/join handshake |
| `Vt` | Authentication and account UI: registration, login, guest, reset/verification |
| `Te`, `Qe`, `Ne`, `pe`, `Ae` | Session/local persistent account and configuration state |
| `class ko` | Mobile controller: virtual joystick, skill buttons, menu hooks |
| `Zt`, `Jt` | Fullscreen-related controls |
| `at`, `ro`, `so` | Game image data decoding and Phaser loader hooks |
| `Se`, `B`, `dt` | Loading overlay and progress/errors |
| `window.__tmNet`, F9 | Diagnostic transport route and ping overlay |
| `window.__tmSend` | Exposed wrapper to send game commands (not proof of server acceptance) |
| `window.__tmStarted` | Startup indicator |

### Dynamic chunks and game bootstrap

The entry point references `WorldScene-BFrp0V0P.js`, `LocalDriver-CPHqzZNU.js`, `phaser-DRI6y8R5.js`, `items-DiH_Rqzx.js`, `economy-BhEd6Dz4.js` and `giftcodes-DtRLIkN2.js` in its Vite dependency/preload mappings. Presence in that mapping **does not imply** every file was fetched by the current browser session or available at a public URL. The local/offline driver file has not been provided.

The game starts a `world` scene using Phaser (`scene.add("world",...)`). `window.game` is only assigned when a `timer` URL query parameter is present in this build; do not assume every page exposes the game object.

### Network interaction with the two independent scripts

- `tm-direct.js` can replace the global `window.WebSocket` constructor **before** the entry point creates the game socket. The entry point then speaks to the WebSocket-compatible shim for eligible connections.
- `tm-guard.js` can also wrap `window.WebSocket`, and exposes `window.__tmGuard.feed` for messages arriving via a different transport, e.g. WebRTC. The exact active integration path depends on the game bundle and script loading order.
- A network overlay may show the chosen WebSocket route from `tm-direct.js` through `window.__tmNet`; the script preserves an existing route label containing `WebRTC`.
- There is no evidence in the supplied files that either script changes server damage/aggro/auth or macro-detection decisions.

## Asset: `WorldScene.js`

**Type:** Main client scene module (prior upload was an un-hashed `WorldScene.js`, approximately 729 KB, rather than confirmed exact deployed `WorldScene-BFrp0V0P.js`). Imports `items`, `economy`, `giftcodes`, the hashed index bundle and Phaser. Exports `Lf as WorldScene`.

### World and gameplay systems

| Anchor | Responsibility |
| --- | --- |
| `class Lf` | Main Phaser `world` scene, init/create/update loop and subsystem wiring |
| `Lf.preload`, `Lf.create`, `Lf.update` | Asset loading, scene construction and frame-level updates |
| `Lf.onServer`, `Lf.onSnap`, `Lf.onEvent` | Consume driver messages, apply snapshots, show combat/world events |
| `Lf.upsert`, `Lf.dropView`, `Lf.updateViews` | View entities, animate/interpolate, display flags such as `fx` |
| `Lf.move`, `Lf.sendMove` | Local steering and movement command `{t:"move",seq,x,y,d,a}` |
| `Lf.act` | Send action commands `{t:"action",action,arg,arg2}` |
| `Lf.useSkill` | Client checks and skill command sending; not server-authoritative damage |
| `Lf.startClickOrder`, `Lf.clickDirection` | Click-navigation and direction/path routing |
| `Lf.nearestEnemy`, `Lf.cycleTarget`, `Lf.enemyAtCursor` | Client entity target selection |
| `Lf.bindKeys`, `Lf.initKeys` | Keyboard and mouse controls |
| `Lf.openBag`, `Lf.openSkills`, `Lf.openWorldMap`, `Lf.openRanks` | Main inventory, skill, map and rank UI |
| `Lf.questGuide`, `Lf.updateTracker` | Quest tracking and guidance |
| `class Mu`, `class Cu`, `class Qu` | HUD, chat and minimap |
| `class es`, `class Qi`, `class Gu` | Character sprites, visual effects and audio |
| `wd`, `Md` | Fishing and Đồ sát/PvP HUD presentation |

### Auto Farm — primary location

- Controller `class lm`; default `const za=11` tiles around an anchor captured on toggle. Scene links: `Lf.autoHost`, `Lf.toggleAutoFarm`, `Lf.update`, `Lf.backgroundAuto`.
- `lm.update` chooses between target acquisition, movement, skills, loot, potions, meditation/retreat and respawn. `lm.pick` ranks candidate monsters using distance, HP, level/category and route reachability.
- `lm.walk` follows clear-line or computed paths and can skip stuck/unreachable targets; helper route/collision logic originates in `giftcodes`.
- `lm.castSkills` selects eligible skills or falls back to basic attacks; the client sends actions but server/driver determines results.
- `lm.idle`, `lm.drink`, `lm.rest`, `lm.backOff` cover loot, consumables and survival. Prior static analysis noted a 3-deaths-in-10-minutes stop policy and a hidden-tab Worker/headless-step path; check current source before relying on numeric thresholds.
- Auto Farm's internal `aggro` field can classify monsters as hostile/non-passive; it **does not establish** that the live server's monster AI is currently targeting the player.

### Visual status versus server authority

`Lf.updateViews` interprets status `fx` and lowers the rendered alpha when `fx` contains `"i"` (prior analysis found 0.35). This only documents **visual transparency**. Actual stealth duration and target clearing are represented in shared combat logic, while the server's monster re-aggro rules remain unknown.

### Additional modules and assets

The scene uses map/texture JSON, UI/gear metadata, FX manifests, fishing and realm resources. For graphics or game-state discrepancies, request the relevant current `data/*.json` asset along with the scene code. For offline monster AI and combat simulation, request `LocalDriver-CPHqzZNU.js` if it is available in that build; for online game rules request the corresponding server implementation.

## Asset: `tm-guard.js`

### Identity and provenance

- **Type:** Plain standalone, immediately invoked browser script (`(function(){ ... })()`), rather than a Vite/ES module. Located at website root in the DevTools screenshot, distinct from `/assets/`.
- **Size:** 5,286 bytes; **SHA-256:** `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47`; **67 physical lines**.
- **Imports/exports:** No ESM imports/exports. Reads existing `window.WebSocket`, replaces it with `Wrapped`, and publishes `window.__tmGuard = {feed: feed}`.
- **Inline comment date:** 2026-10-26. The code comment describes a macro/auto-click check; it is **not** the server's actual detection algorithm.

### Runtime API and behavior

| Symbol / exact search anchor | Confirmed behavior |
| --- | --- |
| `var Native = window.WebSocket` | Capture the WebSocket constructor already present at this script's load time. May capture `tm-direct.js` wrapper instead of browser native depending on load order. |
| `function Wrapped(url, protocols)` | Create a socket with captured `Native`, store latest one in `sock`, attach `message` -> `feed` listener, and return socket. Installs itself as `window.WebSocket`. |
| `function feed(data)` | Parse incoming string messages. For event array `m.ev`, find `e === 'guard'` and display the challenge. Also inspect `snap`/`snap2` data for `tg` tribulation gate flag. |
| `window.__tmGuard = { feed: feed }` | Exposes packet feeding for transports other than the wrapped WebSocket, e.g. when the game upgrades to WebRTC DataChannel. This file does **not** implement WebRTC negotiation. |
| `function show(ev)` | Create an `alertdialog` overlay with server-provided reason and time limit (`ev.seconds`), plus confirmation button. |
| `function out(m)` | Prefer `window.__tmSend(m)`; otherwise send serialized JSON using latest saved WebSocket if open. |
| `action: 'guard-ok', arg: String(ev.id)` | The confirmation button emits `{t:'action', action:'guard-ok', arg:<challenge-id>}` and closes local popup. No server-side confirmation validation is defined here. |
| `function close()` | Remove popup and stop countdown. |
| `function tribButton(on)` | Display or hide mobile **Độ kiếp** button. Requires `body.mobile`, landscape orientation and positive gate state; sends `{t:'action',action:'tribulation'}` when tapped. |
| `"tg":1`, `gate[g][0] === 'tg'` | Reads full or compact snapshot changes to decide whether the tribulation button should be shown. |

### Important boundaries and integration cautions

1. The script is a **challenge display/response handler**; it does not contain the server's auto-click detection thresholds, disciplinary logic, or challenge acceptance rules.
2. The countdown UI text claims a nonresponse may send the player back to the starter village and post a warning. That is what the **UI says**, not independently confirmed server behavior. When the counter expires this client code simply closes the popup.
3. `Wrapped` returns a real socket object (or whatever compatible socket the captured constructor returns). It stores only the latest `sock`, so reconnection/multiple socket behavior deserves testing when debugging.
4. When WebRTC DataChannel is in use, the WebSocket `message` listener may not receive gameplay snapshots. The entry point or another game script would have to explicitly call `window.__tmGuard.feed(data)`; this cannot be guaranteed by `tm-guard.js` alone.
5. The compact `snap2` decoder here only handles a narrow `tg` delta; authoritative snapshot decoding lives in `index.js` (`class yt`).
6. **Do not infer** that suppressing a popup, editing `window.__tmGuard`, or forging a response disables server-side checks. No such claim is supported.

### Requests for Codex

Request this file for **popup not showing**, **guard event display**, **mobile tribulation button**, **guard response transport selection**, or **interaction between WebSocket wrappers**. Also request the current `index.js` and relevant server/event specification for transport or challenge-policy issues. It is not the correct primary file for Auto Farm or monster AI.

## Asset: `tm-direct.js`

### Identity and provenance

- **Type:** Plain standalone immediately invoked browser script that substitutes a WebSocket-compatible constructor on the production website.
- **Size:** 5,362 bytes; **SHA-256:** `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965`; **72 physical lines**.
- **Imports/exports:** No ESM imports/exports; reads and sets `window.WebSocket`, sets `window.__tmWsRoute`, optionally writes `window.__tmNet.route` and stores failure time in `sessionStorage`.
- **Inline comment date:** 2026-11-01. Comment says the direct endpoint routes to a Vietnam VPS and bypasses Cloudflare's Hong Kong edge. **This is author intent in source comments, not live network verification.**

### Socket routing and fallback

| Symbol / exact search anchor | Confirmed behavior |
| --- | --- |
| `var Native = window.WebSocket` | Captures the WebSocket constructor that existed when this script ran. |
| `DIRECT` | Direct preferred endpoint `wss://ws.nghichthienky.online/ws`. |
| `OPEN_MS = 2500` | If direct socket has not opened within 2.5 seconds, attempt fallback. |
| `RETRY_MS = 5 * 60 * 1000` | After direct-route failure, a five-minute per-tab cooldown is checked. |
| `KEY = 'tm-dws-fail'` | `sessionStorage` key for last direct-route failure timestamp. |
| `production()` | Only `(www.)?nghichthienky.online` is eligible for direct-route substitution. |
| `gameUrl(u)` | Only same-origin URLs with pathname exactly `/ws` are eligible; unrelated WebSocket uses remain on captured `Native`. |
| `allowed()`, `failed()` | Check/record cooldown; blocked `sessionStorage` writes are silently ignored. |
| `class-like function DirectSocket(url)` | WebSocket-compatible object delegating listeners, `onopen/onmessage/onclose/onerror`, `send`, `close`, protocol/binary state and properties. |
| `function bind(ws)` | Attach handlers to the actual socket and forward its events through `EventTarget`. |
| `function fallback()` | Close unsuccessful direct attempt and create `new Native(self.url)` for original same-origin `/ws` URL, i.e. the site/Cloudflare path. |
| `function note(route)` | Update `window.__tmWsRoute`; also update `window.__tmNet.route` if the current route label does not contain `WebRTC`. |
| `function WebSocketShim(url, protocols)` | Intercept only eligible production same-origin `/ws` connections **without a `protocols` argument**, and only when cooldown allows. All other requests delegate directly. |
| `window.WebSocket = WebSocketShim` | Install wrapper globally. |

### Subtleties relevant to debugging

1. The script does **not** redirect every WebSocket: production host, exact same-origin `/ws`, no protocols and cooldown eligibility are all required.
2. The shim tries the configured direct endpoint first and opens a **separate same-origin socket only if necessary**; the game sees one wrapper object. This is not the same as guaranteed lower ping.
3. A direct socket failure is remembered in `sessionStorage` for five minutes **within the current tab**. `sessionStorage` may be blocked; failure handling tolerates that.
4. Initial connection events are forwarded by the wrapper. The wrapper is WebSocket-like, not literally a browser `WebSocket` instance: code that relies on unusual prototype/identity behavior should be tested against this build.
5. `WebSocketShim.prototype = Native.prototype` and `DirectSocket.prototype = Object.create(Native.prototype,...)` emulate parts of the native interface; they are not evidence of full compatibility with every WebSocket consumer.
6. Once the game upgrades to WebRTC, the WebSocket path may no longer carry gameplay packets. `tm-direct.js` does not implement the game's WebRTC upgrade (`index.js` does).
7. Production hostname check and direct endpoint are code-level observations. Whether DNS, Caddy, TLS, routing and server endpoint are reachable in the current deployment has **not** been tested here.

### Requests for Codex

Request this file when investigating **slow connection**, **route preference**, **Cloudflare fallback**, **WebSocket handshake errors**, **route labels/F9 diagnostics**, or **socket compatibility**. Also request `index.js`, `tm-guard.js`, and script loading order for cross-wrapper bugs.

## Cross-script WebSocket integration map

```text
Browser native WebSocket
        |
        +-- tm-direct.js (if loaded): installs window.WebSocket = WebSocketShim
        |       |-- eligible game /ws -> DirectSocket -> direct VN endpoint
        |       |       `-- 2.5 s failure -> same-origin /ws fallback
        |       `-- all other sockets -> previously captured constructor
        |
        +-- tm-guard.js (if loaded): installs window.WebSocket = Wrapped
                |-- captures whatever window.WebSocket was at load time
                |-- attaches message listener -> __tmGuard.feed
                `-- challenge UI / mobile tribulation button

index.js -> constructs game socket through current window.WebSocket
         -> optional WebRTC DataChannel upgrade
         -> owns main snap2 decode and online driver
         -> may feed __tmGuard.feed on DataChannel messages
```

**Loading order is critical:** If `tm-direct.js` loads before `tm-guard.js`, the guard captures the route shim and can receive its forwarded events. If the order is reversed, the route shim captures the guard wrapper. Their composition and event forwarding must be checked under actual runtime load order; the files alone do not show the script tags in HTML. This matters when diagnosing missing guard UI, duplicate handlers, fallback misbehavior or `WebSocket` constructor assumptions.

## Unindexed but mentioned assets

| Asset/reference | Why it matters | Status |
| --- | --- | --- |
| `LocalDriver-CPHqzZNU.js` | Offline/local simulation: potentially monster AI, local damage, collision or status enforcement | **NOT analyzed; NOT confirmed to be deployed** |
| `WorldScene-BFrp0V0P.js` | Hash-named scene chunk referenced in `index.js` | **UNKNOWN equality** with user-uploaded `WorldScene.js` |
| `index-Cj0KitBn.js` | Hash-named entry chunk referenced from game bundles | **UNKNOWN equality** with user-uploaded `index.js` |
| `data/maps/*.json`, `data/sets/*.json`, `data/fishing.json`, `data/items/*.json` | Map/collision data, artwork, fishing and item metadata | Referenced by code; complete content not indexed |
| Live backend/server code | Online monster target selection, anti-macro detection/penalties, skill/damage/movement validation | **Unavailable / NOT analyzed** |

## Wiki maintenance contract for Codex

1. When a feature request arrives, **first consult `Feature-to-asset routing`** and identify the smallest required source set.
2. Ask the user for the **full current source** of each relevant asset; never reconstruct missing code from the wiki. Inspect exact import aliases and runtime version/hash.
3. Work from current code, not stale snippets or outdated minified symbol names. Confirm whether a requested change belongs in the browser extension, client scene, shared gameplay logic or authoritative server.
4. Differentiate `CONFIRMED` (statically observed), `INFERRED` and `UNKNOWN`. Do not treat comments or frontend labels as verified backend behavior.
5. Do not expose credentials, session tokens, private URLs, account identifiers or sensitive game payloads when making wiki updates.
6. Preserve all existing asset entries and update routing tables when adding more files. Record source name, size, SHA-256, imports/exports, important functions/classes, data flows, role, limitations and cross-file references.
7. Avoid edits to the bundled Phaser vendor engine unless the issue truly lies in Phaser itself.
8. For online game behavior, distinguish client rendering/commands from server-authoritative physics, HP, damage, stealth, aggro, inventory and macro detection.
9. Validate script injection/load order for the two root-level WebSocket wrappers whenever an extension or connection bug is involved.
10. **Current documentation state:** v0.7 is a reconstructed reference edition from past v0.6 findings plus verified new source; a byte-for-byte preservation of v0.6 requires the original v0.6 file to be supplied for a later merge.
