# Module 02 — ChieuMau (`ChieuMau-CEtRLp-4.js`)

## A. Identity
- **Original Filename:** `ChieuMau-CEtRLp-4.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_ChieuMau.zip`
- **Byte Size:** 206820 bytes
- **UTF-16 Code Units:** 206820
- **Line Count:** 2
- **SHA-256:** `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f`
- **Module Type:** ES Module
- **Primary Responsibilities:**
  1. Visual skill effect engine and particle emitter management.
  2. Master sprite asset catalog (596 sprite entries with frame dimensions, rates, and anchor coordinates).
  3. Class-specific skill visual effect generators (Kiếm, Đao, Cung, Pháp, Quyền).
  4. Audio-visual timing synchronization for skill casting, projectiles, impacts, and area explosions.

### Imports
- `./phaser-DRI6y8R5.js`: `{P as ht}` (Phaser BlendModes, Vector2, particle emitters, sprite textures).
- `./index-BIkbGDKp.js`: `{f as ae, c as ne, R as Te}` (Client settings, particle density limits, audio helpers).
- `./Character-DhQJ_Q0g.js`: `{A as xo, e as Jt}` (Weapon motifs, grip coordinates).

### Exports
Exports 5 named symbols: `ye as C, Po as J, io as a, Vt as b, _e as c`.

---

## B. Architecture
### Major Subsystems
1. **Effect Engine (`ke` / `io`):** Core particle emitter, beam renderer, and circle/cone indicator pool.
2. **Sprite Asset Catalog (`sprite_assets`):** 596 sprite definition records defining sprite atlas frame widths, heights, total frame counts, and default animation FPS.
3. **Skill Visual Generators:**
   - Explicit skills (`modules/ChieuMau/04_EXPLICIT_SKILLS.md`): Authored high-tier skills with complex multi-stage animations.
   - Generated skills (`modules/ChieuMau/03_GENERATED_SKILLS.md`): Parametric skills generated from base geometry (projectiles, slashes, novas, auras).
4. **Class FX Systems:** Distinct visual identities for different character classes (physical weapon trails vs magic seals and elemental spheres).

---

## C. Technical Analysis
### Execution Flow: Visual Skill Trigger
```text
WorldScene skill-effect handling (conceptual event path; source scene methods include `A3.useSkill`, `A3.onServer`, `A3.onSnap`)
  → Calls ChieuMau::Po(skillId, casterX, casterY, targetX, targetY, params)
  → Queries sprite catalog for skillId
  → Configures emitter blend mode (usually BlendModes.ADD or SCREEN)
  → Allocates particle manager from pool
  → Launches projectile tween or attaches AOE emitter at target
  → Plays impact audio at contact timestamp
  → Emits onComplete event → Returns emitter to pool
```

### Sprite Catalog Specification
Sprites in ChieuMau define:
- `key`: Asset identifier (e.g. `eff_slash_01`, `fireball_nova_02`).
- `w`, `h`: Single frame dimensions in pixels.
- `frames`: Number of frames in animation.
- `fps`: Playback speed (commonly 15 to 30 fps).
- `anchor`: Normalized pivot point `(x, y)` for rotation and positioning.

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `io` | Function | Master skill FX spawn entry point | `ChieuMau-CEtRLp-4.js`: Line 1 | CONFIRMED |
| `Po` | Function | Skill registry dispatcher | `ChieuMau-CEtRLp-4.js`: Line 1 | CONFIRMED |
| `ye` | Object | Active particle pool manager | `ChieuMau-CEtRLp-4.js`: Line 1 | CONFIRMED |
| `Vt` | Class | Projectile trajectory simulator | `ChieuMau-CEtRLp-4.js`: Line 1 | CONFIRMED |
| `_e` | Object | Sound/FX synchronization table | `ChieuMau-CEtRLp-4.js`: Line 1 | CONFIRMED |

---

## E. Cross-Module Integration
- **Consuming Modules:**
  - `WorldScene-b_2tpaKT.js`: Imports `{J as Rc, C as $u}` from `./ChieuMau-CEtRLp-4.js`. Triggers visual effects during combat, monster attacks, level-ups, and buff activations.
- **Dependencies:**
  - Uses Phaser blend modes and particle managers.
  - References weapon grip coordinates from Character module.

---

## F. Limitations
- ChieuMau is purely a client-side visual renderer. It does not calculate actual damage numbers or decide whether a skill hits; it renders upon command from `WorldScene`.

---
*For sub-module documentation, see:*
- [00_OVERVIEW.md](ChieuMau/00_OVERVIEW.md)
- [01_EFFECT_ENGINE.md](ChieuMau/01_EFFECT_ENGINE.md)
- [02_SKILL_REGISTRY.md](ChieuMau/02_SKILL_REGISTRY.md)
- [03_GENERATED_SKILLS.md](ChieuMau/03_GENERATED_SKILLS.md)
- [04_EXPLICIT_SKILLS.md](ChieuMau/04_EXPLICIT_SKILLS.md)
- [05_ADDITIONAL_CLASS_SYSTEMS.md](ChieuMau/05_ADDITIONAL_CLASS_SYSTEMS.md)
- [06_SPRITE_CATALOG.md](ChieuMau/06_SPRITE_CATALOG.md)
- [07_AUDIO_TERRAIN_NETWORK.md](ChieuMau/07_AUDIO_TERRAIN_NETWORK.md)
