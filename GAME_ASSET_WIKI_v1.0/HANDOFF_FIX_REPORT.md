# HANDOFF_FIX_REPORT — Targeted documentation repair

**Input:** `GAME_ASSET_WIKI_v1.0_FINAL_RELEASE.zip`  
**Output:** `GAME_ASSET_WIKI_v1.0_HANDOFF_FIXED.zip`  
**Scope:** Known inconsistencies only. The original JavaScript assets were read statically and **not executed or edited**. This is not a re-audit of all 8,526 indexed symbols.

## 1. Files modified

1. `GAME_ASSET_WIKI_v1.0.md` — replace wrong feature-to-symbol mappings and explicitly distinguish loading UI from networking.
2. `CROSS_MODULE_ANALYSIS.md` — correct `sim.xm`, use `A3.onSnap`, label the illustrative sequence as conceptual, and remove the unsupported guard prototype-monitor claim.
3. `DEPENDENCY_MAP.md` — remove the `tm-guard.js` execution-jitter assertion; describe actual WebSocket wrapping and guard countdown.
4. `UNRESOLVED.md` — correct `xm`, `Hs`, `Pt` references and historical unsupported guard claim; distinguish missing server evidence.
5. `modules/02_ChieuMau-CEtRLp-4.md` — stop presenting nonexistent WorldScene method names as literal identifiers.
6. `SOURCE_MANIFEST.json` — set all `utf16_length`, `utf16_code_units`, `total_utf16_chars` and `total_utf16_code_units` values to recomputed UTF-16 units; retain separately labeled Unicode code-point total.
7. `FUNCTION_MAP_AUDIT_REPORT.md` — recalculate current status counts and percentages.
8. `FINAL_FUNCTION_MAP_VALIDATION.md` — reconcile current audit-status counts and explicitly label original release assessment historical.
9. `FUNCTION_GRAPH.json` — verify all 14 node identities and 12 relationships; preserve useful conceptual links without fictional method declarations.
10. `tools/validate_wiki.py` — extend source, JSON, audit, graph, evidence-anchor and active-document regression checks.
11. `HANDOFF_FIX_REPORT.md` — this single handoff report (new).

No source `.js` was changed. Unrelated wiki/module documents remain unchanged.

## 2. Direct source evidence and corrections

- `sim-CvoxXTtu.js`: `xm` is a 4-entry spiritual-root breakthrough table (`pills`, `chance`, `luck`) at UTF-16 **24869**, read by `d1` and the root-upgrade action. It is not a combat controller. `Dn` is the root-grade data table at **24328**.
- Same source: `Hs=30` at **24987**, used to check/deduct material quantity while refining **Dịch Căn Đan**. It is not a damage function.
- Same source: `c1=a=>Math.max(2e4,Math.min(4e5,Math.floor(a)*400))` at **25004**, called with `t.level` in the `linhcan` refinement handler. It is not a fishing-result function.
- `index-BIkbGDKp.js`: `function Pt(t,e,o="Đang tiến vào")` at UTF-16 **69203** opens the loading interface. `class io` at **7274**, `io.receive` at **8271** and `eo.decode` handle client transport and incoming snapshot data.
- `WorldScene-b_2tpaKT.js`: `A3.onServer` handles `"snap"` by calling `A3.onSnap`; the actual `onSnap(t)` is at UTF-16 **897472**. `A3.update` at **1005385** directly invokes the `Q4` auto-farm controller's `update` (at **683805**).
- `tm-guard.js`: full original **5,286-byte** file inspected. No `performance.now`, `check_integrity`, prototype-monitor loop or debugger-evasion routine appears. The code wraps `window.WebSocket`, accepts guard events through `feed`, shows a timed `alertdialog`, forwards `guard-ok`, and displays a mobile tribulation control when state permits. Its `setInterval(paint,1000)` updates the countdown only.

These facts are statically observable in the supplied client code. No conclusion about unseen server implementation is claimed.

## 3. Function Graph audit

- **14 nodes:** **8 exact source symbols** (`io`, `io.receive`, `A3.create`, `A3.update`, `A3.onSnap`, `Q4.update`, `A3.useSkill`, `WebSocketShim`); **6 conceptual subsystem nodes** explicitly marked `conceptual_subsystem` and **not** asserted as JavaScript identifiers.
- **12 edges:** **1 `CONFIRMED` direct call** (`A3.update → Q4.update` from `this.auto.update(this.autoHost(),this.now(),n)`); **10 `INFERRED` conceptual flows**; **1 `UNKNOWN`** (`A3.useSkill → sim combat subsystem`, direct prediction request unverified).
- Replaced fictitious `WorldScene::onSnapshot`, `WorldScene::autoFarmLoop`, `WorldScene::castSkill`, `sim::simulateCombat` and analogous conceptual *method* labels with real identifiers or explicitly conceptual names. Edge-specific evidence and limitations are recorded in JSON. Graph evidence metadata supports traceability but does not by itself establish runtime semantics.

## 4. Recalculated statistics

| Check | Confirmed from included files |
|---|---:|
| Original source files | 10 |
| Total UTF-8 source bytes | **3,623,626** |
| Total UTF-16 code units | **3,549,928** |
| Total Unicode code points | **3,549,921** |
| Supplementary code points / extra UTF-16 units | **7** (WorldScene: 4, Phaser: 3) |
| Indexed symbols (structural inventory only) | **8,526** |
| Function-map audit records | **23** |
| `VERIFIED_UNCHANGED` / `CORRECTED` | **4 / 19** |
| `UNSUPPORTED` / `UNRESOLVED` (in this 23-record audit) | **0 / 0** |

The original manifest's `total_utf16_chars=3549921` represented **code points**, not UTF-16 code units, and was corrected. Per-file `utf16_length` has been made consistent with actual UTF-16 units; `total_unicode_code_points` retains the other count. The original reports' **8/15** breakdown did not match the audit records and has been corrected where presented as a current count.

## 5. Source preservation

The baseline was computed from the *input ZIP* before editing. After targeted corrections, all **10 original source files** remain byte-identical to that baseline (SHA-256 and byte counts). No extra `.js` source files were added or removed. The SHA-256 manifest values were independently checked against the source bytes.

## 6. Remaining unknowns

- Online combat, loot and anti-cheat enforcement remain **UNKNOWN** without server-side source/verification; client code does not prove authoritative behavior.
- The **10 inferred + 1 unknown** graph relationships remain conceptual or incompletely sourced; they must not be interpreted as a verified executable call graph.
- **8,526 symbols** are structurally indexed, **not** individually semantically verified by this handoff. No runtime/gameplay tests were performed.
- The legacy validation summaries are historical and should not be read as proof of current full semantic coverage.

## 7. Validation and archive result

- The updated validator checks all original file hashes/sizes and UTF-16 statistics, parses every JSON document, checks indexed source references and 23 audit ranges/statuses, looks for known active-document regressions, verifies source anchors for graph symbol nodes and source-backed direct calls, and checks required files/package layout.
- **Final output validation:** **PASS** — output ZIP CRC integrity, independent extraction, all 10 baseline source hashes, all JSON parsing, and **6/6** updated validator gates passed against the extracted archive. Only limited targeted semantic claims were source-reviewed; automated checks cannot prove full semantic accuracy.
