# Class `ik` — Cinematic poison/gu simulation

**Source range:** `ik` [UTF-16 196852–206341, line 237].
**Role:** Standalone state simulator with host HP, stacks, pending impacts, cooldowns and optional presentationOnly mode; NOT server damage authority. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 13.

Methods and evidence (calls collected include nested callbacks):

### `ik.constructor(e="combo", t="east")`
- **CONFIRMED location:** UTF-16 `[ 196861, 197253 )`, UTF-8 bytes `[ 200640, 201032 )`, physical line 237, columns 53245–53637.
- **Syntactic calls:** `M`, `Map`, `this.reset`.
- **Calls through `this`:** `reset`.

### `ik.reset()`
- **CONFIRMED location:** UTF-16 `[ 197253, 198302 )`, UTF-8 bytes `[ 201032, 202081 )`, physical line 237, columns 53637–54686.
- **Syntactic calls:** `Array.from`, `ArrayExpression.includes`, `ArrayExpression.map`, `this.cooldowns.clear`, `this.hosts.forEach`.
- **Calls through `this`:** `cooldowns.clear`, `hosts.forEach`.

### `ik.reason(e, t)`
- **CONFIRMED location:** UTF-16 `[ 198302, 198780 )`, UTF-8 bytes `[ 202081, 202620 )`, physical line 237, columns 54686–55164.
- **Syntactic calls:** `this.cooldowns.get`, `this.hosts.some`, `this.nearby`, `this.nearby().some`.
- **Calls through `this`:** `cooldowns.get`, `hosts.some`, `nearby`, `nearby().some`.
- **Numeric comparisons:** `i.hp>0`; `i.stacks>0`; `this.hosts[i].hp>0`; `this.hosts[i].stacks>0`; `this.hosts[t].hp<=0`.

### `ik.input(e, t)`
- **CONFIRMED location:** UTF-16 `[ 198780, 199018 )`, UTF-8 bytes `[ 202620, 202858 )`, physical line 237, columns 55164–55402.
- **Syntactic calls:** `this.cast`, `this.commands.filter`, `this.commands.push`, `this.reason`.
- **Calls through `this`:** `cast`, `commands.filter`, `commands.push`, `reason`.

### `ik.record(e)`
- **CONFIRMED location:** UTF-16 `[ 199018, 199048 )`, UTF-8 bytes `[ 202858, 202888 )`, physical line 237, columns 55402–55432.
- **Syntactic calls:** `this.events.push`.
- **Calls through `this`:** `events.push`.

### `ik.cast(e)`
- **CONFIRMED location:** UTF-16 `[ 199048, 199525 )`, UTF-8 bytes `[ 202888, 203365 )`, physical line 237, columns 55432–55909.
- **Syntactic calls:** `Zv`, `this.cooldowns.set`, `this.pending.push`, `this.reason`, `this.record`.
- **Calls through `this`:** `cooldowns.set`, `pending.push`, `reason`, `record`.

### `ik.damage(e, t, i=!1)`
- **CONFIRMED location:** UTF-16 `[ 199525, 199711 )`, UTF-8 bytes `[ 203365, 203551 )`, physical line 237, columns 55909–56095.
- **Syntactic calls:** `Math.min`.
- **Numeric comparisons:** `n.hp<=0`; `n.hp<=0`.

### `ik.mark(e, t=1)`
- **CONFIRMED location:** UTF-16 `[ 199711, 199865 )`, UTF-8 bytes `[ 203551, 203705 )`, physical line 237, columns 56095–56249.
- **Syntactic calls:** `Math.min`.
- **Numeric comparisons:** `i.hp<=0`.

### `ik.heal(e)`
- **CONFIRMED location:** UTF-16 `[ 199865, 200000 )`, UTF-8 bytes `[ 203705, 203840 )`, physical line 237, columns 56249–56384.
- **Syntactic calls:** `Math.min`, `this.record`.
- **Calls through `this`:** `record`.
- **Numeric comparisons:** `t>0`.

### `ik.nearby(e, t)`
- **CONFIRMED location:** UTF-16 `[ 200000, 200162 )`, UTF-8 bytes `[ 203840, 204002 )`, physical line 237, columns 56384–56546.
- **Syntactic calls:** `Math.hypot`, `_s`, `i.map`, `i.map().filter`, `i.map().filter().map`.

### `ik.resolve(e)`
- **CONFIRMED location:** UTF-16 `[ 200162, 204042 )`, UTF-8 bytes `[ 204002, 207882 )`, physical line 237, columns 56546–60426.
- **Syntactic calls:** `Af`, `ArrayExpression.includes`, `Math.max`, `Math.min`, `e.hosts.forEach`, `e.hosts.map`, `e.hosts.reduce`, `e.marks.reduce`, `i.includes`, `n.find`, `n.includes`, `this.damage`, `this.heal`, `this.hosts.findIndex`, `this.hosts.map`, `this.hosts.map().filter`, `this.mark`, `this.nearby`, `this.nearby().filter`, `this.pending.push`, `this.pools.push`, `this.record`.
- **Calls through `this`:** `damage`, `heal`, `hosts.findIndex`, `hosts.map`, `hosts.map().filter`, `mark`, `nearby`, `nearby().filter`, `pending.push`, `pools.push`, `record`.
- **Numeric comparisons:** `t.hp<=0`; `n<3`; `this.hosts[i].hp>0`; `i<3`; `t.hp<=0`; `this.hosts[l].hp>0`; `i.hp>0`; `i.stacks>0`; `i>=0`; `i<7`; `this.hosts[i].hp>0`; `e.source===6` … (+9).

### `ik.advanceTo(e)`
- **CONFIRMED location:** UTF-16 `[ 204042, 206092 )`, UTF-8 bytes `[ 207882, 209932 )`, physical line 237, columns 60426–62476.
- **Syntactic calls:** `Math.floor`, `Math.hypot`, `Math.max`, `Math.min`, `_s`, `s.map`, `s.map().filter`, `s.map().filter().sort`, `this.cast`, `this.commands.map`, `this.damage`, `this.hosts.map`, `this.hosts.map().filter`, `this.mark`, `this.nearby`, `this.pending.filter`, `this.pending.push`, `this.pools.filter`, `this.record`, `this.reset`, `this.resolve`.
- **Calls through `this`:** `cast`, `commands.map`, `damage`, `hosts.map`, `hosts.map().filter`, `mark`, `nearby`, `pending.filter`, `pending.push`, `pools.filter`, `record`, `reset`, `resolve`.
- **Numeric comparisons:** `s.hp<=0`; `this.hosts[n.target].hp<=0`; `this.hosts[r.i].hp>0`; `o.hp>0`; `o>=0`.

### `ik.snapshot()`
- **CONFIRMED location:** UTF-16 `[ 206092, 206340 )`, UTF-8 bytes `[ 209932, 210180 )`, physical line 237, columns 62476–62724.
- **Syntactic calls:** `this.events.map`, `this.hosts.map`, `this.hosts.reduce`.
- **Calls through `this`:** `events.map`, `hosts.map`, `hosts.reduce`.
