# GAME_ASSET_WIKI_v1.0 — Auxiliary WebSocket & Guard assets

Scope: `tm-direct.js` and `tm-guard.js`, independently analyzed from the exact attached files. No previous wiki, versions, or runtime assertions are used. These are **non-minified classic IIFEs**; no minified symbols occur in the two inputs. All original bytes are retained in `source/` and SHA-256 hashes are in `ASSET_INDEX.json`.

## Merge contract

- `ASSET_INDEX.json`: schema, exact source anchors, line/column, 0-based Unicode character, UTF-16 code-unit and UTF-8 byte offsets, confidence.
- `modules/*.md`: per-file behavior, complete named-function walkthroughs, state machines, thresholds, caveats and evidence.
- `FUNCTION_MAP.md`: feature-to-function map.
- `DEPENDENCY_MAP.md`: external/global APIs, unresolved integrations, load-order dependencies.
- `ANALYSIS_PROGRESS.json`: status and unresolved issues for cross-asset merge.
- `source/`: untouched source files.

**Evidence tags:** `CONFIRMED` = directly present in code; `INFERRED` = reasoned from code, not execution-verified; `UNKNOWN` = requires other assets, deployment configuration, server or runtime investigation. No runtime tests were performed.

**Offsets:** 0-based Unicode codepoint `character_offset_0based` (Python indexing) and JavaScript UTF-16 code-unit `utf16_offset_0based`; `byte_offset_utf8_0based` is a byte offset. Columns/lines are 1-based. Symbols are indexed at exact occurrence anchors, not generated names. The source contains multibyte Vietnamese and punctuation; do not conflate offsets.

**Important:** The comments describe deployment intent and server behavior, not independent proof of those environmental facts. Neither file provides the server's implementation or authoritative game rules.
