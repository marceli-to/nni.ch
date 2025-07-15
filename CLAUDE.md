# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Statamic CMS** website built on **Laravel 10** for Nightnurse Images, a Swiss architectural visualization company. The site is **multilingual** (German as default, English as secondary) and features a portfolio, blog, team pages, and job listings.

## Key Technologies & Architecture

- **Backend**: Laravel 10 with Statamic CMS (flat-file CMS)
- **Frontend**: Tailwind CSS, Alpine.js, Antlers templating engine
- **Build**: Vite for asset compilation
- **Content**: Flat-file based content management in `content/` directory
- **Multilingual**: German (default) and English locales configured

## Development Commands

### Build & Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Laravel artisan commands
php artisan [command]
```

### Testing
Currently no specific test commands are configured in package.json. Use Laravel's built-in testing:
```bash
php artisan test
```

## Project Structure

### Content Management
- `content/collections/` - Blog posts, projects, team members, jobs
- `content/globals/` - Site-wide settings and contact information
- `content/navigation/` - Menu structures
- `content/taxonomies/` - Categories and tags
- `content/trees/` - Content organization per locale (de/en)

### Frontend Templates
- `resources/views/` - Antlers templates (.antlers.html)
- `resources/views/layout/` - Base layout templates
- `resources/views/partials/` - Reusable components
- `resources/css/` - Tailwind CSS styling
- `resources/js/` - Alpine.js modules and interactions

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
- **Images**: Organized in `public/assets/` with automated processing

## Development Workflow

1. **Content changes**: Edit markdown files in `content/` directory
2. **Template changes**: Modify `.antlers.html` files in `resources/views/`
3. **Styling**: Update Tailwind classes or add custom CSS in `resources/css/`
4. **JavaScript**: Modify Alpine.js components in `resources/js/`
5. **Build**: Run `npm run dev` for development or `npm run build` for production

## Important Notes

- Content is stored as flat files, not in a database
- The site uses extensive custom Tailwind spacing (numbered 1-300)
- Custom font family configuration for Meta Pro typography
- Video and image handling modules are integrated
- Forms use Statamic's built-in form handling with reCAPTCHA integration