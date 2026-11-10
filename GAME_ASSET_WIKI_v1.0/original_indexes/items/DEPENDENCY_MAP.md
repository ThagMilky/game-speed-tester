# DEPENDENCY_MAP — imports, exports, runtime files, unresolved links

## Module graph

```text
trangbi-iyUH-plT.js --(40 minified aliases)--> items-nDkzNEls.js --(15 named export aliases)--> unknown callers
index-BIkbGDKp.js --(d as p: DOM factory)--> items-nDkzNEls.js
items-nDkzNEls.js --fetch--> data/gear/gear.json
items-nDkzNEls.js --fetch--> data/items/items-meta.json
items-nDkzNEls.js --fetch--> data/items.json
items-nDkzNEls.js --DOM img/background--> image files in data/, kt-ui/
items-nDkzNEls.js --read/write--> localStorage[tm-controls-v1]
```

## Exact imports (aliases as written)

`./trangbi-iyUH-plT.js`:

`d5→O`, `d6→F`, `b_→R`, `F→V`, `d7→E`, `d8→_`, `d9→P`, `da→X`, `bA→J`, `bJ→I`, `bK→U`, `O→x`, `bL→Q`, `bP→Z`, `cw→Y`, `cy→y`, `cC→z`, `cD→nn`, `cN→tn`, `cO→hn`, `cx→an`, `db→cn`, `aB→en`, `aI→gn`, `a3→on`, `ax→sn`, `cl→rn`, `c1→un`, `c2→ln`, `bN→dn`, `bO→pn`, `br→mn`, `aH→fn`, `al→yn`, `ak→$n`, `aj→kn`, `ai→Tn`, `ah→bn`, `ag→vn`, `dc→xn`.

`./index-BIkbGDKp.js`: `d→p`.

## Exact exports

`M→C`, `qn→a`, `K→b`, `Nn→c`, `Ln→d`, `Cn→e`, `In→f`, `N→g`, `H→h`, `j→i`, `Hn→j`, `Dn→k`, `Mn→l`, `Pn→r`, `Xn→s`.

`Dn` is a frozen namespace-like object: `coinIcon:qn`, `gearIcon:N`, `itemIcon:j`, `itemMeta:K`, `loadGearIcons:Kn`, `loadItemMeta:In`, `rewardItemName:Pn`.

## Import relationships by dataflow

- ID/gear lookup: `O`, `F`, `R`, `V`, `X`, `xn` → `N`, `j`; `mn` + `X` → `Pn`.
- Base icon maps: `E`, `_`, `P` → `j`; `E`, `on`, `sn` → `K`.
- Pills: `Z` → `K`; built-in `Bn`, `S`, `G`, `C` → `K`.
- Elements/gems: `Y`, `y`, `z`, `nn`, `tn`, `hn`, `an` → `K`.
- Fashion: `cn`, `en`, `gn` → `K`; piece icon via `N`.
- Special material constants: `vn`, `bn`, `Tn`, `kn`, `$n`, `yn`, `fn` → `K`.
- Fragments/books: `rn`, `un`, `ln`, `dn`, `pn` → `K`.
- Mounts: `J`, `I`, `U`, `x`, `Q` → `K`.
- Element factory `p` → `j`, `qn`.

## Cross-asset unresolved dependencies

**UNKNOWN:** exported definitions, data values and semantics for each minified alias in `trangbi-iyUH-plT.js`; DOM factory behavior `p` in `index-BIkbGDKp.js`; all importers/callers and whether they pre-load assets; existence/content of fetched JSON and image files; server authoritative behavior for buffs, recipes, gear, rarity, item use. Do not close these gaps without reviewing those specific assets.

**Note:** `ASSET_INDEX.json` is canonical for precise import counts.
