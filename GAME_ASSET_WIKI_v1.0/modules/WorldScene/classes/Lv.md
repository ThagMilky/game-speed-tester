# Class `Lv` — Announcements queue

**Source range:** `Lv` [UTF-16 130884–134862, line 221].
**Role:** Controls large visual announcements and transitions. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 6.

Methods and evidence (calls collected include nested callbacks):

### `Lv.constructor()`
- **CONFIRMED location:** UTF-16 `[ 130893, 132546 )`, UTF-8 bytes `[ 132597, 134250 )`, physical line 221, columns 42337–162.
- **Syntactic calls:** `M`, `Set`, `document.body.append`, `document.createElement`, `document.head.append`, `this.animate`, `this.layout`, `this.root.setAttribute`, `window.addEventListener`.
- **Calls through `this`:** `animate`, `layout`, `root.setAttribute`.

### `Lv.push(e, t)`
- **CONFIRMED location:** UTF-16 `[ 132546, 132766 )`, UTF-8 bytes `[ 134250, 134470 )`, physical line 230, columns 162–382.
- **Syntactic calls:** `this.next`, `this.queue.push`, `this.queue.shift`, `this.seen.add`, `this.seen.delete`, `this.seen.has`, `this.seen.values`, `this.seen.values().next`.
- **Calls through `this`:** `next`, `queue.push`, `queue.shift`, `seen.add`, `seen.delete`, `seen.has`, `seen.values`, `seen.values().next`.
- **Numeric comparisons:** `this.seen.size>200`; `this.queue.length>=20`.

### `Lv.layout()`
- **CONFIRMED location:** UTF-16 `[ 132766, 133383 )`, UTF-8 bytes `[ 134470, 135087 )`, physical line 230, columns 382–999.
- **Syntactic calls:** `Math.max`, `c.style.setProperty`, `document.body.classList.contains`, `document.getElementById`, `h.getBoundingClientRect`, `l.getBoundingClientRect`, `r.getBoundingClientRect`, `this.root.querySelector`.
- **Calls through `this`:** `root.querySelector`.
- **Numeric comparisons:** `innerWidth-s-o<220`.

### `Lv.animate()`
- **CONFIRMED location:** UTF-16 `[ 133383, 133844 )`, UTF-8 bytes `[ 135087, 135548 )`, physical line 230, columns 999–1460.
- **Syntactic calls:** `Math.max`, `e.animate`, `n.cancel`, `this.root.classList.contains`, `this.root.querySelector`.
- **Calls through `this`:** `root.classList.contains`, `root.querySelector`.

### `Lv.next()`
- **CONFIRMED location:** UTF-16 `[ 133844, 134681 )`, UTF-8 bytes `[ 135548, 136393 )`, physical line 230, columns 1460–2297.
- **Syntactic calls:** `/^#[0-9a-f]{6,8}$/i.test`, `Math.max`, `clearTimeout`, `document.createElement`, `i.append`, `matchMedia`, `o.cancel`, `this.animate`, `this.layout`, `this.next`, `this.queue.shift`, `this.root.classList.toggle`, `this.root.replaceChildren`, `this.root.style.setProperty`, `window.setTimeout`.
- **Calls through `this`:** `animate`, `layout`, `next`, `queue.shift`, `root.classList.toggle`, `root.replaceChildren`, `root.style.setProperty`.

### `Lv.destroy()`
- **CONFIRMED location:** UTF-16 `[ 134681, 134861 )`, UTF-8 bytes `[ 136393, 136573 )`, physical line 230, columns 2297–2477.
- **Syntactic calls:** `clearTimeout`, `e.cancel`, `this.root.remove`, `this.style.remove`, `window.removeEventListener`.
- **Calls through `this`:** `root.remove`, `style.remove`.
