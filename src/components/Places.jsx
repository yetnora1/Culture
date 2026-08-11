import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import places, { categories } from '../data/places';
import PlaceCard from './PlaceCard';
import AnimatedTitle from './AnimatedTitle';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTriggers are measured in creation order, and this section builds its
 * own inside a useLayoutEffect — React flushes every layout effect before any
 * passive effect, so these get created *before* VideoStory's `useEffect` sets
 * up its pin. Measuring in that order puts every card ~5,700px too high,
 * because the pin's spacer is not in the document yet, and no amount of
 * ScrollTrigger.refresh() repairs it: each refresh repeats the same order.
 * A negative refreshPriority moves this section to the back of the queue, so
 * it always measures against a document that already includes the pin.
 */
const LATE = -1;

const filterPlaces = (category) =>
  category === 'all' ? places : places.filter((p) => p.category === category);

/**
 * Groups cards into visual rows by their laid-out position, so the reveal
 * staggers across a row no matter how many columns the current breakpoint
 * gives us. Reading `offsetTop` beats hard-coding `index % 3`.
 */
const groupIntoRows = (cards) => {
  const rows = new Map();
  cards.forEach((card) => {
    // Round away sub-pixel differences between siblings on the same row.
    const key = Math.round(card.offsetTop / 4);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(card);
  });
  return [...rows.values()];
};

const Places = () => {
  const { isDark } = useTheme();
  const { lang, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayedPlaces, setDisplayedPlaces] = useState(places);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.places-header-item', {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /**
   * Scroll choreography, rebuilt whenever the visible set changes:
   *
   *   1. a row-by-row entrance — cards rise and fade in while their image
   *      settles down from a slight overscale
   *   2. a scroll-linked parallax that keeps every image drifting against its
   *      frame for as long as the card is on screen
   *
   * useLayoutEffect (not useEffect) so the hidden start state is written
   * before the browser paints the freshly mounted cards.
   */
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = gsap.utils.toArray('.place-card', grid);
    if (!cards.length) {
      setIsTransitioning(false);
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(cards, { clearProps: 'all' });
      setIsTransitioning(false);
      return;
    }

    const ctx = gsap.context(() => {
      groupIntoRows(cards).forEach((row) => {
        const media = row.map((card) => card.querySelector('.place-card-media'));

        gsap
          .timeline({
            scrollTrigger: {
              trigger: row[0],
              start: 'top 88%',
              once: true,
              refreshPriority: LATE,
            },
          })
          .fromTo(
            row,
            { y: 72, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' },
            0
          )
          .fromTo(
            media,
            { scale: 1.18 },
            { scale: 1, duration: 1.5, stagger: 0.1, ease: 'power3.out' },
            0
          );
      });

      // Each image overscans its frame by 8% top and bottom (see PlaceCard),
      // so drifting ±6% of the layer's own height never uncovers an edge.
      cards.forEach((card) => {
        const layer = card.querySelector('.place-card-media');
        if (!layer) return;

        gsap.fromTo(
          layer,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            // force3D stays on "auto" so GSAP promotes the layer while the
            // scrub is running and drops it again when scrolling stops —
            // 22 permanently composited full-bleed images is a lot to hold.
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
              refreshPriority: LATE,
            },
          }
        );
      });

      setIsTransitioning(false);
    }, gridRef);

    return () => ctx.revert();
  }, [displayedPlaces]);

  // Filtering sweeps the current cards out before the new set mounts and runs
  // the entrance above; without the wait, the two sets would cross-fade into
  // each other mid-flight.
  const handleCategoryChange = (newCategory) => {
    if (newCategory === activeCategory || isTransitioning) return;

    const commit = () => {
      setActiveCategory(newCategory);
      setDisplayedPlaces(filterPlaces(newCategory));
    };

    const cards = gridRef.current ? gsap.utils.toArray('.place-card', gridRef.current) : [];

    if (prefersReducedMotion() || !cards.length) {
      commit();
      return;
    }

    setIsTransitioning(true);
    gsap.to(cards, {
      opacity: 0,
      y: -28,
      duration: 0.34,
      stagger: 0.035,
      ease: 'power2.in',
      overwrite: true,
      onComplete: commit,
    });
  };

  return (
    <section id="places" ref={sectionRef} className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-8">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <p className={`places-header-item mb-4 text-xs font-semibold uppercase tracking-[0.35em] ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            {t.places.eyebrow}
          </p>

          <AnimatedTitle
            text={t.places.title}
            className="mb-6 text-3xl font-black leading-none tracking-tight sm:text-5xl md:text-6xl"
          />

          <p className={`places-header-item mb-12 max-w-3xl text-base leading-relaxed md:text-xl ${
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
                  className={`relative rounded-full border px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 disabled:cursor-wait ${
                    isActive
                      ? isDark
                        ? 'scale-105 border-white bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)]'
                        : 'scale-105 border-black bg-black text-white shadow-[0_8px_25px_rgba(0,0,0,0.2)]'
                      : isDark
                        ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800/80 hover:text-white'
                        : 'border-neutral-200/80 bg-neutral-100/80 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-200/60 hover:text-black'
                  }`}
                >
                  {cat[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid — fewer, larger cards so each site reads as an image first */}
        <div
          ref={gridRef}
          className="grid min-h-[600px] grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-3"
        >
          {displayedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* Count */}
        <p className={`mt-16 text-center text-sm font-semibold uppercase tracking-widest ${
          isDark ? 'text-neutral-500' : 'text-neutral-400'
        }`}>
          {displayedPlaces.length} {lang === 'am' ? 'ቦታዎች' : 'places'}
        </p>
      </div>
    </section>
  );
};

export default Places;
