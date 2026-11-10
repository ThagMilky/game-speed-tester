# Class `$k` — Combat attack streaks

**Source range:** `$k` [UTF-16 271304–279181, line 237].
**Role:** Produces swing and projectile trails, effects, screen-space hit visualization. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 10.

Methods and evidence (calls collected include nested callbacks):

### `$k.constructor(e, t)`
- **CONFIRMED location:** UTF-16 `[ 271313, 272059 )`, UTF-8 bytes `[ 275606, 276352 )`, physical line 237, columns 127697–128443.
- **Syntactic calls:** `Float32Array`, `M`, `Map`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.graphics().setDepth().setBlendMode`, `et.Math.Vector2`, `i`, `this.bolts.push`, `this.pts.push`, `this.swings.push`.
- **Calls through `this`:** `bolts.push`, `pts.push`, `swings.push`.
- **Imported alias name matches (potential):** `et`.

### `$k.swing(e, t, i, n, s, o, l, r, h)`
- **CONFIRMED location:** UTF-16 `[ 272059, 272848 )`, UTF-8 bytes `[ 276352, 277141 )`, physical line 237, columns 128443–129232.
- **Syntactic calls:** `Jy`, `Math.atan2`, `Math.cos`, `Math.hypot`, `Math.max`, `Object.assign`, `c.kind.glow.slice`, `nb`, `parseInt`, `sb`, `this.fire`, `this.host.juice.knock`, `this.stepOf.get`, `this.stepOf.set`, `this.swings.find`, `this.swings.reduce`, `vu.vung`.
- **Calls through `this`:** `fire`, `host.juice.knock`, `stepOf.get`, `stepOf.set`, `swings.find`, `swings.reduce`.
- **Imported alias name matches (potential):** `Jy`, `nb`, `sb`, `vu`.
- **Numeric comparisons:** `Math.cos(g)>=0`.

### `$k.hit(e, t, i, n, s, o, l)`
- **CONFIRMED location:** UTF-16 `[ 272848, 273847 )`, UTF-8 bytes `[ 277141, 278140 )`, physical line 237, columns 129232–130231.
- **Syntactic calls:** `Fs`, `Math.atan2`, `Math.hypot`, `Math.min`, `Math.sign`, `c.chips`, `c.flash`, `c.knock`, `c.number`, `c.shake`, `c.sparks`, `c.stop`, `this.host.actor`, `this.swings.find`, `vu.trung`.
- **Calls through `this`:** `host.actor`, `swings.find`.
- **Imported alias name matches (potential):** `Fs`, `vu`.
- **Numeric comparisons:** `r.step===3`; `r.tier>=2`; `r.kind.heavy===2`; `r.kind.heavy===2`.

### `$k.fire(e, t)`
- **CONFIRMED location:** UTF-16 `[ 273847, 274420 )`, UTF-8 bytes `[ 278140, 278713 )`, physical line 237, columns 130231–130804.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Object.assign`, `this.bolts.find`.
- **Calls through `this`:** `bolts.find`.
- **Imported alias name matches (potential):** `de`.
- **Numeric comparisons:** `e.tier>=2`.

### `$k.active()`
- **CONFIRMED location:** UTF-16 `[ 274420, 274452 )`, UTF-8 bytes `[ 278713, 278745 )`, physical line 237, columns 130804–130836.
- **Syntactic calls:** (none observed).
- **Numeric comparisons:** `this.live>0`.

### `$k.update(e)`
- **CONFIRMED location:** UTF-16 `[ 274452, 275854 )`, UTF-8 bytes `[ 278745, 280147 )`, physical line 237, columns 130836–132238.
- **Syntactic calls:** `$r`, `Math.abs`, `Math.ceil`, `Math.max`, `Math.min`, `Math.sin`, `Number.isNaN`, `Yu`, `o.syncHeld`, `this.draw`, `this.drawBolt`, `this.g.clear`, `this.gAdd.clear`, `this.host.juice.rate`, `this.push`, `this.reachPx`.
- **Calls through `this`:** `draw`, `drawBolt`, `g.clear`, `gAdd.clear`, `host.juice.rate`, `push`, `reachPx`.
- **Numeric comparisons:** `this.live<=0`; `r<0`; `r<=1`; `r>=0`; `r<=1.05`.

