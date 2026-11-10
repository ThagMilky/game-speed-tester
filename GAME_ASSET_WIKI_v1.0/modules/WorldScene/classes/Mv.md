# Class `Mv` — Buff/status visual system

**Source range:** `Mv` [UTF-16 97880–118505, line 221].
**Role:** Parses status flags, samples alpha silhouettes, emits particles, shields, ghosting, pulses and afterimages; scene PRE_RENDER hook. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 30.

Methods and evidence (calls collected include nested callbacks):

### `Mv.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 97889, 98762 )`, UTF-8 bytes `[ 99284, 100157 )`, physical line 221, columns 9333–10206.
- **Syntactic calls:** `AbortController`, `M`, `Map`, `Vr`, `e.events.on`, `e.events.once`, `this.destroy`, `this.load`.
- **Calls through `this`:** `destroy`, `load`.
- **Imported alias name matches (potential):** `Vr`, `et`.

### `Mv.load()`
- **CONFIRMED location:** UTF-16 `[ 98762, 100205 )`, UTF-8 bytes `[ 100157, 101600 )`, physical line 221, columns 10206–11649.
- **Syntactic calls:** `Ih.has`, `Math.floor`, `Object.entries`, `e.json`, `fetch`, `i.json`, `l.add`, `l.has`, `l.setFilter`, `n.json`, `o`, `s.file.startsWith`, `t`, `this.old.push`, `this.scene.load.image`, `this.scene.load.isLoading`, `this.scene.load.once`, `this.scene.load.spritesheet`, `this.scene.load.start`, `this.scene.textures.exists`, `this.scene.textures.get`, `this.sheets.set`.
- **Calls through `this`:** `old.push`, `scene.load.image`, `scene.load.isLoading`, `scene.load.once`, `scene.load.spritesheet`, `scene.load.start`, `scene.textures.exists`, `scene.textures.get`, `sheets.set`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `s.frames>0`; `s.frames>0`.
- **Fetch sources:** `"fx-buff/atlas.json",{signal:this.abort.signal}`, `"data/fx/status-v2/manifest.json",{signal:this.abort.signal}`, `"fx-kn/manifest.json",{signal:this.abort.signal}`.

### `Mv.begin()`
- **CONFIRMED location:** UTF-16 `[ 100205, 100226 )`, UTF-8 bytes `[ 101600, 101621 )`, physical line 221, columns 11649–11670.
- **Syntactic calls:** (none observed).

### `Mv.render(e, t, i, n=!0, s="", o="", l=-1)`
- **CONFIRMED location:** UTF-16 `[ 100226, 100747 )`, UTF-8 bytes `[ 101621, 102142 )`, physical line 221, columns 11670–12191.
- **Syntactic calls:** `Map`, `r.codes.has`, `this.acts.get`, `this.acts.set`, `this.parse`.
- **Calls through `this`:** `acts.get`, `acts.set`, `parse`.
- **Numeric comparisons:** `i.view.alpha>.2`.

### `Mv.parse(e)`
- **CONFIRMED location:** UTF-16 `[ 100747, 101262 )`, UTF-8 bytes `[ 102142, 102657 )`, physical line 221, columns 12191–12706.
- **Syntactic calls:** `/^([a-z]{2})(\d*)@/.exec`, `Math.max`, `Number`, `e.sx.split`, `t.clear`, `t.has`, `t.set`, `this.cue`, `this.now`, `this.shatter`.
- **Calls through `this`:** `cue`, `now`, `shatter`.
- **Numeric comparisons:** `this.now()-e.hitAt<.6`.

### `Mv.end()`
- **CONFIRMED location:** UTF-16 `[ 101262, 101331 )`, UTF-8 bytes `[ 102657, 102726 )`, physical line 221, columns 12706–12775.
- **Syntactic calls:** `this.remove`.
- **Calls through `this`:** `remove`.

### `Mv.remove(e)`
- **CONFIRMED location:** UTF-16 `[ 101331, 101423 )`, UTF-8 bytes `[ 102726, 102818 )`, physical line 221, columns 12775–12867.
- **Syntactic calls:** `this.acts.delete`.
- **Calls through `this`:** `acts.delete`.

### `Mv.hit(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 101423, 102166 )`, UTF-8 bytes `[ 102818, 103561 )`, physical line 221, columns 12867–13610.
- **Syntactic calls:** `Math.max`, `n.codes.has`, `o.codes.has`, `this.acts.get`, `this.now`, `this.spikes`, `this.threads.push`.
- **Calls through `this`:** `acts.get`, `now`, `spikes`, `threads.push`.
- **Numeric comparisons:** `n.sh<0`; `s-n.spikeAt>.12`; `this.threads.length<8`.

