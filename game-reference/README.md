# Game Source Reference

This directory contains JavaScript source snapshots used for understanding the game's client-side implementation.

## Purpose

- Reference material for feature development, debugging, and code review.
- Not part of the Game Speed Tester extension runtime.
- Source files must not be modified unless explicitly requested.

## Documentation

See [GAME_ASSET_WIKI_v0.7.md](../GAME_ASSET_WIKI_v0.7.md) for asset descriptions, search anchors, and feature-to-source mappings.

## Limitations

- These files are snapshots captured on November 5–7, 2026.
- They may not match the currently deployed game version.
- Minified identifiers and hashed filenames may change between game builds.
- Client-side code does not establish server-authoritative behavior.
- `WorldScene.js` can be used to verify the native Auto Farm target picker, damage-event fields, and movement API for extension integration; do not infer live event availability or server acceptance from this snapshot. For extension module ownership (e.g. `GSTFarmEvents`, `GSTFarmMap`, `GSTMapTravel`), read [CODEGRAPH.md](../CODEGRAPH.md).

## Available assets

- `WorldScene.js`
- `index.js`
- `giftcodes-DtRLIkN2.js`
- `economy-BhEd6Dz4.js`
- `items-DiH_Rqzx.js`
- `phaser-DRI6y8R5.js`
- `tm-guard.js`
- `tm-direct.js`

## Usage guidelines

1. Read `GAME_ASSET_WIKI_v0.7.md` first.
2. Identify the relevant game system.
3. Read only the necessary reference files.
4. Cross-check implementation details against the source.
5. Request updated source only when the available snapshot is insufficient; follow [AGENTS.md](../AGENTS.md) for the current repository workflow.
6. Do not modify or deploy these files.
