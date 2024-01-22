<?php
namespace App\Console\Commands;
use Statamic\Facades\Entry;
use Statamic\Facades\Term;
use Statamic\Facades\Taxonomy;
use Statamic\Facades\User;
use Corcel\Model\Post;
use Illuminate\Console\Command;

class ImportWordPressUsers extends Command
{
  protected $signature = 'import:wpusers';

  protected $description = 'Import users from posts from WordPress';

  public function __construct()
  {
    parent::__construct();
  }

  public function handle()
  {
    $users = [
      ['ID' => '1','user_login' => 'koegler','user_pass' => '$P$BJh8HkA1WdQ.pD.3r8SKnB4BeNB8VF1','user_nicename' => 'koegler','user_email' => 'koegler@nightnurse.ch','user_url' => 'http://www.nightnurse.ch','user_registered' => '2019-09-09 09:23:26','user_activation_key' => '','user_status' => '0','display_name' => 'Lutz'],
      ['ID' => '2','user_login' => 'arnung','user_pass' => '$P$BxMFxRvxqD2TEW2X9wqxjeODeSJy.R0','user_nicename' => 'arnung','user_email' => 'arnung@nightnurse.ch','user_url' => 'http://www.nightnurse.ch','user_registered' => '2019-09-09 09:26:24','user_activation_key' => '','user_status' => '0','display_name' => 'Mette Maj Arnung'],
      ['ID' => '4','user_login' => 'Marcel','user_pass' => '$P$Bw2x4LJKob5Hs.u7hEsYZYnJruthK30','user_nicename' => 'marcel','user_email' => 'm@marceli.to','user_url' => 'https://marceli.to/','user_registered' => '2019-10-30 10:53:43','user_activation_key' => '1572432824:$P$B4aJEFT1CyyDloLvYSc.Act9Ddb4KH0','user_status' => '0','display_name' => 'Marcel Stadelmann'],
      ['ID' => '5','user_login' => 'Andreas','user_pass' => '$P$By3ExkeDkmhngNI4LdFtqvT4/EuUg70','user_nicename' => 'andreas','user_email' => 'papastergiou@nightnurse.ch','user_url' => '','user_registered' => '2020-01-14 09:38:03','user_activation_key' => '','user_status' => '0','display_name' => 'Andreas Papastergiou'],
      ['ID' => '7','user_login' => 'Deiters','user_pass' => '$P$BQrhZnMbfn81RHJLmV4iX9abC2UZ9h/','user_nicename' => 'deiters','user_email' => 'deiters@nightnurse.ch','user_url' => '','user_registered' => '2020-01-16 10:44:30','user_activation_key' => '1579171470:$P$B3SIWe8CwFSJJyQCbO9zsgyGQZCRap0','user_status' => '0','display_name' => 'Christoph Deiters'],
      ['ID' => '8','user_login' => 'Direk','user_pass' => '$P$BKWOKbTfJ.cCD/rZbLHSPpfmStWZcK1','user_nicename' => 'direk','user_email' => 'direk@nightnurse.ch','user_url' => '','user_registered' => '2020-01-20 08:32:53','user_activation_key' => '','user_status' => '0','display_name' => 'Günes Direk'],
      ['ID' => '9','user_login' => 'Buttitta','user_pass' => '$P$BtzSDx6ajLPnFXROlClBKpCQsHvVCv1','user_nicename' => 'buttitta','user_email' => 'buttitta@nightnurse.ch','user_url' => '','user_registered' => '2022-05-16 13:55:45','user_activation_key' => '1652709345:$P$BeuvLw9X45j/kD1ZDjcX1znLH1V0u41','user_status' => '0','display_name' => 'Irma Buttitta'],
      ['ID' => '10','user_login' => 'saller','user_pass' => '$P$BZHMn3nLpE1hM8gTL37Icjh7lllNtR.','user_nicename' => 'saller','user_email' => 'saller@nightnurse.ch','user_url' => '','user_registered' => '2022-10-24 07:32:50','user_activation_key' => '','user_status' => '0','display_name' => 'Christopher Saller'],
      ['ID' => '11','user_login' => 'stricker','user_pass' => '$P$BGGoE8tgFRzfj2G1ju9RzmUdheIMPK.','user_nicename' => 'stricker','user_email' => 'stricker@nightnurse.ch','user_url' => '','user_registered' => '2023-01-05 20:09:40','user_activation_key' => '1672949381:$P$BVPEbfbMFUfUOPSicD92oh6nlwmKLV0','user_status' => '0','display_name' => 'Jasmin Stricker'],
      ['ID' => '12','user_login' => 'egreteau','user_pass' => '$P$BbWZi2m0VpgW8V2TiQRv9/VCKswq.d1','user_nicename' => 'egreteau','user_email' => 'egreteau@nightnurse.ch','user_url' => '','user_registered' => '2023-01-13 13:43:28','user_activation_key' => '','user_status' => '0','display_name' => 'François Egreteau'],
      ['ID' => '13','user_login' => 'osman','user_pass' => '$P$BMRfhe1pIgOuyhzmh5kwG.zPu4fRE9/','user_nicename' => 'osman','user_email' => 'osman@nightnurse.ch','user_url' => '','user_registered' => '2023-09-01 14:20:38','user_activation_key' => '1693993989:$P$Bj6.FxEGBWxfu263dBLgH6eMCrFIgB/','user_status' => '0','display_name' => 'Rukiye Osman']
    ];

    foreach ($users as $user)
    {
      $user = User::make()
        ->data([
          'name' => $user['display_name'],
          'email' => $user['user_email'],
        ]);
      $user->save();
    }
    
    
    return 'WordPress tags successfully retrieved';
  }
}