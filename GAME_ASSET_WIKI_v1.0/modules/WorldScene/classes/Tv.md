# Class `Tv` — Data-driven particle/FX atlas

**Source range:** `Tv` [UTF-16 118570–124860, line 221].
**Role:** Loads fx.json, registers atlas frames, pools animated effects, handles deferred playback and scene lifecycle. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 23.

Methods and evidence (calls collected include nested callbacks):

### `Tv.constructor()`
- **CONFIRMED location:** UTF-16 `[ 118579, 118850 )`, UTF-8 bytes `[ 119974, 120245 )`, physical line 221, columns 30023–30294.
- **Syntactic calls:** `M`, `Map`, `Set`.

### `Tv.load(e)`
- **CONFIRMED location:** UTF-16 `[ 118850, 119150 )`, UTF-8 bytes `[ 120245, 120545 )`, physical line 221, columns 30294–30594.
- **Syntactic calls:** `Promise.resolve`, `console.warn`, `e.endsWith`, `fetch`, `fetch().then`, `fetch().then().then`, `fetch().then().then().catch`, `t.json`, `this.kick`.
- **Calls through `this`:** `kick`.
- **Fetch sources:** `this.baseUrl+"fx.json"`.

### `Tv.preload(e, t=[])`
- **CONFIRMED location:** UTF-16 `[ 119150, 119651 )`, UTF-8 bytes `[ 120545, 121046 )`, physical line 221, columns 30594–31095.
- **Syntactic calls:** `Set`, `e.cache.json.exists`, `e.cache.json.get`, `e.load.image`, `e.load.json`, `e.load.once`, `e.textures.exists`, `i`, `t.map`, `t.map().filter`, `this.kick`, `xn`.
- **Calls through `this`:** `kick`.
- **Imported alias name matches (potential):** `et`.

### `Tv.warm(e, t)`
- **CONFIRMED location:** UTF-16 `[ 119651, 119828 )`, UTF-8 bytes `[ 121046, 121223 )`, physical line 221, columns 31095–31272.
- **Syntactic calls:** `ArrayExpression.map`, `Promise.all`, `Set`, `t.map`, `t.map().filter`, `this.load`, `this.texture`.
- **Calls through `this`:** `load`, `texture`.

### `Tv.has(e)`
- **CONFIRMED location:** UTF-16 `[ 119828, 119884 )`, UTF-8 bytes `[ 121223, 121279 )`, physical line 221, columns 31272–31328.
- **Syntactic calls:** (none observed).

### `Tv.ensure(e, t)`
- **CONFIRMED location:** UTF-16 `[ 119884, 120062 )`, UTF-8 bytes `[ 121279, 121457 )`, physical line 221, columns 31328–31506.
- **Syntactic calls:** `e.textures.exists`, `this.load`, `this.registered.has`, `this.texture`, `xn`.
- **Calls through `this`:** `load`, `registered.has`, `texture`.

### `Tv.frameKey(e, t)`
- **CONFIRMED location:** UTF-16 `[ 120062, 120146 )`, UTF-8 bytes `[ 121457, 121541 )`, physical line 221, columns 31506–31590.
- **Syntactic calls:** `xn`, `yr`.

### `Tv.clip(e)`
- **CONFIRMED location:** UTF-16 `[ 120146, 120205 )`, UTF-8 bytes `[ 121541, 121600 )`, physical line 221, columns 31590–31649.
- **Syntactic calls:** (none observed).

### `Tv.length(e)`
- **CONFIRMED location:** UTF-16 `[ 120205, 120269 )`, UTF-8 bytes `[ 121600, 121664 )`, physical line 221, columns 31649–31713.
- **Syntactic calls:** `this.clip`.
- **Calls through `this`:** `clip`.

### `Tv.toPx(e, t)`
- **CONFIRMED location:** UTF-16 `[ 120269, 120332 )`, UTF-8 bytes `[ 121664, 121727 )`, physical line 221, columns 31713–31776.
- **Syntactic calls:** (none observed).

### `Tv.play(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 120332, 120665 )`, UTF-8 bytes `[ 121727, 122060 )`, physical line 221, columns 31776–32109.
- **Syntactic calls:** `e.textures.exists`, `this.defer`, `this.load`, `this.register`, `this.registered.has`, `this.spawn`, `this.texture`, `xn`.
- **Calls through `this`:** `defer`, `load`, `register`, `registered.has`, `spawn`, `texture`.

### `Tv.stop(e)`
- **CONFIRMED location:** UTF-16 `[ 120665, 120779 )`, UTF-8 bytes `[ 122060, 122174 )`, physical line 221, columns 32109–32223.
- **Syntactic calls:** `t.live.findIndex`, `this.release`.
- **Calls through `this`:** `release`.
- **Numeric comparisons:** `i>=0`.

### `Tv.clear(e)`
- **CONFIRMED location:** UTF-16 `[ 120779, 120871 )`, UTF-8 bytes `[ 122174, 122266 )`, physical line 221, columns 32223–32315.
- **Syntactic calls:** `this.pools.get`, `this.release`.
- **Calls through `this`:** `pools.get`, `release`.

