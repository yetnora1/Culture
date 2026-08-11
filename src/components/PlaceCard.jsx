import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { isTouchDevice } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion is split across three nested elements so nothing fights for the same
 * `transform`:
 *
 *   .place-card         — GSAP owns it (scroll reveal: y + opacity)
 *   .place-card-frame   — CSS owns it (hover lift)
 *   .place-card-media   — GSAP owns it (scroll-linked parallax + reveal scale)
 *
 * Inline styles beat classes, so any overlap here would silently cancel a
 * Tailwind hover transform.
 */
const PlaceCard = ({ place, onOpen }) => {
  const { isDark } = useTheme();
  const { lang } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const frameRef = useRef(null);
  const mountedRef = useRef(false);

  const name = place.name[lang];
  const location = place.location[lang];
  const description = place.description[lang];
  const altName = place.name[lang === 'en' ? 'am' : 'en'];

  // The spotlight follows the pointer through CSS custom properties, so moving
  // the mouse never re-renders the card.
  const handlePointerMove = (e) => {
    const frame = frameRef.current;
    if (!frame || isTouchDevice()) return;
    const rect = frame.getBoundingClientRect();
    frame.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    frame.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Expanding the description changes the card's height, which would otherwise
  // leave every ScrollTrigger below it measuring stale positions. Skip the
  // mount pass — 22 cards would each schedule a needless refresh.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const call = gsap.delayedCall(0.55, () => ScrollTrigger.refresh());
    return () => call.kill();
  }, [expanded]);

  return (
    <article className="place-card" data-place-id={place.id}>
      <div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onClick={() => setExpanded(!expanded)}
        className={`place-card-frame group relative h-full overflow-hidden rounded-3xl border cursor-pointer transition-[transform,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 ${
          isDark
            ? 'border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-600 hover:bg-neutral-900/80 hover:shadow-[0_28px_60px_-20px_rgba(0,0,0,0.85)]'
            : 'border-neutral-200/80 bg-white/90 hover:border-neutral-300 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.28)]'
        }`}
      >
        {/* Pointer spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: isDark
              ? 'radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07), transparent 60%)'
              : 'radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,0,0,0.05), transparent 60%)',
          }}
        />

        {/* Media — tall editorial crop, filling most of the card. Clicking the
            photo opens it full screen; the text block below still toggles the
            description. */}
        <div
          className="place-card-figure relative aspect-[4/5] overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(place.id);
          }}
        >
          {/* Overscans the frame by 8% top and bottom so the scroll parallax
              never exposes an edge. */}
          <div className="place-card-media absolute inset-x-0 -inset-y-[8%]">
            <img
              src={place.image}
              alt={name}
              className={`h-full w-full object-cover transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] grayscale-[15%] group-hover:grayscale-0 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>

          {/* Shimmer placeholder */}
          {!imageLoaded && !imageError && (
            <div className={`absolute inset-0 overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
              <div
                className={`absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent'
                    : 'bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent'
                }`}
              />
            </div>
          )}

          {/* Error fallback */}
          {imageError && (
            <div className={`absolute inset-0 flex items-center justify-center ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-100'
            }`}>
              <div className="p-4 text-center">
                <svg className={`mx-auto mb-2 h-10 w-10 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{name}</p>
              </div>
            </div>
          )}

          {/* Legibility gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Era badge */}
          <div className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 ${
            isDark
              ? 'border border-white/10 bg-black/70 text-white'
              : 'border border-black/10 bg-white/85 text-black shadow-sm'
          }`}>
            {place.year}
          </div>

          {/* Title sits on the image now that the crop is this tall */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <h3 className="font-display text-xl md:text-2xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {name}
            </h3>
            {altName && (
              <span className="mt-1 block text-xs font-medium text-white/70">{altName}</span>
            )}
          </div>

          {/* Opens the photo full screen. Stays reachable by keyboard even
              though it only becomes visible on hover. */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen?.(place.id);
            }}
            aria-label={
              lang === 'am' ? `${name} — በሙሉ ስክሪን ይክፈቱ` : `Open ${name} full screen`
            }
            className={`absolute bottom-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full opacity-0 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-6 md:right-6 ${
              isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <p className={`mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            <svg className="h-3.5 w-3.5 shrink-0 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>

          {/* One paragraph, clipped to two lines by max-height. `1fr` grid rows
              would animate more precisely but cannot interpolate from a fixed
              collapsed height, and 2.85rem is exactly two lines of
              text-sm/leading-relaxed. */}
          <div
            className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              expanded ? 'max-h-[26rem]' : 'max-h-[2.85rem]'
            }`}
          >
            <p className={`text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {description}
            </p>
          </div>

          <button
            type="button"
            aria-expanded={expanded}
            className={`mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide transition-colors duration-200 ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <span>
              {expanded
                ? (lang === 'am' ? 'ያሳጥሩ' : 'Show less')
                : (lang === 'am' ? 'ተጨማሪ ያንብቡ' : 'Read more')}
            </span>
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180 text-amber-500' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default PlaceCard;
