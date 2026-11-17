<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Statamic\Facades\Entry;
use Statamic\Facades\Taxonomy;
use Statamic\Facades\Term;

/**
 * One-off migration of the project field "services" from free Bard text to the
 * project_services taxonomy (November 2026). Creates the taxonomy and its
 * terms, then maps each project's old service lines to term slugs. The German
 * entry holds the selection for both languages; English localisations lose
 * their own copy. Runs as a dry run unless --write is given. Can be deleted
 * once production has been migrated.
 */
class MigrateProjectServices extends Command
{
    protected $signature = 'nightnurse:migrate-project-services {--write : Save the changes instead of only reporting them}';

    protected $description = 'Moves project services from free text to the project_services taxonomy.';

    private const TAXONOMY = 'project_services';

    /** slug => [German title, English title, German URI of the service page or null] */
    private const SERVICES = [
        'wettbewerbsvisualisierungen' => ['Wettbewerbsvisualisierungen', 'Competition visualizations', '/angebot/wettbewerbsvisualisierungen'],
        'vermarktungsvisualisierungen' => ['Vermarktungsvisualisierungen', 'Marketing visualizations', '/kompetenzen/immobilienvermarktung'],
        'visualisierungen-fuer-oeffentliche-projekte' => ['Visualisierungen für öffentliche Projekte', 'Visualizations for public projects', '/kompetenzen/oeffentliche-und-politische-projekte'],
        'animation-und-film' => ['Animation und Film', 'Animation and film', '/angebot/animation-und-film'],
        'virtuelle-rundgaenge' => ['Virtuelle Rundgänge', 'Virtual tours', '/angebot/virtuelle-rundgaenge'],
        'bildstrategie-und-konzeption' => ['Bildstrategie und -konzeption', 'Image strategy and concept development', null],
        'beratung-und-prozessbegleitung' => ['Beratung und Prozessbegleitung', 'Consulting and process facilitation', '/kompetenzen'],
        'fotografie-und-drohnenaufnahmen' => ['Fotografie und Drohnenaufnahmen', 'Photography and drone imagery', null],
        'innenraumkonzepte-und-styling' => ['Innenraumkonzepte und Styling', 'Interior concepts and styling', null],
        'entwurfsbegleitung' => ['Entwurfsbegleitung', 'Design support', null],
    ];

    /** Old wording (German and English) => slug; null drops the line. */
    private const MAP = [
        'wettbewerbsvisualisierungen' => 'wettbewerbsvisualisierungen',
        'competition visualizations' => 'wettbewerbsvisualisierungen',
        'vermarktungsvisualisierungen' => 'vermarktungsvisualisierungen',
        'marketing visualizations' => 'vermarktungsvisualisierungen',
        'visualisierungen für den öffentlichen raum' => 'visualisierungen-fuer-oeffentliche-projekte',
        'visualisierungen für öffentliche kommunikation' => 'visualisierungen-fuer-oeffentliche-projekte',
        'public-space visualizations' => 'visualisierungen-fuer-oeffentliche-projekte',
        'public-communication visualizations' => 'visualisierungen-fuer-oeffentliche-projekte',
        'virtuelle 360° rundgänge' => 'virtuelle-rundgaenge',
        '360° virtual tours' => 'virtuelle-rundgaenge',
        'bildstrategie und -konzeption' => 'bildstrategie-und-konzeption',
        'image strategy and concept development' => 'bildstrategie-und-konzeption',
        'entwicklung einer spezifischen bildsprache' => 'bildstrategie-und-konzeption',
        'development of a specific visual language' => 'bildstrategie-und-konzeption',
        'visuelles konzept und bildstrategie' => 'bildstrategie-und-konzeption',
        'visual concept and image strategy' => 'bildstrategie-und-konzeption',
        'bildstrategie und visuelle kommunikation' => 'bildstrategie-und-konzeption',
        'storyboard und art direction' => 'bildstrategie-und-konzeption',
        'storyboarding and art direction' => 'bildstrategie-und-konzeption',
        'beratung und prozessbegleitung' => 'beratung-und-prozessbegleitung',
        'consulting and process facilitation' => 'beratung-und-prozessbegleitung',
        'konzeptionelle beratung' => 'beratung-und-prozessbegleitung',
        'concept development' => 'beratung-und-prozessbegleitung',
        'koordination von fachplanenden' => 'beratung-und-prozessbegleitung',
        'coordination of specialist planners' => 'beratung-und-prozessbegleitung',
        'fotografie' => 'fotografie-und-drohnenaufnahmen',
        'photography' => 'fotografie-und-drohnenaufnahmen',
        'fotografie und drohnenaufnahmen' => 'fotografie-und-drohnenaufnahmen',
        'photography and drone imagery' => 'fotografie-und-drohnenaufnahmen',
        'helikopterfotografie' => 'fotografie-und-drohnenaufnahmen',
        'helicopter photography' => 'fotografie-und-drohnenaufnahmen',
        'moodboards und innenraumkonzepte' => 'innenraumkonzepte-und-styling',
        'mood boards and interior concepts' => 'innenraumkonzepte-und-styling',
        'innenraumkonzepte und styling' => 'innenraumkonzepte-und-styling',
        'interior concepts and styling' => 'innenraumkonzepte-und-styling',
        'entwurfsergänzung' => 'entwurfsbegleitung',
        'design development' => 'entwurfsbegleitung',
        'entwurfsbegleitung und digitales prototyping' => 'entwurfsbegleitung',
        'design support and digital prototyping' => 'entwurfsbegleitung',
        'investorenprojektierung' => 'entwurfsbegleitung',
        'investor project development' => 'entwurfsbegleitung',
        'animation und film' => 'animation-und-film',
        'animation and film' => 'animation-und-film',
        'filmkonzeption, animation und filmproduktion' => 'animation-und-film',
        'fotografie und drohnenfotografie' => 'fotografie-und-drohnenaufnahmen',
        'visuelle kommunikation' => 'bildstrategie-und-konzeption',
        'visual communication' => 'bildstrategie-und-konzeption',
        'inhalts- und nutzungskonzepte' => 'beratung-und-prozessbegleitung',
        'content and use concepts' => 'beratung-und-prozessbegleitung',
        'bildretusche und compositing' => null,
        'technische produktvisualisierungen' => null,
        '3d-modellierung' => null,
        '3d modeling' => null,
        'bildretusche' => null,
        'image retouching and compositing' => null,
        'fotorealistische 3d-visualisierungen' => null,
        'photorealistic 3d visualizations' => null,
        'aussen- und innenraumvisualisierungen' => null,
        'exterior and interior visualizations' => null,
        'architektur und landschaftsgestaltung' => null,
        'architecture and landscape design' => null,
    ];

