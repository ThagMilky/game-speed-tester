"""GAME_ASSET_WIKI_v1.0 structural and targeted source-evidence validator.

The checks below can prove hashes, types, offsets, source anchors, and known-regression
absence. They cannot semantically verify arbitrary minified JavaScript, unseen
server logic, or the conceptual cross-module edges in FUNCTION_GRAPH.json.
"""
from collections import Counter
from pathlib import Path
import hashlib
import json
import re
import sys


EXPECTED_ASSETS = 10
EXPECTED_AUDITS = 23
EXPECTED_SYMBOLS = 16037
STATUS_VALUES = {'VERIFIED_UNCHANGED', 'CORRECTED', 'UNSUPPORTED', 'UNRESOLVED'}
NODE_TYPES = {'source_symbol', 'conceptual_subsystem'}
EDGE_TYPES = {'direct_call', 'event_or_call', 'subsystem_pipeline'}
CONFIDENCE = {'CONFIRMED', 'INFERRED', 'UNKNOWN'}
HISTORICAL_ROOT_DOCS = {
    'CORRECTION_LOG.md', 'FUNCTION_MAP_AUDIT_REPORT.md', 'FUNCTION_MAP_CORRECTION_MATRIX.md',
    'CROSS_DOCUMENT_CORRECTION_MATRIX.md', 'FINAL_FUNCTION_MAP_VALIDATION.md',
    'TECHNICAL_CLAIM_AUDIT.md', 'WIKI_AUDIT_REPORT.md', 'FINAL_RELEASE_AUDIT.md',
    'FINAL_REPAIR_REPORT.md', 'FINAL_VALIDATION_REPORT.md', 'FINAL_CONSISTENCY_REPORT.md',
    'MERGE_REPORT.md', 'SYMBOL_VALIDATION_REPORT.md', 'HANDOFF_FIX_REPORT.md',
}


def load(root, rel):
    return json.loads((root / rel).read_text(encoding='utf-8'))


def source_records(root):
    m = load(root, 'SOURCE_MANIFEST.json')
    records = m['source_manifest']
    names = {x['original_filename'] for x in records}
    assert len(records) == EXPECTED_ASSETS and len(names) == EXPECTED_ASSETS, 'Manifest count/duplicate error'
    assert all(Path(n).name == n for n in names), 'Invalid source filename'
    disk = {p.name for p in (root / 'source').iterdir() if p.is_file()}
    assert names == disk, f'Source file set mismatch: manifest-only={names-disk}, disk-only={disk-names}'
    return m, records, names


def check_source_integrity(root):
    m, rows, _ = source_records(root)
    nbytes = u16 = points = 0
    for row in rows:
        fn = row['original_filename']
        assert row.get('relative_output_path') == f'source/{fn}', f'Invalid source path: {fn}'
        b = (root / 'source' / fn).read_bytes()
        assert len(b) == row['byte_size'], f'Byte size mismatch: {fn}'
        assert hashlib.sha256(b).hexdigest() == row['sha256'], f'SHA-256 mismatch: {fn}'
        text = b.decode('utf-8', errors='strict')
        units = len(text.encode('utf-16-le')) // 2
        assert row.get('utf16_length') == units, f'UTF-16 length mismatch: {fn}'
        assert row.get('utf16_code_units') == units, f'UTF-16 units mismatch: {fn}'
        nbytes += len(b)
        u16 += units
        points += len(text)
    assert m.get('source_files_count') == EXPECTED_ASSETS
    assert m.get('total_source_bytes') == nbytes
    assert m.get('total_utf16_chars') == u16
    assert m.get('total_utf16_code_units') == u16
    assert m.get('total_unicode_code_points') == points
    print(f'[PASS] Source integrity: {len(rows)}/{EXPECTED_ASSETS} SHA-256; {nbytes} bytes, {u16} UTF-16 units, {points} code points')


