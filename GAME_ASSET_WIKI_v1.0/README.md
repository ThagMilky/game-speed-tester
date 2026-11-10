# GAME_ASSET_WIKI_v1.0_COMPLETE

Welcome to the consolidated technical reference repository for the browser MMORPG game client.

This repository unifies ten independently analyzed JavaScript assets into an authoritative, cross-verified, and searchable technical reference.

---

## 1. Directory Structure

```text
GAME_ASSET_WIKI_v1.0_COMPLETE/
│
├── README.md                          # Repository guide and navigation instructions
├── GAME_ASSET_WIKI_v1.0.md            # Comprehensive master technical Wiki
├── ASSET_INDEX.json                   # Restored unified index of 16,037 entries
├── FUNCTION_MAP.md                    # System execution pathways and caller/callee map
├── FUNCTION_GRAPH.json                # Machine-readable function call relationships
├── DEPENDENCY_MAP.md                  # Inter-module import/export and dependency matrix
├── CROSS_MODULE_ANALYSIS.md           # Deep multi-module system execution analyses
├── UNRESOLVED.md                      # Registry of unresolved issues and external dependencies
├── MERGE_REPORT.md                    # Quantitative merge statistics and hash verifications
├── ANALYSIS_PROGRESS.json             # Consolidation completion status
├── SOURCE_MANIFEST.json               # Exact byte sizes, line counts, and SHA-256 hashes
│
├── source/                            # 10 untouched original minified JavaScript sources
│   ├── Character-DhQJ_Q0g(1).js
│   ├── ChieuMau-CEtRLp-4.js
│   ├── WorldScene-b_2tpaKT.js
│   ├── index-BIkbGDKp.js
│   ├── items-nDkzNEls.js
│   ├── phaser-DRI6y8R5.js
│   ├── sim-CvoxXTtu.js
│   ├── tm-direct.js
│   ├── tm-guard.js
│   └── trangbi-iyUH-plT.js
│
├── modules/                           # Standardized module specifications & deep submodules
│   ├── 01_Character-DhQJ_Q0g.md
│   ├── 02_ChieuMau-CEtRLp-4.md
│   ├── 03_WorldScene-b_2tpaKT.md
│   ├── 04_index-BIkbGDKp.md
│   ├── 05_items-nDkzNEls.md
│   ├── 06_phaser-DRI6y8R5.md
│   ├── 07_sim-CvoxXTtu.md
│   ├── 08_tm-direct.md
│   ├── 09_tm-guard.md
│   ├── 10_trangbi-iyUH-plT.md
│   └── (Character/, ChieuMau/, WorldScene/, index/, items/, phaser/, sim/, tm_direct_guard/, trangbi/)
│
└── references/                        # Machine-readable indexing and cross-reference maps
    ├── IMPORT_EXPORT_MAP.json         # Exhaustive cross-module import-to-export bindings
    ├── SYMBOL_ALIASES.json            # Minified-to-semantic identifier mapping
    ├── FEATURE_INDEX.json             # Feature-to-asset routing table
    └── ORIGINAL_ANALYSIS_MANIFEST.json # Package provenance and input audit metadata
```

---

## 2. Quick Navigation Guide

### For Human Developers
1. **High-Level Understanding:** Start with [GAME_ASSET_WIKI_v1.0.md](GAME_ASSET_WIKI_v1.0.md) for a complete system walkthrough.
2. **Feature Inspection:** Check the Feature Routing Matrix in Section 5 of the master Wiki or [references/FEATURE_INDEX.json](references/FEATURE_INDEX.json) to locate the exact module responsible for a game mechanic.
3. **Module Details:** Read the dedicated specification in `modules/01_` through `modules/10_`.
4. **Cross-Module Interactions:** Consult [CROSS_MODULE_ANALYSIS.md](CROSS_MODULE_ANALYSIS.md) and [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md).

### For AI Coding Agents
1. **Locating Symbols:** Query [ASSET_INDEX.json](ASSET_INDEX.json) using the exact minified name or semantic role. All locations use 0-based UTF-16 code units.
2. **Tracing Execution:** Inspect [FUNCTION_MAP.md](FUNCTION_MAP.md) and [FUNCTION_GRAPH.json](FUNCTION_GRAPH.json) for caller/callee graphs.
3. **Resolving Aliases:** When a symbol is imported under a minified alias, resolve its original definition in [references/IMPORT_EXPORT_MAP.json](references/IMPORT_EXPORT_MAP.json).
4. **Verifying Sources:** The original files in `source/` must remain untouched. Hashes are recorded in [SOURCE_MANIFEST.json](SOURCE_MANIFEST.json).


## Restored source-level indexes (2026-11-10)

This release preserves the **nine original analysis indexes** and their associated Function Maps, Dependency Maps, progress snapshots and package READMEs **byte-for-byte** in `original_indexes/<module>/`. The original JavaScript files and 163 specialist Markdown files were not modified.

Start with `ASSET_INDEX.json` for the unified view (**16,037 current entries**), `references/ORIGINAL_SYMBOL_LOOKUP.json` for source-qualified locations and JSON pointers, or `original_indexes/INDEX_REGISTRY.json` for source archives. Historical reports mentioning **8,526** entries describe the pre-restoration release, not this current index.

Entries marked `source_anchor` verify only source text, not whole AST declaration ranges or behavior. `Phaser` module positions have been converted from Unicode code-point offsets to UTF-16. Never interpret `Character-DhQJ_Q0g.js` and `Character-DhQJ_Q0g(1).js` as runtime-equivalent without deployment evidence; see `references/SOURCE_FILENAME_ALIASES.json`.

See `RESTORATION_REPORT.md` for exact checks and remaining uncertainty.
