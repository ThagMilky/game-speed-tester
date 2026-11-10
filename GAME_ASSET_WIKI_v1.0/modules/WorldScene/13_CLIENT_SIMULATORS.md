# Local showcase/simulation engines — do not mistake for game-server rules

## Poison/Gu simulator `ik` — CONFIRMED source-only

`ik` [UTF-16 196852–206341, line 237]; `ik.input` [UTF-16 198780–199018, line 237]; `ik.cast` [UTF-16 199048–199525, line 237]; `ik.damage` [UTF-16 199525–199711, line 237]; `ik.resolve` [UTF-16 200162–204042, line 237]; `ik.advanceTo` [UTF-16 204042–206092, line 237]; `ik.snapshot` [UTF-16 206092–206340, line 237].

`ik` owns synthetic state: `heroHp=650`, `hosts`, `shield`, `events`, `commands`, `cooldowns`, `pending`, `time`; has `presentationOnly` flag. `input` submits local commands after `reason` gates, `cast` creates pending impacts after imported `Zv(skill).contact`. `resolve` implements local event kinds `bite`, `web`, `guard`, `incoming`, `plague`, `swarm`, `swarm-hit`, `seed`, `feed`, `spread`, `burst`, `harvest`, `summon`, `sting`, `king-burst`; `advanceTo` time-steps model and `snapshot` clones current state.

Illustrative fixed formulas inside `ik.resolve`: bite damage `75 + 18*stacks` with heal `25%` of dealt amount; web damage `50` and root `2.4s`; guard shield `300` for `4s`; plague hit `65 + 32*stacks`; burst `90 + 75*stack` per eligible host and `10*stack` healing; feed pool runs `4s` with `dps:10`. Marking/stack limits refer to imported `di`, `sn`, `Af` and other constants; full mechanics require sources. **These numbers are embedded in a local simulation, not evidence of server combat.**

## Blood/Demon simulator `ok` — CONFIRMED source-only

`ok` [UTF-16 222485–231182, line 237]; `ok.input` [UTF-16 224620–224841, line 237]; `ok.cast` [UTF-16 224841–225465, line 237]; `ok.resolve` [UTF-16 228525–230073, line 237]; `ok.advanceTo` [UTF-16 230073–230835, line 237]; `ok.snapshot` [UTF-16 230835–231181, line 237].

`ok` starts `hp=780`, `qi=20`; tracks synthetic foes, pending hits, shield, cooldowns, actions and `presentationOnly`. `cast` deducts local HP cost and schedules impact. `resolve` uses scene geometry and test-specific formula: power multiplier `(1 + qi*.007) * (1 + min(.2,(1-hp/Hi.maxHp)/3))` and skill base damage selected from constants (e.g., `145`, `225`, `180 + 1.7*qi`, `300 + 3*qi`), plus conditional healing and qi-overload handling. Imported `Hi`, `ua` and `El` determine external parameters. **These values belong to the standalone simulation shown in the file.**

## Related cinematic renderers

`zu`, `sk`, and `rk` draw VFX for skills and learned/showcase sequences. Their `render`/`inspect` methods are evidence of local presentation, not remotely synchronized combat. `Bu`, `Bh`, `Wv` are additional visual systems. Cross-module visual skill resources remain unresolved until their asset data is merged.
