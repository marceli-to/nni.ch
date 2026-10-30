<?php

return [
    // Optional local GTM workspace preview. Never enable this on production.
    'preview_query' => env('APP_ENV') === 'local' ? env('GTM_PREVIEW_QUERY', '') : '',
];
