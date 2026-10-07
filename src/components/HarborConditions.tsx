'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

// NOAA CO-OPS station 8443970, Boston, MA. The visitor's browser asks NOAA
// directly; nothing here needs a server, so it works on the static site.
const STATION = '8443970';
const API = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const STATION_PAGE = `https://tidesandcurrents.noaa.gov/stationhome.html?id=${STATION}`;
const REFRESH_MS = 6 * 60 * 1000; // NOAA posts a new reading every six minutes.

const query = (params: Record<string, string>) =>
  `${API}?${new URLSearchParams({
    station: STATION,
    time_zone: 'lst_ldt',
    units: 'english',
    format: 'json',
    application: 'jasondank.com',
    ...params,
  })}`;

interface Wind {
  t: string;
  speed: number;
  gust: number;
  dir: number;
  from: string;
}
interface Reading {
  t: string;
  v: number;
}
interface TideEvent extends Reading {
  type: 'H' | 'L';
}
interface Conditions {
  wind?: Wind;
  level?: Reading;
  temp?: Reading;
  curve?: Reading[];
  events?: TideEvent[];
}

async function getJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(String(res.status));
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json;
}

async function loadConditions(): Promise<Conditions> {
  const [wind, level, temp, curve, events] = await Promise.allSettled([
    getJson(query({ product: 'wind', date: 'latest' })),
    getJson(query({ product: 'water_level', date: 'latest', datum: 'MLLW' })),
    getJson(query({ product: 'water_temperature', date: 'latest' })),
    getJson(query({ product: 'predictions', date: 'today', datum: 'MLLW', interval: '30' })),
    getJson(query({ product: 'predictions', begin_date: today(), range: '48', datum: 'MLLW', interval: 'hilo' })),
  ]);
  const out: Conditions = {};
  if (wind.status === 'fulfilled' && wind.value.data?.[0]) {
    const w = wind.value.data[0];
    const speed = parseFloat(w.s);
    if (Number.isFinite(speed)) {
      out.wind = { t: w.t, speed, gust: parseFloat(w.g), dir: parseFloat(w.d), from: w.dr };
    }
  }
  const reading = (r: PromiseSettledResult<{ data?: { t: string; v: string }[] }>) => {
    if (r.status !== 'fulfilled' || !r.value.data?.[0]) return undefined;
    const v = parseFloat(r.value.data[0].v);
    return Number.isFinite(v) ? { t: r.value.data[0].t, v } : undefined;
  };
  out.level = reading(level);
  out.temp = reading(temp);
  if (curve.status === 'fulfilled' && Array.isArray(curve.value.predictions)) {
    out.curve = curve.value.predictions.map((p: { t: string; v: string }) => ({ t: p.t, v: parseFloat(p.v) }));
  }
  if (events.status === 'fulfilled' && Array.isArray(events.value.predictions)) {
    out.events = events.value.predictions.map((p: { t: string; v: string; type: 'H' | 'L' }) => ({
      t: p.t,
      v: parseFloat(p.v),
      type: p.type,
    }));
  }
  return out;
}

/** Today's date in Boston, as NOAA wants it: yyyyMMdd. */
function today() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts.replaceAll('-', '');
}

/** Boston wall-clock time now, as "yyyy-MM-dd HH:mm" to compare with NOAA's stamps. */
function bostonNow() {
  const f = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => f.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

/** "2026-10-07 14:13" → "2:13 PM". NOAA stamps are already Boston local time. */
function clock(t: string) {
  const [h, m] = t.slice(11, 16).split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

const minutes = (t: string) => {
  const [h, m] = t.slice(11, 16).split(':').map(Number);
  return h * 60 + m;
};

type State = { status: 'loading' } | { status: 'ready'; data: Conditions } | { status: 'down' };

export default function HarborConditions() {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let live = true;
    const run = () =>
      loadConditions().then(
        (data) => {
          if (!live) return;
          const any = data.wind || data.level || data.temp || data.curve;
          setState(any ? { status: 'ready', data } : { status: 'down' });
        },
        () => live && setState({ status: 'down' }),
      );
    run();
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') run();
    }, REFRESH_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, []);

  const data = state.status === 'ready' ? state.data : undefined;
  const updated = data?.level?.t ?? data?.wind?.t;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="conditions-heading" className="flex items-center gap-2.5 text-xl font-bold sm:text-2xl">
          <span className="relative flex h-2.5 w-2.5" aria-hidden>
            {state.status === 'ready' && (
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-signal opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${state.status === 'ready' ? 'bg-signal' : 'bg-muted'}`}
            />
          </span>
          Boston Harbor, right now
        </h2>
        <a
          href={STATION_PAGE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted underline decoration-border underline-offset-4 hover:text-foreground"
        >
          NOAA station {STATION}
          {updated ? ` · ${clock(updated)}` : ''}
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>

      {state.status === 'down' ? (
        <p className="rounded-md border border-dashed border-border px-5 py-6 text-sm text-muted">
          NOAA isn&apos;t answering right now. The{' '}
          <a href={STATION_PAGE} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">
            Boston station page
          </a>{' '}
          has the latest wind and tide.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3" aria-busy={state.status === 'loading'}>
          <WindTile wind={data?.wind} loading={state.status === 'loading'} />
          <TideTile data={data} loading={state.status === 'loading'} />
          <TempTile temp={data?.temp} loading={state.status === 'loading'} />
        </div>
      )}
    </div>
  );
}

function Tile({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex flex-col gap-3 bg-card p-4 sm:min-h-[9.5rem] sm:p-5 ${className}`}>
      <p className="text-xs uppercase tracking-[0.12em] text-muted">{label}</p>
      {children}
    </div>
  );
}

