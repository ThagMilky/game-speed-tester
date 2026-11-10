# Class `Nf` — Custom WebGL image

**Source range:** `Nf` [UTF-16 263434–264008, line 237].
**Role:** Phaser Image subclass with custom renderWebGL implementation. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `et.GameObjects.Image`.
**Method count:** 2.

Methods and evidence (calls collected include nested callbacks):

### `Nf.constructor()`
- **CONFIRMED location:** UTF-16 `[ 263472, 263551 )`, UTF-8 bytes `[ 267765, 267844 )`, physical line 237, columns 119856–119935.
- **Syntactic calls:** `M`, `super`.

### `Nf.renderWebGL(t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 263551, 264007 )`, UTF-8 bytes `[ 267844, 268300 )`, physical line 237, columns 119935–120391.
- **Syntactic calls:** `Object.prototype.hasOwnProperty.call`, `n.addToRenderList`, `o.batchSprite.call`, `u.call`.
- **Numeric comparisons:** `l.scaleY<0`.
