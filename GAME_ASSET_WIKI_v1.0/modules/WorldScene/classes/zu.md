# Class `zu` — Sword skill showcase renderer

**Source range:** `zu` [UTF-16 177270–193898, line 237].
**Role:** Procedural rendering of swords, slashes, ribbons, rings and learned/cinematic effects. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 19.

Methods and evidence (calls collected include nested callbacks):

### `zu.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 177279, 178572 )`, UTF-8 bytes `[ 180516, 181809 )`, physical line 237, columns 33663–34956.
- **Syntactic calls:** `Array.from`, `Co`, `M`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.image`, `e.add.image().setBlendMode`, `e.add.image().setBlendMode().setDepth`, `e.add.image().setBlendMode().setDepth().setVisible`, `e.add.image().setDepth`, `e.add.image().setDepth().setVisible`, `e.add.image().setName`, `e.add.image().setName().setOrigin`, `e.add.image().setName().setOrigin().setVisible`, `e.add.image().setOrigin`, `e.add.image().setOrigin().setScale`, `e.add.image().setOrigin().setScale().setVisible`, `e.add.image().setOrigin().setVisible`, `e.events.once`, `e.textures.get`, `e.textures.get().setFilter`.
- **Imported alias name matches (potential):** `et`.

### `zu.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 178572, 178793 )`, UTF-8 bytes `[ 181809, 182030 )`, physical line 237, columns 34956–35177.
- **Syntactic calls:** `Co.preload`, `e.load.image`, `e.load.spritesheet`.

### `zu.sword(e, t, i, n, s=1, o=27)`
- **CONFIRMED location:** UTF-16 `[ 178793, 179005 )`, UTF-8 bytes `[ 182030, 182242 )`, physical line 237, columns 35177–35389.
- **Syntactic calls:** `Math.round`, `ce`, `this.swords[e].setPosition`, `this.swords[e].setPosition().setDisplaySize`, `this.swords[e].setPosition().setDisplaySize().setRotation`, `this.swords[e].setPosition().setDisplaySize().setRotation().setDepth`, `this.swords[e].setPosition().setDisplaySize().setRotation().setDepth().setAlpha`, `this.swords[e].setPosition().setDisplaySize().setRotation().setDepth().setAlpha().setVisible`.
- **Calls through `this`:** `swords[e].setPosition`, `swords[e].setPosition().setDisplaySize`, `swords[e].setPosition().setDisplaySize().setRotation`, `swords[e].setPosition().setDisplaySize().setRotation().setDepth`, `swords[e].setPosition().setDisplaySize().setRotation().setDepth().setAlpha`, `swords[e].setPosition().setDisplaySize().setRotation().setDepth().setAlpha().setVisible`.
- **Numeric comparisons:** `s>.005`.

### `zu.line(e, t, i, n, s, o, l)`
- **CONFIRMED location:** UTF-16 `[ 179005, 179181 )`, UTF-8 bytes `[ 182242, 182418 )`, physical line 237, columns 35389–35565.
- **Syntactic calls:** `ce`, `e.beginPath`, `e.lineStyle`, `e.lineTo`, `e.moveTo`, `e.strokePath`, `t`, `tn`.
- **Numeric comparisons:** `l<=0`; `r<=32`.

### `zu.light(e, t, i, n, s=26)`
- **CONFIRMED location:** UTF-16 `[ 179181, 179380 )`, UTF-8 bytes `[ 182418, 182617 )`, physical line 237, columns 35565–35764.
- **Syntactic calls:** `this.lights[UpdateExpression].setPosition`, `this.lights[UpdateExpression].setPosition().setDisplaySize`, `this.lights[UpdateExpression].setPosition().setDisplaySize().setDepth`, `this.lights[UpdateExpression].setPosition().setDisplaySize().setDepth().setAlpha`, `this.lights[UpdateExpression].setPosition().setDisplaySize().setDepth().setAlpha().setVisible`.
- **Calls through `this`:** `lights[UpdateExpression].setPosition`, `lights[UpdateExpression].setPosition().setDisplaySize`, `lights[UpdateExpression].setPosition().setDisplaySize().setDepth`, `lights[UpdateExpression].setPosition().setDisplaySize().setDepth().setAlpha`, `lights[UpdateExpression].setPosition().setDisplaySize().setDepth().setAlpha().setVisible`.
- **Numeric comparisons:** `n<=.001`.

### `zu.ribbon(e, t, i, n, s=0, o=1)`
- **CONFIRMED location:** UTF-16 `[ 179380, 179748 )`, UTF-8 bytes `[ 182617, 182985 )`, physical line 237, columns 35764–36132.
- **Syntactic calls:** `Math.hypot`, `Math.sin`, `ce`, `e`, `l.concat`, `l.push`, `r.push`, `r.reverse`, `this.air.fillStyle`, `this.air.fillStyle().fillPoints`, `tn`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillPoints`.
- **Numeric comparisons:** `n<=.002`; `o-s<.01`; `t<.05`; `h<=48`.