const Placeholder = ({ loading }: { loading: boolean }) => (
  <p className="text-sm text-muted">{loading ? 'Checking the harbor…' : 'No reading right now.'}</p>
);

function WindTile({ wind, loading }: { wind?: Wind; loading: boolean }) {
  return (
    <Tile label="Wind">
      {wind ? (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <WindRose dir={wind.dir} />
          <div>
            <p className="text-3xl font-bold tabular-nums leading-none">
              {Math.round(wind.speed)}
              <span className="ml-1 text-base font-normal text-muted">kn</span>
            </p>
            <p className="mt-1.5 text-sm text-muted">
              from the {wind.from}
              {Number.isFinite(wind.gust) && wind.gust > wind.speed ? ` · gusts ${Math.round(wind.gust)}` : ''}
            </p>
          </div>
        </div>
      ) : (
        <Placeholder loading={loading} />
      )}
    </Tile>
  );
}

/** A small rose with an arrow flying downwind, the way wind barbs read. */
function WindRose({ dir }: { dir: number }) {
  return (
    <svg viewBox="-26 -30 52 56" className="h-12 w-11 shrink-0 sm:h-14 sm:w-[3.25rem]" aria-hidden>
      <circle r="21" fill="none" stroke="var(--border)" />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1="0" y1="-21" x2="0" y2="-17" stroke="var(--muted)" transform={`rotate(${a})`} />
      ))}
      <text y="-24" textAnchor="middle" fontSize="7" fill="var(--muted)">N</text>
      <g transform={`rotate(${dir + 180})`}>
        <line x1="0" y1="14" x2="0" y2="-12" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -16 L5 -8 L-5 -8 Z" fill="var(--accent)" stroke="var(--foreground)" strokeWidth="1" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function TideTile({ data, loading }: { data?: Conditions; loading: boolean }) {
  const now = data?.level?.t ?? bostonNow();
  const next = data?.events?.find((e) => e.t > now);
  const rising = next ? next.type === 'H' : undefined;
  const height = data?.level?.v;

  return (
    <Tile label="Tide" className="order-last col-span-2 sm:order-none sm:col-span-1">
      {height !== undefined || data?.curve?.length ? (
        <>
          <div className="flex items-baseline justify-between gap-3">
            {height !== undefined ? (
              <p className="text-3xl font-bold tabular-nums leading-none">
                {height.toFixed(1)}
                <span className="ml-1 text-base font-normal text-muted">ft</span>
              </p>
            ) : (
              <span />
            )}
            {rising !== undefined && <p className="text-sm text-muted">{rising ? 'rising' : 'falling'}</p>}
          </div>
          {data?.curve && data.curve.length > 1 && <TideCurve curve={data.curve} now={now} events={data.events} />}
          {next && (
            <p className="text-xs text-muted">
              Next {next.type === 'H' ? 'high' : 'low'} {next.v.toFixed(1)} ft at {clock(next.t)}
            </p>
          )}
        </>
      ) : (
        <Placeholder loading={loading} />
      )}
    </Tile>
  );
}

/** Today's predicted tide, midnight to midnight, with a dot for now. */
function TideCurve({ curve, now, events }: { curve: Reading[]; now: string; events?: TideEvent[] }) {
  const W = 200;
  const H = 44;
  const vs = curve.map((p) => p.v);
  const lo = Math.min(...vs);
  const hi = Math.max(...vs);
  const x = (t: string) => (minutes(t) / 1440) * W;
  const y = (v: number) => H - 4 - ((v - lo) / (hi - lo || 1)) * (H - 8);
  const line = curve.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join('');
  const day = curve[0].t.slice(0, 10);
  const isToday = now.slice(0, 10) === day;
  // Where "now" sits on the predicted curve.
  const nm = minutes(now);
  const after = curve.findIndex((p) => minutes(p.t) >= nm);
  const nowV =
    after > 0
      ? curve[after - 1].v +
        ((curve[after].v - curve[after - 1].v) * (nm - minutes(curve[after - 1].t))) /
          (minutes(curve[after].t) - minutes(curve[after - 1].t) || 1)
      : curve[Math.max(after, 0)].v;

  return (
    <div className="relative h-11 w-full" aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
        <path d={`${line}L${W} ${H}L0 ${H}Z`} fill="var(--accent)" opacity="0.18" />
        <path d={line} fill="none" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {events
          ?.filter((e) => e.t.slice(0, 10) === day)
          .map((e) => (
            <line key={e.t} x1={x(e.t)} x2={x(e.t)} y1="0" y2={H} stroke="var(--border)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          ))}
      </svg>
      {/* The dot is HTML so the stretched SVG doesn't squash it into an oval. */}
      {isToday && (
        <span
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-card bg-foreground"
          style={{ left: `${(x(now) / W) * 100}%`, top: `${(y(nowV) / H) * 100}%` }}
        />
      )}
    </div>
  );
}

function TempTile({ temp, loading }: { temp?: Reading; loading: boolean }) {
  return (
    <Tile label="Water">
      {temp ? (
        <>
          <p className="text-3xl font-bold tabular-nums leading-none">
            {Math.round(temp.v)}
            <span className="ml-0.5 text-base font-normal text-muted">°F</span>
          </p>
          <p className="text-sm text-muted">Surface temperature at the gauge</p>
        </>
      ) : (
        <Placeholder loading={loading} />
      )}
    </Tile>
  );
}
