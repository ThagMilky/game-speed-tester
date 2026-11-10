# Class `xk` — Decorative props

**Source range:** `xk` [UTF-16 266489–269056, line 237].
**Role:** Builds and updates destructible/dynamic scene decoration and ambient objects. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 5.

Methods and evidence (calls collected include nested callbacks):

### `xk.constructor(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 266498, 266631 )`, UTF-8 bytes `[ 270791, 270924 )`, physical line 237, columns 122882–123015.
- **Syntactic calls:** `M`.

### `xk.update(e)`
- **CONFIRMED location:** UTF-16 `[ 266631, 266745 )`, UTF-8 bytes `[ 270924, 271038 )`, physical line 237, columns 123015–123129.
- **Syntactic calls:** `this.clear`, `this.load`.
- **Calls through `this`:** `clear`, `load`.
- **Numeric comparisons:** `(e==null?void 0:e.in)===1`.

### `xk.load()`
- **CONFIRMED location:** UTF-16 `[ 266745, 267138 )`, UTF-8 bytes `[ 271038, 271431 )`, physical line 237, columns 123129–123522.
- **Syntactic calls:** `ArrayExpression.filter`, `Object.values`, `Object.values().map`, `Set`, `e.includes`, `this.build`, `this.scene.load.image`, `this.scene.load.isLoading`, `this.scene.load.once`, `this.scene.load.start`, `this.scene.textures.exists`.
- **Calls through `this`:** `build`, `scene.load.image`, `scene.load.isLoading`, `scene.load.once`, `scene.load.start`, `scene.textures.exists`.

### `xk.build()`
- **CONFIRMED location:** UTF-16 `[ 267138, 268830 )`, UTF-8 bytes `[ 271431, 273123 )`, physical line 237, columns 123522–125214.
- **Syntactic calls:** `Math.hypot`, `Math.max`, `Math.round`, `Math.sin`, `Nf`, `l.fillStyle`, `l.fillStyle().fillRect`, `l.fillStyle().fillRect().fillRect`, `this.env.zone`, `this.host.addProp`, `this.host.addSway`, `this.host.depthAt`, `this.host.mapH`, `this.host.mapW`, `this.host.toPx`, `this.objs.push`, `this.props.push`, `this.scene.add.circle`, `this.scene.add.circle().setDepth`, `this.scene.add.existing`, `this.scene.add.graphics`, `this.scene.add.graphics().setDepth`, `this.scene.add.image`, `this.scene.textures.get`, `this.scene.tweens.add`, `this.sways.push`, `x.add`, `x.has`, `y.setOrigin`, `y.setOrigin().setDepth`.
- **Calls through `this`:** `env.zone`, `host.addProp`, `host.addSway`, `host.depthAt`, `host.mapH`, `host.mapW`, `host.toPx`, `objs.push`, `props.push`, `scene.add.circle`, `scene.add.circle().setDepth`, `scene.add.existing`, `scene.add.graphics`, `scene.add.graphics().setDepth`, `scene.add.image`, `scene.textures.get`, `scene.tweens.add`, `sways.push`.
- **Numeric comparisons:** `d>1`; `d>.82`; `d<.45`.

### `xk.clear()`
- **CONFIRMED location:** UTF-16 `[ 268830, 269055 )`, UTF-8 bytes `[ 273123, 273348 )`, physical line 237, columns 125214–125439.
- **Syntactic calls:** `e.destroy`, `this.env.clearZones`, `this.host.removeProp`, `this.host.removeSway`.
- **Calls through `this`:** `env.clearZones`, `host.removeProp`, `host.removeSway`.
