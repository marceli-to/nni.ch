# Concern #2 — Antlers template duplication

**Date:** 2026-07-06
**Scope:** all ~145 `.antlers.html` files under `resources/views/`.

This is the **highest-leverage** area. Below, findings are ranked by how much duplication
each removes. Two things that turned out *fine*: there are **no inline SVGs** outside
`components/icons/`, and Alpine `x-data` usage is minimal and all distinct.

---

## Execution status (2026-07-07)

Executed the **safe subset only** (no visual-QA harness beyond render-diffing via Valet).
Several items in this doc turned out to be based on an **oversimplified premise** — the
code has drifted since the 2026-07-06 audit, so "near-identical" is often no longer true.

**DONE (verified render-neutral via before/after HTML diff on live pages):**
- **#3 contact-links** — extracted `components/misc/contact-links`. Real callers were **3,
  not 6**: footer is a different design (phone-first, `target=_blank`, `hover:text-graphite`)
  and was excluded; `contact.antlers.html`/`team/show` no longer carry the pair.
- **#7 post/elements/card-inner** — clean in-file extraction.
- **#8 twin teaser/{image,video}/content** — merged into `fieldsets/teaser/content` + 2 shims.
  Doc missed a 4th delta (video's `cta_text` div carries extra `max-w-*`); preserved.

**DEFERRED / FLAGGED (premise stale or drift makes them risky without visual QA):**
- **#1 picture blocks** — NOT a mechanical merge. Six distinct glide field names
  (`image`, `feature_image`, `url`, `img`, `image_before`, `image_after`) which Antlers can't
  parameterize into `{{ glide:field }}`; **five** distinct breakpoint/preset profiles (not
  one); wildly different wrappers. The two "byte-identical" partials (`image`/`fullscreen`)
  have diverged (`1280`+`md-webp` vs `1024`+`lg-webp`+`w-full h-auto`). Also spotted 3
  pre-existing MIME bugs here: `type="img/webp"`/`type="img/jpeg"` in `teaser/portfolio/item`,
  and webp `<source>`s mislabeled `type="image/jpeg"` in `project/media/feature:4` and
  `project/elements/fullscreen_image:6`.
- **#2 / #2b arrow-CTA reuse** — NOT safe reuse. The `cta/*` anchors differ from
  `buttons/contact` in text-size ramp, tracking, icon hover-distance, and icon breakpoint
  (reuse would change rendering); **#2b can't use `buttons/more` at all** — the competencies
  variant is a `<span>` nested inside the card's outer `<a>`, so the partial (itself an `<a>`)
  would produce an invalid nested anchor.
- **#4 cta/project ≈ cta/expertise merge** — deferred per earlier decision (needs a human eye).
- **#5 overlay-caption** — occurrences differ structurally (`<span>` vs `<figcaption>`,
  `bottom-0 w-auto` vs `top-0 w-full`, subtitle from `client` vs `caption`), plus a stray `xl`
  class. Would need ~3 params for a small block — marginal, and a regression risk. Flagged.