### `zu.energy(e, t, i, n=0, s=1)`
- **CONFIRMED location:** UTF-16 `[ 179748, 179915 )`, UTF-8 bytes `[ 182985, 183152 )`, physical line 237, columns 36132–36299.
- **Syntactic calls:** `this.ribbon`.
- **Calls through `this`:** `ribbon`.

### `zu.sparks(e, t, i, n, s=1)`
- **CONFIRMED location:** UTF-16 `[ 179915, 180331 )`, UTF-8 bytes `[ 183152, 183568 )`, physical line 237, columns 36299–36715.
- **Syntactic calls:** `Math.cos`, `Math.max`, `Math.sin`, `Qt`, `ce`, `this.air.fillStyle`, `this.air.fillStyle().fillPoints`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillPoints`.
- **Numeric comparisons:** `i<0`; `i>.7`; `o%4===0`.

### `zu.featherSlash(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 180331, 180733 )`, UTF-8 bytes `[ 183568, 183970 )`, physical line 237, columns 36715–37117.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `Qt`, `ce`, `this.energy`, `this.light`, `this.sparks`.
- **Calls through `this`:** `energy`, `light`, `sparks`.
- **Numeric comparisons:** `e<0`; `e>.43`; `r<4`.

### `zu.skyShatter(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 180733, 181306 )`, UTF-8 bytes `[ 183970, 184543 )`, physical line 237, columns 37117–37690.
- **Syntactic calls:** `Math.abs`, `Qt`, `ce`, `qt`, `this.air.fillStyle`, `this.air.fillStyle().fillPoints`, `this.glint`, `this.light`, `this.sparks`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillPoints`, `glint`, `light`, `sparks`.
- **Numeric comparisons:** `e<0`; `e>.6`.

### `zu.heavySlash(e, t)`
- **CONFIRMED location:** UTF-16 `[ 181306, 183309 )`, UTF-8 bytes `[ 184543, 186546 )`, physical line 237, columns 37690–39693.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.hypot`, `Math.max`, `Math.min`, `Math.round`, `Math.sin`, `Pn`, `Qt`, `Qv`, `ce`, `h`, `qt`, `this.air.fillStyle`, `this.air.fillStyle().fillRect`, `this.energy`, `this.glint`, `this.ground.lineStyle`, `this.ground.lineStyle().strokePoints`, `this.light`, `this.line`, `this.sparks`, `this.sword`, `this.swords[0].setTint`, `to`, `w`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillRect`, `energy`, `glint`, `ground.lineStyle`, `ground.lineStyle().strokePoints`, `light`, `line`, `sparks`, `sword`, `swords[0].setTint`.
- **Numeric comparisons:** `e>=.24`; `e<1.42`; `e<.94`; `L<8`; `e>=.94`; `i<0`; `i>1.15`; `m<3`; `i<.63`.

### `zu.glint(e, t, i=28, n=14876671)`
- **CONFIRMED location:** UTF-16 `[ 183309, 183573 )`, UTF-8 bytes `[ 186546, 186810 )`, physical line 237, columns 39693–39957.
- **Syntactic calls:** `this.air.fillStyle`, `this.air.fillStyle().fillPoints`.
- **Calls through `this`:** `air.fillStyle`, `air.fillStyle().fillPoints`.
- **Numeric comparisons:** `t<0`; `t>.28`.

