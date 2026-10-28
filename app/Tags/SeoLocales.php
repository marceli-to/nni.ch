<?php

namespace App\Tags;

use Statamic\Facades\Site;
use Statamic\Facades\Term;
use Statamic\Tags\Collection\Entries;
use Statamic\Tags\Locales;
use Statamic\Tags\Parameters;

class SeoLocales extends Locales
{
    public function index()
    {
        // These listing routes have no entry for the native locales tag to resolve.
        $listing = match (request()->route()?->uri()) {
            'blog/kategorie/{category?}', 'en/blog/category/{category?}' => ['posts', 'post_categories', 'category', ['de' => 'blog/kategorie', 'en' => 'blog/category']],
            'portfolio/kategorie/{category?}', 'en/portfolio/category/{category?}' => ['projects', 'project_categories', 'category', ['de' => 'portfolio/kategorie', 'en' => 'portfolio/category']],
            'blog/tag/{tag}', 'en/blog/tag/{tag}' => ['posts', 'tags', 'tag', ['de' => 'blog/tag', 'en' => 'blog/tag']],
            'portfolio/tag/{tag?}', 'en/portfolio/tag/{tag?}' => ['projects', 'tags', 'tag', ['de' => 'portfolio/tag', 'en' => 'portfolio/tag']],
            default => null,
        };

        if (! $listing) {
            return parent::index();
        }

        // A search query replaces the listing with search results, not a translation.
        if (request()->filled('q')) {
            return '';
        }

        [$collection, $taxonomy, $parameter, $paths] = $listing;
        $slug = request()->route($parameter);
        $term = $slug ? Term::query()
            ->where('taxonomy', $taxonomy)
            ->where('site', Site::current()->handle())
            ->where('slug', $slug)
            ->first() : null;

        if ($slug && ! $term) {
            return '';
        }

        // Blog listings use 18 posts per page; never point at a missing target page.
        $page = $collection === 'posts'
            ? (filter_var(request()->query('page', 1), FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) ?: 1)
            : 1;
        $locales = [];

        foreach (Site::all() as $handle => $site) {
            if (! isset($paths[$handle]) || ($term && ! $term->taxonomy()->sites()->contains($handle))) {
                continue;
            }

            $localized = $term?->in($handle);
            $path = $paths[$handle].($localized ? '/'.rawurlencode($localized->slug()) : '');

            // Empty portfolio filters and blog tags render a 404 in their templates.
            if (($term && ($collection === 'projects' || $parameter === 'tag')) || $page > 1) {
                $filters = [
                    'from' => $collection,
                    'site' => $handle,
                ];

                if ($localized) {
                    $filters['taxonomy:'.$taxonomy] = $localized->id();
                }

                $count = (new Entries(Parameters::make($filters, $this->context)))->count();

                if ($count === 0 || ($page > 1 && $count <= ($page - 1) * 18)) {
                    continue;
                }
            }

            $locales[] = [
                'locale' => ['short_locale' => $site->shortLocale(), 'handle' => $handle],
                'permalink' => $site->absoluteUrl().'/'.$path.($page > 1 ? '?page='.$page : ''),
            ];
        }

        // An empty Antlers array still renders the loop body once; return a string.
        return collect($locales)->contains(fn ($locale) => $locale['locale']['handle'] === Site::current()->handle())
            ? $locales : '';
    }
}
