import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { prefersReducedMotion } from '../utils/animations';

/**
 * Full-screen viewer that morphs out of the card that opened it.
 *
 * The flight animates the frame's box (left/top/width/height) rather than a
 * transform. A scale-based FLIP is cheaper, but the card crops to 4/5 while the
 * full-screen frame matches the photo's own aspect ratio — scaling between the
 * two visibly squashes the image on the way. Animating the box instead lets
 * `object-fit: cover` re-frame every tick, so the crop opens up smoothly and
 * the photo is never distorted. The element is `position: fixed`, so resizing
 * it costs no document reflow.
 */

// Phones get a tighter margin (a fixed 56px would waste a seventh of a 390px
// screen) and a taller caption reserve, since the same copy wraps to more lines.
const metrics = (vw) =>
  vw < 640 ? { margin: 16, caption: 176, gap: 16 } : { margin: 56, caption: 132, gap: 22 };

/**
 * Grid images are 1280px Commons thumbnails; full screen can carry more.
 *
 * 1920 is not arbitrary — Commons only renders certain bucket widths, and 1600
 * and 2000 both come back 400 for these files while 1920 resolves. Commons also
 * throttles bursts with a 429. Either way the failure is silent by design: the
 * probe below only swaps the source on a successful load, so a rejected upgrade
 * just leaves the already-decoded 1280px image in place.
 */
const FULL_WIDTH = 1920;

const upscale = (url) => {
  if (!url.includes('/thumb/')) return null;
  const bigger = url.replace(/\/(\d+)px-/, (match, px) =>
    +px < FULL_WIDTH ? `/${FULL_WIDTH}px-` : match
  );
  return bigger === url ? null : bigger;
};

const cardFigure = (id) =>
  document.querySelector(`[data-place-id="${CSS.escape(id)}"] .place-card-figure`);

/** The natural aspect of the already-decoded grid image, so the frame can be
 *  sized correctly before the full-screen source has loaded. */
const naturalRatio = (id) => {
  const img = cardFigure(id)?.querySelector('img');
  return img?.naturalWidth ? img.naturalWidth / img.naturalHeight : 4 / 5;
};

const targetRect = (ratio) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { margin, caption, gap } = metrics(vw);
  const maxW = Math.min(vw - margin * 2, 1500);
  const maxH = vh - margin * 2 - caption - gap;

  let width = maxW;
  let height = width / ratio;
  if (height > maxH) {
    height = maxH;
    width = height * ratio;
  }

  const blockH = height + gap + caption;
  return {
    width,
    height,
    left: (vw - width) / 2,
    top: Math.max(margin, (vh - blockH) / 2),
    gap,
  };
};

const onScreen = (rect) =>
  rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;

