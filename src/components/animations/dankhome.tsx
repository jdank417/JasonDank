import { keyframes, fade, hide, typeOut, play, fromLeft, fromBottom, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// DankHome: an iPad on the wall. A scene lights the room, the assistant dims the
// kitchen, then the panel goes idle and the night clock fades in.
// ---------------------------------------------------------------------------

export default function dankHome(): Scene {
  const T = 14;
  const lights = [
    { name: 'Ceiling', level: '80%', color: '#ffd8a0' },
    { name: 'Floor Lamp', level: '45%', color: '#ffa65c' },
    { name: 'TV Backlight', level: '60%', color: '#a58bff' },
    { name: 'Pendants', level: '100%', dimmed: '30%', color: '#ffe2b0' },
    { name: 'Under Cabinet', level: '70%', dimmed: '30%', color: '#fff0d4' },
    { name: 'Bedside', level: '20%', color: '#ff8f6b' },
  ];
  const css = [
    fade('dh-press', [2, 4, 12, 16], 0.35),
    fade('dh-glow', [10, 24, 80, 84], 0.55),
    fade('dh-bubble', [38, 41, 68, 71]),
    typeOut('dh-type', [41, 47]),
    fade('dh-reply', [50, 53, 68, 71]),
    fade('dh-night', [72, 76, 94, 98]),
    keyframes('dh-drift', [[0, 'transform:translate(0,0)'], [80, 'transform:translate(0,0)'], [96, 'transform:translate(18px,-8px)'], [100, 'transform:translate(18px,-8px)']]),
    keyframes('dh-arc', [[0, 'stroke-dashoffset:124'], [18, 'stroke-dashoffset:124'], [26, 'stroke-dashoffset:105'], [100, 'stroke-dashoffset:105']]),
    hide('dh-t68', [21, 22, 98, 100]),
    fade('dh-t70', [21, 22, 98, 100]),
    keyframes('dh-eq', [[0, 'transform:scaleY(.35)'], [50, 'transform:scaleY(1)'], [100, 'transform:scaleY(.35)']]),
    ...lights.flatMap((light, i) => {
      const on = 10 + i * 2;
      return light.dimmed
        ? [
            keyframes(`dh-on${i}`, [[0, 'opacity:0'], [on, 'opacity:0'], [on + 3, 'opacity:1'], [52, 'opacity:1'], [55, 'opacity:.45'], [80, 'opacity:.45'], [83, 'opacity:0'], [100, 'opacity:0']]),
            fade(`dh-lv${i}`, [on, on + 3, 52, 54]),
            fade(`dh-dm${i}`, [52, 54, 80, 83]),
            hide(`dh-off${i}`, [on, on + 3, 80, 83]),
          ]
        : [fade(`dh-on${i}`, [on, on + 3, 80, 83]), fade(`dh-lv${i}`, [on, on + 3, 80, 83]), hide(`dh-off${i}`, [on, on + 3, 80, 83])];
    }),
  ];

  const tile = (i: number) => ({ x: 368 + (i % 3) * 150, y: 114 + Math.floor(i / 3) * 92 });
  const scenesRow = ['Bright', 'Relax', 'Movie', 'Good Night'];
  const circumference = 2 * Math.PI * 44;

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="dh-screen">
          <rect x="136" y="32" width="688" height="376" rx="22" />
        </clipPath>
        <radialGradient id="dh-warm" cx="0.35" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#ff9f5a" />
          <stop offset="1" stopColor="#ff9f5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dh-cool" cx="0.9" cy="0.1" r="0.6">
          <stop offset="0" stopColor="#5b5bd6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b5bd6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dh-art" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#ff6fa8" />
        </linearGradient>
      </defs>

      {/* The iPad */}
      <rect x="120" y="16" width="720" height="408" rx="36" fill="#0a0a0a" />
      <rect x="120.5" y="16.5" width="719" height="407" rx="35.5" fill="none" stroke="#3a3a3a" />
      <g clipPath="url(#dh-screen)">
        <rect x="136" y="32" width="688" height="376" fill="#0b0d14" />
        <rect x="136" y="32" width="688" height="376" fill="url(#dh-cool)" />
        <rect x="136" y="32" width="688" height="376" fill="url(#dh-warm)" style={play('dh-glow', T, { opacity: 0.55 })} />

        {/* Header: clock, rooms, weather, assistant and settings */}
        <text x="160" y="80" fontSize="32" fontWeight="300" fill="#fff">9:41</text>
        <text x="160" y="98" fontSize="11" fill="#fff" fillOpacity="0.6">Friday, October 9</text>
        {[
          { label: 'All', x: 290, w: 44, on: true },
          { label: 'Living Room', x: 342, w: 100 },
          { label: 'Kitchen', x: 450, w: 72 },
          { label: 'Bedroom', x: 530, w: 80 },
        ].map((room) => (
          <g key={room.label}>
            <rect x={room.x} y="58" width={room.w} height="28" rx="14" fill="#fff" fillOpacity={room.on ? 1 : 0.1} />
            <text x={room.x + room.w / 2} y="76" fontSize="12" textAnchor="middle" fill={room.on ? '#000' : '#fff'}>
              {room.label}
            </text>
          </g>
        ))}
        <circle cx="682" cy="72" r="8" fill="#ffd25a" />
        <text x="698" y="78" fontSize="18" fill="#fff">64°</text>
        <circle cx="764" cy="72" r="16" fill="#fff" fillOpacity="0.12" />
        <path d="M764 63 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#fff" />
        <circle cx="802" cy="72" r="16" fill="#fff" fillOpacity="0.12" />
        <circle cx="802" cy="72" r="6" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="3 2" />

        {/* Thermostat */}
        <rect x="156" y="114" width="196" height="160" rx="18" fill="#fff" fillOpacity="0.07" />
        <circle cx="254" cy="184" r="44" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="8" />
        <circle
          cx="254"
          cy="184"
          r="44"
          fill="none"
          stroke="#ff9f43"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          transform="rotate(-90 254 184)"
          style={play('dh-arc', T, { strokeDashoffset: 105 })}
        />
        <text x="254" y="193" fontSize="26" fontWeight="300" fill="#fff" textAnchor="middle" style={play('dh-t68', T, { opacity: 0 })}>68°</text>
        <text x="254" y="193" fontSize="26" fontWeight="300" fill="#fff" textAnchor="middle" style={play('dh-t70', T, { opacity: 1 })}>70°</text>
        <text x="254" y="252" fontSize="11" fontWeight="600" fill="#ff9f43" textAnchor="middle">HEATING</text>

        {/* Now playing */}
        <rect x="156" y="286" width="196" height="106" rx="18" fill="#fff" fillOpacity="0.07" />
        <rect x="172" y="302" width="48" height="48" rx="8" fill="url(#dh-art)" />
        <text x="232" y="320" fontSize="13" fontWeight="600" fill="#fff">Harbor Lights</text>
        <text x="232" y="338" fontSize="11" fill="#fff" fillOpacity="0.6">Apple Music</text>
        {[16, 22, 12, 20, 15, 18].map((h, i) => (
          <rect
            key={i}
            x={174 + i * 8}
            y={380 - h}
            width="5"
            height={h}
            rx="2"
            fill="#fff"
            fillOpacity="0.75"
            style={play('dh-eq', 0.7 + i * 0.13, { ...fromBottom, animationDelay: `${-i * 0.2}s` })}
          />
        ))}

        {/* Lights */}
        {lights.map((light, i) => {
          const { x, y } = tile(i);
          return (
            <g key={light.name}>
              <rect x={x} y={y} width="138" height="80" rx="16" fill="#fff" fillOpacity="0.07" />
              <circle cx={x + 24} cy={y + 24} r="9" fill="#fff" fillOpacity="0.22" />
              <g style={play(`dh-on${i}`, T, { opacity: 1 })}>
                <rect x={x} y={y} width="138" height="80" rx="16" fill={light.color} fillOpacity="0.22" stroke={light.color} strokeOpacity="0.55" />
                <circle cx={x + 24} cy={y + 24} r="16" fill={light.color} fillOpacity="0.25" />
                <circle cx={x + 24} cy={y + 24} r="9" fill={light.color} />
              </g>
              <text x={x + 16} y={y + 56} fontSize="13" fontWeight="600" fill="#fff">{light.name}</text>
              <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-off${i}`, T, { opacity: 0 })}>Off</text>
              <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-lv${i}`, T, { opacity: light.dimmed ? 0 : 1 })}>{light.level}</text>
              {light.dimmed && (
                <text x={x + 16} y={y + 71} fontSize="11" fill="#fff" fillOpacity="0.6" style={play(`dh-dm${i}`, T, { opacity: 1 })}>{light.dimmed}</text>
              )}
            </g>
          );
        })}

        {/* Scene buttons; Relax gets tapped to start the loop */}
        {scenesRow.map((name, i) => (
          <g key={name}>
            <rect x={368 + i * 112} y="300" width="104" height="36" rx="18" fill="#fff" fillOpacity="0.08" />
            {name === 'Relax' && (
              <rect x={368 + i * 112} y="300" width="104" height="36" rx="18" fill="#7dd3fc" style={play('dh-press', T, { opacity: 0 })} />
            )}
            <text x={368 + i * 112 + 52} y="322" fontSize="12" fill="#fff" textAnchor="middle">{name}</text>
          </g>
        ))}

        {/* The assistant */}
        <g style={play('dh-bubble', T, { opacity: 1 })}>
          <rect x="368" y="346" width="440" height="48" rx="24" fill="#fff" fillOpacity="0.1" />
          <path d="M390 356 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5z" fill="#7dd3fc" />
          <clipPath id="dh-typing">
            <rect x="410" y="352" width="200" height="20" style={play('dh-type', T, fromLeft)} />
          </clipPath>
          <text x="410" y="366" fontSize="12" fill="#fff" clipPath="url(#dh-typing)">“Dim the kitchen to 30%”</text>
          <text x="410" y="384" fontSize="11" fill="#86efac" style={play('dh-reply', T, { opacity: 1 })}>Adjusted Pendants and Under Cabinet.</text>
        </g>

        {/* Idle: the night clock */}
        <g style={play('dh-night', T, { opacity: 0 })}>
          <rect x="136" y="32" width="688" height="376" fill="#000" />
          <g style={play('dh-drift', T)}>
            <text x="480" y="246" fontSize="120" fontWeight="200" fill="#ff8c59" fillOpacity="0.65" textAnchor="middle">9:42</text>
            <text x="480" y="284" fontSize="16" fill="#ff8c59" fillOpacity="0.5" textAnchor="middle">Friday, October 9 · 64°</text>
          </g>
        </g>
      </g>
    </g>
  );
  return { css, svg };
}

