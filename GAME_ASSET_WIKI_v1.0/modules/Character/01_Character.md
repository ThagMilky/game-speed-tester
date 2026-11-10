# Module 01 — Character (GAME ASSET WIKI v1.0)

## Identity and confidence

- **Exact uploaded file:** `Character-DhQJ_Q0g(1).js`
- **Size:** 69,360 bytes; **SHA-256:** `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1`
- **Format:** minified ES module; 2 physical lines. All locations below use **zero-based Python character offsets** in the decoded UTF-8 source, *not byte offsets*.
- **Status:** **CONFIRMED** by inspecting the uploaded file's static implementation. No claims about currently live server behavior.
- **Scope:** This module implements character animation and held weapon presentation, authored weapon sprite effects, a local unarmed-combat showcase model, and an audio engine. It is not a server-authoritative combat engine.

## Imports

| Module | Imported → local aliases |
|---|---|
| `./phaser-DRI6y8R5.js` | `P → dt` |
| `./trangbi-iyUH-plT.js` | `ae → ce`, `ad → re`, `F → le`, `N → vt` |
| `./sim-CvoxXTtu.js` | `cN → ue`, `j → Zt`, `cW → ft` |
| `./index-BIkbGDKp.js` | `aa → zt` |

## Exports (complete)

| Export | Local symbol |
|---|---|
| `A` | `H` |
| `C` | `Yt` |
| `D` | `G` |
| `T` | `yi` |
| `V` | `ti` |
| `W` | `ki` |
| `a` | `xi` |
| `b` | `ii` |
| `c` | `ye` |
| `d` | `mt` |
| `e` | `ze` |
| `f` | `vi` |
| `g` | `ui` |
| `h` | `de` |
| `i` | `Bt` |
| `j` | `bi` |
| `k` | `wi` |
| `m` | `$t` |
| `p` | `xe` |
| `r` | `ri` |
| `s` | `ut` |
| `w` | `K` |

## Classes and method anchor index (all detected class bodies)

| Class | Top-level methods/getters/setters | Source character range |
|---|---|---|
| `ki` | `constructor(`, `static preload(`, `image(`, `glint(`, `render(`, `inspect(` | 5417–7716 |
| `Mt` | `constructor(`, `static bladeTip(`, `clear(`, `render(`, `inspect(`, `destroy(` | 8531–10821 |
| `nt` | `constructor(`, `get facing(`, `weaponLength(`, `static preload(`, `attack(`, `ensure(`, `render(`, `layers(`, `hide(`, `destroy(` | 11086–15124 |
| `yi` | `constructor(`, `script(`, `reset(`, `reason(`, `input(`, `cast(`, `heroAt(`, `resolve(`, `advanceTo(`, `snapshot(` | 18314–25428 |
| `Ge` | `constructor(`, `get listener(`, `extend(`, `extendPacks(`, `want(`, `ready(`, `cues(`, `init(`, `get muted(`, `get volumes(`, `setListener(`, `setVolume(`, `mute(`, `music(`, `play(`, `duck(`, `fadeGroup(`, `cast(`, `effect(`, `swing(`, `footstep(`, `hit(`, `pickup(`, `pickupGrade(`, `flushLoot(`, `unlock(`, `visibility(`, `save(`, `apply(`, `busLevel(`, `applyMusic(`, `stopVoice(`, `preload(`, `packClip(`, `loadPack(`, `load(`, `syncMusic(`, `makeDeck(`, `musicTick(`, `nextTrack(`, `startTrack(` | 28128–43045 |
| `ci` | `constructor(`, `get reach(`, `get kindId(`, `get look(`, `setLook(`, `hide(`, `sync(`, `layers(`, `destroy(` | 52440–57998 |
| `at` | `constructor(`, `get sourceScale(`, `get facing(`, `ghostLayers(`, `setWeaponLook(`, `syncHeld(`, `get weaponPoints(`, `get weaponLook(`, `get weaponSwing(`, `get weaponReach(`, `set showAnchors(`, `set holdDrawn(`, `fight(`, `armedAttack(`, `present(`, `get isRef(`, `unarmedSkill(`, `showUnarmed(`, `groundAnchor(`, `portraitFrame(`, `has(`, `hasDir(`, `clipTime(`, `get finished(`, `resolve(`, `stand(`, `play(`, `update(`, `standOn(`, `feet(`, `apply(` | 59120–68085 |

