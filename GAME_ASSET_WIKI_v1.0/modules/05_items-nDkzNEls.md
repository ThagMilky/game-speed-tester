# Module 05 — Items (`items-nDkzNEls.js`)

## A. Identity
- **Original Filename:** `items-nDkzNEls.js`
- **Source Package:** `GAME_ASSET_WIKI_v1.0_items-nDkzNEls.zip`
- **Byte Size:** 18028 bytes
- **UTF-16 Code Units:** 16097
- **Line Count:** 14
- **SHA-256:** `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343`
- **Module Type:** ES Module
- **Primary Responsibilities:**
  1. Item metadata registry and category definitions (equipment, consumables, quest items, gems).
  2. Inventory UI controls, hotkey bindings, slot click/drag interactions.
  3. Item icon atlas lookup and sprite rendering pipeline.
  4. Tooltip layout and stat comparison against equipped items.

### Imports
- `./trangbi-iyUH-plT.js`: 40 imported bindings (gear stat tables, item categories, weapon types).
- `./index-BIkbGDKp.js`: `{d as p}` (DOM helpers and theme constants).

### Exports
Exports 15 named symbols: `M as C, qn as a, K as b, Nn as c, Ln as d, Cn as e, In as f, N as g, H as h, j as i, Hn as j, Dn as k, Mn as l, jn as m, an as n`.

---

## B. Architecture
### Major Subsystems
1. **Item Definition Catalog:** Structured records mapping item IDs to names, rarity, icons, descriptions, stack sizes, and sale prices.
2. **Inventory Input Handler:** Intercepts left-click (use/equip), right-click (context menu / drop), and drag-and-drop to swap slots.
3. **Icon Rendering Pipeline:** Calculates sprite sheet offsets based on item category and icon index.
4. **Item Comparison Engine:** Computes differential stats (+HP, +Def, +Atk) between hovered inventory item and currently worn equipment.

---

## C. Technical Analysis
### Key Keybinding Map
- `M`: Keymap definition linking numeric and letter keys to hotbar action slots.
- `Cn`: Default keybinding configuration.

---

## D. Symbol Reference
| Symbol | Type | Role | Source Location | Confidence |
|---|---|---|---|---|
| `M` | Constant | Default hotkey and controls configuration | `items-nDkzNEls.js`: Line 1 | CONFIRMED |
| `Nn` | Function | Item icon renderer | `items-nDkzNEls.js`: Line 1 | CONFIRMED |
| `Cn` | Object | Inventory slot interaction manager | `items-nDkzNEls.js`: Line 1 | CONFIRMED |
| `N` | Function | Item comparison and tooltip builder | `items-nDkzNEls.js`: Line 1 | CONFIRMED |

---

## E. Cross-Module Integration
- Consumed by `WorldScene-b_2tpaKT.js` for rendering HUD inventory panels, equipment slots, and quick-use belt items.
- Depends on `trangbi-iyUH-plT.js` for item affix definitions and gear attributes.

---

## F. Limitations
- Does not authorize item trades, enhancements, or deletions; submits UI intention to server via `WorldScene`.

---
*For sub-module documentation, see: [modules/items/](items/).*
