# Game Source Reference

This directory contains game-source files used to verify implementation details. Wiki v1.0 is the navigation reference for locating relevant systems; its repository location is pending, so no link is provided here.

## Purpose

- Reference material for feature development, debugging, and code review.
- Not part of the Game Speed Tester extension runtime.
- Source files must not be modified unless explicitly requested.

## Documentation

Use Wiki v1.0 to locate the relevant game system, then inspect only the necessary source sections, imports/exports, and call sites. Do not bulk-read the bundles.

## Limitations

- Capture dates, source hashes, and compatibility with the live game have not been verified.
- Minified identifiers and hashed filenames may change between game builds.
- This source can support implementation verification, but client-side code does not establish server-authoritative behavior or prove runtime behavior.
- Filenames such as `WorldScene.js` or `index.js` may be aliases; treat them only as aliases requiring verification, not proof of identical content.
- These files are read-only reference material and are excluded from the extension runtime. For extension module ownership (e.g. `GSTFarmEvents`, `GSTFarmMap`, `GSTMapTravel`), read [CODEGRAPH.md](../CODEGRAPH.md).

## Available assets

- `Character-DhQJ_Q0g.js`
- `ChieuMau-CEtRLp-4.js`
- `index-BIkbGDKp.js`
- `items-nDkzNEls.js`
- `phaser-DRI6y8R5.js`
- `sim-CvoxXTtu.js`
- `tm-guard.js`
- `tm-direct.js`
- `trangbi-iyUH-plT.js`
- `WorldScene-b_2tpaKT.js`

## Usage guidelines

1. Use Wiki v1.0 to locate the relevant game system; its repository location is pending.
2. Inspect only the necessary source sections, imports/exports, and call sites; do not bulk-read bundles.
3. Cross-check implementation details against the source, without treating it as proof of runtime behavior or server acceptance.
4. Request updated source only when the available source is insufficient; follow [AGENTS.md](../AGENTS.md) for the current repository workflow.
5. Keep these files read-only and out of the extension runtime; do not modify or deploy them.
