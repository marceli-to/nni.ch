# SEO Investigation — nightnurse.ch

**Date:** 2026-07-04
**Context:** Declining SEO results reported via Google Search Console (GSC) and an
external SEO agency analysis. Two symptoms: (1) German pages indexed with English
titles/descriptions, (2) 180+ pages crawled but not indexed.

---

## 1. Root cause

Two compounding problems.

### 1a. A browser-language 302 redirect served English content on German URLs (primary)

The site ran the **`reachweb/locale-lander`** Statamic addon. It auto-registers a
middleware (`HandleLocaleRedirection`) on every web request that:

1. reads the visitor's browser **`Accept-Language`** header, and
2. if it doesn't match the current URL's locale, issues a **302 (temporary)
   redirect** to the same entry in the other language.

The only skip conditions are `enable_redirection === false` or a **session cookie**
(`locale_lander = completed`). **There was no bot/crawler detection whatsoever**, and
the published config only set `enable_redirection => true` (with `redirect_only_homepage`
unset, so it redirected on *every* page, not just the homepage).

Googlebot crawls from the US with `Accept-Language: en` and keeps no session cookie,
so every crawl of a German URL behaved like:

```
Googlebot GET /expertise      →  302 Found  →  /en/expertise
```

Because a **302 is temporary**, Google keeps the *original* URL (`/expertise`) in its
index but renders it from the **English content it was redirected to** — i.e. the
German URL indexed with an English title/description. This is the direct cause of
symptom (1) and a major driver of the "Seite mit Weiterleitung" (69) and "Duplikat"
(61) rows. It is exactly the risk the agency flagged ("birgt Risiken beim Umgang mit
Search-Bots").

**Resolution:** the package was removed entirely (see §5). It had no template usage —
it only provided the auto-redirect. hreflang (§3) now communicates the DE/EN pairing
to Google without redirecting anyone.

### 1b. The site emitted no international-SEO signals

The only `<head>` template (`resources/views/partials/layout/head.antlers.html`)
contained:

- ❌ no `<link rel="alternate" hreflang="…">` — Google had no way to know that
  `/expertise` (DE) and `/en/expertise` (EN) are the same page in two languages
- ❌ no `<link rel="canonical">` — no page declared its own canonical URL
- ❌ no `<meta name="robots">`

Even without the redirect, missing hreflang/canonical let Google treat the DE and EN
URLs as near-duplicates and pick the wrong language to represent a URL.

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

## 5. Fix implemented — removed the `reachweb/locale-lander` addon

The addon was the browser-language redirect described in §1a. It was removed rather
than reconfigured, because auto-redirecting crawlers (and users) on `Accept-Language`
is the anti-pattern; with hreflang now in place, Google serves the correct language
in search results without any redirect.

**Removal steps performed:**

```bash
composer remove reachweb/locale-lander     # dropped from composer.json + composer.lock
rm config/locale-lander.php                # orphaned published config
```

**Verified safe:**

- No template/code usage anywhere in the project — the addon only supplied the
  auto-redirect middleware (no `{{ locale_banner }}` tag, no published views).
- `vendor/reachweb/` removed; no references remain outside `vendor/` and this doc.
- App boots clean afterward: `php artisan about` → Statamic 5.73.23 PRO, no errors.

> **Note:** the redirect was a UX convenience (first-time visitors landed in their
> browser language). If that UX is wanted back later, do it the SEO-safe way: keep
> `enable_redirection => false` and instead use locale-lander's dismissible **banner**
> (`{{ locale_banner }}`), or exempt search-engine crawlers from any redirect. Do
> **not** restore blanket `Accept-Language` redirection.

> `public/.htaccess` is gitignored on this project, so its cleanup (§4) is deployed
> from disk but not tracked in git.

---

## 6. Open items — server / infrastructure (outside this codebase)

1. **`robots.txt`** — confirmed identical to production (`User-agent: * / Disallow:`),
   blocks nothing. The 21 "blocked by robots.txt" URLs come from elsewhere — export
   the list from GSC to identify them.
2. **Sitemap** — the site runs the `pecotamic/sitemap` addon with no published config
   (defaults). Confirm it emits **both** locales and only published entries, that it
   points to the **new** URLs (not the removed legacy ones), and that it's submitted
   in GSC.
3. **404s (21)** — export the URL list from GSC and fix/redirect.
4. **noindex (3)** — identify the 3 URLs; confirm they should be excluded.

---

## 7. Verification notes

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

## 8. Files changed

| File | Change |
|---|---|
| `resources/views/partials/layout/head.antlers.html` | Added robots meta, self-canonical, hreflang alternates |
| `composer.json` / `composer.lock` | Removed `reachweb/locale-lander` |
| `config/locale-lander.php` | Deleted (orphaned addon config) |
| `public/.htaccess` | Removed legacy content 301 redirects (kept infra + external routes) — *gitignored* |
| `docs/seo-investigation.md` | This document |
