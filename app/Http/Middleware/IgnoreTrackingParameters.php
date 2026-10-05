<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IgnoreTrackingParameters
{
    /**
     * Hide ad and campaign parameters from the page. The static cache already
     * leaves them out of its key, so a cached page must not contain them either
     * (pagination links would otherwise pass one visitor's gclid on to everyone).
     * The browser address keeps them for Tag Manager.
     */
    public function handle(Request $request, Closure $next)
    {
        foreach (config('statamic.static_caching.disallowed_query_strings', []) as $parameter) {
            $request->query->remove($parameter);
        }

        return $next($request);
    }
}