    private bool $write;

    public function handle(): int
    {
        $this->write = (bool) $this->option('write');
        $this->line($this->write ? 'Writing changes.' : 'Dry run, nothing is saved. Use --write to apply.');

        if (! $this->ensureTaxonomy()) {
            return self::FAILURE;
        }

        $unknown = [];

        $projects = Entry::query()->where('collection', 'projects')->get();

        foreach ($projects->filter(fn ($entry) => $entry->locale() === 'de') as $entry) {
            $this->migrate($entry, $unknown);
        }

        foreach ($projects->filter(fn ($entry) => $entry->locale() !== 'de') as $entry) {
            if ($entry->hasOrigin()) {
                if ($entry->data()->has('services')) {
                    $this->line("  {$entry->locale()}/{$entry->slug()}: own copy removed, uses the German selection");
                    $this->write && $entry->remove('services')->saveQuietly();
                }

                continue;
            }

            $this->migrate($entry, $unknown);
        }

        if ($unknown) {
            $this->newLine();
            $this->warn('Lines without a mapping (left out):');
            foreach ($unknown as $line => $where) {
                $this->line('  «'.$line.'» in '.implode(', ', array_unique($where)));
            }
        }

        return self::SUCCESS;
    }

    private function ensureTaxonomy(): bool
    {
        if (! Taxonomy::find(self::TAXONOMY)) {
            $this->line('Creating taxonomy '.self::TAXONOMY);
            $this->write && Taxonomy::make(self::TAXONOMY)->title('Project Services')->sites(['de', 'en'])->save();
        }

        foreach (self::SERVICES as $slug => [$de, $en, $uri]) {
            $page = null;

            if ($uri) {
                $page = Entry::findByUri($uri, 'de');
                if (! $page) {
                    $this->error("Service page {$uri} not found.");

                    return false;
                }
            }

            if (Term::find(self::TAXONOMY.'::'.$slug)) {
                continue;
            }

            $this->line("Creating term {$slug}".($page ? " → {$uri}" : ''));

            if ($this->write) {
                $term = Term::make($slug)->taxonomy(self::TAXONOMY)->blueprint('project_service');
                $term->dataForLocale('de', array_filter(['title' => $de, 'page' => $page?->id()]));
                $term->dataForLocale('en', ['title' => $en]);
                $term->save();
            }
        }

        return true;
    }

    private function migrate($entry, array &$unknown): void
    {
        $value = $entry->get('services');

        // Already migrated: a list of term slugs.
        if (is_array($value) && $value && collect($value)->every(fn ($item) => is_string($item))) {
            return;
        }

        $slugs = [];

        foreach ($this->lines($value) as $line) {
            $key = Str::lower(trim($line, " \t\n\r\0\x0B.:–-"));

            if (! array_key_exists($key, self::MAP)) {
                $unknown[$line][] = "{$entry->locale()}/{$entry->slug()}";

                continue;
            }

            if ($slug = self::MAP[$key]) {
                $slugs[] = $slug;
            }
        }

        $slugs = array_values(array_unique($slugs));
        $note = count($slugs) > 5 ? '  (more than five, the field allows five)' : '';
        $this->line("  {$entry->locale()}/{$entry->slug()}: ".($slugs ? implode(', ', $slugs) : '—').$note);

        if ($this->write) {
            $slugs ? $entry->set('services', $slugs) : $entry->remove('services');
            $entry->saveQuietly();
        }
    }

    /** One string per paragraph or list item of the old Bard value. */
    private function lines($nodes): array
    {
        if (! is_array($nodes)) {
            return is_string($nodes) && trim($nodes) !== '' ? [trim(strip_tags($nodes))] : [];
        }

        $lines = [];

        foreach ($nodes as $node) {
            if (! is_array($node)) {
                continue;
            }

            if (($node['type'] ?? null) === 'paragraph') {
                $text = trim(collect($node['content'] ?? [])->pluck('text')->implode(''));
                $text !== '' && $lines[] = $text;

                continue;
            }

            array_push($lines, ...$this->lines($node['content'] ?? []));
        }

        return $lines;
    }
}
