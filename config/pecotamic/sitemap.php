<?php

return [
    'url' => 'sitemap.xml',
    'expire' => 60,
    'include_entries' => true,
    'include_terms' => true,
    'include_collection_terms' => true,
    'entry_types' => null,
    'exclude_urls' => [],
    'filter' => \App\Sitemap\ExcludeNoindexEntries::class,
    'properties' => null,
];
