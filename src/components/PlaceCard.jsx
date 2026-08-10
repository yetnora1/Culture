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

  const name = place.name[lang];
  const location = place.location[lang];
  const description = place.description[lang];
  const altName = place.name[lang === 'en' ? 'am' : 'en'];

  return (
    <article
      ref={cardRef}
      className={`place-card group rounded-xl overflow-hidden border transition-all duration-500 hover-lift cursor-pointer ${
        isDark
          ? 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-600'
          : 'border-neutral-200 bg-white hover:border-neutral-400'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden card-img-zoom">
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
          className={`w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-[opacity,filter] duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />

        {/* Darkens slightly on hover so the badges keep their contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

        {/* Year badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${
          isDark ? 'bg-black/70 text-white' : 'bg-white/80 text-black'
        }`}>
          {place.year}
        </div>

        {/* Hover affordance */}
        <div
          className={`absolute bottom-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          aria-hidden="true"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        {/* Name + Amharic */}
        <h3 className="font-display text-lg font-semibold leading-tight mb-1">
          {name}
        </h3>

        {altName && (
          <p className={`text-sm mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {altName}
          </p>
        )}

        {/* Location */}
        <p className={`flex items-center gap-1.5 text-xs mb-4 ${
          isDark ? 'text-neutral-600' : 'text-neutral-400'
        }`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {/* Description */}
        <p className={`text-sm leading-relaxed ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        } ${expanded ? '' : 'line-clamp-3'}`}>
          {description}
        </p>

        {/* Expand/Collapse indicator */}
        <button
          type="button"
          aria-expanded={expanded}
          className={`mt-3 text-xs font-medium flex items-center gap-1 transition-colors ${
            isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded
            ? (lang === 'am' ? 'ያሳጥሩ' : 'Show less')
            : (lang === 'am' ? 'ተጨማሪ ያንብቡ' : 'Read more')}
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default PlaceCard;
