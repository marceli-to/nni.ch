<?php
namespace App\Console\Commands;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\Taxonomy;
use Corcel\Model\Post;
use Illuminate\Console\Command;

class ImportWordPressTags extends Command
{
  protected $signature = 'import:wptags';

  protected $description = 'Import tags from posts from WordPress';

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

    $tags = [];

    foreach ($posts as $post)
    {
      if (isset($post->terms['tag']))
      {
        foreach($post->terms['tag'] as $key => $val)
        {
          $tags[$key] = $val;
        }
      }
    }

    foreach($tags as $key => $tag)
    {
      // Create tags
      $term = Term::make()
      ->taxonomy('post_tags')
      ->slug($key)
      ->data([
        'title' => $tag,
      ]);

      $term->save();
    }
    
    return 'WordPress tags successfully retrieved';
  }
}