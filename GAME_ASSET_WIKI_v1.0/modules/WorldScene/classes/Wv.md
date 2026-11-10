# Class `Wv` — Sky/ground visual effect renderer

**Source range:** `Wv` [UTF-16 159050–164563, line 237].
**Role:** Renderer with plane, emperor and ground routines. **Confidence:** INFERRED semantic label, CONFIRMED class and method signatures.
**Extends:** `(none)`.
**Method count:** 8.

Methods and evidence (calls collected include nested callbacks):

### `Wv.constructor(e)`
- **CONFIRMED location:** UTF-16 `[ 159059, 159372 )`, UTF-8 bytes `[ 161364, 161677 )`, physical line 237, columns 15443–15756.
- **Syntactic calls:** `M`, `_v`, `e.add.graphics`, `e.add.graphics().setDepth`, `e.add.image`, `e.add.image().setVisible`, `this.sprites.push`.
- **Calls through `this`:** `sprites.push`.
- **Numeric comparisons:** `t<100`.

### `Wv.sprite(e, t, i, n=i, s=1, o=35, l=0)`
- **CONFIRMED location:** UTF-16 `[ 159372, 159641 )`, UTF-8 bytes `[ 161677, 161946 )`, physical line 237, columns 15756–16025.
- **Syntactic calls:** `ee`, `this.sprites[UpdateExpression].setTexture`, `this.sprites[UpdateExpression].setTexture().setPosition`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth().setVisible`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth().setVisible().clearTint`, `ts`.
- **Calls through `this`:** `sprites[UpdateExpression].setTexture`, `sprites[UpdateExpression].setTexture().setPosition`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth().setVisible`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setAlpha().setRotation().setDepth().setVisible().clearTint`.
- **Imported alias name matches (potential):** `ee`.
- **Numeric comparisons:** `s<=.005`; `i<=0`; `n<=0`.

### `Wv.plane(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 159641, 160112 )`, UTF-8 bytes `[ 161946, 162417 )`, physical line 237, columns 16025–16496.
- **Syntactic calls:** `Cf.find`, `Dh`, `ee`, `this.rig.push`, `this.sprites[UpdateExpression].setTexture`, `this.sprites[UpdateExpression].setTexture().setPosition`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth().setVisible`, `this.sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth().setVisible().clearTint`, `ts`.
- **Calls through `this`:** `rig.push`, `sprites[UpdateExpression].setTexture`, `sprites[UpdateExpression].setTexture().setPosition`, `sprites[UpdateExpression].setTexture().setPosition().setScale`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth().setVisible`, `sprites[UpdateExpression].setTexture().setPosition().setScale().setFlipX().setAlpha().setRotation().setDepth().setVisible().clearTint`.
- **Imported alias name matches (potential):** `ee`.

### `Wv.emperor(e, t, i)`
- **CONFIRMED location:** UTF-16 `[ 160112, 160551 )`, UTF-8 bytes `[ 162417, 162856 )`, physical line 237, columns 16496–16935.
- **Syntactic calls:** `Dh`, `ee`, `this.rig.push`, `this.sprites[UpdateExpression].setTexture`, `this.sprites[UpdateExpression].setTexture().setPosition`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth().setVisible`, `this.sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth().setVisible().clearTint`, `ts`.
- **Calls through `this`:** `rig.push`, `sprites[UpdateExpression].setTexture`, `sprites[UpdateExpression].setTexture().setPosition`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth().setVisible`, `sprites[UpdateExpression].setTexture().setPosition().setDisplaySize().setFlipX().setRotation().setAlpha().setDepth().setVisible().clearTint`.
- **Imported alias name matches (potential):** `ee`.
- **Numeric comparisons:** `t>=5`; `t<=7`; `t===6`; `t===7`; `t===7`.

### `Wv.ground(e, t, i, n=1)`
- **CONFIRMED location:** UTF-16 `[ 160551, 160602 )`, UTF-8 bytes `[ 162856, 162907 )`, physical line 237, columns 16935–16986.
- **Syntactic calls:** `this.sprite`.
- **Calls through `this`:** `sprite`.
- **Imported alias name matches (potential):** `Tn`.

### `Wv.render(e, t, i, n)`
- **CONFIRMED location:** UTF-16 `[ 160602, 164231 )`, UTF-8 bytes `[ 162907, 166536 )`, physical line 237, columns 16986–20615.
- **Syntactic calls:** `ArrayExpression.includes`, `ConditionalExpression.forEach`, `Dh`, `Hh`, `Math.atan2`, `Math.cos`, `Math.hypot`, `Math.max`, `Math.min`, `Math.sin`, `Ph`, `Ts`, `bf`, `e.heroAt`, `ee`, `this.emperor`, `this.ground`, `this.particles.clear`, `this.particles.fillRect`, `this.particles.fillStyle`, `this.plane`, `this.sprite`, `this.sprites[h].setVisible`, `ts`.
- **Calls through `this`:** `emperor`, `ground`, `particles.clear`, `particles.fillRect`, `particles.fillStyle`, `plane`, `sprite`, `sprites[h].setVisible`.
- **Imported alias name matches (potential):** `Ph`, `Tn`, `Ts`, `bf`, `ee`.
- **Numeric comparisons:** `e.hp>0`; `e.shield>0`; `e.echoCharges>0`; `c<0`; `c<2.6`; `c<2.6`; `w<0`; `w>1`; `c<.6`; `k<4`; `c<.65`; `h.amount>0` … (+4).

### `Wv.destroy()`
- **CONFIRMED location:** UTF-16 `[ 164231, 164306 )`, UTF-8 bytes `[ 166536, 166611 )`, physical line 237, columns 20615–20690.
- **Syntactic calls:** `e.destroy`, `this.particles.destroy`.
- **Calls through `this`:** `particles.destroy`.

### `Wv.inspect()`
- **CONFIRMED location:** UTF-16 `[ 164306, 164562 )`, UTF-8 bytes `[ 166611, 166867 )`, physical line 237, columns 20690–20946.
- **Syntactic calls:** `Number`, `this.sprites.slice`, `this.sprites.slice().filter`, `this.sprites.slice().filter().map`.
- **Calls through `this`:** `sprites.slice`, `sprites.slice().filter`, `sprites.slice().filter().map`.
- **Numeric comparisons:** `Number(e.frame.name)===0`.
