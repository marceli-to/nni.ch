# Concern #4 — Heading components (h1 / h2 / h3)

**Date:** 2026-07-06
**Scope:** `resources/views/partials/components/headings/{h1,h2,h3}.antlers.html` and every
caller; plus `resources/css/components/headings.css`.

## Verdict

The heading component **exists but leaks**. There are **three competing styling channels**
for the same headings, the variant system is a hand-rolled boolean enum that isn't scaling,
**20 of 25 callers patch it with one-off `class=""` strings** (many duplicated), and **13
templates bypass it entirely** with raw `<h1>/<h2>/<h3>` tags.

---

## The three components today

**`h1.antlers.html`** — one variant (`is_project`) + default.
```
{{ if is_project }}
<h1 class="font-meta-medium text-4xl xl:text-7xl leading-[1.2]">{{ slot }}</h1>
{{ else }}
<h1 class="font-meta-medium text-3xl md:text-5xl xl:text-8xl uppercase tracking-widest leading-[1.2] {{ class }}">{{ slot }}</h1>
{{ /if }}
```
> ⚠️ The `is_project` branch **omits `{{ class }}`** — a class override there is silently
> dropped. Latent bug, tracked in [05](./05-additional-findings.md).

**`h2.antlers.html`** — three variants + default; `{{ data }}` passthrough only on
`is_teaser` and default.
```
{{ if is_project }}        <h2 class="font-meta-medium {{ class }}">
{{ elseif is_competency_teaser }} <h2 class="text-2xl md:text-3xl xl:text-5xl leading-[1.15] {{ class }}">
{{ elseif is_teaser }}     <h2 class="text-3xl xl:text-6xl leading-[1.2] {{ class }}" {{ data }}>
{{ else }}                 <h2 class="text-3xl md:text-5xl xl:text-7xl leading-[1.2] {{ class }}" {{ data }}>
```

**`h3.antlers.html`** — single style, no variants.
```
<h3 class="font-meta-medium leading-[1.4] {{ class }}">{{ slot }}</h3>
```

## Usage census

**25 partial invocations:** 2× h1, 21× h2, 2× h3.
**Variants defined: 5. Actually reachable: 4** — the h2 `is_teaser` branch is effectively
dead: `elements.antlers.html:20` passes `is_teaser="true"` to the *portfolio wrapper*
partial, but that flag is never forwarded to the h2 inside it. (So it's "flag set but not
threaded through," not simply unused code.)

## The three competing styling channels

1. **The component** (inline Tailwind, variant-selected) — the intended path.
2. **`resources/css/components/headings.css`** — styles headings by **page/body class**,
   bypassing the component: `.posts h1`, `.contact h1`, `.contact-thank-you h1`,
   `.privacy h1`, `.privacy h2`, **plus a global bare `h3 { @apply font-meta-medium mb-4
   xl:mb-8 }`** (lines 18–20) that hits *every* `<h3>` on the site — including the ones the
   partial emits, so they stack.
3. **13 raw heading tags** in templates that ignore the component:
   - h1: `blog/_listing:2`, `blog/show:18`, `team/show:12`, `jobs/show:4`
     *(re-hardcodes the `is_project` classes verbatim — should be `is_project="true"`)*,
     `fieldsets/intro/content:3`.
   - h2: `components/post/elements/heading:1` *(a rival ad-hoc heading component)*,
     `fieldsets/teaser/expertise/item:4`.
   - h3: `accordion/item:28`, `project/media/preview:13` & `:39`, `team/media/portrait:26`,
     `misc/jobs/item:5`, `teaser/portfolio/item:26`.

## The `class=""` smell (the real variant system)

**20 of 25 callers pass a bespoke `class`** — the overrides *are* the de-facto variant
system, and several are duplicated verbatim:

- `text-md md:text-xl xl:text-4xl mb-15 xl:mb-30` on the `is_project` h2 in **5 places**
  (`image_text` ×2, `blog/_related`, `project/_related`, cousins in `feedbacks`/`tags`) — a
  "project section title" variant living as a copy-pasted string.
- `mt-15 text-md xl:text-2xl !leading-[1.25]` identical on **both** h3 uses
  (`project/elements/card:6`, `teaser/post/item:6`).
- `font-meta-medium hyphens-auto` on both competency-teaser uses.
- `title_text.antlers.html:10` passes a class that is a **verbatim copy of the h1 default
  class list** onto an h2 — "h1 look, h2 tag," done by copying.
- Heavy `!important` fighting the base classes: `cta/project:14` (`!leading-[1.2]
  !font-meta-light [&_strong]:!font-meta-medium`), `errors/404:13` (`!text-7xl`).

---

## Recommendations

1. **Turn the duplicated `class` strings into named variants.** The 5× `text-md md:text-xl
   xl:text-4xl mb-15 xl:mb-30` becomes something like a `variant="project-section"`; the
   h3 `mt-15 text-md xl:text-2xl !leading-[1.25]` becomes an h3 variant. This is where the
   real value is — the magic strings collapse to one definition each.
2. **Replace the boolean-flag enum with a single `variant`/`level` param.** `is_project`,
   `is_competency_teaser`, `is_teaser` as separate booleans is a hand-rolled enum where two
   flags can be passed at once (first-match wins silently). One `variant="project"` param is
   clearer and can't conflict.
3. **Make `{{ class }}` and `{{ data }}` passthrough consistent** across *all* branches (h1
   `is_project` and h2 `is_project`/`is_competency_teaser` currently drop one or the other).
4. **Decide the CSS-vs-component boundary.** Either route `.posts`/`.contact`/`.privacy`
   headings through the component (with page variants) and delete those CSS rules, or
   consciously keep CSS for the long-form content pages — but pick one, and drop the global
   bare `h3 {}` rule that silently stacks on the partial's output.
5. **Convert the 13 raw-tag bypasses** to the component once variants cover their looks.
   Start with `jobs/show:4` (already a verbatim copy of `is_project`) and
   `fieldsets/intro/content:3` (near-dup of the unused `intro/title` partial).

> This concern overlaps [02](./02-antlers-duplication.md) #6 (the teaser-card h3 string) and
> [03](./03-partials-structure.md) (`post/elements/heading` is a rival component that should
> be folded in).
