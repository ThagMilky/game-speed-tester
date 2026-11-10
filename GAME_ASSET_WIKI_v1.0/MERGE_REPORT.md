# MERGE_REPORT — Consolidation & Quality Verification Report

## 1. Executive Summary

The consolidation of `GAME_ASSET_WIKI_v1.0` has been executed successfully. All input packages have been audited, all 10 original JavaScript assets have been extracted and byte-verified with SHA-256 matching, and all independently produced analyses have been unified into a standardized technical reference.

---

## 2. Quantitative Verification Statistics

| Metric | Measured Value | Notes |
|---|---|---|
| Input ZIP packages processed | **9** | User confirmed `tm` and `guard` were merged into `tm_direct_guard.zip` |
| Original JavaScript source assets | **10** | All 10 expected assets accounted for |
| Total original source byte size | **3,623,626 bytes** | ~3.62 MB untouched minified JS (corrected by audit: original stated 3,623,626) |
| Total UTF-16 code units | **3,549,928** | Actual UTF-16 code units (7 surrogate pairs in phaser.js and WorldScene.js) |
| Total physical lines | **1,845** | Physical newline characters (\n) across all 10 assets (corrected from preliminary 25) |
| Source integrity verification | **10 / 10 (100%)** | All SHA-256 hashes match before & after extraction |
| Indexed unique symbols | **8,526** | Normalized across all modules in `ASSET_INDEX.json` |
| Cross-module import statements | **18** | Static ES module imports |
| Cross-module symbol aliases mapped | **932** | Documented in `IMPORT_EXPORT_MAP.json` & `SYMBOL_ALIASES.json` |
| Exported symbols documented | **688+** | Across all exporting modules |
| Primary module documents created | **10** | `modules/01_` through `modules/10_` |
| Preserved sub-module documents | **160+ files** | Full detail preserved across all subdirectories |
| Unresolved issues registered | **5** | Formal entries in `UNRESOLVED.md` |
| Conflicts resolved | **1** | Canonical alias for `Character-DhQJ_Q0g(1).js` |

---

## 3. Source Hash Verification Matrix

| Asset Filename | Byte Size | Source SHA-256 | Extracted SHA-256 | Verification |
|---|---|---|---|---|
| `Character-DhQJ_Q0g(1).js` | 69,360 | `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1` | `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1` | **MATCH (100%)** |
| `ChieuMau-CEtRLp-4.js` | 206,820 | `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f` | `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f` | **MATCH (100%)** |
| `WorldScene-b_2tpaKT.js` | 1,037,432 | `5d5ede1b50cdcebed76efae6fea1836f067fc61f153cab5b02eb3f8a7cb29d18` | `5d5ede1b50cdcebed76efae6fea1836f067fc61f153cab5b02eb3f8a7cb29d18` | **MATCH (100%)** |
| `index-BIkbGDKp.js` | 115,984 | `501ae57d733b2dd15554e606eb96352b4e6f1994e125890f32871dd411a78550` | `501ae57d733b2dd15554e606eb96352b4e6f1994e125890f32871dd411a78550` | **MATCH (100%)** |
| `items-nDkzNEls.js` | 18,028 | `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343` | `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343` | **MATCH (100%)** |
| `phaser-DRI6y8R5.js` | 1,205,225 | `5920a4fd5e79aa7f0f3f87a914b4591ba68a8a87a0f6a5c3d49005a870a5d7b1` | `5920a4fd5e79aa7f0f3f87a914b4591ba68a8a87a0f6a5c3d49005a870a5d7b1` | **MATCH (100%)** |
| `sim-CvoxXTtu.js` | 705,393 | `8ddd24caae7b39e86a6525117ef6619bba015d4698e3d09b2177af465fab9dc7` | `8ddd24caae7b39e86a6525117ef6619bba015d4698e3d09b2177af465fab9dc7` | **MATCH (100%)** |
| `tm-direct.js` | 5,362 | `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965` | `ac013042e8be620365ae650b48d4da80c40f0efa3ac9a2d061d74372f01a3965` | **MATCH (100%)** |
| `tm-guard.js` | 5,286 | `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47` | `4a9ef0f8ae1a11556ba4f3ef386de7bc0c76cf0fa32b97d5309db4dff9dada47` | **MATCH (100%)** |
| `trangbi-iyUH-plT.js` | 254,736 | `c591d321899db406ed7387c54c21e303582505396e6d815fe0441dcdc4f11cec` | `c591d321899db406ed7387c54c21e303582505396e6d815fe0441dcdc4f11cec` | **MATCH (100%)** |

---

## 4. Quality Validation Checklist

- [x] All 10 intended source assets accounted for and documented.
- [x] Original source files preserved untouched in `source/`.
- [x] SHA-256 hashes verified before and after extraction.
- [x] Each asset has a standardized module document in `modules/`.
- [x] Every documented import/export is mapped to its target module and declaration.
- [x] Unified symbol index `ASSET_INDEX.json` generated with 8,526 entries using UTF-16 0-based indexing.
- [x] Cross-module systems analyzed (`WorldScene`, `Auto-Farm`, `Combat`, `Snapshots`, `Security`).
- [x] All JSON files syntactically valid.
- [x] All internal markdown file links verified.

## Offset Convention Notes (Added by Audit)
- Many minified function symbols have char_start pointing to the `function` keyword rather than the identifier. This is an accepted convention for minified code.
- WorldScene module symbols have empty ranges (original analysis used a different schema).
- ChieuMau module has 774 symbols with empty char_end (binding declarations; name appears at char_start).
- See WIKI_AUDIT_REPORT.md for full statistics.
