# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, Cursor and
others) when working with code in this repository. `CLAUDE.md` points here; keep
this file as the single source of truth.

## Project Overview

This is a **Statamic CMS** website built on **Laravel 12** for Nightnurse Images, a Swiss architectural visualization company. The site is **multilingual** (German as default, English as secondary) and features a portfolio, blog, team pages, and job listings.

## Key Technologies & Architecture

- **Backend**: PHP 8.3+ (production runs 8.3), Laravel 12 with Statamic 6 (flat-file CMS)
- **Frontend**: Tailwind CSS, Alpine.js, Antlers templating engine
- **Build**: Vite for asset compilation
- **Content**: Flat-file based content management in `content/` directory
- **Multilingual**: German (default) and English locales configured

## Development Commands

### Build & Development
```bash
# Install exactly the versions pinned in package-lock.json
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Laravel artisan commands
php artisan [command]
```

Install the frontend dependencies with `npm ci`, not with pnpm or yarn. The lock file
is `package-lock.json`; the other tools ignore it and take the newest versions the
ranges in `package.json` allow, so a build from such an installation no longer matches
the committed one. In September 2026 a pnpm installation bundled Alpine.js 3.16.3
instead of the locked 3.14.9 and produced a new script hash without any change to the
source.

### Testing
No project-specific tests exist yet — `tests/` holds only the default Laravel
examples, and `package.json` defines no test script. Use Laravel's built-in testing:
```bash
php artisan test
```

## Environments

Changes flow local → production. Christoph tests locally before deployment; staging is
not a required intermediate step (decision of 2 October 2026).

- **Local**: `nightnurse.test`
- **Staging**: `staging.nightnurse.ch`
- **Production**: `nightnurse.ch`

Deployment is a `git pull` on the server. Compiled assets are **built locally and
committed** — `public/build/` is versioned, so the server never runs `npm run build`.
Building there writes new hashed bundles and rewrites `manifest.json`, which then
blocks the next pull with local modifications that look like someone's work.

For code changes, update the local checkout first, test locally, commit and push, then
deploy directly to production over SSH. Templates, blueprints, fieldsets, translations,
configuration and compiled assets belong to this Git workflow, never to a direct upload.

Git-ignored content is edited in the CMS or uploaded directly over SSH (`scp` with the
deployment key): only the changed files, each to the same path below the server's project
root. There are no upload packages and no FTP. `content/` belongs in the project root,
outside `public/`; original assets and their `.meta` files belong in `public/assets/`.
After an upload, run `php please stache:refresh` and `php please static:clear` on the
server and check the affected pages. `resources/views/partials/content/` contains
templates and is code, despite the directory name. There is no blanket content sync or
live comparison unless requested.

`public/.htaccess` is git-ignored and is the manual configuration exception: when it
actually needs changing, back up the current production file, amend the relevant rules,
upload it to the same path over SSH and check the affected URLs. Preserve existing
hoster, redirect and cache rules. Do not include it in ordinary content uploads.

`vendor/` is not versioned either. Whenever a pull changes `composer.lock`, run
`composer install --no-dev --optimize-autoloader` on the server right after it, then clear
the caches (`php artisan optimize:clear`, `php please stache:refresh`,
`php please static:clear`). Wrap the three steps in `php artisan down` / `php artisan up`:
between pull and install the code and `vendor/` do not match.

Statamic caches each Glide image under the preset name, not under the preset's settings.
When a pull changes the presets in `config/statamic/assets.php`, run `php please glide:clear`
on the server right after it, or the old files keep being served. Every image is then
generated again on its first request, so request the pages and their images once
afterwards, before visitors do.

Before pulling, check `git status` on the server. Versioned files changed directly on the
server show up as modifications or untracked files and block the pull; compare them with Git before
discarding anything, since a change may exist only on the server. Anything uploaded into
`public/` is publicly reachable — templates, blueprints or content placed there by mistake
must be moved out of the web root at once.

## Project Structure

