<?php
namespace App\Console\Commands;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\User;
use Statamic\Facades\Taxonomy;
use Corcel\Model\Post;
use Illuminate\Console\Command;

class CleanupWordPress extends Command
{
  protected $signature = 'cleanup:wp';

  protected $description = 'Clean up wordpress assets';

  public function __construct()
  {
    parent::__construct();
  }

  public function handle()
  {
    $entries = Entry::whereCollection('posts')->all();
    foreach($entries as $entry)
    {
      // $feature_image = $entry->get('feature_image');
      // if ($feature_image)
      // {
      //   $this->info('Entry: ' . $entry->title);
      //   $this->info('Feature image: ' . $feature_image);
      //   $this->info('---');

      //   // write feature images in a text file located in the storage directory
      //   $filename = storage_path('app/images.txt');
      //   $content = $entry->title . ' - ' . $feature_image . PHP_EOL;
      //   file_put_contents($filename, $content, FILE_APPEND);

      // }
    }
    return 'WordPress posts successfully updated';
  }
}