### `zu.ring(e, t, i, n=0)`
- **CONFIRMED location:** UTF-16 `[ 183573, 183922 )`, UTF-8 bytes `[ 186810, 187159 )`, physical line 237, columns 39957–40306.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `this.ground.lineStyle`, `this.ground.lineStyle().lineBetween`, `this.ground.lineStyle().strokeEllipse`.
- **Calls through `this`:** `ground.lineStyle`, `ground.lineStyle().lineBetween`, `ground.lineStyle().strokeEllipse`.
- **Numeric comparisons:** `i<=0`; `s<12`.

### `zu.cracks(e, t, i, n, s=!1)`
- **CONFIRMED location:** UTF-16 `[ 183922, 184348 )`, UTF-8 bytes `[ 187159, 187585 )`, physical line 237, columns 40306–40732.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `qt`, `this.ground.lineStyle`, `this.ground.lineStyle().strokePoints`.
- **Calls through `this`:** `ground.lineStyle`, `ground.lineStyle().strokePoints`.
- **Numeric comparisons:** `t<0`; `t>1.12`; `r<7`.

### `zu.heavenArray(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 184348, 185481 )`, UTF-8 bytes `[ 187585, 188718 )`, physical line 237, columns 40732–41865.
- **Syntactic calls:** `Math.cos`, `Math.sin`, `qt`, `r`, `this.ground.lineStyle`, `this.ground.lineStyle().strokeEllipse`, `this.light`, `this.line`, `this.sky.lineStyle`, `this.sky.lineStyle().lineBetween`, `this.sky.lineStyle().strokeEllipse`, `this.sky.lineStyle().strokePoints`, `to`.
- **Calls through `this`:** `ground.lineStyle`, `ground.lineStyle().strokeEllipse`, `light`, `line`, `sky.lineStyle`, `sky.lineStyle().lineBetween`, `sky.lineStyle().strokeEllipse`, `sky.lineStyle().strokePoints`.
- **Numeric comparisons:** `n<=0`; `c<8`; `c<32`; `c%4===0`; `c%4===0`; `c<16`.

