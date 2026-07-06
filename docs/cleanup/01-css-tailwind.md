# Concern #1 — CSS → Tailwind

**Date:** 2026-07-06
**Scope:** every file under `resources/css/` (excl. `fonts/*.woff*`, `.DS_Store`).

## Verdict

The codebase is **already heavily Tailwind-ified via `@apply`**. There is essentially no
raw vanilla CSS left that cleanly maps to unused Tailwind utilities — the prior refactor
was thorough. What remains vanilla is almost all stuff that *must* stay vanilla.

So this concern is largely a non-issue. The actionable list is short.

---

## Actionable (easy wins)

Convert arbitrary-value utilities to the project's custom spacing tokens (the config
defines a 1px-per-step scale, so `40px` = token `40`, `150px` = token `150`). These are
already inside `@apply` — it's a consistency fix, not a vanilla→Tailwind conversion:

| File:line | Now | → |
|---|---|---|
| `animations/menu.css:20` | `-translate-y-[40px]` | `-translate-y-40` |
| `animations/slides.css:30,34` | `translate-y-[40px]` | `translate-y-40` |
| `components/forms.css:10` | `min-h-[150px]` | `min-h-150` |

Duplication / housekeeping:

- **`views/posts.css:1–7`** — `.posts blockquote` is declared **twice** back-to-back. Merge
  into one rule.
- **`components/media.css:21–31`** — the `.dim-0`…`.dim-100` block is a hand-rolled 1:1
  re-alias of Tailwind's native `bg-opacity-*`. If templates used `bg-opacity-40` directly
  the whole block could be dropped. Grep `class="...dim-` before removing.
- **`cp.css`** — contains only the Statamic scaffold comment `/* This is all you. */`.
  Effectively empty; leave or delete.
- **`@keyframes fadeIn`** is defined independently in 5 files (`fadeIn.css`,
  `fadeIn_slideInLeft.css`, `fadeIn_slideInRight.css`, `fadeIn_slideUp.css`, `slides.css`).
  Not dead, but a duplicated keyframe worth centralizing into one file.

> ⚠️ `fadeIn.css:18` has `opacity: 100 !important` — a latent bug, tracked in
> [`05-additional-findings.md`](./05-additional-findings.md).

---

## Must stay vanilla (do NOT try to convert)

These have no clean Tailwind equivalent — converting them would be wrong:

- **`app.css:29–38`** — `font-variant-ligatures`, `font-feature-settings: 'kern'`,
  `text-rendering`, `-webkit/-moz-font-smoothing`. No Tailwind utilities.
- **`app.css:52` `li::marker`** — pseudo-element; Tailwind can't target `::marker` from a
  template class, so the `@apply text-xxs` must live in a raw selector.
- **All `animations/*.css`** — `@keyframes`, `animation-*` timing declarations,
  `[data-animation=…]` / `.is-active` / `.is-playing` state selectors. None map cleanly.
  - `fadeIn_slideInRight.css:36–44` — `@media (min-width:1024px)` `!important` animation
    override (an `lg:` variant can't express a multi-value animation-name).
  - `reduced-motion.css` — entire file is a `@media (prefers-reduced-motion)` global reset
    on `*`, `*::before`, `*::after` with `!important`; Tailwind's `motion-reduce:` variant
    can't do a global `*` reset.
- **`typo/webfonts.css`** — `@font-face` blocks.
- **`components/swiper.css`** — overrides on library-generated classes (`.swiper-slide-active`
  etc.); must stay as selectors even though they use `@apply`.
- **`components/theme.css`** — attribute-selector combinators
  (`[data-theme="dark"] svg[data-theme]`); must stay as selectors.
- **`components/image.css` `.image-overlay`** — heavy `after:` pseudo-element composition;
  fine as a component class.
- **`utils.css` `[x-cloak] { display:none !important }`** — Alpine.js convention.

## Bottom line

Do the ~4 token conversions and the `blockquote` merge if you're touching CSS anyway.
Otherwise this area is done. The energy belongs in the Antlers templates ([02](./02-antlers-duplication.md)).
