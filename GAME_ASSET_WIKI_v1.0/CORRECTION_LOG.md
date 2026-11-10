# Correction Log — GAME_ASSET_WIKI_v1.0_CORRECTED

**Log Date:** 2026-11-10  
**Target Release:** `GAME_ASSET_WIKI_v1.0_CORRECTED.zip`  

---

### Record 01: Erroneous SHA-256 Values in Final Validation Report
- **Affected File:** `FINAL_VALIDATION_REPORT.md`
- **Component:** Section A (Source Integrity Table)
- **Original Problem:** The report contained SHA-256 prefixes that did not match the original JavaScript files (e.g., recorded `2c2dcfb87b` for Character instead of actual `854dbfbd61`).
- **Verified Source Evidence:** Re-computed SHA-256 hashes directly from raw bytes of all 10 files in `source/`.
- **Corrected Action:** Overwrote incorrect table with programmatic SHA-256 hashes matching `SOURCE_MANIFEST.json` and actual files.
- **Related Files Updated:** `FINAL_VALIDATION_REPORT.md`, `FINAL_CONSISTENCY_REPORT.md`.

---

### Record 02: Hallucinated tm-guard Functionality
- **Affected Files:** `modules/09_tm-guard.md`, `GAME_ASSET_WIKI_v1.0.md`, `FUNCTION_MAP.md`, `references/FEATURE_INDEX.json`
- **Component:** Security / Anti-Tamper Documentation
- **Original Problem:** Claimed existence of functions `guard_init`, `check_integrity`, prototype checking, and anti-debugger logic in `tm-guard.js`.
- **Verified Source Evidence:** Source code inspection revealed `tm-guard.js` is a simple WebSocket message listener for `{e: 'guard'}` events displaying a confirmation modal and rendering a mobile tribulation button. No integrity checking or anti-debugger code exists.
- **Corrected Action:** Removed hallucinated symbols; downgraded security claims to `[UNVERIFIED - UNKNOWN]`; documented actual functions: `out`, `show`, `close`, `tribButton`, `Wrapped`, `feed`.
- **Related Files Updated:** `modules/09_tm-guard.md`, `GAME_ASSET_WIKI_v1.0.md`, `FUNCTION_MAP.md`, `references/FEATURE_INDEX.json`, `TECHNICAL_CLAIM_AUDIT.md`.

---

### Record 03: Incorrect Character Function Mapping for `yi`
- **Affected Files:** `FUNCTION_MAP.md`, `modules/01_Character-DhQJ_Q0g.md`
- **Component:** Character Module
- **Original Problem:** Symbol `yi` was documented as an audio trigger dispatcher.
- **Verified Source Evidence:** `Character-DhQJ_Q0g(1).js` offset 18314 defines `class yi`, which manages local combat simulation (hero state, foes, skills, cooldowns, damage, and HP/Qi).
- **Corrected Action:** Updated role to "Local combat simulation engine" with comprehensive combat system breakdown.
- **Related Files Updated:** `FUNCTION_MAP.md`, `modules/01_Character-DhQJ_Q0g.md`, `TECHNICAL_CLAIM_AUDIT.md`.

---

### Record 04: Incorrect Character Function Mapping for `xi`
- **Affected Files:** `FUNCTION_MAP.md`, `modules/01_Character-DhQJ_Q0g.md`
- **Component:** Character Module
- **Original Problem:** Symbol `xi` was documented as an unarmed combat sequence generator.
- **Verified Source Evidence:** `Character-DhQJ_Q0g(1).js` offset 15350 defines `function xi(a,t)`, which calculates coordinate rotation from direction vectors: `540 + Math.cos(e)*a.x - Math.sin(e)*a.y`.
- **Corrected Action:** Updated role to "Direction-based coordinate transformation helper for character showcase".
- **Related Files Updated:** `FUNCTION_MAP.md`, `modules/01_Character-DhQJ_Q0g.md`, `TECHNICAL_CLAIM_AUDIT.md`.

---

### Record 05: Lost / Unresolved Source Locations in WorldScene & Character
- **Affected File:** `ASSET_INDEX.json`
- **Component:** Symbol Source Locations
- **Original Problem:** 2,025 WorldScene symbols and 28 Character data definitions had their ranges defaulted to `0–0` (`NOT_APPLICABLE`).
- **Verified Source Evidence:** The original WorldScene analysis archive contains exact AST declaration offsets for 922 classes and top-level variables. Character contains exact string literals for 18 weapon FX and 10 unarmed skills.
- **Corrected Action:** Restored 922 declaration offsets for WorldScene and 28 data literal offsets for Character. Boosted verified symbol count from 4,073 to 5,024. Eliminated misleading `NOT_APPLICABLE` classifications.
- **Related Files Updated:** `ASSET_INDEX.json`, `SYMBOL_VALIDATION_REPORT.md`.

---

### Record 06: Decoupling of Symbol Confidence Dimensions
- **Affected File:** `ASSET_INDEX.json`
- **Component:** Confidence Metadata Schema
- **Original Problem:** Index lacked separated confidence dimensions, marking unverified locations as CONFIRMED.
- **Corrected Action:** Added explicit fields `symbol_confidence`, `semantic_confidence`, `location_confidence`, and `relationship_confidence` across all 8,526 records.
- **Related Files Updated:** `ASSET_INDEX.json`, `SYMBOL_VALIDATION_REPORT.md`.

---

### Record 07: Source Line Count Discrepancy
- **Affected File:** `MERGE_REPORT.md`
- **Component:** Source Statistics Table
- **Original Problem:** Stated total physical lines was 25, while actual count across 10 files was 1,845.
- **Verified Source Evidence:** Raw newline character calculation (`b'\n'`) across the 10 source files confirmed 1,845 lines.
- **Corrected Action:** Corrected line count in `MERGE_REPORT.md` to 1,845 with an explanatory note.
- **Related Files Updated:** `MERGE_REPORT.md`, `FINAL_CONSISTENCY_REPORT.md`.
