import { fade, fromLeft, hide, keyframes, play, type Scene, type Stop } from './kit';

// ---------------------------------------------------------------------------
// Dank's Squash Pie Monitor: a tile per Linux host, refreshed over SSH. Each
// poll moves the bars and numbers; one host drops off for a while.
// ---------------------------------------------------------------------------

/** CPU, memory and disk at each of the four polls in a loop. */
const HOSTS: { name: string; vlan: string; polls: number[][] }[] = [
  { name: 'pi-field-01', vlan: 'VLAN 20', polls: [[12, 34, 41], [38, 36, 41], [21, 35, 41], [9, 34, 41]] },
  { name: 'pi-field-02', vlan: 'VLAN 20', polls: [[64, 58, 72], [71, 60, 72], [55, 59, 72], [68, 61, 72]] },
  { name: 'pi-arena-01', vlan: 'VLAN 30', polls: [[5, 22, 18], [7, 22, 18], [31, 25, 18], [6, 23, 18]] },
  { name: 'pi-arena-02', vlan: 'VLAN 30', polls: [[27, 47, 55], [19, 46, 55], [44, 49, 56], [25, 47, 56]] },
  { name: 'pi-lab-01', vlan: 'VLAN 40', polls: [[83, 71, 90], [91, 74, 90], [88, 73, 90], [79, 72, 90]] },
  { name: 'pi-lab-02', vlan: 'VLAN 40', polls: [[16, 30, 37], [22, 31, 37], [14, 30, 37], [18, 30, 37]] },
];
const METRICS = ['CPU', 'MEM', 'DISK'];
const POLLS = [0, 25, 50, 75];
const OFFLINE = 4;
/** pi-lab-01 misses the third poll. */
const DOWN = [48, 74];

const color = (value: number) => (value >= 85 ? '#ef4444' : value >= 65 ? '#f59e0b' : 'var(--signal)');

