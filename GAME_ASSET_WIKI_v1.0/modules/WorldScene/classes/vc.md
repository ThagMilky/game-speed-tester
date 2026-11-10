# Class `vc` — Character aura and equipment glows

**Source range:** `vc` [UTF-16 735647–740397, line 965].
**Role:** Projection, aura update and per-character visual state. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 6.

Methods and evidence (calls collected include nested callbacks):

### `vc.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 735656, 736089 )`, UTF-8 bytes `[ 754634, 755067 )`, physical line 965, columns 14283–14716.
- **Syntactic calls:** `M`, `e.add.graphics`, `e.add.graphics().setBlendMode`, `e.add.image`, `e.add.image().setVisible`, `e.add.image().setVisible().setBlendMode`, `this.rings.push`.
- **Calls through `this`:** `rings.push`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `t<3`.

### `vc.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 736089, 736408 )`, UTF-8 bytes `[ 755067, 755386 )`, physical line 965, columns 14716–15035.
- **Syntactic calls:** `Object.entries`, `e.load.image`, `e.load.json`, `e.load.spritesheet`, `xm.preload`.

### `vc.projection(e, t)`
- **CONFIRMED location:** UTF-16 `[ 736408, 737335 )`, UTF-8 bytes `[ 755386, 756313 )`, physical line 965, columns 15035–15962.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Math.sqrt`, `c.drawImage`, `c.getImageData`, `c.putImageData`, `document.createElement`, `h.getContext`, `p.context.drawImage`, `p.context.resetTransform`, `p.context.setTransform`, `p.refresh`, `p.setFilter`, `this.scene.textures.createCanvas`, `this.scene.textures.exists`, `this.scene.textures.get`, `this.scene.textures.get().getSourceImage`.
- **Calls through `this`:** `scene.textures.createCanvas`, `scene.textures.exists`, `scene.textures.get`, `scene.textures.get().getSourceImage`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `(i.body?-1:-Math.sin(n)*24-s*(m+.5-(i.axis??i.size/2))*2)>0`.

### `vc.update(e, t, i, n, s, o, l, r, h=2, c=1, d=[], p=0)`
- **CONFIRMED location:** UTF-16 `[ 737335, 740078 )`, UTF-8 bytes `[ 756313, 759056 )`, physical line 965, columns 15962–18705.
- **Syntactic calls:** `Ci`, `Math.ceil`, `Math.cos`, `Math.max`, `Math.min`, `Math.round`, `Math.sin`, `Math.sqrt`, `ai`, `bm`, `d.find`, `fx.has`, `mx`, `pp.slice`, `pp.slice().reverse`, `pp.slice().reverse().find`, `q.setTexture`, `q.setTexture().setPosition`, `q.setTexture().setPosition().setScale`, `q.setTexture().setPosition().setScale().setAlpha`, `q.setTexture().setPosition().setScale().setAlpha().setDepth`, `q.setTexture().setPosition().setScale().setAlpha().setDepth().setVisible`, `this.hide`, `this.kimVan.render`, `this.motes.fillRect`, `this.motes.fillStyle`, `this.motes.fillStyle().fillRect`, `this.motes.lineStyle`, `this.motes.setDepth`, `this.motes.setDepth().setVisible` … (+16 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `hide`, `kimVan.render`, `motes.fillRect`, `motes.fillStyle`, `motes.fillStyle().fillRect`, `motes.lineStyle`, `motes.setDepth`, `motes.setDepth().setVisible`, `motes.strokeEllipse`, `projection`, `rings[S].setFrame`, `rings[S].setFrame().setOrigin`, `rings[S].setFrame().setOrigin().setPosition`, `rings[S].setFrame().setOrigin().setPosition().setDepth`, `rings[S].setFrame().setOrigin().setPosition().setDepth().setScale`, `rings[S].setFrame().setOrigin().setPosition().setDepth().setScale().setTint`, `rings[S].setFrame().setOrigin().setPosition().setDepth().setScale().setTint().setAlpha`, `rings[S].setFrame().setOrigin().setPosition().setDepth().setScale().setTint().setAlpha().setVisible`, `scene.cache.json.get`, `scene.textures.exists`.
- **Imported alias name matches (potential):** `Ci`, `ai`, `dp`, `fx`, `mx`, `pp`.
- **Numeric comparisons:** `n.alpha<.4`; `p===3`; `E<18`; `S<3`; `P===7`; `R<2`; `P===7`; `p>1`; `p>1`.

### `vc.hide()`
- **CONFIRMED location:** UTF-16 `[ 740078, 740248 )`, UTF-8 bytes `[ 759056, 759226 )`, physical line 965, columns 18705–18875.
- **Syntactic calls:** `e.hide`, `t.setVisible`, `this.back.setVisible`, `this.front.setVisible`, `this.motes.clear`, `this.motes.clear().setVisible`, `this.rings.forEach`.
- **Calls through `this`:** `back.setVisible`, `front.setVisible`, `motes.clear`, `motes.clear().setVisible`, `rings.forEach`.

### `vc.destroy()`
- **CONFIRMED location:** UTF-16 `[ 740248, 740396 )`, UTF-8 bytes `[ 759226, 759374 )`, physical line 965, columns 18875–19023.
- **Syntactic calls:** `e.destroy`, `t.destroy`, `this.back.destroy`, `this.front.destroy`, `this.motes.destroy`, `this.rings.forEach`.
- **Calls through `this`:** `back.destroy`, `front.destroy`, `motes.destroy`, `rings.forEach`.