### `$k.reachPx(e, t)`
- **CONFIRMED location:** UTF-16 `[ 275854, 276014 )`, UTF-8 bytes `[ 280147, 280307 )`, physical line 237, columns 132238–132398.
- **Syntactic calls:** `Math.hypot`, `Math.max`, `Math.min`.
- **Imported alias name matches (potential):** `de`.

### `$k.push(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 276014, 276359 )`, UTF-8 bytes `[ 280307, 280652 )`, physical line 237, columns 132398–132743.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `c.copyWithin`, `d.copyWithin`, `e.cx.copyWithin`, `e.cy.copyWithin`, `h.copyWithin`.

### `$k.draw(e, t)`
- **CONFIRMED location:** UTF-16 `[ 276359, 277903 )`, UTF-8 bytes `[ 280652, 282196 )`, physical line 237, columns 132743–134287.
- **Syntactic calls:** `Math.hypot`, `Math.max`, `Math.min`, `Math.round`, `this.g.fillStyle`, `this.g.fillStyle().fillPoints`, `this.gAdd.lineStyle`, `this.gAdd.lineStyle().strokePoints`, `this.host.juice.particle`, `x[UpdateExpression].set`.
- **Calls through `this`:** `g.fillStyle`, `g.fillStyle().fillPoints`, `gAdd.lineStyle`, `gAdd.lineStyle().strokePoints`, `host.juice.particle`.
- **Numeric comparisons:** `e.tier>=2`; `e.tier===1`; `e.step===3`; `d<2`; `f<0`; `g<2`; `e.tier>=2`; `e.tier===3`; `e.tier===3`; `e.tier===2`; `(o*60|0)%6===0`; `k>.5` … (+5).

### `$k.drawBolt(e, t)`
- **CONFIRMED location:** UTF-16 `[ 277903, 279180 )`, UTF-8 bytes `[ 282196, 283473 )`, physical line 237, columns 134287–135564.
- **Syntactic calls:** `$r`, `Math.atan2`, `Math.hypot`, `Math.min`, `Math.round`, `Math.sin`, `this.g.fillStyle`, `this.g.fillStyle().fillRect`, `this.g.lineStyle`, `this.g.lineStyle().beginPath`, `this.g.lineStyle().beginPath().arc`, `this.g.lineStyle().beginPath().arc().strokePath`, `this.g.lineStyle().lineBetween`, `this.gAdd.fillStyle`, `this.gAdd.fillStyle().fillRect`, `this.gAdd.lineStyle`, `this.gAdd.lineStyle().beginPath`, `this.gAdd.lineStyle().beginPath().arc`, `this.gAdd.lineStyle().beginPath().arc().strokePath`, `this.gAdd.lineStyle().lineBetween`, `this.host.juice.particle`, `this.host.juice.sparks`.
- **Calls through `this`:** `g.fillStyle`, `g.fillStyle().fillRect`, `g.lineStyle`, `g.lineStyle().beginPath`, `g.lineStyle().beginPath().arc`, `g.lineStyle().beginPath().arc().strokePath`, `g.lineStyle().lineBetween`, `gAdd.fillStyle`, `gAdd.fillStyle().fillRect`, `gAdd.lineStyle`, `gAdd.lineStyle().beginPath`, `gAdd.lineStyle().beginPath().arc`, `gAdd.lineStyle().beginPath().arc().strokePath`, `gAdd.lineStyle().lineBetween`, `host.juice.particle`, `host.juice.sparks`.
- **Numeric comparisons:** `i>1.6`; `i<0`; `i<=1`; `i>=1`; `i-t/e.life<1`; `u<3`; `i>=1`; `i-t/e.life<1`.
