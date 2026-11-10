# Function Map Correction Matrix — GAME_ASSET_WIKI_v1.0_FUNCTION_AUDITED

**Audit Date:** 2026-11-10  
**Scope:** Systematic verification of all active mappings in `FUNCTION_MAP.md` against original JavaScript sources.  
**Status:** 15 Corrections Resolved & Propagated Cross-Document  

---

## 1. Summary of Corrected Mappings

| Entry ID | Source Module | Symbol | Original Description | Actual Construct Type | Verified Technical Description | Status |
|---|---|---|---|---|---|---|
| **FM-0002** | `Character` | `wt` | Weapon grip offset calculator | Constant Array | Weapon directional frame index mapping array `[4,3,2,1,0,7,6,5]` | **RESOLVED** |
| **FM-0003** | `Character` | `yi` | Character audio sample trigger | Class | Local combat simulation engine (state, hero, foes, skills, HP/Qi, cooldowns, damage) | **RESOLVED** |
| **FM-0004** | `Character` | `xi` | Unarmed combat sequence generator | Function | Direction-based coordinate transformation helper for character showcase | **RESOLVED** |
| **FM-0005** | `Character` | `ri` | Directional frame angle mapper | Function | Directional sprite texture validator and frame binder | **RESOLVED** |
| **FM-0006** | `Character` | `li` | Directional frame angle mapper | Function | Texture frame cache lookup and dimension provider | **RESOLVED** |
| **FM-0007** | `Character` | `ui` | Directional frame angle mapper | Function | Frame coordinate scaler based on frame dimensions | **RESOLVED** |
| **FM-0009** | `sim` | `xm` | Combat simulation controller class | Constant Array | Linh Căn (Spiritual Root) breakthrough configuration table (pills, chance, luck) | **RESOLVED** |
| **FM-0010** | `sim` | `Hs` | Damage and critical strike pipeline | Number Constant | Fixed Dan required constant (`Hs = 30`) for refining Dịch Căn Đan | **RESOLVED** |
| **FM-0011** | `sim` | `Dn` | Spatial grid proximity search | Constant Array | Spiritual root quality definitions table (Phàm căn, Ngũ hệ tạp căn, weight, exp, potency, atk, hp) | **RESOLVED** |
| **FM-0012** | `sim` | `c1` | Fishing outcome calculation function | Arrow Function | Clamped cost calculator `a => Math.max(20000, Math.min(400000, Math.floor(a)*400))` for Linh Thạch root refinement | **RESOLVED** |
| **FM-0014** | `trangbi` | `mt` | Set bonus definitions (2/4/6 pcs) | Arrow Function | Set bonus color / affix attribute resolver `n => ui[yn(n)]` | **RESOLVED** |
| **FM-0016** | `items` | `Nn` | Inventory item icon renderer | Function | Keyboard key code to human-readable string mapper (e.g. 9: Tab, 13: Enter, 32: Space) | **RESOLVED** |
| **FM-0017** | `items` | `N` | Equipment stat comparison builder | Function | Item ID normalization and item definition lookup helper | **RESOLVED** |
| **FM-0022** | `index` | `Pt` | Outgoing command framing / Pt.sendPacket | Function | Loading screen overlay presenter `function Pt(t, e, o="Đang tiến vào")` | **RESOLVED** |
| **FM-0023** | `WorldScene` | `onSnap` | A3.handleSnapshot snapshot handler | Method | WorldScene snapshot handler method `onSnap(t)` updating entities, clocks, and scene state | **RESOLVED** |

---

## 2. Key High-Impact System Corrections

### 1. `sim-CvoxXTtu.js` Array & Constant Corrections
- **`xm`:** Previously hallucinated as a "Combat simulation controller class". The source code defines `xm=[{pills:1,chance:.5,luck:34},...]` which specifies breakthrough requirements for Linh Căn.
- **`Hs`:** Previously claimed to be a "Damage calculation function". The source code defines `Hs=30`, a numerical constant representing the 30 Dan needed to refine Dịch Căn Đan.
- **`Dn`:** Previously claimed to be a "Spatial grid search". The source code defines `Dn=[{name:"Phàm căn",...}]`, an array of spiritual root grades.
- **`c1`:** Previously claimed to be a "Fishing outcome evaluator". The source code defines an arrow function calculating Linh Thạch refinement costs based on level.

### 2. `index-BIkbGDKp.js` Networking Corrections
- **`Pt`:** Previously documented as a packet-sending networking class `Pt.sendPacket`. In reality, `Pt` is a loading screen UI function `function Pt(t,e,o="Đang tiến vào")` managing DOM overlay classes.
- **`Pt.connect` & `Pt.sendPacket`:** Removed completely from the function map as non-existent identifiers. Real networking is handled by native WebSocket wrappers.

### 3. `WorldScene-b_2tpaKT.js` Snapshot Handling
- **`onSnap`:** Corrected from the non-existent method name `A3.handleSnapshot` to the actual source method `onSnap(t)` in WorldScene class `A3`.

### 4. `tm-guard.js` Watchdog Cleanup
- Removed all active descriptions claiming execution-delay analysis via `performance.now` or prototype tampering detection.
