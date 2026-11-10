# GAME_ASSET_WIKI_v1.0 — Master Technical Reference

## 1. Project Overview & Scope

`GAME_ASSET_WIKI_v1.0` is the authoritative technical reference for the updated build of the browser-based JavaScript MMORPG client. 

This document synthesizes findings from ten independently analyzed JavaScript assets. It is designed to enable future software engineers and AI coding agents to inspect, trace, understand, and debug game systems with complete source verification and character-level accuracy.

**Core Principles:**
- **Zero Modification:** Original JavaScript files are preserved byte-for-byte in `source/`.
- **Traceability:** Every finding links to exact minified symbols, UTF-16 character offsets, and physical files.
- **Evidence Classification:** Facts are strictly classified as **CONFIRMED** (directly proven in source), **INFERRED** (logically deduced from architecture/data), **UNKNOWN** (insufficient evidence), or **CONFLICT** (discrepancies preserved).
- **Authoritative Boundary:** Distinguishes client-side visual interpolation and predictive simulation from server-authoritative state logic.

---

## 2. Asset Inventory & Source Verification

Ten JavaScript assets constitute the client build, representing 3,623,626 total bytes (~3.62 MB) of untouched minified code:

| Asset Name | Canonical Alias | Package | Size (Bytes) | SHA-256 Hash | Primary Architecture Role |
|---|---|---|---|---|---|
| `Character-DhQJ_Q0g(1).js` | `Character-DhQJ_Q0g.js` | `Character-DhQJ_Q0g.zip` | 69,360 | `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1` | Player animations, weapon FX, audio |
| `ChieuMau-CEtRLp-4.js` | `ChieuMau-CEtRLp-4.js` | `ChieuMau.zip` | 206,820 | `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f` | Skill effect engine, sprite catalog |
| `WorldScene-b_2tpaKT.js` | `WorldScene-b_2tpaKT.js` | `WorldScene.zip` | 1,037,432 | `5d5ede1b50cdcebed76efae6fea1836f067fc61f153cab5b02eb3f8a7cb29d18` | Master Phaser scene, auto-farm, entities |
| `index-BIkbGDKp.js` | `index-BIkbGDKp.js` | `index-BIkbGDKp.zip` | 115,984 | `501ae57d733b2dd15554e606eb96352b4e6f1994e125890f32871dd411a78550` | Bootstrap, network protocol, auth |
| `items-nDkzNEls.js` | `items-nDkzNEls.js` | `items-nDkzNEls.zip` | 18,028 | `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343` | Item metadata, inventory UI, icons |
| `phaser-DRI6y8R5.js` | `phaser-DRI6y8R5.js` | `phaser.zip` | 1,205,225 | `5920a4fd5e79aa7f0f3f87a914b4591ba68a8a87a0f6a5c3d49005a870a5d7b1` | Bundled Phaser 2D game engine |
| `sim-CvoxXTtu.js` | `sim-CvoxXTtu.js` | `sim-CvoxXTtu.zip` | 705,393 | `8ddd24caae7b39e86a6525117ef6619bba015d4698e3d09b2177af465fab9dc7` | Combat simulation, spatial grid, quests |
| `tm-direct.js` | `tm-direct.js` | `tm_direct_guard.zip` | 5,362 | `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965` | WebSocket connection shim |
| `tm-guard.js` | `tm-guard.js` | `tm_direct_guard.zip` | 5,286 | `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47` | WebSocket message interceptor: displays anti-macro guard alertdialog and toggles mobile tribulation trigger
| `trangbi-iyUH-plT.js` | `trangbi-iyUH-plT.js` | `trangbi.zip` | 254,736 | `c591d321899db406ed7387c54c21e303582505396e6d815fe0441dcdc4f11cec` | Equipment, level scaling, formulas |

*All extracted source files have been re-hashed and verified to match original archives with 100% byte fidelity.*

---

## 3. System Architecture & Runtime Topology

The game client executes as a Single Page Application (SPA) inside modern web browsers:

```mermaid
flowchart TD
    subgraph Browser_Environment
        DOM["DOM & Canvas Viewport"]
        WS_API["window.WebSocket"]
        Storage["window.localStorage"]
    end

    subgraph Security_Layer
        TMD["tm-direct.js (WebSocketShim)"]
        TMG["tm-guard.js (Guard Modal & Tribulation UI)"]
    end

    subgraph Application_Core
        Index["index-BIkbGDKp.js (Bootstrap & Protocol)"]
        World["WorldScene-b_2tpaKT.js (Master Scene A3)"]
    end

    subgraph Domain_Services
        TrangBi["trangbi-iyUH-plT.js (Data & Formulas)"]
        Sim["sim-CvoxXTtu.js (Simulation & Spatial)"]
        Items["items-nDkzNEls.js (Items & HUD)"]
    end

    subgraph Visual_and_Audio_Engines
        Phaser["phaser-DRI6y8R5.js (2D Engine)"]
        Char["Character-DhQJ_Q0g(1).js (Sprites & Audio)"]
        Chieu["ChieuMau-CEtRLp-4.js (Visual FX)"]
    end

    DOM --> Index
    WS_API --> TMD
    TMD --> Index
    TMG -.-> WS_API
    Storage <--> Index

    Index --> World
    World --> Phaser
    World --> Sim
    World --> TrangBi
    World --> Items
    World --> Char
    World --> Chieu
```

