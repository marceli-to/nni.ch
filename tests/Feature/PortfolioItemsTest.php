<?php

namespace Tests\Feature;

use App\Tags\PortfolioItems;
use Statamic\Fields\Value;
use Statamic\Fields\Values;
use Statamic\Tags\Context;
use Statamic\Tags\Parameters;
use Tests\TestCase;

class PortfolioItemsTest extends TestCase
{
    private function items(array $projects, array $quotes): array
    {
        $tag = new PortfolioItems;
        $tag->params = Parameters::make(['projects' => $projects, 'testimonials' => $quotes], new Context([]));

        return $tag->index();
    }

    public function test_quotes_follow_their_project_in_editorial_order_and_missing_anchors_are_omitted(): void
    {
        $items = $this->items([['id' => 'a'], ['id' => 'b']], [
            ['after_project' => ['b'], 'quote' => 'Second project'],
            new Values(['after_project' => new Value(['a']), 'quote' => new Value('First quote')]),
            ['after_project' => 'a', 'quote' => 'Second quote'],
            ['after_project' => ['missing'], 'quote' => 'Hidden'],
            ['quote' => 'No anchor'],
            ['after_project' => ['a'], 'quote' => ''],
        ]);

        $this->assertSame(['a', 'First quote', 'Second quote', 'b', 'Second project'],
            array_map(fn ($item) => (string) ($item['quote'] ?? $item['id']), $items));
    }

    public function test_slots_continue_across_multiple_quotes_and_do_not_interlock_after_a_quote(): void
    {
        $projects = array_map(fn ($id) => ['id' => (string) $id], range(1, 10));
        $items = $this->items($projects, [
            ['after_project' => ['5'], 'quote' => 'At slot six'],
            ['after_project' => ['10'], 'quote' => 'After last project'],
        ]);

        $this->assertCount(12, $items);
        $this->assertTrue($items[6]['disable_interlock']);
        $this->assertSame(6, $items[6]['slot_pos']);
        $this->assertSame(1, $items[8]['slot_cycle']);
        $this->assertSame(7, $items[8]['slot_row']);
        $this->assertTrue($items[11]['is_testimonial']);
    }
}
