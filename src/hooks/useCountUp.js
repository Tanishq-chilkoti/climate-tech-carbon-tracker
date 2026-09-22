import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 (or previous value) to `target`.
 * @param {number} target  - The final value to count to
 * @param {number} duration - Animation duration in ms (default 900)
 * @param {number} decimals - Decimal places to display
 */
export default function useCountUp(target, duration = 900, decimals = 2) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to) return;

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [target, duration, decimals]);

  return display;
}
