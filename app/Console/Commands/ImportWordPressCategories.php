<?php
namespace App\Console\Commands;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\Taxonomy;
use Corcel\Model\Post;
use Illuminate\Console\Command;

class ImportWordPressCategories extends Command
{
  protected $signature = 'import:wpcategories';

  protected $description = 'Import categories from posts from WordPress';

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

    foreach ($posts as $post)
    {
      $category = $post->main_category;

      // Create a new taxonomy entry for the category if it doesn't exist
      $categorySlug = \Str::slug($category);

      // Check if a term with the given slug already exists in the 'categories' taxonomy
      $terms = Term::all();
      $taxonomies = [];
      foreach ($terms as $term)
      {
        $taxonomy = $term->taxonomyHandle();
        if (! array_key_exists($taxonomy, $taxonomies))
        {
          $taxonomies[$taxonomy] = [];
        }
        $taxonomies[$taxonomy][] = [
          'slug' => $term->slug(),
          'title' => $term->get('title'),
        ];
      }

      // if the $category does not exist in $taxonomies['post_categories'], create it
      if (! array_key_exists('post_categories', $taxonomies) || ! in_array($categorySlug, array_column($taxonomies['post_categories'], 'slug')))
      {
        $term = Term::make()
          ->taxonomy('post_categories')
          ->slug($categorySlug)
          ->data([
            'title' => $category,
          ]);

        $term->save();
      }
    }


    return 'WordPress categories successfully retrieved';
  }
}