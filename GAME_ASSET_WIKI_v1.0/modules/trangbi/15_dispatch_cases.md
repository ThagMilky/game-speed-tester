# Dr — command branch map

**CONFIRMED:** These are literal switch cases and source offsets. Implementation side effects depend on actor/room object methods; not runtime verified.

| Command | UTF-16 case range | Source preview |
|---|---|---|
| `equip` | 224991–225289 | `{const s=r(a);return s?o<t.combatUntil?c("Đang giao chiến, chưa thay đồ được."):s.g>q(t)?c(\`Cần cảnh giới ${An[s.g]} để mặc.\`):s.p?c("Chọn giữ hoặc nhận dòng tẩy luyện trước."):(h.` |
| `unequip` | 225289–225417 | `return!Rn(a)\|\|!h.worn[a]?void 0:o<t.combatUntil?c("Đang giao chiến, chưa thay đồ được."):(delete h.worn[a],T(!0));` |
| `enh` | 225417–225781 | `{if(!Rn(a))return;const s=h.enh[a]??0,d=K(a,i==="p");if(d==="stop")return;const g=h.enh[a]??0,p=d==="ok"?\`Cường hóa ${dn(a)} +${g} thành công.\`:g<s?\`Thất bại, ${dn(a)} tụt xuống +$` |
| `enh-n` | 225781–226231 | `{if(!Rn(a))return;let s;try{s=JSON.parse(i\|\|"{}")}catch{return}const d=h.enh[a]??0,g=cn(s.n??10,1,50),p=s.to===void 0?Sn:cn(s.to,1,Sn),b=!!s.protect;let H=0,I=0;for(;H<g&&(h.enh[a]` |
| `equip-best` | 226231–226537 | `{if(o<t.combatUntil)return c("Đang giao chiến, chưa thay đồ được.");const s=dr(h.bag,q(t));let d=0;for(const p of Y){const b=s[p];if(!b\|\|h.worn[p]===b)continue;h.worn[p]=b;const H=` |
| `combine` | 226537–227594 | `{let s;try{s=JSON.parse(a\|\|"{}")}catch{return}if(!Array.isArray(s.u)\|\|new Set(s.u).size!==yt\|\|s.u.length!==yt\|\|!Rn(s.slot))return c(\`Chọn đúng ${yt} món và ô muốn ra.\`);const d=s.u` |
| `reforge` | 227594–227940 | `{const s=r(a);if(!s)return;if(s.g>=q(t))return c("Món đã ở đời cao nhất cảnh giới cho phép.");if(s.p)return c("Chọn giữ hoặc nhận dòng tẩy luyện trước.");const d=Fa(s.q,s.g);if(!l(` |
| `setswap` | 227940–228262 | `{const s=r(a);if(!(s!=null&&s.c)\|\|s.c==="*")return c("Món này không có bộ.");if(i!=="a"&&i!=="b")return;const d=Gt(s.c.split(":")[0],i);if(d===s.c)return;const g=Tc(s.q,s.g);if(!l(` |
| `salvage-filter` | 228262–228461 | `{const s=Vt((()=>{try{return JSON.parse(a)}catch{return null}})());if(!s)return;const d=new Set(Object.values(h.worn)),g=h.bag.filter(p=>Ri(p,s,q(t),d));return G(g)?T(!1):void 0}` |
| `auto` | 228461–228672 | `{if(!a)return delete h.af,t.note("Đã tắt tự phân giải."),T(!1);const s=Vt((()=>{try{return JSON.parse(a)}catch{return null}})());return s?(h.af=s,t.note("Đã bật tự phân giải theo l` |
| `lock` | 228672–228900 | `{const s=r(a),d=Number(i);if(!s\|\|!Number.isInteger(d)\|\|!s.a[d])return;const g=s.a[d];if(g.l)delete g.l;else{if(s.a.filter(p=>p.l).length+1>=s.a.length)return c("Phải chừa ít nhất m` |
| `reroll` | 228900–229330 | `{const s=r(a);if(!s\|\|!s.a.length)return c("Món này chưa có dòng phụ (phẩm Lục trở lên).");const d=s.a.filter(p=>p.l),g=cs(d.length,s.g);return d.length>=s.a.length?c("Phải chừa ít ` |
| `keep` | 229330–229474 | `{const s=r(a);return s!=null&&s.p?(i==="new"?(s.a=s.p,t.note("Đã nhận dòng mới.")):t.note("Giữ dòng cũ."),delete s.p,T(u(s))):void 0}` |
| `ascend` | 229474–230330 | `{const s=r(a);if(!s)return;if(s.q>=Xh)return c(s.q>=lt?"Phẩm Thần là cao nhất.":"Phẩm Đỏ là mức cao nhất của thăng phẩm; Thần chỉ có từ boss thế giới và sự kiện.");if(s.p)return c(` |
| `inlay` | 230330–230761 | `{const s=r(a),d=Xe(i);if(!s\|\|!d)return;if(!xe(s.s,d.el))return c(\`${dn(s.s)} không khảm được ngọc ${d.el==="kim"?"Kim":d.el==="hoa"?"Hỏa":"này"}.\`);const g=s.m.findIndex(p=>!p);ret` |
| `unsocket` | 230761–230983 | `{const s=r(a),d=Number(i),g=s&&Number.isInteger(d)?Lt(s.m[d]):null;return!s\|\|!g\|\|!l(Ye(g.lv))?void 0:(s.m[d]="",t.give(bn(g.el,g.lv),1),t.note(\`Tháo ${bn(g.el,g.lv)} (phí ${Ye(g.lv` |
| `merge` | 230983–231333 | `{const s=Xe(a);if(!s\|\|s.lv>=Nn)return;const d=i==="all"?Math.floor(t.count(a)/pt):1,g=Math.min(d,Math.floor(t.count(a)/pt),Math.floor(t.count(Fn)/zt(s.lv)));return g<1?c(\`Ghép cần ` |
| `guard` | 231333–231404 | `{const s=r(a);return s?(s.k?delete s.k:s.k=1,T(!1)):void 0}` |
| `salvage` | 231404–231606 | `{let s;try{s=JSON.parse(a\|\|"[]")}catch{return}return!Array.isArray(s)\|\|!s.length\|\|s.length>120\|\|s.some(d=>typeof d!="string")\|\|!G([...new Set(s)].map(d=>r(d)).filter(d=>!!d))?void ` |
| `forge` | 231606–231963 | `{if(!Rn(a))return;if(h.bag.length>=En)return c("Túi trang bị đầy.");const s=q(t),d=ps(s);if(!l(d.silver,[[W,d.essence]]))return;let g=N()*100,p=1;for(let H=0;H<Xt.length;H++){if(g<` |
| `buy` | 231963–232511 | `{const s=Ts.find(b=>b.id===a);if(!s)return;const d=!Array.isArray(s.give),g=cn(i\|\|1,1,d?10:99);if(d&&h.bag.length+g>En)return c("Túi trang bị không đủ chỗ.");const p=s.price*g;if(t` |
| `awaken` | 232511–232932 | `{const s=r(a);if(!s)return;if(s.s!=="weapon"\|\|s.q<Ut)return c("Chỉ vũ khí phẩm Đỏ hoặc Thần mới thức tỉnh được.");if(q(t)<Je)return c(\`Thức tỉnh vũ khí mở từ cảnh giới ${An[Je]}.\`)` |
| `fashion` | 232932–233136 | `return h.f??(h.f=[]),a?!h.f.includes(a)\|\|!xn[a]?void 0:(h.fw=a,t.note(\`Mặc thời trang ${xn[a].name}.\`),T(!0)):h.fw?(delete h.fw,t.note("Đã cởi thời trang (vẫn giữ trong tủ)."),T(!0` |
| `use` | 233136–233162 | `{$r(t,a);return}` |
| `buygem` | 233162–233301 | `{const s=Bt.find(g=>g===a),d=cn(i\|\|1,1,99);return!s\|\|!l(fs*d)?void 0:(t.give(bn(s,1),d),t.note(\`Mua ${d} ${bn(s,1)}.\`),T(!1))}` |

## State and effects
- `Dr(n,t,e,a,i)` checks target entity and room, consults `.room.world.time`, `.bag`, `.worn`, `.count`, `.give`, `.note` and command-specific fields.
- Material deduction is observable in source, but who invokes `Dr` and which state is authoritative remain **UNKNOWN**.
- Case labels are operation names, not a guarantee every path is used in game.