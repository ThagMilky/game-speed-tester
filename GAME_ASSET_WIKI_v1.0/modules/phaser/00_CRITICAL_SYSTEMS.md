# Critical execution paths and static behavior

All findings below are based on reading local bundled code (`CONFIRMED`), not running it. Module coordinates and named symbols are in `ASSET_INDEX.json`.

## Game boot and scene frame loop

- `50127` / `Game.initialize`: constructs `config`, `renderer`, `events`, `anims`, `textures`, `cache`, `registry`, `input`, `scene`, `scale`, `sound`, `loop`, `plugins` and schedules `boot` via DOM readiness helper `57264`.
- `50127` / `boot`: runs `preBoot`, `scale.preBoot`, renderer creation `86054`, DOM container setup, attaches the textures ready listener, emits BOOT. `texturesReady` emits READY then starts.
- `50127` / `step(F,w)`: emits PRE_STEP → STEP → `scene.update(F,w)` → POST_STEP → `renderer.preRender()` → PRE_RENDER → `scene.render(renderer)` → `renderer.postRender()` → POST_RENDER.
- `50127` / `headlessStep`: emits same high-level tick events but no renderer; no screen drawing. `destroy` marks `pendingDestroy`; cleanup happens through `runDestroy`.
- `65898` / `TimeStep`: default target 60 FPS; minimum FPS setting 5, history window 10, panic cooldown 120, smoothing enabled. `stepLimitFPS` accumulates delta; `smoothDelta` limits large frame gaps. Frame logic depends on configuration, browser timing and visibility.

## Animation state machine

- `60848` holds global animations, `42099` stores frames and frame links, `9674` stores per-parent playback state.
- `42099.calculateDuration`: default 24 FPS; duration computed as `24 / frameCount * 1000` when no rate/duration supplied (as written), or `frameCount / frameRate * 1000` for supplied frame rate. `msPerFrame = 1000 / frameRate`.
- `9674.play`, `playReverse`, `startAnimation`, `update`, `pause`, `resume`, `stop`, `complete`, `restart` alter `isPlaying`, `hasStarted`, `repeatCounter`, `forward`, `inReverse` and pending stop fields.
- `9674.update`: elapsed animation time accumulates `delta * timeScale * globalTimeScale`; when skipping missed frames it advances at most 60 additional iterations in one update. It emits start, update, repeat, stop and completion events through `emitEvents`.
- Client animation frames and timings are visual state, **not proof of authoritative combat timing or game server state**.

## Camera transforms and culling

- `71911` / `BaseCamera`: scrolling, zoom, rotation, world coordinates, camera masks and bounding/culling. `getWorldPoint` inverts the 2D affine camera matrix; singular determinant returns input point. `setZoom` substitutes `0.001` for zero zoom in its explicit setter.
- `38058` / `Camera`: `startFollow`, `preRender`, `update`, `setDeadzone`, follow-offset and lerp; effects include fade, flash, shake, pan, rotate and zoom.
- `32743` / `CameraManager`: multiple camera list, 32 candidate bit-mask IDs, viewport filtering, per-frame render.
- `63091` fixed and `58818` smoothed keyboard camera controls: defaults include zoom speed `0.01`, zoom range `0.001` to `1000`; control classes modify camera scroll/zoom, **not character movement**.

## Geometry, masks and rendering

- `80021.Curve` samples points and approximates arc-length using 100 divisions by default; tangent uses a finite difference epsilon of `0.0001`. `46669.Path` composes curves.
- `80661.GeometryMask` uses WebGL stencil increments/decrements and Canvas clip operations; `6858.BitmapMask` delegates to bitmap mask pipeline for WebGL.
- `86054.CreateRenderer` chooses WebGL or Canvas according to feature checks and config, with explicit failures when requested context unavailable.
- `89422.ColorMatrix` applies 4×5 color transforms and preset filters.

## Events and state

- `50792` is an EventEmitter implementation implementing `on`, `once`, `emit`, `removeListener`, `removeAllListeners`; event callbacks are local, not network RPC by themselves.
- `45893.DataManager` stores `list` and `values`, emits `setdata`, `changedata`, per-key `changedata-...` and `removedata`; frozen data disables mutation.
- `2161.BaseCache` is key-value cache with add/remove events, not proof of persistence across browser sessions.

## Network and authority

- Generic framework asset may contain loading via XHR, DOM/network-capable browser APIs, audio/video sources, but it does not establish application-specific endpoints or authoritative server calculations. Search the other game assets for concrete client request creators and handlers; never equate client prediction or frame-rate calculations with server truth.
