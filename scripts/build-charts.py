"""Builds the coastline files under public/charts/ from GSHHS shoreline data.

The hero chart and the "where I've sailed" map draw these paths. They are
generated once and committed, so the site build never needs this script or
its Python dependencies. To regenerate:

    python3 -m venv .venv-charts
    .venv-charts/bin/pip install basemap basemap-data-hires shapely
    .venv-charts/bin/python scripts/build-charts.py

Source: GSHHS full-resolution shoreline (Wessel & Smith), as bundled in the
basemap-data-hires package. Land polygons are clipped to each view and
simplified to well under a pixel at the size they are drawn.
"""

import json
import math
import os

from mpl_toolkits.basemap import Basemap
from shapely.geometry import Polygon, box
from shapely.ops import unary_union

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'charts')

# Boston Seaport: the hero chart is drawn in kilometres east/south of here.
SEAPORT = (-71.044, 42.351)


def merc(lat):
    """Mercator northing in degree units, so x (longitude) and y share a scale."""
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


def land(lon0, lat0, lon1, lat1):
    """GSHHS land for a lon/lat box, as one shapely geometry (lakes cut out)."""
    m = Basemap(projection='cyl', llcrnrlon=lon0, llcrnrlat=lat0, urcrnrlon=lon1,
                urcrnrlat=lat1, resolution='f', area_thresh=0.0)
    solids, holes = [], []
    for (xs, ys), kind in zip(m.coastpolygons, m.coastpolygontypes):
        if len(xs) < 3:
            continue
        poly = Polygon(list(zip(xs, ys))).buffer(0)
        # GSHHS levels: 1 land, 2 lake, 3 island in lake, 4 pond in island.
        (solids if kind in (1, 3) else holes).append(poly)
    geom = unary_union(solids)
    if holes:
        geom = geom.difference(unary_union(holes))
    return geom.intersection(box(lon0, lat0, lon1, lat1))


def rings(geom):
    polys = [geom] if geom.geom_type == 'Polygon' else list(getattr(geom, 'geoms', []))
    for p in polys:
        if p.geom_type != 'Polygon' or p.is_empty:
            continue
        yield list(p.exterior.coords)
        for interior in p.interiors:
            yield list(interior.coords)


def path(geom, project, digits):
    """Compact SVG path: absolute start, then relative steps, rounded."""
    out = []
    for ring in rings(geom):
        pts = [project(x, y) for x, y in ring]
        fx, fy = round(pts[0][0], digits), round(pts[0][1], digits)
        seg = [f'M{fx:g} {fy:g}']
        px, py = fx, fy
        for x, y in pts[1:]:
            rx, ry = round(x, digits), round(y, digits)
            dx, dy = round(rx - px, digits), round(ry - py, digits)
            if dx == 0 and dy == 0:
                continue
            seg.append(f'{dx:g} {dy:g}')
            px, py = rx, ry
        if len(seg) > 2:
            out.append(seg[0] + 'l' + ' '.join(seg[1:]) + 'z')
    return ''.join(out)


def hero():
    # Wide enough for the desktop hero (Seaport sits near the top right) and
    # for phones, where the chart runs further south below the rose.
    lon0, lat0, lon1, lat1 = -71.75, 41.80, -70.55, 42.62
    geom = land(lon0, lat0, lon1, lat1)
    kx = 111.320 * math.cos(math.radians(SEAPORT[1]))  # km per degree of longitude here
    y0 = merc(SEAPORT[1])

    def project(lon, lat):
        return ((lon - SEAPORT[0]) * kx, (y0 - merc(lat)) * kx)

    # 0.00015° is about 15 m, a fraction of a pixel at the hero's scale.
    simple = geom.simplify(0.00015, preserve_topology=True)
    d = path(simple, project, 2)
    return {
        'source': 'GSHHS full resolution (Wessel & Smith)',
        'origin': list(SEAPORT),
        'unit': 'km',
        'd': d,
    }


VIEWS = {
    # id: (lon0, lat0, lon1, lat1, simplify tolerance in degrees, smallest
    # island kept in square degrees)
    'east-coast': (-82.6, 24.9, -69.4, 43.4, 0.02, 0.0006),
    'boston': (-71.20, 42.22, -70.74, 42.60, 0.0004, 0),
    'cape': (-70.62, 41.18, -69.88, 41.76, 0.0007, 0),
    'long-island': (-73.32, 40.58, -71.80, 41.40, 0.0011, 0),
}


def drop_specks(geom, min_area):
    """Removes islands too small to see at a view's scale."""
    if not min_area or geom.geom_type != 'MultiPolygon':
        return geom
    return unary_union([p for p in geom.geoms if p.area >= min_area])


def view(lon0, lat0, lon1, lat1, tol, min_area):
    geom = drop_specks(land(lon0, lat0, lon1, lat1), min_area)
    geom = geom.simplify(tol, preserve_topology=True)
    width = 1000.0
    scale = width / (lon1 - lon0)
    top = merc(lat1)
    height = (top - merc(lat0)) * scale

    def project(lon, lat):
        return ((lon - lon0) * scale, (top - merc(lat)) * scale)

    return {
        'bbox': [lon0, lat0, lon1, lat1],
        'width': width,
        'height': round(height, 1),
        'd': path(geom, project, 1),
    }


def main():
    os.makedirs(OUT, exist_ok=True)
    files = {'hero-boston.json': hero()}
    for name, (lon0, lat0, lon1, lat1, tol, min_area) in VIEWS.items():
        files[f'map-{name}.json'] = view(lon0, lat0, lon1, lat1, tol, min_area)
    for name, data in files.items():
        with open(os.path.join(OUT, name), 'w') as f:
            json.dump(data, f, separators=(',', ':'))
        print(f'{name:24} {os.path.getsize(os.path.join(OUT, name)) / 1024:7.1f} KB')


if __name__ == '__main__':
    main()
