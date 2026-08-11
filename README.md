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
| Story            | `VideoStory.jsx`     | Pinned section; frame expands to full bleed, per-chapter backdrops cross-fade |
| Pillars          | `Features.jsx`       | Bento grid, per-card clip-path reveal, 3D tilt, video-on-hover for two cards  |
| Places           | `Places.jsx`         | 22 heritage sites, category filter, row-by-row reveal + scroll-linked parallax |
| — full screen    | `PlaceLightbox.jsx`  | Photo morphs out of its card; arrow keys, prev/next, Escape, scroll lock       |
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

Place photos are hot-linked Commons thumbnails. Everything the story section
uses is checked into `public/`, encoded at two sizes (HD + SD, phones take SD)
with a poster still each, so a chapter never flashes black while its clip
buffers. Browsers that cannot decode H.264 fall back to those stills.

`VideoStory` gives every chapter its own backdrop, each under its own licence,
so the on-screen credit is per-chapter rather than one blanket line:

| Chapter | Backdrop | Source | Licence |
| ------- | -------- | ------ | ------- |
| I Dawn of Humanity  | Erta Ale lava lake, Afar | Alton Chang, Commons | CC BY 3.0 |
| II Kingdom of Aksum | Stelae of Aksum *(still)* | Wikimedia Commons | CC BY-SA |
| III Hewn From Rock  | Bet Giyorgis, Lalibela *(still)* | Wikimedia Commons | CC BY-SA |
| IV Never Colonised  | League of Nations, 1935 | Commons / League of Nations | Public domain |
| V A Living Heritage | Addis Ababa | Pexels | Free to use |

Chapters II and III carry a slow push on a still rather than a clip: there is no
freely licensed footage of the Aksum stelae or the Lalibela churches that is not
watermarked. Showing an unrelated church would be worse than an honest still.

The clips were cut from Commons' own 720p transcodes with `ffmpeg` (a local
tool, not a project dependency). The 1935 film is pillarboxed and carries
burned-in period subtitles, so it is cropped — `crop=964:488:158:216` — to drop
both; left in, the subtitles collide with the chapter headings.

Commons only renders certain **bucket widths** — for these files 1600px and
2000px both return 400 while 1920px resolves, and bursts of requests get a 429.
`PlaceLightbox` therefore treats its higher-resolution fetch as best-effort: it
probes the 1920px URL off-screen and only swaps the source on a successful load,
so a rejected upgrade silently leaves the 1280px grid image in place. Two of the
22 entries are direct file URLs rather than `/thumb/` URLs and are skipped
entirely.
