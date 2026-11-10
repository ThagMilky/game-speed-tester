# Module 01 — Character (`Character-DhQJ_Q0g(1).js`)

## A. Identity
- **Original Filename:** `Character-DhQJ_Q0g(1).js`
- **Canonical Alias in Codebase:** `Character-DhQJ_Q0g.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_Character-DhQJ_Q0g.zip`
- **Byte Size:** 69360 bytes
- **UTF-16 Code Units:** 68304
- **Line Count:** 2
- **SHA-256:** `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1`
- **Module Type:** ES Module (minified production build)
- **Primary Responsibilities:**
  1. Directional player sprite rendering, frame selection, and posture animation (walking, idle, meditation, mount, fishing).
  2. Weapon visual presentation and attachment to character sprite bones.
  3. Authored weapon special effect definitions (18 weapon tiers, motif definitions, particle colors).
  4. Client-side unarmed combat showcase model (10 unarmed skill definitions).
  5. Audio playback engine integration for character movement and weapon swinging sounds.

### Imports
- `./phaser-DRI6y8R5.js`: `{P as dt}` (Phaser engine runtime, texture manager, sprite factories).
- `./trangbi-iyUH-plT.js`: `{ae as ce, ad as re, F as le, N as vt}` (Gear definitions, weapon slot IDs, stat constants).
- `./sim-CvoxXTtu.js`: `{cN as ue, j as Zt, cW as ft}` (Simulation state structures, entity coordinate transformers).
- `./index-BIkbGDKp.js`: `{aa as zt}` (Client settings, sound volume preferences).

### Exports
Exports 22 named symbols: `H as A, Yt as C, G as D, yi as T, ti as V, ki as W, xi as a, ii as b, ye as c, mt as d, ze as e, vi as f, wi as g, oi as h, at as i, wt as j, ri as k, li as l, ui as m, fi as n, ci as o, si as p`.

---

## B. Architecture
### Major Classes
- `at` / `G`: Character composite sprite controller, managing torso, head, mount, weapon, and shadow layers.
- `wt`: Weapon sprite anchor controller, dynamically offsetting weapon sprites based on current character animation frame and direction.
- `ri`, `li`, `ui`, `vi`: Directional animation controllers (North, South, East, West, diagonal transitions).
- `Ti` / `yi`: Character sound effect synthesizer and sample dispatcher.

### Internal Subsystems
1. **Directional Sprite FSM:** 8-directional frame selector mapping character orientation angles to sprite atlas sub-rectangles.
2. **Layer Compositor:** Depth-sorted rendering of body parts, hair, hat, clothing, handheld weapons, and mount entities.
3. **Weapon FX Registry:** 18 distinct weapon FX configurations defining color gradients, trail widths, emitter rates, and grip offsets.
4. **Showcase Combat Model:** 10 predefined unarmed skill action sequences including windup frames, contact frames, and recovery locks.

---

## C. Technical Analysis
### Execution Flow: Character Animation Frame Tick
```text
WorldScene update tick
  → Evaluates entity movement vector (dx, dy)
  → Computes facing angle (0 to 2*PI)
  → Maps angle to 8-directional frame index
  → Updates composite sprite layers (Body, Equipment, Weapon)
  → Checks movement speed threshold (> 0.1) → Plays step audio at interval
```

### Weapon FX Data Structure
Each weapon definition defines:
- `id`: Unique numeric or string identifier.
- `motif`: Elemental motif (e.g. Flame, Frost, Lightning, Shadow, Celestial).
- `tier`: Equipment progression tier (1 through 18).
- `grip`: Pivot offset `[x, y]` relative to character hand bone.
- `colors`: Particle trail hex colors `[primary, accent, glow]`.

### Audio Engine Flow
`Ti` listens to character animation events (`step`, `swing`, `cast`, `mount`). Checks volume from `index-BIkbGDKp.js` settings (`zt.sfxVolume`), determines spatial attenuation based on distance to main camera focus, and triggers Phaser sound instance.

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `G` | Class | Main Character visual controller | `Character-DhQJ_Q0g(1).js`: Line 1 | CONFIRMED |
| `H` | Object | Weapon FX catalog & definitions table | `Character-DhQJ_Q0g(1).js`: Line 1 | CONFIRMED |
| `wt` | Class | Handheld weapon positioner | `Character-DhQJ_Q0g(1).js`: Line 1 | CONFIRMED |
| `yi` | Function | Audio trigger dispatcher | `Character-DhQJ_Q0g(1).js`: Line 1 | CONFIRMED |
| `xi` | Function | Unarmed combat showcase sequence generator | `Character-DhQJ_Q0g(1).js`: Line 1 | CONFIRMED |

---

## E. Cross-Module Integration
- **Consuming Modules:**
  - `WorldScene-b_2tpaKT.js`: Imports `{W as yu, w as Uy, h as Yy, p as Tn, c as ee, a as Ts, s as bf, m as Ph, T as Qy, b as Jy, V as vu, D as js, A as Yt, d as Zy, r as ku, C as ha, e as Eh, f as _e, g as wu}` from `./Character-DhQJ_Q0g.js`.
  - `ChieuMau-CEtRLp-4.js`: Imports `{A as xo, e as Jt}` from `./Character-DhQJ_Q0g.js`.
- **Note on Filename:** The source file on disk is `Character-DhQJ_Q0g(1).js`. Importers reference `./Character-DhQJ_Q0g.js`. Preserved as original per requirements.

---

## F. Limitations
- Unarmed skills defined here are local animation sequences only, not server combat damage calculations.
- Missing server verification of weapon FX legality (client renders whatever weapon tier is present in snapshot data).

---
*For detailed checkpoint analysis, see: [modules/Character/01_Character.md](Character/01_Character.md).*
