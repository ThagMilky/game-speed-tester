# Class `rk` — Cinematic blood/demon renderer

**Source range:** `rk` [UTF-16 231371–243247, line 237].
**Role:** Draws flame, eruptions, fissures, talons, rings and particles. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 15.

Methods and evidence (calls collected include nested callbacks):

### `rk.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 231380, 231706 )`, UTF-8 bytes `[ 235673, 235999 )`, physical line 237, columns 87764–88090.
- **Syntactic calls:** `Array.from`, `M`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.image`, `e.add.image().setVisible`, `jt.ensure`.

### `rk.image(e, t, i, n, s=1, o=60)`
- **CONFIRMED location:** UTF-16 `[ 231706, 231938 )`, UTF-8 bytes `[ 235999, 236231 )`, physical line 237, columns 88090–88322.
- **Syntactic calls:** `Oe`, `Pt`, `l.setTexture`, `l.setTexture().setPosition`, `l.setTexture().setPosition().setOrigin`, `l.setTexture().setPosition().setOrigin().setScale`, `l.setTexture().setPosition().setOrigin().setScale().setRotation`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha().setDepth`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha().setDepth().setVisible`.
- **Numeric comparisons:** `s>.005`.

### `rk.clip(e, t, i, n, s=1, o=60)`
- **CONFIRMED location:** UTF-16 `[ 231938, 232080 )`, UTF-8 bytes `[ 236231, 236373 )`, physical line 237, columns 88322–88464.
- **Syntactic calls:** `Math.floor`, `jt.clip`, `jt.frameKey`, `this.image`.
- **Calls through `this`:** `image`.
- **Numeric comparisons:** `t<0`.

### `rk.flame(e, t, i, n=1, s=60)`
- **CONFIRMED location:** UTF-16 `[ 232080, 232185 )`, UTF-8 bytes `[ 236373, 236478 )`, physical line 237, columns 88464–88569.
- **Syntactic calls:** `o.setOrigin`, `this.image`.
- **Calls through `this`:** `image`.

### `rk.line(e, t, i, n, s=1)`
- **CONFIRMED location:** UTF-16 `[ 232185, 232350 )`, UTF-8 bytes `[ 236478, 236643 )`, physical line 237, columns 88569–88734.
- **Syntactic calls:** `Oe`, `e.lineStyle`, `e.lineStyle().beginPath`, `e.lineStyle().beginPath().moveTo`, `e.lineTo`, `e.strokePath`, `t.slice`.
- **Numeric comparisons:** `t.length<2`.

### `rk.ring(e, t, i, n=fe, s=0, o=!1)`
- **CONFIRMED location:** UTF-16 `[ 232350, 232664 )`, UTF-8 bytes `[ 236643, 236957 )`, physical line 237, columns 88734–89048.
- **Syntactic calls:** `Array.from`, `Math.cos`, `Math.sin`, `this.line`.
- **Calls through `this`:** `line`.
- **Numeric comparisons:** `l<16`.

### `rk.ribbon(e, t, i=1)`
- **CONFIRMED location:** UTF-16 `[ 232664, 233142 )`, UTF-8 bytes `[ 236957, 237435 )`, physical line 237, columns 89048–89526.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.max`, `Math.min`, `Math.sin`, `Oe`, `e.forEach`, `l.push`, `o.push`, `this.air.fillPoints`, `this.air.fillStyle`.
- **Calls through `this`:** `air.fillPoints`, `air.fillStyle`.
- **Numeric comparisons:** `e.length<2`; `i<=0`.

### `rk.motes(e, t, i, n, s=90, o=1)`
- **CONFIRMED location:** UTF-16 `[ 233142, 233373 )`, UTF-8 bytes `[ 237435, 237666 )`, physical line 237, columns 89526–89757.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Oe`, `this.air.fillStyle`, `this.air.fillStyle().fillRect`, `vr`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillRect`.

