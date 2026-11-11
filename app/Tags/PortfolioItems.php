<?php

namespace App\Tags;

use Statamic\Fields\Value;
use Statamic\Fields\Values;
use Statamic\Tags\Tags;

class PortfolioItems extends Tags
{
    public function index(): array
    {
        $items = [];
        $quotes = collect($this->params->get('testimonials', []))
            ->map(fn ($quote) => $quote instanceof Values ? $quote->all() : $quote);

        foreach ($this->params->get('projects', []) as $project) {
            $data = is_array($project) ? $project : $project->toAugmentedArray();
            $id = $data['id'] instanceof Value ? $data['id']->value() : $data['id'];
            $items[] = [...$data, 'is_testimonial' => false];

            foreach ($quotes as $quote) {
                // Compare the stored ID, not the augmented relationship.
                $anchor = $quote['after_project'] ?? null;
                $anchor = $anchor instanceof Value ? $anchor->raw() : $anchor;
                $anchor = is_array($anchor) ? ($anchor[0] ?? null) : $anchor;

                $text = $quote['quote'] ?? null;
                $text = $text instanceof Value ? $text->value() : $text;
                if ($anchor === $id && filled($text)) {
                    $items[] = [...$quote, 'is_testimonial' => true];
                }
            }
        }

        foreach ($items as $index => &$item) {
            $pos = $index % 8;
            $item['slot_pos'] = $pos;
            $item['slot_cycle'] = intdiv($index, 8);
            $item['slot_row'] = intdiv($index, 8) * 6 + [1, 1, 2, 3, 4, 5, 6, 6][$pos];
            // Slot seven climbs into the previous image. Quotes can be shorter.
            $item['disable_interlock'] = $index > 0 && $items[$index - 1]['is_testimonial'];
        }

        return $items;
    }
}
