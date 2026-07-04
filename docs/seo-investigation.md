# SEO Investigation — nightnurse.ch

**Date:** 2026-07-04
**Context:** Declining SEO results reported via Google Search Console (GSC) and an
external SEO agency analysis. Two symptoms: (1) German pages indexed with English
titles/descriptions, (2) 180+ pages crawled but not indexed.

---

## 1. Root cause

The site emitted **no international-SEO signals at all**. The only `<head>` template
(`resources/views/partials/layout/head.antlers.html`) contained:

- ❌ no `<link rel="alternate" hreflang="…">` — Google had no way to know that
  `/expertise` (DE) and `/en/expertise` (EN) are the same page in two languages
- ❌ no `<link rel="canonical">` — no page declared its own canonical URL
- ❌ no `<meta name="robots">`

With neither hreflang nor canonical, Google treated the DE and EN URLs as
near-duplicates and consolidated them on its own — frequently choosing the *wrong*
language's title/description to represent a URL. This is the direct cause of
symptom (1) and a major contributor to (2).

The data required for hreflang already existed in the app: the language switcher
(`resources/views/partials/menu/language/wrapper.antlers.html`) loops
`{{ locales }}` and reads `{{ permalink }}` per localization. It was used only for
the visible switcher, never emitted into `<head>`.

---

## 2. Google Search Console report — interpretation

| GSC reason | Pages | Meaning / action |
|---|---|---|
| **Seite mit Weiterleitung** | 69 | Old URLs that `.htaccess` 301-redirects (e.g. `/unternehmen/team/*` → `/team/*`, `/de/*`). Benign/expected. See §4. |
| **Duplikat – vom Nutzer nicht als kanonisch festgelegt** | 61 | Literal fingerprint of missing canonical tags. Fixed by §3. |
| **Nicht gefunden (404)** | 21 | Real dead links. Needs a URL export from GSC to hunt down. **Open.** |
| **Durch robots.txt blockiert** | 21 | The production `robots.txt` is `Disallow:` (blocks nothing). These are likely `/cp`, Glide image, or query-param URLs. Confirmed the downloaded robots.txt is identical to production. **Verify which URLs in GSC.** |
| **Durch "noindex"-Tag ausgeschlossen** | 3 | No `noindex` exists anywhere in the templates. Likely the sitemap addon's default on unpublished entries (39 unpublished entries exist). **Confirm the 3 URLs should be excluded.** |
| **Gecrawlt – zurzeit nicht indexiert** | 144 | Weak/conflicting signals from missing canonical/hreflang push Google to skip indexing. Improved by §3. |
| **Gefunden – zurzeit nicht indexiert** | 66 | Same as above. |
| Soft 404 | 0 | — |
| Indexiert, obwohl durch robots.txt blockiert | 0 | — |

`144 + 66 = 210` crawled/found-but-not-indexed ≈ the "183 not indexed" the agency
cited (the number had grown).

---

## 3. Fix implemented — `<head>` international-SEO tags

**File:** `resources/views/partials/layout/head.antlers.html`

Added, right after the `<meta name="description">` line:

```antlers
{{ if noindex }}<meta name="robots" content="noindex, follow">{{ else }}<meta name="robots" content="index, follow">{{ /if }}
<link rel="canonical" href="{{ permalink ?? current_url }}">
{{ locales }}
<link rel="alternate" hreflang="{{ locale:short_locale }}" href="{{ permalink }}">
{{ if locale:handle == 'de' }}<link rel="alternate" hreflang="x-default" href="{{ permalink }}">{{ /if }}
{{ /locales }}
```

**Behaviour (verified against real entry data, see §6):**

- `<meta name="robots" content="index, follow">` on every page — matches the
  agency's explicit recommendation. Supports a per-entry `noindex` field for future
  overrides (drafts, thin pages) without touching the template.
- Self-referencing `<link rel="canonical">` using the entry's own absolute permalink
  (falls back to `current_url` on taxonomy/route listing pages that have no entry).
