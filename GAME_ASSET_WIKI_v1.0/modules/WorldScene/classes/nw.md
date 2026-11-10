# Class `nw` — Chat client UI

**Source range:** `nw` [UTF-16 422249–432187, line 577].
**Role:** Chat tabs, location context, render, filters, send callbacks and disconnect display. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 17.

Methods and evidence (calls collected include nested callbacks):

### `nw.constructor()`
- **CONFIRMED location:** UTF-16 `[ 422258, 425968 )`, UTF-8 bytes `[ 429530, 433282 )`, physical line 577, columns 11–1711.
- **Syntactic calls:** `Kl`, `M`, `Math.max`, `Set`, `String`, `document.addEventListener`, `document.body.append`, `document.createElement`, `document.head.appendChild`, `e.preventDefault`, `e.stopPropagation`, `t.setAttribute`, `this.atBottom`, `this.close`, `this.input.addEventListener`, `this.lines.addEventListener`, `this.open`, `this.render`, `this.root.addEventListener`, `this.root.classList.toggle`, `this.root.querySelector`, `this.root.querySelector().append`, `this.root.setAttribute`, `this.root.style.setProperty`, `this.send`, `this.setFilter`, `this.toBottom`, `visualViewport.addEventListener`.
- **Calls through `this`:** `atBottom`, `close`, `input.addEventListener`, `lines.addEventListener`, `open`, `render`, `root.addEventListener`, `root.classList.toggle`, `root.querySelector`, `root.querySelector().append`, `root.setAttribute`, `root.style.setProperty`, `send`, `setFilter`, `toBottom`.
- **Imported alias name matches (potential):** `Kl`.
- **Numeric comparisons:** `((e==null?void 0:e.height)??innerHeight)<300`; `e.keyCode===229`.

### `nw.setContext(e, t)`
- **CONFIRMED location:** UTF-16 `[ 425968, 426518 )`, UTF-8 bytes `[ 433282, 433839 )`, physical line 582, columns 1711–2261.
- **Syntactic calls:** `Array.isArray`, `ArrayExpression.includes`, `JSON.parse`, `Number.isFinite`, `i.filter`, `n.filter`, `n.filter().slice`, `sessionStorage.getItem`, `this.render`, `this.root.querySelector`.
- **Calls through `this`:** `render`, `root.querySelector`.

### `nw.typing()`
- **CONFIRMED location:** UTF-16 `[ 426518, 426575 )`, UTF-8 bytes `[ 433839, 433896 )`, physical line 582, columns 2261–2318.
- **Syntactic calls:** `this.root.classList.contains`.
- **Calls through `this`:** `root.classList.contains`.

### `nw.open()`
- **CONFIRMED location:** UTF-16 `[ 426575, 426975 )`, UTF-8 bytes `[ 433896, 434296 )`, physical line 582, columns 2318–2718.
- **Syntactic calls:** `ConditionalExpression.focus`, `document.body.classList.add`, `document.body.classList.contains`, `t.call`, `this.badge`, `this.root.classList.add`, `this.root.querySelector`, `this.root.querySelector().setAttribute`, `this.toBottom`, `this.viewport`.
- **Calls through `this`:** `badge`, `root.classList.add`, `root.querySelector`, `root.querySelector().setAttribute`, `toBottom`, `viewport`.

### `nw.close()`
- **CONFIRMED location:** UTF-16 `[ 426975, 427270 )`, UTF-8 bytes `[ 434296, 434591 )`, physical line 582, columns 2718–3013.
- **Syntactic calls:** `document.activeElement.blur`, `document.body.classList.remove`, `e.closest`, `t.call`, `this.root.classList.remove`, `this.root.querySelector`, `this.root.querySelector().setAttribute`.
- **Calls through `this`:** `root.classList.remove`, `root.querySelector`, `root.querySelector().setAttribute`.

### `nw.disconnect()`
- **CONFIRMED location:** UTF-16 `[ 427270, 427488 )`, UTF-8 bytes `[ 434591, 434837 )`, physical line 582, columns 3013–3231.
- **Syntactic calls:** `this.root.querySelector`.
- **Calls through `this`:** `root.querySelector`.

### `nw.send()`
- **CONFIRMED location:** UTF-16 `[ 427488, 427989 )`, UTF-8 bytes `[ 434837, 435363 )`, physical line 582, columns 3231–3732.
- **Syntactic calls:** `e.startsWith`, `performance.now`, `t.call`, `this.input.focus`, `this.input.value.trim`.
- **Calls through `this`:** `input.focus`, `input.value.trim`.
- **Numeric comparisons:** `performance.now()-this.lastSend<850`.

### `nw.setFilter(e)`
- **CONFIRMED location:** UTF-16 `[ 427989, 428356 )`, UTF-8 bytes `[ 435363, 435734 )`, physical line 582, columns 3732–4099.
- **Syntactic calls:** `String`, `t.setAttribute`, `this.render`, `this.root.querySelector`, `this.root.querySelectorAll`, `this.root.querySelectorAll().forEach`, `this.toBottom`.
- **Calls through `this`:** `render`, `root.querySelector`, `root.querySelectorAll`, `root.querySelectorAll().forEach`, `toBottom`.

