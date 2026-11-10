# AI Source Lookup Guide — GAME_ASSET_WIKI_v1.0

This guide explains how an AI agent (ChatGPT, Gemini, Copilot, etc.) should efficiently navigate this Wiki to locate game source code.

## Recommended Lookup Order

1. **Start with architecture** — Read `GAME_ASSET_WIKI_v1.0.md` for the overall module map and game architecture.
2. **Find the feature** — Use `FUNCTION_MAP.md` to identify which module handles the feature you're investigating.
3. **Search the index** — Query `ASSET_INDEX.json` for the exact symbol name. Filter by `source_file` to narrow results.
4. **Read module docs** — Open the relevant `modules/<ModuleName>/*.md` file for detailed analysis and execution flows.
5. **Follow dependencies** — Use `DEPENDENCY_MAP.md` and `CROSS_MODULE_ANALYSIS.md` to trace cross-module calls.
6. **Open source only when needed** — Use `location.char_start` and `location.char_end` (UTF-16 offsets) to extract targeted ranges from `source/*.js`.

## Source Verification Rules

- Always verify the source SHA-256 from `SOURCE_MANIFEST.json` before relying on offsets.
- Use the **exact minified symbol names** from `ASSET_INDEX.json`.
- Symbol names are minified (e.g., `Wv`, `rk`, `sk`) — do not assume readable names exist.
- **Do not assume symbol names are stable** across game updates. Re-verify when the game is updated.
- Prefer symbols with `location.validation_status: "VERIFIED"` or `"CORRECTED"` over `"UNRESOLVED"`.
- Records with `validation_status: "NOT_APPLICABLE"` have no source range (e.g., exported aliases, anonymous functions at top level).
- **Distinguish client behavior from server authority** — this Wiki documents client-side JavaScript only. Server rules are not documented here.

## Confidence Levels

| `symbol_confidence` | Meaning |
|---|---|
| `CONFIRMED` | Symbol existence directly verified in source |
| `INFERRED` | Symbol likely exists based on indirect evidence |
| `UNKNOWN` | Insufficient evidence |
| `CONFLICT` | Contradictory evidence found |

| `location.validation_status` | Meaning |
|---|---|
| `VERIFIED` | Offset was checked against the original source |
| `CORRECTED` | Offset was repaired and re-verified |
| `UNRESOLVED` | Reliable offset could not be established |
| `NOT_APPLICABLE` | No source range exists for this record type |

## Minimal Files to Share With an AI Agent

### For general game architecture questions:
- `GAME_ASSET_WIKI_v1.0.md`
- `FUNCTION_MAP.md`
- `DEPENDENCY_MAP.md`

### For investigating a specific feature:
- `FUNCTION_MAP.md`
- Relevant `modules/<Name>/*.md` files
- Filtered subset of `ASSET_INDEX.json` (search by `source_file` or `symbol_name`)

### For verifying exact implementation:
- The original source file from `source/` (use the SHA-256 from `SOURCE_MANIFEST.json` to verify)
- The module documentation (`modules/*.md`)
- The verified symbol location from `ASSET_INDEX.json`

### For tracing cross-module execution:
- `CROSS_MODULE_ANALYSIS.md`
- `DEPENDENCY_MAP.md`
- `IMPORT_EXPORT_MAP.json` (in `references/`)

## Important Limitations

- This Wiki is a **snapshot** of the game at a specific version. It may become outdated after game updates.
- Approximately **2,054 symbol records** have `validation_status: "NOT_APPLICABLE"` (zero-range placeholders).
- Approximately **2,399 symbol records** have `validation_status: "UNRESOLVED"` (773 empty ranges + 1,626 whose ranges point to keywords in minified code rather than the identifier).
- **Server-side behavior** is not documented. Any claims about server validation, anti-cheat, or authoritative game state are marked `[UNVERIFIED]` or `UNKNOWN`.
- Original JS files are minified — symbol names are single-letter or short strings.

## Quick Reference: Key Source Files

| Source File | Size | Key Responsibility |
|---|---|---|
| `WorldScene-b_2tpaKT.js` | ~1.0 MB | Main game scene, rendering, game loop |
| `sim-CvoxXTtu.js` | ~705 KB | Game simulation, physics, mechanics |
| `phaser-DRI6y8R5.js` | ~1.2 MB | Phaser game engine library |
| `trangbi-iyUH-plT.js` | ~255 KB | Equipment/gear system |
| `ChieuMau-CEtRLp-4.js` | ~207 KB | Color/visual effects system |
| `index-BIkbGDKp.js` | ~116 KB | Main entry point, initialization |
| `Character-DhQJ_Q0g(1).js` | ~69 KB | Character classes and skills |
| `items-nDkzNEls.js` | ~18 KB | Item definitions |
| `tm-direct.js` | ~5 KB | WebSocket/network communication shim |
| `tm-guard.js` | ~5 KB | UI guard/anti-macro popup |


## Restored index lookup

For detailed, original module-level evidence, open `original_indexes/INDEX_REGISTRY.json` and navigate to the module `ASSET_INDEX.json`. Find a source-qualified symbol or offset in `references/ORIGINAL_SYMBOL_LOOKUP.json` (field `original_index` + `json_pointer`). `ASSET_INDEX.json` now lists **16,037 entries**. `source_anchor` means the anchor text is verifiable, not that its range is the full function. Treat statements in historical logs as historical, not reverified facts.