### `zu.learned(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 185481, 189118 )`, UTF-8 bytes `[ 188718, 192355 )`, physical line 237, columns 41865–45502.
- **Syntactic calls:** `Array.from`, `Math.atan2`, `Math.cos`, `Math.max`, `Math.min`, `Math.sin`, `Math.sqrt`, `Pn`, `Qt`, `c`, `ce`, `i.foes.forEach`, `i.foes.reduce`, `l`, `m`, `qt`, `r`, `this.air.lineStyle`, `this.air.lineStyle().lineBetween`, `this.energy`, `this.glint`, `this.impact.render`, `this.line`, `this.mist[d].setPosition`, `this.mist[d].setPosition().setFrame`, `this.mist[d].setPosition().setFrame().setScale`, `this.mist[d].setPosition().setFrame().setScale().setTint`, `this.mist[d].setPosition().setFrame().setScale().setTint().setAlpha`, `this.mist[d].setPosition().setFrame().setScale().setTint().setAlpha().setDepth`, `this.mist[d].setPosition().setFrame().setScale().setTint().setAlpha().setDepth().setVisible` … (+16 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `air.lineStyle`, `air.lineStyle().lineBetween`, `energy`, `glint`, `impact.render`, `line`, `mist[d].setPosition`, `mist[d].setPosition().setFrame`, `mist[d].setPosition().setFrame().setScale`, `mist[d].setPosition().setFrame().setScale().setTint`, `mist[d].setPosition().setFrame().setScale().setTint().setAlpha`, `mist[d].setPosition().setFrame().setScale().setTint().setAlpha().setDepth`, `mist[d].setPosition().setFrame().setScale().setTint().setAlpha().setDepth().setVisible`, `petals[0].setFrame`, `petals[0].setFrame().setPosition`, `petals[0].setFrame().setPosition().setScale`, `petals[0].setFrame().setPosition().setScale().setAlpha`, `petals[0].setFrame().setPosition().setScale().setAlpha().setDepth`, `petals[0].setFrame().setPosition().setScale().setAlpha().setDepth().setVisible`, `petals[BinaryExpression].setFrame`, `petals[BinaryExpression].setFrame().setPosition`, `petals[BinaryExpression].setFrame().setPosition().setScale`, `petals[BinaryExpression].setFrame().setPosition().setScale().setDepth`, `petals[BinaryExpression].setFrame().setPosition().setScale().setDepth().setAlpha`, `petals[BinaryExpression].setFrame().setPosition().setScale().setDepth().setAlpha().setVisible`, `sparks`, `sword`.
- **Numeric comparisons:** `c>=0`; `c<.6`; `h<3`; `d<.8`; `d<1.75`; `t>=.3`; `t<2.2`; `u<2`; `c<6`; `Math.sin(d)<0`; `Math.sin(d)<0`; `p<0` … (+20).

### `zu.render(e, t, i, n={})`
- **CONFIRMED location:** UTF-16 `[ 189118, 193222 )`, UTF-8 bytes `[ 192355, 196459 )`, physical line 237, columns 45502–49606.
- **Syntactic calls:** `C`, `Math.atan2`, `Math.cos`, `Math.floor`, `Math.max`, `Math.min`, `Math.round`, `Math.sin`, `Pl.find`, `Pl.findIndex`, `Pn`, `Qt`, `Xv`, `ce`, `d.setVisible`, `d.setVisible().clearTint`, `p.setFrame`, `p.setFrame().setPosition`, `p.setFrame().setPosition().setScale`, `p.setFrame().setPosition().setScale().setFlipX`, `p.setFrame().setPosition().setScale().setFlipX().setAlpha`, `p.setFrame().setPosition().setScale().setFlipX().setAlpha().setVisible`, `qt`, `this.air.clear`, `this.air.lineBetween`, `this.air.lineStyle`, `this.cracks`, `this.energy`, `this.featherSlash`, `this.ghosts.forEach` … (+28 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `air.clear`, `air.lineBetween`, `air.lineStyle`, `cracks`, `energy`, `featherSlash`, `ghosts.forEach`, `ghosts[d].setFrame`, `ghosts[d].setFrame().setPosition`, `ghosts[d].setFrame().setPosition().setDepth`, `ghosts[d].setFrame().setPosition().setDepth().setAlpha`, `ghosts[d].setFrame().setPosition().setDepth().setAlpha().setVisible`, `glint`, `ground.clear`, `ground.lineStyle`, `ground.lineStyle().strokeEllipse`, `heavenArray`, `heavySlash`, `impact.render`, `learned`, `light`, `lights.forEach`, `line`, `mist.forEach`, `petals.forEach`, `ring`, `sky.clear`, `skyShatter`, `sword`, `swords.forEach` … (+3 additional; see ASSET_INDEX.json).
- **Numeric comparisons:** `t<0`; `Pl.findIndex(d=>d.id===e)>=5`; `t<.56`; `d<6`; `g<0`; `d===5`; `g<.12`; `t>=.2`; `t<1.42`; `t>.12`; `t<1.15`; `f<3` … (+13).

### `zu.inspect()`
- **CONFIRMED location:** UTF-16 `[ 193222, 193526 )`, UTF-8 bytes `[ 196459, 196763 )`, physical line 237, columns 49606–49910.
- **Syntactic calls:** `this.ghosts.filter`, `this.mist.filter`, `this.swords.filter`, `this.swords.filter().map`.
- **Calls through `this`:** `ghosts.filter`, `mist.filter`, `swords.filter`, `swords.filter().map`.

### `zu.destroy()`
- **CONFIRMED location:** UTF-16 `[ 193526, 193897 )`, UTF-8 bytes `[ 196763, 197134 )`, physical line 237, columns 49910–50281.
- **Syntactic calls:** `e.destroy`, `this.air.destroy`, `this.ghosts.forEach`, `this.ground.destroy`, `this.impact.destroy`, `this.lights.forEach`, `this.mist.forEach`, `this.petals.forEach`, `this.scene.events.off`, `this.sky.destroy`, `this.swords.forEach`.
- **Calls through `this`:** `air.destroy`, `ghosts.forEach`, `ground.destroy`, `impact.destroy`, `lights.forEach`, `mist.forEach`, `petals.forEach`, `scene.events.off`, `sky.destroy`, `swords.forEach`.
- **Imported alias name matches (potential):** `et`.
