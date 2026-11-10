# Class `ew` — HUD controls

**Source range:** `ew` [UTF-16 399370–417077, line 524].
**Role:** Skill slots, health/mana/cooldowns, party, status, toast/banner, death UI. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 24.

Methods and evidence (calls collected include nested callbacks):

### `ew.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 399379, 403170 )`, UTF-8 bytes `[ 406221, 410050 )`, physical line 524, columns 155–3946.
- **Syntactic calls:** `$`, `Kl`, `M`, `String`, `c.append`, `c.appendChild`, `c.insertBefore`, `document.body.appendChild`, `document.body.classList.add`, `document.head.appendChild`, `h.append`, `i.addEventListener`, `i.blur`, `i.getAttribute`, `i.setAttribute`, `localStorage.getItem`, `localStorage.setItem`, `n`, `o.append`, `r.call`, `r.stopPropagation`, `r.toUpperCase`, `this.card.append`, `this.card.appendChild`, `this.death.append`, `this.left.appendChild`, `this.left.classList.contains`, `this.left.classList.toggle`, `this.setSlots`, `this.stats.append` … (+1 additional; see ASSET_INDEX.json).
- **Calls through `this`:** `card.append`, `card.appendChild`, `death.append`, `left.appendChild`, `left.classList.contains`, `left.classList.toggle`, `setSlots`, `stats.append`, `stats.appendChild`.
- **Imported alias name matches (potential):** `$`, `Kl`, `q0`.

### `ew.dock(e)`
- **CONFIRMED location:** UTF-16 `[ 403170, 403217 )`, UTF-8 bytes `[ 410050, 410097 )`, physical line 524, columns 3946–3993.
- **Syntactic calls:** `this.left.insertBefore`.
- **Calls through `this`:** `left.insertBefore`.

### `ew.portrait(e)`
- **CONFIRMED location:** UTF-16 `[ 403217, 403323 )`, UTF-8 bytes `[ 410097, 410203 )`, physical line 524, columns 3993–4099.
- **Syntactic calls:** `$`, `this.portraitEl.appendChild`.
- **Calls through `this`:** `portraitEl.appendChild`.
- **Imported alias name matches (potential):** `$`.

### `ew.setSlots(e)`
- **CONFIRMED location:** UTF-16 `[ 403323, 405297 )`, UTF-8 bytes `[ 410203, 412229 )`, physical line 524, columns 4099–6073.
- **Syntactic calls:** `$`, `/^Sát thương/.test`, `/^[1-6]$/.test`, `Math.round`, `Me`, `String`, `String().replace`, `Wi`, `c.call`, `cn`, `d.call`, `h.call`, `lg`, `n.addEventListener`, `n.append`, `n.appendChild`, `n.classList.add`, `n.setPointerCapture`, `r.append`, `r.appendChild`, `r.classList.add`, `r.preventDefault`, `this.bar.appendChild`, `this.slots.push`.
- **Calls through `this`:** `bar.appendChild`, `slots.push`.
- **Imported alias name matches (potential):** `$`, `Me`, `Wi`, `cn`.
- **Numeric comparisons:** `t.unlock===999`; `t.cooldown>0`; `t.unlock>1`; `t.unlock===999`.

### `ew.replaceSlot(e, t)`
- **CONFIRMED location:** UTF-16 `[ 405297, 405641 )`, UTF-8 bytes `[ 412229, 412575 )`, physical line 524, columns 6073–6417.
- **Syntactic calls:** `$`, `Object.assign`, `i.el.prepend`, `i.el.querySelector`, `lg`, `n.remove`, `this.slots.find`.
- **Calls through `this`:** `slots.find`.
- **Imported alias name matches (potential):** `$`.
- **Numeric comparisons:** `t.unlock===999`.

### `ew.slotElements()`
- **CONFIRMED location:** UTF-16 `[ 405641, 405706 )`, UTF-8 bytes `[ 412575, 412640 )`, physical line 524, columns 6417–6482.
- **Syntactic calls:** `this.slots.map`.
- **Calls through `this`:** `slots.map`.

### `ew.aiming(e)`
- **CONFIRMED location:** UTF-16 `[ 405706, 405786 )`, UTF-8 bytes `[ 412640, 412720 )`, physical line 524, columns 6482–6562.
- **Syntactic calls:** `t.el.classList.toggle`.

### `ew.pills(e, t)`
- **CONFIRMED location:** UTF-16 `[ 405786, 407060 )`, UTF-8 bytes `[ 412720, 414024 )`, physical line 524, columns 6562–7836.
- **Syntactic calls:** `$`, `Bt`, `Me`, `String`, `c.append`, `c.preventDefault`, `cn`, `d.call`, `document.body.classList.contains`, `l.addEventListener`, `l.append`, `l.appendChild`, `l.setAttribute`, `this.pillsEl.appendChild`, `window.clearTimeout`, `window.setTimeout`, `xs`.
- **Calls through `this`:** `pillsEl.appendChild`.
- **Imported alias name matches (potential):** `$`, `Bt`, `Me`, `cn`, `xs`.
- **Numeric comparisons:** `c.button!==2`; `c.button===2`.

