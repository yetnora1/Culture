import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import places, { categories } from '../data/places';
import PlaceCard from './PlaceCard';
import AnimatedTitle from './AnimatedTitle';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const Places = () => {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const filteredPlaces = activeCategory === 'all'
    ? places
    : places.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // The heading has its own masked word reveal, so it is excluded here.
      gsap.from('.places-header-item', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Re-deal the grid whenever the filter changes: each card wipes in from the
  // bottom with a clip-path rather than a plain fade.
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.place-card');
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      gsap.set(cards, { clipPath: 'none', y: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      cards,
      { clipPath: 'inset(100% 0% 0% 0% round 12px)', y: 24 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 12px)',
        y: 0,
        duration: 0.85,
        stagger: 0.055,
        ease: 'power3.out',
      }
    );

    return () => tween.kill();
  }, [activeCategory]);

  return (
    <section
      id="places"
      ref={sectionRef}
      className="py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <p className={`places-header-item text-xs tracking-[0.3em] uppercase mb-4 ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            {t.places.eyebrow}
          </p>

          <AnimatedTitle
            text={t.places.title}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4"
          />

          <p className={`places-header-item max-w-2xl text-base md:text-lg leading-relaxed mb-10 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {t.places.subtitle}
          </p>

          {/* Category Filter */}
          <div className="places-header-item flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black border-white'
                        : 'bg-black text-white border-black'
                      : isDark
                        ? 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
                        : 'bg-transparent text-neutral-500 border-neutral-300 hover:border-neutral-500 hover:text-black'
                  }`}
                >
                  {cat[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Places Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* Count */}
        <p className={`mt-10 text-center text-sm ${
          isDark ? 'text-neutral-600' : 'text-neutral-400'
        }`}>
          {filteredPlaces.length} {lang === 'am' ? 'ቦታዎች' : 'places'}
        </p>
      </div>
    </section>
  );
};

export default Places;
