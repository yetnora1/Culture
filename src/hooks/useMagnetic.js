import { useEffect, useRef } from 'react';
import { addMagneticEffect } from '../utils/animations';

/**
 * Attaches a magnetic hover pull to an element.
 * No-ops on touch devices and when reduced motion is requested.
 *
 * const ref = useMagnetic(0.25);
 * <button ref={ref}>…</button>
 */
export default function useMagnetic(strength = 0.25) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    return addMagneticEffect(ref.current, strength);
  }, [strength]);

  return ref;
}
