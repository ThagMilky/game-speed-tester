# Class `Fu` — Terrain deformation/impact effects

**Source range:** `Fu` [UTF-16 259808–263434, line 237].
**Role:** Procedural frost, craters, impacts and spikes tied to terrain. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 9.

Methods and evidence (calls collected include nested callbacks):

### `Fu.constructor(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 259817, 260252 )`, UTF-8 bytes `[ 264110, 264545 )`, physical line 237, columns 116201–116636.
- **Syntactic calls:** `M`, `e.add.image`, `e.add.image().setVisible`, `t.define`, `this.chunks.push`, `this.spikes.push`.
- **Calls through `this`:** `chunks.push`, `spikes.push`.

### `Fu.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 260252, 260429 )`, UTF-8 bytes `[ 264545, 264722 )`, physical line 237, columns 116636–116813.
- **Syntactic calls:** `Object.entries`, `ds`, `e.load.spritesheet`, `e.textures.exists`.
- **Imported alias name matches (potential):** `ds`.

### `Fu.ready(e)`
- **CONFIRMED location:** UTF-16 `[ 260429, 260484 )`, UTF-8 bytes `[ 264722, 264777 )`, physical line 237, columns 116813–116868.
- **Syntactic calls:** `this.scene.textures.exists`.
- **Calls through `this`:** `scene.textures.exists`.

### `Fu.visible(e, t)`
- **CONFIRMED location:** UTF-16 `[ 260484, 260590 )`, UTF-8 bytes `[ 264777, 264883 )`, physical line 237, columns 116868–116974.
- **Syntactic calls:** `this.host.camera`.
- **Calls through `this`:** `host.camera`.

### `Fu.burst(e, t, i, n=null, s=1, o=16777215)`
- **CONFIRMED location:** UTF-16 `[ 260590, 261465 )`, UTF-8 bytes `[ 264883, 265758 )`, physical line 237, columns 116974–117849.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.floor`, `Math.min`, `Math.random`, `Math.round`, `Math.sin`, `ds`, `p.img.setTexture`, `p.img.setTexture().setOrigin`, `p.img.setTexture().setOrigin().setFlipX`, `p.img.setTexture().setOrigin().setFlipX().setTint`, `p.img.setTexture().setOrigin().setFlipX().setTint().setAlpha`, `p.img.setTexture().setOrigin().setFlipX().setTint().setAlpha().setVisible`, `this.chunks.find`, `this.chunks.reduce`, `this.host.material`, `this.ready`, `this.visible`.
- **Calls through `this`:** `chunks.find`, `chunks.reduce`, `host.material`, `ready`, `visible`.
- **Imported alias name matches (potential):** `ds`.
- **Numeric comparisons:** `s>=1.5`; `Math.random()<.5`.

### `Fu.spike(e, t, i, n={})`
- **CONFIRMED location:** UTF-16 `[ 261465, 262171 )`, UTF-8 bytes `[ 265758, 266464 )`, physical line 237, columns 117849–118555.
- **Syntactic calls:** `Math.round`, `ds`, `l.img.setTexture`, `l.img.setTexture().setTint`, `l.img.setTexture().setTint().setOrigin`, `l.img.setTexture().setTint().setOrigin().setScale`, `l.img.setTexture().setTint().setOrigin().setScale().setPosition`, `l.img.setTexture().setTint().setOrigin().setScale().setPosition().setDepth`, `l.img.setTexture().setTint().setOrigin().setScale().setPosition().setDepth().setAlpha`, `l.img.setTexture().setTint().setOrigin().setScale().setPosition().setDepth().setAlpha().setCrop`, `l.img.setTexture().setTint().setOrigin().setScale().setPosition().setDepth().setAlpha().setCrop().setVisible`, `this.burst`, `this.host.depthAt`, `this.juice.sheet`, `this.ready`, `this.spikes.find`, `this.spikes.reduce`, `this.visible`.
- **Calls through `this`:** `burst`, `host.depthAt`, `juice.sheet`, `ready`, `spikes.find`, `spikes.reduce`, `visible`.
- **Imported alias name matches (potential):** `ds`.

### `Fu.crater(e, t, i=1)`
- **CONFIRMED location:** UTF-16 `[ 262171, 262287 )`, UTF-8 bytes `[ 266464, 266580 )`, physical line 237, columns 118555–118671.
- **Syntactic calls:** `ds`, `this.juice.sheet`, `this.ready`.
- **Calls through `this`:** `juice.sheet`, `ready`.
- **Imported alias name matches (potential):** `ds`.

### `Fu.frost(e, t, i=1)`
- **CONFIRMED location:** UTF-16 `[ 262287, 262556 )`, UTF-8 bytes `[ 266580, 266849 )`, physical line 237, columns 118671–118940.
- **Syntactic calls:** `Math.cos`, `Math.random`, `Math.sin`, `ds`, `this.juice.sheet`, `this.ready`, `this.spike`.
- **Calls through `this`:** `juice.sheet`, `ready`, `spike`.
- **Imported alias name matches (potential):** `ds`.

### `Fu.update(e)`
- **CONFIRMED location:** UTF-16 `[ 262556, 263433 )`, UTF-8 bytes `[ 266849, 267726 )`, physical line 237, columns 118940–119817.
- **Syntactic calls:** `Math.max`, `Math.round`, `t.img.setAlpha`, `t.img.setAlpha().setCrop`, `t.img.setCrop`, `t.img.setPosition`, `t.img.setPosition().setDepth`, `t.img.setVisible`, `this.burst`, `this.host.depthAt`.
- **Calls through `this`:** `burst`, `host.depthAt`.
- **Numeric comparisons:** `t.z>0`; `t.vz>0`; `t.z<=0`; `t.rest<=0`; `i<=0`; `t.img.alpha===1`; `n<=0`.
