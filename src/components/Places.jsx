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

  // Modern Entry Animation with ScrollTrigger whenever displayedPlaces updates
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

    const ctx = gsap.context(() => {
      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            clipPath: 'inset(35% 0% 0% 0% round 20px)',
            y: 55,
            opacity: 0,
            scale: 0.93,
            filter: 'blur(10px)',
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 20px)',
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.85,
            delay: (idx % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
      setIsTransitioning(false);
    }, gridRef);

    return () => ctx.revert();
  }, [displayedPlaces]);

  return (
    <section
      id="places"
      ref={sectionRef}
      className="py-24 md:py-36 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-14 md:mb-20">
          <p className={`places-header-item text-xs tracking-[0.35em] uppercase mb-4 font-semibold ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            {t.places.eyebrow}
          </p>

          <AnimatedTitle
            text={t.places.title}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6"
          />

          <p className={`places-header-item max-w-3xl text-base md:text-xl leading-relaxed mb-12 ${
            isDark ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            {t.places.subtitle}
          </p>

          {/* Category Filter */}
          <div className="places-header-item flex flex-wrap gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  disabled={isTransitioning}
                  className={`relative px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.25)] scale-105'
                        : 'bg-black text-white border-black shadow-[0_8px_25px_rgba(0,0,0,0.2)] scale-105'
                      : isDark
                        ? 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white hover:bg-neutral-800/80'
                        : 'bg-neutral-100/80 text-neutral-600 border-neutral-200/80 hover:border-neutral-400 hover:text-black hover:bg-neutral-200/60'
                  }`}
                >
                  {cat[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Places Grid with Bigger Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 min-h-[500px]"
        >
          {displayedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* Count */}
        <p className={`mt-16 text-center text-sm font-semibold tracking-widest uppercase ${
          isDark ? 'text-neutral-500' : 'text-neutral-400'
        }`}>
          {displayedPlaces.length} {lang === 'am' ? 'ቦታዎች' : 'places'}
        </p>
      </div>
    </section>
  );
};

export default Places;

