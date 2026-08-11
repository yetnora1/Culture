import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * Where chapter `i` enters the scroll timeline, and how far apart the
 * entrances sit. The backdrop, the chapter rail and the credit all resolve the
 * active chapter from these same two numbers, so they cannot drift out of step
 * with the copy the way a separately-tuned progress mapping did.
 */
const CHAPTER_AT = 1.3;
const CHAPTER_STEP = 1.4;

/**
 * One backdrop per chapter, in step with `t.story.segments`.
 *
 * Chapters II and III carry a still rather than a clip: there is no freely
 * licensed footage of the Aksum stelae or the Lalibela churches that is not
 * watermarked (the ZDF/Terra X material on Commons is, which is why an earlier
 * attempt at this was abandoned). A slow push on a 1600px still is the honest
 * substitute — showing some unrelated church instead would be worse.
 *
 * `credit` is per-chapter because the licences differ, and CC BY requires the
 * attribution to be visible alongside the work it belongs to.
 */
const MEDIA = [
  {
    hd: '/video/afar-hd.mp4',
    sd: '/video/afar-sd.mp4',
    poster: '/images/afar-poster.jpg',
    credit: 'Erta Ale, Afar — Alton Chang, CC BY 3.0',
  },
  {
    still: '/images/aksum-still.jpg',
    credit: 'Stelae of Aksum — Wikimedia Commons',
  },
  {
    still: '/images/lalibela-still.jpg',
    credit: 'Bet Giyorgis, Lalibela — Wikimedia Commons',
  },
  {
    hd: '/video/adwa-hd.mp4',
    sd: '/video/adwa-sd.mp4',
    poster: '/images/adwa-poster.jpg',
    credit: 'League of Nations, 1935 — public domain',
  },
  {
    hd: '/video/ethiopia-hd.mp4',
    sd: '/video/ethiopia-sd.mp4',
    poster: '/images/addis-poster.jpg',
    credit: 'Addis Ababa — Pexels',
  },
];

/**
 * The cinematic chapter of the page.
 *
 * The section pins, the video frame expands from a small centred window to
 * full bleed via an animated clip-path, and the story beats cross-fade as the
 * visitor scrolls. Deliberately always dark — it reads as a cinema break in
 * the page rhythm, in both light and dark themes.
 */
