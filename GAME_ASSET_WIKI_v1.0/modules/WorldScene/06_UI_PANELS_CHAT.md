# UI, HUD, chat and settings

## UI management — CONFIRMED

`hv` [UTF-16 80983–86980, line 216]; `Z2` [UTF-16 378361–382071, line 413]; `ew` [UTF-16 399370–417077, line 524]; `nw` [UTF-16 422249–432187, line 577]; `Z5` [UTF-16 603066–607199, line 794]; `y4` [UTF-16 641069–642406, line 829]; `A3.openSettings` [UTF-16 936326–947935, line 1143].

`hv` is the modal manager: `show` optionally reuses an open panel, snapshots scroll offsets and focused control, preserves expanded `details` state, adds keyboard Escape and Tab focus trapping, and restores opener focus on close. `refresh` defers regeneration when the UI is being dragged, an input is focused, or within a recent touch/scroll window. `Z2` manages in-world prompts and dialog overlays. `Z5` builds menu groups for desktop/mobile and badge values. `y4` supplies inspection UI.

`ew` constructs action HUD: slot elements, HP/MP, boss/party, status icons, wallet, cooldowns, toast messages, death and respawn. It is wired by `A3.create` with callbacks (skill, pill, respawn, party invitation). `nw` controls chat view, tabs, send callback, active locations, filter and disconnect. `A3.create` wires `chat.onSend` into `{t:'chat',text,ch}`, and `onEvent('chat')` receives and renders text (normalized by `ta`). UI display is not proof of chat-server restrictions or delivery.

`A3.openSettings` covers controls, zoom/display, audio/FX, auto thresholds and related preferences. Local persistence keys can be found in `ASSET_INDEX.json` `storage_keys` for each method; keys are client-only. `bindKeys`, `initKeys`, `refreshKeyHints` support desktop keyboard/controller/touch input. `A3.backgroundAuto` background worker is separately documented.

## In-world messages and ranking/title UI — CONFIRMED

`A3.openRanks`, `showRanks` and `dv`/`Qs` build leaderboard and title-collection visuals from incoming state and imported title catalog. `Lv` is the announcement layer; `ew.note` and `ew.toast` display transient guidance. No leaderboard authority or award issuance is proven locally.

## DOM trust notes

Fishing and PvP UIs include explicit HTML escaping for user-visible strings. Other HTML templates are built from source data and helper functions: their safety depends on whether the input is escaped. This source-only pass does not assert vulnerability or fully verify DOM taint flows.
