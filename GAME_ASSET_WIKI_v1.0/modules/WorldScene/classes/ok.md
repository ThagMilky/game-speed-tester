# Class `ok` — Cinematic blood/demon skill simulation

**Source range:** `ok` [UTF-16 222485–231182, line 237].
**Role:** Standalone HP/qi/cooldown/target simulator; NOT the live server combat formula. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 11.

Methods and evidence (calls collected include nested callbacks):

### `ok.constructor(e="combo", t="east")`
- **CONFIRMED location:** UTF-16 `[ 222494, 223012 )`, UTF-8 bytes `[ 226730, 227248 )`, physical line 237, columns 78878–79396.
- **Syntactic calls:** `M`, `Map`, `this.reset`.
- **Calls through `this`:** `reset`.

### `ok.reset()`
- **CONFIRMED location:** UTF-16 `[ 223012, 224038 )`, UTF-8 bytes `[ 227248, 228274 )`, physical line 237, columns 79396–80422.
- **Syntactic calls:** `ArrayExpression.includes`, `Fc.map`, `this.cooldowns.clear`.
- **Calls through `this`:** `cooldowns.clear`.

### `ok.reason(e, t)`
- **CONFIRMED location:** UTF-16 `[ 224038, 224620 )`, UTF-8 bytes `[ 228274, 228913 )`, physical line 237, columns 80422–81004.
- **Syntactic calls:** `ArrayExpression.includes`, `El.some`, `Math.ceil`, `this.cooldowns.get`, `ua`.
- **Calls through `this`:** `cooldowns.get`.
- **Numeric comparisons:** `this.foes[t].hp<=0`.

### `ok.input(e, t)`
- **CONFIRMED location:** UTF-16 `[ 224620, 224841 )`, UTF-8 bytes `[ 228913, 229134 )`, physical line 237, columns 81004–81225.
- **Syntactic calls:** `this.cast`, `this.commands.filter`, `this.commands.push`, `this.reason`.
- **Calls through `this`:** `cast`, `commands.filter`, `commands.push`, `reason`.

### `ok.cast(e)`
- **CONFIRMED location:** UTF-16 `[ 224841, 225465 )`, UTF-8 bytes `[ 229134, 229758 )`, physical line 237, columns 81225–81849.
- **Syntactic calls:** `ArrayExpression.includes`, `Math.hypot`, `Math.max`, `Math.min`, `pi`, `this.cooldowns.set`, `this.events.push`, `this.pending.push`, `this.reason`, `ua`.
- **Calls through `this`:** `cooldowns.set`, `events.push`, `pending.push`, `reason`.

### `ok.heroAt(e=this.time)`
- **CONFIRMED location:** UTF-16 `[ 225465, 225666 )`, UTF-8 bytes `[ 229758, 229959 )`, physical line 237, columns 81849–82050.
- **Syntactic calls:** `Pt`, `pi`, `this.events.filter`, `this.events.filter().at`.
- **Calls through `this`:** `events.filter`, `events.filter().at`.

### `ok.foeAt(e, t=this.time)`
- **CONFIRMED location:** UTF-16 `[ 225666, 225987 )`, UTF-8 bytes `[ 229959, 230280 )`, physical line 237, columns 82050–82371.
- **Syntactic calls:** `Pt`, `l.some`, `pi`, `s.find`, `this.events.filter`, `this.events.filter().at`.
- **Calls through `this`:** `events.filter`, `events.filter().at`.

### `ok.learned(e)`
- **CONFIRMED location:** UTF-16 `[ 225987, 228525 )`, UTF-8 bytes `[ 230280, 232818 )`, physical line 237, columns 82371–84909.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.hypot`, `Math.max`, `Math.min`, `Math.sin`, `e.victims.map`, `s.filter`, `s.sort`, `s.sort().slice`, `this.events.push`, `this.foes.map`, `this.foes.map().filter`, `this.pending.push`, `ua`.
- **Calls through `this`:** `events.push`, `foes.map`, `foes.map().filter`, `pending.push`.
- **Numeric comparisons:** `this.foes[e.target].hp<=0`; `this.shield.amount===0`; `h<3`; `h<9`; `this.foes[h].hp>0`; `Math.hypot(this.points[h].x-n.x,this.points[h].y-n.y)<=300`; `d===0`; `d===1`; `d===0`; `e.phase===8`; `c.hp<=0`; `r*o>0` … (+1).

### `ok.resolve(e)`
- **CONFIRMED location:** UTF-16 `[ 228525, 230073 )`, UTF-8 bytes `[ 232818, 234366 )`, physical line 237, columns 84909–86457.
- **Syntactic calls:** `El.findIndex`, `Math.hypot`, `Math.max`, `Math.min`, `this.events.push`, `this.foes.flatMap`, `this.learned`, `this.pending.push`, `ua`.
- **Calls through `this`:** `events.push`, `foes.flatMap`, `learned`, `pending.push`.
- **Numeric comparisons:** `El.findIndex(i=>i.id===e.skill)>=5`; `u.hp>0`; `(f*o+x*l)/Math.max(1,v)>=.35`; `d*p>0`.

### `ok.advanceTo(e)`
- **CONFIRMED location:** UTF-16 `[ 230073, 230835 )`, UTF-8 bytes `[ 234366, 235128 )`, physical line 237, columns 86457–87219.
- **Syntactic calls:** `Math.floor`, `Math.max`, `Math.min`, `this.cast`, `this.commands.map`, `this.pending.filter`, `this.reset`, `this.resolve`.
- **Calls through `this`:** `cast`, `commands.map`, `pending.filter`, `reset`, `resolve`.

### `ok.snapshot()`
- **CONFIRMED location:** UTF-16 `[ 230835, 231181 )`, UTF-8 bytes `[ 235128, 235474 )`, physical line 237, columns 87219–87565.
- **Syntactic calls:** `this.events.map`, `this.foeAt`, `this.foes.map`, `this.foes.reduce`, `this.heroAt`, `this.points.map`.
- **Calls through `this`:** `events.map`, `foeAt`, `foes.map`, `foes.reduce`, `heroAt`, `points.map`.
