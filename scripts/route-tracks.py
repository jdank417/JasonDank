"""Routes the boat on the "Where I've sailed" map between its pins, over water.

Prints TypeScript arrays to paste into `tracks` in src/data/voyages.ts. Run
after changing a view's pins (same environment as build-charts.py):

    .venv-charts/bin/python scripts/route-tracks.py

Each leg is an A* search on a grid of water cells cut from the same GSHHS
land the map draws, then simplified while every straight piece stays off land.
A pin that sits on the shoreline is reached at the nearest water cell.
"""

import heapq
import importlib.util
import math
import os

import numpy as np
import shapely
from shapely.geometry import LineString

here = os.path.dirname(__file__)
spec = importlib.util.spec_from_file_location('charts', os.path.join(here, 'build-charts.py'))
charts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(charts)

# Pins in sailing order for each view: (lat, lon, id). The Boston track starts
# at the Charles River mouth; the boat's run down the river is added in front.
LEGS = {
    'boston': [
        (42.3705, -71.0585, None),
        (42.278956, -71.014246, 'squantum'),
        (42.33, -70.975, 'mbsa'),
        (42.5045, -70.8445, 'marblehead'),
    ],
    'cape': [
        (41.6363, -70.2781, 'hyannis'),
        (41.2865, -70.0956, 'nantucket'),
    ],
    'long-island': [
        (40.8015, -72.6995, 'westhampton'),
        (41.2655, -72.0165, 'fishers'),
        (40.950188, -73.067309, 'pjyc'),
        (40.920827, -73.150184, 'stony-brook'),
    ],
}
CELL = {'boston': 0.0012, 'cape': 0.002, 'long-island': 0.002}
# Sea room kept off the shore, in cells. Long Island's inlets are narrow.
ROOM = {'boston': 0.6, 'cape': 0.6, 'long-island': 0.15}


def route(view):
    lon0, lat0, lon1, lat1, tol, _ = charts.VIEWS[view]
    land = charts.land(lon0, lat0, lon1, lat1).simplify(tol, preserve_topology=True)
    shapely.prepare(land)
    step = CELL[view]
    lons = np.arange(lon0, lon1, step)
    lats = np.arange(lat0, lat1, step)
    gx, gy = np.meshgrid(lons, lats)
    # A cell is water if its centre is off land, with a little sea room.
    water = ~shapely.contains_xy(land.buffer(step * ROOM[view]), gx, gy)

    def cell(lat, lon):
        return int(round((lat - lat0) / step)), int(round((lon - lon0) / step))

    def nearest_water(r, c):
        if water[r, c]:
            return r, c
        best = None
        for rad in range(1, 40):
            for dr in range(-rad, rad + 1):
                for dc in range(-rad, rad + 1):
                    rr, cc = r + dr, c + dc
                    if 0 <= rr < water.shape[0] and 0 <= cc < water.shape[1] and water[rr, cc]:
                        d = dr * dr + dc * dc
                        if best is None or d < best[0]:
                            best = (d, rr, cc)
            if best:
                return best[1], best[2]
        raise RuntimeError('no water near pin')

    def astar(a, b):
        open_ = [(0, a)]
        came = {a: None}
        cost = {a: 0}
        while open_:
            _, cur = heapq.heappop(open_)
            if cur == b:
                break
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    if not dr and not dc:
                        continue
                    nxt = (cur[0] + dr, cur[1] + dc)
                    if not (0 <= nxt[0] < water.shape[0] and 0 <= nxt[1] < water.shape[1]) or not water[nxt]:
                        continue
                    nc = cost[cur] + math.hypot(dr, dc)
                    if nc < cost.get(nxt, 1e18):
                        cost[nxt] = nc
                        came[nxt] = cur
                        heapq.heappush(open_, (nc + math.hypot(b[0] - nxt[0], b[1] - nxt[1]), nxt))
        if b not in came:
            return None
        path, cur = [], b
        while cur is not None:
            path.append(cur)
            cur = came[cur]
        return path[::-1]

    def clear(p, q):
        return not LineString([(p[1], p[0]), (q[1], q[0])]).intersects(land)

    def simplify(pts):
        # Greedy line-of-sight: from each kept point, jump to the farthest point
        # still reachable in a straight line over water.
        out = [pts[0]]
        i = 0
        while i < len(pts) - 1:
            j = len(pts) - 1
            while j > i + 1 and not clear(pts[i], pts[j]):
                j -= 1
            out.append(pts[j])
            i = j
        return out

    stops = LEGS[view]
    track = []
    for (alat, alon, aid), (blat, blon, bid) in zip(stops, stops[1:]):
        a = nearest_water(*cell(alat, alon))
        b = nearest_water(*cell(blat, blon))
        cells = astar(a, b)
        if cells is None:
            # Shut-in water at this resolution: fall back to a straight leg.
            print(f'  // {view}: no water route from {aid} to {bid}; straight leg')
            cells = [a, b]
        pts = simplify([(lat0 + r * step, lon0 + c * step) for r, c in cells])
        if not track:
            track.append((pts[0][0], pts[0][1], aid))
        for lat, lon in pts[1:-1]:
            track.append((lat, lon, None))
        track.append((pts[-1][0], pts[-1][1], bid))
    return track


import sys
for view in sys.argv[1:] or LEGS:
    print(f"  '{view}': [")
    for lat, lon, at in route(view):
        tag = f", at: '{at}'" if at else ''
        print(f'    {{ lat: {lat:.4f}, lon: {lon:.4f}{tag} }},')
    print('  ],')
