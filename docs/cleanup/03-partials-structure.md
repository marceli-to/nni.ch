# Concern #3 — Partials/components structure

**Date:** 2026-07-06
**Scope:** `resources/views/partials/**`.

## Verdict

The "mess" feeling is real but **purely organizational** — the *wiring* is sound
(dispatcher → block wrapper → leaf component), only the *shelving* is inconsistent. Every
recommendation here is a pure move/rename + include-path update. **No behavior changes.**

---

## Why it feels like a mess: 4 different organizing principles under one roof

```
partials/
├── elements.antlers.html   ← the central block DISPATCHER, loose at the root
├── components/   ← organized by UI element type   (buttons, icons, headings, swiper) ✅
│                    …but ALSO holds content-model partials (post/, project/, team/) ✗
├── fieldsets/    ← organized by CMS block type     (intro, teaser, cta, misc) ✅
├── layout/       ← organized by page region ✅
└── menu/         ← organized by page region ✅ (already clean)
```

Each subtree is individually defensible, but they follow **different rules**, and
`components/` and `fieldsets/` overlap in domain (both own "teaser"-ish, "media"-ish, and
CTA things). A newcomer can't predict where a given file lives.

## Concrete problems

**a) The components/fieldsets boundary isn't real.**
- `components/media/image/teaser.antlers.html` vs the whole `fieldsets/teaser/` tree — same
  word, two homes.
- `components/misc/cta.antlers.html` vs `fieldsets/cta/{expertise,project}` — three CTAs, two
  layers. `teaser/portfolio/wrapper` even pulls `components/misc/cta` (line 85), so they're
  wired together. (This overlap is also flagged in [02](./02-antlers-duplication.md) #4.)
- `components/{post,project,team}/` are **content-model-specific**, not generic UI — they sit
  next to `buttons/` and `icons/` but don't belong at that layer.

**b) Two `misc/` catch-alls hiding first-class things.**
- `components/misc/` = {anchor, cta, hr, social-media-channels} — a grab bag.
- `fieldsets/misc/` = {faq, jobs, statement, title_text} — these are **real dispatched block
  types** (`elements.antlers.html:51–65`), no less first-class than `intro` or `slideshow`,
  which got their own folders. Calling them "misc" buries them.

**c) Loose files amid a folder-per-thing convention.**
- `partials/elements.antlers.html` — the 77-line block dispatcher, the single most important
  file in the tree, sits bare at the root and is named for nothing. Rename to something like
  `blocks/_dispatch.antlers.html`.
- `components/gdpr.antlers.html`, `components/media/overlay.antlers.html` — bare files among
  all-folder siblings.

**d) `elements/` vs `media/` sub-buckets are arbitrary.**
`components/project/elements/` holds `image`, `fullscreen_image`, `image_comparison` (all
"media"), while `components/project/media/` holds only `feature` + `preview`. The split
doesn't hold. Same ad-hoc `elements/` bucket in `post/`, `team/`, `forms/`.

**e) Deep nesting with no payoff.**
- `components/media/video/fullscreen/{wrapper,dimmer}.antlers.html` — 4 levels for 2 files.
- `fieldsets/slideshow/team/wrapper.antlers.html` — folder → folder → one file.

**f) Inconsistent singular/plural folders.**
Plural: `buttons/ filters/ forms/ headings/ icons/`. Singular: `accordion/ swiper/ post/
project/ team/ intro/ teaser/ cta/ slideshow/`. No rule.

**g) `wrapper` vs `container` synonym.**
`wrapper.antlers.html` (22×) is the de-facto "block root" name, but `container.antlers.html`
(`swiper/`, `media/iframe/`) means the same role. `swiper/` has **both** `wrapper` and
`container` at different levels — actively confusing.

**h) Redundant `partial:partials/…` prefix.**
`project/index.antlers.html` (6 lines) uses `{{ partial:partials/components/… }}` where the
rest of the codebase uses `{{ partial:components/… }}`. Statamic tolerates both, but it will
break naive find-and-replace during any reorg. See [05](./05-additional-findings.md).

