# Bộ xử lý lệnh trang bị

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Hàm Dr điều phối nhiều thao tác với room, túi đồ, vật liệu và phản hồi.
- Character offset vùng: [223297, 233842) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `Dr` | function | 223297–233303 |  | `rn`, `Lt`, `bn`, `q`, `Xa`, `Va`, `N`, `Ue`, `ce`, `z`, `Rn`, `dn` |

## Source-grounded implementation notes

### `Dr` — **CONFIRMED**
- Source: [223297, 233303) UTF-16; [240096, 250762) bytes. 
- Equipment command dispatcher.
- Initial source: `function Dr(n,t,e,a,i){var J,j;const h=rn(t);if(!h||t.dead||!t.room)return;const o=t.room.world.time,c=s=>{t.note(s)},r=s=>h.bag.find(d=>d.u===s),u=s=>h.worn[s.s]===s.u,l`…
- Internal dependencies: `rn`, `Fn`, `Lt`, `bn`, `ga`, `Xa`, `q`, `Va`, `Jn`, `O`, `N`, `Ue`, `ce`, `W`, `Bn`, `An`, `z`, `Rn`, `dn`, `cn`, `Sn`, `dr`, `Y`, `yt`, `Kt`, `Qa`, `rt`, `Pt`, `Ge`, `hn`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.