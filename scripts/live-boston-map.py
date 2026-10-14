"""Builds the downtown Boston map that the Live Boston animation is drawn on.

Writes src/components/animations/liveboston-map.ts: the real track of every
line between North Station and South Station, the stations on them, and the
water, parks and main streets around them, all projected into the scene's
map frame. It's generated once and committed, so the site build never needs
this script. To regenerate:

    python3 -m venv .venv-charts
    .venv-charts/bin/pip install shapely
    .venv-charts/bin/python scripts/live-boston-map.py

Sources: track shapes and station positions from the MBTA V3 API (the same
feed Live Boston runs on); shoreline, rivers, parks and streets from
OpenStreetMap (© OpenStreetMap contributors, ODbL) through the Overpass API.
Downloads are cached in .cache/live-boston/ so reruns don't fetch again.
"""

import json
import math
import os
import urllib.parse
import urllib.request

from shapely.geometry import LineString, Point, Polygon, box
from shapely.ops import linemerge, polygonize, unary_union

here = os.path.dirname(__file__)
CACHE = os.path.join(here, '..', '.cache', 'live-boston')
OUT = os.path.join(here, '..', 'src', 'components', 'animations', 'liveboston-map.ts')

# The view: North Station near the top, South Station near the bottom, the
# Longfellow Bridge at the left edge and the harbor at the right. Its aspect
# matches the 560×400 frame at this latitude, so north is up and nothing is
# stretched.
SOUTH, NORTH = 42.3483, 42.3698
MID = (SOUTH + NORTH) / 2
WIDE = (NORTH - SOUTH) * 560 / 400 / math.cos(math.radians(MID))
WEST, EAST = -71.0600 - WIDE / 2, -71.0600 + WIDE / 2
X0, Y0, W, H = 40, 20, 560, 400
METERS_PER_DEG_LAT = 111_132
PX_PER_M = H / ((NORTH - SOUTH) * METERS_PER_DEG_LAT)


def proj(lat, lon):
    return (X0 + (lon - WEST) / (EAST - WEST) * W, Y0 + (NORTH - lat) / (NORTH - SOUTH) * H)


def fetch(name, url, data=None):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        req = urllib.request.Request(url, data=data, headers={'User-Agent': 'jasondank-portfolio-map/1.0'})
        with urllib.request.urlopen(req, timeout=120) as r, open(path, 'wb') as f:
            f.write(r.read())
    with open(path) as f:
        return json.load(f)


def mbta(path):
    name = path.replace('/', '_').replace('?', '_').replace('=', '-').replace('[', '').replace(']', '').replace(',', '_') + '.json'
    return fetch(name, 'https://api-v3.mbta.com/' + path)


def overpass(name, query):
    data = urllib.parse.urlencode({'data': query}).encode()
    try:
        return fetch(name, 'https://overpass-api.de/api/interpreter', data)
    except OSError:  # The main instance is often busy; this mirror serves the same data.
        return fetch(name, 'https://overpass.kumi.systems/api/interpreter', data)


def decode(s):
    """A Google encoded polyline, as (lat, lon) pairs."""
    pts, i, lat, lon = [], 0, 0, 0
    while i < len(s):
        vals = []
        for _ in range(2):
            shift = res = 0
            while True:
                b = ord(s[i]) - 63
                i += 1
                res |= (b & 0x1F) << shift
                shift += 5
                if b < 0x20:
                    break
            vals.append(~(res >> 1) if res & 1 else res >> 1)
        lat += vals[0]
        lon += vals[1]
        pts.append((lat / 1e5, lon / 1e5))
    return pts


# Track runs past the frame by this much, so trains roll in from off the map.
RUN_OFF = box(X0 - 44, Y0 - 44, X0 + W + 44, Y0 + H + 44)
FRAME = box(X0 - 2, Y0 - 2, X0 + W + 2, Y0 + H + 2)


def track(route, shape_id):
    shapes = mbta(f'shapes?filter[route]={route}')
    s = next(x for x in shapes['data'] if x['id'] == shape_id)
    full = LineString([proj(*p) for p in decode(s['attributes']['polyline'])])
    line = full.intersection(RUN_OFF)
    if line.geom_type == 'MultiLineString':
        # A line can leave the view and come back into it (the Providence Line
        # curves out past Back Bay); keep the stretch through the middle.
        # A shape that starts in the view (a terminal) keeps the stretch from
        # its start; one passing through keeps the stretch nearest the middle.
        start = Point(full.coords[0])
        near = start if RUN_OFF.contains(start) else Point(X0 + W / 2, Y0 + H / 2)
        line = min(line.geoms, key=lambda g: g.distance(near))
    return line


