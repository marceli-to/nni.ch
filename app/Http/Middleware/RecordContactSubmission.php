<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RecordContactSubmission
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // SubmissionCreated follows validation and anti-spam checks. Also wait
        // for the controller to finish, including dispatching the emails.
        if ($request->isMethod('POST') && $request->attributes->get('nn_contact_created') && $response->getStatusCode() < 400) {
            $request->session()->put('nn_contact_success', ['id' => (string) \Illuminate\Support\Str::uuid(), 'at' => time()]);
        }

        return $response;
    }
}