### `Mv.now()`
- **CONFIRMED location:** UTF-16 `[ 102166, 102203 )`, UTF-8 bytes `[ 103561, 103598 )`, physical line 221, columns 13610–13647.
- **Syntactic calls:** (none observed).

### `Mv.wx(e, t)`
- **CONFIRMED location:** UTF-16 `[ 102203, 102270 )`, UTF-8 bytes `[ 103598, 103665 )`, physical line 221, columns 13647–13714.
- **Syntactic calls:** (none observed).

### `Mv.wy(e, t)`
- **CONFIRMED location:** UTF-16 `[ 102270, 102337 )`, UTF-8 bytes `[ 103665, 103732 )`, physical line 221, columns 13714–13781.
- **Syntactic calls:** (none observed).

### `Mv.W(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 102337, 102397 )`, UTF-8 bytes `[ 103732, 103792 )`, physical line 221, columns 13781–13841.
- **Syntactic calls:** `this.wx`, `this.wy`.
- **Calls through `this`:** `wx`, `wy`.

### `Mv.inside(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 102397, 102572 )`, UTF-8 bytes `[ 103792, 103967 )`, physical line 221, columns 13841–14016.
- **Syntactic calls:** `Pu`, `Ze`.
- **Numeric comparisons:** `o<6`.

### `Mv.edgeAt(e, t=1)`
- **CONFIRMED location:** UTF-16 `[ 102572, 102761 )`, UTF-8 bytes `[ 103967, 104156 )`, physical line 221, columns 14016–14205.
- **Syntactic calls:** `Math.floor`, `Math.random`.
- **Numeric comparisons:** `i<4`.

### `Mv.copy(e, t, i, n, s, o, l=!0, r=!1)`
- **CONFIRMED location:** UTF-16 `[ 102761, 103237 )`, UTF-8 bytes `[ 104156, 104632 )`, physical line 221, columns 14205–14681.
- **Syntactic calls:** `h.setTexture`, `h.setTexture().setOrigin`, `h.setTexture().setOrigin().setScale`, `h.setTexture().setOrigin().setScale().setAngle`, `h.setTexture().setOrigin().setScale().setAngle().setPosition`, `h.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth`, `h.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha`, `h.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha().setBlendMode`, `h.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha().setBlendMode().setVisible`, `h.setTint`, `h.setTintFill`, `this.copies.push`, `this.scene.add.image`.
- **Calls through `this`:** `copies.push`, `scene.add.image`.
- **Imported alias name matches (potential):** `et`.

### `Mv.piece(e, t, i, n, s, o, l=1, r=1, h=!1, c=-1, d=!1)`
- **CONFIRMED location:** UTF-16 `[ 103237, 103790 )`, UTF-8 bytes `[ 104632, 105185 )`, physical line 221, columns 14681–15234.
- **Syntactic calls:** `Math.floor`, `Math.min`, `Math.round`, `this.pieces.push`, `this.scene.add.image`, `this.sheets.get`, `u.clearTint`, `u.setTexture`, `u.setTexture().setOrigin`, `u.setTexture().setOrigin().setScale`, `u.setTexture().setOrigin().setScale().setAngle`, `u.setTexture().setOrigin().setScale().setAngle().setPosition`, `u.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth`, `u.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha`, `u.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha().setVisible`, `u.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setAlpha().setVisible().setBlendMode`, `u.setTint`.
- **Calls through `this`:** `pieces.push`, `scene.add.image`, `sheets.get`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `m<0`; `c>=0`.

### `Mv.piece2(e, t, i, n, s, o=1, l=1)`
- **CONFIRMED location:** UTF-16 `[ 103790, 103885 )`, UTF-8 bytes `[ 105185, 105280 )`, physical line 221, columns 15234–15329.
- **Syntactic calls:** `this.piece`.
- **Calls through `this`:** `piece`.

### `Mv.spawn(e, t, i, n, s={})`
- **CONFIRMED location:** UTF-16 `[ 103885, 104588 )`, UTF-8 bytes `[ 105280, 105983 )`, physical line 221, columns 15329–16032.
- **Syntactic calls:** `Math.round`, `l.clearTint`, `l.setTexture`, `l.setTexture().setOrigin`, `l.setTexture().setOrigin().setScale`, `l.setTexture().setOrigin().setScale().setAngle`, `l.setTexture().setOrigin().setScale().setAngle().setVisible`, `l.setTexture().setOrigin().setScale().setAngle().setVisible().setActive`, `l.setTexture().setOrigin().setScale().setAngle().setVisible().setActive().setDepth`, `l.setTexture().setOrigin().setScale().setAngle().setVisible().setActive().setDepth().setPosition`, `l.setTexture().setOrigin().setScale().setAngle().setVisible().setActive().setDepth().setPosition().setAlpha`, `l.setTexture().setOrigin().setScale().setAngle().setVisible().setActive().setDepth().setPosition().setAlpha().setBlendMode`, `l.setTint`, `this.freeParts.pop`, `this.parts.push`, `this.scene.add.image`, `this.sheets.get`.
- **Calls through `this`:** `freeParts.pop`, `parts.push`, `scene.add.image`, `sheets.get`.
- **Imported alias name matches (potential):** `et`.