# One shape per line, each in the direction the MBTA lists first. Green is the
# E branch, which runs the whole central subway; Blue ends at Bowdoin.
TRACKS = {
    'red': ('Red', 'canonical-931_0009'),  # Alewife → Ashmont
    'orange': ('Orange', 'canonical-903_0017'),  # Forest Hills → Oak Grove
    'green': ('Green-E', 'canonical-8000015'),  # Heath Street → Medford/Tufts
    'blue': ('Blue', 'canonical-946_0014'),  # Bowdoin → Wonderland
    'north': ('CR-Lowell', 'canonical-9830006'),  # North Station → Lowell
    'south': ('CR-Providence', 'canonical-9890004'),  # South Station → Providence
    'ferry': ('Boat-F4', 'LongWharfSouthToCharlestown-F'),  # Long Wharf → Navy Yard
}

lines = {k: track(*v).simplify(0.35) for k, v in TRACKS.items()}

# Orange and Green share the tunnel between Haymarket and North Station, side
# by side. Drawn exactly they'd sit on top of each other, so each is nudged a
# few meters to its own side.
# (Map y runs down, so shapely's left is the map's right: Orange, the line to
# the east, goes "left".)
lines['orange'] = lines['orange'].offset_curve(2.4).simplify(0.35)
lines['green'] = lines['green'].offset_curve(-2.4).simplify(0.35)

STATIONS = {
    'place-north': 'North Station',
    'place-sstat': 'South Station',
    'place-haecl': 'Haymarket',
    'place-gover': 'Government Center',
    'place-state': 'State',
    'place-dwnxg': 'Downtown Crossing',
    'place-pktrm': 'Park Street',
    'place-bomnl': 'Bowdoin',
    'place-aqucl': 'Aquarium',
    'place-boyls': 'Boylston',
    'place-chncl': 'Chinatown',
    'place-armnl': 'Arlington',
    'place-chmnl': 'Charles/MGH',
    'place-spmnl': 'Science Park/West End',
    'place-tumnl': 'Tufts Medical Center',
}
SERVES = {
    'red': ['place-chmnl', 'place-pktrm', 'place-dwnxg', 'place-sstat'],
    'orange': ['place-tumnl', 'place-chncl', 'place-dwnxg', 'place-state', 'place-haecl', 'place-north'],
    'green': ['place-armnl', 'place-boyls', 'place-pktrm', 'place-gover', 'place-haecl', 'place-north', 'place-spmnl'],
    'blue': ['place-bomnl', 'place-gover', 'place-state', 'place-aqucl'],
    'north': ['place-north'],
    'south': ['place-sstat'],
}
stops = mbta('stops?filter[id]=' + ','.join(STATIONS))
where = {s['id']: proj(s['attributes']['latitude'], s['attributes']['longitude']) for s in stops['data']}

# Where each line's trains stop: the station's distance along the track. A
# commuter rail terminal's stop is the end of its track, at the bumpers.
stations_on = {}
for line, ids in SERVES.items():
    g = lines[line]
    at = []
    for sid in ids:
        d = 0.0 if line in ('north', 'south') else g.project(Point(where[sid]))
        at.append((sid, round(d, 1)))
    stations_on[line] = sorted(at, key=lambda a: a[1])

# Water: the harbor is the sea side of the coastline; the Charles and the
# canals are mapped as water areas.
osm = overpass('water.json', f"""[out:json][timeout:90];
(way["natural"="coastline"]({SOUTH - .004},{WEST - .004},{NORTH + .004},{EAST + .004});
 way["natural"="water"]({SOUTH - .004},{WEST - .004},{NORTH + .004},{EAST + .004});
 relation["natural"="water"]({SOUTH - .004},{WEST - .004},{NORTH + .004},{EAST + .004});
 way["leisure"="park"]["name"~"^(Boston Common|Boston Public Garden|Paul Revere Park|North Point Park|Christopher Columbus Waterfront Park)$"]({SOUTH},{WEST},{NORTH},{EAST});
 relation["leisure"="park"]["name"="Boston Common"]({SOUTH},{WEST},{NORTH},{EAST}););
out geom;""")
osm_roads = overpass('roads.json', f"""[out:json][timeout:90];
way["highway"~"^(motorway|trunk|primary|secondary)$"]({SOUTH - .002},{WEST - .002},{NORTH + .002},{EAST + .002});
out geom;""")


def ring(geom):
    return LineString([proj(p['lat'], p['lon']) for p in geom])


