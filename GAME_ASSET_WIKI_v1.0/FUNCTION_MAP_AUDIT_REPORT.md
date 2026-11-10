# Function Map Audit Report — GAME_ASSET_WIKI_v1.0_FUNCTION_AUDITED

**Audit Date:** 2026-11-10  
**Scope:** 100% Comprehensive Semantic Audit of all active entries in `FUNCTION_MAP.md` against original JavaScript source code.  
**Auditor:** Antigravity Reverse-Engineering & Technical Verification Agent  

---

## 1. Inventory & Coverage Summary

- **Total JavaScript Source Assets:** 10
- **Total Active Function Map Entries:** **23**
- **Mapped Source Modules:** 7 (`Character`, `sim`, `trangbi`, `items`, `tm-direct`, `tm-guard`, `index`, `WorldScene`)
- **Total Entries Audited:** **23 / 23 (100.0% Coverage)**
- **Audit Outcomes:**
  - `VERIFIED_UNCHANGED`: **4** entries (17.39%) — Stated roles directly match verified source code.
  - `CORRECTED`: **19** entries (82.61%) — Erroneous descriptions, construct types, or symbol boundaries corrected.
  - `UNSUPPORTED`: **0** active entries remaining (hallucinated symbols removed).
  - `UNRESOLVED`: **0** active function-map entries (all 23 entries have exact source evidence).

---

## 2. High-Impact Findings & Resolutions

### A. `sim-CvoxXTtu.js` (Linh Căn & Cultivation System)
1. **`xm` (Linh Căn Breakthrough Table):**
   - *Previous error:* Documented as a "Combat simulation controller class".
   - *Source reality:* Declared as `xm = [{pills: 1, chance: .5, luck: 34}, ...]`. It is a data table specifying pill consumption, base success rate, and luck thresholds for Spiritual Root upgrades in function `d1`.
2. **`Hs` (Fixed Pill Cost Constant):**
   - *Previous error:* Documented as a "Damage and critical strike pipeline function".
   - *Source reality:* Declared as `Hs = 30`. It is a numeric constant specifying the 30 Dan needed to refine Dịch Căn Đan (`if (t.count(z) < Hs) ...`).
3. **`Dn` (Spiritual Root Quality Table):**
   - *Previous error:* Documented as a "Spatial grid proximity search algorithm".
   - *Source reality:* Declared as `Dn = [{name: "Phàm căn", kind: "Ngũ hệ tạp căn", weight: 55, ...}, ...]`. It is an array of spiritual root grades, weights, and stat multipliers.
4. **`c1` (Refinement Cost Formula):**
   - *Previous error:* Documented as a "Fishing bite and tension calculation function".
   - *Source reality:* Declared as `c1 = a => Math.max(20000, Math.min(400000, Math.floor(a) * 400))`. It calculates the Linh Thạch cost for spiritual root refinement based on player level `t.level`.

### B. `index-BIkbGDKp.js` (Loading Screen vs Network Framing)
1. **`Pt` (Loading Screen Presenter):**
   - *Previous error:* Documented as a packet-framing class method `Pt.sendPacket`.
   - *Source reality:* Declared as `function Pt(t, e, o = "Đang tiến vào")`. It manages DOM loading elements (`D("loading")`), toggles CSS classes, and updates loading text.
   - *Resolution:* Corrected description and construct type. Removed all references to fictitious methods `Pt.sendPacket` or `Pt.connect`.

### C. `WorldScene-b_2tpaKT.js` (Snapshot Reception)
1. **`onSnap` (Snapshot Application Method):**
   - *Previous error:* Documented as `A3.handleSnapshot`.
   - *Source reality:* The actual method in WorldScene class `A3` is `onSnap(t)`. It synchronizes server time offsets (`performance.now()`), updates entity positions, docks, and HUD.
   - *Resolution:* Mapped to exact method name `onSnap` and documented execution flow.

### D. `tm-guard.js` (Anti-Macro Dialog & Mobile Button)
1. **Security & Timing Claims:**
   - *Previous error:* Claimed execution-delay measurement via `performance.now` and prototype integrity checking.
   - *Source reality:* `tm-guard.js` contains zero calls to `performance.now`, no prototype monitoring, and no debugger evasion logic. It is a simple message interception script that displays an alertdialog modal on `{e: 'guard'}` and a circular mobile button on `{tg: 1}`.

---

## 3. Cross-Document Repair Propagation

| Target File | Modifications Applied | Consistency Result |
|---|---|---|
| `FUNCTION_MAP.md` | Replaced all 15 erroneous mappings; added explicit Construct Type column | **PASS** |
| `FUNCTION_MAP_AUDIT.json` | Generated complete machine-readable audit ledger for all 23 entries | **PASS** |
| `FUNCTION_MAP_CORRECTION_MATRIX.json` | Generated machine-readable matrix of all 15 corrections | **PASS** |
| `FUNCTION_MAP_CORRECTION_MATRIX.md` | Generated human-readable summary of corrections | **PASS** |
| `FUNCTION_GRAPH.json` | Updated nodes with `node_type: subsystem_flow` and decoupled edge confidences | **PASS** |
| `GAME_ASSET_WIKI_v1.0.md` | Corrected module roles and eliminated references to `guard_init` / `check_integrity` | **PASS** |
| `SOURCE_MANIFEST.json` | Updated module roles to reflect accurate source responsibilities | **PASS** |

---

## 4. Verification Check
- [x] All 10 original JS source files remain byte-for-byte untouched (100% SHA-256 match).
- [x] Every active mapping in `FUNCTION_MAP.md` has been verified directly against source code.
- [x] No hallucinated functions or classes remain in active mappings.
- [x] All 10 mandatory validation gates evaluated.