---

## 4. Module Responsibilities & Boundaries

- **`WorldScene-b_2tpaKT.js` (The Hub):** Responsible for managing scene state, ticking the auto-farm engine, rendering entity pools, and handling snapshot deltas.
- **`index-BIkbGDKp.js` (The Gateway):** Manages transport sockets, user session state, and responsive viewport sizing.
- **`trangbi-iyUH-plT.js` (The Codex):** Static mathematical truths of the game: scaling curves, item definitions, skill trees, and enhancement requirements.
- **`sim-CvoxXTtu.js` (The Predictor):** High-frequency spatial hash queries, collision geometry, and local combat damage prediction.
- **`Character-DhQJ_Q0g(1).js` (The Puppet):** Visual representation of human characters, directional movement frames, weapon sockets, and sound triggers.
- **`ChieuMau-CEtRLp-4.js` (The Pyrotechnic):** Particle cascades, geometric slashes, beam emitters, and skill sound synchronization.
- **`items-nDkzNEls.js` (The Merchant/Backpack):** Tooltips, icon coordinate lookups, and inventory keyboard bindings.
- **`tm-direct.js` & `tm-guard.js` (The Armor):** WebSocket connection proxy (`tm-direct.js`) and anti-macro guard alertdialog with mobile tribulation trigger (`tm-guard.js`).
- **`phaser-DRI6y8R5.js` (The Engine):** WebGL rendering, camera transformations, and audio playback.

---

## 5. Feature-to-Asset Routing Matrix

| Gameplay Feature | Primary Module | Key Classes / Functions | Primary Dependencies | Limitations & Authoritative Boundary |
|---|---|---|---|---|
| **Auto-Farm Engine** | `WorldScene-b_2tpaKT.js` | `A3.autoFarm`, `rk`, `sk`, `A3.castAutoSkill` | `sim`, `trangbi`, `index` | Emits player commands; subject to server rate-limiting |
| **Pathfinding & Navigation** | `WorldScene-b_2tpaKT.js` | `Tv.moveTo`, `ik`, `Wv` | `sim-CvoxXTtu.js` | Client path planning; server verifies final coordinates |
| **Skill Particle FX** | `ChieuMau-CEtRLp-4.js` | `io`, `Po`, `ye`, `sprite_assets` | `phaser`, `Character` | Visual-only; does not determine combat hit outcomes |
| **Character Direction & Mount** | `Character-DhQJ_Q0g(1).js` | `at`, `G`, `wt`, `ri`, `li`, `ui`, `vi` | `phaser-DRI6y8R5.js` | Purely visual representation on client |
| **Spiritual Root Advancement** | `sim-CvoxXTtu.js` | `xm` (breakthrough table), `Dn` (root grades), `Hs = 30` (refining cost), `c1` (level-based Linh Thạch cost), `d1` (upgrade calculation) | Client cultivation state | Source confirms local configuration and calculations; authoritative server rules not established |
| **Equipment & Stat Scaling** | `trangbi-iyUH-plT.js` | `ji`, `Cl`, `mt`, `Qu` | None (Leaf) | Canonical math tables; server enforces caps |
| **Inventory UI & Hotkeys** | `items-nDkzNEls.js` | `M`, `Cn`, `Nn`, `N` | `trangbi`, `index` | UI rendering; server validates item ownership |
| **WebSocket Networking** | `index-BIkbGDKp.js` | `io` (network client), `io.receive` (message handling), `eo.decode` (`snap2` decoding) | Browser WebSocket / RTC channel | Client transport and snapshot handling are visible; remote protocol authority remains unknown |
| **Socket Interception** | `tm-direct.js` | `WebSocketShim`, `production` | Browser Globals | Client-side connection proxy |
| **Anti-Macro Challenge & Mobile Tribulation** | `tm-guard.js` | `feed`, `show`, `tribButton` | WebSocket Streams | Server-authoritative challenges; local DOM presentation |
| **Fishing Minigame** | `WorldScene-b_2tpaKT.js` / `sim-CvoxXTtu.js` | `tv` (scene-side fishing UI), `my` (sim-side fishing system) | Client scene / simulation | Scene presents fishing phases from incoming state; the provided source alone does not establish authoritative online catch rewards |

