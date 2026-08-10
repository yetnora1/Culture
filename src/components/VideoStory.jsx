import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const POSTER =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lalibela%2C_san_giorgio%2C_esterno_24.jpg/1280px-Lalibela%2C_san_giorgio%2C_esterno_24.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const introRef = useRef(null);
  const chapterRefs = useRef([]);
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [videoOk, setVideoOk] = useState(true);

  // Pick a lighter encode for small screens — decided once, on mount.
  const [src] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
      ? '/video/lalibela-360.webm'
      : '/video/lalibela.webm'
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Browsers without WebM decoding get the poster still instead.
    if (!video.canPlayType('video/webm')) setVideoOk(false);
  }, []);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const frame = frameRef.current;
      const video = videoRef.current;
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
            // Map scroll progress onto the chapter rail, only re-rendering
            // React when the active index actually changes.
            const raw = (self.progress - 0.12) / 0.88;
            const idx = Math.min(
              segments.length - 1,
              Math.max(0, Math.floor(raw * segments.length))
            );
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
          },
          onToggle: (self) => {
            if (!video) return;
            if (self.isActive) video.play().catch(() => {});
            else video.pause();
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
        .fromTo(video, { scale: 1.22 }, { scale: 1, duration: 1.2, ease: 'power2.inOut' }, 0)
        .to(introRef.current, { opacity: 0, yPercent: -30, duration: 0.5, ease: 'power2.in' }, 0.5);

      // 2. Story beats cross-fade one after another.
      chapters.forEach((el, i) => {
        const at = 1.3 + i * 1.4;
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
  }, [segments]);

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
        <img
          src={POSTER}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {videoOk && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={src}
            poster={POSTER}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          />
        )}

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

      {/* Footage credit — the clip is CC BY-SA, which requires attribution */}
      <p className="absolute bottom-3 right-4 md:right-6 z-20 text-[9px] tracking-wider uppercase text-white/30">
        Footage: ZDF/Terra X · CC BY-SA 4.0
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
