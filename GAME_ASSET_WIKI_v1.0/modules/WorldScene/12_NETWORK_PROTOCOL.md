# Network interaction inventory and client/server boundaries

## Incoming dispatcher and events — CONFIRMED

`A3.onServer` message envelope key `t.t`: `joined`, `snap`, `profile`, `ranks`, `kt`, `market`, `error`. `A3.onSnap` consumes top-level `time`, `self`, `ents`, `gone`, `ev`. `A3.onEvent` dispatches `t.e`: `dmg`, `die`, `cast`, `level`, `chat`, `note`, `toast`, `node`, `fx`, `skill-tuning`, `gacha`, `codes`, `travel`, `emote`, `root`. Each literal is visible in the source at the indexed function ranges.

## Outgoing message forms — CONFIRMED

- Position: `{t:'move',seq,x,y,d,a}` via `A3.sendMove` [UTF-16 916506–916837, line 1143].
- Action: `{t:'action',action,arg,arg2}` via `A3.act` [UTF-16 860638–860745, line 1143].
- Skill: `{t:'skill',key,fx,fy}` or additional `ax,ay` via `A3.useSkill` [UTF-16 920349–923646, line 1143].
- Chat: `{t:'chat',text,ch}` via callback in `A3.create` [UTF-16 837210–850036, line 1143].

An AST-based **complete inventory of object literals passed to `.send(...)`** is embedded in `ASSET_INDEX.json` at `classes[].methods[].network_sends` and `top_level_declarations[].network_sends`. It is syntactic evidence, not evidence that every branch executes.

## Client action examples — CONFIRMED

`fish` cast/hook/hold/stop/rod/sell/trade; `craft` fish-pill recipes; `dosat`; `ranks`; `title-select`; `title-visible`; `harvest`; `travel`; `fasttravel`; `kt:truyentong:go`; `meditate`; `respawn`; `use`; `pickup`; and additional imported panel-specific actions. Search raw action-call arguments in the structured index to distinguish string literals from dynamic values.

## Remote interactions beyond the driver

- `fetch('data/fishing.json')`, `fetch('data/items/items-meta.json')`, `fetch('data/items.json')` in fishing UI.
- `fetch(baseUrl+'fx.json')` and texture file loading for FX; `fetch('fx-buff/atlas.json')` plus optional FX manifests.
- `A3.create` may `await Yd('data/'+map.groundFolder+'/manifest.json')`.
- Phaser loader requests for images/tiles, and browser `localStorage/sessionStorage` for UI preferences/navigation state.

**UNKNOWN:** `driver` transport type and endpoint, server-side validation, authentication, anti-cheat, authoritative world simulation, authoritative drop/catch/skill/quest calculations, and remote response latency guarantees. `driver.online` branches prove only presence of client mode checks.
