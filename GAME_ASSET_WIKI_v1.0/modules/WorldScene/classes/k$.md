# Class `k$` — Weather renderer

**Source range:** `k$` [UTF-16 727212–732863, line 965].
**Role:** Weather toggling, rain and dynamic event rendering. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 6.

Methods and evidence (calls collected include nested callbacks):

### `k$.constructor(e, t, i=()=>!0)`
- **CONFIRMED location:** UTF-16 `[ 727221, 728355 )`, UTF-8 bytes `[ 746199, 747333 )`, physical line 965, columns 5848–6982.
- **Syntactic calls:** `/Cave|DauTruong/.test`, `Array.from`, `Dn`, `M`, `Object.fromEntries`, `document.body.appendChild`, `document.createElement`, `ho.map`, `rs`, `this.canvas.getContext`, `this.canvas.setAttribute`, `this.random`.
- **Calls through `this`:** `canvas.getContext`, `canvas.setAttribute`, `random`.

### `k$.random()`
- **CONFIRMED location:** UTF-16 `[ 728355, 728472 )`, UTF-8 bytes `[ 747333, 747450 )`, physical line 965, columns 6982–7099.
- **Syntactic calls:** (none observed).

### `k$.setEnabled(e)`
- **CONFIRMED location:** UTF-16 `[ 728472, 728636 )`, UTF-8 bytes `[ 747450, 747614 )`, physical line 965, columns 7099–7263.
- **Syntactic calls:** `this.ctx.clearRect`.
- **Calls through `this`:** `ctx.clearRect`.

### `k$.update(e, t, i=Date.now()/1e3)`
- **CONFIRMED location:** UTF-16 `[ 728636, 731691 )`, UTF-8 bytes `[ 747614, 750669 )`, physical line 965, columns 7263–10318.
- **Syntactic calls:** `Date.now`, `Dn`, `Math.ceil`, `Math.exp`, `Math.floor`, `Math.max`, `Math.min`, `Math.round`, `Math.sin`, `f.addColorStop`, `ho.reduce`, `ko`, `o.beginPath`, `o.clearRect`, `o.createRadialGradient`, `o.fillRect`, `o.lineTo`, `o.moveTo`, `o.stroke`, `rs`, `this.rain`, `this.thunder`, `v$`.
- **Calls through `this`:** `rain`, `thunder`.
- **Imported alias name matches (potential):** `Aa`, `ko`.
- **Numeric comparisons:** `u<3`; `u<5`; `this.weights.dust>.3`; `C<.015`; `n<500`; `N%3===0`; `N%5===0`; `N%5===0`; `g<.1`; `g>.18`; `g<.38`; `this.weights.storm>.7` … (+3).

### `k$.rain(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 731691, 732831 )`, UTF-8 bytes `[ 750669, 751809 )`, physical line 965, columns 10318–11458.
- **Syntactic calls:** `Math.min`, `Math.round`, `Math.sin`, `s.beginPath`, `s.ellipse`, `s.lineTo`, `s.moveTo`, `s.stroke`, `this.canSplash`, `this.random`.
- **Calls through `this`:** `canSplash`, `random`.
- **Numeric comparisons:** `i<.015`; `t.width<1e3`; `this.random()<.45`; `d.age<0`; `d.z>.9`.

### `k$.destroy()`
- **CONFIRMED location:** UTF-16 `[ 732831, 732862 )`, UTF-8 bytes `[ 751809, 751840 )`, physical line 965, columns 11458–11489.
- **Syntactic calls:** `this.canvas.remove`.
- **Calls through `this`:** `canvas.remove`.
