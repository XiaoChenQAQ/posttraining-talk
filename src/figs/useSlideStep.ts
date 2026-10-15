import { useEffect, useRef, useState } from 'react';
/** Returns [ref, step]. step = current step of the enclosing slide, -1 when the slide is inactive. */
export function useSlideStep<T extends Element>() {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const sec = ref.current?.closest('.slide') as HTMLElement | null;
    if (!sec) return;
    const up = () => setStep(Number(sec.dataset.now ?? -1));
    up();
    const mo = new MutationObserver(up);
    mo.observe(sec, { attributes: true, attributeFilter: ['data-now'] });
    return () => mo.disconnect();
  }, []);
  return [ref, step] as const;
}
