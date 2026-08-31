import Lenis from 'lenis';

/** Inertia scroll in the spirit of monopo.vn (Lenis). Frozen when the user prefers reduced motion. */
export function startSmoothScroll(): Lenis | undefined {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  return new Lenis({
    autoRaf: true,
    lerp: 0.08,
    wheelMultiplier: 0.85,
  });
}
