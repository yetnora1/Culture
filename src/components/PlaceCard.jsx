import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const PlaceCard = ({ place }) => {
  const { isDark } = useTheme();
  const { lang } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const name = place.name[lang];
  const location = place.location[lang];
  const description = place.description[lang];
  const altName = place.name[lang === 'en' ? 'am' : 'en'];

  // Modern 3D Tilt effect on mouse hover
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate max 8 deg
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: isHovered
          ? 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease'
          : 'transform 0.5s ease-out, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
      className={`place-card group relative rounded-2xl overflow-hidden border cursor-pointer will-change-transform ${
        isDark
          ? 'border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:bg-neutral-900/90'
          : 'border-neutral-200/80 bg-white/90 hover:border-neutral-400 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]'
      } backdrop-blur-sm`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Subtle modern cursor glow highlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          background: isDark
            ? 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.06), transparent 40%)'
            : 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 0, 0, 0.04), transparent 40%)',
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* Shimmer placeholder */}
        {!imageLoaded && !imageError && (
          <div className={`absolute inset-0 ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={`absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] ${
                  isDark
                    ? 'bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent'
                    : 'bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent'
                }`}
              />
            </div>
          </div>
        )}

        {/* Error fallback */}
        {imageError && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDark ? 'bg-neutral-800' : 'bg-neutral-100'
          }`}>
            <div className="text-center p-4">
              <svg className={`w-10 h-10 mx-auto mb-2 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {name}
              </p>
            </div>
          </div>
        )}

        <img
          src={place.image}
          alt={name}
          className={`w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Year badge */}
        <div className={`absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md transition-all duration-300 group-hover:scale-105 ${
          isDark 
            ? 'bg-black/75 text-white border border-white/10' 
            : 'bg-white/85 text-black border border-black/10 shadow-sm'
        }`}>
          {place.year}
        </div>

        {/* Hover Action Circle */}
        <div
          className={`absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out backdrop-blur-md ${
            isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg'
          }`}
          aria-hidden="true"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : 'group-hover:rotate-45'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Name + Amharic */}
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight group-hover:text-amber-500/90 transition-colors duration-300">
            {name}
          </h3>
          {altName && (
            <span className={`text-xs font-medium shrink-0 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
              {altName}
            </span>
          )}
        </div>

        {/* Location */}
        <p className={`flex items-center gap-1.5 text-xs font-medium mb-3 ${
          isDark ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          <svg className="w-3.5 h-3.5 text-amber-500/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {/* Modern Smooth Collapsible Description */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-90'
          }`}
        >
          <div className="overflow-hidden">
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            } ${expanded ? '' : 'line-clamp-2'}`}>
              {description}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          type="button"
          aria-expanded={expanded}
          className={`mt-3 text-xs font-semibold flex items-center gap-1.5 tracking-wide uppercase transition-colors duration-200 ${
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
            className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180 text-amber-500' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default PlaceCard;

