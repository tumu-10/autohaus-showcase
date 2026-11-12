export type PressurePoint = { x: number; y: number };
export type PressureRipple = PressurePoint & { start: number };
export type IdlePressureMode = "none" | "wave" | "pulse";

const RIPPLE_LIFE = 1.3;
const WAVE_PERIOD = 3.2;
const PULSE_PERIOD = 2.8;
const PULSE_DEPTH = 0.42;

function distance(a: PressurePoint, b: PressurePoint) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function getIdlePressure(
  mode: IdlePressureMode,
  position: number,
  clock: number,
  spread: number,
) {
  if (mode === "wave") {
    const crest = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (position / spread - clock / WAVE_PERIOD));
    return crest * crest;
  }
  if (mode === "pulse") {
    const lag = Math.abs(position - 0.5) * 0.4;
    const breath = 0.5 - 0.5 * Math.cos(Math.PI * 2 * (clock / PULSE_PERIOD - lag));
    return PULSE_DEPTH * breath * breath * (3 - 2 * breath);
  }
  return 0;
}

export function getRipplePressure(
  ripples: PressureRipple[],
  point: PressurePoint,
  now: number,
  span: number,
) {
  const band = Math.max(span * 0.14, 32);
  let total = 0;

  for (const ripple of ripples) {
    const age = (now - ripple.start) / 1000;
    if (age <= 0 || age >= RIPPLE_LIFE) continue;

    const offset = (distance(ripple, point) - age * span * 1.25) / band;
    if (offset <= -1 || offset >= 1) continue;

    const fade = 1 - age / RIPPLE_LIFE;
    const swell = (1 - offset * offset) ** 2 * fade * fade * Math.min(1, age / 0.06);
    total = 1 - (1 - total) * (1 - swell);
  }

  return total;
}

export function getPressureFontSettings(
  pressure: number,
  options: { width: boolean; weight: boolean; italic: boolean },
) {
  const boundedPressure = Math.min(1, Math.max(0, pressure));
  const width = options.width ? Math.floor(5 + 200 * boundedPressure) : 100;
  const weight = options.weight ? Math.floor(100 + 900 * boundedPressure) : 400;
  const italic = options.italic ? boundedPressure.toFixed(2) : "0";

  return `'wght' ${weight}, 'wdth' ${width}, 'ital' ${italic}`;
}
