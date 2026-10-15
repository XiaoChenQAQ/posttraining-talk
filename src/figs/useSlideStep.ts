import { useEffect, useRef, useState } from 'react';
/**
 * Scroll-triggered step animation for figures.
 * Returns [ref, step]: step = -1 before the figure enters the viewport, then counts 0 → max
 * (one step every `interval` ms). A `.replay` button inside the same <figure> restarts it.
 */
export function useSlideStep<T extends Element>(max = 0, interval = 1000) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timers: number[] = [];
    let played = false;
    const play = () => {
      timers.forEach(clearTimeout); timers = [];
      setStep(0);
      for (let i = 1; i <= max; i++) timers.push(window.setTimeout(() => setStep(i), i * interval));
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !played) { played = true; play(); } }, { threshold: 0.35 });
    io.observe(el);
    const btn = el.closest('figure')?.querySelector('.replay');
    btn?.addEventListener('click', play);
    return () => { io.disconnect(); timers.forEach(clearTimeout); btn?.removeEventListener('click', play); };
  }, [max, interval]);
  return [ref, step] as const;
}
