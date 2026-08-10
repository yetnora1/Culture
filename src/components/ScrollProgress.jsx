import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';

/**
 * Hairline reading-progress bar pinned to the very top of the viewport.
 * Sits above the navbar and stays out of the way.
 */
const ScrollProgress = () => {
  const { isDark } = useTheme();
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const setScale = gsap.quickTo(bar, 'scaleX', { duration: 0.25, ease: 'power2.out' });

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScale(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[60] pointer-events-none">
      <div
        ref={barRef}
        className={`h-full w-full origin-left ${isDark ? 'bg-white' : 'bg-black'}`}
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

export default ScrollProgress;
