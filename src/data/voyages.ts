// Places for the "Where I've sailed" map on /sailing. Coordinates for the
// delivery stops, the Charles River boathouses, Squantum and PJYC come from
// Jason's Navionics log; club and race venues not in the log are placed at
// their harbors. Personal pins (home and the like) are deliberately left out.
import type { BurgeeKey } from '@/components/Burgee';

export type MapViewId = 'east-coast' | 'boston' | 'cape' | 'long-island';

export interface MapView {
  id: MapViewId;
  label: string;
  blurb: string;
  /** [west, south, east, north], matching public/charts/map-<id>.json. */
  bbox: [number, number, number, number];
  /** viewBox height for a width of 1000 (Mercator), from the same file. */
  height: number;
  /** Water names, placed like the italic labels on a chart. `wide` ones only show from sm up. */
  waters: { name: string; lat: number; lon: number; wide?: boolean }[];
}

export const mapViews: MapView[] = [
  {
    id: 'east-coast',
    label: 'East Coast',
    blurb: 'Moving a motor yacht north from Florida to Long Island in May and June 2023, mostly on the Intracoastal Waterway.',
    bbox: [-82.6, 24.9, -69.4, 43.4],
    height: 1707.9,
    waters: [
      { name: 'Atlantic Ocean', lat: 31.0, lon: -76.0 },
      { name: 'Chesapeake Bay', lat: 37.9, lon: -76.15 },
    ],
  },
  {
    id: 'boston',
    label: 'Boston & Marblehead',
    blurb: 'Home waters: the Charles River boathouses, Dorchester Bay, MBSA racing in the harbor, and Marblehead.',
    bbox: [-71.2, 42.22, -70.74, 42.6],
    height: 1118.9,
    waters: [
      { name: 'Massachusetts Bay', lat: 42.39, lon: -70.83 },
      { name: 'Boston Harbor', lat: 42.322, lon: -71.0 },
      { name: 'Charles River', lat: 42.3475, lon: -71.112, wide: true },
    ],
  },
  {
    id: 'cape',
    label: 'Cape & Islands',
    blurb: 'Figawi, Hyannis to Nantucket, won aboard Fawn Libowitz in 2026.',
    bbox: [-70.62, 41.18, -69.88, 41.76],
    height: 1046.0,
    waters: [
      { name: 'Nantucket Sound', lat: 41.47, lon: -70.25 },
      { name: 'Atlantic Ocean', lat: 41.4, lon: -69.98 },
    ],
  },
  {
    id: 'long-island',
    label: 'Long Island',
    blurb: 'Where it started: learn-to-sail at Westhampton, instructing at Port Jefferson, and the IOD North Americans at Fishers Island.',
    bbox: [-73.32, 40.58, -71.8, 41.4],
    height: 714.7,
    waters: [
      { name: 'Long Island Sound', lat: 41.12, lon: -72.85 },
      { name: 'Atlantic Ocean', lat: 40.66, lon: -72.3 },
    ],
  },
];

export type PlaceKind = 'club' | 'race' | 'stop';

export interface Place {
  id: string;
  name: string;
  detail: string;
  lat: number;
  lon: number;
  kind: PlaceKind;
  flags?: BurgeeKey[];
  /** Views this place is pinned on. Stops also draw the delivery route. */
  views: MapViewId[];
}

export const places: Place[] = [
  // Boston
  { id: 'cbi', name: 'Community Boating', detail: 'Charles River · fleet-certified, Monday night Laser series', lat: 42.36022, lon: -71.073676, kind: 'club', flags: ['cbi'], views: ['boston', 'east-coast'] },
  { id: 'crimson', name: 'Crimson Sailing Pavilion', detail: 'Charles River', lat: 42.360107, lon: -71.082749, kind: 'race', views: ['boston'] },
  { id: 'wentworth', name: 'Wentworth Sailing', detail: 'Captain, then President · 2022–2026', lat: 42.336585, lon: -71.094309, kind: 'club', flags: ['wit'], views: ['boston'] },
  { id: 'squantum', name: 'Squantum Yacht Club', detail: 'Quincy · Launch Chairman, Assistant Director of Adult Sailing', lat: 42.278956, lon: -71.014246, kind: 'club', flags: ['syc'], views: ['boston', 'east-coast'] },
  { id: 'mbsa', name: 'MBSA racing', detail: 'Boston Harbor · Fawn Libowitz, 1st overall Thursday series', lat: 42.33, lon: -70.975, kind: 'race', flags: ['eyc'], views: ['boston'] },
  { id: 'marblehead', name: 'Marblehead', detail: 'Eastern YC junior member · IODs Gypsey and Tango, Etchells, MRA', lat: 42.5045, lon: -70.8445, kind: 'club', flags: ['eyc', 'cyc', 'byc'], views: ['boston', 'east-coast'] },

  // Cape & Islands
  { id: 'hyannis', name: 'Hyannis', detail: 'Figawi start', lat: 41.6363, lon: -70.2781, kind: 'race', views: ['cape'] },
  { id: 'nantucket', name: 'Nantucket', detail: 'Figawi finish · won aboard Fawn Libowitz, 2026', lat: 41.2865, lon: -70.0956, kind: 'race', flags: ['eyc'], views: ['cape', 'east-coast'] },

  // Long Island
  { id: 'pjyc', name: 'Port Jefferson Yacht Club', detail: 'Instructor and race program · 2017–2023', lat: 40.950188, lon: -73.067309, kind: 'club', flags: ['pjyc'], views: ['long-island', 'east-coast'] },
  { id: 'stony-brook', name: 'Stony Brook Harbor', detail: 'North Shore, Long Island', lat: 40.920827, lon: -73.150184, kind: 'race', views: ['long-island'] },
  { id: 'westhampton', name: 'Westhampton Yacht Squadron', detail: 'First sailing · 2012–2016', lat: 40.8015, lon: -72.6995, kind: 'club', flags: ['wys'], views: ['long-island', 'east-coast'] },
  { id: 'fishers', name: 'Fishers Island', detail: 'IOD North Americans aboard Gypsey, IOD 7', lat: 41.2655, lon: -72.0165, kind: 'race', flags: ['eyc'], views: ['long-island', 'east-coast'] },
];

