# Generated skill visual templates

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: `rt` is a class-oriented palette of default projectile, impact, field, seal, shield, hit and critical visual assets. `oa` overrides selected IDs for special or combined skill effects. `qt` contains specialized summoned-creature animation callbacks. The generated registry uses templates and class/skill ID lists; `da`, `wa` construct entries and `ba([...])` registers them.

**CONFIRMED**: Template functions and entry points (char offsets):

- `Me`: `90693`
- `Pt`: `90736`
- `qo`: `90831`
- `bo`: `91162`
- `Et`: `91377`
- `Wt`: `91484`
- `qe`: `91968`
- `eo`: `92212`
- `it`: `92322`
- `so`: `92436`
- `sa`: `94744`
- `aa`: `95640`
- `na`: `96431`
- `la`: `97676`
- `ha`: `98436`
- `ia`: `99902`
- `pa`: `100766`
- `ra`: `102402`
- `co`: `102600`
- `jo`: `102913`
- `fa`: `103547`
- `xa`: `104236`
- `ya`: `104978`
- `ua`: `105922`
- `da`: `108004`
- `wa`: `112088`
- `Y`: `115053`
- `ko`: `115148`
- `qa`: `115343`
- `ba`: `115477`
- `Ao`: `130697`

**CONFIRMED**: Many generated effects respond to `kit.shape`, `kit.range`, `kit.angle`, `kit.duration`, `kit.effects`, `hits`, `contact` and `interval`. `Y(cast,effect,fallback)` searches `kit.effects` and returns `.dur` or fallback; consequently displayed shield/root durations can be derived from supplied kit fields but are not proof of actual effect lifetime.

**CONFIRMED**: `E(t,e)` computes deterministic-looking `fract(sin(t*12.9898+e*78.233)*43758.5453)` to spread impacts, not cryptographic randomness. `qo`/`bo` select closest sprite preset by pixel radius, not necessarily true combat radius. `ot` increases scale of some small projectile visuals, capped at 3.

**INFERRED**: Generic templates unify effects for multiple skill tiers/forms. Exact semantics require external skill definition modules.
