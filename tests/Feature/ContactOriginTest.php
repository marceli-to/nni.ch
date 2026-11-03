<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Statamic\Events\FormSubmitted;
use Statamic\Facades\Form;
use Statamic\Facades\Site;
use Statamic\Forms\Email;
use Tests\TestCase;

class ContactOriginTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['statamic.static_caching.strategy' => null]);
        Queue::fake();
        Event::forget(FormSubmitted::class);
        Form::find('contact_form')->store(false);
    }

    public function test_optional_origin_fields_survive_a_real_submission(): void
    {
        $origin = [
            'origin_landing' => '/leistungen',
            'origin_referrer' => 'example.org',
            'origin_campaign' => 'utm_id=42&utm_source=newsletter',
            'origin_path' => "/leistungen\n/projekte\n/kontakt",
        ];
        $response = $this->postJson('/!/forms/contact_form', array_merge([
            'name' => 'Origin Test', 'email' => 'test@example.invalid',
        ], $origin))->assertOk();

        foreach ($origin as $name => $value) {
            $response->assertJsonPath('submission.'.$name, $value);
        }

        $this->postJson('/!/forms/contact_form', [
            'name' => 'Without origin', 'email' => 'test@example.invalid',
        ])->assertOk()->assertJsonPath('success', true);
    }

    public function test_origin_is_in_internal_html_and_text_but_not_in_the_sender_copy(): void
    {
        $form = Form::find('contact_form');
        $submission = $form->makeSubmission()->data([
            'name' => 'Origin Test', 'email' => 'test@example.invalid',
            'message' => 'Hello from the form',
            'origin_landing' => '/landing-unique',
            'origin_referrer' => 'referrer-unique.example',
            'origin_campaign' => 'utm_id=campaign-unique<img src=x>',
            'origin_path' => "/landing-unique\n/kontakt",
        ]);

        foreach ($form->email() as $index => $config) {
            $mail = new Email($submission, $config, Site::default());
            $mail->build();
            $html = view($mail->view, $mail->viewData)->render();
            $text = view($mail->textView, $mail->viewData)->render();
            foreach ([$html, $text] as $body) {
                $this->assertStringContainsString('Hello from the form', $body);
                foreach (['landing-unique', 'referrer-unique', 'campaign-unique'] as $marker) {
                    if ($index === 0) {
                        $this->assertStringContainsString($marker, $body);
                    } else {
                        $this->assertStringNotContainsString($marker, $body);
                    }
                }
            }
            $this->assertStringNotContainsString('<img src=x>', $html);
            if ($index === 0) {
                $this->assertStringContainsString('&lt;img src=x&gt;', $html);
                $this->assertStringContainsString('/landing-unique<br', $html);
            }
        }
    }

    public function test_non_string_and_oversized_origin_values_are_rejected(): void
    {
        $this->postJson('/!/forms/contact_form', [
            'name' => 'Origin Test', 'email' => 'test@example.invalid',
            'origin_campaign' => ['unexpected'], 'origin_path' => str_repeat('x', 12001),
        ])->assertUnprocessable()->assertJsonValidationErrors(['origin_campaign', 'origin_path']);
    }
}
