# RESTORATION_REPORT — GAME_ASSET_WIKI_v1.0

Date: 2026-11-10  
Input: `GAME_ASSET_WIKI_v1.0_HANDOFF_FIXED.zip` plus 9 supplied original module ZIPs.  
Output: `GAME_ASSET_WIKI_v1.0_RESTORED.zip`.

## Scope and sources

- Exact JS sources: 10/10 files read-only, hashes checked against the `SOURCE_MANIFEST.json` baseline and all 9 original archives.
- Original specialist Markdown: **163/163** byte-identical to corresponding files in `modules/` (not modified).
- **9 original analysis packs**: `ASSET_INDEX.json`, `FUNCTION_MAP.md`, `DEPENDENCY_MAP.md`, independent README/progress, extra JSON and checkpoint artifacts copied **byte-for-byte** into `original_indexes/<slug>/` with a SHA-256 registry; no second JS copies or ZIPs.
- Central evidence navigation: `references/ORIGINAL_SYMBOL_LOOKUP.json` supports stable JSON pointers into all original indexes. Refer to `original_indexes/INDEX_REGISTRY.json`.

## Current aggregate index corrections

- Original aggregate: **8,526** indexed records. After restoration: **16,037** records (= 8,526 - 1,103 collapsed WorldScene records + 2,627 distinct AST nested functions + 5,987 Phaser sub-symbol anchors). These are mixed categories including catalog entries, **not 16,037 distinct callable functions**.
- WorldScene: **2,627/2,627** independently located nested functions now represented with original `nested:<n>` identifiers and source-backed AST ranges, including duplicate names. No assumed `called_by` edge from mere lexical nesting.
- Phaser: **1,625** internal module rows with ranges translated from code-point offsets to UTF-16; **473** module ranges changed; **5,987/5,987** named internal symbol anchors added at verified UTF-16 positions, with complete original module detail and **4,338 dependency-reference occurrences** retained in the original JSON. Anchor text is **not a full declaration range**.
- SIM: enriched **1471** unified symbols with original `calls` counts, `static_facts`, parent/parameters, initializer kinds and byte positions. Original raw index retains **263** export records and all special fields.
- Trangbi: enriched **678** symbols with original references, call categories, initializer data, topical links and byte/line positions. Original raw index retains all **247** top-level statement records.
- ChieuMau: linked **1701** aggregate entries to original symbol records; `ke` at offset zero now a verified **`var ke` string anchor**, not a falsely verified full declaration range. All specialized symbol metadata and **596** original sprite descriptions remain in original index. The prior aggregate 596 sprite metadata records are explicitly labeled `catalog_metadata` rather than additional code declarations.
- Index: replaced incorrect `WebSocket.send interception` entries with original `performance.now` in **6** aggregate call lists; restored literals/declared exports for 284 symbols. The timing call is documented only for the original bootstrap source; no such use is attributed to the guard shim.
- Character: added raw-index pointers to **45** aggregate records; copied weapon and unarmed-skill definition fields and method coordinates where identity was demonstrably matched. Original index retains all **22 exports**, **24 markers** and **10 path strings**.
- Items: enriched **31** unified symbols with detailed source coordinates; raw index retains all **41 `import_usage` records**, **22 `key_expressions`**, and **15 export aliases**.
- TM: all **70** strings now labeled `source_anchor`, not `declaration`; original location metadata and caveats preserved.
- Runtime filename mismatch: `Character-DhQJ_Q0g.js` in import text versus `Character-DhQJ_Q0g(1).js` in this collection, recorded as a **documentation alias**, not a proven runtime resolution.

## Validation

- Reproducible original companion and specialist document hashes: `references/PRESERVATION_BASELINE.json` (covers all 163 specialist documents).

- Baseline ZIP was extracted without source transformations. ZIP CRC and source hashes tested.
- Original indexes preserved byte-for-byte with SHA-256 registry. Original script/module document bytes compared directly against all nine source ZIPs.
- All expanded symbol IDs unique; all WorldScene nested UTF-16 ranges in file boundaries; every Phaser symbol anchor matches actual text after conversion to UTF-16.
- Extended the existing `tools/validate_wiki.py` to enforce original index hashes, pointers, counts, source anchors, and known regressions in addition to the prior structural checks.
- Final independent extraction, ZIP CRC, source SHA and validator are verified again against the assembled ZIP.

- Unified WorldScene class-to-method source locations now refer to the original 39 class AST definitions, preserving method boundaries and pointers.
- Current RELEASE_MANIFEST.json statistics were recomputed from 16,037 actual index records; original manifest statistics retained in `prior_release_symbol_statistics`.

## Limits / outstanding questions

- The nine original analysis indexes can contain their own historical mistaken interpretations; byte-for-byte preservation **does not certify their semantic correctness**. The previous targeted corrections in active wiki docs remain in place.
- 11 unproven/conceptual edges in `FUNCTION_GRAPH.json` remain `INFERRED` or `UNKNOWN`; no fabricated call edges.
- The original `ChieuMau.ke` source index has no full `end_exclusive`. Only the source anchor is verified; no AST-level complete range was invented.
- Phaser symbol offsets locate names, **not declaration ends**; original dependency-reference offsets retain original code-point convention.
- Historical reports preserve their original counts/claims. Older reports citing 8,526 entries describe the pre-restoration snapshot. The current count is **16,037**.
- No bundled JS was executed; client static evidence does not prove server behavior; no gameplay tests.

## Final package verification (independent extraction)

- ZIP CRC: **PASS** (all members) and no nested ZIPs.
- Byte-for-byte comparison of extracted files to the assembled working directory: **PASS**.
- Original JS SHA-256 after ZIP extraction: **10/10 PASS**.
- Specialist original Markdown hash verification: **163/163 PASS**.
- Preserved original companion files (raw analysis indexes, maps, progress, and README): **44/44 PASS**.
- JSON parse and evidence-pointer validation: **PASS**.
- Function-map records: **23** source range checks, **4** unchanged and **19** corrected.
- Updated validator from independently extracted ZIP: **7/7 structural/targeted checks passed**.

These are structural, static-source and integrity checks only, **not comprehensive semantic or game-runtime verification**.
