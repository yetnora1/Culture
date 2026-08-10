import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedTitle from './AnimatedTitle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import voices from '../data/voices';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const QuoteCard = ({ voice, lang, isDark }) => (
  <figure
    className={`w-[300px] sm:w-[360px] shrink-0 rounded-xl border p-6 transition-all duration-500 ${
      isDark
        ? 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-600 hover:bg-neutral-900'
        : 'border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)]'
    }`}
  >
    <span
      className={`font-display block text-4xl leading-none mb-3 ${
        isDark ? 'text-neutral-700' : 'text-neutral-300'
      }`}
      aria-hidden="true"
    >
      &ldquo;
    </span>

    <blockquote
      className={`text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}
    >
      {voice.quote[lang]}
    </blockquote>

    <figcaption
      className={`mt-5 pt-4 border-t flex items-center gap-3 ${
        isDark ? 'border-neutral-800' : 'border-neutral-200'
      }`}
    >
      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold tracking-wide shrink-0 ${
          isDark ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        aria-hidden="true"
      >
        {voice.initials}
      </span>
      <span className="min-w-0">
        <span className="font-display block text-sm font-semibold truncate">
          {voice.author[lang]}
        </span>
        <span
          className={`block text-xs truncate ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}
        >
          {voice.role[lang]}
        </span>
      </span>
    </figcaption>
  </figure>
);

/**
 * Two counter-scrolling marquee rows of quotes.
 *
 * The track holds the list twice and translates by exactly -50%, so the loop
 * is seamless. Hovering the row pauses it (CSS), so a quote can be read.
 */
const Testimonials = () => {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const sectionRef = useRef(null);
  const rowsRef = useRef([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Rows drift horizontally as the section passes — layered on top of the
      // CSS marquee so the two rows never feel locked to each other.
      rowsRef.current.filter(Boolean).forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i === 0 ? -4 : 4 },
          {
            xPercent: i === 0 ? 4 : -4,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const doubled = [...voices, ...voices];

  return (
    <section
      id="voices"
      ref={sectionRef}
      className={`relative py-24 md:py-32 overflow-hidden ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}
    >
      <div className="max-w-6xl mx-auto px-6 mb-12 md:mb-16">
        <p
          className={`text-xs tracking-[0.3em] uppercase mb-4 ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          {t.voices.eyebrow}
        </p>

        <AnimatedTitle
          text={t.voices.title}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
        />

        <p
          className={`max-w-2xl text-base md:text-lg leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {t.voices.subtitle}
        </p>
      </div>

      {/* Row 1 */}
      <div className="marquee-viewport overflow-hidden mb-5">
        <div ref={(el) => (rowsRef.current[0] = el)}>
          <div className="marquee-track" style={{ '--marquee-duration': '70s' }}>
            {doubled.map((voice, i) => (
              <QuoteCard key={`a-${voice.id}-${i}`} voice={voice} lang={lang} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — same content, opposite direction */}
      <div className="marquee-viewport overflow-hidden">
        <div ref={(el) => (rowsRef.current[1] = el)}>
          <div className="marquee-track reverse" style={{ '--marquee-duration': '85s' }}>
            {doubled.map((voice, i) => (
              <QuoteCard key={`b-${voice.id}-${i}`} voice={voice} lang={lang} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>

      {/* Edge fades so cards dissolve rather than clip */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r ${
          isDark ? 'from-neutral-950' : 'from-neutral-50'
        } to-transparent`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l ${
          isDark ? 'from-neutral-950' : 'from-neutral-50'
        } to-transparent`}
      />
    </section>
  );
};

export default Testimonials;
