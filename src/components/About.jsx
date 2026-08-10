import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import AnimatedTitle from './AnimatedTitle';
import { prefersReducedMotion } from '../utils/animations';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const statsRef = useRef([]);

  const stats = [
    { value: 3000, suffix: '+', label: t.about.stat1Label },
    { value: 9, suffix: '', label: t.about.stat2Label },
    { value: 80, suffix: '+', label: t.about.stat3Label },
    { value: 13, suffix: '', label: t.about.stat4Label },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text entrance — the heading is excluded, it has its own word reveal.
      gsap.from('.about-item', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Stats panel wipes open as a block before the numbers start counting.
      gsap.fromTo(
        '.about-stats',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Counter animations
      statsRef.current.forEach((el) => {
        if (!el) return;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';

        if (prefersReducedMotion()) {
          el.textContent = target.toLocaleString() + suffix;
          return;
        }

        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [t]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Content */}
        <div className="about-content max-w-3xl mb-20">
          <p className={`about-item text-xs tracking-[0.3em] uppercase mb-4 ${
            isDark ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            {t.about.eyebrow}
          </p>

          <AnimatedTitle
            text={t.about.title}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8"
          />

          <p className={`about-item text-base md:text-lg leading-relaxed mb-6 ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {t.about.p1}
          </p>

          <p className={`about-item text-base md:text-lg leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {t.about.p2}
          </p>
        </div>

        {/* Stats */}
        <div className={`about-stats grid grid-cols-2 md:grid-cols-4 gap-px ${
          isDark ? 'bg-neutral-800' : 'bg-neutral-200'
        }`}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-8 md:p-10 text-center ${
                isDark ? 'bg-black' : 'bg-white'
              }`}
            >
              <div
                ref={(el) => (statsRef.current[i] = el)}
                data-target={stat.value}
                data-suffix={stat.suffix}
                className="font-display text-3xl md:text-4xl font-bold mb-2"
              >
                0{stat.suffix}
              </div>
              <p className={`text-xs md:text-sm tracking-wide ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