def check_json_integrity(root):
    paths = sorted(root.rglob('*.json'))
    parsed = {p.relative_to(root).as_posix(): json.loads(p.read_text(encoding='utf-8')) for p in paths}
    assert len(paths) >= 10, 'Too few JSON files'
    _, _, source_names = source_records(root)
    for rel in ['FUNCTION_MAP_AUDIT.json', 'SOURCE_MANIFEST.json', 'FUNCTION_GRAPH.json', 'ASSET_INDEX.json',
                'references/IMPORT_EXPORT_MAP.json']:
        assert rel in parsed, f'Missing important JSON file: {rel}'
    asset_index = parsed['ASSET_INDEX.json']
    symbols = asset_index.get('symbols', [])
    ids = [x.get('symbol_id') for x in symbols]
    assert len(symbols) == EXPECTED_SYMBOLS and len(ids) == len(set(ids)), 'Symbol index count / duplicate IDs'
    for rec in symbols:
        assert rec['source_file'] in source_names, f'Unknown indexed source: {rec["source_file"]}'
    audit = parsed['FUNCTION_MAP_AUDIT.json']
    for rec in audit['entries']:
        assert rec['source_file'] in source_names, f'Unknown audit source: {rec["source_file"]}'
    graph = parsed['FUNCTION_GRAPH.json']
    for node in graph['nodes']:
        assert node['module'] in source_names, f'Unknown graph module: {node["module"]}'
    print(f'[PASS] JSON validity / references: {len(paths)} JSON files, {len(symbols)} unique indexed symbols')


def check_function_map(root):
    audit = load(root, 'FUNCTION_MAP_AUDIT.json')
    entries = audit['entries']
    assert len(entries) == EXPECTED_AUDITS == audit['total_active_entries']
    counts = Counter(e['final_status'] for e in entries)
    assert set(counts) <= STATUS_VALUES, f'Unknown audit statuses: {set(counts)-STATUS_VALUES}'
    expected = {'VERIFIED_UNCHANGED': 'verified_unchanged', 'CORRECTED': 'corrected',
                'UNSUPPORTED': 'unsupported', 'UNRESOLVED': 'unresolved'}
    for status, field in expected.items():
        assert audit.get(field) == counts[status], f'Audit field {field} does not match entry statuses'
    ids = [x['entry_id'] for x in entries]
    assert len(ids) == len(set(ids)), 'Duplicate function audit IDs'
    texts = {}
    for e in entries:
        fn = e['source_file']
        if fn not in texts:
            texts[fn] = (root/'source'/fn).read_bytes().decode('utf-8', 'strict').encode('utf-16-le')
        unit_bytes = texts[fn]
        loc = e['source_location']
        start, end = loc['char_start'], loc['char_end']
        assert loc['offset_unit'] == 'utf16' and isinstance(start, int) and isinstance(end, int), e['entry_id']
        assert 0 <= start < end <= len(unit_bytes)//2, f'Out-of-range audit offset: {e["entry_id"]}'
        span = unit_bytes[2*start:2*end].decode('utf-16-le', 'replace')
        assert re.search(r'(?<![\w$])' + re.escape(e['symbol']) + r'(?![\w$])', span), (
            f'Symbol {e["symbol"]!r} absent from its audit range {e["entry_id"]}')
    report=(root/'FUNCTION_MAP_AUDIT_REPORT.md').read_text(encoding='utf-8')
    final=(root/'FINAL_FUNCTION_MAP_VALIDATION.md').read_text(encoding='utf-8')
    for status in ('VERIFIED_UNCHANGED','CORRECTED'):
        count = counts[status]
        assert re.search(r'`'+status+r'`:\s*\*\*'+str(count)+r'\*\*',report), f'Audit report {status} mismatch'
    assert f'{counts["VERIFIED_UNCHANGED"]} VERIFIED_UNCHANGED, {counts["CORRECTED"]} CORRECTED' in final, 'Final report count mismatch'
    print(f'[PASS] Function map: {len(entries)} ranges contain symbols, {dict(counts)}; current reports agree')


def active_markdown_files(root):
    return [p for p in root.rglob('*.md') if 'original_indexes' not in p.parts and not (p.parent == root and p.name in HISTORICAL_ROOT_DOCS)]


