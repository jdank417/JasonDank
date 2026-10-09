import { draw, drawn, fade, keyframes, play, type Scene } from './kit';

// ---------------------------------------------------------------------------
// CNN-LSTM stock prediction: the actual price draws in, the model's prediction
// follows it, Bollinger Bands and RSI fill in, and the forecast runs ahead.
// The series is made up but the indicators are computed from it properly.
// ---------------------------------------------------------------------------

const N = 90;
const TODAY = 69;
const PIPELINE = ['yfinance · OHLCV', 'RSI · MACD · Bollinger', 'Conv1D', 'LSTM', 'Dense', 'Next close'];

function series() {
  const actual = Array.from({ length: TODAY + 1 }, (_, i) => 100 + 9 * Math.sin(i / 9) + 4 * Math.sin(i / 3.1) + 0.18 * i + 1.6 * Math.sin(i * 1.3));
  // In-sample: a slightly lagged, smoothed read of the actual price.
  const predicted = actual.map((_, i) => {
    const back = actual.slice(Math.max(0, i - 3), i);
    return back.length ? 0.6 * actual[i - 1] + 0.4 * (back.reduce((a, b) => a + b, 0) / back.length) + 0.4 : actual[0];
  });
  // Out of sample: the slow trend, joined to where the prediction left off.
  const trend = (i: number) => 100 + 9 * Math.sin(i / 9) + 0.18 * i;
  const offset = predicted[TODAY] - trend(TODAY);
  const forecast = Array.from({ length: N - TODAY }, (_, k) => trend(TODAY + k) + offset * (1 - k / (N - TODAY)));

  const bands = actual.map((_, i) => {
    if (i < 11) return null;
    const window = actual.slice(i - 11, i + 1);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const sd = Math.sqrt(window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length);
    return [mean + 2 * sd, mean - 2 * sd] as const;
  });

  const rsi = actual.map((_, i) => {
    if (i < 14) return null;
    let gain = 0;
    let loss = 0;
    for (let k = i - 13; k <= i; k++) {
      const change = actual[k] - actual[k - 1];
      if (change > 0) gain += change;
      else loss -= change;
    }
    return loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  });
  return { actual, predicted, forecast, bands, rsi };
}

