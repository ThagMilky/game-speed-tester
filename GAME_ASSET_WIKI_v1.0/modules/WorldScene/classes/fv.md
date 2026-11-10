# Class `fv` — Status icon HUD

**Source range:** `fv` [UTF-16 94072–95498, line 221].
**Role:** Status flag sorting, icon pooling, remaining-time progress indicators. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 5.

Methods and evidence (calls collected include nested callbacks):

### `fv.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 94081, 94361 )`, UTF-8 bytes `[ 95476, 95756 )`, physical line 221, columns 5525–5805.
- **Syntactic calls:** `M`, `Map`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.load.isLoading`, `e.load.spritesheet`, `e.load.start`, `e.textures.exists`.

### `fv.begin()`
- **CONFIRMED location:** UTF-16 `[ 94361, 94396 )`, UTF-8 bytes `[ 95756, 95791 )`, physical line 221, columns 5805–5840.
- **Syntactic calls:** `this.g.clear`.
- **Calls through `this`:** `g.clear`.

### `fv.draw(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 94396, 95182 )`, UTF-8 bytes `[ 95791, 96577 )`, physical line 221, columns 5840–6626.
- **Syntactic calls:** `Math.max`, `Math.min`, `Math.round`, `Nm.indexOf`, `d.setFrame`, `d.setFrame().setPosition`, `d.setFrame().setPosition().setVisible`, `d.setFrame().setPosition().setVisible().setAlpha`, `o.forEach`, `this.digit`, `this.first.get`, `this.first.set`, `this.g.fillStyle`, `this.g.fillStyle().fillRect`, `this.scene.add.image`, `this.scene.add.image().setOrigin`, `this.scene.add.image().setOrigin().setDepth`, `this.scene.textures.exists`, `vf`, `vf().filter`, `vf().filter().slice`.
- **Calls through `this`:** `digit`, `first.get`, `first.set`, `g.fillStyle`, `g.fillStyle().fillRect`, `scene.add.image`, `scene.add.image().setOrigin`, `scene.add.image().setOrigin().setDepth`, `scene.textures.exists`.
- **Imported alias name matches (potential):** `Nm`, `cl`.
- **Numeric comparisons:** `h.n>1`.

### `fv.digit(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 95182, 95358 )`, UTF-8 bytes `[ 96577, 96753 )`, physical line 221, columns 6626–6802.
- **Syntactic calls:** `Math.floor`, `this.g.fillRect`, `this.g.fillStyle`, `this.g.fillStyle().fillRect`, `this.g.fillStyle().fillRect().fillStyle`.
- **Calls through `this`:** `g.fillRect`, `g.fillStyle`, `g.fillStyle().fillRect`, `g.fillStyle().fillRect().fillStyle`.
- **Numeric comparisons:** `s<15`.

### `fv.end()`
- **CONFIRMED location:** UTF-16 `[ 95358, 95497 )`, UTF-8 bytes `[ 96753, 96892 )`, physical line 221, columns 6802–6941.
- **Syntactic calls:** `this.first.clear`, `this.pool[e].setVisible`.
- **Calls through `this`:** `first.clear`, `pool[e].setVisible`.
- **Numeric comparisons:** `this.first.size>600`.