For exact individual method offsets, function offsets, weapon list and resources, see `ASSET_INDEX.json`. Identifiers are minified and may change per build.

## System A — weapon FX definitions and visual effects

- `K` starts with **18 authored weapon FX presets** created by `U(...)`, across `kiem-tu`, `co-su`, `ma-tu`. Each preset has ID, class, Vietnamese name/title/description, motif, tier, RGB colors, grip and size. Additional entries are generated at runtime from `ce.weapons` where rarity >= 3 for `kiem-tien`, `co-su`, `ma-tong`, `the-tu` (actual total depends on imported data).
- `pt` stores motif rotation by class, `Vt` contains overrides for named expansion weapon FX; `R` is color fallback by element/material and regex matching IDs.
- `ki`: Phaser spritesheet hit FX pool (16 images) plus Graphics sparks; `static preload` loads `/data/fx/weapon-attacks-v1/sprites/<id>.png` or `/data/equipment-expansion-v2/weapon-fx/<id>.png` for `ex-` IDs, frame 128×128. `render` uses elapsed phase, motif-dependent trajectories, hit frames and glints; `inspect` exposes active sprite count, shapes, pool size.
- `Mt`: rendered weapon trail using authored tip location and attack pose interpolation. `bladeTip` scans alpha pixels of held weapon image and caches in `WeakMap`. `render` creates shaded trail segments; `inspect` returns segments/colors.
- `nt` (exported via `mt`): armed body/hand/weapon composer. `static preload` loads `armed:catalog` JSON and held weapon icons. `ensure` lazy-loads body and weapon spritesheet by action; `render` selects clip/pose/direction, scale/flip/rotation, attack trail; supports an attack timestamp and weapon appearance mapping.
- `pe` maps classes to sword, scythe or monk-staff animation category; `Ht` stores eight named directions.

### Authored weapon definitions

| Asset | Name | Class | Motif | Tier |
|---|---|---|---|---|
| `bang-phach-kiem` | Băng Phách Kiếm | `kiem-tu` | ice | 1 |
| `cuu-tieu-kiem` | Cửu Tiêu Kiếm | `kiem-tu` | thunder | 1 |
| `tinh-ha-kiem` | Tinh Hà Kiếm | `kiem-tu` | stars | 1 |
| `do-than-kiem` | Đồ Thần Kiếm | `kiem-tu` | cross | 2 |
| `khai-thien-kiem` | Khai Thiên Kiếm | `kiem-tu` | cleave | 2 |
| `thai-at-tien-kiem` | Thái Ất Tiên Kiếm | `kiem-tu` | trinity | 3 |
| `u-diep-truong` | U Điệp Địch | `co-su` | butterfly | 1 |
| `thuc-tam-truong` | Thực Tâm Địch | `co-su` | bloom | 1 |
| `van-doc-truong` | Vạn Độc Địch | `co-su` | venom | 1 |
| `thien-tam-truong` | Thiên Tằm Địch | `co-su` | silk | 2 |
| `cuu-u-co-truong` | Cửu U Cổ Địch | `co-su` | beetles | 2 |
| `van-co-vuong-truong` | Vạn Cổ Vương Địch | `co-su` | royal | 3 |
| `huyet-nguyet-liem` | Huyết Nguyệt Liêm | `ma-tu` | moon | 1 |
| `minh-ha-liem` | Minh Hà Liêm | `ma-tu` | river | 1 |
| `pha-phach-liem` | Phá Phách Liêm | `ma-tu` | shatter | 1 |
| `cuu-u-tram-hon-liem` | Cửu U Trảm Hồn Liêm | `ma-tu` | chain | 2 |
| `diet-the-ma-liem` | Diệt Thế Ma Liêm | `ma-tu` | inferno | 2 |
| `thien-ma-doat-hon-liem` | Thiên Ma Đoạt Hồn Liêm | `ma-tu` | eclipse | 3 |

## System B — `yi` unarmed combat **local model**, not server authority