const PlaceLightbox = ({ places, index, onNavigate, onClose }) => {
  const { isDark } = useTheme();
  const { lang } = useLanguage();
  const place = places[index];

  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const frameRef = useRef(null);
  const captionRef = useRef(null);
  const chromeRef = useRef(null);
  const imgRef = useRef(null);
  const closingRef = useRef(false);
  const openedRef = useRef(false);

  const [hiRes, setHiRes] = useState(null);

  const reduced = prefersReducedMotion();

  /** Places the frame and caption at the geometry for the current photo. */
  const layout = useCallback(
    (animate) => {
      // `gap` is layout metadata, not a box property — keep it out of the
      // tween, or GSAP animates a CSS `gap` on the figure.
      const { gap, ...rect } = targetRect(naturalRatio(place.id));
      const frame = frameRef.current;
      const caption = captionRef.current;
      if (!frame || !caption) return rect;

      const capture = { left: rect.left, top: rect.top + rect.height + gap, width: rect.width };
      if (animate && !reduced) {
        gsap.to(frame, { ...rect, duration: 0.5, ease: 'power3.inOut' });
        gsap.to(caption, { ...capture, duration: 0.5, ease: 'power3.inOut' });
      } else {
        gsap.set(frame, rect);
        gsap.set(caption, capture);
      }
      return rect;
    },
    [place.id, reduced]
  );

  // ---- open: morph from the card that was clicked
  useLayoutEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    const rect = layout(false);
    const from = cardFigure(place.id)?.getBoundingClientRect();

    if (reduced || !from) {
      gsap.set([backdropRef.current, frameRef.current, captionRef.current, chromeRef.current], { opacity: 1 });
      return;
    }

    gsap
      .timeline()
      .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, 0)
      .fromTo(
        frameRef.current,
        { left: from.left, top: from.top, width: from.width, height: from.height, borderRadius: 24, opacity: 1 },
        { ...rect, borderRadius: 16, duration: 0.72, ease: 'power3.inOut' },
        0
      )
      .fromTo(
        [captionRef.current, chromeRef.current],
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
        0.34
      );
  }, [layout, place.id, reduced]);

  // ---- close: morph back into whichever card is now current
  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const to = cardFigure(place.id)?.getBoundingClientRect();
    const tl = gsap.timeline({ onComplete: onClose });

    if (reduced) {
      tl.to(rootRef.current, { opacity: 0, duration: 0.2 });
      return;
    }

    tl.to([captionRef.current, chromeRef.current], { opacity: 0, y: 14, duration: 0.25, ease: 'power2.in' }, 0)
      .to(backdropRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0.12);

    if (onScreen(to)) {
      tl.to(
        frameRef.current,
        { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: 24, duration: 0.6, ease: 'power3.inOut' },
        0.05
      );
    } else {
      // The originating card has been scrolled away; flying to it would send
      // the photo off-screen, so settle in place instead.
      tl.to(frameRef.current, { opacity: 0, scale: 0.92, duration: 0.4, ease: 'power2.in' }, 0.05);
    }
  }, [onClose, place.id, reduced]);

  // ---- navigating re-fits the frame to the next photo's aspect and cross-fades
  const go = useCallback(
    (step) => {
      if (closingRef.current || places.length < 2) return;
      const next = (index + step + places.length) % places.length;
      const img = imgRef.current;

      if (reduced) {
        onNavigate(next);
        return;
      }

      gsap.to(img, {
        opacity: 0,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => onNavigate(next),
      });
    },
    [index, onNavigate, places.length, reduced]
  );

  // Re-fit and fade the new photo in whenever the index changes.
  useLayoutEffect(() => {
    if (!openedRef.current) return;
    setHiRes(null);
    layout(true);
    if (!reduced && imgRef.current) {
      gsap.fromTo(imgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out', delay: 0.08 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // ---- keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, go]);

  // ---- keep the geometry correct across resizes
  useEffect(() => {
    const onResize = () => layout(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [layout]);

  // ---- lock the page behind the overlay, compensating for the scrollbar so
  //      the cards underneath do not shift (the close morph targets them)
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevPad = document.body.style.paddingRight;
    const bar = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    if (bar > 0) document.body.style.paddingRight = `${bar}px`;

    return () => {
      html.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, []);

  // ---- move focus in, and hand it back to the card's button on the way out
  useEffect(() => {
    const opener = document.activeElement;
    rootRef.current?.focus();
    return () => {
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, []);

  // ---- load a larger source in the background; the grid image is already
  //      decoded, so the morph starts instantly and sharpens a moment later
  useEffect(() => {
    const big = upscale(place.image);
    if (!big) return;
    const probe = new Image();
    probe.onload = () => setHiRes(big);
    probe.src = big;
    return () => {
      probe.onload = null;
    };
  }, [place.image]);

  const name = place.name[lang];
  const altName = place.name[lang === 'en' ? 'am' : 'en'];
  const chrome = isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/15 text-white hover:bg-white/25';

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      tabIndex={-1}
      className="fixed inset-0 z-[9000] outline-none"
    >
      <div
        ref={backdropRef}
        onClick={close}
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        aria-hidden="true"
      />

      <figure ref={frameRef} className="fixed overflow-hidden bg-neutral-900 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
        <img
          ref={imgRef}
          src={hiRes || place.image}
          alt={name}
          className="h-full w-full object-cover"
          decoding="async"
        />
      </figure>

      <figcaption ref={captionRef} className="fixed text-white">
        {/* Stacked on phones — the alternate name wrapping alongside an
            already-wrapped title reads as a jumble at that width. */}
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{name}</h2>
          {altName && <span className="text-sm text-white/60">{altName}</span>}
        </div>
        <p className="mt-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
          <svg className="h-3.5 w-3.5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {place.location[lang]}
          <span className="text-white/30">·</span>
          {place.year}
        </p>
        <p className="mt-2.5 max-w-4xl text-sm leading-relaxed text-white/80 line-clamp-3">
          {place.description[lang]}
        </p>
      </figcaption>

      <div ref={chromeRef} className="pointer-events-none fixed inset-0">
        <button
          type="button"
          onClick={close}
          aria-label={lang === 'am' ? 'ዝጋ' : 'Close'}
          className={`pointer-events-auto absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300 ${chrome}`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {places.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={lang === 'am' ? 'ቀዳሚ' : 'Previous'}
              className={`pointer-events-auto absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300 ${chrome}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={lang === 'am' ? 'ቀጣይ' : 'Next'}
              className={`pointer-events-auto absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-300 ${chrome}`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-[0.2em] text-white/50">
              {index + 1} / {places.length}
            </p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PlaceLightbox;
