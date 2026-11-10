# Key formulas and conditions (static source facts)

- `fa` [502, 692): when query is below first knot choose first value; otherwise interpolate with `i=(e-n[a-1])/(n[a]-n[a-1])` and `t[a-1]*(1-i)+t[a]*i`; above range choose last.
- `fn` [1266, 1331): clamp level to [1,999] and floor finite values.
- `Ln` [1580, 1630): `Math.round(20+6*(fn(n)-1)+.025*(fn(n)-1)**2)`.
- `wt` [2617, 2646): `Math.round(Ln(n)*Ta(n))`; `Ta` uses iterative precomputed `ch=sh()`.
- `Ma` [7050, 7509): choose up to `kh(rarity,isWeapon)` unique stat keys; use rarity-conditioned rank weight array and `Th(key,rank)`. No independent assertion of distribution at server.
- `Th` [7515, 7557): `Math.round((Ha[n]??0)*t*1e4)/1e4`.
- `au` [8331, 8786): upgrade level `o=n+1`; base chance array `[0,100,100,95,90,80,70,60,50,40,30,20,16,12,9,7,5]`; luck capped 30; material potency `a*4**(e-1)`; returned chance clipped to 100.
- `Fh` [88356, 89488): deduplicates input IDs, adds Kim Vân per-piece passives, counts valid set pieces using `Rh`, uses explicit bonus3/bonus5 for expanded sets, otherwise generic 3-piece bonus *2.5 at 5 pieces.
- `be` [87939, 88343): base set-piece stats scaled by rarity using `{[-1]:.55,0:1,1:1.8,2:3.2,3:5.2,4:8,5:10,6:12}`; Kim Vân adds 1.1 multiplier.
- `Ia` [103427, 103781): allocation budget `5*clamp(level,1,999)`, rejects invalid/overspent and deprecated keys.
- `xu` [108046, 108200): returns 0 for nonpositive/nonfinite values; otherwise `a*Math.log1p(n*.08*e/a)` with `a=t*.25`.
- `Ks` [109167, 109438): 8-second control window, after two controls grants 5-second immunity; second control duration factor 0.5.
- `Mu` [109444, 109561): PvP outgoing damage bonus capped at 0.2, resistance capped at 0.4; multiplicative `(1+bonus)*(1-resistance)`.
- `Ss` [113337, 113770): timed effect must have finite positive duration; stack bounded by `A[type].max`; refreshing uses max value and max expiration.
- `Bu` [112843, 113164): sliding 3-second damage budget with two thresholds and reduced over-budget weights; retains at most 64 entries.
- `Aa` [106668, 106796): weighted draw using `ys[source]` and caller-provided RNG; selects bucket index.
- `Dr` [223297, 233303): checks actor room and inventory access before processing; includes resource-count validation and deductions via `count` and `give`. Detailed event/action branches should be read at the exact source span.

**UNKNOWN:** Server confirmation, persistence semantics, and any security assertions.
