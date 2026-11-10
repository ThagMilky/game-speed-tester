# FUNCTION_MAP.md

Lookup is static. `char` is 0-based position in original file. Skill rows are definition-site locations, not proof of server skill outcomes.

## Shared pathways

| Feature | Symbols (char offsets) | Confidence |
|---|---|---|
| Main emitter and drawing | `Po` @788, `Po.update` @10229, `Po.draw` @12880, `Po.particle` @8860, `Po.sheet` @4624 | CONFIRMED |
| Camera/shake/stop | `Po.shake` @6304, `Po.stop` @5689, `Po.rate` @5936, `Po.knock` @5839, `Po.offset` @6058 | CONFIRMED |
| Registry and preload | `ue` @16525, `oo` @16555, `ba` @115477, `Ao` @130697, `Mt.preload` @195399, `Mt.ensure` @195539 | CONFIRMED |
| Active cast execution | `Mt.castRegistry` @203428, `Mt.update` @206262, `Mt.hit` @204262 | CONFIRMED |
| FX sprite pools | `wt.fx` @40425, `wt.fly` @41365, `wt.update` @42902, `vt.fx` @127530, `vt.fly` @128563, `vt.update` @130092 | CONFIRMED |
| Procedural and generated skills | `da` @108004, `wa` @112088, `sa` @94744, `aa` @95640, `na` @96431, `la` @97676, `ha` @98436, `ia` @99902, `pa` @100766, `fa` @103547, `xa` @104236, `ya` @104978, `ua` @105922 | CONFIRMED |
| Sound and event labels | `Mt.snd` @195076, `Mt.lay` @195222, `wt.snd` @39645, `vt.snd` @126921 | CONFIRMED |

## Explicit skill ID lookup

| Class | Skill ID | char |
|---|---|---:|
| `anh-sat` | `am-sat` | 43750 |
| `anh-sat` | `anh-bo` | 44384 |
| `anh-sat` | `kn-phong-hau` | 45030 |
| `anh-sat` | `doat-menh` | 45779 |
| `anh-sat` | `vo-anh` | 46597 |
| `anh-sat` | `an-than` | 47871 |
| `anh-sat` | `kn-huyet-anh` | 48194 |
| `anh-sat` | `kn-the-than` | 48833 |
| `anh-sat` | `kn-am-khi` | 49281 |
| `phu-su` | `hoa-phu` | 50477 |
| `phu-su` | `loi-phu` | 50976 |
| `phu-su` | `bang-phu` | 51539 |
| `phu-su` | `kn-pha-giap` | 52007 |
| `phu-su` | `van-phu` | 52801 |
| `phu-su` | `kich-phu` | 54183 |
| `phu-su` | `kn-ho-than` | 54875 |
| `phu-su` | `kn-than-hanh` | 55353 |
| `phu-su` | `kn-phu-luc` | 55795 |
| `phu-su` | `kn-dinh-than` | 56243 |
| `ngu-thu-su` | `linh-trao` | 57151 |
| `ngu-thu-su` | `hoan-thu` | 58016 |
| `ngu-thu-su` | `kn-lang-nha` | 58601 |
| `ngu-thu-su` | `bach-thu` | 59543 |
| `ngu-thu-su` | `thu-vuong` | 61078 |
| `ngu-thu-su` | `kn-ung-nhan` | 62433 |
| `ngu-thu-su` | `kn-ho-chu` | 62993 |
| `ngu-thu-su` | `thuan-thu` | 63522 |
| `ngu-thu-su` | `kn-thu-bo` | 64105 |
| `ngu-thu-su` | `kn-hung-ho` | 64644 |
| `ky-mon` | `kn-kim-cham` | 65583 |
| `ky-mon` | `hoi-xuan` | 66443 |
| `ky-mon` | `kn-tinh-hoa` | 66922 |
| `ky-mon` | `kn-cam-lo` | 67336 |
| `ky-mon` | `kn-thuy-lien` | 67809 |
| `ky-mon` | `doc-vu` | 68711 |
| `ky-mon` | `doc-tran` | 69323 |
| `ky-mon` | `van-doc` | 70222 |
| `ky-mon` | `linh-chu` | 71218 |
| `ky-mon` | `kn-dinh-huyet` | 71558 |
| `ky-mon` | `kn-thao-moc` | 72266 |
| `am-tong` | `am-ba` | 72808 |
| `am-tong` | `kn-dinh-hon` | 73336 |
| `am-tong` | `loan-am` | 73950 |
| `am-tong` | `kn-pha-am` | 74708 |
| `am-tong` | `tuyet-am` | 75461 |
| `am-tong` | `kn-chien-khuc` | 76398 |
| `am-tong` | `thanh-tam` | 76829 |
| `am-tong` | `cam-truong` | 77191 |
| `am-tong` | `kn-am-doan` | 77934 |
| `tran-phap-su` | `tran-nhan` | 78963 |
| `tran-phap-su` | `khoa-tran` | 79372 |
| `tran-phap-su` | `kn-pha-an` | 80214 |
| `tran-phap-su` | `sat-tran` | 80663 |
| `tran-phap-su` | `dai-tran` | 81638 |
| `tran-phap-su` | `tu-linh` | 82384 |
| `tran-phap-su` | `kn-me-tung` | 82930 |
| `tran-phap-su` | `kn-huyen-vu` | 83445 |
| `tran-phap-su` | `kn-di-tran` | 84279 |

## Additional ID-bearing literals

Other registry/skill ID occurrences are indexed as `registry_id_or_asset_id` in `ASSET_INDEX.json`, with exact positions.
