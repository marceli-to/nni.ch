# Accessibility: ARIA on interactive components

**Date:** 2026-07-04
**Scope:** Antlers partials for interactive components (links, buttons, toggles,
accordion, search, slider nav, icons) + `lang/en.json`.
**Nature:** Accessibility pass — adds accessible names, state, and relationships to
interactive elements, and marks decorative SVGs as hidden from assistive tech.
**No visual/behavioral change** — only ARIA/role attributes and three new i18n strings.

---

## Why

An audit of every interactive component (`links`, `buttons`, form controls, custom
toggles) found recurring gaps:

- **Icon-only controls with no accessible name** — a screen reader announces them as
  an empty "button"/"link" (search submit, slider prev/next).
- **Custom toggles missing state** — the burger menu, filter dropdown, and accordion
  gave no `aria-expanded`, so their open/closed state was invisible to AT.
- **Decorative SVG icons** were exposed to the accessibility tree, adding noise.
- **`<a href="javascript:;">` used as buttons** without `role="button"`.

Every icon partial is decorative in its actual usage (its parent link/button carries
or now carries the accessible name), so all icons were marked `aria-hidden`.

---

## Changes

### 1. Decorative icons — `resources/views/partials/components/icons/*.antlers.html`

Added `aria-hidden="true" focusable="false"` to the `<svg>` of **all 15 icon partials**
(arrows, chevrons, burger, cross, filter, magnifier, logo, logo-byline, and the social
icons). They convey no information their parent control doesn't already name.

### 2. Header burger toggle — `partials/layout/header.antlers.html`

The menu toggle (`<a href="javascript:;">`) now has:

- `role="button"`
- `aria-label="Menü anzeigen"` (in addition to the existing `title`)
- `aria-controls="main-menu"`
- `:aria-expanded="menu === true ? 'true' : 'false'"` (bound to the Alpine `menu` state)

### 3. Menu panel — `partials/menu/wrapper.antlers.html`

Added `id="main-menu"` so the burger's `aria-controls` resolves to the panel it opens.

### 4. Accordion — `partials/components/accordion/item.antlers.html`

Wired the standard disclosure pattern:

- Button: `id="accordion-button-{{ index }}"`, `aria-controls="accordion-panel-{{ index }}"`,
  `:aria-expanded="open ? 'true' : 'false'"`.
- Panel (`role="region"`): `id="accordion-panel-{{ index }}"`,
  `aria-labelledby="accordion-button-{{ index }}"`, `:aria-hidden="open ? 'false' : 'true'"`.

> `index` is the Statamic loop index, unique within a single accordion. If two accordion
> blocks ever render on the same page the ids could collide — fine for the current
> single-FAQ-per-page usage, but worth prefixing if that changes.

### 5. Filter dropdown — `partials/components/filters/wrapper.antlers.html`

Trigger gains `role="button"`, `aria-controls="filter-panel"`, and
`:aria-expanded="filter ? 'true' : 'false'"`. The dropdown container gains
`id="filter-panel"`.

### 6. Blog search — `blog/_search.antlers.html`

- Text input: added `aria-label="Suche in Posts"` (it previously had only a placeholder).
- Icon-only submit button: added `aria-label="Suchen"`.

### 7. Slider navigation — `partials/components/swiper/container.antlers.html`

- `<nav>` gains `aria-label="Slider"`.
- Prev/next arrows (icon-only): `role="button"` + `aria-label` ("Zurück" / "Weiter").

### 8. Cookie consent — `partials/components/gdpr.antlers.html`

Consent trigger (`<a href="javascript:;">`) gains `role="button"`. It already exposes
a text label ("Einverstanden").

### 9. Translations — `lang/en.json`

Added English strings for the new aria-label keys:

| Key (de) | en |
| --- | --- |
| `Suchen` | Search |
| `Weiter` | Next |
| `Slider` | Slider |

(`Menü anzeigen`, `Zurück`, `Suche in Posts` already existed.)

---

## Not changed (already OK)

- **Main nav / meta / footer / breadcrumb / language links** — all carry visible text
  and `title`.
- **Social media links** — icon-only but already have a descriptive `title`.
- **Contact form submit** — has visible "Senden" text.
- **CTA / more / back / contact buttons** — icon + visible text label.

## Known follow-ups (out of scope)

- Contact form inputs use placeholders as their only label — consider real `<label>`
  elements or `aria-label` for name/email/phone/message (placeholder-only labels
  disappear on input and fail WCAG 3.3.2).
- The burger toggle and filter/slider triggers are `<a href="javascript:;">`. `role="button"`
  makes the semantics correct, but native `<button>` would also give Space-key activation
  and remove them from the link list — a larger refactor left for later.