export interface RoutePoint {
  lat: number;
  lon: number;
  /** A named stop from the log. Unnamed points only shape the line. */
  name?: string;
  state?: string;
}

// The 2023 delivery, south to north, in the order the log puts the stops.
// Unnamed points keep the line in the water where a straight segment would
// cut across land (the C&D Canal, the Jersey shore, New York Harbor).
export const delivery: RoutePoint[] = [
  { lat: 26.266224, lon: -80.083027, name: 'Lighthouse Point', state: 'FL' },
  { lat: 27.18822, lon: -80.206361, name: 'Hooker Cove', state: 'FL' },
  { lat: 28.349413, lon: -80.72121, name: 'Merritt Island Bridge', state: 'FL' },
  { lat: 29.71768, lon: -81.241134, name: 'Fort Matanzas', state: 'FL' },
  { lat: 29.89298, lon: -81.307418, name: 'St. Augustine', state: 'FL' },
  { lat: 30.398112, lon: -81.458707, name: 'Sisters Creek', state: 'FL' },
  { lat: 31.166505, lon: -81.414529, name: 'Morning Star Marinas', state: 'GA' },
  { lat: 31.770281, lon: -80.7258 },
  { lat: 32.606253, lon: -80.283927, name: 'North Edisto River', state: 'SC' },
  { lat: 33.008263, lon: -79.58927 },
  { lat: 33.681126, lon: -79.041328, name: 'Osprey Marina', state: 'SC' },
  { lat: 34.037236, lon: -77.892653, name: 'Carolina Beach', state: 'NC' },
  { lat: 34.721255, lon: -76.704992, name: 'Morehead City', state: 'NC' },
  { lat: 35.284405, lon: -76.623446, name: 'Campbell Creek', state: 'NC' },
  { lat: 35.913435, lon: -75.902577 },
  { lat: 36.347832, lon: -75.949341, name: 'Coinjock', state: 'NC' },
  { lat: 37.007262, lon: -76.455108, name: 'James River Bridge', state: 'VA' },
  { lat: 37.017506, lon: -76.341431, name: 'Hampton', state: 'VA' },
  { lat: 38.541722, lon: -76.359621 },
  { lat: 39.527, lon: -75.81 },
  { lat: 39.582303, lon: -75.485236, name: 'Salem Creek', state: 'NJ' },
  { lat: 38.95082, lon: -74.905369, name: 'Cape May', state: 'NJ' },
  { lat: 39.35, lon: -74.33 },
  { lat: 39.77, lon: -74.03 },
  { lat: 40.446102, lon: -73.999804, name: 'Sandy Hook', state: 'NJ' },
  { lat: 40.606, lon: -74.045 },
  { lat: 40.705, lon: -74.005 },
  { lat: 40.778, lon: -73.925 },
  { lat: 40.805, lon: -73.79 },
  { lat: 40.97, lon: -73.3 },
  { lat: 40.96, lon: -73.075, name: 'Port Jefferson', state: 'NY' },
];

/** The Charles is too narrow for the shoreline data, so it is drawn as a line. */
export const charlesRiver: [number, number][] = [
  [42.3705, -71.0585],
  [42.3685, -71.0635],
  [42.3625, -71.0715],
  [42.3602, -71.0775],
  [42.3595, -71.0845],
  [42.3555, -71.0915],
  [42.3525, -71.1035],
  [42.3535, -71.1135],
  [42.3605, -71.1235],
];