- hreflang alternates generated from the entry's actual localizations, e.g. for
  `/expertise`:
  ```html
  <link rel="alternate" hreflang="de" href="https://www.nightnurse.ch/expertise">
  <link rel="alternate" hreflang="en" href="https://www.nightnurse.ch/en/expertise">
  <link rel="alternate" hreflang="x-default" href="https://www.nightnurse.ch/expertise">
  ```
  `x-default` points to the German (default) version, per the agency's example.
  Pages that exist in only one language emit only that language's tag — exactly as
  the agency advised ("nicht vorhandene Sprache einfach weglassen").

hreflang/canonical render only on entry pages (where `{{ locales }}`/`permalink`
resolve). Paginated taxonomy/route listing pages still get the robots tag and a
`current_url` canonical.

---

## 4. Fix implemented — `.htaccess` legacy redirect cleanup

**File:** `public/.htaccess`

Removed the legacy URL-restructure redirects that are no longer needed (these were
the source of the harmless "Seite mit Weiterleitung" GSC rows):

```
REMOVED:  ^offerte  ^unternehmen/team/(.+)  ^en/company/team/(.+)
          ^de/produkte  ^en/products  ^de/kontakt  ^de/profil
          ^en/profile  ^de
```

**Kept (still active / route to live external systems):**

```
KEPT:     ^3d_modelle_exportieren  ^exporting_3d_models  (Notion docs)
          ^360  ^vertec  ^share                          (subdomains)
          + all infrastructure: HTTPS-force, www-force, acme-challenge,
            trailing-slash, front-controller
```

> ⚠️ **SEO note:** removing the legacy 301s turns those old indexed URLs into 404s.
> Because link equity has long since transferred, this is acceptable, but expect the
> "Seite mit Weiterleitung" count to move toward "Nicht gefunden (404)" temporarily
> until Google drops the old URLs.

---

## 5. Open items — server / infrastructure (outside this codebase)

1. **Browser-language redirect.** The agency observed a redirect that sends
   English-browser visitors from `nightnurse.ch` → the English version. It is **not**
   in `public/.htaccess`, the app code, or the JS — it lives at the server/edge/proxy
   layer. Googlebot crawls predominantly from the US with English preferences, so it
   may be served English content on German URLs. **Action for the server admin:**
   confirm Googlebot is exempted from this redirect (or that the redirect is removed).
2. **`robots.txt`** — confirmed identical to production (`User-agent: * / Disallow:`),
   blocks nothing. The 21 "blocked by robots.txt" URLs come from elsewhere — export
   the list from GSC to identify them.
3. **Sitemap** — the site runs the `pecotamic/sitemap` addon with no published config
   (defaults). Confirm it emits **both** locales and only published entries, that it
   points to the **new** URLs (not the removed legacy ones), and that it's submitted
   in GSC.
4. **404s (21)** — export the URL list from GSC and fix/redirect.
5. **noindex (3)** — identify the 3 URLs; confirm they should be excluded.

---

## 6. Verification notes

- Confirmed `short_locale` and `handle` are exposed on Statamic's augmented Site
  object (`vendor/statamic/cms/src/Sites/Site.php` `toAugmentedArray`).
- Verified the exact per-locale data the `{{ locales }}` loop produces for a real
  entry via `artisan tinker`:
  ```
  hreflang=de  handle=de  href=https://…/expertise
  hreflang=en  handle=en  href=https://…/en/expertise
  ```
- The `{{ locales }}` tag is the same construct the production language switcher
  already uses successfully, so the head-partial output renders identically in a real
  request.
- **Not** verified via full end-to-end HTTP render: this machine has no Valet/Herd,
  so `artisan serve` on `127.0.0.1` cannot resolve the multisite host and all entry
  pages 404 locally. Recommend a final visual check on staging/production:
  `curl -s https://www.nightnurse.ch/expertise | grep -iE 'hreflang|canonical|robots'`.

---

## 7. Files changed

| File | Change |
|---|---|
| `resources/views/partials/layout/head.antlers.html` | Added robots meta, self-canonical, hreflang alternates |
| `public/.htaccess` | Removed legacy content 301 redirects (kept infra + external routes) |
| `docs/seo-investigation.md` | This document |