- `be`: **10 authored skills**; `we` defines basic attack (`gain=8`, cooldown .7s, contact .28s, base_damage=80). `ut(id)` resolves a skill entry.
- `kt`: five target coordinates; `z`: max hero HP **1400**, enemy HP **7000**; instance `yi.reset()` initializes hero HP **1050**, qi to **40** (free mode) or **100** (scripted mode).
- Modes: `free` (manual inputs), `combo` (scripted), or specific skill showcase; `script()` plans timestamps; `advanceTo(t)` evaluates at **60 ticks/second**, resolves action/hit queue sorted by hit time, and optionally applies incoming mob damage every **120 ticks**.
- State includes `hp`, `qi` (Thánh Huyết), `hero`, `foes`, `shield`, guard/boost/echo/lotus timers, cooldowns, lock, events, pending actions, damage and healing statistics.
- `reason` blocks invalid targets, dead hero, action lock, cooldown, insufficient qi and attacks at dead foes; `input` inserts a manual action; `cast` charges resources, schedules contact hits, sets cooldown and effects; `resolve` applies mock combat effects; `snapshot` returns presentation state and aggregate damage.
- Model mechanics: basic attack gain 8 qi; `ba-quyen` 3 hit timings .38/.65/.94, last hit can break armor for 4s; `luc-dao` six hits at .65/.90/1.15/1.40/1.65/1.90; `thanh-the` shield 400 and 40% reduction 5s; `bao-son-an` stuns 1.5s; `dau-tu-bi` gives 3 echo charges (45%) within 8s; `giai-tu-bi` boosts outgoing damage ×1.6 for 6s; `gia-tu-bi` schedules 5 heals of 80 HP; `thanh-lien` schedules six periodic hits and positional healing.
- Local damage: base damage × boost × (target armor-broken ? 1.15 : 1), capped at enemy remaining HP. Local gain from hitting adds `gain / (ba-quyen?3:1)` with +20% if `pieces>=3`, capped at 100. Incoming base damage 160 per 2 seconds, mitigated by guard/lotus and shield; effects and incoming flow are local to `yi`.
- **Critical scope:** This file contains a self-contained 2D simulation/presentation model. None of its numbers are verified as the online server's damage or skill rules.

### Skill entries from `be` (literal config)

| ID | Name | Cost | Gain | CD (s) | Contact (s) | Lock (s) | Base damage |
|---|---|---:|---:|---:|---:|---:|---:|
| `ba-quyen` | Bá Quyền | 0.0 | 24.0 | 3.0 | 0.38 | 1.3 | 110.0 |
| `hanh-tu-bi` | Hành Tự Bí | 0.0 | 14.0 | 7.0 | 0.45 | 0.95 | 140.0 |
| `thanh-the` | Hoàng Kim Huyết Khí | 20.0 | 0.0 | 12.0 | 0.5 | 1.0 | 0.0 |
| `bao-son-an` | Bão Sơn Ấn | 25.0 | 0.0 | 9.0 | 1.15 | 1.7 | 360.0 |
| `luc-dao` | Lục Đạo Luân Hồi Quyền | 60.0 | 0.0 | 15.0 | 0.65 | 2.4 | 110.0 |
| `dau-tu-bi` | Đấu Tự Bí | 20.0 | 0.0 | 18.0 | 0.45 | 0.9 | 0.0 |
| `giai-tu-bi` | Giai Tự Bí | 30.0 | 0.0 | 22.0 | 0.55 | 1.0 | 0.0 |
| `gia-tu-bi` | Giả Tự Bí | 25.0 | 0.0 | 18.0 | 0.55 | 1.0 | 0.0 |
| `thanh-lien` | Hỗn Độn Chủng Thanh Liên | 35.0 | 0.0 | 20.0 | 0.75 | 1.2 | 55.0 |
| `thien-de-quyen` | Thiên Đế Quyền | 80.0 | 0.0 | 28.0 | 1.8 | 2.6 | 950.0 |

## System C — global sound service `Ge` / singleton `H`

