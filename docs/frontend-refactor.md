# Frontend JS/CSS Refactor

**Date:** 2026-07-04
**Scope:** `resources/js/**`, `resources/css/animations/menu.css`, recompiled `public/build/**`.
**Nature:** Code-quality refactor — deduplication, dead-code removal, and module
modernization. **No intended behavior change**; the compiled bundle produces the same
UI/interactions with less source.

> This is unrelated to the SEO work in [`seo-investigation.md`](./seo-investigation.md);
> it was in-progress in the working tree and is documented here for the record.

Net diff: **19 source files, +459 / −953 lines.**

---

## 1. Swiper sliders — 5 duplicated modules → 1 config-driven factory

The biggest change. Previously each slider had its own near-identical module:

```
DELETED:  modules/swiper/posts.js      (62 lines)
          modules/swiper/projects.js   (66)
          modules/swiper/team.js       (72)
          modules/swiper/images.js     (58)
          modules/swiper/expertise.js  (34)  ← already orphaned (not imported)

ADDED:    modules/swiper/index.js      ← single config-driven factory
```

`index.js` exposes a shared `createSwiper(selector, { options, responsive, navigation })`
factory and declares each slider once via a `sliders`-style config. It centralizes:

- instantiation across all matching elements,
- **responsive teardown** (init below `768px`, `destroy()` at/above — for `posts`/`projects`),
- **manual prev/next buttons** (`team`/`images`) — the Swiper `Navigation` module is
  intentionally *not* registered, because the buttons are wired by hand and registering
  it would double-advance the slider (documented inline in the file),
- a per-element `options` factory (used by `images` to enable `loop` only when there are
  more than two slides).

`app.js` correspondingly replaced four `import './modules/swiper/*.js'` lines with a
single `import './modules/swiper/index.js'`.

---

## 2. Dead-code removal

- **`resources/js/bootstrap.js` — deleted.** Its entire contents were commented-out axios
  boilerplate, and it was not imported anywhere (verified via grep).
- **`resources/css/animations/menu.css` — slimmed (56 → ~13 lines).** Removed
  commented-out `@keyframes` (`slideInLeft`, `slideInRight`, `slideUp`) and dead
  `[data-menu-animation="fadeIn"]` rules. The active `slideDownMenu` / `fadeInMenu`
  animations and the `appear` state are unchanged.

---

## 3. Module modernization (behavior-preserving)

The remaining modules were tidied — consistent `const`/arrow style, shared `debounce`
usage, dead branches removed, lighter DOM handling:

| Module | Δ lines |
|---|---|
| `modules/observer.js` | ~262 touched |
| `modules/quickmenu.js` | ~193 |
| `modules/comparison.js` | ~130 |
| `modules/carousel.js` | ~106 |
| `map.js` | ~79 |
| `modules/video.js` | ~63 |
| `modules/team.js` | ~52 |
| `gdpr.js` | ~40 |
| `modules/slides.js`, `touch.js`, `debounce.js`, `app.js` | smaller cleanups |

---

## 4. Build

Recompiled with Vite so the shipped assets match the refactored source:

```bash
npm run build     # vite v4.5.14 — 20 modules transformed, built in ~870ms
```

New hashed bundles under `public/build/assets/` (old ones removed, `manifest.json` updated):

```
app-55ff567c.js    122.00 kB  (gzip 39.51)
app-816446ca.css     6.41 kB  (gzip  2.85)
gdpr-f2c69d51.js     0.41 kB
map-47a56093.js      2.31 kB
```

> Build warning (non-blocking): `caniuse-lite` is 13 months old — optionally run
> `npx update-browserslist-db@latest` sometime.

---

## 5. Verification / caveats

- Build completes clean (no errors), and `app.js`'s single swiper import resolves to the
  new `index.js`.
- **Not** exercised in a live browser here — this machine can't serve the multisite app
  locally (no Valet/Herd; see the SEO doc's verification notes). Because the refactor is
  behavior-preserving, do a quick smoke check on staging of the pages that use sliders
  (blog/posts, portfolio/projects, team, image galleries) and the mobile menu animation.
