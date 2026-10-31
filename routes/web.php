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

// Tag listings would all share their route's title and have no description,
// so each tag gets its own. Years are indexed (see layout/head) and worded as
// such; other tags are noindex and get a plain line. German strings are the
// translation keys in lang/en.json. An unknown tag keeps the plain data and is
// turned away by the view.
$tagListingData = static function (string $title, array $year, array $other) {
  return static function () use ($title, $year, $other) {
    $data = ['layout' => 'layout.default', 'title' => $title];

    if (! $tag = request()->route('tag')) {
      return $data;
    }

    $term = Term::query()
      ->where('taxonomy', 'tags')
      ->where('site', Site::current()->handle())
      ->where('slug', $tag)
      ->first();

    if (! $term) {
      return $data;
    }

    [$heading, $description] = is_numeric($tag) ? $year : $other;

    return array_merge($data, [
      'open_graph_title' => __($heading, ['name' => $term->title()]),
      'open_graph_description' => __($description, ['name' => $term->title()]),
    ]);
  };
};

$blogTagData = $tagListingData('Blog', [
  'Blogbeiträge aus dem Jahr :name',
  'Beiträge aus dem Jahr :name im Blog von Nightnurse Images: Projekte, Wissen rund um Visualisierung, Einblicke ins Studio und Events.',
], [
  'Blog: :name',
  'Beiträge im Blog von Nightnurse Images zum Stichwort «:name».',
]);

Route::statamic('/en/blog/tag/{tag}', 'blog.tags.index', $blogTagData);
Route::statamic('/blog/tag/{tag}', 'blog.tags.index', $blogTagData);

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

$portfolioTagData = $tagListingData('Portfolio', [
  'Projekte aus dem Jahr :name',
  'Visualisierungen und Filme von Nightnurse Images aus dem Jahr :name: Projekte für Wettbewerbe, Immobilienvermarktung und öffentliche Planung.',
], [
  'Projekte: :name',
  'Ausgewählte Projekte von Nightnurse Images zum Stichwort «:name».',
]);

Route::statamic('/en/portfolio/tag/{tag?}', 'project.index', $portfolioTagData);
Route::statamic('/portfolio/tag/{tag?}', 'project.index', $portfolioTagData);
