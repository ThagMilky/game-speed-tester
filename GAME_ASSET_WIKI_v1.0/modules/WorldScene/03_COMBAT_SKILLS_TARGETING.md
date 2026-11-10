# Combat, aiming, cooldowns and visual feedback

## Skill request flow — CONFIRMED

`A3.useSkill` [UTF-16 920349–923646, line 1143]; `A3.skillWait` [UTF-16 919808–920037, line 1143]; `A3.flushSkill` [UTF-16 920037–920349, line 1143]; `A3.kitById` [UTF-16 916837–916982, line 1143]; `A3.startAim` [UTF-16 917122–917363, line 1143]; `A3.aimPoint` [UTF-16 917504–917813, line 1143]; `A3.drawAim` [UTF-16 918286–919808, line 1143]; `A3.castFx` [UTF-16 924623–928775, line 1143].

`useSkill(key, auto=false, userInput=true)` reads latest `self` and `profile`, blocks death/UI conditions, checks silence (`fx` contains `x`), selected class/skill unlock, some local cooldowns (`cdLocal`, `self.cd`), Thể Tu blood resource `cg.v` against imported `uo[id]`, mana cost `Sh(profile.root)*skill.manaPct*self.mm*(self.mc??1)`, root (`fx` contains `r`) for dash/blink, and blink target presence. The request may still be rejected/modified by server.

Basic `Space` increments a local combo index modulo imported `de.combo.length`; uses local cooldown and animation before sending `{t:'skill',key,fx,fy}`. `Q` dash has local cooldown `Ja.dashCd`, dash time `Ja.dashTime`, displacement from imported `Wy(classId)` and advances through local collision in `move`. Active numbered skills use imported `Rs(classId,key,extraSkill,skillSlots)` definitions; shape, contact delay, move lock and cast range affect local checks. When cooldown is positive but `<=.3s`, a requested skill can be buffered with an expiry of `.45s` (`pendingSkill`). `flushSkill` processes it.

For numbered skills the client limits animation lock to `min(skill.lock,1.2)` except inherited and Thể Tu, sets a short local outgoing throttle `.2s` unless a GM flag applies, and caps ordinary `lockUntil` at `.6s`. The branch for dash chooses a special local distance for skills `lien-hoan`, `han-quang`, `hanh-tu-bi` and a duration of `.45` for `hanh-tu-bi` or skill `moveLock??.3`. These are animation/input mechanics, not proven actual server damage or hit detection.

## Target acquisition and automatic usage — CONFIRMED

`anyEnemy`, `nearestEnemy`, `aimAtNearest`, `cycleTarget`, `pickTarget`, `targetRing`, `drawTarget`, `drawAim` use `views`, current player position, enemies/players and area/mouse vectors. Auto farm's class `Q4.castSkills` loops skill slots starting after last cast; it handles shapes `self`, `cone`, `dash`, `blink`, `circle` with separate radius and HP conditions. `autoHost.cast` calls `useSkill` with aim coordinates only after its own checks.

## Damage event rendering — CONFIRMED

`A3.onEvent` handles incoming `dmg`, `die`, `cast`, `level`, `chat`, `note`, `toast`, `node`, `fx`, `skill-tuning`, `gacha`, `codes`, `travel`, `emote`, `root` event types. `dmg` chooses among specialized effect renderers `chieu.hit`, `danh.hit`, then generic floating text, animation flash, hit-squash, camera trauma. Displayed numbers originate from `t.v` in events, not a locally authenticated calculation. `statusFx.hit` can trigger shields/spikes/glow effects.

## Dedicated visual systems — CONFIRMED

- `Su`: weapon effect render; `z4`: combat streak and impact painter; `$k`: swing/bolt geometry.
- `Mv`: `statusFx` with pooled particle/silhouette rendering; `fv`: status icon ribbon.
- `Tv` singleton `jt`: `data/fx/fx.json` clip/atlas table, pooled sprite FX.
- `Sv`: meditation/tribulation effects, local ring and particle animations.
- `zu`, `sk`, `rk`, `ik`, `ok`: standalone class-specific showcase/simulator sequences; see `13_CLIENT_SIMULATORS.md`.

## Authority boundary — UNKNOWN

Source has client-side skill definitions, request payloads, animation and event response, not server-side hit, resistance, drop, or damage formulas. Do not equate simulator numbers with live combat.