---

## Include graph (context, not a problem)

Shallow and hub-and-spoke — healthy. `default → elements (dispatch) → one fieldsets/*/wrapper
per block → leaf components`.

Heaviest consumers: `project/show` (18 includes), `team/show` (13), `project/_related` (13),
`project/index` (11), `blog/_related` (11).

Highest fan-in: `layout/blocks/inner` (**74** refs — the universal container), `headings/h2`
(**46**), `teaser/portfolio/item` (16), `buttons/more` (15).

## Slot vs param conventions (ad hoc)

Only **12 partials** actually use `{{ slot }}` (accordion, filters/wrapper, headings, swiper,
layout/blocks/inner, layout/body); everything else is param-driven. Leaf-name usage:
`wrapper` (22×, the real convention), `container` (2×, a synonym for `wrapper`), `item` (11×,
consistent), `content`/`nav`/`elements`/`media` (ad-hoc per-folder inventions).

---

## Proposed target structure

Collapse the 4 principles into **3 role-based layers** + the 2 already-clean region trees:

```
partials/
├── blocks/          ← was fieldsets/ + the dispatcher; == CMS block types
│   ├── _dispatch.antlers.html      (was partials/elements.antlers.html)
│   ├── intro/  cta/  teaser/  slideshow-team/
│   ├── statement.antlers.html      (promoted out of fieldsets/misc/)
│   ├── title-text.antlers.html     (promoted, hyphenated)
│   ├── faq/  jobs/                 (promoted out of misc/)
│
├── ui/              ← was components/ MINUS content-model partials; generic & reusable
│   ├── accordion/ buttons/ filters/ forms/ headings/ icons/
│   ├── media/  {image/*, video/*, iframe, overlay}
│   ├── swiper/ {wrapper, slide, track}   (container→track to stop the wrapper/container clash)
│   └── anchor / hr / gdpr / social-media-channels / cta   (ex-misc, flattened as leaves)
│
├── content/         ← content-model-specific presentation (was components/{post,project,team})
│   ├── post/  project/  team/
│
├── layout/  {…, container}   (blocks/inner → container)
└── menu/    (unchanged)
```

**Key moves & rationale:**
1. **Kill both `misc/` folders.** Promote `faq/jobs/statement/title_text` to first-class
   blocks; flatten `components/misc/*` into `ui/` as leaves.
2. **Rename `elements.antlers.html` → `blocks/_dispatch.antlers.html`** so the routing brain
   is discoverable.
3. **Split `post/`, `project/`, `team/` out of `components/` into `content/`** — resolves the
   "is this UI or a fieldset?" ambiguity. `ui/` = generic, `content/` = model-bound,
   `blocks/` = CMS-block-bound.
4. **Standardize the block-root name to `wrapper`** (the 22× majority); rename the two stray
   `container` files; inside `swiper/`, inner `container → track`.
5. **Flatten single-child chains:** `slideshow/team/wrapper → slideshow-team/wrapper`;
   `media/video/fullscreen/{wrapper,dimmer} → media/video/fullscreen-{wrapper,dimmer}`.
6. **Pick one plurality rule** and apply uniformly (recommend singular for type folders).

## Risk tiering

- **Low-risk (mechanical: move file + grep-replace `partial:` paths):** rename the
  dispatcher, promote `fieldsets/misc/*`, flatten single-child chains, rename the two
  `container` files, normalize the `partial:partials/…` prefix. Antlers include paths are
  plain strings — no autoloading magic to break; ~150 include sites, all greppable via
  `partial:`.
- **Medium-risk:** the `components/ → ui/ + content/` split (largest number of path rewrites,
  ~40 files) and unifying the CTA concepts (needs the [02](./02-antlers-duplication.md) #4 decision first).

> **Do this last.** Reorganizing before the [02](./02-antlers-duplication.md) dedup work
> means moving files you're about to delete or merge. Dedup first, reshelve second.
