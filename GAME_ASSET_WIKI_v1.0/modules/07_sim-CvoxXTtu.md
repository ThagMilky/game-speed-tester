# Module 07 — Sim (`sim-CvoxXTtu.js`)

## A. Identity
- **Original Filename:** `sim-CvoxXTtu.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_sim-CvoxXTtu.zip`
- **Byte Size:** 705393 bytes
- **UTF-16 Code Units:** 681637
- **Line Count:** 2
- **SHA-256:** `8ddd24caae7b39e86a6525117ef6619bba015d4698e3d09b2177af465fab9dc7`
- **Module Type:** ES Module (Simulation Engine)
- **Primary Responsibilities:**
  1. Cultivation system: Linh Căn (spiritual root) breakthrough config (`xm`), quality table (`Dn`), and cost calculations (`c1`).
  2. Dan/pill constants and refinement mechanics (e.g., `Hs=30` Dan for Dịch Căn Đan).
  3. Client-side combat simulation, damage estimation, critical strikes, and status buffs.
  4. Spatial grid management, collision detection, quest state tracking, and realm/dungeon conditions.

### Imports
- `./trangbi-iyUH-plT.js`: 274 imported bindings (gear stat formulas, combat scaling tables).
- `./index-BIkbGDKp.js`: 9 imported bindings (settings, math utilities).

### Exports
Exports 263 named symbols: `rv as $, xm as A, $n as B, Dn as C, Tn as D, Hs as E, c1 as F, g1 as G, f1 as H, is as I, Yn as J, hy as K...`.

---

## B. Architecture
### Major Subsystems
1. **cultivation/simulation module (`modules/sim/COMBAT.md`):** Formulas calculating base damage, armor reduction, elemental resistance, critical chance, and dodge rates.
2. **Spatial Grid (`modules/sim/SPATIAL.md`):** 2D spatial hash grid partitioning entities into cells for O(1) nearby target lookups.
3. **Collision Engine (`modules/sim/COLLISION.md`):** AABB and circle-circle collision solvers.
4. **Fishing Engine (`modules/sim/FISHING.md`):** Evaluates water tile coordinates, rod quality, bait type, tension bar decay, and bite intervals.
5. **Realms & Rooms (`modules/sim/REALMS.md`, `ROOMS.md`):** Manages dungeon room clear conditions, wave spawners, and portal triggers.

---

## C. Technical Analysis
### Combat Prediction Algorithm
```text
Given attacker (Player) and defender (Monster):
  1. Effective Atk = BaseAtk + WeaponAtk * ScalingFactor
  2. Defense Reduction = DefenderDef / (DefenderDef + ConstantK)
  3. Raw Damage = Effective Atk * (1 - Defense Reduction) * SkillMultiplier
  4. Roll Critical: if (random() < CritRate) Damage *= CritMultiplier
  5. Apply Elemental Factor: (1 + ElementBonus - ElementResist)
  6. Return predicted damage for HUD pop-up
```

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `xm` | Array | Linh Căn breakthrough configuration table (pills, chance, luck) | `sim-CvoxXTtu.js`: ~char 24869 | CONFIRMED |
| `Dn` | Array | Spiritual root quality definitions (Phàm căn, weight, potency, atk, hp) | `sim-CvoxXTtu.js`: ~char 24328 | CONFIRMED |
| `Hs` | Constant | Numeric constant `30` — Dan required to refine Dịch Căn Đan | `sim-CvoxXTtu.js`: ~char 24987 | CONFIRMED |
| `c1` | Function | Clamped cost calculator `a => Math.max(20000, Math.min(400000, Math.floor(a)*400))` | `sim-CvoxXTtu.js`: ~char 25004 | CONFIRMED |

---

## E. Cross-Module Integration
- Heavily utilized by `WorldScene-b_2tpaKT.js` for auto-farm target selection, combat predictions, and navigation obstacle detection.
- Reads equipment stats from `trangbi-iyUH-plT.js`.

---

## F. Limitations
- Client simulation is strictly predictive. Final authoritative damage and loot generation occur on the game server.

---
*For sub-module documentation across all systems, see: [modules/sim/](sim/).*