**Source-identity note:** `index.Pt` is the loading overlay presenter `function Pt(t,e,o="Đang tiến vào")`. It does not implement WebSocket transport. `sim.xm` is a spiritual-root breakthrough table, `sim.Hs` is the numeric constant `30`, `sim.Dn` holds spiritual-root grades, and `sim.c1` calculates a clamped Linh Thạch refinement cost.

---

## 6. Gameplay Systems

### Character & Player Management
Player entities (`ok`) support 8-directional rendering, mount riding, meditation postures, and fishing stances. Equipment appearance updates dynamically by changing texture keys on weapon, body, and head sub-sprites.

### Combat & Skills
Skills are categorized into Physical (Kiếm, Đao, Qung, Quyền) and Magical (Pháp, Trận). Each skill has:
- A cooldown timer managed in `WorldScene`.
- A mana cost verified against player current resources.
- A visual manifestation executed by `ChieuMau`.
- A predictive damage calculation evaluated by `sim`.
- A server command dispatched via `index`.

### Automation (Auto-Farm)
The auto-farm system provides fully automated gameplay:
1. **Target Search:** Queries `sim` spatial grid for the nearest valid monster within 800px.
2. **Navigation:** Calls `Tv` A* pathfinder to navigate within attack range.
3. **Skill Selection:** Evaluates available non-cooldown skills and casts the highest priority spell.
4. **Potion Health Management:** Monitors HP/MP against user threshold percentages and triggers quick-use belt items.
5. **Auto Loot:** Detects nearby drop entities (`ew`) and collects them before picking new monster targets.
6. **Death Recovery:** Monitors player death state and triggers respawn after delay.

---

## 7. Important Formulas and Constants

### Level Scaling Curve (`ji` in `trangbi-iyUH-plT.js`)
```javascript
ji = {
  levels: [18, 60, 122, 198, 278, 364, 454, 544, 634, 724, 814, 904, 976],
  hp:     [1.561, 0.638, 0.375, 0.394, 0.452, 0.537, 0.667, 0.838, 1.056, 1.287, 1.632, 2.085, 2.706],
  hit:    [0.533, 0.220, 0.142, 0.139, 0.161, 0.175, 0.209, 0.268, 0.334, 0.388, 0.494, 0.652, 0.896]
};
```
The scaling table represents non-linear attribute exponents across 13 progression tiers. HP exponents scale sharply above level 634 (reaching 2.706 at level 976) to counteract endgame weapon stat compounding.

### Armor Defense Formula (`sim-CvoxXTtu.js`)
`DamageReduction = Armor / (Armor + 100 * AttackerLevel)`

### Critical Damage
`CriticalMultiplier = 1.5 + (CritDamageBonus / 100)`

---

## 8. Guide for Future AI Agents & Developers

When assigned tasks on this game client:
1. **Never edit the original bundles in `source/` directly.** Treat them as reference data.
2. **Consult [ASSET_INDEX.json](ASSET_INDEX.json)** to find exact function locations and minified names using 0-based UTF-16 offsets.
3. **When implementing automation features or bots:** Study the `WorldScene-b_2tpaKT.js` auto-farm state machine documented in [CROSS_MODULE_ANALYSIS.md](CROSS_MODULE_ANALYSIS.md).
4. **When modifying UI or tooltips:** Reference `items-nDkzNEls.js` for key bindings and slot structures.
5. **When adding custom visual effects:** Reference `ChieuMau-CEtRLp-4.js` sprite catalog records in [modules/02_ChieuMau-CEtRLp-4.md](modules/02_ChieuMau-CEtRLp-4.md).

---

## 9. Source Verification Methodology

- All source files have zero-based UTF-16 code unit offsets documented.
- Module boundaries match ECMAScript standard import/export semantics.
- Integrity is backed by SHA-256 cryptographic hashes verified in [SOURCE_MANIFEST.json](SOURCE_MANIFEST.json).


## Restored original analysis evidence

The unified [ASSET_INDEX.json](ASSET_INDEX.json) now has **16,037 mixed-type lookup entries**. For complete raw metadata, per-module original function/dependency maps, or original source positions, navigate via [original_indexes/INDEX_REGISTRY.json](original_indexes/INDEX_REGISTRY.json) and [references/ORIGINAL_SYMBOL_LOOKUP.json](references/ORIGINAL_SYMBOL_LOOKUP.json). These original analysis records are preserved, **not automatically semantically verified**. Phaser original positions are code points; unified positions are UTF-16. Source anchors are not entire function ranges. See [RESTORATION_REPORT.md](RESTORATION_REPORT.md).
