/** Lightweight audio manager — single instance per track, volume-fade utilities. */

const pool: Record<string, HTMLAudioElement> = {};

function get(src: string): HTMLAudioElement {
  if (!pool[src]) {
    pool[src] = new Audio(src);
  }
  return pool[src];
}

export function play(src: string, { loop = false, volume = 0.7 } = {}) {
  const a = get(src);
  a.loop   = loop;
  a.volume = volume;
  a.currentTime = 0;
  a.play().catch(() => {});
}

export function stop(src: string) {
  const a = pool[src];
  if (!a) return;
  a.pause();
  a.currentTime = 0;
}

export function fadeIn(
  src: string,
  { loop = false, target = 0.65, duration = 2500 } = {},
) {
  const a = get(src);
  a.loop   = loop;
  a.volume = 0;
  a.play().catch(() => {});

  const steps   = 40;
  const stepMs  = duration / steps;
  const stepVol = target / steps;
  let   count   = 0;

  const t = setInterval(() => {
    count++;
    a.volume = Math.min(target, a.volume + stepVol);
    if (count >= steps) clearInterval(t);
  }, stepMs);
}

export function fadeOut(
  src: string,
  { duration = 2000, then }: { duration?: number; then?: () => void } = {},
) {
  const a = pool[src];
  if (!a) { then?.(); return; }

  const steps   = 30;
  const stepMs  = duration / steps;
  const stepVol = a.volume / steps;
  let   count   = 0;

  const t = setInterval(() => {
    count++;
    a.volume = Math.max(0, a.volume - stepVol);
    if (count >= steps) {
      clearInterval(t);
      a.pause();
      then?.();
    }
  }, stepMs);
}

export function crossfade(
  outSrc: string,
  inSrc: string,
  { target = 0.6, duration = 3000 } = {},
) {
  fadeOut(outSrc, { duration });
  fadeIn(inSrc,  { loop: true, target, duration });
}
