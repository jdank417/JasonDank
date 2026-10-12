import { keyframes, fade, hide, typeOut, play, fromLeft, fromBottom, SYSTEM_FONT, type Scene } from './kit';

// ---------------------------------------------------------------------------
// DankHome: an iPad on the wall and the iPhone beside it, showing the same
// house. A scene lights the room, one sentence turns off the kitchen and locks
// the door without waiting on the model, the assistant changes the app's own
// background, and then the iPad goes idle into its night clock while the
// phone, which has no night clock, stays on its dashboard.
// ---------------------------------------------------------------------------

export default function dankHome(): Scene {
  const T = 20;
  const lights = [
    { name: 'Ceiling', level: '80%', color: '#ffd8a0' },
    { name: 'Floor Lamp', level: '45%', color: '#ffa65c' },
    { name: 'TV Backlight', level: '60%', color: '#a58bff' },
    { name: 'Pendants', level: '100%', color: '#ffe2b0', kitchen: true },
    { name: 'Under Cabinet', level: '70%', color: '#fff0d4', kitchen: true },
    { name: 'Bedside', level: '20%', color: '#ff8f6b' },
  ];
  const status = [
    { text: 'All lights off · Heating to 70°', style: play('dh-s0', T, { opacity: 0 }) },
    { text: '6 lights on · 412 W', style: play('dh-s1', T, { opacity: 0 }) },
    { text: '4 lights on · Doors locked · 236 W', style: play('dh-s2', T, { opacity: 1 }) },
  ];
  const css = [
    fade('dh-press', [1, 3, 8, 11], 0.35),
    fade('dh-glow', [6, 18, 94, 98], 0.55),
    fade('dh-ocean', [60, 64, 94, 98]),
    hide('dh-s0', [7, 9, 96, 99]),
    fade('dh-s1', [7, 9, 39, 41]),
    fade('dh-s2', [39, 41, 96, 99]),
    fade('dh-bubble1', [24, 27, 50, 53]),
    typeOut('dh-type1', [27, 35]),
    fade('dh-reply1', [38, 41, 50, 53]),
    fade('dh-bubble2', [53, 56, 76, 79]),
    typeOut('dh-type2', [56, 60]),
    fade('dh-reply2', [62, 65, 76, 79]),
    fade('dh-night', [80, 84, 94, 98]),
    keyframes('dh-drift', [[0, 'transform:translate(0,0)'], [84, 'transform:translate(0,0)'], [96, 'transform:translate(18px,-8px)'], [100, 'transform:translate(18px,-8px)']]),
    keyframes('dh-arc', [[0, 'stroke-dashoffset:124'], [12, 'stroke-dashoffset:124'], [20, 'stroke-dashoffset:105'], [100, 'stroke-dashoffset:105']]),
    hide('dh-t68', [15, 16, 98, 100]),
    fade('dh-t70', [15, 16, 98, 100]),
    keyframes('dh-eq', [[0, 'transform:scaleY(.35)'], [50, 'transform:scaleY(1)'], [100, 'transform:scaleY(.35)']]),
    ...lights.flatMap((light, i) => {
      const on = 6 + i * 2;
      const off: [number, number] = light.kitchen ? [38, 40] : [95, 98];
      return [
        fade(`dh-on${i}`, [on, on + 3, ...off]),
        fade(`dh-lv${i}`, [on, on + 3, ...off]),
        hide(`dh-off${i}`, [on, on + 3, ...off]),
      ];
    }),
  ];

  const tile = (i: number) => ({ x: 368 + (i % 3) * 150, y: 114 + Math.floor(i / 3) * 92 });
  const phoneTile = (i: number) => ({ x: 706 + (i % 2) * 85, y: 142 + Math.floor(i / 2) * 58 });
  const scenesRow = ['Bright', 'Relax', 'Movie', 'Good Night'];
  const circumference = 2 * Math.PI * 44;
  const sparkle = (x: number, y: number, s = 1, fill = '#fff') => (
    <path
      d={`M${x} ${y - 9 * s} l${2.5 * s} ${6.5 * s} ${6.5 * s} ${2.5 * s} ${-6.5 * s} ${2.5 * s} ${-2.5 * s} ${6.5 * s} ${-2.5 * s} ${-6.5 * s} ${-6.5 * s} ${-2.5 * s} ${6.5 * s} ${-2.5 * s}z`}
      fill={fill}
    />
  );
  // A light's on, level and off states, shared by the iPad and iPhone tiles so both show the same house.
  const lightStates = (i: number, x: number, y: number, size: 'pad' | 'phone') => {
    const light = lights[i];
    const pad = size === 'pad';
    const w = pad ? 138 : 79;
    const h = pad ? 80 : 50;
    const r = pad ? 16 : 11;
    const icon = pad ? { cx: x + 24, cy: y + 24, r: 9, halo: 16 } : { cx: x + 14, cy: y + 15, r: 6, halo: 10 };
    const nameY = pad ? y + 56 : y + 34;
    const levelY = pad ? y + 71 : y + 45;
    const textX = pad ? x + 16 : x + 9;
    const nameSize = pad ? 13 : 9;
    const levelSize = pad ? 11 : 8;
    const kitchenOff = light.kitchen;
    return (
      <g key={`${size}-${light.name}`}>
        <rect x={x} y={y} width={w} height={h} rx={r} fill="#fff" fillOpacity="0.07" />
        <circle cx={icon.cx} cy={icon.cy} r={icon.r} fill="#fff" fillOpacity="0.22" />
        <g style={play(`dh-on${i}`, T, { opacity: kitchenOff ? 0 : 1 })}>
          <rect x={x} y={y} width={w} height={h} rx={r} fill={light.color} fillOpacity="0.22" stroke={light.color} strokeOpacity="0.55" />
          <circle cx={icon.cx} cy={icon.cy} r={icon.halo} fill={light.color} fillOpacity="0.25" />
          <circle cx={icon.cx} cy={icon.cy} r={icon.r} fill={light.color} />
        </g>
        <text x={textX} y={nameY} fontSize={nameSize} fontWeight="600" fill="#fff">{light.name}</text>
        <text x={textX} y={levelY} fontSize={levelSize} fill="#fff" fillOpacity="0.6" style={play(`dh-off${i}`, T, { opacity: kitchenOff ? 1 : 0 })}>Off</text>
        <text x={textX} y={levelY} fontSize={levelSize} fill="#fff" fillOpacity="0.6" style={play(`dh-lv${i}`, T, { opacity: kitchenOff ? 0 : 1 })}>{light.level}</text>
      </g>
    );
  };
  const statusLine = (x: number, y: number, fontSize: number) =>
    status.map((s) => (
      <text key={s.text} x={x} y={y} fontSize={fontSize} fill="#fff" fillOpacity="0.6" style={s.style}>{s.text}</text>
    ));

  const svg = (
    <g fontFamily={SYSTEM_FONT}>
      <defs>
        <clipPath id="dh-screen">
          <rect x="136" y="32" width="688" height="376" rx="22" />
        </clipPath>
        <clipPath id="dh-phone-screen">
          <rect x="694" y="24" width="176" height="392" rx="28" />
        </clipPath>
        <radialGradient id="dh-warm" cx="0.35" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#ff9f5a" />
          <stop offset="1" stopColor="#ff9f5a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dh-cool" cx="0.9" cy="0.1" r="0.6">
          <stop offset="0" stopColor="#5b5bd6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b5bd6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dh-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c4a6e" />
          <stop offset="0.6" stopColor="#0e7490" />
          <stop offset="1" stopColor="#134e4a" />
        </linearGradient>
        <linearGradient id="dh-art" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cff" />
          <stop offset="1" stopColor="#ff6fa8" />
        </linearGradient>
      </defs>

      {/* The iPad, drawn at full size and scaled to share the frame with the phone */}
      <g transform="translate(54 56) scale(0.82) translate(-120 -16)">
        <rect x="120" y="16" width="720" height="408" rx="36" fill="#0a0a0a" />
        <rect x="120.5" y="16.5" width="719" height="407" rx="35.5" fill="none" stroke="#3a3a3a" />
        <g clipPath="url(#dh-screen)">
          <rect x="136" y="32" width="688" height="376" fill="#0b0d14" />
          <rect x="136" y="32" width="688" height="376" fill="url(#dh-cool)" />
          {/* “Switch to the ocean background” */}
          <g style={play('dh-ocean', T, { opacity: 1 })}>
            <rect x="136" y="32" width="688" height="376" fill="url(#dh-sea)" />
            {[300, 340, 380].map((y, i) => (
              <path
                key={y}
                d={`M136 ${y} q43 -10 86 0 t86 0 t86 0 t86 0 t86 0 t86 0 t86 0 t86 0`}
                fill="none"
                stroke="#a5f3fc"
                strokeOpacity={0.12 + i * 0.04}
                strokeWidth="2"
              />
            ))}
          </g>
          <rect x="136" y="32" width="688" height="376" fill="url(#dh-warm)" style={play('dh-glow', T, { opacity: 0.55 })} />

          {/* Header: clock, the status line under it, rooms, weather, assistant and settings */}
          <text x="160" y="80" fontSize="32" fontWeight="300" fill="#fff">9:41</text>
          {statusLine(160, 98, 11)}
          {[
            { label: 'All', x: 380, w: 44, on: true },
            { label: 'Living Room', x: 432, w: 100 },
            { label: 'Kitchen', x: 540, w: 72 },
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
          {sparkle(764, 72)}
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
          {lights.map((_, i) => {
            const { x, y } = tile(i);
            return lightStates(i, x, y, 'pad');
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

          {/* The assistant: two commands in one sentence run instantly, without the model */}
          <g style={play('dh-bubble1', T, { opacity: 0 })}>
            <rect x="368" y="346" width="440" height="48" rx="24" fill="#fff" fillOpacity="0.1" />
            {sparkle(390, 365, 1, '#7dd3fc')}
            <clipPath id="dh-typing1">
              <rect x="410" y="352" width="290" height="20" style={play('dh-type1', T, fromLeft)} />
            </clipPath>
            <text x="410" y="366" fontSize="12" fill="#fff" clipPath="url(#dh-typing1)">“Turn off the kitchen and lock the front door”</text>
            <g style={play('dh-reply1', T, { opacity: 1 })}>
              <text x="410" y="384" fontSize="11" fill="#86efac">Turned off 2 lights and locked Front Door.</text>
              <rect x="728" y="374" width="64" height="14" rx="7" fill="#86efac" fillOpacity="0.18" />
              <text x="760" y="384" fontSize="9" fontWeight="600" fill="#86efac" textAnchor="middle">INSTANT</text>
            </g>
          </g>

          {/* …and it can change the app itself */}
          <g style={play('dh-bubble2', T, { opacity: 1 })}>
            <rect x="368" y="346" width="440" height="48" rx="24" fill="#fff" fillOpacity="0.1" />
            {sparkle(390, 365, 1, '#7dd3fc')}
            <clipPath id="dh-typing2">
              <rect x="410" y="352" width="200" height="20" style={play('dh-type2', T, fromLeft)} />
            </clipPath>
            <text x="410" y="366" fontSize="12" fill="#fff" clipPath="url(#dh-typing2)">“Switch to the ocean background”</text>
            <text x="410" y="384" fontSize="11" fill="#86efac" style={play('dh-reply2', T, { opacity: 1 })}>Background set to Ocean.</text>
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

      {/* The iPhone: its own scrolling dashboard of full-width cards */}
      <g transform="translate(24 0)">
        <rect x="684" y="14" width="196" height="412" rx="36" fill="#0a0a0a" />
        <rect x="684.5" y="14.5" width="195" height="411" rx="35.5" fill="none" stroke="#3a3a3a" />
        <g clipPath="url(#dh-phone-screen)">
          <rect x="694" y="24" width="176" height="392" fill="#0b0d14" />
          <rect x="694" y="24" width="176" height="392" fill="url(#dh-cool)" />
          <rect x="694" y="24" width="176" height="392" fill="url(#dh-warm)" style={play('dh-glow', T, { opacity: 0.55 })} />
          <rect x="756" y="31" width="52" height="15" rx="7.5" fill="#000" />

          <text x="706" y="72" fontSize="15" fontWeight="700" fill="#fff">Good evening</text>
          <text x="706" y="86" fontSize="9" fill="#fff" fillOpacity="0.6">Friday, October 9</text>
          <circle cx="850" cy="67" r="10" fill="#fff" fillOpacity="0.12" />
          {sparkle(850, 67, 0.6)}
          {statusLine(706, 104, 8.5)}

          {[
            { label: 'All', x: 706, w: 28, on: true },
            { label: 'Living Room', x: 740, w: 70 },
            { label: 'Kitchen', x: 816, w: 54 },
          ].map((room) => (
            <g key={room.label}>
              <rect x={room.x} y="113" width={room.w} height="20" rx="10" fill="#fff" fillOpacity={room.on ? 1 : 0.1} />
              <text x={room.x + room.w / 2} y="126" fontSize="9" textAnchor="middle" fill={room.on ? '#000' : '#fff'}>
                {room.label}
              </text>
            </g>
          ))}

          {lights.map((_, i) => {
            const { x, y } = phoneTile(i);
            return lightStates(i, x, y, 'phone');
          })}

          <rect x="706" y="318" width="164" height="58" rx="12" fill="#fff" fillOpacity="0.07" />
          <text x="716" y="336" fontSize="9" fill="#fff" fillOpacity="0.6">Thermostat</text>
          <text x="716" y="362" fontSize="22" fontWeight="300" fill="#fff" style={play('dh-t68', T, { opacity: 0 })}>68°</text>
          <text x="716" y="362" fontSize="22" fontWeight="300" fill="#fff" style={play('dh-t70', T, { opacity: 1 })}>70°</text>
          <text x="858" y="336" fontSize="8" fontWeight="600" fill="#ff9f43" textAnchor="end">HEATING</text>

          {/* The weather card, cut off where the column scrolls on */}
          <rect x="706" y="384" width="164" height="60" rx="12" fill="#fff" fillOpacity="0.07" />
          <circle cx="722" cy="402" r="6" fill="#ffd25a" />
          <text x="734" y="406" fontSize="11" fill="#fff">64°</text>
        </g>
      </g>
    </g>
  );
  return { css, svg };
}
