# REALMS — source-grounded module

**CONFIRMED**: Realm/bí cảnh lifecycle via Xa: open, spawn, instance, join, enter, nextFloor, damage, killed, claim, close, restore and tick. Differentiate in-room protection and progression from wider world. Exact payouts should be traced to individual methods and imported tables.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (56)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Xa.constructor` | constructor | 318233–318632 | `T`, `Object.create` |
| `Xa.now` | getter | 318632–318664 | `this.w.epoch` |
| `Xa.protected` | method | 318664–318737 | — |
| `Xa.event` | method | 318737–318807 | `this.events.find` |
| `Xa.inBossRoom` | method | 318807–318916 | `Xa.event`, `Lt`, `Math.hypot` |
| `Xa.inRoom` | method | 318916–318993 | `this.rooms.values` |
| `Xa.live` | method | 318993–319029 | `this.rooms.get` |
| `Xa.portalOf` | method | 319029–319086 | `this.portals.find` |
| `Xa.announce` | method | 319086–319483 | `Lt`, `this.rooms.get`, `i.note`, `this.w.announce`, `this.w.global.push` |
| `Xa.reachable` | method | 319483–320146 | `this.points.get`, `Math.ceil`, `e.nearestOpen`, `Math.floor`, `u.has`, `e.blocked`, `e.move`, `Math.hypot`, `u.add`, `c.push`, `this.points.set` |
| `Xa.openAt` | method | 320146–320315 | `this.openCache.get`, `this.reachable(t).filter`, `Xa.reachable`, `t.collision.blocked`, `this.openCache.set` |
| `Xa.pointFar` | method | 320315–320515 | `t.filter`, `n.every`, `Math.hypot`, `Math.floor`, `Math.random` |
| `Xa.openBands` | method | 320515–320682 | `this.w.epoch`, `Ud.level`, `Y.map((n,e)=>({b:n,i:e})).filter(({b:n})=>n.min<=t&&!0&&n.hosts.some(e=>this.w.data.maps.has(e))).map`, `Y.map((n,e)=>({b:n,i:e})).filter`, `Y.map`, `n.hosts.some`, `this.w.data.maps.has` |
| `Xa.pickHost` | method | 320682–320793 | `Y[t].hosts.filter`, `this.w.data.maps.has`, `Math.floor`, `Math.random` |
| `Xa.spawnAll` | method | 320793–321005 | `La`, `Xa.openBands`, `Xa.spawn`, `e.push`, `console.error`, `Math.max` |
| `Xa.portalSpot` | method | 321005–321790 | `n.map.gates.map`, `e.push`, `this.openAt(n,1.5).filter`, `Xa.openAt`, `e.every`, `Math.hypot`, `i.filter`, `h`, `Math.floor`, `Math.random` |
| `Xa.guardianPool` | method | 321790–322008 | `Math.min`, `Math.max`, `Math.floor`, `t.monsters.filter(s=>!s.passive&&s.cls!=="boss"&&Math.hypot(s.hx-n.bossX,s.hy-n.bossY)>Se+4).filter((s,i)=>i%tx===0).slice`, `t.monsters.filter(s=>!s.passive&&s.cls!=="boss"&&Math.hypot(s.hx-n.bossX,s.hy-n.bossY)>Se+4).filter`, `t.monsters.filter`, `Math.hypot` |
| `Xa.layout` | method | 322008–322331 | `this.w.room`, `Xa.openAt`, `Xa.pointFar`, `this.openAt(n,.6).slice`, `o.push` |
| `Xa.defs` | method | 322331–322407 | `at.map((t,n)=>n).filter`, `at.map`, `this.w.data.maps.has` |
| `Xa.spawn` | method | 322407–326253 | `La`, `this.portals.some`, `Xa.pickHost`, `this.w.data.maps.has`, `Xa.defs`, `r.includes`, `Math.floor`, `Math.random`, `this.w.room`, `Xa.portalSpot`, `Xa.layout`, `String` |
| `Xa.instance` | method | 326253–327853 | `Xa.defs`, `Math.floor`, `Math.random`, `Xa.layout`, `this.w.newId`, `Xa.pointFar`, `[0,1].map`, `Jv`, `[1,2,3].map`, `Zv`, `c.filter`, `Math.hypot` |
| `Xa.bossMonster` | method | 327853–328358 | `this.w.newId`, `Math.min`, `Wt`, `wt` |
| `Xa.guardian` | method | 328358–328812 | `Math.max`, `Math.round`, `xn`, `this.w.newId`, `Wt`, `Je`, `wt` |
| `Xa.makeRoom` | method | 328812–329730 | `this.w.room`, `this.openAt(e,.6).slice`, `Xa.openAt`, `this.w.createRealmRoom`, `Ma`, `Lt`, `this.rooms.set`, `Xa.spawnFloor`, `Qs`, `cl`, `ul`, `Xa.bossMonster` |
| `Xa.spawnFloor` | method | 329730–330368 | `this.w.room`, `Ma`, `Qs`, `i.monsters.filter`, `t.points.filter`, `Math.hypot`, `c.has`, `n.room.monsters.push`, `Xa.guardian`, `Xa.bossMonster`, `ll` |
| `Xa.save` | method | 330368–330875 | `this.rooms.get`, `this.portals.map`, `structuredClone`, `this.events.map`, `Object.fromEntries`, `[...this.w.players.values()].filter(t=>t.realm\|\|this.disconnected.has(t)).map`, `[...this.w.players.values()].filter`, `this.w.players.values`, `this.disconnected.has`, `t.profile` |
| `Xa.restore` | method | 330875–331454 | `Object.assign`, `Object.create`, `Io`, `La`, `Number.isInteger`, `Ma`, `Xa.makeRoom`, `Xa.tick` |
| `Xa.resume` | method | 331454–331730 | `[...this.disconnected.keys()].find`, `this.disconnected.keys`, `this.disconnected.delete`, `n.known.clear`, `Object.hasOwn` |
| `Xa.join` | method | 331730–332000 | `Xa.event`, `this.w.placeInRoom`, `Xa.live`, `Math.max`, `Xa.extract` |
| `Xa.disconnect` | method | 332000–332161 | `Xa.cancel`, `this.disconnected.set` |
| `Xa.payItems` | method | 332161–332313 | `s`, `n` |
| `Xa.offlineChau` | method | 332313–332541 | `sa`, `xs`, `Math.floor`, `Math.random` |
| `Xa.bagToProfile` | method | 332541–333290 | `ts`, `yl`, `s.set`, `s.get`, `Xa.payItems`, `(n.rewards??[]).flatMap`, `Xa.offlineChau`, `pv`, `hl`, `P0`, `Object.values`, `n.gear.slice` |
| `Xa.extract` | method | 333290–334699 | `yl`, `t.give`, `Xa.payItems`, `(e.rewards??[]).flatMap`, `Fn`, `t.note`, `hl`, `yv`, `t.grantRewardGear`, `as`, `e.gear.filter(m=>ds(m.id)>=4).map`, `e.gear.filter` |
| `Xa.closeIfEmpty` | method | 334699–334913 | `[...this.w.players.values()].some`, `this.w.players.values`, `Object.values(this.sleeping).some`, `Object.values`, `Xa.close` |
| `Xa.close` | method | 334913–335431 | `this.events.includes`, `this.events.filter`, `this.w.players.values`, `Xa.extract`, `Object.values`, `Xa.bagToProfile`, `Lt`, `Xa.announce`, `this.w.rooms.delete`, `this.rooms.delete` |
| `Xa.onDeath` | method | 335431–336315 | `Xa.event`, `Lt`, `[...((i=t.room)==null?void 0:i.players)??[]].find`, `this.w.record`, `Qv`, `Xa.bag`, `r.items.map`, `o.realm.gear.slice(-r.gear.length).map`, `o.realm.gear.slice`, `o.note`, `h.join`, `t.note` |
| `Xa.cancel` | method | 336315–336445 | `this.channels.get`, `this.channels.delete`, `this.opening.get`, `this.opening.delete` |
| `Xa.unprotect` | method | 336445–336678 | `Xa.event` |
| `Xa.enter` | method | 336678–338908 | `this.portals.find`, `$v.includes`, `Math.hypot`, `R0`, `dv`, `this.events.find`, `S.includes`, `v.members.some`, `c.members.includes`, `gv`, `Xa.instance`, `t.party.members.map` |
| `Xa.action` | method | 338908–340378 | `Xa.unprotect`, `Xa.extract`, `n.startsWith`, `Xa.enter`, `t.note`, `Xa.event`, `Xa.nextFloor`, `i.chests.find`, `i.exits.some`, `Math.hypot`, `Xa.protected`, `t.mailVerified` |
| `Xa.nextFloor` | method | 340378–340861 | `t.note`, `Xa.live`, `Xa.spawnFloor`, `n.points.find`, `Math.hypot`, `this.w.placeInRoom`, `t.events.push` |
| `Xa.damage` | method | 340861–342342 | `this.events.find`, `this.rooms.get`, `Xa.protected`, `Lt`, `Math.max`, `i.seals.some`, `o.owners.set`, `o.owners.delete`, `o.owners.get`, `Math.min`, `Object.create`, `Math.cos` |
| `Xa.hitSeals` | method | 342342–342823 | `Xa.event`, `Xa.protected`, `Math.hypot`, `n.seals.every`, `Lt`, `t.note`, `Xa.announce` |
| `Xa.killed` | method | 342823–345681 | `this.events.find`, `Xa.live`, `Lt`, `s.room.events.push`, `[...s.room.players].filter`, `this.disconnected.has`, `Sv`, `this.w.record`, `e.chests.push`, `Xa.pointFar`, `e.points.filter`, `Math.hypot` |
| `Xa.eliteLoot` | method | 345681–345913 | `this.events.find`, `this.rooms.get` |
| `Xa.guardianSlain` | method | 345913–346743 | `this.events.find`, `this.rooms.get`, `(s.slain??(s.slain=[])).includes`, `s.slain.push`, `Math.floor`, `this.live(s).room.monsters.some`, `Xa.live`, `s.chests.push`, `Xa.announce` |
| `Xa.bag` | method | 346743–347483 | `s.items.find`, `s.items.push`, `Xa.event`, `ja`, `Math.imul`, `p.charCodeAt`, `mn`, `Ma`, `ds`, `Vt`, `Math.max`, `mt` |
| `Xa.realmGear` | method | 347483–348028 | `es.includes`, `Vt`, `ja`, `Math.random`, `ot`, `B0`, `this.w.newId`, `Math.max`, `Math.min`, `Ye.filter`, `nh.has`, `Math.floor` |
| `Xa.claim` | method | 348028–348843 | `t.mailVerified`, `t.note`, `Nt`, `this.opening.delete`, `Xa.bag`, `((i=t.realm).rewards??(i.rewards=[])).push`, `Ml[e.kind].toLowerCase`, `[...s.items.map(([r,h])=>`${h} ${r}`),...s.gear?[((o=t.realm.gear.at(-1))==null?void 0:o.name)??s.gear.name]:[],...s.skill?["Bí kíp truyền thừa"]:[]].join`, `s.items.map`, `t.realm.gear.at`, `Xa.announce` |
| `Xa.bossTick` | method | 348843–350558 | `Xa.live`, `Lt`, `Xa.protected`, `Math.hypot`, `Math.min`, `c.push`, `Math.cos`, `Math.sin`, `t.hazards.push`, `this.w.newId`, `["poison","lava"].includes`, `s.events.push` |
| `Xa.heraldNext` | method | 350558–351051 | `Fo`, `Xa.openBands`, `Xa.pickHost`, `Object.entries(e).map(([o,r])=>{var h;return`${Y[+o].name}: ${((h=this.w.data.titles[r])==null?void 0:h.title)??r}`}).join`, `Object.entries(e).map`, `Object.entries`, `this.w.global.push`, `il`, `Math.ceil` |
| `Xa.gmOpen` | method | 351051–351324 | `this.portals.filter(s=>s.ends>this.now).map`, `this.portals.filter`, `Xa.openBands`, `n.has`, `Xa.spawn`, `Math.max`, `Math.min`, `console.error` |
| `Xa.gmList` | method | 351324–351994 | `this.events.filter(t=>!t.closeAt\|\|t.closeAt>this.now).map`, `this.events.filter`, `this.rooms.get`, `[...n.players].filter`, `Lt`, `this.w.data.maps.get`, `e.filter`, `Math.max`, `Math.round` |
| `Xa.tick` | method | 351994–353854 | `this.w.epoch`, `Xa.close`, `Lt`, `e.announced.includes`, `e.announced.push`, `Xa.announce`, `Xa.bossTick`, `this.portals.some`, `this.portals.filter`, `Xa.event`, `Math.hypot`, `Xa.protected` |
| `Xa.state` | method | 353854–356219 | `Xa.event`, `this.rooms.get`, `this.channels.get`, `wv`, `Xa.portalOf`, `this.portals.filter(l=>l.band===o\|\|l.host===r\|\|l===h).map`, `this.portals.filter`, `this.events.find`, `Fo`, `Lt`, `Math.ceil`, `e.seals.some` |

## Interpretation boundaries

- **CONFIRMED** declarations, calls, string literals and numeric constants can be located in ASSET_INDEX.json and the untouched source.
- **INFERRED** runtime role described above from method names and local flow; it is not independently tested.
- **UNKNOWN** imported function internals, network counterpart implementation, authority boundaries, real-time execution behavior and hidden state outside this asset.

## Merge checklist

- Match import aliases against original exports from other assets, then update unresolved links.
- Check event payload producers against consumers; confirm state writes against persisted fields.
- Preserve symbols/offsets; avoid replacing source IDs with translated feature names.

## Additional static control-flow inventory

The following conditions, numeric literals and writes are extracted from AST nodes. These are observations, not an assertion that each branch executes. Arrays are capped for readability; inspect source for exhaustive statements.

### `Xa.constructor` — 318233–318632

- Numeric literals: `1`
- State writes: `this.w`

### `Xa.event` — 318737–318807

- Conditions: `t.realm`
- Numeric literals: `0`

### `Xa.inRoom` — 318916–318993

- Conditions: `n.room===t`
- Numeric literals: `0`, `1`

### `Xa.announce` — 319086–319483

- Conditions: `t.notice=n,t.noticeUntil=e?0:this.now+30,this.changed=!0,Lt(t)!=="tranh-doat"`; `e`; `(s=this.rooms.get(t.id))==null`; `!t.closeAt&&t.ends>this.now`
- Numeric literals: `1`, `0`, `30`
- State writes: `t.notice`, `t.noticeUntil`, `this.changed`, `s`
- Event types: `chat`

### `Xa.reachable` — 319483–320146

- Conditions: `n`; `!o`; `f<1||l<1||f>=s-1||l>=i-1||u.has(p)||e.blocked(f,l,rt)`
- Numeric literals: `0`, `1`, `0.01`

### `Xa.openAt` — 320146–320315

- State writes: `s`

### `Xa.pointFar` — 320315–320515

- Conditions: `!i.length`; `s`
- Numeric literals: `0`, `1`

### `Xa.openBands` — 320515–320682

- Numeric literals: `0`

### `Xa.spawnAll` — 320793–321005

- Numeric literals: `0`
- State writes: `this.lastSlot`

### `Xa.portalSpot` — 321005–321790

- Conditions: `$<p&&(p=$,p<=25)`; `c.length`; `u.length`; `i.length`; `!m.length`
- Numeric literals: `10`, `8`, `14`, `12`, `0`, `1`, `20`, `1.5`, `25`, `5`
- State writes: `g`, `p`, `r[d]`

### `Xa.guardianPool` — 321790–322008

- Numeric literals: `20`, `45`, `4`, `0`

### `Xa.layout` — 322008–322331

- Conditions: `!e.length`
- Numeric literals: `4`, `12`, `0.6`, `0`, `3`

### `Xa.spawn` — 322407–326253

- Conditions: `!i||n===void 0&&this.portals.some(B=>B.band===s&&B.slot===t)`; `((_=this.herald)==null?void 0:_.slot)===t`; `(_=this.herald)==null`; `!o||!this.w.data.maps.has(o)`; `!r.length`; `e!==void 0&&r.includes(e)`; `n===void 0`; `n!==void 0&&!Io(this.now)`; `Math.random()<.7`; `!W`; `x.length>=C`; `W`; `It&&pt.length`; `yt.length`; `pt.length`; `!Ft`; `Me.gear`; `B<.7`; `B<.95`; `j==="legacy"`; `j==="weapon"`; `(U=this.w.data.titles[o])==null`
- Numeric literals: `0`, `1`, `8`, `0.6`, `4`, `5`, `0.7`, `3`, `10`, `15`, `0.5`, `2`, `0.2`, `0.95`
- State writes: `_`, `S.guards`, `S.elites[B]`, `Ft.gear`, `ht.premium`, `S.pool`, `this.lastSlot`, `this.lastPortal[s]`, `U`, `this.changed`
- Event types: `chat`

### `Xa.instance` — 326253–327853

- Conditions: `t==="to-doi"`; `t==="luyen-the"`; `v`
- Numeric literals: `1`, `0`, `8`, `14`, `2`, `3`, `5`, `4`, `0.8`
- State writes: `d.trial`, `d.exits`, `d.bossHp`, `d.bossMax`, `d.guards`, `d.pool`, `this.changed`

### `Xa.bossMonster` — 327853–328358

- Conditions: `t.bossHp<=0`
- Numeric literals: `3.8`, `0.8`, `1.5`, `9`, `0`, `1`, `2`

### `Xa.guardian` — 328358–328812

- Conditions: `s==="elite"`; `s==="gu"`; `s==="elite"&&t.cls!=="elite"`
- Numeric literals: `1`, `4`, `0.6`, `1.25`, `0`

### `Xa.makeRoom` — 328812–329730

- Conditions: `this.rooms.set(t.id,h),r==="luyen-the"`; `r==="to-doi"`; `(p=t.members)==null`; `g.has(k)`; `y.cls==="elite"`
- Numeric literals: `0.6`, `0`, `1`, `0.8`
- State writes: `t.points`, `p`, `h.boss`

### `Xa.spawnFloor` — 329730–330368

- Conditions: `s>2||e.clear`; `!u.length`; `c.has(k)`; `d.length`; `p>=f`
- Numeric literals: `2`, `2.5`, `7`, `0`, `100`, `7919`, `31`, `1`
- State writes: `n.boss`

### `Xa.save` — 330368–330875

- Conditions: `this.wave`; `this.herald`
- Numeric literals: `2`
- State writes: `t.bossHp`

### `Xa.restore` — 330875–331454

- Conditions: `!t||t.version!==2`; `n.wave&&Io(this.now)&&n.wave.slot===La(this.now)&&Number.isInteger(n.wave.band)&&n.wave.band>=0&&n.wave.band<Y.length`
- Numeric literals: `2`, `0`
- State writes: `this.lastSlot`, `this.portals`, `this.events`, `this.sleeping`, `this.lastPortal`, `this.herald`, `this.wave`, `e.bossDamage`, `e.band`

### `Xa.resume` — 331454–331730

- Conditions: `n`; `Object.hasOwn(this.sleeping,t.name)`; `e`
- Numeric literals: `0`
- State writes: `n.events`, `this.changed`

### `Xa.join` — 331730–332000

- Conditions: `t.realm&&n`; `t.dead`
- Numeric literals: `0`, `5`
- State writes: `t.dead`, `t.hp`, `t.deadUntil`, `t.invulnUntil`

### `Xa.disconnect` — 332000–332161

- Conditions: `t.realm`
- Numeric literals: `0`, `1`
- State writes: `this.changed`

### `Xa.payItems` — 332161–332313

- Conditions: `i===Pr`; `i===Oo`
- Numeric literals: `0`, `1`
- State writes: `e[ml]`

### `Xa.offlineChau` — 332313–332541

- Conditions: `(s=t.kt)==null`; `!n||!sa(ie)`; `n.drops>=vh`
- Numeric literals: `0`
- State writes: `s`, `n.day`, `n.drops`

### `Xa.bagToProfile` — 332541–333290

- Conditions: `e`; `i&&s.set(_t,(s.get(_t)??0)+i),Xa.payItems([...n.items,...(n.rewards??[]).flatMap(dn)],(o,r)=>s.set(o,(s.get(o)??0)+r),t.forge.materials,Xa.offlineChau(t)),Z.on`
- Numeric literals: `0`
- State writes: `t.forge`, `t.gear`, `t.pendingGear`, `t.realmRewards`, `t.inheritanceProgress`, `t.inv`, `t.scene`, `t.x`, `t.y`, `t.realm`

### `Xa.extract` — 333290–334699

- Conditions: `!e`; `n`; `Fn(this.w,t,"bi-canh")`; `Z.on`; `Z.on&&e.gear.length&&!h&&t.note("Đợt mở sớm: phiếu trang bị lần này không thành món."),!Z.on`; `c&&c.q>=A0`
- Numeric literals: `0`, `4`, `1`, `3`
- State writes: `t.realm`, `t.dirty`, `t.dead`, `t.st`, `t.invulnUntil`, `this.changed`
- Event types: `chat`

### `Xa.closeIfEmpty` — 334699–334913

- Conditions: `(s=e.realm)==null`
- Numeric literals: `0`
- State writes: `s`

### `Xa.close` — 334913–335431

- Conditions: `this.events.includes(t)`; `(n=s.realm)==null`; `(e=s.realm)==null`
- Numeric literals: `0`
- State writes: `this.events`, `n`, `e`, `this.changed`

### `Xa.onDeath` — 335431–336315

- Conditions: `!e`; `s&&Lt(s)==="tranh-doat"&&n&&!e.dead`; `(i=t.room)==null`; `(h=r.realm)==null`; `o`; `r.items.length||r.gear.length||r.essenceCredit`; `r.gear.length`
- Numeric literals: `0`
- State writes: `i`, `h`, `o.realm.essenceCredit`, `e.dead`, `e.items`, `e.gear`, `e.books`, `e.rewards`, `e.essenceCredit`, `e.protection`, `t.dirty`, `this.changed`

### `Xa.unprotect` — 336445–336678

- Conditions: `t.realm&&t.realm.protection>this.now`; `(n=this.event(t))==null`
- Numeric literals: `0`
- State writes: `t.realm.protection`, `t.invulnUntil`, `t.mobSafeUntil`, `t.dirty`, `this.changed`, `n`, `e.startAt`

### `Xa.enter` — 336678–338908

- Conditions: `$v.includes(e)`; `t.realm||!i||((k=t.room)==null?void 0:k.scene)!==i.host||Math.hypot(t.x-i.x,t.y-i.y)>3.2`; `(k=t.room)==null`; `s>=i.ends`; `t.level<r.min||t.level>r.max`; `t.pendingGear.length>=Av`; `t.combatUntil>this.w.time||t.st.stunUntil>this.w.time||t.st.rootUntil>this.w.time||t.tribRun`; `o==="tranh-doat"&&(c=this.events.find($=>$.id===i.contest),!c||c.closeAt||s>=c.ends)`; `o==="to-doi"`; `c=this.events.find($=>{var S;return $.portal===i.id&&$.kind==="to-doi"&&!$.closeAt&&!!((S=$.members)!=null&&S.includes(t.name))}),c`; `!((v=t.party)!=null&&v.members.some($=>$!==t&&c.members.includes($.name)))`; `(y=t.party)==null`; `$<Wa||$>Ai`; `u`; `m.trial`; `d`; `f.length`
- Numeric literals: `0`, `3.2`, `1`, `2.5`, `14`, `8`
- State writes: `k`, `c`, `S`, `v`, `y`, `t.realm`, `t.flying`, `t.meditating`, `t.st`, `t.invulnUntil`, `t.mobSafeUntil`, `t.dirty`, `this.changed`
- Event types: `travel`

### `Xa.action` — 338908–340378

- Conditions: `n==="realm-unprotect"`; `n==="respawn"&&t.realm`; `!n.startsWith("realm-")`; `t.dead||!t.room`; `n==="realm-enter"`; `!i||t.st.stunUntil>this.w.time||t.st.rootUntil>this.w.time`; `n==="realm-floor"`; `!o&&n!=="realm-chest"`; `o?t.combatUntil>this.w.time||!i.exits.some(([c,u])=>Math.hypot(t.x-c,t.y-u)<=2.5):!r||Math.hypot(t.x-r.x,t.y-r.y)>2.2`; `o`; `!o&&this.protected(t)`; `!o&&(r==null?void 0:r.kind)==="hidden"&&r.premium&&(t.level<qs||!t.mailVerified())`; `r==null`; `!o&&(r!=null&&r.owner)&&r.owner!==t.name`; `this.channels.has(t)`; `!o`; `c&&c!==t&&((h=this.channels.get(c))==null?void 0:h.target)===e`; `(h=this.channels.get(c))==null`
- Numeric literals: `0`, `1`, `2.5`, `2.2`
- State writes: `h`

### `Xa.nextFloor` — 340378–340861

- Conditions: `!e`; `!e.clear||e.floor>=2`; `e.floor===2`
- Numeric literals: `2`, `1`, `8`, `11`, `0`
- State writes: `e.clear`, `this.changed`
- Event types: `travel`

### `Xa.damage` — 340861–342342

- Conditions: `!n.realmBoss`; `!i||!o||((m=t.realm)==null?void 0:m.id)!==i.id||t.room!==o.room||this.protected(t)||t.dead`; `(m=t.realm)==null`; `i.seals.some(g=>g.hits>0)`; `r!=="tranh-doat"||this.now<i.weakUntil`; `r==="tranh-doat"`; `p>0`; `r==="luyen-the"`; `i.phase===0`; `i.phase===1`; `c=Math.min(c,Math.max(0,n.hp-n.maxHp*u)),c>0&&((i.bossDamage??(i.bossDamage=Object.create(null)))[t.name]=(i.bossDamage[t.name]??0)+Math.min(c,n.hp),t.realm&&(t.realm.fought=!0)),u …`; `r==="to-doi"`
- Numeric literals: `0`, `1`, `0.65`, `0.0075`, `0.0025`, `0.7`, `0.35`, `0.001`, `3`, `2`, `5`, `4`, `6`
- State writes: `m`, `o.budgetAt`, `o.global`, `c`, `(i.bossDamage??(i.bossDamage=Object.create(null)))[t.name]`, `i.bossDamage`, `t.realm.fought`, `i.seals`, `o.persistAt`, `this.changed`

### `Xa.hitSeals` — 342342–342823

- Conditions: `!(!n||this.protected(t)||t.dead)`; `Lt(n)==="tranh-doat"`
- Numeric literals: `0`, `2.4`, `0.5`, `0.2`, `0.45`, `15`
- State writes: `e.last[t.name]`, `this.changed`, `n.weakUntil`

### `Xa.killed` — 342823–345681

- Conditions: `!e||e.bossHp<=0`; `n==null`; `(g=m.realm)==null`; `i==="luyen-the"`; `g`; `g==null`; `!g||g.damage/Math.max(1,r)<Nh`; `i==="to-doi"`; `e.pool=void 0,u`; `h.forEach((l,p)=>{const k=o.find(S=>S.name===l.name),y=[];m[p]&&y.push(["Linh thạch",m[p]]);const v=Math.floor(g[p]/je);v&&y.push([_t,v]);for(const[S,P]of f)P[p]&&y.push([S,P[p]]); …`; `u.gear[p]`; `$.length`; `n`; `i==="tranh-doat"`
- Numeric literals: `0`, `1`, `2`, `3`, `6`, `100`, `4`, `1.2`
- State writes: `t.dead`, `t.deathAt`, `t.hp`, `t.anim`, `t.target`, `t.respawnAt`, `e.bossHp`, `e.hazards`, `e.seals`, `e.lastHit`, `g`, `m.clear`, `m.clearAt`, `m.floor`, `m.stars`, `m.starLoot`, `e.exits`, `this.changed`, `e.closeAt`, `d.realm.bossRank`, `e.pool`, `k.realm.essenceCredit`, `l`
- Event types: `die`

### `Xa.eliteLoot` — 345681–345913

- Conditions: `(o=this.rooms.get(i.id))==null`; `!e||n.guard===void 0||!e.elites`
- Numeric literals: `0`
- State writes: `o`, `this.changed`

### `Xa.guardianSlain` — 345913–346743

- Conditions: `(h=this.rooms.get(r.id))==null`; `!s||n.guard===void 0`; `(o=e==null?void 0:e.realm)==null`; `e==null`; `i&&!i.clear&&i.floor<2&&Math.floor(n.guard/100)===i.floor&&!this.live(s).room.monsters.some(h=>!h.dead&&h!==n&&h.guard!==void 0&&Math.floor(h.guard/100)===i.floor)`; `e`
- Numeric literals: `0`, `1`, `2`, `100`
- State writes: `h`, `s.slain`, `this.changed`, `o`, `e.realm.kills`, `e.dirty`, `i.clear`

### `Xa.bag` — 346743–347483

- Conditions: `!s`; `m`; `ta[c.id]`; `(r=ta[c.id])==null`; `Za[c.id]`; `i&&d>o`; `(h=mt(l.id))==null`
- Numeric literals: `0`, `1`, `2166136261`, `16777619`, `13`, `17`, `5`, `4294967296`
- State writes: `m`, `r`, `l.upgrade`, `l.noSalvage`, `l.tier`, `l.level`, `h`, `l.name`, `t.dirty`, `this.changed`

### `Xa.realmGear` — 347483–348028

- Conditions: `s&&Math.random()<.4`; `!r.length`
- Numeric literals: `0`, `0.4`, `2`, `4`

### `Xa.claim` — 348028–348843

- Conditions: `e.claimed||!t.realm||e.owner&&e.owner!==t.name`; `e.kind==="hidden"&&e.premium&&(t.level<qs||!t.mailVerified())`; `s.gear`; `(o=t.realm.gear.at(-1))==null`; `s.skill`
- Numeric literals: `0`, `1`
- State writes: `e.claimed`, `t.realm.opened`, `i`, `i.rewards`, `e.loot`, `o`, `t.dirty`, `this.changed`

### `Xa.bossTick` — 348843–350558

- Conditions: `!(!e||e.dead)`; `e.st.stunUntil=0,e.st.rootUntil=0,e.st.slowUntil=0,i>=t.attackAt&&e.target&&!e.target.dead&&!this.protected(e.target)&&this.w.time>=e.target.mobSafeUntil`; `t.tier===2`; `o==="luyen-the"`; `h==="charge"||h==="lightning"`; `h==="rope"||h==="lava"||h==="quake"`; `o==="to-doi"`; `h==="quake"`; `["poison","lava"].includes(h)`; `i>=r.next&&i<=r.until`; `r.kind==="poison"`; `r.kind==="lightning"`; `!h.dead&&this.w.time>=h.invulnUntil&&this.w.time>=h.mobSafeUntil&&!this.protected(h)&&Math.hypot(h.x-r.x,h.y-r.y)<r.radius+rt`; `o==="tranh-doat"`
- Numeric literals: `0`, `2`, `4.5`, `7.5`, `6.5`, `1`, `12`, `3`, `4`, `14`, `2.4`, `1.5`, `1.3`, `0.15`, `45`, `0.12`, `1.9`
- State writes: `e.st.stunUntil`, `e.st.rootUntil`, `e.st.slowUntil`, `t.attackAt`, `r.next`, `h.hp`, `h.combatUntil`, `h.st.rootUntil`, `t.hazards`
- Event types: `fx`, `dmg`

### `Xa.heraldNext` — 350558–351051

- Conditions: `n-t>vv||((i=this.herald)==null?void 0:i.slot)===n`; `(i=this.herald)==null`; `(h=this.w.data.titles[r])==null`
- Numeric literals: `0`, `60`
- State writes: `i`, `e[o]`, `this.herald`, `this.changed`, `h`
- Event types: `chat`

### `Xa.gmOpen` — 351051–351324

- Conditions: `!n.has(s)`; `t===void 0`
- Numeric literals: `0`, `2`

### `Xa.gmList` — 351324–351994

- Conditions: `(s=this.rooms.get(t.id))==null`; `n`; `(c=h.realm)==null`; `t.band===void 0`; `(i=Y[t.band])==null`; `(o=this.w.data.maps.get(t.host))==null`; `(r=Yn[t.tier])==null`; `t.bossMax`; `t.bossHp>0`
- Numeric literals: `0`, `100`
- State writes: `s`, `c`, `i`, `o`, `r`

### `Xa.tick` — 351994–353854

- Conditions: `t>=(e.closeAt||e.ends)`; `!e.closeAt&&Lt(e)==="tranh-doat"`; `!i||i.id!==s.id||e.dead||e.lastHit!==s.hit||Math.hypot(e.x-s.x,e.y-s.y)>.12||e.st.stunUntil>this.w.time||e.st.rootUntil>this.w.time||s.target!=="exit"&&this.protected(e)`; `!(t<s.at+s.duration)`; `this.cancel(e),s.target==="exit"`; `Lt(e)!=="tranh-doat"`; `!(!s||!s.room.players.size)`; `!i.realm||i.dead`; `n>this.lastSlot&&(Io(t)&&(this.wave={slot:n,band:0}),this.lastSlot=n),this.wave`; `e.band<Y.length`
- Numeric literals: `10`, `1`, `60`, `0`, `0.12`, `2.2`
- State writes: `this.portals`, `this.changed`, `this.sleeping[e.name]`, `this.wave`, `this.lastSlot`

### `Xa.state` — 353854–356219

- Conditions: `(f=t.room)==null`; `e`; `(k=this.w.data.titles[l.host])==null`; `p&&p.noticeUntil>n`; `p`; `p.closeAt`; `!(e&&s&&t.realm)`; `m==="tranh-doat"`; `g`; `e.seals.some(l=>l.hits>0)`; `n<e.weakUntil`; `l.owner`; `p&&k&&p!==t`; `d`; `d.stars`; `d.floor===2&&g&&!g.dead`; `m==="to-doi"`; `i`; `i.target==="exit"`
- Numeric literals: `0`, `1`, `100`, `2`
- State writes: `f`, `k`


## Realm lifecycle — CONFIRMED symbols, INFERRED grouping

- Access/opening path: `Xa.openAt` [320146, 320315) → `Xa.portalSpot` [321005, 321790) / `Xa.portalOf` [319029, 319086) → `Xa.enter` [336678, 338908) and `Xa.join` [331730, 332000).
- Room creation/spawns: `Xa.instance` [326253, 327853), `Xa.makeRoom` [328812, 329730), `Xa.spawnFloor` [329730, 330368), `Xa.bossMonster` [327853, 328358), `Xa.guardian` [328358, 328812).
- Combat progress/loot: `Xa.damage` [340861, 342342), `Xa.killed` [342823, 345681), `Xa.guardianSlain` [345913, 346743), `Xa.claim` [348028, 348843), `Xa.nextFloor` [340378, 340861), `Xa.bossTick` [348843, 350558).
- Lifecycle: `Xa.save` [330368, 330875), `Xa.restore` [330875, 331454), `Xa.resume` [331454, 331730), `Xa.disconnect` [332000, 332161), `Xa.onDeath` [335431, 336315), `Xa.closeIfEmpty` [334699, 334913), `Xa.close` [334913, 335431), `Xa.tick` [351994, 353854).

**UNKNOWN**: Portal rendering owner, authoritative validation, and cross-file loot definitions. Preserve differences between UI display and simulation values at merge time.
