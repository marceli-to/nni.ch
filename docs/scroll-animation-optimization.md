# Scroll-Animation Optimization

**Date:** 2026-07-04
**Scope:** `resources/js/modules/observer.js`, `resources/css/animations/*`, `resources/css/app.css`, recompiled `public/build/**`.
**Goal:** Remove per-scroll performance costs from the scroll-driven fade/slide/theme
animations, add reduced-motion support, and drop dead code. **Behavior-preserving**
except for one small, flagged timing change (§7).

> Related frontend work: [`frontend-refactor.md`](./frontend-refactor.md). Unrelated to
> the SEO work in [`seo-investigation.md`](./seo-investigation.md).

---

## Background — how the animations work

The fade/slide-in system is CSS-only: `@keyframes` animating `opacity` + `transform`
(compositor-friendly), each gated by an `.is-active` class that an
`IntersectionObserver` toggles per section. No animation is driven by per-frame JS.
That foundation was already good and was left intact. The costs were in the **scroll
listeners**, plus some dead code and a missing accessibility guard.

---

## 1. Header theme: scroll handler → IntersectionObserver  *(main win)*

**File:** `resources/js/modules/observer.js`

**Before:** a `scroll` listener ran `checkAndUpdateTheme()`, which looped over **all 34
`data-section-theme` sections** calling `getBoundingClientRect()` on each, every scroll
tick (debounced 10 ms). `getBoundingClientRect()` forces a synchronous layout recompute
— doing it ×34 per tick is classic **layout thrashing** and the site's only real
per-scroll cost.

**After:** a dedicated `IntersectionObserver` with a degenerate root band pinned to the
top of the viewport:

```js
new IntersectionObserver(cb, { rootMargin: '0px 0px -100% 0px', threshold: 0 });
```

The theme section crossing the top edge (i.e. sitting under the header) is the one
reported as `isIntersecting`, regardless of scroll direction. Boundary ties are resolved
with `entry.boundingClientRect.top` — a value the observer provides **without forcing a
reflow**. Result: **zero per-scroll layout reads.**

---

## 2 & 3. Removed the scroll listener entirely

Consequences of §1:

- **No more `debounce`-on-scroll.** Debounce was the wrong primitive for scroll-linked
  visual state (it fires only after scrolling *pauses*, so the theme lagged/stuttered).
  Gone with the listener. (`quickmenu.js` already used the correct rAF-throttle pattern
  and was left as-is.)
- **No more duplicate listener.** The handler had been bound to both `window` *and*
  `document.body`; only one is the real scroll container. Both removed.
- Removed the now-unused `debounce` import from `observer.js` (the shared
  `modules/debounce.js` stays — it's still used by the Swiper factory etc.).

---

## 4. `prefers-reduced-motion` support  *(accessibility)*

**New file:** `resources/css/animations/reduced-motion.css` (imported last in `app.css`
so it overrides the animation modules).

Honors the OS "reduce motion" setting (WCAG 2.3.3). Because the scroll-reveal elements
start from an animated-out state (`opacity: 0` / translated), simply disabling the
animation would leave them invisible — so this block **forces them to their visible end
state**:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
  [data-animation], [data-animation-lg],
  [data-video-animation], [data-menu-animation] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Test:** macOS → System Settings → Accessibility → Display → *Reduce motion*.

---

## 5. Removed dead `.is-visited` CSS

The animation files defined `.is-visited [data-animation] { animation: none }` rules to
prevent re-animation, but **no JS ever set `is-visited`** (the "fire once" behavior comes
incidentally from `.is-active` being added and never removed). Removed the dead blocks
from:

```
fadeIn.css · fadeIn_slideUp.css · fadeIn_slideInLeft.css
fadeIn_slideInRight.css · masonry.css · intro.css
```

⚠️ In `intro.css` the `.is-visited` selectors were **co-located with a live
`.prevent-animation[data-video-animation="introHeader"]` rule** (which `observer.js` still
sets when deep-linking via a URL hash). Only the `.is-visited` selectors were stripped;
the `.prevent-animation` rule was kept.

---

## 6. Misc cleanup / deliberate non-changes

- **Deleted** `resources/css/vendor/fullpage.css` and its commented-out `@import` in
  `app.css` — dead weight (the addon isn't used; snapping is hand-rolled via
  `data-section-snap`). It was already not in the bundle.
- **Did *not*** blanket-add `will-change` to the animated elements — across 40+ elements
  the memory cost outweighs the benefit; the on-demand `.is-active` approach is fine.
- **Left** the `data-section-snap` `scrollIntoView({ behavior: 'smooth' })` in the section
  observer untouched — changing it alters the snap UX, not performance.

---

## 7. Behavioral note (verify on staging)

The header-theme **switch point moved from ~50px below the top to the very top of the
viewport** (~50px timing difference). On this full-height-section layout it should be
imperceptible, and is arguably more correct since the header sits at y=0.

If the theme is observed flipping slightly early/late and the exact 50px offset is wanted
back: a static `rootMargin` can't mix `px` and `%` for a degenerate line, so the fix is to
compute the bottom margin in `px` at init and **recreate the observer on (debounced)
resize**. Not done now to keep the change minimal.

---

## 8. Build & verification

```bash
npm run build     # vite v4.5.14 — 20 modules transformed, no errors
```

- Compiles clean; app JS/CSS both marginally smaller after dead-code removal.
- **Not** browser-tested locally — this machine can't serve the multisite app (no
  Valet/Herd; see the SEO doc's verification notes). Recommended manual checks on staging:
  1. Scroll a theme-switching page (e.g. a project/fullpage view) — header theme tracks
     the section under it, smoothly, no jank.
  2. Slider/menu animations still fire on section enter.
  3. Enable *Reduce motion* — content appears fully visible with no slide/fade.

---

## 9. Files changed

| File | Change |
|---|---|
| `resources/js/modules/observer.js` | Scroll theme handler → IntersectionObserver; removed scroll listener + debounce import |
| `resources/css/animations/reduced-motion.css` | **New** — reduced-motion support |
| `resources/css/app.css` | Import reduced-motion.css; drop commented fullpage import |
| `resources/css/animations/{fadeIn,fadeIn_slideUp,fadeIn_slideInLeft,fadeIn_slideInRight,masonry,intro}.css` | Removed dead `.is-visited` rules |
| `resources/css/vendor/fullpage.css` | **Deleted** (dead) |
| `public/build/**` | Recompiled assets |
| `docs/scroll-animation-optimization.md` | This document |
