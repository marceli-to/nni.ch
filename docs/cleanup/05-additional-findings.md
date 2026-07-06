# Additional findings (beyond the original four)

**Date:** 2026-07-06
These surfaced during the audit and are each independently actionable. All verified by grep.

---

## 1. Dead partials — 10 files, zero references (verified)

Grepped for `partial:<path>` across `resources/views` (and PHP/YAML/JS for dynamic refs);
these have **no callers**:

```
resources/views/partials/layout/breakpoints.antlers.html
resources/views/partials/components/misc/anchor.antlers.html
resources/views/partials/components/icons/cross.antlers.html
resources/views/partials/fieldsets/intro/anchors.antlers.html
resources/views/partials/fieldsets/intro/title.antlers.html
resources/views/partials/components/post/elements/share.antlers.html
resources/views/partials/components/forms/elements/success.antlers.html
resources/views/partials/components/forms/elements/error.antlers.html   ← singular; plural errors.antlers.html IS used
resources/views/partials/components/media/video/fullscreen/dimmer.antlers.html
resources/views/partials/fieldsets/teaser/expertise/nav.antlers.html
```

**Action:** delete after a quick team sanity-check (a couple, e.g. `intro/title` /
`intro/anchors`, may be intended for future use — `intro/title` *does* use the h2 component,
so it's the "correct" version of the raw-tag `intro/content:3`; consider using it rather than
deleting).

> ⚠️ **NOT dead — do not delete:** `components/project/media/preview.antlers.html`. An earlier
> pass flagged it, but it's used **6×** in `project/index.antlers.html` via the redundant
> `partial:partials/…` path (finding #3 below), which is why a naive grep missed it.

## 2. Latent CSS bug — `opacity: 100`

`resources/css/animations/fadeIn.css:18`
```css
.posts [data-animation="fadeIn"] { opacity: 100 !important; }
```
`opacity` maxes at `1`; `100` clamps to `1`, so it works **by accident**. Intent is
`opacity: 1` (or `@apply opacity-100` if moved to a class). Fix the value even though the
rendered result is currently correct — it's a trap for the next editor.

## 3. Redundant `partial:partials/…` path prefix

`resources/views/project/index.antlers.html` — 6 includes (lines 25, 33, 41, 63, 71, 79) use
`{{ partial:partials/components/project/media/preview … }}` where the rest of the codebase
uses `{{ partial:components/… }}`. Statamic tolerates both, but:
- it hid a "dead partial" false-positive (finding #1);
- it will break a naive find-and-replace during the [03](./03-partials-structure.md) reorg.

**Action:** normalize to `partial:components/…` before any structural move.

## 4. h1 `is_project` branch silently drops `{{ class }}`

`resources/views/partials/components/headings/h1.antlers.html:2` — the `is_project` `<h1>`
has no `{{ class }}` interpolation, so a class override in project mode is discarded. Its
one current caller (`project/elements/title:1`) happens not to pass a class, so it's latent,
not yet biting. Fix while taming the headings ([04](./04-headings.md)).

## 5. `expertise/wrapper.antlers.html` — possible malformed markup

`resources/views/partials/fieldsets/teaser/expertise/wrapper.antlers.html:1–2` — reported as
`<div data-section="expertise"` with no closing `>` before the partial include. Worth an
eyeball while in the neighborhood; may just be an Antlers-tolerated line wrap.

---

## Non-issues (checked, nothing to do)

- **`.DS_Store` files** (13 under `resources/`) are **not tracked in git** — no repo impact.
  Cosmetic on disk only; a `find . -name .DS_Store -delete` if it bothers you.
- **Inline SVGs:** none outside `components/icons/`. Good.
- **Alpine `x-data`:** 6 files, all distinct/legitimate. No copy-paste.
- **JS / build:** already refactored — see [`../frontend-refactor.md`](../frontend-refactor.md).
