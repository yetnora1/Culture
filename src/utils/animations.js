import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * True when the visitor has asked the OS to reduce motion.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * True for touch / coarse-pointer devices, where hover-driven effects
 * (tilt, magnetic buttons, custom cursor) are pointless or harmful.
 */
export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

/**
 * Animate element with clip-path reveal on scroll
 */
export const clipPathReveal = (element, options = {}) => {
  const {
    from = 'bottom', // 'bottom', 'top', 'left', 'right', 'circle'
    start = 'top 85%',
    end = 'top 20%',
    scrub = true,
  } = options;

  const clipPaths = {
    bottom: {
      from: 'inset(100% 0% 0% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    top: {
      from: 'inset(0% 0% 100% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    left: {
      from: 'inset(0% 100% 0% 0%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    right: {
      from: 'inset(0% 0% 0% 100%)',
      to: 'inset(0% 0% 0% 0%)',
    },
    circle: {
      from: 'circle(0% at 50% 50%)',
      to: 'circle(100% at 50% 50%)',
    },
    diamond: {
      from: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
      to: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    },
  };

  const { from: clipFrom, to: clipTo } = clipPaths[from] || clipPaths.bottom;

  return gsap.fromTo(
    element,
    { clipPath: clipFrom },
    {
      clipPath: clipTo,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start,
        end,
        scrub: scrub === true ? 1 : scrub,
        invalidateOnRefresh: true,
      },
    }
  );
};

/**
 * Staggered entrance animation for multiple elements
 */
export const staggerEntrance = (elements, options = {}) => {
  const {
    y = 80,
    opacity = 0,
    stagger = 0.15,
    start = 'top 85%',
    duration = 1,
  } = options;

  return gsap.from(elements, {
    y,
    opacity,
    duration,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements[0] || elements,
      start,
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Parallax effect on scroll
 */
export const parallax = (element, options = {}) => {
  const { y = -100, start = 'top bottom', end = 'bottom top' } = options;

  return gsap.to(element, {
    y,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
};

/**
 * Text split and animate
 */
export const animateText = (element, options = {}) => {
  const {
    start = 'top 80%',
    stagger = 0.03,
    y = 50,
  } = options;

  const text = element.textContent;
  element.textContent = '';

  const words = text.split(' ');
  words.forEach((word, i) => {
    const wordSpan = document.createElement('span');
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';

    const innerSpan = document.createElement('span');
    innerSpan.textContent = word;
    innerSpan.style.display = 'inline-block';
    innerSpan.classList.add('word-inner');

    wordSpan.appendChild(innerSpan);
    element.appendChild(wordSpan);

    if (i < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });

  const wordInners = element.querySelectorAll('.word-inner');

  return gsap.from(wordInners, {
    y,
    opacity: 0,
    duration: 0.8,
    stagger,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * 3D tilt effect on mouse move
 */
export const addTiltEffect = (element, intensity = 10) => {
  if (!element || isTouchDevice() || prefersReducedMotion()) return () => {};

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    gsap.to(element, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Magnetic hover effect for buttons
 */
export const addMagneticEffect = (element, strength = 0.3) => {
  if (!element || isTouchDevice() || prefersReducedMotion()) return () => {};

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Counter animation
 */
export const animateCounter = (element, target, options = {}) => {
  const { duration = 2, start = 'top 80%', suffix = '' } = options;

  const obj = { val: 0 };

  return gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none reverse',
    },
    onUpdate: () => {
      element.textContent = Math.floor(obj.val).toLocaleString() + suffix;
    },
  });
};
