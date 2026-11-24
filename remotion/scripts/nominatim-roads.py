"""Collect road geometry from Nominatim (fallback when Overpass is unreachable).

Usage: python3 -I scripts/nominatim-roads.py out.json [queries.json]
(queries.json: [[name, class, ref], ...]; defaults to the Kapar list)
Searches each road name inside the Kapar–Shah Alam box, pages through results
with exclude_place_ids and keeps every highway way's LineString. Output is
Overpass-style JSON for scripts/osm-to-map.py. Respects Nominatim's 1 req/s
policy. Map data (c) OpenStreetMap contributors (ODbL).
"""
import json
import sys
import time
import urllib.parse
import urllib.request

UA = 'video-map-builder/1.0'
VIEWBOX = '101.27,3.22,101.56,2.98'  # W,N,E,S
QUERIES = [
    ('Lebuhraya Pesisiran Pantai Barat', 'motorway', 'E32'),
    ('Lebuhraya NKVE', 'motorway', 'E1'),
    ('Lebuhraya Persekutuan', 'trunk', 'FT2'),
    ('Jalan Kapar', 'trunk', 'FT5'),
    ('Jalan Kapar - Kuala Selangor', 'trunk', 'FT5'),
    ('Jalan Meru', 'primary', None),
    ('Jalan Pelabuhan Utara', 'primary', None),
    ('Lebuhraya Shah Alam', 'motorway', 'E5'),
    ('Jalan Kampung Tok Muda', 'secondary', None),
    ('Jalan Benteng Kanan', 'secondary', None),
]


def get(params):
    url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


if len(sys.argv) > 2:
    QUERIES = [tuple(q) for q in json.load(open(sys.argv[2]))]

out = []
seen = set()
for name, cls, ref in QUERIES:
    excl = []
    for page in range(6):
        params = {'q': name, 'format': 'jsonv2', 'limit': 40, 'viewbox': VIEWBOX, 'bounded': 1,
                  'polygon_geojson': 1, 'polygon_threshold': 0.00005, 'countrycodes': 'my'}
        if excl:
            params['exclude_place_ids'] = ','.join(excl)
        try:
            res = get(params)
        except Exception as e:  # network hiccup: retry once
            time.sleep(3)
            try:
                res = get(params)
            except Exception:
                print('  fail', name, page, e)
                break
        time.sleep(1.1)
        if not res:
            break
        n = 0
        for r in res:
            excl.append(str(r['place_id']))
            g = r.get('geojson') or {}
            if r.get('category') != 'highway' or r['osm_id'] in seen:
                continue
            lines = [g['coordinates']] if g.get('type') == 'LineString' else g.get('coordinates', []) if g.get('type') == 'MultiLineString' else []
            for ln in lines:
                out.append({'tags': {'highway': cls if r['type'] in ('motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'residential', 'unclassified') else r['type'], 'ref': ref or '', 'name': name},
                            'geometry': [{'lon': x, 'lat': y} for x, y in ln]})
                n += 1
            seen.add(r['osm_id'])
        print(name, 'page', page, 'results', len(res), 'ways', n, flush=True)
        if len(res) < 40:
            break

json.dump({'elements': out}, open(sys.argv[1], 'w'))
print('total ways', len(out))
