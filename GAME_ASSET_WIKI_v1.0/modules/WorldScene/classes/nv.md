# Class `nv` — World/story prop visuals

**Source range:** `nv` [UTF-16 52362–54108, line 45].
**Role:** Map object label-to-texture loader, optional animated sprites and cloth overlays. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 4.

Methods and evidence (calls collected include nested callbacks):

### `nv.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 52371, 52474 )`, UTF-8 bytes `[ 53197, 53300 )`, physical line 45, columns 8437–8540.
- **Syntactic calls:** `M`, `Map`, `Set`.

### `nv.update(e)`
- **CONFIRMED location:** UTF-16 `[ 52474, 53438 )`, UTF-8 bytes `[ 53300, 54264 )`, physical line 45, columns 8540–9504.
- **Syntactic calls:** `Math.round`, `Set`, `iv`, `n.destroy`, `o.setPosition`, `o.setPosition().setDepth`, `o.setTint`, `s.destroy`, `s.play`, `s.setPosition`, `s.setPosition().setDepth`, `t.add`, `t.has`, `this.cloths.delete`, `this.cloths.get`, `this.cloths.set`, `this.load`, `this.scene.add.image`, `this.scene.add.image().setOrigin`, `this.scene.add.sprite`, `this.scene.add.sprite().setOrigin`, `this.scene.textures.exists`, `this.shown.delete`, `this.shown.get`, `this.shown.has`, `this.shown.set`.
- **Calls through `this`:** `cloths.delete`, `cloths.get`, `cloths.set`, `load`, `scene.add.image`, `scene.add.image().setOrigin`, `scene.add.sprite`, `scene.add.sprite().setOrigin`, `scene.textures.exists`, `shown.delete`, `shown.get`, `shown.has`, `shown.set`.

### `nv.load(e)`
- **CONFIRMED location:** UTF-16 `[ 53438, 53963 )`, UTF-8 bytes `[ 54264, 54789 )`, physical line 45, columns 9504–10029.
- **Syntactic calls:** `t.image`, `t.isLoading`, `t.once`, `t.spritesheet`, `t.start`, `this.loading.add`, `this.loading.has`, `this.scene.anims.create`, `this.scene.anims.exists`, `this.scene.anims.generateFrameNumbers`, `this.scene.textures.get`, `this.scene.textures.get().setFilter`.
- **Calls through `this`:** `loading.add`, `loading.has`, `scene.anims.create`, `scene.anims.exists`, `scene.anims.generateFrameNumbers`, `scene.textures.get`, `scene.textures.get().setFilter`.
- **Imported alias name matches (potential):** `et`.

### `nv.destroy()`
- **CONFIRMED location:** UTF-16 `[ 53963, 54107 )`, UTF-8 bytes `[ 54789, 54933 )`, physical line 45, columns 10029–10173.
- **Syntactic calls:** `e.destroy`, `this.cloths.clear`, `this.cloths.values`, `this.shown.clear`, `this.shown.values`.
- **Calls through `this`:** `cloths.clear`, `cloths.values`, `shown.clear`, `shown.values`.