### `rk.debris(e, t, i, n=15)`
- **CONFIRMED location:** UTF-16 `[ 233373, 233693 )`, UTF-8 bytes `[ 237666, 237986 )`, physical line 237, columns 89757–90077.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Pt`, `s.setRotation`, `this.image`, `vr`.
- **Calls through `this`:** `image`.
- **Numeric comparisons:** `r<0`; `r>1`.

### `rk.fissures(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 233693, 233987 )`, UTF-8 bytes `[ 237986, 238280 )`, physical line 237, columns 90077–90371.
- **Syntactic calls:** `Array.from`, `Math.cos`, `Math.sin`, `Pt`, `this.line`.
- **Calls through `this`:** `line`.
- **Numeric comparisons:** `s<9`.

### `rk.talons(e, t, i, n=!1, s=Fc[e.target])`
- **CONFIRMED location:** UTF-16 `[ 233987, 234543 )`, UTF-8 bytes `[ 238280, 238836 )`, physical line 237, columns 90371–90927.
- **Syntactic calls:** `Array.from`, `Math.atan2`, `Math.ceil`, `Math.cos`, `Math.floor`, `Math.max`, `Math.sin`, `Pt`, `Xe`, `this.ribbon`, `u.slice`.
- **Calls through `this`:** `ribbon`.
- **Numeric comparisons:** `l<0`; `l>1.6`.

### `rk.eruption(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 234543, 235170 )`, UTF-8 bytes `[ 238836, 239463 )`, physical line 237, columns 90927–91554.
- **Syntactic calls:** `Math.cos`, `Math.floor`, `Math.min`, `Math.sin`, `Math.sqrt`, `Pt`, `Xe`, `this.debris`, `this.fissures`, `this.flame`, `this.floor.fillStyle`, `this.floor.fillStyle().fillEllipse`, `this.motes`, `this.ring`.
- **Calls through `this`:** `debris`, `fissures`, `flame`, `floor.fillStyle`, `floor.fillStyle().fillEllipse`, `motes`, `ring`.
- **Numeric comparisons:** `t<0`; `m<0`; `m>1.1`.

### `rk.learned(e, t)`
- **CONFIRMED location:** UTF-16 `[ 235170, 239761 )`, UTF-8 bytes `[ 239463, 244054 )`, physical line 237, columns 91554–96145.
- **Syntactic calls:** `Array.from`, `Math.cos`, `Math.floor`, `Math.hypot`, `Math.max`, `Math.sin`, `Math.sqrt`, `Oe`, `Pt`, `Xe`, `e.events.filter`, `e.foeAt`, `e.foes.map`, `e.foes.map().filter`, `e.foes.map().filter().sort`, `e.foes.map().filter().sort().slice`, `e.heroAt`, `f`, `g.at`, `h.setFlipX`, `l.setOrigin`, `o`, `pi`, `r.setOrigin`, `this.air.lineStyle`, `this.air.lineStyle().strokeEllipse`, `this.clip`, `this.eruption`, `this.floor.fillStyle`, `this.floor.fillStyle().fillEllipse` … (+5 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `air.lineStyle`, `air.lineStyle().strokeEllipse`, `clip`, `eruption`, `floor.fillStyle`, `floor.fillStyle().fillEllipse`, `image`, `line`, `motes`, `ribbon`, `ring`.
- **Numeric comparisons:** `d<0`; `d<2.3`; `x<.8`; `x<1.7`; `d>.25`; `d<.8`; `e.foes[f].hp>0`; `d<2.4`; `v<2`; `d<.5`; `f<3`; `d<4.4` … (+24).

### `rk.render(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 239761, 243093 )`, UTF-8 bytes `[ 244054, 247386 )`, physical line 237, columns 96145–99477.
- **Syntactic calls:** `Array.from`, `Math.abs`, `Math.cos`, `Math.floor`, `Math.min`, `Math.sin`, `Oe`, `Pt`, `Xe`, `ak`, `e.events.some`, `e.foeAt`, `e.heroAt`, `g`, `l.setVisible`, `o.setOrigin`, `o.setOrigin().setTintFill`, `pi`, `this.air.clear`, `this.air.fillStyle`, `this.air.fillStyle().fillCircle`, `this.clip`, `this.debris`, `this.eruption`, `this.flame`, `this.floor.clear`, `this.image`, `this.learned`, `this.motes`, `this.ribbon` … (+3 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `air.clear`, `air.fillStyle`, `air.fillStyle().fillCircle`, `clip`, `debris`, `eruption`, `flame`, `floor.clear`, `image`, `learned`, `motes`, `ribbon`, `ring`, `sprites.forEach`, `talons`.
- **Numeric comparisons:** `e.foes[i].hp>0`; `e.qi>1`; `e.qi>85`; `r<4`; `r<0`; `r>3`; `r>.14`; `r<.85`; `u<=4`; `r<1.15`; `u<3`; `r<.85` … (+12).

### `rk.inspect()`
- **CONFIRMED location:** UTF-16 `[ 243093, 243246 )`, UTF-8 bytes `[ 247386, 247539 )`, physical line 237, columns 99477–99630.
- **Syntactic calls:** `this.sprites.filter`.
- **Calls through `this`:** `sprites.filter`.
