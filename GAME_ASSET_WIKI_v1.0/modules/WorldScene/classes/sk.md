# Class `sk` — Cinematic skill effect renderer

**Source range:** `sk` [UTF-16 206632–219506, line 237].
**Role:** Orchestrates skill shots, nest, projectiles, lines, bubbles, king poses for showcase. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 16.

Methods and evidence (calls collected include nested callbacks):

### `sk.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 206641, 207005 )`, UTF-8 bytes `[ 210481, 210845 )`, physical line 237, columns 63025–63389.
- **Syntactic calls:** `Array.from`, `M`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.image`, `e.add.image().setVisible`, `e.add.image().setVisible().setName`, `jt.ensure`.

### `sk.image(e, t, i, n, s=1, o=60)`
- **CONFIRMED location:** UTF-16 `[ 207005, 207233 )`, UTF-8 bytes `[ 210845, 211073 )`, physical line 237, columns 63389–63617.
- **Syntactic calls:** `Di`, `l.setTexture`, `l.setTexture().setPosition`, `l.setTexture().setPosition().setOrigin`, `l.setTexture().setPosition().setOrigin().setScale`, `l.setTexture().setPosition().setOrigin().setScale().setRotation`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha().setDepth`, `l.setTexture().setPosition().setOrigin().setScale().setRotation().setFlipX().clearTint().setAlpha().setDepth().setVisible`.
- **Numeric comparisons:** `s>.005`.

### `sk.clip(e, t, i, n, s=1, o=60)`
- **CONFIRMED location:** UTF-16 `[ 207233, 207375 )`, UTF-8 bytes `[ 211073, 211215 )`, physical line 237, columns 63617–63759.
- **Syntactic calls:** `Math.floor`, `jt.clip`, `jt.frameKey`, `this.image`.
- **Calls through `this`:** `image`.
- **Numeric comparisons:** `t<0`.

### `sk.nest(e, t, i, n=1, s=60)`
- **CONFIRMED location:** UTF-16 `[ 207375, 207481 )`, UTF-8 bytes `[ 211215, 211321 )`, physical line 237, columns 63759–63865.
- **Syntactic calls:** `o.setOrigin`, `this.image`.
- **Calls through `this`:** `image`.

### `sk.line(e, t, i, n, s=1)`
- **CONFIRMED location:** UTF-16 `[ 207481, 207630 )`, UTF-8 bytes `[ 211321, 211470 )`, physical line 237, columns 63865–64014.
- **Syntactic calls:** `e.lineStyle`, `e.lineStyle().beginPath`, `e.lineStyle().beginPath().moveTo`, `e.lineTo`, `e.strokePath`, `t.slice`.
- **Numeric comparisons:** `t.length<2`.

### `sk.ring(e, t, i, n=ge, s=0, o=!1)`
- **CONFIRMED location:** UTF-16 `[ 207630, 207948 )`, UTF-8 bytes `[ 211470, 211788 )`, physical line 237, columns 64014–64332.
- **Syntactic calls:** `Array.from`, `Math.cos`, `Math.sin`, `this.line`.
- **Calls through `this`:** `line`.
- **Numeric comparisons:** `r<12`.

### `sk.ribbon(e, t, i=1, n=ge)`
- **CONFIRMED location:** UTF-16 `[ 207948, 208402 )`, UTF-8 bytes `[ 211788, 212242 )`, physical line 237, columns 64332–64786.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.max`, `Math.min`, `Math.sin`, `e.forEach`, `l.push`, `r.push`, `this.air.fillPoints`, `this.air.fillStyle`.
- **Calls through `this`:** `air.fillPoints`, `air.fillStyle`.
- **Numeric comparisons:** `e.length<2`.

### `sk.motes(e, t, i, n, s=is)`
- **CONFIRMED location:** UTF-16 `[ 208402, 208631 )`, UTF-8 bytes `[ 212242, 212471 )`, physical line 237, columns 64786–65015.
- **Syntactic calls:** `Di`, `Math.cos`, `Math.sin`, `pa`, `this.air.fillStyle`, `this.air.fillStyle().fillRect`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillRect`.

