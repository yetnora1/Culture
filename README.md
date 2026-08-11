# Culture — Land of Origins

A single-page, bilingual (English / አማርኛ) showcase of Ethiopian heritage, built
as a scroll-driven visual story. React 19 + Vite + Tailwind CSS v4 + GSAP.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run lint
```

## Page structure

| Section          | Component            | What it does                                                                 |
| ---------------- | -------------------- | ---------------------------------------------------------------------------- |
| Hero             | `Hero.jsx`           | Clip-path wipe reveal, masked headline, parallax drift, magnetic CTA          |
| About            | `About.jsx`          | Staggered copy reveal, clip-path stats panel, animated counters               |
| Story            | `VideoStory.jsx`     | Pinned section; video frame expands from a centred window to full bleed       |
| Pillars          | `Features.jsx`       | Bento grid, per-card clip-path reveal, 3D tilt, video-on-hover for two cards  |
| Places           | `Places.jsx`         | 22 heritage sites, category filter, row-by-row reveal + scroll-linked parallax |
| Voices           | `Testimonials.jsx`   | Two counter-scrolling marquees that pause on hover                            |
| Footer           | `Footer.jsx`         | Oversized drifting wordmark, magnetic back-to-top                             |

Global chrome: `ScrollProgress.jsx` (reading progress hairline) and
`CustomCursor.jsx` (dot + trailing ring, `mix-blend-mode: difference`).

## Conventions worth knowing

- **Never add a bare `* { margin: 0; padding: 0 }` reset to `index.css`.**
  Tailwind v4 emits utilities inside `@layer utilities`, and unlayered rules
  outrank every layered rule — such a reset silently kills every `p-*`, `m-*`
  and `mx-auto` on the page. Preflight already handles the reset.
- **Use `gsap.fromTo`, not `gsap.from`, for one-shot entrance animations.**
  React StrictMode double-invokes effects; a second `from` reads the
  already-zeroed value as its destination and leaves the element invisible.
  Anything inside a `gsap.context()` with `ctx.revert()` cleanup is safe either
  way.
- **ScrollTriggers created in a `useLayoutEffect` need `refreshPriority: -1`.**
  `VideoStory` pins from a `useEffect`, and React flushes every layout effect
  before any passive effect — so a layout-effect trigger is measured before the
  pin's spacer exists and lands thousands of pixels off. ScrollTrigger
  re-measures in creation order, so `refresh()` never repairs it; only a lower
  refresh priority does. `Places.jsx` depends on this.
- **Headline reveals go through `AnimatedTitle`**, which takes a `text` string
  (not children) so the word split re-runs when the language changes.
- **Reduced motion is honoured everywhere** — `prefersReducedMotion()` in
  `utils/animations.js` skips pinning, scrubbing, tilt, magnets and the cursor.
- **Copy lives in `context/LanguageContext.jsx`**, place data in
  `data/places.js`, quotes in `data/voices.js`. Components hold layout and
  media only.

## Media

All imagery and footage comes from Wikimedia Commons. Place photos are hot-linked
Commons thumbnails; the story clips are checked into `public/video/` as WebM.
The Lalibela clip is ZDF/Terra X, CC BY-SA 4.0, credited on screen. Browsers that
cannot decode WebM fall back to the poster still automatically.
