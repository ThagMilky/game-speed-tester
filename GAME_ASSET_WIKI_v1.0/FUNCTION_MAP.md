# Function Map — Cross-Module Symbol Architecture

This document maps game features to their verified JavaScript source constructs across all 10 assets.

## 1. Character & Animation Subsystem (`Character-DhQJ_Q0g(1).js`)

| Symbol | Enclosing Scope | Construct Type | Role | Callers / Triggers | Dependencies | Confidence |
|---|---|---|---|---|---|---|
| `at` | Class `Character` | Class | Composite character view container (clips, equipment, weapon, body layers) | Scene rendering loop | Phaser Sprite / Container | CONFIRMED |
| `wt` | Array `Character` | Constant Array | Weapon directional frame index mapping array `[4,3,2,1,0,7,6,5]` | Character animation frame updates | Direction indices | CONFIRMED |
| `yi` | Class `Character` | Class | Local combat simulation engine (state, hero, foes, skills, HP/Qi, cooldowns, damage) | Local battle showcase | Local Combat State | CONFIRMED |
| `xi` | Function `Character` | Function | Direction-based coordinate transformation helper for character showcase | Showcase rendering | Math Trigonometry | CONFIRMED |
| `ri` | Function `Character` | Function | Directional sprite texture validator and frame binder | Texture resolution | Phaser TextureManager | CONFIRMED |
| `li` | Function `Character` | Function | Texture frame cache lookup and dimension provider | Sprite frame setup | `Kt` Frame Cache Map | CONFIRMED |
| `ui` | Function `Character` | Function | Frame coordinate scaler based on frame dimensions | Texture scaling | `li` Dimension Provider | CONFIRMED |
| `vi` | Function `Character` | Function | Vector angle to 8-directional frame index mapper | Movement & mouse aim | Math.atan2 | CONFIRMED |

---

## 2. Shared Gameplay Simulation & Progress Subsystem (`sim-CvoxXTtu.js`)

| Symbol | Enclosing Scope | Construct Type | Role | Callers / Triggers | Dependencies | Confidence |
|---|---|---|---|---|---|---|
| `xm` | Module `sim` | Constant Array | Linh Căn (Spiritual Root) breakthrough configuration table (pills required, success chance, luck bonus) | Root upgrade calculation `d1` | `ss` Luck Threshold | CONFIRMED |
| `Hs` | Constant `sim` | Number Constant | Fixed Dan required constant (`Hs = 30`) for refining Dịch Căn Đan | Pill refining handler | Item counts | CONFIRMED |
| `Dn` | Module `sim` | Constant Array | Spiritual root quality definitions table (Phàm căn, Ngũ hệ tạp căn, weight, exp, potency, atk, hp) | Root evaluation `Gi`, `m1` | Quality table registry | CONFIRMED |
| `c1` | Function `sim` | Arrow Function | Clamped cost calculator `a => Math.max(20000, Math.min(400000, Math.floor(a)*400))` | Spiritual root refinement with Linh Thạch | Player level | CONFIRMED |

---

## 3. Equipment & Items Subsystem (`trangbi-iyUH-plT.js`, `items-nDkzNEls.js`)

| Symbol | Enclosing Scope | Construct Type | Role | Callers / Triggers | Dependencies | Confidence |
|---|---|---|---|---|---|---|
| `ji` | Table `trangbi` | Object Table | Level progression milestones, HP & stat threshold curves | Player stat calculation | Level brackets | CONFIRMED |
| `mt` | Function `trangbi` | Arrow Function | Set bonus color / affix attribute resolver `n => ui[yn(n)]` | Tooltip & gear rendering | Affix color matrix | CONFIRMED |
| `Qu` | Table `trangbi` | Object Table | Weapon attributes, material types, and visual effect colors table | Weapon inspector | Weapon tier matrix | CONFIRMED |
| `Nn` | Function `items` | Function | Keyboard key code to human-readable string mapper (e.g. 9: Tab, 13: Enter, 32: Space) | Keybinds settings UI | Key code table | CONFIRMED |
| `N` | Function `items` | Function | Item ID normalization and item definition lookup helper | Inventory item lookup | Item catalog `F` | CONFIRMED |

---

## 4. Network & Scene Subsystems (`tm-direct.js`, `tm-guard.js`, `index-BIkbGDKp.js`, `WorldScene-b_2tpaKT.js`)

| Symbol | Enclosing Scope | Construct Type | Role | Callers / Triggers | Dependencies | Confidence |
|---|---|---|---|---|---|---|
| `production` | Function `tm-direct` | Function | Domain host validator regex checking `nghichthienky.online` | `WebSocketShim` constructor | `location.hostname` | CONFIRMED |
| `WebSocketShim` | Function `tm-direct` | Function | Direct WebSocket constructor wrapper proxying game endpoints | Global socket instantiation | Native WebSocket | CONFIRMED |
| `show` | Function `tm-guard` | Function | Renders anti-macro guard alertdialog with countdown timer | In-band `{e: 'guard'}` event | Browser DOM / Modal | CONFIRMED |
| `feed` | Function `tm-guard` | Function | Fast WebSocket message parser for guard challenges & mobile tribulation | Socket `message` event | Stream JSON parsing | CONFIRMED |
| `Pt` | Function `index` | Function | Loading screen overlay presenter `function Pt(t, e, o="Đang tiến vào")` | Scene transition / Map loading | DOM loading element | CONFIRMED |
| `onSnap` | Method `WorldScene` | Method | WorldScene snapshot handler updating entities, clocks, and scene state | In-band `snap` message | Entity pools / Clock sync | CONFIRMED |


## Preserved original per-module maps (restored)

The complete original maps remain under `original_indexes/<module>/` and are not replaced by this overview:

- `WorldScene`: [`FUNCTION_MAP.md`](original_indexes/WorldScene/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/WorldScene/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/WorldScene/ASSET_INDEX.json).
- `phaser`: [`FUNCTION_MAP.md`](original_indexes/phaser/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/phaser/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/phaser/ASSET_INDEX.json).
- `sim`: [`FUNCTION_MAP.md`](original_indexes/sim/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/sim/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/sim/ASSET_INDEX.json).
- `trangbi`: [`FUNCTION_MAP.md`](original_indexes/trangbi/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/trangbi/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/trangbi/ASSET_INDEX.json).
- `ChieuMau`: [`FUNCTION_MAP.md`](original_indexes/ChieuMau/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/ChieuMau/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/ChieuMau/ASSET_INDEX.json).
- `index`: [`FUNCTION_MAP.md`](original_indexes/index/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/index/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/index/ASSET_INDEX.json).
- `Character`: [`FUNCTION_MAP.md`](original_indexes/Character/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/Character/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/Character/ASSET_INDEX.json).
- `items`: [`FUNCTION_MAP.md`](original_indexes/items/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/items/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/items/ASSET_INDEX.json).
- `tm_direct_guard`: [`FUNCTION_MAP.md`](original_indexes/tm_direct_guard/FUNCTION_MAP.md), [`DEPENDENCY_MAP.md`](original_indexes/tm_direct_guard/DEPENDENCY_MAP.md), [`ASSET_INDEX.json`](original_indexes/tm_direct_guard/ASSET_INDEX.json).
