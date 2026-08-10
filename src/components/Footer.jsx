import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import useMagnetic from '../hooks/useMagnetic';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const footerRef = useRef(null);
  const wordmarkRef = useRef(null);
  const topButtonRef = useMagnetic(0.35);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      if (prefersReducedMotion()) return;

      // Oversized wordmark drifts sideways as the footer comes into view.
      gsap.fromTo(
        wordmarkRef.current,
        { xPercent: -6 },
        {
          xPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className={`relative overflow-hidden border-t ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 footer-content relative z-10">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Ethiopia<span className={isDark ? 'text-neutral-600' : 'text-neutral-300'}> · </span>
          <span className="font-display">ኢትዮጵያ</span>
        </h2>

        <p
          className={`max-w-md text-base leading-relaxed mb-10 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {t.footer.tagline}
        </p>

        <button
          ref={topButtonRef}
          type="button"
          onClick={scrollToTop}
          className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-colors duration-300 ${
            isDark
              ? 'border-neutral-700 hover:border-neutral-400 text-neutral-300 hover:text-white'
              : 'border-neutral-300 hover:border-neutral-600 text-neutral-600 hover:text-black'
          }`}
        >
          {t.footer.backToTop}
          <svg
            className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Oversized wordmark — decorative, so it is hidden from assistive tech */}
      <div
        ref={wordmarkRef}
        aria-hidden="true"
        className={`select-none pointer-events-none font-display font-black tracking-tighter leading-none text-center whitespace-nowrap text-[22vw] ${
          isDark ? 'text-neutral-900' : 'text-neutral-100'
        }`}
      >
        CULTURE
      </div>

      <div className={`relative z-10 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            {t.footer.copyright}
          </p>
          <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Imagery &amp; footage: Wikimedia Commons
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
