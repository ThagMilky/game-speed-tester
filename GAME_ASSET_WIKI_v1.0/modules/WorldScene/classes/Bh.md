# Class `Bh` — Scene VFX renderer

**Source range:** `Bh` [UTF-16 152865–157347, line 237].
**Role:** Assets and sprite effect rendering with preload lifecycle. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 5.

Methods and evidence (calls collected include nested callbacks):

### `Bh.constructor(e, t, i, n, s, o, l)`
- **CONFIRMED location:** UTF-16 `[ 152874, 153736 )`, UTF-8 bytes `[ 155179, 156041 )`, physical line 237, columns 9258–10120.
- **Syntactic calls:** `Bu`, `M`, `Math.max`, `Ml`, `dl.has`, `e.add.container`, `e.add.container().setDepth`, `e.add.graphics`, `e.add.image`, `e.add.image().setCrop`, `e.add.image().setCrop().setVisible`, `e.add.image().setVisible`, `i.effects.map`, `this.container.add`, `this.sprites.push`.
- **Calls through `this`:** `container.add`, `sprites.push`.
- **Imported alias name matches (potential):** `Ml`, `dl`.
- **Numeric comparisons:** `r<28`.

### `Bh.preload(e, t)`
- **CONFIRMED location:** UTF-16 `[ 153736, 153940 )`, UTF-8 bytes `[ 156041, 156245 )`, physical line 237, columns 10120–10324.
- **Syntactic calls:** `Bu.preload`, `Vv.has`, `e.load.spritesheet`, `e.textures.exists`.

### `Bh.sprite(e, t, i, n, s, o=0)`
- **CONFIRMED location:** UTF-16 `[ 153940, 154157 )`, UTF-8 bytes `[ 156245, 156462 )`, physical line 237, columns 10324–10541.
- **Syntactic calls:** `Math.round`, `Ss`, `l.setVisible`, `l.setVisible().setPosition`, `l.setVisible().setPosition().setDisplaySize`, `l.setVisible().setPosition().setDisplaySize().setAlpha`, `l.setVisible().setPosition().setDisplaySize().setAlpha().setRotation`.
- **Numeric comparisons:** `s>0`.

### `Bh.render(e)`
- **CONFIRMED location:** UTF-16 `[ 154157, 157227 )`, UTF-8 bytes `[ 156462, 159532 )`, physical line 237, columns 10541–13611.
- **Syntactic calls:** `Fv`, `Math.atan2`, `Math.cos`, `Math.hypot`, `Math.min`, `Math.round`, `Math.sin`, `Ss`, `f.setVisible`, `this.anchor`, `this.lantern.setVisible`, `this.lantern.setVisible().setPosition`, `this.lantern.setVisible().setPosition().setDisplaySize`, `this.lantern.setVisible().setPosition().setDisplaySize().setRotation`, `this.lantern.setVisible().setPosition().setDisplaySize().setRotation().setAlpha`, `this.lantern.setVisible().setPosition().setDisplaySize().setRotation().setAlpha().setDepth`, `this.sparks.clear`, `this.sparks.fillRect`, `this.sparks.fillStyle`, `this.sparks.fillStyle().fillRect`, `this.sparks.lineStyle`, `this.sparks.lineStyle().strokeEllipse`, `this.sparks.strokeEllipse`, `this.sprite`, `this.sprites[g].setVisible`, `this.ultimate.render`.
- **Calls through `this`:** `anchor`, `lantern.setVisible`, `lantern.setVisible().setPosition`, `lantern.setVisible().setPosition().setDisplaySize`, `lantern.setVisible().setPosition().setDisplaySize().setRotation`, `lantern.setVisible().setPosition().setDisplaySize().setRotation().setAlpha`, `lantern.setVisible().setPosition().setDisplaySize().setRotation().setAlpha().setDepth`, `sparks.clear`, `sparks.fillRect`, `sparks.fillStyle`, `sparks.fillStyle().fillRect`, `sparks.lineStyle`, `sparks.lineStyle().strokeEllipse`, `sparks.strokeEllipse`, `sprite`, `sprites[g].setVisible`, `ultimate.render`.
- **Numeric comparisons:** `g.alpha>0`; `g.groundY>0`; `g.alpha>0`; `f<8`; `this.index===9`; `d>.65`; `g<12`; `f<0`; `f>.75`; `this.index===9`; `C<4`; `C<4` … (+6).

### `Bh.destroy()`
- **CONFIRMED location:** UTF-16 `[ 157227, 157346 )`, UTF-8 bytes `[ 159532, 159651 )`, physical line 237, columns 13611–13730.
- **Syntactic calls:** `e.destroy`, `this.container.destroy`, `this.ultimate.destroy`.
- **Calls through `this`:** `container.destroy`, `ultimate.destroy`.
