# Class `xm` — Aura-like effects

**Source range:** `xm` [UTF-16 733030–734710, line 965].
**Role:** Preloaded short-lived effect rendering. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 6.

Methods and evidence (calls collected include nested callbacks):

### `xm.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 733039, 733341 )`, UTF-8 bytes `[ 752017, 752319 )`, physical line 965, columns 11666–11968.
- **Syntactic calls:** `M`, `e.add.graphics`, `e.add.graphics().setBlendMode`, `e.add.graphics().setBlendMode().setVisible`, `e.add.image`, `e.add.image().setOrigin`, `e.add.image().setOrigin().setBlendMode`, `e.add.image().setOrigin().setBlendMode().setVisible`, `e.add.image().setOrigin().setVisible`.
- **Imported alias name matches (potential):** `et`.

### `xm.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 733341, 733412 )`, UTF-8 bytes `[ 752319, 752390 )`, physical line 965, columns 11968–12039.
- **Syntactic calls:** `e.load.image`.

### `xm.render(e, t, i, n, s, o)`
- **CONFIRMED location:** UTF-16 `[ 733412, 734388 )`, UTF-8 bytes `[ 752390, 753366 )`, physical line 965, columns 12039–13015.
- **Syntactic calls:** `Math.cos`, `Math.max`, `Math.round`, `Math.sin`, `this.glow.setPosition`, `this.glow.setPosition().setScale`, `this.glow.setPosition().setScale().setDepth`, `this.glow.setPosition().setScale().setDepth().setAlpha`, `this.glow.setPosition().setScale().setDepth().setAlpha().setVisible`, `this.lights.clear`, `this.lights.clear().setDepth`, `this.lights.clear().setDepth().setVisible`, `this.lights.fillStyle`, `this.lights.fillStyle().fillRect`, `this.lights.fillStyle().fillRect().fillRect`, `this.seal.setPosition`, `this.seal.setPosition().setScale`, `this.seal.setPosition().setScale().setDepth`, `this.seal.setPosition().setScale().setDepth().setAlpha`, `this.seal.setPosition().setScale().setDepth().setAlpha().setVisible`.
- **Calls through `this`:** `glow.setPosition`, `glow.setPosition().setScale`, `glow.setPosition().setScale().setDepth`, `glow.setPosition().setScale().setDepth().setAlpha`, `glow.setPosition().setScale().setDepth().setAlpha().setVisible`, `lights.clear`, `lights.clear().setDepth`, `lights.clear().setDepth().setVisible`, `lights.fillStyle`, `lights.fillStyle().fillRect`, `lights.fillStyle().fillRect().fillRect`, `seal.setPosition`, `seal.setPosition().setScale`, `seal.setPosition().setScale().setDepth`, `seal.setPosition().setScale().setDepth().setAlpha`, `seal.setPosition().setScale().setDepth().setAlpha().setVisible`.
- **Numeric comparisons:** `c<2`; `d<18`; `d<3`; `d<3`; `c<12`; `c%3===0`.

### `xm.hide()`
- **CONFIRMED location:** UTF-16 `[ 734388, 734480 )`, UTF-8 bytes `[ 753366, 753458 )`, physical line 965, columns 13015–13107.
- **Syntactic calls:** `this.glow.setVisible`, `this.lights.clear`, `this.lights.clear().setVisible`, `this.seal.setVisible`.
- **Calls through `this`:** `glow.setVisible`, `lights.clear`, `lights.clear().setVisible`, `seal.setVisible`.

### `xm.inspect()`
- **CONFIRMED location:** UTF-16 `[ 734480, 734637 )`, UTF-8 bytes `[ 753458, 753615 )`, physical line 965, columns 13107–13264.
- **Syntactic calls:** (none observed).

### `xm.destroy()`
- **CONFIRMED location:** UTF-16 `[ 734637, 734709 )`, UTF-8 bytes `[ 753615, 753687 )`, physical line 965, columns 13264–13336.
- **Syntactic calls:** `this.glow.destroy`, `this.lights.destroy`, `this.seal.destroy`.
- **Calls through `this`:** `glow.destroy`, `lights.destroy`, `seal.destroy`.
