<?php

use Illuminate\Support\Facades\Route;
use Statamic\Facades\Site;
use Statamic\Facades\Term;

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

// Category data must be available before the layout renders its metadata.
$portfolioCategoryData = static function () {
  $data = ['layout' => 'layout.default', 'title' => 'Portfolio'];

  if (! $category = request()->route('category')) {
    return $data;
  }

  $term = Term::query()
    ->where('taxonomy', 'project_categories')
    ->where('site', Site::current()->handle())
    ->where('slug', $category)
    ->first();

  abort_unless($term, 404);

  // Read the current locale's own copy; untranslated fields stay empty.
  return array_merge($data, [
    'category_term_id' => $term->id(),
    'portfolio_title' => $term->get('portfolio_title') ?: $term->title(),
    'portfolio_intro' => $term->get('portfolio_intro'),
    'open_graph_title' => $term->get('open_graph_title') ?: $term->title(),
    'open_graph_description' => $term->get('open_graph_description'),
  ]);
};

Route::statamic('/en/portfolio/category/{category?}', 'project.index', $portfolioCategoryData);
Route::statamic('/portfolio/kategorie/{category?}', 'project.index', $portfolioCategoryData);

Route::statamic('/en/portfolio/tag/{tag?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]); 
Route::statamic('/portfolio/tag/{tag?}', 'project.index', [
  'layout' => 'layout.default',
  'title' => 'Portfolio',
]);
