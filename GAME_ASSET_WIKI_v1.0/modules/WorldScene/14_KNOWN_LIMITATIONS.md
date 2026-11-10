# Unknowns, confidence levels and merge checklist

## Confirmed deliverables and scope

Complete original source included unchanged, UTF-16 and UTF-8 locations from an ECMAScript AST, every class and method indexed, top-level declarations indexed, named and anonymous nested callables indexed, imported aliases preserved, call-site samples/conditional expressions/constant comparisons extracted. Major client systems have narrative technical notes. No source modifications or live game validation.

## Cross-module unknowns to resolve on merge

1. `./index-BIkbGDKp.js`: shared definitions, input/helpers, world and route data, source of imported numeric/scene helpers.
2. `./items-nDkzNEls.js`: inventory metadata, item icons, control defaults, UI constants.
3. `./phaser-DRI6y8R5.js`: Phaser scene lifecycle, camera, loader and rendering APIs.
4. `./trangbi-iyUH-plT.js`: equipment/skills/visual and imported gameplay tables.
5. `./sim-CvoxXTtu.js`: simulation, skill definitions, collision/path or world helpers.
6. `./Character-DhQJ_Q0g.js`: rig, animations, mounts and sound effects.
7. `./ChieuMau-CEtRLp-4.js`: character proc and combat visuals.

External assets/manifests loaded at runtime (`data/fishing.json`, `data/items.json`, FX atlases, map/collision/ground manifests, image/audio spritesheets) are not bundled; their values cannot be reconstructed from this file. Some import module roles above are **INFERRED** from use sites, not verified implementations.

## Unverified behavior

- Authoritative server movement, anti-cheat, skill damage and crit, status effects, loot/crafting/economy, fishing RNG and rewards, safe-zone rules, PvP penalties, title awarding and quest unlocks.
- Actual client animation/FX, streaming, background auto tick behavior across browsers/devices, performance, and network reliability.
- Exact collision and navigation search algorithms when imported functions are used.

## Static analysis caveats

All `call_targets` are syntactic occurrences inside a function/method body, including callbacks that may execute asynchronously or never; this is **not** a dynamic stack trace or proof that calls always occur. `import_identifier_matches` are static identifier-name matches, not fully scope-resolved symbolic linking and may include shadowed local names. `condition` and comparison examples are capped for large functions; the original full code is preserved for complete audits. Anonymous callbacks are indexed by exact offset, but not individually narrated. For authoritative proof, examine servers and test actual runtime separately.
