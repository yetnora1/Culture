import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AnimatedTitle from './AnimatedTitle';
import useMagnetic from '../hooks/useMagnetic';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lalibela%2C_san_giorgio%2C_esterno_24.jpg/1280px-Lalibela%2C_san_giorgio%2C_esterno_24.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail';

const Hero = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageRef = useRef(null);
  const ctaButtonRef = useMagnetic(0.3);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (!reduced) {
        // The photograph is unveiled with a clip-path wipe rather than a fade.
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut' }
        );

        gsap.fromTo(
          imageRef.current,
          { scale: 1.25 },
          { scale: 1, duration: 1.8, ease: 'power2.out' }
        );

        gsap.from([eyebrowRef.current, subtitleRef.current, ctaRef.current], {
          y: 34,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.9,
        });
      } else {
        gsap.set(imageWrapRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      }

      // Parallax drift + fade as the hero leaves.
      gsap.to(imageRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to('.hero-copy', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'center top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-end pb-16 md:pb-24 overflow-hidden"
    >
      <div
        ref={imageWrapRef}
        className="absolute inset-0 grain"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <img
          ref={imageRef}
          src={HERO_IMAGE}
          alt="Bet Giyorgis, the rock-hewn Church of St. George in Lalibela, Ethiopia"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-black via-black/40 to-transparent'
              : 'bg-gradient-to-t from-white/95 via-white/30 to-transparent'
          }`}
        />
      </div>

      <div className="hero-copy relative z-10 max-w-6xl mx-auto px-6 w-full">
        <p
          ref={eyebrowRef}
          className={`text-xs tracking-[0.3em] uppercase mb-4 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {t.hero.eyebrow}
        </p>

        <AnimatedTitle
          as="h1"
          text={t.hero.title}
          scrollTrigger={false}
          delay={0.7}
          stagger={0.1}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
        />

        <p
          ref={subtitleRef}
          className={`max-w-lg text-base md:text-lg leading-relaxed mb-10 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {t.hero.subtitle}
        </p>

        <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
          <a
            ref={ctaButtonRef}
            href="#places"
            onClick={(e) => scrollTo(e, '#places')}
            className={`group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {/* Sweep fill on hover */}
            <span
              className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out ${
                isDark ? 'bg-neutral-300' : 'bg-neutral-700'
              }`}
            />
            <span className="relative">{t.hero.cta}</span>
            <svg
              className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>

          <a
            href="#story"
            onClick={(e) => scrollTo(e, '#story')}
            className={`link-sweep text-sm tracking-wide ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}
          >
            {t.nav.story}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