coast, water, parks = [], [], []
for e in osm['elements']:
    t = e.get('tags', {})
    if e['type'] == 'way':
        g = ring(e['geometry'])
        if t.get('natural') == 'coastline':
            coast.append(g)
        elif g.is_closed and len(g.coords) > 3:
            (parks if t.get('leisure') else water).append(Polygon(g.coords).buffer(0))
    else:
        # A relation's rings come in pieces, one way each; join them up first.
        outer = list(polygonize(unary_union([ring(m['geometry']) for m in e['members'] if m['role'] == 'outer'])))
        inner = list(polygonize(unary_union([ring(m['geometry']) for m in e['members'] if m['role'] == 'inner'])))
        area = unary_union(outer).difference(unary_union(inner)) if inner else unary_union(outer)
        (parks if t.get('leisure') else water).append(area.buffer(0))

# Faces between the coastline and the frame's edge; the ones holding the
# harbor and Fort Point Channel are sea.
faces = [f for f in polygonize(unary_union(coast + [FRAME.exterior])) if FRAME.contains(f.representative_point())]
SEA = [proj(42.3600, -71.0420), proj(42.3530, -71.0512)]
sea = [f for f in faces if any(f.contains(Point(p)) for p in SEA)]
wet = unary_union(sea + water).intersection(FRAME).simplify(0.5)
green_space = unary_union(parks).intersection(FRAME).simplify(0.5)

streets = []
for e in osm_roads['elements']:
    t = e.get('tags', {})
    if t.get('highway') not in ('motorway', 'trunk', 'primary', 'secondary'):
        continue
    if t.get('tunnel') in ('yes', 'building_passage') or t.get('layer', '0').startswith('-'):
        continue  # The Big Dig and the rest of what runs underground
    g = ring(e['geometry']).intersection(FRAME)
    if not g.is_empty:
        streets.append(g)
roads = linemerge(unary_union(streets)).simplify(0.7)


def polys(g, min_area):
    parts = [g] if g.geom_type == 'Polygon' else [p for p in getattr(g, 'geoms', []) if p.geom_type == 'Polygon']
    out = ''
    for p in parts:
        if p.area < min_area:
            continue
        for r in [p.exterior, *p.interiors]:
            c = list(r.coords)[:-1]
            out += 'M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in c) + 'Z'
    return out


def paths(g):
    parts = [g] if g.geom_type == 'LineString' else list(getattr(g, 'geoms', []))
    return ''.join('M' + ' '.join(f'{x:.1f} {y:.1f}' for x, y in p.coords) for p in parts if p.length > 4)


def pts(g):
    return '[' + ', '.join(f'[{x:.1f}, {y:.1f}]' for x, y in g.coords) + ']'


with open(OUT, 'w') as f:
    f.write('// Generated by scripts/live-boston-map.py: downtown Boston, North Station to\n')
    f.write('// South Station, in the Live Boston scene\'s 560×400 map frame at (40, 20).\n')
    f.write('// Track and stations from the MBTA V3 API; water, parks and streets\n')
    f.write('// © OpenStreetMap contributors (ODbL). Edit the script, not this file.\n\n')
    f.write('export type Pt = [number, number];\n\n')
    f.write(f'/** Map units per meter on the ground. */\nexport const PX_PER_M = {PX_PER_M:.5f};\n\n')
    f.write('/** Each line\'s track, in the direction its MBTA shape runs. */\n')
    f.write('export const TRACK = {\n')
    for k, g in lines.items():
        f.write(f'  {k}: {pts(g)} as Pt[],\n')
    f.write('};\n\n')
    f.write('export type Line = keyof typeof TRACK;\n\n')
    f.write('export const STATIONS: Record<string, { name: string; at: Pt }> = {\n')
    for sid, name in STATIONS.items():
        x, y = where[sid]
        f.write(f"  '{sid}': {{ name: '{name}', at: [{x:.1f}, {y:.1f}] }},\n")
    f.write('};\n\n')
    f.write('/** Where each line\'s trains stop: station and distance along its track. */\n')
    f.write('export const STOPS: Partial<Record<Line, [string, number][]>> = {\n')
    for k, at in stations_on.items():
        f.write(f"  {k}: [{', '.join(f'[{chr(39)}{s}{chr(39)}, {d}]' for s, d in at)}],\n")
    f.write('};\n\n')
    f.write(f"export const WATER = '{polys(wet, 12)}';\n\n")
    f.write(f"export const PARKS = '{polys(green_space, 12)}';\n\n")
    f.write(f"export const STREETS = '{paths(roads)}';\n")

print('wrote', OUT, os.path.getsize(OUT), 'bytes')
for k, at in stations_on.items():
    print(k, round(lines[k].length), at)
