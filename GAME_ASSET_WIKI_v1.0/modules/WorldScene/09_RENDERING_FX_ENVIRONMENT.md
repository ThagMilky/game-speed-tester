# Rendering, effects, animation and environment

## Rendering subsystems — CONFIRMED

Key classes: `Mv` [UTF-16 97880–118505, line 221]; `Tv` [UTF-16 118570–124860, line 221]; `Sv` [UTF-16 124936–128377, line 221]; `Ou` [UTF-16 255883–259187, line 237]; `Fu` [UTF-16 259808–263434, line 237]; `xk` [UTF-16 266489–269056, line 237]; `x$` [UTF-16 722984–725148, line 965]; `b$` [UTF-16 725148–726294, line 965]; `k$` [UTF-16 727212–732863, line 965]; `xm` [UTF-16 733030–734710, line 965]; `vc` [UTF-16 735647–740397, line 965]; `z4` [UTF-16 660354–672631, line 866]; `Su` [UTF-16 92634–93594, line 221].

`Tv` loads `data/fx/fx.json` and atlas textures, adds custom pivots/frame subrectangles, pools effects by scene, schedules/defers playback, and processes sprite frame advancement via a Phaser UPDATE event. It limits live effects (`maxLive=96`), pending FX (`pending.length<64`), drops late one-shots beyond `.75s` in `flush`, fades out animations during their final `.35s` (`Cv`) and destroys pool actors when scene shuts down.

`Mv` constructs an FX atlas from `fx-buff/atlas.json` and optional status manifests. It samples pixel opacity from character frames (`yv`) to derive body silhouette, emitting copies and particles. Per-scene cap depends on `Vr()` mobile/device flag: `capParts=90/180`, `capCopies=120/240`, `capPieces=120/240`. Frame `layout` clamps `dt<=.05`, pre-render updates and scene shutdown cleanup. Its `parse` reads status flag codes; `hit` samples shield/reflect edge points, and updates visual effects. These are **visual effects** not actual buff application.

`Sv` draws tribulation pre-windup, lightning, meditation and breakthrough. `Ou` and `Fu` represent surface/environment effects and terrain impacts, using imported FX definitions/materials; `k$` manages weather/rain; `x$` and `b$` render background emitters. `vc` implements persistent auras, and `xm` manages selected effect sprites. `Nf` extends Phaser Image with custom WebGL rendering.

## Scene ground layers and performance — CONFIRMED

`A3.bakeTiles` [UTF-16 870901–871725, line 1143]; `A3.placeSprites` [UTF-16 871725–874177, line 1143]; `A3.packSprites` [UTF-16 874177–876127, line 1143]; `A3.streamGround` [UTF-16 878067–879112, line 1143]; `A3.cull` [UTF-16 876378–876866, line 1143]; `A3.updateShade` [UTF-16 1001337–1002553, line 1143]; `A3.updateViews` [UTF-16 904697–908671, line 1143].

Scene uses additive/normal/multiply blends, depth ordering based on world y (e.g. `1000 - round(worldY*10)`), frame packing, tile streaming, camera culling, lighting, occluder fading, mounts and aura prioritization. `A3.update` passes frame-scaled `dt` to most child renderers and adjusts sound listener position via `Yt.setListener`.

## Character and equipment dependencies — UNKNOWN

Character render rig `ha` / `yu`, audio `Yt`, sprite frames, animated atlas manifests, environment materials, mount assets, `Q` tile scale and map definitions are imported or loaded externally. Full resource definitions and runtime GPU support cannot be established in this asset alone.
