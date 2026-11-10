# Overview and evidence boundaries

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: Full original file processed: 206820 bytes, 206820 characters, SHA-256 `25f88bcc7f67f5ce1dab6426b995c3f7b1a82196690c62fde656fe9216407c4f`; 1701 indexed records and 596 sprite metadata entries. The original file is copied verbatim under `source/`.

**CONFIRMED**: Phaser-based client-side visual/audio skill presentation. Top-level imports: Phaser (`ht`), preferences (`ae`, `ne`, `Te`) and character audio/critical feedback (`xo`, `Jt`). Registry `Vt`, effect definitions `_e`, skill-to-class lookup `io`, and public runtime `ye` exported under aliases.

**CONFIRMED**: Six class keys in `rt`: `anh-sat`, `phu-su`, `ngu-thu-su`, `ky-mon`, `am-tong`, `tran-phap-su`. Additional specialized class FX modules occur later in source, including `kiem-tien`, `co-su`, `ma-tong`, `the-tu`.

**INFERRED**: This file orchestrates visual/sound feedback around skill casts and hit events rather than calculating authoritative damage, damage mitigation or networking. No direct server protocol was established in this asset.

**UNKNOWN**: Exact definitions of class gameplay data, synchronization of timestamps, server authority, and integration contract for `host` are external.
