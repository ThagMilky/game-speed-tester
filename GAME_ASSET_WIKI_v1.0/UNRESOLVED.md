# UNRESOLVED — Registry of Unresolved Dependencies & Technical Gaps

Every issue listed below represents an architectural dependency, missing file, or server-side boundary that cannot be determined with complete certainty from the 10 supplied static JavaScript assets alone.

---

## Issue Registry

### UNRES-001: Missing External Vite Bundles (`boot` & `LocalDriver`)
- **Affected Module:** `index-BIkbGDKp.js`
- **Related Symbols:** `__vite__mapDeps`
- **Description:** `index-BIkbGDKp.js` contains dynamic import mappings pointing to `./boot-B_u-AwaO.js` and `./LocalDriver-DMfdN3Dc.js`. These files were not included in the supplied asset packages.
- **Existing Evidence:** Literal strings in `__vite__mapDeps`: `'./boot-B_u-AwaO.js'`, `'./LocalDriver-DMfdN3Dc.js'`.
- **Missing Evidence:** The actual JavaScript source bundles for `boot` and `LocalDriver`.
- **Impact on Wiki:** Minor. `boot` handles initial HTML splash loading, and `LocalDriver` is an offline mock driver. The online game client functions with the provided `WorldScene` and `index`.
- **Suggested Source Needed:** Upload `boot-B_u-AwaO.js` and `LocalDriver-DMfdN3Dc.js` if complete offline simulation or boot-chain analysis is required.
- **Confidence Status:** UNRESOLVED (External Asset).

---

### UNRES-002: Source Filename Alias for Character Module
- **Affected Modules:** `Character-DhQJ_Q0g(1).js`, `WorldScene-b_2tpaKT.js`, `ChieuMau-CEtRLp-4.js`
- **Related Symbols:** Static imports from `./Character-DhQJ_Q0g.js`
- **Description:** The source file provided in the archive is named `Character-DhQJ_Q0g(1).js` (with `(1)` suffix). Both `WorldScene-b_2tpaKT.js` and `ChieuMau-CEtRLp-4.js` import from `./Character-DhQJ_Q0g.js` (without `(1)`).
- **Existing Evidence:** SHA-256 hash `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1` matches checkpoint documentation exactly. All imported symbols (`W, w, h, p, c, a, s, m, T, b, V, D, A, d, r, C, e, f, g`) exist in the file.
- **Resolution in Wiki:** Preserved original filename `Character-DhQJ_Q0g(1).js` as required by Section 4. Linked canonical alias `./Character-DhQJ_Q0g.js` in `IMPORT_EXPORT_MAP.json` and `SYMBOL_ALIASES.json`.
- **Confidence Status:** CONFIRMED (Resolved via Alias Mapping).

---

### UNRES-003: Server-Authoritative Combat & Drop Logic
- **Affected Modules:** `sim-CvoxXTtu.js`, `trangbi-iyUH-plT.js`, `WorldScene-b_2tpaKT.js`
- **Related Symbols:** Combat / drop handling across the client; **not** `sim.xm` or `sim.Hs` (these are spiritual-root breakthrough table and constant `30`, respectively).
- **Description:** Client source contains combat-related calculations and loot logic, but authoritative online combat resolution, drop probabilities, critical-hit validation and anti-cheat enforcement cannot be established without server source. `sim.xm` and `sim.Hs` do not establish any of those mechanisms.
- **Existing Evidence:** Client sends action commands (`CAST_SKILL`, `PICK_UP`); entities update only upon receiving server snapshot deltas.
- **Missing Evidence:** Game server backend repository (Node.js / Go / Java / C#).
- **Impact on Wiki:** Documentation distinguishes client predictive formulas from authoritative server rules.
- **Confidence Status:** UNKNOWN (Server Implementation); client-side calculations are observable but not proof of server outcomes.

---

### UNRES-004: Binary WebSocket Opcode Catalog
- **Affected Module:** `index-BIkbGDKp.js`
- **Related Symbols:** `io.receive`, `eo.decode` (network and snapshot handling in `index-BIkbGDKp.js`); `Pt` only presents a loading overlay.
- **Description:** The client code in `io.receive` parses incoming messages and uses `eo.decode` for `snap2`. A complete, server-authoritative protocol schema, including any alternate message formats, is not available here.
- **Existing Evidence:** `class io` at UTF-16 offset 7274, its `receive(e,o)` method, and `class eo` with `decode` in `index-BIkbGDKp.js`.
- **Missing Evidence:** Server protocol buffer / schema definitions.
- **Confidence Status:** UNKNOWN (Missing server schema; no packet-tracing runtime test performed).

---

### UNRES-005: Historical tm-guard Debugger Evasion Claim *(Rejected by Source Review)*
- **Affected Module:** `tm-guard.js`
- **Related Symbols:** `check_integrity` and timing delta thresholds were **historical unsupported claims**, not actual identifiers or features in this script.
- **Original Description:** `tm-guard` executes timing checks to detect debugger pauses. Exact tolerance milliseconds may vary across client hardware.
- **Audit Finding:** **[UNSUPPORTED IN SUPPLIED CLIENT SOURCE]** The entire `tm-guard.js` contains no such function or timing check. The script implements WebSocket wrapping, guard challenge display with a one-second `setInterval` countdown, `guard-ok` forwarding, mobile tribulation button, and `window.__tmGuard.feed`. The presence of separate server-side checks is **UNKNOWN**.
  - `check_integrity`: String not found anywhere in `tm-guard.js` or `tm-direct.js`.
  - `debugger` keyword: Not present in either file.
  - Anti-debugging patterns (setInterval+debugger, toString tricks, eval, Function constructor, performance timing tricks): None detected.
  - This handoff rechecked the complete original `source/tm-guard.js` directly; no separate scratch file is required.
- **Confidence Status:** CONFIRMED ABSENT in supplied `tm-guard.js` for the named checks; UNKNOWN for any unseen server-side behavior.