- **#6 teaser card** — folded into the Doc 04 heading-size work (the `mt-15 text-md
  xl:text-2xl !leading-[1.25]` h3 string is the real target there).
- **#9 section wrapper** — the `<section data-section>` shell shares only ~1 line; theme,
  observe-attributes, and the full class string all vary per caller across 11 files. Low
  dedup value for high churn/regression surface. Flagged.
- **#10 grid string** & **#11 portfolio/wrapper** — deferred (10-file sweep / 354-line
  structural refactor; both higher-risk without visual QA).

---

## TIER 1 — highest impact

### 1. Responsive `<picture>` block — ~15 hand-written copies

The same 5-source `<picture>` construct (webp + jpeg at 3 breakpoints, then `<img>` with
`alt/title/height/width/loading`) is written **15 times**, differing only in the glide
field name, breakpoints, and img `class`.

Occurrences:
- `components/media/image/image.antlers.html:2–16`
- `components/media/image/teaser.antlers.html:1–14`
- `components/media/image/fullscreen.antlers.html:2–16` *(byte-identical to `image.antlers.html` minus the `<figcaption>` — merge immediately)*
- `components/media/image/image_carousel.antlers.html:5–16`
- `components/post/media/preview.antlers.html:2–14`
- `components/post/media/feature.antlers.html:2–16`
- `components/post/media/image.antlers.html:2–18`
- `components/project/media/feature.antlers.html:3–18`
- `components/project/media/preview.antlers.html:23–37`
- `components/project/elements/image.antlers.html:2–18`
- `components/project/elements/fullscreen_image.antlers.html:2–16`
- `components/project/elements/slideshow.antlers.html:6–19`
- `components/project/elements/image_comparison.antlers.html:8–22` **and** `24–39` (twice)
- `fieldsets/teaser/portfolio/item.antlers.html:9–22`

**Recommendation:** one canonical `components/media/picture.antlers.html` parameterized by
the glide field, a preset/breakpoint profile, `class`, and optional `loading`.

> **Constraint:** Antlers can't easily interpolate a *dynamic tag variable name*, and the
> field varies (`image`, `feature_image`, `portrait`, `url`, `image_before`, `image_after`).
> So the realistic target is **3–4 preset-profile partials** (e.g. `teaser`, `feature`,
> `fullscreen`) rather than a single one — still removes ~11 copies. Start by merging the
> two identical `fullscreen`/`image` partials.

### 2. Arrow-link CTA — 5 inline copies of an existing component

The uppercase-text + `arrow-right-long` anchor (`flex items-center gap-x-10 group`, hover
translate) is hand-written in 5 places, and a **component for it already exists**
(`components/buttons/contact.antlers.html`):

- `components/misc/cta.antlers.html:6–12`
- `fieldsets/cta/expertise.antlers.html:34–40`
- `fieldsets/cta/project.antlers.html:43–49` *(arrow is placed **first** here — needs an icon-order param)*
- `fieldsets/teaser/competencies/item.antlers.html:16`

**Recommendation:** replace the inline anchors with `{{ partial:components/buttons/contact }}`,
adding an `icon-before`/`icon-after` param. Pure reuse — no new abstraction.

**2b. Short-arrow variant:** `components/buttons/more.antlers.html` is the canonical
version, but `fieldsets/teaser/competencies/item.antlers.html:33–39` reproduces it verbatim
with a hard-coded `"Mehr erfahren"`. Replace with the partial. (`buttons/back` is a third
near-duplicate — same structure, rotated arrow.)

### 3. `mailto:` / `tel:` contact-link pair — 6 files

The same anchor pair (`href="mailto:…"` + `href="tel:…"`, `title="{{ "E-Mail"|trans }} …"`,
`no-underline hover:underline hover:underline-offset-8 hover:decoration-1`) appears in:

- `components/team/media/portrait.antlers.html:32–47` *(class order drifts here)*
- `fieldsets/cta/expertise.antlers.html:15–30`
- `fieldsets/cta/project.antlers.html:24–40`
- `contact.antlers.html`, `team/show.antlers.html`, `layout/footer.antlers.html`

**Recommendation:** extract `components/misc/contact-links.antlers.html` (`email`, `phone`,
`title` params). Removes 5 copies and fixes the class drift.

### 4. `cta/project` ≈ `cta/expertise` (~85% identical)

`fieldsets/cta/project.antlers.html` and `fieldsets/cta/expertise.antlers.html` are the same
view (person + image + heading + contact pair + arrow CTA), differing in grid columns and
one intro line. **Recommendation:** merge into `cta/person.antlers.html` with a `variant`
param, composing the extracted #2 + #3 partials. *(Medium-risk — needs a human eye since
they render slightly differently; see [03](./03-partials-structure.md) for the components-vs-fieldsets CTA overlap.)*

---

## TIER 2 — medium impact

### 5. Overlay caption block

The absolute-positioned white caption over an image (`flex flex-col justify-end items-start
text-white … group-hover:opacity-0` + `<h3 class="font-meta-medium mb-2">`):

- `components/project/media/preview.antlers.html:12–19` **and** `38–45`
- `fieldsets/teaser/portfolio/item.antlers.html:24–30`
- `components/team/media/portrait.antlers.html:25–31` *(padding variant)*

**Recommendation:** `components/media/overlay-caption.antlers.html` (`title` + optional
`subtitle`). Unifies the padding drift.

### 6. Teaser card (image + h3 title)

`components/project/elements/card.antlers.html:1–9` and
`fieldsets/teaser/post/item.antlers.html:1–8` are the same card; the heading class string
`mt-15 text-md xl:text-2xl !leading-[1.25]` is copy-pasted in both. Extract a shared
`teaser-card`, or fold that class into an h3 variant (see [04](./04-headings.md)).

### 7. Post-card row repeated 4× in one file

`components/post/elements/card.antlers.html` repeats the same `date + anchor + preview +
heading` block four times (lines `3–6`, `12–15`, `20–23`, `28–32`), varying only
`ratio`/`class`. Extract `post/elements/card-inner.antlers.html`.

### 8. `teaser/video/content` ≈ `teaser/image/content` (~90% identical)

`fieldsets/teaser/video/content.antlers.html` and `.../teaser/image/content.antlers.html`
differ only in the title variable and the animation-attr prefix (`data-video-animation` vs
`data-animation`). Merge with `title` + `animation-prefix` params.

### 9. `<section data-section …>` wrapper — ~10 copies

The section shell (`<section data-section data-section-theme="…" … class="relative …">`) is
repeated across ~10 fieldset wrappers (`teaser/portfolio`, `teaser/post`, `teaser/image`,
`teaser/image_text`, `teaser/video`, `teaser/competencies`, `intro`, `misc/title_text`,
`misc/faq`, `misc/jobs`, `slideshow/team`). Extract `components/section.antlers.html`
(`theme`, `is_fullpage`, `class` + slot).

### 10. 12-col grid string

`grid-cols-12 gap-x-20 lg:gap-x-30 xl:gap-x-50` is hand-repeated in ~10 files. Either a
`components/grid.antlers.html` slot wrapper or a Tailwind `@apply` utility class.

---

## TIER 3 — structural / lower impact

### 11. `teaser/portfolio/wrapper.antlers.html` — 354 lines, 4× internal copy-paste

Builds the same masonry grid **four times** (mobile+desktop × mirrored/non-mirrored;
`{{ if mirrored }}` at line 7, `{{ else }}` at 175). Each `portfolio/item` call repeats an
identical 9-param list, and the title+CTA block is duplicated 4× (lines `10–21`, `128–141`,
`178–190`, `260–273`). **Recommendation:** have `portfolio/item` derive `height/width/alt/
caption` from the image field itself (callers pass only `item` + `aspectRatio`), and extract
the title/CTA block. Roughly halves the file.

### 12. Dead partials

10 partials verified to have zero references → see [`05-additional-findings.md`](./05-additional-findings.md).

> Note: `components/project/media/preview.antlers.html` is **NOT** dead — it's used 6× in
> `project/index.antlers.html` (via a redundant `partial:partials/…` path, which is why a
> naive grep misses it). See [05](./05-additional-findings.md).

---

## Highest-leverage actions, in order

1. Consolidate the 15 `<picture>` blocks into 3–4 media partials (#1).
2. Reuse `buttons/contact` + `buttons/more` for the inline arrow-CTAs (#2, #2b) — pure reuse.
3. Extract `contact-links` (#3), `overlay-caption` (#5), `section` (#9).
4. Merge the twin `cta/*` (#4) and twin `teaser/*/content` (#8) partials.
5. Refactor `teaser/portfolio/wrapper` (#11).
