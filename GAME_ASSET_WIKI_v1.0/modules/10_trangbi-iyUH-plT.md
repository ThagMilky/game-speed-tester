# Module 10 — TrangBi (`trangbi-iyUH-plT.js`)

## A. Identity
- **Original Filename:** `trangbi-iyUH-plT.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_trangbi.zip`
- **Byte Size:** 254736 bytes
- **UTF-16 Code Units:** 237277
- **Line Count:** 4
- **SHA-256:** `c591d321899db406ed7387c54c21e303582505396e6d815fe0441dcdc4f11cec`
- **Module Type:** ES Module (Master Game Data & Formulas Engine)
- **Primary Responsibilities:**
  1. Master equipment registry (weapons, armor, helmets, boots, rings, necklaces, artifacts).
  2. Character level scaling and progression tables (level, HP scaling, hit rate scaling, exp formulas).
  3. Equipment set bonuses, affix generation rules, and gem socketing mechanics.
  4. Skill talent tree definitions, cooldown formulas, mana costs, and passive talent effects.
  5. Loot drop tables, item crafting recipes, shop inventories, and command dispatchers.

### Imports
- 0 static imports (foundational game balance database).

### Exports
Exports 388 named symbols: `Cl as $, _h as A, mt as B, Qu as C, pi as D, su as E, uu as F, Wu as G, zl as H, Kh as I, An as J, Ie as K...`.

---

## B. Architecture
### Major Subsystems
1. **Level & Combat Scaling (`modules/trangbi/01_level_and_combat_scaling.md`):** Progression milestones, HP curves, hit formulas.
2. **Sets & Affixes (`modules/trangbi/02_sets_and_affixes.md`):** Equipment set tiers (2-piece, 4-piece, 6-piece bonuses) and random affix pools (Prefix / Suffix).
3. **Weapons & Icons (`modules/trangbi/03_weapons_and_icons.md`):** Weapon base stats, damage ranges, attack speed, icon mappings.
4. **Skills & Talents (`modules/trangbi/06_skills_and_talents.md`):** Comprehensive skill definitions across all character disciplines.
5. **Crafting & Loot Tables (`modules/trangbi/04_attributes_upgrade_and_loot_tables.md`, `11_loot_crafting_and_inventory.md`):** Enhancement success rates, materials, monster drop tables.
6. **Command Dispatcher (`modules/trangbi/12_gear_command_dispatch.md`, `15_dispatch_cases.md`):** Evaluates equipment commands (equip, unequip, upgrade, socket).

---

## C. Technical Analysis
### Level Scaling Formula Table (`ji`)
```javascript
ji = {
  levels: [18, 60, 122, 198, 278, 364, 454, 544, 634, 724, 814, 904, 976],
  hp:     [1.561, 0.638, 0.375, 0.394, 0.452, 0.537, 0.667, 0.838, 1.056, 1.287, 1.632, 2.085, 2.706],
  hit:    [0.533, 0.220, 0.142, 0.139, 0.161, 0.175, 0.209, 0.268, 0.334, 0.388, 0.494, 0.652, 0.896]
};
```
- Defines non-linear scaling exponents across progression tiers. High-level curves feature accelerated HP scaling to counterbalance late-game weapon damage.

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `ji` | Object | Level, HP, and hit scaling formula arrays | `trangbi-iyUH-plT.js`: Line 1 | CONFIRMED |
| `Cl` | Object | Master equipment configuration object | `trangbi-iyUH-plT.js`: Line 1 | CONFIRMED |
| `mt` | Array | Set bonus definition catalog | `trangbi-iyUH-plT.js`: Line 1 | CONFIRMED |
| `Qu` | Object | Weapon attribute and tier matrix | `trangbi-iyUH-plT.js`: Line 1 | CONFIRMED |

---

## E. Cross-Module Integration
- Primary data supplier for:
  - `WorldScene-b_2tpaKT.js` (168 imported bindings).
  - `sim-CvoxXTtu.js` (274 imported bindings).
  - `items-nDkzNEls.js` (40 imported bindings).
  - `Character-DhQJ_Q0g(1).js` (4 imported bindings).

---

## F. Limitations
- Enhancement success rates recorded here are client display estimates; actual success/failure roll occurs on game server.

---
*For sub-module documentation across all 16 topics, see: [modules/trangbi/](trangbi/).*
