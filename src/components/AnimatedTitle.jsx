import { Fragment, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

/**
 * Masked word-by-word title reveal.
 *
 * The text is split into per-word wrappers with overflow:hidden, so each word
 * slides up out of its own mask rather than simply fading — the effect Zentry
 * and most Awwwards sites use for headlines.
 *
 * `text` is a plain string (not children) so the split can re-run cleanly
 * whenever the copy changes — e.g. when the visitor switches language.
 */
const AnimatedTitle = ({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.07,
  start = 'top 85%',
  scrollTrigger = true,
}) => {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.word-inner');
    if (!words.length) return;

    if (prefersReducedMotion()) {
      gsap.set(words, { y: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      words,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger,
        ease: 'power4.out',
        delay,
        ...(scrollTrigger
          ? {
              scrollTrigger: {
                trigger: el,
                start,
                toggleActions: 'play none none reverse',
              },
            }
          : {}),
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // `text` is a dependency so the reveal replays after a language switch
  }, [text, delay, stagger, start, scrollTrigger]);

  const words = String(text ?? '').split(' ');

  return (
    <Tag ref={titleRef} className={`font-display ${className}`}>
      {words.map((word, i) => (
        <Fragment key={word + i}>
          <span className="word-mask">
            <span className="word-inner">{word}</span>
          </span>
          {/* A real space between masks: it keeps the accessible text and
              copy-paste output intact, and lets long headings wrap. */}
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
};

export default AnimatedTitle;
