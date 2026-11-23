"""Pull the Kapar–Klang–Shah Alam map layers out of a Geofabrik .osm.pbf extract.

Usage: python3 -I scripts/pbf-extract.py malaysia.osm.pbf roads.json
Writes Overpass-style JSON ({"elements": [{"tags":..., "geometry":[{lat,lon}...]}]})
for scripts/osm-to-map.py. Map data (c) OpenStreetMap contributors (ODbL).
"""
import json
import sys

import osmium

S, W, N, E = 2.98, 101.20, 3.25, 101.58
HW = {'motorway', 'trunk', 'primary', 'secondary', 'motorway_link'}


class H(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.out = []

    def way(self, w):
        t = w.tags
        hw = t.get('highway')
        keep = (hw in HW) or t.get('natural') == 'coastline' or (t.get('waterway') == 'river' and 'name' in t)
        if not keep:
            return
        try:
            pts = [(n.lon, n.lat) for n in w.nodes]
        except osmium.InvalidLocationError:
            return
        if not any(S <= lat <= N and W <= lon <= E for lon, lat in pts):
            return
        tags = {k: t.get(k) for k in ('highway', 'natural', 'waterway', 'ref', 'name') if t.get(k)}
        self.out.append({'tags': tags, 'geometry': [{'lon': round(lon, 6), 'lat': round(lat, 6)} for lon, lat in pts]})


h = H()
h.apply_file(sys.argv[1], locations=True, idx='flex_mem')
json.dump({'elements': h.out}, open(sys.argv[2], 'w'))
print('ways', len(h.out))
