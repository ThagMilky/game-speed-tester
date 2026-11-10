# Class `x$` — Map particle emitter

**Source range:** `x$` [UTF-16 722984–725148, line 965].
**Role:** Particle spawn/update class. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 4.

Methods and evidence (calls collected include nested callbacks):

### `x$.constructor(e, t, i, n, s, o)`
- **CONFIRMED location:** UTF-16 `[ 722993, 723691 )`, UTF-8 bytes `[ 741959, 742657 )`, physical line 965, columns 1620–2318.
- **Syntactic calls:** `M`, `Math.round`, `e.add.image`, `e.add.image().setVisible`, `e.add.image().setVisible().setDepth`, `e.add.image().setVisible().setDepth().setTint`, `h.setBlendMode`, `k0`, `l.slice`, `parseInt`, `t.c.replace`, `this.ps.push`, `this.r`, `this.spawn`.
- **Calls through `this`:** `ps.push`, `r`, `spawn`.
- **Imported alias name matches (potential):** `et`.
- **Numeric comparisons:** `l.length>=8`.

### `x$.R(e, t)`
- **CONFIRMED location:** UTF-16 `[ 723691, 723722 )`, UTF-8 bytes `[ 742657, 742688 )`, physical line 965, columns 2318–2349.
- **Syntactic calls:** `this.r`.
- **Calls through `this`:** `r`.

### `x$.spawn(e)`
- **CONFIRMED location:** UTF-16 `[ 723722, 724292 )`, UTF-8 bytes `[ 742688, 743258 )`, physical line 965, columns 2349–2919.
- **Syntactic calls:** `Math.atan2`, `Math.cos`, `Math.max`, `Math.sin`, `Math.sqrt`, `this.R`, `this.r`.
- **Calls through `this`:** `R`, `r`.
- **Numeric comparisons:** `t.radius>0`.

### `x$.update(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 724292, 725147 )`, UTF-8 bytes `[ 743258, 744113 )`, physical line 965, columns 2919–3774.
- **Syntactic calls:** `Math.max`, `Math.min`, `Math.sin`, `h.img.setVisible`, `h.img.setVisible().setPosition`, `h.img.setVisible().setPosition().setAlpha`, `h.img.setVisible().setPosition().setAlpha().setAngle`, `h.img.setVisible().setPosition().setAlpha().setAngle().setDisplaySize`, `this.spawn`, `this.toPx`.
- **Calls through `this`:** `spawn`, `toPx`.
- **Numeric comparisons:** `this.debt>=1`; `c<.2`; `c<.75`; `p>.01`.
