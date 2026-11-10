# Class `Bu` — Scene VFX renderer

**Source range:** `Bu` [UTF-16 149171–152173, line 237].
**Role:** Game-specific sprite/effect renderer; inspect individual render calls. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 4.

Methods and evidence (calls collected include nested callbacks):

### `Bu.constructor(e, t, i, n, s, o)`
- **CONFIRMED location:** UTF-16 `[ 149180, 150076 )`, UTF-8 bytes `[ 151485, 152381 )`, physical line 237, columns 5564–6460.
- **Syntactic calls:** `Ia`, `Ia().findIndex`, `M`, `Math.min`, `Ml`, `e.add.container`, `e.add.container().setDepth`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.image`, `e.add.image().setOrigin`, `e.add.image().setOrigin().setVisible`, `o`, `this.container.add`, `this.satellites.push`.
- **Calls through `this`:** `container.add`, `satellites.push`.
- **Imported alias name matches (potential):** `Ia`, `Ml`.
- **Numeric comparisons:** `c<6`.

### `Bu.preload(e, t)`
- **CONFIRMED location:** UTF-16 `[ 150076, 150254 )`, UTF-8 bytes `[ 152381, 152559 )`, physical line 237, columns 6460–6638.
- **Syntactic calls:** `Ia`, `e.load.spritesheet`, `e.textures.exists`.
- **Imported alias name matches (potential):** `Ia`.

### `Bu.render(e)`
- **CONFIRMED location:** UTF-16 `[ 150254, 152113 )`, UTF-8 bytes `[ 152559, 154418 )`, physical line 237, columns 6638–8497.
- **Syntactic calls:** `Math.cos`, `Math.floor`, `Math.max`, `Math.min`, `Math.round`, `Math.sin`, `Os`, `this.art.setFrame`, `this.art.setFrame().setVisible`, `this.art.setFrame().setVisible().setPosition`, `this.art.setFrame().setVisible().setPosition().setDisplaySize`, `this.art.setFrame().setVisible().setPosition().setDisplaySize().setAlpha`, `this.art.setVisible`, `this.art.setVisible().setFrame`, `this.art.setVisible().setFrame().setPosition`, `this.art.setVisible().setFrame().setPosition().setDisplaySize`, `this.art.setVisible().setFrame().setPosition().setDisplaySize().setAlpha`, `this.ground.clear`, `this.ground.lineStyle`, `this.ground.lineStyle().strokeCircle`, `this.particles.clear`, `this.particles.fillStyle`, `this.particles.fillStyle().fillRect`, `this.satellites[v].setVisible`, `this.satellites[v].setVisible().setFrame`, `this.satellites[v].setVisible().setFrame().setPosition`, `this.satellites[v].setVisible().setFrame().setPosition().setDisplaySize`, `this.satellites[v].setVisible().setFrame().setPosition().setDisplaySize().setAlpha`, `v.setVisible`, `x.call`.
- **Calls through `this`:** `art.setFrame`, `art.setFrame().setVisible`, `art.setFrame().setVisible().setPosition`, `art.setFrame().setVisible().setPosition().setDisplaySize`, `art.setFrame().setVisible().setPosition().setDisplaySize().setAlpha`, `art.setVisible`, `art.setVisible().setFrame`, `art.setVisible().setFrame().setPosition`, `art.setVisible().setFrame().setPosition().setDisplaySize`, `art.setVisible().setFrame().setPosition().setDisplaySize().setAlpha`, `ground.clear`, `ground.lineStyle`, `ground.lineStyle().strokeCircle`, `particles.clear`, `particles.fillStyle`, `particles.fillStyle().fillRect`, `satellites[v].setVisible`, `satellites[v].setVisible().setFrame`, `satellites[v].setVisible().setFrame().setPosition`, `satellites[v].setVisible().setFrame().setPosition().setDisplaySize`, `satellites[v].setVisible().setFrame().setPosition().setDisplaySize().setAlpha`.
- **Numeric comparisons:** `e<0`; `r<0`; `r<0`; `this.row===2`; `y<32`; `c>.65`; `m<.18`; `v<6`; `k<0`; `k>.65`; `k<.2`; `v<2` … (+2).

### `Bu.destroy()`
- **CONFIRMED location:** UTF-16 `[ 152113, 152172 )`, UTF-8 bytes `[ 154418, 154477 )`, physical line 237, columns 8497–8556.
- **Syntactic calls:** `this.container.destroy`, `this.ground.destroy`.
- **Calls through `this`:** `container.destroy`, `ground.destroy`.
