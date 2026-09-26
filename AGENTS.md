# AGENTS.md

This file provides guidance to coding agents (Claude Code, Codex, Cursor and
others) when working with code in this repository. `CLAUDE.md` points here; keep
this file as the single source of truth.

## Project Overview

This is a **Statamic CMS** website built on **Laravel 11** for Nightnurse Images, a Swiss architectural visualization company. The site is **multilingual** (German as default, English as secondary) and features a portfolio, blog, team pages, and job listings.

## Key Technologies & Architecture

- **Backend**: PHP ^8.2, Laravel 11 with Statamic 5 (flat-file CMS)
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

Changes flow local → staging → production:

- **Local**: `nightnurse.test`
- **Staging**: `staging.nightnurse.ch`
- **Production**: `nightnurse.ch`

Deployment is a `git pull` on the server. Compiled assets are **built locally and
committed** — `public/build/` is versioned, so the server never runs `npm run build`.
Building there writes new hashed bundles and rewrites `manifest.json`, which then
blocks the next pull with local modifications that look like someone's work.

## Project Structure

### Content Management
- `content/collections/` - Blog posts, projects, team members, jobs
- `content/globals/` - Site-wide settings and contact information
- `content/navigation/` - Menu structures
- `content/taxonomies/` - Categories and tags
- `content/trees/` - Content organization per locale (de/en)

Note: `content/`, `public/assets/`, `public/img/` and `users/` are **git-ignored**
— they live on the server, not in this repository.

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

## Key Features & Components

### Multilingual Setup
- German (default): `/` 
- English: `/en/`
- Content structure mirrors in `content/collections/[collection]/de/` and `content/collections/[collection]/en/`

### Content Types
- **Posts**: Blog entries with categories and tags
- **Projects**: Portfolio items with project categories
- **Team**: Team member profiles with categories
- **Jobs**: Job listings
- **Pages**: Static pages (about, contact, etc.)

### Frontend Architecture
- **Antlers Templates**: Statamic's templating engine
- **Alpine.js**: For interactive components
- **Tailwind CSS**: Utility-first CSS framework with extensive custom spacing scale
- **Swiper**: For carousels and sliders
- **Custom Components**: Modular partial system in `resources/views/partials/`

### Asset Management
- **Vite**: Modern build tool for CSS/JS compilation
- **Custom Fonts**: Meta Pro font family
- **Images**: Stored in `public/assets/` (git-ignored) and resized on request through Statamic's Glide presets

## Development Workflow

1. **Content changes**: Edit markdown files in `content/` directory
2. **Template changes**: Modify `.antlers.html` files in `resources/views/`
3. **Styling**: Update Tailwind classes or add custom CSS in `resources/css/`
4. **JavaScript**: Modify the modules in `resources/js/`
5. **Build**: Run `npm run dev` for development or `npm run build` for production

## Important Notes

- Content is stored as flat files, not in a database
- The site uses extensive custom Tailwind spacing (numbered 1-300)
- Custom font family configuration for Meta Pro typography
- Video and image handling modules are integrated
- Forms use Statamic's built-in form handling with reCAPTCHA integration

## Project Notes

Vor jeder Erstellung oder Überarbeitung einer Project Note den vollständigen
Redaktionsstandard in `docs/project-content-standard-de.md` lesen und befolgen.
Er ist verbindlich für Recherche, Bilder, Veröffentlichbarkeit, Inhalte,
Metadaten, Tags und Lokalisierungen.

## FTP upload packages

Some changes still reach production by manual FTP upload. Prepare such an upload as a
**plain folder, never a zip archive**, under the git-ignored top-level directory
`ftp-uploads/`. Name the folder with the date first, then a short description, for example
`2026-09-17_wochenupdate`. Put the files to transfer into a subfolder `upload/`, mirroring
the paths they have on the server.

Keep these packages spare, and build them with as few tokens as possible: no file
inventories, no change logs, no step-by-step instructions, no accompanying documents. A
folder of files is what is wanted. At most add one short `readme.txt` saying that the
*contents* of `upload/` go into the root directory of `production.nightnurse.ch` on the FTP
server, keeping the folder structure and replacing existing files. If something operational
cannot be derived from the files themselves — for example stale files that have to be
deleted on the server afterwards — put those few lines in that same `readme.txt`.

Do not invent other locations or formats such as `upload-packages/` or a zip archive.

## Documentation

### Local experiments and prototypes

Use the git-ignored top-level directory `scratch/` for temporary experiments,
standalone prototypes and test outputs. Group them by topic and date, for example
`scratch/startseite-2026-09-23/`. Keep durable project documentation in `docs/`;
FTP upload packages still belong in `ftp-uploads/`.

### Project documentation

- `docs/developer-todos.md` — the living briefing for the external developer: implemented
  changes with consequences, known bugs and open development tasks. It is forwarded once
  Christoph's own work is done, so it contains neither his to-dos (uploads, live checks,
  re-checks, open questions to him) nor editorial content details; those belong in the
  internal lists under `docs/intern/`
- `docs/project-content-standard-de.md` — binding editorial standard for Project Notes
- `docs/seo-gsc-canonical-audit-2026-09-07.md` — Search Console canonical finding; checked
  again on 25 September, no code change needed, re-check pending
- `docs/cleanup/`, `docs/frontend-refactor.md`, `docs/scroll-animation-optimization.md`,
  `docs/accessibility-aria.md`, `docs/htaccess-caching-review.md`, `docs/seo-investigation.md` —
  records of completed work, kept for history
- `docs/website-textarchiv-2026-08-31/` — archived website texts from before the relaunch
