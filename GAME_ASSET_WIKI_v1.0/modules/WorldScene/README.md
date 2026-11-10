# GAME_ASSET_WIKI_v1.0 — WorldScene asset

**Source:** `source/WorldScene-b_2tpaKT.js` (untouched original; SHA-256 `5d5ede1b50cdcebed76efae6fea1836f067fc61f153cab5b02eb3f8a7cb29d18`).

**Scope:** independent source-only reverse reading of the complete JavaScript module. The parser successfully consumed the complete module, including dense minified regions. Source contains 1,037,432 UTF-8 bytes / 1,010,165 JavaScript UTF-16 code units, 39 classes, 554 class methods, 448 top-level function declarations or function-valued variables, 2627 nested function expressions/declarations (including callbacks), 593 imported bindings from 7 modules.

## Source location contract

All source locations in the JSON are **zero-based JS UTF-16 character offsets**, with **exclusive end**, plus UTF-8 byte offsets and one-based physical file lines. Use UTF-16 offsets when slicing in JavaScript; use byte offsets when slicing original file bytes. Minification compresses large methods onto a single line: *line number alone is not a reliable locator*. Exact symbol spellings (including `$`, uppercase and numerically suffixed aliases) are preserved. No deminified aliases are substituted for original code identifiers.

## Confidence semantics

- **CONFIRMED**: directly visible syntax/branches/formulas in this exact source.
- **INFERRED**: semantic role or runtime intention deduced from naming, call patterns, and state handling; not proven without the related module/runtime.
- **UNKNOWN**: data definition, module implementation, actual server validation, or runtime outcome unavailable from this file.

**Authority boundary:** The client formats commands, performs movement and skill prediction, renders snapshots and shows local UI. This is not proof of server acceptance, authoritative combat damage, reward payout, map collision truth, persistence, or anti-cheat behavior. `ik` and `ok` are local skill showcase simulators; their numeric damage is not evidence of combat-server calculations.

## Read order

1. `01_SCENE_LIFECYCLE_NETWORK.md`: scene entry, connection, snapshot/event handling, exit.
2. `02_MOVEMENT_NAVIGATION.md`, `03_COMBAT_SKILLS_TARGETING.md`, `04_AUTO_FARM.md`: high-impact game interactions.
3. `05_WORLD_ENTITIES_MAP.md`, `06_UI_PANELS_CHAT.md`, `07_FISHING_MEDICINE.md`, `08_PVP_RANKS_TITLES.md`.
4. `09_RENDERING_FX_ENVIRONMENT.md`, `10_QUEST_NPC_INTERACTION.md`, `11_INVENTORY_ECONOMY.md`.
5. `12_NETWORK_PROTOCOL.md`, `13_CLIENT_SIMULATORS.md`, `14_KNOWN_LIMITATIONS.md`.
6. `classes/*.md`: per-class, per-method source-location and static evidence catalogs.
7. `TOP_LEVEL_SYMBOLS.md`, `NESTED_FUNCTIONS.md`: function/variable inventories.
8. Root `FUNCTION_MAP.md` and `DEPENDENCY_MAP.md`: cross-asset merge lookup.

`ASSET_INDEX.json` is the machine-readable canonical index; markdown is explanatory and should not replace exact JSON ranges.

## Core export

`A3` [UTF-16 830957–1010139, line 1143] extends `et.Scene` (the `et` alias is imported from `./phaser-DRI6y8R5.js`) and is the sole named export as `WorldScene`.

## Methodological limitation

No game runtime, network connection, remote data files, browser UI, integration tests or server sources were executed. The only executable analysis was static ECMAScript parsing and offset/index construction. Static calls listed for a method include its nested inline callbacks; that does **not** imply execution on every invocation.