### `Mv.every(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 104588, 104680 )`, UTF-8 bytes `[ 105983, 106075 )`, physical line 221, columns 16032–16124.
- **Syntactic calls:** `Ze`, `e.timers.get`, `e.timers.set`.

### `Mv.ghost(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 104680, 105095 )`, UTF-8 bytes `[ 106075, 106490 )`, physical line 221, columns 16124–16539.
- **Syntactic calls:** `s.setTexture`, `s.setTexture().setOrigin`, `s.setTexture().setOrigin().setScale`, `s.setTexture().setOrigin().setScale().setAngle`, `s.setTexture().setOrigin().setScale().setAngle().setPosition`, `s.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth`, `s.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setTint`, `s.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setTint().setAlpha`, `s.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setTint().setAlpha().setVisible`, `s.setTexture().setOrigin().setScale().setAngle().setPosition().setDepth().setTint().setAlpha().setVisible().setBlendMode`, `this.freeGhosts.pop`, `this.ghosts.push`, `this.scene.add.image`.
- **Calls through `this`:** `freeGhosts.pop`, `ghosts.push`, `scene.add.image`.
- **Imported alias name matches (potential):** `et`.

### `Mv.shatter(e)`
- **CONFIRMED location:** UTF-16 `[ 105095, 105647 )`, UTF-8 bytes `[ 106490, 107042 )`, physical line 221, columns 16539–17091.
- **Syntactic calls:** `Math.hypot`, `Math.sign`, `Ze`, `this.cue`, `this.edgeAt`, `this.spawn`, `this.wx`, `this.wy`.
- **Calls through `this`:** `cue`, `edgeAt`, `spawn`, `wx`, `wy`.
- **Numeric comparisons:** `l<16`; `l<4`.

### `Mv.spikes(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 105647, 106312 )`, UTF-8 bytes `[ 107042, 107707 )`, physical line 221, columns 17091–17756.
- **Syntactic calls:** `Math.atan2`, `Math.hypot`, `Math.random`, `Math.round`, `Math.sign`, `this.sheets.has`, `this.spawn`, `this.wx`, `this.wy`.
- **Calls through `this`:** `sheets.has`, `spawn`, `wx`, `wy`.
- **Numeric comparisons:** `r<3`; `Math.hypot(c-t,d-i)>10`; `Math.random()<.65`; `m===4`; `m===2`; `m===6`; `m===1`; `m===5`; `m===3`; `m%2===0`; `m===0`; `m===4` … (+2).

### `Mv.layout()`
- **CONFIRMED location:** UTF-16 `[ 106312, 106947 )`, UTF-8 bytes `[ 107707, 108342 )`, physical line 221, columns 17756–18391.
- **Syntactic calls:** `Math.max`, `Math.min`, `performance.now`, `this.actor`, `this.acts.values`, `this.copies[n].setVisible`, `this.now`, `this.pieces[n].setVisible`, `this.stepGhosts`, `this.stepParts`, `this.threadsDraw`, `xv`.
- **Calls through `this`:** `actor`, `acts.values`, `copies[n].setVisible`, `now`, `pieces[n].setVisible`, `stepGhosts`, `stepParts`, `threadsDraw`.
- **Numeric comparisons:** `t-this.costAt>=1`.

