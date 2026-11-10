# Class `Ou` — Environment surface response

**Source range:** `Ou` [UTF-16 255883–259187, line 237].
**Role:** Environmental surfaces/materials, visible impacts, environmental event effects. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 9.

Methods and evidence (calls collected include nested callbacks):

### `Ou.constructor(e, t)`
- **CONFIRMED location:** UTF-16 `[ 255892, 256208 )`, UTF-8 bytes `[ 260185, 260501 )`, physical line 237, columns 112276–112592.
- **Syntactic calls:** `M`, `e.define`, `this.shakes.push`, `this.zones.push`.
- **Calls through `this`:** `shakes.push`, `zones.push`.

### `Ou.preload(e)`
- **CONFIRMED location:** UTF-16 `[ 256208, 256260 )`, UTF-8 bytes `[ 260501, 260553 )`, physical line 237, columns 112592–112644.
- **Syntactic calls:** `Rc.preload`, `ds`.
- **Imported alias name matches (potential):** `Rc`, `ds`.

### `Ou.setGround(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 256260, 256566 )`, UTF-8 bytes `[ 260553, 260859 )`, physical line 237, columns 112644–112950.
- **Syntactic calls:** `document.createElement`, `o.drawImage`, `o.getImageData`, `s.getContext`.

### `Ou.zone(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 256566, 256673 )`, UTF-8 bytes `[ 260859, 260966 )`, physical line 237, columns 112950–113057.
- **Syntactic calls:** `this.zones.find`.
- **Calls through `this`:** `zones.find`.

### `Ou.clearZones()`
- **CONFIRMED location:** UTF-16 `[ 256673, 256720 )`, UTF-8 bytes `[ 260966, 261013 )`, physical line 237, columns 113057–113104.
- **Syntactic calls:** (none observed).

### `Ou.material(e, t)`
- **CONFIRMED location:** UTF-16 `[ 256720, 257384 )`, UTF-8 bytes `[ 261013, 261677 )`, physical line 237, columns 113104–113768.
- **Syntactic calls:** `Math.floor`, `Math.max`, `Math.min`, `this.host.toTile`, `this.host.waterAt`.
- **Calls through `this`:** `host.toTile`, `host.waterAt`.
- **Numeric comparisons:** `((e-m.x)/m.rx)**2+((t-m.y)/m.ry)**2<=1`; `m<=1`; `g<=1`; `f<0`; `x<0`; `s.data[v+3]<128`; `p-u<24`; `o>150`; `l>125`.

### `Ou.visible(e, t, i=64)`
- **CONFIRMED location:** UTF-16 `[ 257384, 257492 )`, UTF-8 bytes `[ 261677, 261785 )`, physical line 237, columns 113768–113876.
- **Syntactic calls:** `this.host.camera`.
- **Calls through `this`:** `host.camera`.

### `Ou.impact(e, t, i, n, s={})`
- **CONFIRMED location:** UTF-16 `[ 257492, 258847 )`, UTF-8 bytes `[ 261785, 263140 )`, physical line 237, columns 113876–115231.
- **Syntactic calls:** `Math.cos`, `Math.hypot`, `Math.round`, `Math.sign`, `Math.sin`, `ds`, `o.sheet`, `this.host.now`, `this.host.props`, `this.host.sway`, `this.juice.ready`, `this.material`, `this.shakes.find`, `this.visible`.
- **Calls through `this`:** `host.now`, `host.props`, `host.sway`, `juice.ready`, `material`, `shakes.find`, `visible`.
- **Imported alias name matches (potential):** `ds`.
- **Numeric comparisons:** `u.hTop-u.hBot>2.5`; `g===0`; `y>.2`; `p-- >0`; `k<0`; `u<8`; `i>70`; `i>90`.

### `Ou.update(e)`
- **CONFIRMED location:** UTF-16 `[ 258847, 259186 )`, UTF-8 bytes `[ 263140, 263479 )`, physical line 237, columns 115231–115570.
- **Syntactic calls:** `Math.exp`, `Math.min`, `Math.round`, `Math.sin`, `i.setPosition`.
- **Numeric comparisons:** `t.t>=.5`; `t.t<0`.