export default function monitor(): Scene {
  const T = 12;

  // A bar moves to its new width at each poll.
  const bar = (values: number[]): Stop[] => {
    const stops: Stop[] = [];
    POLLS.forEach((at, p) => {
      stops.push([at, `transform:scaleX(${values[(p + POLLS.length - 1) % POLLS.length] / 100})`]);
      stops.push([at + 3, `transform:scaleX(${values[p] / 100})`]);
    });
    stops.push([100, `transform:scaleX(${values[POLLS.length - 1] / 100})`]);
    return stops;
  };
  // Which poll's number is showing.
  const reading = (p: number) => fade(`dm-p${p}`, [POLLS[p], POLLS[p] + 1, (POLLS[p + 1] ?? 100) - 0.5, POLLS[p + 1] ?? 100]);

  const css = [
    ...POLLS.slice(1).map((_, k) => reading(k + 1)),
    // The first poll's numbers also show across the wrap.
    keyframes('dm-p0', [[0, 'opacity:1'], [24.5, 'opacity:1'], [25, 'opacity:0'], [100, 'opacity:0']]),
    ...HOSTS.flatMap((host, h) => METRICS.map((_, m) => keyframes(`dm-bar${h}-${m}`, bar(host.polls.map((poll) => poll[m]))))),
    keyframes('dm-ping', [[0, 'transform:scale(1);opacity:.9'], [8, 'transform:scale(2.6);opacity:0'], [25, 'transform:scale(2.6);opacity:0'], [25.01, 'transform:scale(1);opacity:.9'], [33, 'transform:scale(2.6);opacity:0'], [50, 'transform:scale(2.6);opacity:0'], [50.01, 'transform:scale(1);opacity:.9'], [58, 'transform:scale(2.6);opacity:0'], [75, 'transform:scale(2.6);opacity:0'], [75.01, 'transform:scale(1);opacity:.9'], [83, 'transform:scale(2.6);opacity:0'], [100, 'transform:scale(2.6);opacity:0']]),
    fade('dm-down', [DOWN[0], DOWN[0] + 2, DOWN[1] - 2, DOWN[1]]),
    hide('dm-up', [DOWN[0], DOWN[0] + 2, DOWN[1] - 2, DOWN[1]]),
    keyframes('dm-spin', [[0, 'transform:rotate(0deg)'], [100, 'transform:rotate(360deg)']]),
  ];

  const svg = (
    <g>
      <rect x="40.5" y="20.5" width="879" height="399" rx="14" className="fill-background stroke-border" />
      <circle cx="62" cy="40" r="5" fill="#ff5f57" />
      <circle cx="78" cy="40" r="5" fill="#febc2e" />
      <circle cx="94" cy="40" r="5" fill="#28c840" />
      <text x="480" y="44" fontSize="12" fontWeight="700" textAnchor="middle" className="fill-foreground">Dank’s Squash Pie Monitor</text>
      <line x1="40" x2="920" y1="58" y2="58" className="stroke-border" />
      <g transform="translate(66 80)">
        <circle r="7" fill="none" strokeWidth="2.5" strokeDasharray="30 14" stroke="var(--accent)" style={play('dm-spin', 1.2, { transformBox: 'fill-box', transformOrigin: 'center' }, 'linear')} />
      </g>
      <text x="84" y="84" fontSize="12" className="fill-muted">Polling 6 hosts over SSH</text>
      <text x="896" y="84" fontSize="12" textAnchor="end" className="fill-muted" style={play('dm-up', T, { opacity: 1 })}>6 online</text>
      <text x="896" y="84" fontSize="12" textAnchor="end" fill="#ef4444" style={play('dm-down', T, { opacity: 0 })}>5 online · 1 offline</text>

      {HOSTS.map((host, h) => {
        const x = 60 + (h % 3) * 288;
        const y = 102 + Math.floor(h / 3) * 156;
        const down = h === OFFLINE;
        return (
          <g key={host.name}>
            <rect x={x + 0.5} y={y + 0.5} width="263" height="143" rx="12" className="fill-card stroke-border" />
            {down && <rect x={x + 0.5} y={y + 0.5} width="263" height="143" rx="12" fill="#ef4444" fillOpacity="0.08" stroke="#ef4444" strokeWidth="2" style={play('dm-down', T, { opacity: 0 })} />}
            <circle cx={x + 20} cy={y + 22} r="5" className="fill-signal" style={down ? play('dm-up', T, { opacity: 1 }) : undefined} />
            <circle cx={x + 20} cy={y + 22} r="5" className="fill-signal" style={play('dm-ping', T, { transformBox: 'fill-box', transformOrigin: 'center' }, 'ease-out')} />
            {down && <circle cx={x + 20} cy={y + 22} r="5" fill="#ef4444" style={play('dm-down', T, { opacity: 0 })} />}
            <text x={x + 34} y={y + 27} fontSize="13" fontWeight="700" className="fill-foreground">{host.name}</text>
            <text x={x + 248} y={y + 27} fontSize="10" textAnchor="end" className="fill-muted">{host.vlan}</text>

            <g style={down ? play('dm-up', T, { opacity: 1 }) : undefined}>
              {METRICS.map((metric, m) => {
                const top = y + 48 + m * 24;
                return (
                  <g key={metric}>
                    <text x={x + 16} y={top + 9} fontSize="10" className="fill-muted">{metric}</text>
                    <rect x={x + 54} y={top} width="150" height="10" rx="5" className="fill-border" />
                    <rect
                      x={x + 54}
                      y={top}
                      width="150"
                      height="10"
                      rx="5"
                      fill={color(host.polls[1][m])}
                      style={play(`dm-bar${h}-${m}`, T, { ...fromLeft, transform: `scaleX(${host.polls[1][m] / 100})` })}
                    />
                    {POLLS.map((_, p) => (
                      <text key={p} x={x + 248} y={top + 9} fontSize="11" fontWeight="600" textAnchor="end" className="fill-foreground" style={play(`dm-p${p}`, T, { opacity: p === 1 ? 1 : 0 })}>
                        {`${host.polls[p][m]}%`}
                      </text>
                    ))}
                  </g>
                );
              })}
              <text x={x + 16} y={y + 131} fontSize="10" className="fill-muted">{`up ${3 + ((h * 7) % 19)} days`}</text>
              <text x={x + 248} y={y + 131} fontSize="10" textAnchor="end" className="fill-muted">updated just now</text>
            </g>
            {down && (
              <g style={play('dm-down', T, { opacity: 0 })}>
                <text x={x + 132} y={y + 84} fontSize="14" fontWeight="700" textAnchor="middle" fill="#ef4444">No response</text>
                <text x={x + 132} y={y + 104} fontSize="11" textAnchor="middle" className="fill-muted">retrying over SSH…</text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
  return { css, svg };
}
