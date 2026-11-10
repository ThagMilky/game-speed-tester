# Class `Su` — Weapon proc visuals

**Source range:** `Su` [UTF-16 92634–93594, line 221].
**Role:** Short animated weapon-hit effects, containers, maximum concurrently active effects. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 4.

Methods and evidence (calls collected include nested callbacks):

### `Su.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 92643, 92691 )`, UTF-8 bytes `[ 94038, 94086 )`, physical line 221, columns 4087–4135.
- **Syntactic calls:** `M`.

### `Su.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 92691, 92723 )`, UTF-8 bytes `[ 94086, 94118 )`, physical line 221, columns 4135–4167.
- **Syntactic calls:** `yu.preload`.
- **Imported alias name matches (potential):** `yu`.

### `Su.play(e, t, i, n=.18)`
- **CONFIRMED location:** UTF-16 `[ 92723, 93384 )`, UTF-8 bytes `[ 94118, 94779 )`, physical line 221, columns 4167–4828.
- **Syntactic calls:** `Set`, `Uy.find`, `h.add`, `o.has`, `this.active.push`, `this.active.shift`, `this.active.shift().container.destroy`, `this.scene.add.container`, `this.scene.add.container().setDepth`, `this.scene.add.container().setDepth().setScale`, `yu`.
- **Calls through `this`:** `active.push`, `active.shift`, `active.shift().container.destroy`, `scene.add.container`, `scene.add.container().setDepth`, `scene.add.container().setDepth().setScale`.
- **Imported alias name matches (potential):** `Uy`, `Yy`, `rd`, `yu`.
- **Numeric comparisons:** `this.active.length>=8`.

### `Su.update()`
- **CONFIRMED location:** UTF-16 `[ 93384, 93593 )`, UTF-8 bytes `[ 94779, 94988 )`, physical line 221, columns 4828–5037.
- **Syntactic calls:** `t.container.destroy`, `t.fx.render`, `this.active.indexOf`, `this.active.splice`.
- **Calls through `this`:** `active.indexOf`, `active.splice`.
- **Numeric comparisons:** `i>=2.2`.
