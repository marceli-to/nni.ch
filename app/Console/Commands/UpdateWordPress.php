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

class UpdateWordPress extends Command
{
  protected $signature = 'update:wp';

  protected $description = 'Update posts from WordPress';

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

    foreach($posts as $post)
    {
      // $this->info('Post: ' . $post->post_title);
      // $this->info('Slug: ' . $post->post_name);
      // $this->info('Post excerpt: ' . $post->post_excerpt);

      // foreach($post->attachment as $attachment)
      // {
      //   $this->info('Attachment: ' . $attachment->guid);
      //   $this->info('Attachment title: ' . $attachment->post_title);
      // }



      // Get the entry by slug
      $entry = Entry::query()->where('slug', $post->post_name)->first();
      if ($entry)
      {
        // $this->info('Entry: ' . $entry->title);
        // $this->info('Entry slug: ' . $entry->slug);

        $feature_image = $entry->get('feature_image');

        $this->info('Feature image: ' . $entry->get('feature_image'));

        // if $feature_image does not start with 'posts/', add 'posts/' to $feature_image
        // if ($feature_image && !str_starts_with($feature_image, 'posts/'))
        // {
        //   $entry->set('feature_image', 'posts/' . $feature_image);
        //   $entry->save();
        //   $this->info('Feature image updated for ' . $entry->slug);
        //   $this->info('Feature image: ' . $entry->get('feature_image'));
        // }

        // 1. Feature image /////////////////////////////////////////////////
        // $thumbnail = $post->thumbnail;
        // if ($thumbnail)
        // {
        //   $feature_image = $entry->get('feature_image');
        //   $this->info('Feature image: ' . $feature_image);
        //   // $this->info('Thumbnail: ' . $thumbnail);
        //   // $this->info('Entry feature image: ' . $feature_image);

        //   // remove https://blog.nightnurse.ch/wp-content/uploads/ from $thumbnail
        //   $thumbnail_short = str_replace('https://blog.nightnurse.ch/wp-content/uploads/', '', $thumbnail);

        //   // remove posts/ from $entry->get('feature_image')
        //   $feature_image_short = str_replace('posts/', '', $feature_image);

        //   // compare $entry->get('featured_image') and $thumbnail
        //   if ($feature_image_short != $thumbnail_short || $feature_image = null)
        //   {
        //     // $this->info('Post: ' . $post->post_title);
        //     // $this->info('Entry: ' . $entry->slug);
        //     // $this->info('Found different feature image for ' . $entry->slug);
        //     // $this->info('Entry feature image: ' . $feature_image_short);
        //     // $this->info('Post feature image: ' . $thumbnail_short);
        //     // $this->info('Post feature image url: ' . $thumbnail);

        //     // // Update the feature image
        //     // $entry->set('feature_image', 'posts/' . $thumbnail_short);
        //     // $entry->save();


        //     // write the differences in a text file located in the storage directory
        //     // $filename = storage_path('app/feature_images.txt');
        //     // $content = 'Post: ' . $post->post_title . PHP_EOL;
        //     // $content .= 'Entry: ' . $entry->slug . PHP_EOL;
        //     // $content .= 'Entry feature image: ' . $feature_image_short . PHP_EOL;
        //     // $content .= 'Post feature image: ' . $thumbnail_short . PHP_EOL;
        //     // $content .= 'Post feature image url: ' . $thumbnail . PHP_EOL;
        //     // $content .= PHP_EOL;
        //     // file_put_contents($filename, $content, FILE_APPEND);
        //   }
        // }
        


        // 2. Categories and Tags /////////////////////////////////////////////////

        /*
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

        $t = [];
        $c = [];
        $taxs = $post->taxonomies()->get();
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
 
        // compare $entry->get('post_categories') and $c
        if ($entry->get('post_categories') && $entry->get('post_categories') != $c)
        {
          $this->info('Post: ' . $entry->title);
          $this->info('Entry: ' . $entry->slug);
          $this->info('Found different categories for ' . $entry->slug);
          $this->info('Entry categories: ' . implode(', ', $entry->get('post_categories')));
          $this->info('Post categories: ' . implode(', ', $c));

          // write the differences in a text file located in the storage directory
          $filename = storage_path('app/categories.txt');
          $content = 'Post: ' . $entry->title . PHP_EOL;
          $content .= 'Entry: ' . $entry->slug . PHP_EOL;
          $content .= 'Entry categories: ' . implode(', ', $entry->get('post_categories')) . PHP_EOL;
          $content .= 'Post categories: ' . implode(', ', $c) . PHP_EOL;
          $content .= PHP_EOL;
          file_put_contents($filename, $content, FILE_APPEND);
        }

        // compare $entry->get('tags') and $t
        if ($entry->get('tags') && $entry->get('tags') != $t)
        {
          $this->info('Post: ' . $entry->title);
          $this->info('Entry: ' . $entry->slug);
          $this->info('Found different tags for ' . $entry->slug);
          $this->info('Entry tags: ' . implode(', ', $entry->get('tags')));
          $this->info('Post tags: ' . implode(', ', $t));

          // write the differences in a text file located in the storage directory
          $filename = storage_path('app/tags.txt');
          $content = 'Post: ' . $entry->title . PHP_EOL;
          $content .= 'Entry: ' . $entry->slug . PHP_EOL;
          $content .= 'Entry tags: ' . implode(', ', $entry->get('tags')) . PHP_EOL;
          $content .= 'Post tags: ' . implode(', ', $t) . PHP_EOL;
          $content .= PHP_EOL;
          file_put_contents($filename, $content, FILE_APPEND);
        }
        
        // 3. Excerpt /////////////////////////////////////////////////
        // if ($post->post_excerpt)
        // {
        //   $entry->set('excerpt', $post->post_excerpt);
        //   $entry->save();
        //   $this->info('Entry excerpt updated for ' . $entry->slug);
        //   $this->info('Entry excerpt: ' . $entry->get('excerpt'));
        // }

        */


        $this->info('');

      }
    }

    return 'WordPress posts successfully updated';
  }
}