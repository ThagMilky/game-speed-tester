# GAME_ASSET_WIKI_v1.0 — phaser-DRI6y8R5.js

Independent static analysis of the uploaded source. Original file is preserved byte-for-byte under `source/`. No earlier wiki or game versions used. No runtime tests performed.

## Scope and identification

**CONFIRMED**: This asset bundles the Phaser game framework; internal module `8054` declares `VERSION: "3.90.0"`. The top-level ESM exports are `Ot as P` and `Dt as p`; a bundled CommonJS-style module runtime uses local `t(number)` calls and the cache `ct`. This asset is not sufficient by itself to establish any game-specific combat, quest, item, character or server-authoritative logic.

## Source coordinates

All offsets are zero-based **Unicode character offsets** into the untouched UTF-8 decoded file, with `end_char_exclusive` as exclusive. Byte offsets are also given. `line` is 1-based; the source is predominantly minified and very long lines, so prefer character offsets. Example: Python `source[start_char:end_char_exclusive]`. Internal numeric module IDs are exact source spellings (including exponential notation, e.g. `96e3`).

## Classification

- `CONFIRMED`: directly located syntax, literals, dependencies and call sites in this asset.
- `INFERRED`: descriptive module purpose or potential runtime consequence inferred from names/code; not independently executed.
- `UNKNOWN`: game integration, environment-dependent behavior and external server mechanics.

## Artifact map

- `ASSET_INDEX.json`: module metadata, complete captured symbol index, offsets, dependencies, export links, counts and hashing.
- `FUNCTION_MAP.md`: feature-oriented quick lookup and selected execution paths.
- `DEPENDENCY_MAP.md`: module loader, exports, dependency graph and cross-asset unknowns.
- `modules/`: thematic notes plus per-module inventory of symbols and dependencies.
- `ANALYSIS_PROGRESS.json`: static-analysis status, coverage and limitations.

## Caveat

The index exhaustively enumerates **identified bundler module headers** using the unambiguous webpack-style ID patterns. Named functions, `name:function` methods, and constant-like keys are extracted statically; anonymous closures, computed property keys and other constructs may not have human-readable names. Exact names are never invented. `method` extraction is heuristic and may include property functions that are not class methods.