const VideoStory = () => {
  const { t } = useLanguage();
  const segments = t.story.segments;

  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRefs = useRef([]);
  const progressRef = useRef(null);
  const introRef = useRef(null);
  const chapterRefs = useRef([]);
  const activeRef = useRef(0);
  const pinnedRef = useRef(false);

  const [active, setActive] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // Every clip ships at two sizes; phones take the SD cut.
  const [small] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    // Browsers that can't decode MP4/H.264 fall back to each chapter's still.
    const probe = document.createElement('video');
    if (!probe.canPlayType('video/mp4')) setVideoOk(false);
  }, []);

  /**
   * Only the on-screen chapter's clip is allowed to play, and only while the
   * section is pinned — otherwise five decoders run at once for footage nobody
   * is looking at. Reads refs only, so it stays stable for the GSAP callbacks.
   */
  const applyPlayback = useCallback(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeRef.current && pinnedRef.current) v.play().catch(() => {});
      else v.pause();
    });
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const frame = frameRef.current;
      const media = mediaRef.current;
      const chapters = chapterRefs.current.filter(Boolean);

      if (reduced) {
        // No pinning, no scrub: show the frame open and the first chapter.
        gsap.set(frame, { clipPath: 'inset(0% 0% 0% 0% round 0px)' });
        gsap.set(chapters, { opacity: 0, yPercent: 0 });
        gsap.set(chapters[0], { opacity: 1 });
        gsap.set(introRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          // Shorter throw on phones, where six screen-heights of scroll for
          // one section reads as the page having stalled.
          end: () =>
            `+=${(segments.length + 1) * (window.innerWidth < 768 ? 70 : 100)}%`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(progressRef.current, { scaleX: self.progress });
            // Resolve the chapter from the timeline's own clock rather than
            // re-deriving it from progress, so the backdrop swaps on exactly
            // the beat the copy does. Only re-render when the index changes.
            const time = self.progress * (self.animation?.duration() || 1);
            const idx = Math.min(
              segments.length - 1,
              Math.max(0, Math.floor((time - CHAPTER_AT) / CHAPTER_STEP))
            );
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
              applyPlayback();
            }
          },
          onToggle: (self) => {
            pinnedRef.current = self.isActive;
            applyPlayback();
          },
        },
      });

      // 1. Geometric reveal: a centred window opens out to full bleed.
      tl.fromTo(
        frame,
        { clipPath: 'inset(14% 16% 14% 16% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.2, ease: 'power2.inOut' },
        0
      )
        .fromTo(media, { scale: 1.22 }, { scale: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to(introRef.current, { opacity: 0, yPercent: -30, duration: 0.5, ease: 'power2.in' }, 0.5);

      // 2. Story beats cross-fade one after another.
      chapters.forEach((el, i) => {
        const at = CHAPTER_AT + i * CHAPTER_STEP;
        tl.fromTo(
          el,
          { opacity: 0, yPercent: 35 },
          { opacity: 1, yPercent: 0, duration: 0.45, ease: 'power3.out' },
          at
        );
        if (i < chapters.length - 1) {
          tl.to(el, { opacity: 0, yPercent: -30, duration: 0.4, ease: 'power3.in' }, at + 0.95);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [segments, applyPlayback]);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Poster layer — also the fallback when WebM can't be decoded */}
      <div
        ref={frameRef}
        className="absolute inset-0 grain"
        // Matches the timeline's "from" state so there is no flash of
        // full-bleed video before ScrollTrigger takes over.
        style={{ clipPath: 'inset(14% 16% 14% 16% round 28px)' }}
      >
        {/* One layer per chapter; only the active one is opaque. The still
            underneath each clip doubles as its poster, so a chapter never
            flashes black while its video buffers. */}
        <div ref={mediaRef} className="absolute inset-0">
          {segments.map((seg, i) => {
            const m = MEDIA[i % MEDIA.length];
            return (
              <div
                key={seg.heading}
                className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
                style={{ opacity: active === i ? 1 : 0 }}
                aria-hidden="true"
              >
                <img
                  src={m.still || m.poster}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover ${
                    m.still ? 'story-push' : ''
                  }`}
                />
                {videoOk && m.hd && (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={small ? m.sd : m.hd}
                    poster={m.poster}
                    muted
                    loop
                    playsInline
                    // Only the first chapter is worth fetching up front; the
                    // rest load when the visitor actually scrolls to them.
                    preload={i === 0 ? 'auto' : 'none'}
                    onError={() => setVideoOk(false)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legibility scrim */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>

      {/* Intro label, fades out as the frame opens */}
      <div
        ref={introRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/50 mb-4">
          {t.story.eyebrow}
        </p>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
          {t.story.title}
        </h2>
      </div>

      {/* Story beats */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none">
        {segments.map((seg, i) => (
          <div
            key={seg.heading}
            ref={(el) => (chapterRefs.current[i] = el)}
            // inset-x-0 + mx-auto rather than a bare max-width: the block is
            // absolutely positioned, so it does not inherit the flex parent's
            // padding and would otherwise run to the screen edge on phones.
            className="absolute inset-x-0 mx-auto max-w-3xl px-6 text-center opacity-0"
          >
            <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/50 mb-4">
              {seg.chapter}
            </p>
            <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5">
              {seg.heading}
            </h3>
            <p className="mx-auto max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-white/70">
              {seg.text}
            </p>
          </div>
        ))}
      </div>

      {/* Chapter rail — hidden on phones, where it would sit on top of the
          chapter copy. The progress bar carries the same information there. */}
      <div className="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-4">
        {segments.map((seg, i) => (
          <div key={seg.chapter} className="flex items-center gap-3 justify-end">
            <span
              className={`font-display text-[10px] tracking-widest transition-all duration-500 hidden md:block ${
                active === i ? 'text-white opacity-100' : 'text-white opacity-30'
              }`}
            >
              {ROMAN[i]}
            </span>
            <span
              className={`block h-px transition-all duration-500 ${
                active === i ? 'w-8 bg-white' : 'w-4 bg-white/30'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          {t.story.scrollHint}
        </span>
        <span className="block w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      {/* Credit tracks the chapter, since each backdrop carries its own licence */}
      <p className="absolute bottom-3 right-4 md:right-6 z-20 max-w-[70vw] text-right text-[9px] tracking-wider uppercase text-white/30 transition-opacity duration-500">
        {MEDIA[active % MEDIA.length].credit}
      </p>

      {/* Progress rail */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/15 z-20">
        <div
          ref={progressRef}
          className="h-full w-full bg-white origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
};

export default VideoStory;
