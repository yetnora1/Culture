import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t, otherLang } = useLanguage();
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { label: t.nav.home, href: '#hero' },
    { label: t.nav.story, href: '#story' },
    { label: t.nav.pillars, href: '#pillars' },
    { label: t.nav.places, href: '#places' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#footer' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy — highlights whichever section currently owns the viewport.
  useEffect(() => {
    const ids = ['hero', 'story', 'pillars', 'places', 'about', 'footer'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // fromTo with explicit end values, not gsap.from: under StrictMode the
    // effect runs twice, and a second `from` would read the already-zeroed
    // opacity as its destination and leave the bar invisible.
    const tween = gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    );

    return () => tween.kill();
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isOpen) {
        gsap.to(mobileMenuRef.current, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.5,
          ease: 'power3.inOut',
        });
        gsap.from('.mobile-link', {
          y: 30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.15,
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.35,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isOpen]);

  const handleNav = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? `${isDark ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-md shadow-sm border-b ${
                isDark ? 'border-neutral-800' : 'border-neutral-200'
              } py-3`
            : // Unscrolled — fully transparent so the hero photo shows cleanly.
              'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNav(e, '#hero')}
            className="font-display text-xl font-bold tracking-widest uppercase"
          >
            Culture
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = `#${activeSection}` === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`link-sweep text-sm tracking-wide transition-colors duration-300 ${
                    isActive
                      ? isDark
                        ? 'text-white'
                        : 'text-black'
                      : isDark
                        ? 'text-neutral-300 hover:text-white'
                        : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                isDark
                  ? 'border-neutral-700 hover:border-neutral-500 text-neutral-300'
                  : 'border-neutral-300 hover:border-neutral-500 text-neutral-600'
              }`}
              aria-label={`Switch to ${otherLang.label}`}
            >
              {/* Text labels, not flag emoji: Windows ships no glyphs for
                  regional-indicator pairs, so 🇪🇹 renders as a bare "ET". */}
              <span className={lang === 'en' ? '' : 'opacity-40'}>EN</span>
              <span className="opacity-30">/</span>
              <span className={lang === 'am' ? 'font-display' : 'font-display opacity-40'}>
                አማ
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                isDark
                  ? 'border-neutral-700 hover:border-neutral-500'
                  : 'border-neutral-300 hover:border-neutral-500'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4">
                <span className={`absolute left-0 w-full h-[1.5px] transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute left-0 w-full h-[1.5px] transition-all duration-300 ${isDark ? 'bg-white' : 'bg-black'} ${isOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center ${
          isDark ? 'bg-black/98' : 'bg-white/98'
        }`}
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <div className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNav(e, link.href)}
              className={`mobile-link font-display text-2xl font-semibold tracking-wider ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
