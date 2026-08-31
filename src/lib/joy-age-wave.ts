/** 0–100 MD3-style wavy age bar. Marked span is 8–75, peak 26–38. */
export const AGE_WAVE = {
  width: 670,
  height: 32,
  mid: 16,
  amp: 6,
  cycles: 12,
  stroke: 8,
  stop: 4,
  markStart: 0.08,
  markEnd: 0.75,
} as const;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function envelope(local: number) {
  return smoothstep(0, 0.1, local) * (1 - smoothstep(0.9, 1, local));
}

export function ageWavePath(phase = 0): string {
  const { width, mid, amp, cycles, markStart, markEnd } = AGE_WAVE;
  const steps = 240;
  const points: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    let env = 0;
    if (t >= markStart && t <= markEnd) {
      env = envelope((t - markStart) / (markEnd - markStart));
    }
    const y = mid + Math.sin(t * cycles * Math.PI * 2 + phase) * amp * env;
    points.push(`${(t * width).toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
}