- `Ge` wraps Web Audio and HTML audio. Instantiated as singleton `H=new Ge` (exported `A`). Audio is started after user gesture via `unlock`, allocates **24** sound voices, stereo pan/filter per voice if available, compressor, master/sfx/music buses.
- `init` fetches `data/audio/audio.json`; `extend` loads a module-specific `sfx.json`; `extendPacks` loads `am.json` cue packs, aliases and class-group mappings. `loadPack`, `packClip` support decoded pack + offset/duration cues. Cache maps include `clips`, `loading`, `packLoads`, `packFile` and class audio packs.
- `play` handles cooldown, random variants, pitch/gain variation, priority voice reuse, 2D listening distance and panning, sound categories, audio ducking and delayed playback. Audible range uses `Se=3` through `xt=18` with distance smoothstep. Groups: `mine`, `others`, `mob`, `env`, `ui`.
- User settings saved under `tm-audio`: master .8, music .35, sfx .8, others .8, muted false. URL `mute=1`; URL `silent=1` persists `kt-silent` in sessionStorage. Hidden-tab visibility suspends/resumes AudioContext.
- Music uses **two** HTMLAudioElement decks, Web Audio gains, track switching and crossfade (2.5s), with ducking for prominent SFX.
- `ze`: skill/class audio service: `init`, `want`, `lay`, `crit`, `cast`, `hit`; mapping `Ye` holds many skill ID-to-motif/SFX mappings; `Bt` resolves mapping by skill and class. `ze.cast` stores a temporary cue-state in `yt` keyed by caster, later `ze.hit` plays matched impact cues.
- `ti`: weapon sound service with `want`, `vung` (swing), `trung` (hit), keyed by weapon sound family; `ii` maps the current weapon look to an audio family using imported `Zt`.
- `Ge.hit`, `Ge.cast`, `Ge.swing`, `Ge.pickup`, `Ge.pickupGrade`, `Ge.footstep` provide higher-level sound events; `stats` tracks played/rejected/stolen events.

## System D — held weapon attachments and sprite animation

- `ie(scene,kind)` asynchronously loads `kt-vukhi/<kind>.json` and `<kind>.png` into sprite textures; `si(skin)` fetches anchor data under `kt-vukhi/anchors/` or `kt-skins/<skin>/anchors.json`, caches flattened anchor coordinates.
- `ci` (exported local `bi`): held-weapon composition and orientation with main/glow/halo/offhand sprites and six additive spark rectangles. `setLook` resolves weapon kind/tier from imported `Zt`, loads art, and chooses corresponding sound set. `sync` positions and animates the weapon using pose anchors. Fields `points` give hand/tip/angle diagnostics; `swing` records motion.
- `ri` adds Phaser texture frame sliced from image metadata; `li` computes visible alpha-body height with cache; `ui` computes sprite scale as `targetHeight * 32 / max(1, bodyHeight)`; `vi` converts a (dx,dy) vector to one of eight directional indices. `G` lists all eight directions, `wt` mirror fallback.
- `at` (exported via `Yt`): character sprite animator/controller. Creates clip map, remaps weapon-alternate animation clips, builds derived fishing animation clips, caches ground/sole calculations, supports mounted poses, hit/skill animations, meditating, held-weapon layers, clip playback and direction fallback.
- `at.play` and `at.update` manipulate texture frame and animation timing; `at.showUnarmed` is presentation timing of unarmed skill; `at.present` synchronizes visual pose and held weapon. No network commands or server damage are defined by these methods.

## Dependencies and unresolved links

- `trangbi-iyUH-plT.js`: `ce` supplies equipment/weapon metadata; `re` supplies held items; `le` supplies weapon image URL; `vt` supplies weapon catalog. Exact symbol definitions pending that file.
- `sim-CvoxXTtu.js`: `ue` skill/contact data for `Ze`; `Zt` resolves held weapon item metadata; `ft` sprite target heights. Exact semantics pending.
- `index-BIkbGDKp.js`: `zt` gives alternate animation aliases. Exact caller and initialization pending.
- `phaser-DRI6y8R5.js`: runtime Graphics, spritesheets, textures, input and audio presentation. No need for deep Phaser audit unless engine bug.
- Actual caller ownership (WorldScene vs UI labs), live asset URLs and browser runtime conditions are **UNKNOWN** until linked assets are inspected.

## Priority search routes

| Need | Primary anchor |
|---|---|
| Character animation, directions, fishing/ride, attack pose | `class at`, `play`, `update`, `present`, `showUnarmed`, `standOn` |
| Held weapon location and tip | `class ci`, `sync`, `setLook`, `points`, `ie`, `si` |
| Authored weapon effect | `const K`, `class ki`, `class Mt`, `class nt` |
| Weapon spritesheet/armed pose | `armed:catalog`, `class nt`, `ensure`, `render` |
| Audio volume/mute/music | `class Ge`, `tm-audio`, `apply`, `syncMusic` |
| Sound effects for spells | `const Ye`, `Bt`, `const ze`, `ze.cast`, `ze.hit` |
| Local unarmed skill showcase | `const be`, `class yi`, `advanceTo`, `resolve` |

**Provenance:** `Character-DhQJ_Q0g(1).js`; SHA-256 `854dbfbd6105f551b6c110ef4895a5beedb0ddfd4afbbcc4f59c69809e7b67d1`. Every numeric value above comes from this uploaded file, not the historic Wiki.
