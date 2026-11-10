# Class `hv` — Modal panels

**Source range:** `hv` [UTF-16 80983–86980, line 216].
**Role:** Dialog panel creation, focus trapping, restoring scroll/focus, refresh scheduling, cleanup. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 6.

Methods and evidence (calls collected include nested callbacks):

### `hv.constructor()`
- **CONFIRMED location:** UTF-16 `[ 80992, 81146 )`, UTF-8 bytes `[ 82086, 82240 )`, physical line 216, columns 601–755.
- **Syntactic calls:** `M`, `ov`.

### `hv.refresh(e)`
- **CONFIRMED location:** UTF-16 `[ 81146, 81537 )`, UTF-8 bytes `[ 82240, 82631 )`, physical line 216, columns 755–1146.
- **Syntactic calls:** `/^(INPUT|SELECT|TEXTAREA)$/.test`, `e`, `performance.now`, `this.el.contains`, `window.setTimeout`.
- **Calls through `this`:** `el.contains`.

### `hv.open()`
- **CONFIRMED location:** UTF-16 `[ 81537, 81570 )`, UTF-8 bytes `[ 82631, 82664 )`, physical line 216, columns 1146–1179.
- **Syntactic calls:** (none observed).

### `hv.title()`
- **CONFIRMED location:** UTF-16 `[ 81570, 81641 )`, UTF-8 bytes `[ 82664, 82735 )`, physical line 216, columns 1179–1250.
- **Syntactic calls:** (none observed).

### `hv.close(e=!0)`
- **CONFIRMED location:** UTF-16 `[ 81641, 82027 )`, UTF-8 bytes `[ 82735, 83121 )`, physical line 216, columns 1250–1636.
- **Syntactic calls:** `_d.hide`, `clearTimeout`, `document.body.classList.remove`, `document.querySelectorAll`, `document.querySelectorAll().forEach`, `n.close`, `t.call`, `this.el.remove`, `this.opener.focus`.
- **Calls through `this`:** `el.remove`, `opener.focus`.
- **Imported alias name matches (potential):** `_d`.

### `hv.show(e, t, i, n=[], s=!1, o=!1, l="")`
- **CONFIRMED location:** UTF-16 `[ 82027, 86979 )`, UTF-8 bytes `[ 83121, 88080 )`, physical line 216, columns 1636–6588.
- **Syntactic calls:** `/^(INPUT|SELECT|TEXTAREA)$/.test`, `A.getAttribute`, `A.getBoundingClientRect`, `A.indexOf`, `A[ConditionalExpression].focus`, `Array.from`, `Array.from().filter`, `Array.from().find`, `Array.from().map`, `Array.prototype.indexOf.call`, `ArrayExpression.map`, `ArrayExpression.map().find`, `B.getAttribute`, `B.getClientRects`, `E.appendChild`, `E.focus`, `E.getAttribute`, `E.matches`, `E.preventDefault`, `E.querySelectorAll`, `E.stopPropagation`, `L.contains`, `N.querySelector`, `P`, `P.blur`, `P.closest`, `P.querySelector`, `P.trim`, `S.remove`, `T.call` … (+29 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `close`, `el.classList.contains`, `el.querySelectorAll`.
- **Imported alias name matches (potential):** `_d`.
- **Numeric comparisons:** `A.scrollTop>0`; `A.scrollLeft>0`; `q<0`.