def check_known_regressions(root):
    root_wiki = (root/'GAME_ASSET_WIKI_v1.0.md').read_text(encoding='utf-8')
    for line in root_wiki.splitlines():
        if '| **Combat Prediction**' in line:
            assert not re.search(r'`(?:xm|Hs|Dn|c1)`',line), 'Spiritual-root symbols mislabeled as combat prediction'
        if '| **Fishing Minigame**' in line:
            assert not re.search(r'`c1`',line), 'sim.c1 incorrectly attributed to fishing result'
        if '| **WebSocket Networking**' in line:
            assert not re.search(r'`Pt`|`__vite__mapDeps`',line), 'Loading helper mislabeled as socket networking'
    unresolved = (root/'UNRESOLVED.md').read_text(encoding='utf-8')
    assert 'xm` (combat sim)' not in unresolved and 'Hs` (damage calculation)' not in unresolved
    direct = (root/'source/tm-guard.js').read_text(encoding='utf-8')
    assert 'performance.now' not in direct and 'check_integrity' not in direct, 'Unexpected guard source change; revisit claim checks'
    module_doc = (root/'DEPENDENCY_MAP.md').read_text(encoding='utf-8')
    assert not re.search(r'(?:performance\.now.*[Uu]sed by `tm-guard|tm-guard.*execution jitter analysis)',module_doc)
    bad_patterns = [
       (re.compile(r'\b(?:A3|WorldScene)(?:::|\.)(?:onSnapshot|handleSnapshot)\b'), 'nonexistent WorldScene snapshot method'),
       (re.compile(r'\bWorldScene::(?:autoFarmLoop|castSkill)\b'), 'nonexistent WorldScene method'),
       (re.compile(r'\b(?:Pt\.sendPacket|Pt\.onMessage|Pt\.connect)\b'), 'nonexistent index.Pt networking methods'),
       (re.compile(r'\bsim::simulateCombat\b'), 'conceptual sim node disguised as source method'),
       (re.compile(r'\b(?:xm\s*\(combat sim\)|Hs\s*\(damage calculation\))'), 'wrong sim symbol interpretation'),
    ]
    scan_files = active_markdown_files(root)
    for path in scan_files:
        for i,line in enumerate(path.read_text(encoding='utf-8').splitlines(),1):
            for pat,why in bad_patterns:
                assert not pat.search(line), f'{why}: {path.relative_to(root)}:{i}'
            # Source-qualified checks only; short minified names exist in multiple modules.
            if re.search(r'\b(?:sim[.::]+xm|`xm` in `sim)',line):
                assert not re.search(r'\b(?:xm.{0,45}(?:combat sim|combat simulator|damage function))',line,re.I), f'sim.xm mislabel: {path}:{i}'
            if 'tm-guard' in line:
                assert not re.search(r'(?:tm-guard(?:\.js)?`?.{0,70}(?:uses|performs|monitors).{0,65}(?:performance\.now|debugger pauses|prototype integrity)|window\.performance\.now.*Used by)',line,re.I), f'unsupported guard implementation: {path}:{i}'
    print(f'[PASS] Targeted regression scan: {len(scan_files)} active Markdown documents; historical logs excluded')


def check_graph(root):
    g = load(root, 'FUNCTION_GRAPH.json')
    nodes, edges = g['nodes'], g['edges']
    ids = {n['id'] for n in nodes}
    assert len(ids) == len(nodes), 'Duplicate graph node ID'
    source_symbols = 0
    for n in nodes:
        assert n.get('node_type') in NODE_TYPES, f'Invalid node type: {n.get("id")}'
        evidence=n.get('evidence')
        assert isinstance(evidence,dict) and evidence.get('status') in CONFIDENCE, f'Missing node evidence: {n["id"]}'
        if n['node_type']=='source_symbol':
            source_symbols += 1
            assert n.get('source_symbol') and evidence.get('status')=='CONFIRMED', n['id']
            assert evidence.get('source_file')==n['module'] and evidence.get('source_anchor'), n['id']
            verify_anchor(root,evidence)
        else:
            assert n.get('source_symbol') is None and evidence.get('note'), f'Conceptual node misrepresented: {n["id"]}'
    confirmed=0
    for e in edges:
        assert e['source'] in ids and e['target'] in ids, f'Dangling edge {e}'
        assert e.get('relation_type') in EDGE_TYPES, f'Bad relation type: {e}'
        assert e.get('confidence') in CONFIDENCE, f'Bad confidence: {e}'
        ev=e.get('evidence')
        assert isinstance(ev,dict) and ev.get('status')==e['confidence'] and ev.get('note'), f'Missing edge evidence: {e}'
        if e['confidence']=='CONFIRMED':
            confirmed += 1
            assert e['relation_type']=='direct_call' and ev.get('source_file') and ev.get('source_anchor'), 'Confirmed relation requires direct call evidence'
            verify_anchor(root,ev)
    assert len(nodes)==14 and len(edges)==12, 'Expected targeted graph coverage changed unexpectedly'
    print(f'[PASS] Graph structure: {len(nodes)} nodes ({source_symbols} source symbols), {len(edges)} edges ({confirmed} with source-backed direct calls)')
    print('[LIMITATION] Inferred/unknown graph edges remain conceptual; metadata cannot prove runtime semantics')


