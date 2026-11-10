# Final Function Map Validation Report — GAME_ASSET_WIKI_v1.0_FUNCTION_AUDITED

**Audit & Validation Date:** 2026-11-10  
**Build:** `GAME_ASSET_WIKI_v1.0_FUNCTION_AUDITED` (historical audit build; status totals reconciled in HANDOFF_FIXED)  
**Assessment Result:** Historical function-map review; the HANDOFF_FIXED validator and report give current structural validation results. Full semantic verification of every index entry is not implied.  

---

## 1. Mandatory Validation Gates Results

| Gate | Validation Focus | Acceptance Criteria | Result | Notes |
|---|---|---|---|---|
| **Gate 1** | Source Integrity | All 10 JS source files byte-for-byte unchanged | **PASS** | 10 / 10 match exact SHA-256 and byte sizes |
| **Gate 2** | Function Map Coverage | 100% of active function-map entries audited | **PASS** | 23 / 23 entries have verifiable audit records in `FUNCTION_MAP_AUDIT.json` |
| **Gate 3** | Known Incorrect Mappings | Specific reported errors repaired from source | **PASS** | `xm`, `Hs`, `Dn`, `c1`, `Pt`, `onSnap`, `tm-guard` fully repaired |
| **Gate 4** | Semantic Accuracy | No known incorrect mapping remains labeled confirmed | **PASS** | Construct types and roles reflect exact source behavior |
| **Gate 5** | Cross-Document Consistency | All corrections propagated across all active docs | **PASS** | `FUNCTION_MAP.md`, `FUNCTION_GRAPH.json`, `GAME_ASSET_WIKI_v1.0.md` synchronized |
| **Gate 6** | Function Graph Reliability | Confirmed graph edges backed by source evidence | **PASS** | Subsystem flow nodes typed; realistic confidence assigned |
| **Gate 7** | Statistical Consistency | Reported counts match underlying JSON exactly | **PASS** | All 23 entries match audit counts (4 VERIFIED_UNCHANGED, 19 CORRECTED); recalculated from FUNCTION_MAP_AUDIT.json |
| **Gate 8** | Structural Validation | Valid JSON, unique IDs, valid offsets | **PASS** | Automated validation script confirms 0 errors |
| **Gate 9** | Archive Integrity | Packaged ZIP extracted and tested independently | **PASS** | Extraction and full suite run on temporary directory passes 100% |
| **Gate 10** | Semantic Coverage Reporting | Explicitly states verified vs unknown scope | **PASS** | Clearly separates audited mappings from unreviewed minified helpers |

---

## 2. Source Asset Inventory & SHA-256 Hashes

| Asset Filename | Byte Size | UTF-16 Code Units | Computed Full SHA-256 Hash | Integrity |
|---|---|---|---|---|
| `Character-DhQJ_Q0g(1).js` | 69,360 | 68,304 | `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1` | **MATCH** |
| `ChieuMau-CEtRLp-4.js` | 206,820 | 206,820 | `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f` | **MATCH** |
| `WorldScene-b_2tpaKT.js` | 1,037,432 | 1,010,165 | `5d5ede1b50cdcebed76efae6fea1836f067fc61f153cab5b02eb3f8a7cb29d18` | **MATCH** |
| `index-BIkbGDKp.js` | 115,984 | 113,882 | `501ae57d733b2dd15554e606eb96352b4e6f1994e125890f32871dd411a78550` | **MATCH** |
| `items-nDkzNEls.js` | 18,028 | 16,097 | `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343` | **MATCH** |
| `phaser-DRI6y8R5.js` | 1,205,225 | 1,205,212 | `5920a4fd5e79aa7f0f3f87a914b4591ba68a8a87a0f6a5c3d49005a870a5d7b1` | **MATCH** |
| `sim-CvoxXTtu.js` | 705,393 | 681,637 | `8ddd24caae7b39e86a6525117ef6619bba015d4698e3d09b2177af465fab9dc7` | **MATCH** |
| `tm-direct.js` | 5,362 | 5,333 | `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965` | **MATCH** |
| `tm-guard.js` | 5,286 | 5,201 | `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47` | **MATCH** |
| `trangbi-iyUH-plT.js` | 254,736 | 237,277 | `c591d321899db406ed7387c54c21e303582505396e6d815fe0441dcdc4f11cec` | **MATCH** |
| **TOTAL** | **3,623,626** | **3,549,928** | **10 / 10 SOURCE FILES INTACT** | **PASS** |

---

## 3. Remaining Limitations

1. **Minified Engine Internals:** 1,625 third-party Phaser symbols and internal minified bindings remain categorized with `semantic_confidence: UNKNOWN`, as they represent third-party library machinery not mapped in the gameplay function architecture.
2. **Server-Side Authoritative Boundaries:** All formulas and behaviors documented are strictly client-side implementations. Server-side drop tables, anti-cheat enforcement, and authoritative combat resolution cannot be inspected from client-only assets.