### `Tv.defer(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 120871, 120984 )`, UTF-8 bytes `[ 122266, 122379 )`, physical line 221, columns 32315–32428.
- **Syntactic calls:** `performance.now`, `this.pending.push`.
- **Calls through `this`:** `pending.push`.
- **Numeric comparisons:** `this.pending.length<64`.

### `Tv.kick()`
- **CONFIRMED location:** UTF-16 `[ 120984, 121093 )`, UTF-8 bytes `[ 122379, 122488 )`, physical line 221, columns 32428–32537.
- **Syntactic calls:** `queueMicrotask`, `this.flush`.
- **Calls through `this`:** `flush`.

### `Tv.flush()`
- **CONFIRMED location:** UTF-16 `[ 121093, 121613 )`, UTF-8 bytes `[ 122488, 123008 )`, physical line 221, columns 32537–33057.
- **Syntactic calls:** `l.scene.sys.isActive`, `l.scene.textures.exists`, `performance.now`, `t.push`, `this.register`, `this.spawn`, `this.texture`, `xn`.
- **Calls through `this`:** `register`, `spawn`, `texture`.
- **Numeric comparisons:** `c<=.1`; `h>.75`.

### `Tv.texture(e, t)`
- **CONFIRMED location:** UTF-16 `[ 121613, 122100 )`, UTF-8 bytes `[ 123008, 123495 )`, physical line 221, columns 33057–33544.
- **Syntactic calls:** `Image`, `Promise`, `Promise.resolve`, `console.warn`, `e.textures.addImage`, `e.textures.exists`, `l`, `this.kick`, `this.register`, `this.textures.delete`, `this.textures.get`, `this.textures.set`, `xn`.
- **Calls through `this`:** `kick`, `register`, `textures.delete`, `textures.get`, `textures.set`.

### `Tv.register(e, t)`
- **CONFIRMED location:** UTF-16 `[ 122100, 122450 )`, UTF-8 bytes `[ 123495, 123845 )`, physical line 221, columns 33544–33894.
- **Syntactic calls:** `Object.entries`, `e.textures.get`, `i.add`, `i.has`, `s.frames.forEach`, `this.registered.add`, `this.registered.has`, `xn`, `yr`.
- **Calls through `this`:** `registered.add`, `registered.has`.

### `Tv.poolFor(e)`
- **CONFIRMED location:** UTF-16 `[ 122450, 122814 )`, UTF-8 bytes `[ 123845, 124209 )`, physical line 221, columns 33894–34258.
- **Syntactic calls:** `e.events.off`, `e.events.on`, `e.events.once`, `s.destroy`, `s.sprite.destroy`, `this.pools.delete`, `this.pools.get`, `this.pools.set`, `this.tick`.
- **Calls through `this`:** `pools.delete`, `pools.get`, `pools.set`, `tick`.
- **Imported alias name matches (potential):** `et`.

### `Tv.spawn(e, t, i, n, s, o={})`
- **CONFIRMED location:** UTF-16 `[ 122814, 123970 )`, UTF-8 bytes `[ 124209, 125365 )`, physical line 221, columns 34258–35414.
- **Syntactic calls:** `Math.max`, `Number.isNaN`, `d.clearTint`, `d.setAlpha`, `d.setAlpha().setActive`, `d.setAlpha().setActive().setVisible`, `d.setAngle`, `d.setBlendMode`, `d.setDepth`, `d.setFlipX`, `d.setScale`, `d.setTexture`, `d.setTint`, `e.add.sprite`, `l.free.pop`, `l.live.push`, `o.tint.replace`, `o.tint.replace().slice`, `parseInt`, `this.place`, `this.poolFor`, `this.release`, `xn`, `yr`.
- **Calls through `this`:** `place`, `poolFor`, `release`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `x===0`; `(o.duration??0)>0`; `i.frames.length===1`.

### `Tv.place(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 123970, 124188 )`, UTF-8 bytes `[ 125365, 125583 )`, physical line 221, columns 35414–35632.
- **Syntactic calls:** `Math.round`, `e.sprite.setPosition`.

### `Tv.tick(e, t)`
- **CONFIRMED location:** UTF-16 `[ 124188, 124701 )`, UTF-8 bytes `[ 125583, 126096 )`, physical line 221, columns 35632–36145.
- **Syntactic calls:** `Math.floor`, `Math.min`, `e.live.splice`, `n.sprite.setAlpha`, `n.sprite.setFrame`, `n.sprite.setVisible`, `this.place`, `this.release`, `yr`.
- **Calls through `this`:** `place`, `release`.
- **Numeric comparisons:** `i>=0`; `s<0`.

### `Tv.release(e, t)`
- **CONFIRMED location:** UTF-16 `[ 124701, 124859 )`, UTF-8 bytes `[ 126096, 126254 )`, physical line 221, columns 36145–36303.
- **Syntactic calls:** `e.free.push`, `e.live.splice`, `i.sprite.setVisible`, `i.sprite.setVisible().setActive`, `n.call`.