### `sk.travel(e, t, i, n, s=45, o=ge, l=.7)`
- **CONFIRMED location:** UTF-16 `[ 208631, 209023 )`, UTF-8 bytes `[ 212471, 212863 )`, physical line 237, columns 65015–65407.
- **Syntactic calls:** `Array.from`, `Di`, `Math.max`, `Math.sin`, `Ut`, `h.setFlipX`, `ns`, `r`, `this.air.fillStyle`, `this.air.fillStyle().fillRect`, `this.clip`, `this.ribbon`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillRect`, `clip`, `ribbon`.
- **Numeric comparisons:** `i<0`; `i>1`; `c<3`.

### `sk.burst(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 209023, 210334 )`, UTF-8 bytes `[ 212863, 214174 )`, physical line 237, columns 65407–66718.
- **Syntactic calls:** `Af`, `Di`, `Math.cos`, `Math.floor`, `Math.min`, `Math.sin`, `Math.sqrt`, `Ut`, `h.setTint`, `pa`, `this.air.fillStyle`, `this.air.fillStyle().fillEllipse`, `this.clip`, `this.floor.fillStyle`, `this.floor.fillStyle().fillEllipse`, `this.motes`, `this.nest`, `this.ribbon`, `this.ring`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillEllipse`, `clip`, `floor.fillStyle`, `floor.fillStyle().fillEllipse`, `motes`, `nest`, `ribbon`, `ring`.
- **Numeric comparisons:** `s<0`; `c<9`; `s<.7`; `p<8`; `c<26`; `u>1`; `c%5===0`.

### `sk.kingPoint(e, t)`
- **CONFIRMED location:** UTF-16 `[ 210334, 210482 )`, UTF-8 bytes `[ 214174, 214322 )`, physical line 237, columns 66718–66866.
- **Syntactic calls:** `Math.sin`, `_s`.

### `sk.cloud(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 210482, 210908 )`, UTF-8 bytes `[ 214322, 214748 )`, physical line 237, columns 66866–67292.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Ut`, `this.floor.fillStyle`, `this.floor.fillStyle().fillEllipse`, `this.motes`, `this.nest`, `this.ring`.
- **Calls through `this`:** `floor.fillStyle`, `floor.fillStyle().fillEllipse`, `motes`, `nest`, `ring`.
- **Numeric comparisons:** `n<0`; `n>4.4`; `l<7`.

### `sk.kingPose(e, t)`
- **CONFIRMED location:** UTF-16 `[ 210908, 211611 )`, UTF-8 bytes `[ 214748, 215451 )`, physical line 237, columns 67292–67995.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.round`, `Math.sin`, `Ut`, `_s`, `ns`, `this.kingPoint`.
- **Calls through `this`:** `kingPoint`.
- **Numeric comparisons:** `p<1`.

### `sk.learned(e, t)`
- **CONFIRMED location:** UTF-16 `[ 211611, 214385 )`, UTF-8 bytes `[ 215451, 218225 )`, physical line 237, columns 67995–70769.
- **Syntactic calls:** `Array.from`, `ArrayExpression.includes`, `Math.cos`, `Math.max`, `Math.sin`, `Ut`, `_s`, `e.hosts.findIndex`, `f.includes`, `l.setTint`, `ns`, `o.setTint`, `pa`, `r.setTint`, `s.setTint`, `this.burst`, `this.clip`, `this.line`, `this.ring`, `this.travel`.
- **Calls through `this`:** `burst`, `clip`, `line`, `ring`, `travel`.
- **Numeric comparisons:** `c<0`; `c<.8`; `c<.55`; `c<2.8`; `g<12`; `x<4`; `c<4.4`; `g<8`; `Math.sin(f)<0`; `g<3`; `x>=0`; `x<1` … (+12).

### `sk.render(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 214385, 219374 )`, UTF-8 bytes `[ 218225, 223214 )`, physical line 237, columns 70769–75758.
- **Syntactic calls:** `Array.from`, `Di`, `LogicalExpression.forEach`, `Math.atan2`, `Math.cos`, `Math.floor`, `Math.max`, `Math.min`, `Math.sin`, `Ut`, `_s`, `c.setRotation`, `c.setRotation().setTint`, `d.setRotation`, `e.events.filter`, `e.events.filter().at`, `h.setTint`, `ns`, `p.setVisible`, `r.setTint`, `s.targets.forEach`, `this.air.clear`, `this.air.fillStyle`, `this.air.fillStyle().fillRect`, `this.air.fillStyle().fillRect().fillRect`, `this.burst`, `this.clip`, `this.cloud`, `this.floor.clear`, `this.floor.fillStyle` … (+12 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `air.clear`, `air.fillStyle`, `air.fillStyle().fillRect`, `air.fillStyle().fillRect().fillRect`, `burst`, `clip`, `cloud`, `floor.clear`, `floor.fillStyle`, `floor.fillStyle().fillEllipse`, `kingPoint`, `kingPose`, `learned`, `motes`, `nest`, `ribbon`, `ring`, `sprites.forEach`, `travel`.
- **Numeric comparisons:** `m.hp<=0`; `g===3`; `Math.sin(v)<0`; `x<2`; `u<1.3`; `v<3`; `k<8`; `u<.42`; `u<.85`; `g<5`; `u<.85`; `f<3` … (+9).

### `sk.inspect()`
- **CONFIRMED location:** UTF-16 `[ 219374, 219505 )`, UTF-8 bytes `[ 223214, 223345 )`, physical line 237, columns 75758–75889.
- **Syntactic calls:** `this.sprites.filter`.
- **Calls through `this`:** `sprites.filter`.
