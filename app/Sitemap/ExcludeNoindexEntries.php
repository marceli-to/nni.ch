<?php

namespace App\Sitemap;

final class ExcludeNoindexEntries
{
    public function __invoke(mixed $entry): bool
    {
        return ! method_exists($entry, 'value') || ! (bool) $entry->value('noindex');
    }
}
