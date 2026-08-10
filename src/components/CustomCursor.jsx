import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { isTouchDevice, prefersReducedMotion } from '../utils/animations';

/**
 * Two-part cursor: a dot that tracks the pointer exactly and a ring that
 * trails behind it. Both use mix-blend-mode: difference, so they stay visible
 * over light sections, dark sections and video alike without any theme logic.
 *
 * Renders nothing on touch devices or when reduced motion is requested.
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: 0, yPercent: 0, opacity: 0 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

    let shown = false;
    const onMove = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    // Grow the ring over anything the visitor can act on.
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor="grow"]';

    const onOver = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1.9, borderColor: 'rgba(255,255,255,0.9)', duration: 0.3 });
        gsap.to(dot, { scale: 0.4, duration: 0.3 });
      }
    };

    const onOut = (e) => {
      if (e.target.closest?.(INTERACTIVE)) {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.6)', duration: 0.3 });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot, ring], { opacity: 1, duration: 0.2 });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('mouseenter', onEnterWindow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ opacity: 0 }} />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" style={{ opacity: 0 }} />
    </>
  );
};

export default CustomCursor;