### Content Management
- `content/collections/` - Blog posts, projects, team members, jobs
- `content/globals/` - Site-wide settings and contact information
- `content/navigation/` - Menu structures
- `content/taxonomies/` - Categories and tags
- `content/trees/` - Content organization per locale (de/en)

Note: `content/`, `public/assets/`, `public/img/` and `users/` are **git-ignored**
— they live on the server, not in this repository.

`public/llms.txt` is a hand-written, versioned overview of the main pages for AI tools.
Update it when a main page, service page or portfolio category is added, renamed or
removed.

### Frontend Templates
- `resources/views/` - Antlers templates (.antlers.html)
- `resources/views/layout/` - Base layout templates
- `resources/views/partials/` - Reusable partials, organised as `content/` (content-model
  specific), `fieldsets/` (page-builder blocks), `layout/`, `menu/` and `ui/` (generic reusable)
- `resources/css/` - Tailwind CSS styling
- `resources/js/` - Vanilla ES modules (sliders, observers, video, carousel); Alpine.js is
  started in `app.js` and used declaratively via `x-data` in the templates

### Configuration
- `config/statamic/` - Statamic-specific configurations
- `config/statamic/sites.php` - Multilingual site setup
- `tailwind.config.js` - Custom Tailwind configuration with extended spacing, typography, and colors

## Key Features

- **Multilingual**: German (default) under `/`, English under `/en/`; entries mirror in
  `content/collections/<collection>/de/` and `…/en/`.
- **Frontend**: Swiper for carousels and sliders, Meta Pro as the house font, Tailwind with
  a custom spacing scale numbered 1–300.
- **Images**: originals in `public/assets/` (git-ignored), resized on request through
  Statamic's Glide presets.
- **Forms**: Statamic's form handling with reCAPTCHA.

## Texte der Website

Vor jeder Erstellung oder Überarbeitung von Texten der Website den Redaktionsstandard
anwenden: den Skill `nightnurse-marketing:website-content` und die Referenz «Sprache» von
`nightnurse-brand:corporate-identity`. Beide liegen im privaten Repository
`Nightnurse-Images/nightnurse-skills`; ohne installierte Plugins dort unter
`plugins/nightnurse-marketing/skills/website-content/` und
`plugins/nightnurse-brand/skills/corporate-identity/references/sprache.md` lesen. Sie sind
verbindlich für alle Seiten, Project Notes und Blogbeiträge in beiden Sprachen. Neue
redaktionelle Regeln gehören dorthin, nicht in dieses Repository.

## Documentation

### Local experiments and prototypes

Use the git-ignored top-level directory `scratch/` for temporary experiments,
standalone prototypes and test outputs. Group them by topic and date, for example
`scratch/startseite-2026-09-23/`. Keep durable project documentation in `docs/`.

### Project documentation

- `docs/intern/README.md` — entry point for current website planning. Keep SEO/GEO
  in `seo-geo.md`, practical content improvements in `website-verbesserungen.md`,
  and longer-term structure and product decisions in `website-weiterentwicklung.md`.
  Keep each task in one current list and link across topics. Completed work, dated
  audits and superseded plans belong in `docs/intern/archiv/`, not in active lists.
  These internal documents are local and excluded through `.git/info/exclude`.
- `docs/developer-todos.md` — the single current list of open technical points, including
  responsibilities, conditional tasks and outstanding verification. It exists only while
  such points are open: delete it once the last item is done and create it again for the
  next one, so links to it from `docs/intern/` may point nowhere for a while. Keep only work that
  remains to be done: remove completed or deliberately declined items entirely. Open items
  keep the number they had in the version sent to the client. Do not add
  sections such as "Umgesetzt, mit Folgen", implementation histories or routine deployment
  instructions; those belong in Git history, `AGENTS.md` or internal operating notes.
  Editorial content details belong in the internal lists under `docs/intern/`.
  The file lives only in the local working copy and is
  excluded through `.git/info/exclude`: this repository is public, and the briefing lists
  open weaknesses of the live site. Do not commit it; the lasting explanation of a code
  change belongs in its commit message.
- `docs/website-textarchiv-2026-08-31/` — archived website texts from before the relaunch
