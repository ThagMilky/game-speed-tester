# Class `b$` — Atmospheric particles

**Source range:** `b$` [UTF-16 725148–726294, line 965].
**Role:** Scene air/ambient effect update class. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 2.

Methods and evidence (calls collected include nested callbacks):

### `b$.constructor(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 725157, 725602 )`, UTF-8 bytes `[ 744123, 744568 )`, physical line 965, columns 3784–4229.
- **Syntactic calls:** `M`, `Math.floor`, `e.add.image`, `e.add.image().setTint`, `e.add.image().setTint().setAlpha`, `e.add.image().setTint().setAlpha().setDepth`, `e.add.image().setTint().setAlpha().setDepth().setDisplaySize`, `e.add.image().setTint().setDepth`, `e.add.image().setTint().setDepth().setAlpha`, `k0`, `o`, `this.dust.push`, `this.fog.push`.
- **Calls through `this`:** `dust.push`, `fog.push`.
- **Numeric comparisons:** `l<72`; `l<72`.

### `b$.update(e, t, i=!0)`
- **CONFIRMED location:** UTF-16 `[ 725602, 726293 )`, UTF-8 bytes `[ 744568, 745259 )`, physical line 965, columns 4229–4920.
- **Syntactic calls:** `Math.sin`, `r.img.setPosition`, `r.img.setPosition().setAlpha`, `r.img.setVisible`, `r.setVisible`, `r.setVisible().setPosition`, `r.setVisible().setPosition().setDisplaySize`, `r.setVisible().setPosition().setDisplaySize().setAlpha`, `this.dust.forEach`, `this.toPx`.
- **Calls through `this`:** `dust.forEach`, `toPx`.