export default function stocks(): Scene {
  const T = 14;
  const { actual, predicted, forecast, bands, rsi } = series();
  const values = [...actual, ...predicted, ...forecast, ...bands.flatMap((b) => (b ? [...b] : []))];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const x = (i: number) => 70 + (i * 540) / (N - 1);
  const y = (v: number) => 262 - ((v - lo) / (hi - lo)) * 196;
  const ry = (v: number) => 392 - (v / 100) * 84;
  const path = (points: [number, number][]) => `M${points.map(([px, py]) => `${px.toFixed(1)} ${py.toFixed(1)}`).join(' L')}`;

  const actualPath = path(actual.map((v, i) => [x(i), y(v)]));
  const predictedPath = path(predicted.map((v, i) => [x(i), y(v)]));
  const forecastPath = path(forecast.map((v, k) => [x(TODAY + k), y(v)]));
  const banded = bands.map((b, i) => (b ? { i, b } : null)).filter((b) => b !== null);
  const bandPath = `${path(banded.map(({ i, b }) => [x(i), y(b[0])]))} L${banded
    .slice()
    .reverse()
    .map(({ i, b }) => `${x(i).toFixed(1)} ${y(b[1]).toFixed(1)}`)
    .join(' L')} Z`;
  const rsiPath = path(rsi.flatMap((v, i) => (v === null ? [] : [[x(i), ry(v)] as [number, number]])));

  const css = [
    draw('sp-actual', [2, 38, 93, 98]),
    draw('sp-pred', [12, 48, 93, 98]),
    draw('sp-rsi', [6, 42, 93, 98]),
    fade('sp-bands', [10, 18, 93, 97]),
    fade('sp-future', [48, 52, 93, 97]),
    draw('sp-forecast', [52, 70, 93, 98]),
    keyframes('sp-step', [[0, 'opacity:.3'], [10, 'opacity:1'], [26, 'opacity:.3'], [100, 'opacity:.3']]),
  ];

  const svg = (
    <g>
      <rect x="40.5" y="24.5" width="599" height="391" rx="14" className="fill-background stroke-border" />
      <text x="60" y="48" fontSize="11" letterSpacing="1.2" className="fill-muted">PRICE · ACTUAL VS PREDICTED</text>
      <g fontSize="11">
        <line x1="400" x2="416" y1="44" y2="44" stroke="#3b82f6" strokeWidth="3" />
        <text x="422" y="48" className="fill-foreground">actual</text>
        <line x1="476" x2="492" y1="44" y2="44" stroke="#ef4444" strokeWidth="3" />
        <text x="498" y="48" className="fill-foreground">predicted</text>
      </g>

      {/* Forecast region */}
      <g style={play('sp-future', T, { opacity: 1 })}>
        <rect x={x(TODAY)} y="60" width={x(N - 1) - x(TODAY) + 10} height="336" fill="var(--accent)" fillOpacity="0.08" />
        <line x1={x(TODAY)} x2={x(TODAY)} y1="60" y2="396" strokeDasharray="3 4" stroke="var(--accent)" />
        <text x={x(TODAY) + 8} y="76" fontSize="10" letterSpacing="1.2" fill="var(--accent)">FORECAST</text>
      </g>

      <path d={bandPath} className="fill-muted" fillOpacity="0.12" style={play('sp-bands', T, { opacity: 1 })} />
      <path d={actualPath} pathLength={1} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" style={drawn('sp-actual', T)} />
      <path d={predictedPath} pathLength={1} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" style={drawn('sp-pred', T)} />
      <path d={forecastPath} pathLength={1} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" style={drawn('sp-forecast', T)} />

      {/* RSI */}
      <text x="60" y="296" fontSize="10" letterSpacing="1.2" className="fill-muted">RSI (14)</text>
      <line x1="70" x2="610" y1={ry(70)} y2={ry(70)} strokeDasharray="3 4" className="stroke-border" />
      <line x1="70" x2="610" y1={ry(30)} y2={ry(30)} strokeDasharray="3 4" className="stroke-border" />
      <text x="614" y={ry(70) + 4} fontSize="9" className="fill-muted">70</text>
      <text x="614" y={ry(30) + 4} fontSize="9" className="fill-muted">30</text>
      <path d={rsiPath} pathLength={1} fill="none" strokeWidth="1.8" className="stroke-foreground" style={drawn('sp-rsi', T)} />

      {/* The model */}
      <text x="670" y="44" fontSize="11" letterSpacing="1.2" className="fill-muted">THE MODEL</text>
      {PIPELINE.map((step, i) => {
        const top = 58 + i * 60;
        const model = i >= 2 && i <= 4;
        return (
          <g key={step}>
            {i > 0 && <line x1="795" x2="795" y1={top - 16} y2={top} strokeWidth="2" className="stroke-border" />}
            <rect x="670.5" y={top + 0.5} width="249" height="42" rx="10" className={model ? 'fill-card stroke-border' : 'fill-background stroke-border'} />
            <rect
              x="670.5"
              y={top + 0.5}
              width="249"
              height="42"
              rx="10"
              fill="var(--accent)"
              fillOpacity="0.18"
              stroke="var(--accent)"
              style={play('sp-step', 3.6, { opacity: 0.3, animationDelay: `${i * 0.36}s` })}
            />
            <text x="795" y={top + 26} fontSize="13" fontWeight={model ? 700 : 400} textAnchor="middle" className="fill-foreground">{step}</text>
          </g>
        );
      })}
    </g>
  );
  return { css, svg };
}