def verify_anchor(root,ev):
    filename=ev['source_file']
    assert Path(filename).name==filename, 'Unsafe evidence source path'
    raw=(root/'source'/filename).read_bytes().decode('utf-8','strict').encode('utf-16-le')
    offset=ev['utf16_offset']
    anchor=ev['source_anchor'].encode('utf-16-le')
    assert isinstance(offset,int) and offset >= 0 and raw[offset*2:offset*2+len(anchor)]==anchor, f'Invalid source anchor at {filename}:{offset}'


def check_package(root):
    must_exist=['README.md','FUNCTION_MAP.md','FUNCTION_GRAPH.json','GAME_ASSET_WIKI_v1.0.md',
        'DEPENDENCY_MAP.md','CROSS_MODULE_ANALYSIS.md','UNRESOLVED.md','SOURCE_MANIFEST.json',
        'ASSET_INDEX.json','FUNCTION_MAP_AUDIT.json','FINAL_FUNCTION_MAP_VALIDATION.md',
        'tools/validate_wiki.py','HANDOFF_FIX_REPORT.md']
    for name in must_exist: assert (root/name).is_file(), f'Missing deliverable: {name}'
    assert not list(root.rglob('*.zip')), 'Nested .zip in output'
    print('[PASS] Required files / no nested ZIP archives')




