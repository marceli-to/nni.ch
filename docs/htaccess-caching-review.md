# .htaccess Caching Review

**Date:** 2026-07-04
**File:** `public/.htaccess`
**Scope:** Verify browser-caching coverage (images, webfonts, CSS/JS, video) and improve.

## Summary

Caching coverage was already **complete** — every relevant type had an expiry
rule. The problem was **duplication and conflict**, not gaps. The file had
accumulated three overlapping `mod_expires.c` blocks plus a duplicate
compression block and a duplicate `Header unset ETag`, added incrementally over
time. Where the same type appeared in multiple blocks, Apache silently used the
last declaration, making the effective TTLs hard to reason about.

## What was there (before)

| Resource            | Effective TTL | Notes |
|---------------------|---------------|-------|
| CSS / JS            | 1 year        | Declared in 3 blocks (1 month + 1 year + 1 year) |
| Web fonts           | 1 year        | 1 month in block 1, overridden to 1 year in block 3 |
| Images (jpg/png/…)  | 1 month       | OK |
| SVG                 | 1 month       | One block had invalid `"access 1 month"` (missing `plus`) |
| Video (mp4/webm)    | 1 year / 1 month | Conflicting between blocks |
| HTML                | 0 s / 600 s   | Conflicting between blocks |

### Issues found
1. **Three `mod_expires.c` blocks** (lines ~281–385, 387–407, 410–428) with
   overlapping and conflicting `ExpiresByType` values.
2. **Duplicate compression block** (`mod_deflate`) at the end repeating a subset
   of the full h5bp compression block near the top.
3. **Duplicate `Header unset ETag` / `FileETag None`**.
4. **No `immutable`** directive on fingerprinted assets → browsers still
   revalidate on reload despite the 1-year TTL.
5. **No Brotli** — only gzip (`mod_deflate`) was configured.

## Changes made

Consolidated to a single canonical h5bp `mod_expires.c` block and removed the
two redundant expires blocks + the duplicate compression/ETag blocks. Then:

- **Fonts bumped to 1 year** in the canonical block (was a mix of 1 month / 1
  year). Safe because fonts ship from Vite's content-hashed build output
  (`MetaPro-4d6c1560.woff2`).
- **`immutable` added** for fingerprinted assets via a single `FilesMatch` on
  `css|js|mjs|woff|woff2|ttf|otf|eot`:
  `Cache-Control: public, max-age=31536000, immutable`. This skips revalidation
  for the full year.
- **Images deliberately excluded from `immutable`.** Files in `public/assets/`
  (`*.jpg`, `*.png`) are **not** fingerprinted, so they keep the conservative
  1-month TTL — a longer/immutable TTL there would serve stale images after a
  content swap.
- **Brotli block added** (`mod_brotli`) for text types, with gzip
  (`mod_deflate`) retained as the fallback for older clients. WOFF/WOFF2 are
  excluded from compression (already compressed); only uncompressible `ttf`/`otf`
  font formats are included.

## Rationale: hashed vs. non-hashed

| Path                | Fingerprinted? | Cache strategy |
|---------------------|----------------|----------------|
| `public/build/*`    | Yes (Vite hash)| 1 year + `immutable` |
| `public/assets/*`   | No             | 1 month, revalidate |

## Follow-ups (not done)

- Consider serving pre-compressed `.br`/`.gz` static files if the host lacks
  on-the-fly Brotli.
- If images ever move behind a fingerprinted/CDN pipeline, they can also become
  `immutable` with a 1-year TTL.
- Security headers (CSP, X-Content-Type-Options, Referrer-Policy) are out of
  scope here but worth a separate pass.
