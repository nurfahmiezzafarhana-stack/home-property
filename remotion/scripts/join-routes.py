"""Join Nominatim road pieces into continuous highway routes.

Usage: python3 -I scripts/join-routes.py nom.json routes.json
Motorway/trunk pieces with the same name (same route) are ordered along the
route's principal axis and lightly smoothed (dual carriageways otherwise
zigzag). Other roads are kept as their real, separate segments.
"""
import json
import math
import sys
from collections import defaultdict

els = json.load(open(sys.argv[1]))['elements']
groups = defaultdict(list)
out = []
for e in els:
    t = e['tags']
    if t.get('highway') in ('motorway', 'trunk'):
        groups[t.get('ref') or t['name']].append(e)
    elif t.get('highway') in ('primary', 'secondary', 'tertiary'):
        out.append(e)

for key, segs in groups.items():
    pts = [(p['lon'], p['lat']) for s in segs for p in s['geometry']]
    t = segs[0]['tags']
    if len(segs) > 1:
        mx = sum(p[0] for p in pts) / len(pts)
        my = sum(p[1] for p in pts) / len(pts)
        sxx = sum((p[0] - mx) ** 2 for p in pts)
        syy = sum((p[1] - my) ** 2 for p in pts)
        sxy = sum((p[0] - mx) * (p[1] - my) for p in pts)
        ang = 0.5 * math.atan2(2 * sxy, sxx - syy)
        ux, uy = math.cos(ang), math.sin(ang)
        pts = sorted(set(pts), key=lambda p: (p[0] - mx) * ux + (p[1] - my) * uy)
        if len(pts) >= 8:
            w = 4
            sm = []
            for i in range(len(pts)):
                seg = pts[max(0, i - w): i + w + 1]
                sm.append((sum(p[0] for p in seg) / len(seg), sum(p[1] for p in seg) / len(seg)))
            sm[0], sm[-1] = pts[0], pts[-1]
            pts = sm
    out.append({'tags': {'highway': t['highway'], 'ref': t.get('ref', ''), 'name': t.get('name', '')}, 'geometry': [{'lon': x, 'lat': y} for x, y in pts]})
    print(key, t['highway'], len(pts))

json.dump({'elements': out}, open(sys.argv[2], 'w'))
print('elements', len(out))