### `nw.atBottom()`
- **CONFIRMED location:** UTF-16 `[ 428356, 428446 )`, UTF-8 bytes `[ 435734, 435824 )`, physical line 582, columns 4099–4189.
- **Syntactic calls:** (none observed).
- **Numeric comparisons:** `this.lines.scrollHeight-this.lines.clientHeight-this.lines.scrollTop<32`.

### `nw.toBottom()`
- **CONFIRMED location:** UTF-16 `[ 428446, 428547 )`, UTF-8 bytes `[ 435824, 435925 )`, physical line 582, columns 4189–4290.
- **Syntactic calls:** `this.root.querySelector`.
- **Calls through `this`:** `root.querySelector`.

### `nw.badge()`
- **CONFIRMED location:** UTF-16 `[ 428547, 428656 )`, UTF-8 bytes `[ 435925, 436034 )`, physical line 582, columns 4290–4399.
- **Syntactic calls:** `String`, `this.root.querySelector`.
- **Calls through `this`:** `root.querySelector`.
- **Numeric comparisons:** `this.unread===0`.

### `nw.setActiveLocations(e)`
- **CONFIRMED location:** UTF-16 `[ 428656, 428908 )`, UTF-8 bytes `[ 436034, 436286 )`, physical line 582, columns 4399–4651.
- **Syntactic calls:** `ArrayExpression.sort`, `ArrayExpression.sort().join`, `Set`, `this.activeLocations.has`, `this.root.querySelectorAll`, `this.root.querySelectorAll().forEach`.
- **Calls through `this`:** `activeLocations.has`, `root.querySelectorAll`, `root.querySelectorAll().forEach`.

### `nw.row(e)`
- **CONFIRMED location:** UTF-16 `[ 428908, 429867 )`, UTF-8 bytes `[ 436286, 437248 )`, physical line 582, columns 4651–5610.
- **Syntactic calls:** `/^(boss|realm):/.test`, `Date`, `NewExpression.toISOString`, `NewExpression.toLocaleTimeString`, `document.createElement`, `document.createTextNode`, `l.call`, `s.append`, `t.append`, `this.activeLocations.has`.
- **Calls through `this`:** `activeLocations.has`.

### `nw.renderLive()`
- **CONFIRMED location:** UTF-16 `[ 429867, 430351 )`, UTF-8 bytes `[ 437248, 437732 )`, physical line 582, columns 5610–6094.
- **Syntactic calls:** `Date.now`, `Math.max`, `clearTimeout`, `document.body.classList.contains`, `e.replaceChildren`, `n.map`, `this.history.filter`, `this.history.filter().slice`, `this.renderLive`, `this.root.querySelector`, `this.row`, `window.setTimeout`.
- **Calls through `this`:** `history.filter`, `history.filter().slice`, `renderLive`, `root.querySelector`, `row`.
- **Numeric comparisons:** `n.length===0`.

### `nw.render()`
- **CONFIRMED location:** UTF-16 `[ 430351, 430880 )`, UTF-8 bytes `[ 437732, 438323 )`, physical line 582, columns 6094–6623.
- **Syntactic calls:** `document.createElement`, `this.history.filter`, `this.lines.append`, `this.lines.replaceChildren`, `this.renderLive`, `this.row`.
- **Calls through `this`:** `history.filter`, `lines.append`, `lines.replaceChildren`, `renderLive`, `row`.

### `nw.add(e, t, i, n, s)`
- **CONFIRMED location:** UTF-16 `[ 430880, 431881 )`, UTF-8 bytes `[ 438323, 439324 )`, physical line 582, columns 6623–7624.
- **Syntactic calls:** `ArrayExpression.sort`, `Date.now`, `JSON.stringify`, `c.push`, `c.shift`, `m.remove`, `p.remove`, `sessionStorage.setItem`, `this.atBottom`, `this.badge`, `this.lines.append`, `this.lines.querySelector`, `this.renderLive`, `this.root.querySelector`, `this.row`, `this.toBottom`, `u.remove`.
- **Calls through `this`:** `atBottom`, `badge`, `lines.append`, `lines.querySelector`, `renderLive`, `root.querySelector`, `row`, `toBottom`.
- **Numeric comparisons:** `this.lines.childElementCount>100`.

### `nw.destroy()`
- **CONFIRMED location:** UTF-16 `[ 431881, 432186 )`, UTF-8 bytes `[ 439324, 439629 )`, physical line 582, columns 7624–7929.
- **Syntactic calls:** `clearTimeout`, `document.removeEventListener`, `this.close`, `this.root.remove`, `this.style.remove`, `visualViewport.removeEventListener`.
- **Calls through `this`:** `close`, `root.remove`, `style.remove`.
