# Audio, terrain hooks, network and authority

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: Audio hooks call imported `xo.play` for spatial sounds. `Jt.init`, `Jt.want`, `Jt.lay`, and `Jt.crit` are external functions imported from Character asset. Player ownership `mine` adjusts local gain and screen emphasis.

**CONFIRMED**: `env.impact`, `env.terrain.spike`, `.burst`, `.crater` or related terrain actions are optional render-environment hooks in multiple skill callbacks. These callouts are not evidence of persistent map deformation.

**CONFIRMED**: Search of complete supplied source for direct `fetch(`, `WebSocket`, `XMLHttpRequest`, `send(` found: see `ANALYSIS_PROGRESS.json` counts. No direct transport initialization identified in top-level import list.

**UNKNOWN**: Network transport, server collision/damage validation, heal/shield authority, RNG for combat, status effects, real cooldown and live frame cadence. `host` and kit data are injected by caller.
