<?php
namespace App\Console\Commands;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\User;
use Statamic\Facades\Taxonomy;
use Corcel\Model\Post;
use Illuminate\Console\Command;

/**
 * To do:
 * - [x] Handle categories
 * - [x] Handle tags
 * - [ ] Handle images
 * - [ ] Handle featured image
 * - [ ] Handle comments
 * - [ ] Handle custom fields
 * - [x] Handle authors
 * 
 */

class ImportWordPress extends Command
{
  protected $signature = 'import:wp';

  protected $description = 'Import posts from WordPress';

  public function __construct()
  {
    parent::__construct();
  }

  public function handle()
  {
    $posts = Post::type('post')
      ->orderBy('post_date', 'desc')
      ->published()
      ->limit(5)
      ->get();


    foreach ($posts as $post)
    {
      $user_email = $post->author->user_email;

      // Get all users
      $users = User::all();

      // Get post user by email
      $author = collect($users)->where('email', $user_email)->first();

      // Handle content
      $content = $post->post_content;
      $content = preg_replace("~(?:\[/?)[^/\]]+/?\]~s", '', $content);
      $content = preg_replace('~(?:\[/?).*?"]~s', '', $content);
      $content = preg_replace('(\\[([^[]|)*])', '', $content);
      $content = preg_replace('/\[(.*?)\]/', '', $content);

      // remove <!-- wp:paragraph --> and <!-- /wp:paragraph -->
      $content = preg_replace('/<!-- wp:paragraph -->/', '', $content);
      $content = preg_replace('/<!-- \/wp:paragraph -->/', '', $content);

      // remove <!-- wp:image {"id":3548,"sizeSlug":"large","linkDestination":"none"} -->
      $content = preg_replace('/<!-- wp:image.*? -->/', '', $content);
      $content = preg_replace('/<!-- \/wp:image -->/', '', $content);

      // remove <p></p>
      $content = preg_replace('/<p><\/p>/', '', $content);

      // echo $post->main_category;
      // echo "\n";

      // Get all Taxonomies 'post_categories'
      $terms = Term::all();
      $taxonomies = [];
      
      foreach ($terms as $term)
      {
        $taxonomy = $term->taxonomyHandle();
        $taxonomies[$taxonomy][] = $term;
      }

      // $post->main_category, $taxonomies['post_categories']
      // find the term with the slug $post->main_category in $taxonomies['post_categories']
      $category = collect($taxonomies['post_categories'])->where('title', $post->main_category)->first();

      $entry = Entry::make()
        ->collection('posts')
        ->slug($post->post_name)
        ->date($post->post_date)
        ->data([
          'title' => $post->title,
          'post_categories' => [$category->slug],
          'content' => $content,
          'author' => $author->id,
        ]);

      $entry->save();
    }
    return 'WordPress posts successfully retrieved';
  }
}