### `ew.gauge(e)`
- **CONFIRMED location:** UTF-16 `[ 407060, 407496 )`, UTF-8 bytes `[ 414024, 414460 )`, physical line 524, columns 7836–8272.
- **Syntactic calls:** `Array.from`, `Array.from().join`, `Math.round`, `n.replace`, `t`.
- **Numeric comparisons:** `e.max<=10`.

### `ew.party(e)`
- **CONFIRMED location:** UTF-16 `[ 407496, 408122 )`, UTF-8 bytes `[ 414460, 415096 )`, physical line 524, columns 8272–8898.
- **Syntactic calls:** `$`, `B0`, `JSON.stringify`, `Math.max`, `Math.min`, `n.append`, `n.style.setProperty`, `o.appendChild`, `s.append`, `se`, `this.partyEl.appendChild`.
- **Calls through `this`:** `partyEl.appendChild`.
- **Imported alias name matches (potential):** `$`, `B0`, `se`.

### `ew.invite(e)`
- **CONFIRMED location:** UTF-16 `[ 408122, 408589 )`, UTF-8 bytes `[ 415096, 415583 )`, physical line 524, columns 8898–9365.
- **Syntactic calls:** `$`, `s.call`, `t.append`, `this.inviteEl.append`.
- **Calls through `this`:** `inviteEl.append`.
- **Imported alias name matches (potential):** `$`.

### `ew.boss(e)`
- **CONFIRMED location:** UTF-16 `[ 408589, 409513 )`, UTF-8 bytes `[ 415583, 416517 )`, physical line 524, columns 9365–10289.
- **Syntactic calls:** `$`, `Math.ceil`, `Math.max`, `Math.min`, `Re`, `document.body.appendChild`, `e.tint.slice`, `hg`, `i`, `this.bossEl.querySelector`, `this.bossEl.setAttribute`.
- **Calls through `this`:** `bossEl.querySelector`, `bossEl.setAttribute`.
- **Imported alias name matches (potential):** `$`, `Re`.

### `ew.effects(e, t)`
- **CONFIRMED location:** UTF-16 `[ 409513, 410402 )`, UTF-8 bytes `[ 416517, 417422 )`, physical line 524, columns 10289–11178.
- **Syntactic calls:** `$`, `Array.from`, `Math.ceil`, `Nm.indexOf`, `Number`, `String`, `cn`, `i.map`, `i.map().join`, `l.appendChild`, `l.setAttribute`, `o.toFixed`, `o.toFixed().replace`, `r.appendChild`, `s.querySelector`, `this.effectsEl.appendChild`, `vf`, `vf().filter`.
- **Calls through `this`:** `effectsEl.appendChild`.
- **Imported alias name matches (potential):** `$`, `Nm`, `cl`, `cn`.
- **Numeric comparisons:** `s.n>1`; `s.n>1`; `o>=10`; `o>0`.

### `ew.statuses(e)`
- **CONFIRMED location:** UTF-16 `[ 410402, 411354 )`, UTF-8 bytes `[ 417422, 418546 )`, physical line 524, columns 11178–12130.
- **Syntactic calls:** `$`, `/Choáng|trói|Chậm|độc|Bỏng|Chảy máu|Trọng thương|Suy yếu|Lộ sơ hở|Bình cảnh|PK mở/.test`, `/Hộ thể|Khiên|Kiếm hộ|Tăng công|Phòng boss an toàn|Vùng an toàn/.test`, `/Tự động|Tự luyện|Bế quan|Ngự kiếm|Ẩn/.test`, `/^(Phá thế|Hỏa tâm|Sinh tức|Triều tức|Hậu thổ)/.test`, `/Đang độ kiếp/.test`, `e.join`, `o.setAttribute`, `this.statusEl.appendChild`.
- **Calls through `this`:** `statusEl.appendChild`.
- **Imported alias name matches (potential):** `$`.

### `ew.status(e, t, i, n, s, o, l, r, h, c=0)`
- **CONFIRMED location:** UTF-16 `[ 411354, 413373 )`, UTF-8 bytes `[ 418546, 420590 )`, physical line 524, columns 12130–14149.
- **Syntactic calls:** `$`, `BinaryExpression.toFixed`, `C.toFixed`, `Es`, `Hm`, `Math.ceil`, `Math.floor`, `Math.max`, `Math.min`, `Math.round`, `N.toFixed`, `String`, `k.setAttribute`, `p`, `performance.now`, `se`, `this.card.classList.toggle`, `this.lvEl.append`.
- **Calls through `this`:** `card.classList.toggle`, `lvEl.append`.
- **Imported alias name matches (potential):** `$`, `Hm`, `se`.
- **Numeric comparisons:** `i>=999`; `C.tier<10`; `c>0`; `s>0`; `s>0`; `i>=999`; `h>0`; `i>=999`; `s>0`; `this.hpRatio<0`; `g>0`; `g<.3` … (+1).

