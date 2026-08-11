import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedTitle from './AnimatedTitle';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { addTiltEffect, prefersReducedMotion, isTouchDevice } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const WM = 'utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail';

/**
 * Visual layer for each pillar. Copy lives in the language context so the
 * grid stays bilingual; only the media and layout live here.
 */
const media = [
  {
    key: 'coffee',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ethiopian_coffee_ceremony_-_Addis_Ababa.jpg/1280px-Ethiopian_coffee_ceremony_-_Addis_Ababa.jpg?${WM}`,
    video: '/video/coffee.webm',
    span: 'md:col-span-2 md:row-span-2',
    glyph: 'ቡ',
  },
  {
    key: 'faith',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lalibela-Pr%C3%AAtre_et_croix_de_procession_%281%29.JPG/1280px-Lalibela-Pr%C3%AAtre_et_croix_de_procession_%281%29.JPG?${WM}`,
    span: '',
    glyph: '✛',
  },
  {
    key: 'culture',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ceremony_Dancers%2C_Hamer%2C_Ethiopia_%2822884414265%29.jpg/1280px-Ceremony_Dancers%2C_Hamer%2C_Ethiopia_%2822884414265%29.jpg?${WM}`,
    span: '',
    glyph: 'ባ',
  },
  {
    key: 'nature',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Male_Gelada_Baboon%2C_Chenek%2C_Simien_Mountains_%286190375633%29.jpg/1280px-Male_Gelada_Baboon%2C_Chenek%2C_Simien_Mountains_%286190375633%29.jpg?${WM}`,
    video: '/video/ertale.webm',
    span: '',
    glyph: '△',
  },
  {
    key: 'geez',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Ethiopian%2C_Illuminated_Manuscript%2C_18th_century.jpg/1280px-Ethiopian%2C_Illuminated_Manuscript%2C_18th_century.jpg?${WM}`,
    span: '',
    glyph: 'ግ',
  },
  {
    key: 'cuisine',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Injera_with_eight_kinds_of_stew.jpg/1280px-Injera_with_eight_kinds_of_stew.jpg?${WM}`,
    span: '',
    glyph: 'ም',
  },
];

const PillarCard = ({ item, art, isDark, registerRef }) => {
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    registerRef(card);
    return addTiltEffect(card, 4);
  }, [registerRef]);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v || isTouchDevice()) return;
    v.play().catch(() => {});
    gsap.to(v, { opacity: 1, duration: 0.6, ease: 'power2.out' });
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    gsap.to(v, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => v.pause(),
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`pillar-card group relative overflow-hidden rounded-xl border ${art.span} ${
        isDark
          ? 'border-neutral-800 hover:border-neutral-600'
          : 'border-neutral-200 hover:border-neutral-400'
      } transition-colors duration-500`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <img
        src={art.image}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover grayscale-[35%] transition-transform duration-[900ms] ease-out group-hover:scale-[1.08] group-hover:grayscale-0"
      />

      {art.video && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          src={art.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}

      {/* Legibility scrim — this card is always dark-on-image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/95" />

      {/* Corner bracket, drawn on hover */}
      <span className="absolute top-4 right-4 w-7 h-7 border-t border-r border-white/0 group-hover:border-white/50 transition-all duration-500" />

      <div className="relative h-full p-6 md:p-7 flex flex-col justify-end text-white">
        <span className="font-display text-2xl mb-3 text-white/50 group-hover:text-white transition-colors duration-500">
          {art.glyph}
        </span>

        <h3 className="font-display text-lg md:text-xl font-semibold leading-tight">
          {item.title}
        </h3>

        <p className="text-xs md:text-sm text-white/50 mt-1">{item.native}</p>

        {/* Description slides open on hover; always open on touch devices,
            where there is no hover state to discover it with. */}
        <div className="pillar-desc grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
          <p className="overflow-hidden text-xs md:text-sm leading-relaxed text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <span className="block pt-3">{item.text}</span>
          </p>
        </div>

        <span className="mt-4 block h-px w-0 group-hover:w-full bg-white/60 transition-all duration-700 ease-out" />
      </div>
    </article>
  );
};

const Features = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  // Stable identity so each card registers exactly once, on mount.
  const registerRef = useCallback((el) => {
    if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
  }, []);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { clipPath: 'none', opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: 'inset(35% 0% 0% 0% round 16px)', y: 55, filter: 'blur(8px)', scale: 0.94 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 16px)',
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            delay: (i % 3) * 0.09,
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pillars" ref={sectionRef} className="py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mb-14 md:mb-20">
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-4 font-semibold ${
              isDark ? 'text-neutral-500' : 'text-neutral-400'
            }`}
          >
            {t.pillars.eyebrow}
          </p>

          <AnimatedTitle
            text={t.pillars.title}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6"
          />

          <p
            className={`text-base md:text-xl leading-relaxed ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}
          >
            {t.pillars.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[360px]">
          {t.pillars.items.map((item, i) => (
            <PillarCard
              key={media[i].key}
              item={item}
              art={media[i]}
              isDark={isDark}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
