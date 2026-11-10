# Cross-Document Correction Matrix — GAME_ASSET_WIKI_v1.0_RELEASE_CANDIDATE

**Audit Date:** 2026-11-10  
**Status:** ALL 6 CROSS-DOCUMENT ISSUES FULLY RESOLVED  

---

## 1. Summary of Cross-Document Resolutions

| Issue ID | Source Asset | Target Symbol / Claim | Erroneous Claim | Verified Source Behavior | Resolution Status |
|---|---|---|---|---|---|
| **ISSUE-001** | `Character-DhQJ_Q0g(1).js` | `yi` | Character audio sample trigger | Local combat simulation engine (state, skills, HP/Qi, cooldowns, damage) | **RESOLVED** (Updated across 5 files) |
| **ISSUE-002** | `Character-DhQJ_Q0g(1).js` | `xi` | Unarmed combat sequence generator | Direction-based coordinate transformation helper for character showcase | **RESOLVED** (Updated across 5 files) |
| **ISSUE-003** | `tm-guard.js` | `guard_init` | Watchdog startup routine & prototype validator | Nonexistent symbol in client source; IIFE standalone wrapper | **RESOLVED** (Removed across 7 files) |
| **ISSUE-004** | `tm-guard.js` | `check_integrity` | Periodic prototype & debugger validator | Nonexistent symbol and behavior; marked UNVERIFIED - UNKNOWN | **RESOLVED** (Removed across 7 files) |
| **ISSUE-005** | `tm-guard.js` | Module Role | Anti-Tamper Watchdog / Environment guard | Anti-macro challenge modal UI & mobile tribulation button handler | **RESOLVED** (Updated across 4 files) |
| **ISSUE-006** | All 10 Assets | Hashes & Lines | Erroneous SHA-256 prefixes; 25 lines reported | True SHA-256 matching source bytes; 1,845 physical lines confirmed | **RESOLVED** (Updated across 3 files) |

---

## 2. Detailed Verification by Issue

### ISSUE-001: Character `yi` Function Mapping
- **Source Declaration:** `Character-DhQJ_Q0g(1).js` at UTF-16 offset 18314 (`class yi`).
- **Verified Code:** Methods include `constructor`, `script`, `reset`, `reason`, `input`, `cast`, `heroAt`, `resolve`, `advanceTo`, `snapshot`. Manages hero state `{x:-95, y:0}`, foes `{hp:7000}`, cooldowns, skill execution, and combat resolution.
- **Propagation Check:** `FUNCTION_MAP.md`, `modules/01_Character-DhQJ_Q0g.md`, `TECHNICAL_CLAIM_AUDIT.md`, and `TECHNICAL_CLAIM_AUDIT.json` now completely agree. No file describes `yi` as an audio trigger.

### ISSUE-002: Character `xi` Coordinate Transformation
- **Source Declaration:** `Character-DhQJ_Q0g(1).js` at UTF-16 offset 15350 (`function xi(a,t)`).
- **Verified Code:** `const e=ke.indexOf(t)*Math.PI/4; return {x:540+Math.cos(e)*a.x-Math.sin(e)*a.y, y:470+(Math.sin(e)*a.x+Math.cos(e)*a.y)*xe}`.
- **Propagation Check:** Updated in all active mapping documents. No file describes `xi` as an unarmed sequence generator.

### ISSUE-003 & ISSUE-004: `tm-guard.js` Unsupported Symbols (`guard_init`, `check_integrity`)
- **Source Inspection:** Full AST and regex scans across `tm-guard.js` and `tm-direct.js` returned 0 matches for `guard_init`, `check_integrity`, or `debugger`.
- **Propagation Check:** Completely purged from confirmed listings in `GAME_ASSET_WIKI_v1.0.md`, `FUNCTION_MAP.md`, `modules/09_tm-guard.md`, `references/FEATURE_INDEX.json`. Retained in `UNRESOLVED.md` and audit logs solely as documented non-existent claims.

### ISSUE-005: `tm-guard.js` Module Purpose
- **Source Evidence:** Inspects WebSocket stream for `{e: 'guard'}` messages, builds DOM modal dialog with countdown timer, sends `{t: 'action', action: 'guard-ok'}`, and toggles circular mobile tribulation button on landscape mode.
- **Propagation Check:** Updated in `GAME_ASSET_WIKI_v1.0.md`, `SOURCE_MANIFEST.json`, `references/FEATURE_INDEX.json`, and `modules/09_tm-guard.md`.

### ISSUE-006: Statistics & SHA-256 Alignment
- **Source Evidence:** SHA-256 computed on raw file bytes; newline count verified at 1,845.
- **Propagation Check:** Synchronized across `MERGE_REPORT.md`, `FINAL_VALIDATION_REPORT.md`, `FINAL_CONSISTENCY_REPORT.md`, and `SOURCE_MANIFEST.json`.