### `ew.wallet(e, t)`
- **CONFIRMED location:** UTF-16 `[ 413373, 413657 )`, UTF-8 bytes `[ 420590, 420880 )`, physical line 524, columns 14149–14433.
- **Syntactic calls:** `$`, `Es`, `gn`, `n.append`, `s.append`, `this.walletEl.appendChild`.
- **Calls through `this`:** `walletEl.appendChild`.
- **Imported alias name matches (potential):** `$`, `gn`.

### `ew.cooldowns(e, t, i=99, n, s="Linh lực", o=0)`
- **CONFIRMED location:** UTF-16 `[ 413657, 414876 )`, UTF-8 bytes `[ 420880, 422104 )`, physical line 524, columns 14433–15652.
- **Syntactic calls:** `Math.ceil`, `Math.max`, `Math.min`, `Math.round`, `String`, `h.classList.toggle`, `m.toFixed`, `performance.now`.
- **Numeric comparisons:** `c.mana>0`; `m>0`; `o<=0`; `g<=0`; `r.step<0`; `g<=0`; `f>0`; `r.step>=0`; `v<0`; `v>=0`; `v>=0`; `m<=0` … (+1).

### `ew.dead(e)`
- **CONFIRMED location:** UTF-16 `[ 414876, 415168 )`, UTF-8 bytes `[ 422104, 422408 )`, physical line 524, columns 15652–15944.
- **Syntactic calls:** `Math.ceil`, `String`.
- **Numeric comparisons:** `e>0`; `e>0`.

### `ew.toast(e)`
- **CONFIRMED location:** UTF-16 `[ 415168, 415351 )`, UTF-8 bytes `[ 422408, 422591 )`, physical line 524, columns 15944–16127.
- **Syntactic calls:** `clearTimeout`, `ta`, `this.toastEl.classList.add`, `this.toastEl.classList.remove`, `window.setTimeout`.
- **Calls through `this`:** `toastEl.classList.add`, `toastEl.classList.remove`.
- **Imported alias name matches (potential):** `ta`.

### `ew.banner(e, t="")`
- **CONFIRMED location:** UTF-16 `[ 415351, 415557 )`, UTF-8 bytes `[ 422591, 422797 )`, physical line 524, columns 16127–16333.
- **Syntactic calls:** `$`, `this.bannerEl.append`, `this.bannerEl.classList.add`, `this.bannerEl.classList.remove`.
- **Calls through `this`:** `bannerEl.append`, `bannerEl.classList.add`, `bannerEl.classList.remove`.
- **Imported alias name matches (potential):** `$`.

### `ew.note(e)`
- **CONFIRMED location:** UTF-16 `[ 415557, 416029 )`, UTF-8 bytes `[ 422797, 423272 )`, physical line 524, columns 16333–16805.
- **Syntactic calls:** `$`, `/ · /.test`, `/^(\d+) (.+)$/.exec`, `/^Nhặt: (.+)$/.exec`, `/^\+(\d+) (.+)$/.exec`, `/^\{(#[0-9a-fA-F]{6})\}(.+)$/.exec`, `Number`, `n.appendChild`, `performance.now`, `t[1].split`, `this.gain`, `this.push`, `xs`.
- **Calls through `this`:** `gain`, `push`.
- **Imported alias name matches (potential):** `$`, `xs`.

### `ew.gain(e, t, i=!1, n="")`
- **CONFIRMED location:** UTF-16 `[ 416029, 416621 )`, UTF-8 bytes `[ 423272, 423874 )`, physical line 524, columns 16805–17397.
- **Syntactic calls:** `$`, `Bt`, `Math.max`, `Math.min`, `l.appendChild`, `o.el.classList.add`, `o.el.classList.remove`, `performance.now`, `ta`, `this.lines.find`, `this.push`, `xs`.
- **Calls through `this`:** `lines.find`, `push`.
- **Imported alias name matches (potential):** `$`, `Bt`, `ta`, `xs`.
- **Numeric comparisons:** `o.count<2`.

### `ew.push(e)`
- **CONFIRMED location:** UTF-16 `[ 416621, 416744 )`, UTF-8 bytes `[ 423874, 423997 )`, physical line 524, columns 17397–17520.
- **Syntactic calls:** `this.lines.push`, `this.lines.shift`, `this.lines.shift().el.remove`, `this.log.appendChild`, `this.sweep`.
- **Calls through `this`:** `lines.push`, `lines.shift`, `lines.shift().el.remove`, `log.appendChild`, `sweep`.
- **Numeric comparisons:** `this.lines.length>6`.

### `ew.sweep()`
- **CONFIRMED location:** UTF-16 `[ 416744, 417076 )`, UTF-8 bytes `[ 423997, 424329 )`, physical line 524, columns 17520–17852.
- **Syntactic calls:** `clearTimeout`, `i.remove`, `performance.now`, `setTimeout`, `t.el.classList.add`, `t.el.classList.contains`, `this.lines.filter`, `this.sweep`, `window.setTimeout`.
- **Calls through `this`:** `lines.filter`, `sweep`.
