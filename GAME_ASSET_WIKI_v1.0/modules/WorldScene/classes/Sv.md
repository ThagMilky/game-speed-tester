# Class `Sv` — Cultivation and tribulation visuals

**Source range:** `Sv` [UTF-16 124936–128377, line 221].
**Role:** Draws meditation, breakthrough, lightning and telegraph effects. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 7.

Methods and evidence (calls collected include nested callbacks):

### `Sv.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 124945, 125026 )`, UTF-8 bytes `[ 126340, 126421 )`, physical line 221, columns 36389–36470.
- **Syntactic calls:** `M`, `Map`.

### `Sv.windup(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 125026, 125696 )`, UTF-8 bytes `[ 126421, 127091 )`, physical line 221, columns 36470–37140.
- **Syntactic calls:** `Math.max`, `Math.round`, `d.remove`, `e.toFixed`, `jt.play`, `r.once`, `t.toFixed`, `this.prepared.set`, `this.scene.add.image`, `this.scene.add.image().setOrigin`, `this.scene.add.image().setOrigin().setTint`, `this.scene.add.image().setOrigin().setTint().setDepth`, `this.scene.add.image().setOrigin().setTint().setDepth().setDisplaySize`, `this.scene.add.image().setOrigin().setTint().setDepth().setDisplaySize().setAlpha`, `this.scene.time.delayedCall`, `this.scene.tweens.add`.
- **Calls through `this`:** `prepared.set`, `scene.add.image`, `scene.add.image().setOrigin`, `scene.add.image().setOrigin().setTint`, `scene.add.image().setOrigin().setTint().setDepth`, `scene.add.image().setOrigin().setTint().setDepth().setDisplaySize`, `scene.add.image().setOrigin().setTint().setDepth().setDisplaySize().setAlpha`, `scene.time.delayedCall`, `scene.tweens.add`.
- **Numeric comparisons:** `i>1.2`.

### `Sv.gather(e, t)`
- **CONFIRMED location:** UTF-16 `[ 125696, 125833 )`, UTF-8 bytes `[ 127091, 127228 )`, physical line 221, columns 37140–37277.
- **Syntactic calls:** `jt.play`.
- **Numeric comparisons:** `i<3`; `i===1`.

### `Sv.meditate(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 125833, 127062 )`, UTF-8 bytes `[ 127228, 128457 )`, physical line 221, columns 37277–38506.
- **Syntactic calls:** `C.fillStyle`, `C.fillStyle().fillRect`, `Iu`, `Math.cos`, `Math.max`, `Math.min`, `Math.pow`, `Math.round`, `Math.sin`, `k`, `s.back.clear`, `s.back.clear().setDepth`, `s.back.destroy`, `s.front.clear`, `s.front.clear().setDepth`, `s.front.destroy`, `s.seal.destroy`, `s.seal.setPosition`, `s.seal.setPosition().setScale`, `s.seal.setPosition().setScale().setDepth`, `s.seal.setPosition().setScale().setDepth().setAlpha`, `this.entries.delete`, `this.entries.get`, `this.entries.set`, `this.scene.add.graphics`, `this.scene.add.image`, `this.scene.add.image().setOrigin`, `this.scene.add.image().setOrigin().setTint`, `xo`.
- **Calls through `this`:** `entries.delete`, `entries.get`, `entries.set`, `scene.add.graphics`, `scene.add.image`, `scene.add.image().setOrigin`, `scene.add.image().setOrigin().setTint`.
- **Numeric comparisons:** `o<.6`; `N>=1`.

### `Sv.remove(e)`
- **CONFIRMED location:** UTF-16 `[ 127062, 127180 )`, UTF-8 bytes `[ 128457, 128575 )`, physical line 221, columns 38506–38624.
- **Syntactic calls:** `t.back.destroy`, `t.front.destroy`, `t.seal.destroy`, `this.entries.delete`, `this.entries.get`.
- **Calls through `this`:** `entries.delete`, `entries.get`.

### `Sv.breakthrough(e, t)`
- **CONFIRMED location:** UTF-16 `[ 127180, 127891 )`, UTF-8 bytes `[ 128575, 129286 )`, physical line 221, columns 38624–39335.
- **Syntactic calls:** `Iu`, `Math.cos`, `Math.round`, `Math.sin`, `jt.play`, `s.clear`, `s.destroy`, `s.fillStyle`, `s.fillStyle().fillRect`, `this.scene.add.graphics`, `this.scene.add.graphics().setDepth`, `this.scene.tweens.add`, `xo`.
- **Calls through `this`:** `scene.add.graphics`, `scene.add.graphics().setDepth`, `scene.tweens.add`.
- **Numeric comparisons:** `l<54`.

### `Sv.thunder(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 127891, 128376 )`, UTF-8 bytes `[ 129286, 129771 )`, physical line 221, columns 39335–39820.
- **Syntactic calls:** `Math.round`, `e.toFixed`, `jt.play`, `t.toFixed`, `this.prepared.delete`, `this.prepared.get`.
- **Calls through `this`:** `prepared.delete`, `prepared.get`.
- **Numeric comparisons:** `this.scene.time.now-r>3e3`; `this.scene.time.now-o>1e3`.
