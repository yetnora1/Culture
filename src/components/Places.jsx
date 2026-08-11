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
  const [displayedPlaces, setDisplayedPlaces] = useState(places);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header items entry animation
      gsap.from('.places-header-item', {
        y: 40,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.8,
        stagger: 0.12,
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

  // Smooth Category switching transition effect
  const handleCategoryChange = (newCategory) => {
    if (newCategory === activeCategory || isTransitioning) return;
    setIsTransitioning(true);

    const cards = gridRef.current ? gridRef.current.querySelectorAll('.place-card') : [];

    if (prefersReducedMotion() || !cards.length) {
      setActiveCategory(newCategory);
      setDisplayedPlaces(
        newCategory === 'all' ? places : places.filter((p) => p.category === newCategory)
      );
      setIsTransitioning(false);
      return;
    }

    // Modern Exit Animation: Fade, blur & scale down
    gsap.to(cards, {
      opacity: 0,
      scale: 0.94,
      filter: 'blur(8px)',
      y: 15,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategory(newCategory);
        setDisplayedPlaces(
          newCategory === 'all' ? places : places.filter((p) => p.category === newCategory)
        );
      },
    });
  };

  // Modern Entry Animation whenever displayedPlaces updates
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.place-card');
    if (!cards.length) {
      setIsTransitioning(false);
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(cards, { clipPath: 'none', y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 });
      setIsTransitioning(false);
      return;
    }

    const tween = gsap.fromTo(
      cards,
      {
        clipPath: 'inset(40% 0% 0% 0% round 16px)',
        y: 45,
        opacity: 0,
        scale: 0.92,
        filter: 'blur(10px)',
      },
      {
        clipPath: 'inset(0% 0% 0% 0% round 16px)',
        y: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.75,
        stagger: 0.07,
        ease: 'power3.out',
        onComplete: () => setIsTransitioning(false),
      }
    );

    return () => tween.kill();
  }, [displayedPlaces]);

  return (
    <section
      id="places"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
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
          <div className="places-header-item flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={isTransitioning}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-black text-white border-black shadow-[0_4px_15px_rgba(0,0,0,0.15)]'
                      : isDark
                        ? 'bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white hover:bg-neutral-800/60'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black hover:bg-neutral-100'
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
        >
          {displayedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* Count */}
        <p className={`mt-12 text-center text-sm font-medium tracking-wide ${
          isDark ? 'text-neutral-500' : 'text-neutral-400'
        }`}>
          {displayedPlaces.length} {lang === 'am' ? 'ቦታዎች' : 'places'}
        </p>
      </div>
    </section>
  );
};

export default Places;

