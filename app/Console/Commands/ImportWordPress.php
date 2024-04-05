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
 * - [x] Handle images
 * - [x] Handle featured image
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
      ->get();

    $terms = Term::all();
    $categories = [];
    
    foreach ($terms as $term)
    {
      $taxonomy = $term->taxonomyHandle();
      if ($taxonomy == 'post_categories')
      {
        $categories[] = $term;
      }
    }

    // extract slug from categories
    $categories = collect($categories)->map(function($category) {
      return $category->slug;
    });

    // remove duplicates
    $categories = $categories->unique();

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

      // remove \n
      $content = preg_replace('/\n/', '', $content);

      // remove <!-- wp:list {"ordered":true} -->\n<!-- /wp:list -->
      $content = preg_replace('/<!-- wp:list.*? -->/', '', $content);

      // remove <!-- /wp:list --><!-- wp:paragraph {"hasCustomCSS":true} -->
      $content = preg_replace('/<!-- \/wp:list -->/', '', $content);

      // remove <!-- wp:paragraph {"hasCustomCSS":true} -->
      $content = preg_replace('/<!-- wp:paragraph.*? -->/', '', $content);

      // remove <!-- wp:heading -->
      $content = preg_replace('/<!-- wp:heading -->/', '', $content);
      $content = preg_replace('/<!-- \/wp:heading -->/', '', $content);

      // remove <!-- wp:heading {"level":3} -->
      $content = preg_replace('/<!-- wp:heading.*? -->/', '', $content);

      // remove <!-- wp:heading {"level":4} -->
      $content = preg_replace('/<!-- wp:heading.*? -->/', '', $content);

      // remove <!-- wp:heading {"level":5} -->
      $content = preg_replace('/<!-- wp:heading.*? -->/', '', $content);

      // remove <!-- wp:heading {"level":6} -->
      $content = preg_replace('/<!-- wp:heading.*? -->/', '', $content);

      // replace class="anything" with nothing
      $content = preg_replace('/class=".*?"/', '', $content);

      // replace <figure > with <figure>
      $content = preg_replace('/<figure >/', '<figure>', $content);

      // remove <figure>
      $content = preg_replace('/<figure>/', '', $content);

      // remove </figure>
      $content = preg_replace('/<\/figure>/', '', $content);

      // replace  alt="" with nothing
      $content = preg_replace('/alt=""/', '', $content);

      // replace /> with >
      $content = preg_replace('/  \/>/', '>', $content);
     

      // Get all Taxonomies 'post_categories'
      // $terms = Term::all();
      // $taxonomies = [];
      
      // foreach ($terms as $term)
      // {
      //   $taxonomy = $term->taxonomyHandle();
      //   $taxonomies[$taxonomy][] = $term;
      // }

      // // $post->main_category, $taxonomies['post_categories']
      // // find the term with the slug $post->main_category in $taxonomies['post_categories']
      // $category = collect($taxonomies['post_categories'])->where('title', $post->main_category)->first();

      // $cat = isset($category->slug) ? [$category->slug] : ['fix-me'];

      // // Handle tags
      // $taxs = $post->taxonomies()->get();
      // $tags = [];
      // foreach($taxs as $taxonomy)
      // {
      //   $tags[] = $taxonomy->slug;
      // }

      $t = [];
      $c = [];
      $taxs = $post->taxonomies()->get();

      $tags = [];
      foreach($taxs as $taxonomy)
      {
        // if $taxonomy->term->slug is in $categories, then it is a category and should be added to $c
        if ($categories->contains($taxonomy->term->slug))
        {
          $c[] = $taxonomy->term->slug;
        }
        else
        {
          $t[] = $taxonomy->term->slug;
        }
      }

      // Handle featured image
      $featured_image = $post->attachment;

      // feature_image
      if (isset($post->attachment[0]))
      {
        $url = $post->attachment[0]->guid;

        // remove https://blog.nightnurse.ch/wp-content/uploads/ from url
        $url = str_replace('https://blog.nightnurse.ch/wp-content/uploads/', '', $url);

        // split the url by /
        $url = explode('/', $url);
        
        // locate the year and month
        $year = $url[0];
        $month = $url[1];
        $image_name = $url[2];

        // get the image from storage/app/public/uploads
        $image = storage_path('app/public/uploads/' . $year . '/' . $month . '/' . $image_name);

        // create the same structure in public/assets/posts
        $path = public_path('assets/posts/' . $year . '/' . $month);

        // create the directory if it does not exist
        if (!file_exists($path))
        {
          mkdir($path, 0777, true);
        }

        // copy the image to public/assets/posts
        copy($image, $path . '/' . $image_name);
      }

      $entry = Entry::make()
        ->locale('en')
        ->collection('posts')
        ->slug($post->post_name)
        ->date($post->post_date)
        ->data([
          'title' => $post->title,
          'post_categories' => $c,
          'tags' => $t,
          'content' => $content,
          'author' => $author->id,
        ]);

      $entry->save();

      // create the feature_image. feater_image is a field in the collection
      $entry->set('feature_image', '/posts/' . $year . '/' . $month . '/' . $image_name);
      $entry->save();
    }
    return 'WordPress posts successfully retrieved';
  }
}