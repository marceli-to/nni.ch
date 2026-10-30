<?php

use Illuminate\Support\Facades\Route;

// Session-specific flags must never be embedded in statically cached pages.
Route::get('/tracking/contact-success', function (\Illuminate\Http\Request $request) {
  abort_unless($request->ajax(), 404);
  $pending = $request->session()->pull('nn_contact_success');
  $confirmed = is_array($pending) && isset($pending['at']) && $pending['at'] <= time() && $pending['at'] >= time() - 300;

  return response()->json(['confirmed' => $confirmed])
    ->header('Cache-Control', 'private, no-store, max-age=0')
    ->header('Vary', 'Cookie');
})->block(5, 5);

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

Route::statamic('/en/blog/category/{category?}', 'blog.categories.index', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 
Route::statamic('/blog/kategorie/{category?}', 'blog.categories.index', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]);

Route::statamic('/en/blog/tag/{tag}', 'blog.tags.index', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 
Route::statamic('/blog/tag/{tag}', 'blog.tags.index', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 

Route::statamic('/en/blog/search', 'blog.search', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 

Route::statamic('/blog/suche', 'blog.search', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 

Route::statamic('/en/portfolio/category/{category?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]); 
Route::statamic('/portfolio/kategorie/{category?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]);

Route::statamic('/en/portfolio/tag/{tag?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]); 
Route::statamic('/portfolio/tag/{tag?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]);