### `Mv.actor(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 106947, 113623 )`, UTF-8 bytes `[ 108342, 115018 )`, physical line 221, columns 18391–25067.
- **Syntactic calls:** `Math.abs`, `Math.cos`, `Math.hypot`, `Math.max`, `Math.min`, `Math.random`, `Math.round`, `Math.sin`, `Pu`, `Ze`, `bv`, `n.setTint`, `s.get`, `s.has`, `this.W`, `this.ally`, `this.copy`, `this.edgeAt`, `this.emit`, `this.every`, `this.ghost`, `this.inside`, `this.oldClip`, `this.piece`, `this.piece2`, `this.scene.textures.exists`, `this.sheets.get`, `this.sheets.has`, `this.spawn`, `this.wx` … (+1 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `W`, `ally`, `copy`, `edgeAt`, `emit`, `every`, `ghost`, `inside`, `oldClip`, `piece`, `piece2`, `scene.textures.exists`, `sheets.get`, `sheets.has`, `spawn`, `wx`, `wy`.
- **Numeric comparisons:** `Math.abs(o)>40`; `Math.abs(l)>40`; `i>0`; `u>150`; `u>100`; `m>60`; `Math.hypot(e.vx,e.vy)>30`; `L>=2`; `e.sh>=0`; `e.peak>0`; `R>.55`; `L===0` … (+36).

### `Mv.emit(e, t, i, n, s, o, l)`
- **CONFIRMED location:** UTF-16 `[ 113623, 115423 )`, UTF-8 bytes `[ 115018, 116818 )`, physical line 221, columns 25067–26867.
- **Syntactic calls:** `Math.abs`, `Math.floor`, `Math.random`, `Ze`, `p.slice`, `parseInt`, `this.W`, `this.every`, `this.inside`, `this.parts.some`, `this.piece`, `this.sheets.has`, `this.spawn`, `this.wx`, `this.wy`.
- **Calls through `this`:** `W`, `every`, `inside`, `parts.some`, `piece`, `sheets.has`, `spawn`, `wx`, `wy`.
- **Imported alias name matches (potential):** `g1`.
- **Numeric comparisons:** `i>=2`; `Math.random()<.3`; `c===0`; `c===1`; `c===2`; `Math.random()<.5`.

### `Mv.oldClip(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 115423, 115992 )`, UTF-8 bytes `[ 116818, 117387 )`, physical line 221, columns 26867–27436.
- **Syntactic calls:** `Math.floor`, `Math.max`, `Math.min`, `e.ch.groundAnchor`, `n.setTexture`, `n.setTexture().setOrigin`, `n.setTexture().setOrigin().setScale`, `n.setTexture().setOrigin().setScale().setAngle`, `n.setTexture().setOrigin().setScale().setAngle().setPosition`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize().setDepth`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize().setDepth().setAlpha`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize().setDepth().setAlpha().setBlendMode`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize().setDepth().setAlpha().setBlendMode().clearTint`, `n.setTexture().setOrigin().setScale().setAngle().setPosition().setDisplaySize().setDepth().setAlpha().setBlendMode().clearTint().setVisible`, `this.copies.push`, `this.scene.add.image`.
- **Calls through `this`:** `copies.push`, `scene.add.image`.
- **Imported alias name matches (potential):** `et`.

### `Mv.threadsDraw(e)`
- **CONFIRMED location:** UTF-16 `[ 115992, 116891 )`, UTF-8 bytes `[ 117387, 118286 )`, physical line 221, columns 27436–28335.
- **Syntactic calls:** `Math.hypot`, `Math.max`, `Math.min`, `Math.round`, `this.acts.get`, `this.piece`, `this.threads.splice`, `this.wx`, `this.wy`, `x`.
- **Calls through `this`:** `acts.get`, `piece`, `threads.splice`, `wx`, `wy`.
- **Numeric comparisons:** `t>=0`; `n>=1`; `d<4`; `d>420`; `n<.7`; `y<2`; `k<=0`.

### `Mv.stepParts(e)`
- **CONFIRMED location:** UTF-16 `[ 116891, 117775 )`, UTF-8 bytes `[ 118286, 119170 )`, physical line 221, columns 28335–29219.
- **Syntactic calls:** `Math.floor`, `Math.min`, `Math.round`, `i.img.setAlpha`, `i.img.setDepth`, `i.img.setFrame`, `i.img.setFrame().setPosition`, `i.img.setVisible`, `i.img.setVisible().setActive`, `this.acts.get`, `this.freeParts.push`, `this.parts.pop`, `this.sheets.has`, `this.spawn`.
- **Calls through `this`:** `acts.get`, `freeParts.push`, `parts.pop`, `sheets.has`, `spawn`.
- **Numeric comparisons:** `t>=0`.

### `Mv.stepGhosts(e)`
- **CONFIRMED location:** UTF-16 `[ 117775, 118104 )`, UTF-8 bytes `[ 119170, 119499 )`, physical line 221, columns 29219–29548.
- **Syntactic calls:** `n.img.setAlpha`, `n.img.setVisible`, `this.acts.get`, `this.freeGhosts.push`, `this.ghosts.pop`.
- **Calls through `this`:** `acts.get`, `freeGhosts.push`, `ghosts.pop`.
- **Numeric comparisons:** `i>=0`.

### `Mv.destroy()`
- **CONFIRMED location:** UTF-16 `[ 118104, 118504 )`, UTF-8 bytes `[ 119499, 119899 )`, physical line 221, columns 29548–29948.
- **Syntactic calls:** `e.destroy`, `this.abort.abort`, `this.acts.clear`, `this.ghosts.map`, `this.parts.map`, `this.scene.events.off`.
- **Calls through `this`:** `abort.abort`, `acts.clear`, `ghosts.map`, `parts.map`, `scene.events.off`.
- **Imported alias name matches (potential):** `et`.