def check_original_restoration(root):
    """Structural and source-anchor checks, not semantic correctness claims."""
    reg=load(root,'original_indexes/INDEX_REGISTRY.json')
    ix=load(root,'ASSET_INDEX.json')
    raw=load(root,'references/ORIGINAL_SYMBOL_LOOKUP.json')
    assert len(reg['modules'])==9 and reg['total_preserved_original_module_docs']==163
    assert len(ix['symbols'])==EXPECTED_SYMBOLS==ix['total_symbols']
    assert raw['count']==len(raw['entries']) and raw['count']>=13000
    baseline=load(root,'references/PRESERVATION_BASELINE.json')
    assert len(baseline['raw_module_documents'])==163
    for rec in baseline['raw_module_documents']+baseline['original_companions']:
        target=root/rec['path']
        assert target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest()==rec['sha256'],rec['path']
    rel=load(root,'RELEASE_MANIFEST.json')
    assert rel['symbol_statistics']['total_symbols']==len(ix['symbols'])
    assert rel['symbol_statistics']['location_verified']==sum(r['location']['validation_status']=='VERIFIED' for r in ix['symbols'])
    assert rel['symbol_statistics']['location_unresolved']==sum(r['location']['validation_status']=='UNRESOLVED' for r in ix['symbols'])
    originals_cached={}
    for symbol in ix['symbols']:
        ref=symbol.get('original_record')
        if not ref:continue
        original=load(root,ref['index_path']) if ref['index_path'] not in originals_cached else originals_cached[ref['index_path']]
        originals_cached[ref['index_path']]=original
        data=original
        for part in ref['json_pointer'].strip('/').split('/'):
            data=data[int(part)] if isinstance(data,list) else data[part]
    hashes={}
    for module in reg['modules']:
        f=root/module['index_path']
        assert f.is_file() and hashlib.sha256(f.read_bytes()).hexdigest()==module['index_sha256']
        for filename,sourcehash in module['source_sha256'].items():
            assert hashlib.sha256((root/'source'/filename).read_bytes()).hexdigest()==sourcehash
        for rel in module['preserved_files']:
            assert (root/'original_indexes'/module['slug']/rel).is_file()
    # Validate every original-pointer existence: no JSON pointers may silently point nowhere.
    originals={m['index_path']:load(root,m['index_path']) for m in reg['modules']}
    source_u16_lengths={p.name:len(p.read_bytes().decode('utf8').encode('utf-16-le'))//2 for p in (root/'source').iterdir() if p.is_file()}
    for e in raw['entries']:
        data=originals[e['original_index']]
        for part in e['json_pointer'].lstrip('/').split('/'):
            part=part.replace('~1','/').replace('~0','~')
            data=data[int(part)] if isinstance(data,list) else data[part]
        start=e['start_utf16'];end=e['end_utf16_exclusive']
        if start is not None:
            assert isinstance(start,int) and start>=0
            assert start<=source_u16_lengths[e['source_file']]
        if end is not None:
            assert isinstance(end,int) and end>=start
    sources={p.name:p.read_bytes().decode('utf8').encode('utf-16-le') for p in (root/'source').iterdir() if p.is_file()}
    symbols=ix['symbols']
    worlds=[r for r in symbols if r['source_file']=='WorldScene-b_2tpaKT.js' and r['kind']=='nested_function']
    assert len(worlds)==2627 and len({r['symbol_id'] for r in worlds})==2627
    assert all(r['location']['char_start']>0 and r['location']['char_end']>r['location']['char_start'] for r in worlds)
    modules=[r for r in symbols if r['source_file']=='phaser-DRI6y8R5.js' and r['kind']=='phaser_internal_module']
    inner=[r for r in symbols if r['source_file']=='phaser-DRI6y8R5.js' and r['kind'].startswith('phaser_') and r['kind']!='phaser_internal_module']
    assert len(modules)==1625 and len(inner)==5987
    for r in inner:
        p=r['location'];blob=sources[r['source_file']]
        assert p['range_type']=='source_anchor' and p['anchor_only'] and p['offset_unit']=='utf16'
        assert blob[p['char_start']*2:p['char_end']*2]==r['name'].encode('utf-16-le'),r['symbol_id']
    tm=[r for r in symbols if r['source_file'] in ('tm-direct.js','tm-guard.js')]
    assert len(tm)==70 and all(r['location']['range_type']=='source_anchor' for r in tm)
    assert all(r['location']['range_type']=='source_anchor' for r in symbols if r['source_file']=='ChieuMau-CEtRLp-4.js' and r['name']=='ke' and r['kind']=='binding')
    old=[r for r in symbols if r['source_file']=='index-BIkbGDKp.js']
    assert not any('WebSocket.send interception' in r.get('calls',[]) for r in old)
    print(f'[PASS] Restored original indexes: {len(reg["modules"])} packages, {len(raw["entries"])} crosswalk entries, 2627 nested WorldScene, 5987 Phaser source anchors; source-backed locations')

def validate_all(root):
    root=Path(root).resolve()
    print(f'GAME_ASSET_WIKI_v1.0 targeted validator v5.0-restored — {root}')
    checks=[check_source_integrity,check_json_integrity,check_function_map,
            check_known_regressions,check_graph,check_package,check_original_restoration]
    failures=0
    for check in checks:
        try: check(root)
        except Exception as exc:
            failures+=1
            print(f'[FAIL] {check.__name__}: {type(exc).__name__}: {exc}')
    print(f'{len(checks)-failures}/{len(checks)} structural/targeted checks passed. ' +
          ('No complete semantic verification implied.' if failures == 0 else 'Resolve errors before release.'))
    return failures==0


if __name__=='__main__':
    target = sys.argv[1] if len(sys.argv)>1 else str(Path(__file__).resolve().parents[1])
    sys.exit(0 if validate_all(target) else 1)
