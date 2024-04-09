<?php

use Illuminate\Support\Facades\Route;

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
]);

Route::statamic('/en/blog/tag/{tag}', 'blog.tags.index', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 
Route::statamic('/blog/tag/{tag}', 'blog.tags.index', [
  'layout' => 'layout.default',
]); 

Route::statamic('/en/blog/search', 'blog.search', [
  'layout' => 'layout.default',
  'title' => 'Blog',
]); 

Route::statamic('/blog/suche', 'blog.search', [
  'layout' => 'layout.default',
]); 

