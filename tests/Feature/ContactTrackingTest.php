<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Statamic\Events\FormSubmitted;
use Statamic\Facades\Form;
use Tests\TestCase;

class ContactTrackingTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['statamic.static_caching.strategy' => null]);
        Queue::fake();
        // Anti-spam integrations need real provider credentials. Keep the real
        // Statamic controller/validation; exercise silent rejection separately.
        Event::forget(FormSubmitted::class);
        Form::find('contact_form')->store(false);
    }

    private function confirmation()
    {
        return $this->getJson('/tracking/contact-success', ['X-Requested-With' => 'XMLHttpRequest']);
    }

    public function test_direct_visits_and_reloads_do_not_confirm_a_submission(): void
    {
        $this->confirmation()->assertOk()->assertExactJson(['confirmed' => false]);
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_real_validated_form_submission_is_consumed_once_without_personal_data(): void
    {
        $this->from('/kontakt')->post('/!/forms/contact_form', [
            'name' => 'Tracking Test', 'email' => 'test@example.invalid', 'message' => 'No mail should be sent.',
        ])->assertRedirect();

        $this->confirmation()->assertOk()->assertExactJson(['confirmed' => true])
            ->assertHeader('Cache-Control', 'max-age=0, no-store, private');
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_english_submission_uses_the_same_confirmed_success_path(): void
    {
        $this->from('/en/contact')->post('/!/forms/contact_form', [
            'name' => 'Tracking Test', 'email' => 'test@example.invalid',
        ])->assertRedirect();
        $this->confirmation()->assertExactJson(['confirmed' => true]);
    }

    public function test_validation_error_does_not_create_a_confirmation(): void
    {
        $this->from('/kontakt')->post('/!/forms/contact_form', ['email' => 'invalid'])
            ->assertSessionHasErrors(['name', 'email'], null, 'form.contact_form');
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_honeypot_silent_success_does_not_count(): void
    {
        $this->from('/kontakt')->post('/!/forms/contact_form', [
            'name' => 'Bot', 'email' => 'bot@example.invalid', 'webs1te' => 'spam',
        ])->assertRedirect();
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_listener_rejection_does_not_count(): void
    {
        Event::listen(FormSubmitted::class, fn () => false);
        $this->from('/kontakt')->post('/!/forms/contact_form', [
            'name' => 'Rejected', 'email' => 'test@example.invalid',
        ])->assertRedirect();
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_expired_confirmation_cannot_be_replayed(): void
    {
        $this->withSession(['nn_contact_success' => ['id' => 'expired', 'at' => time() - 301]]);
        $this->confirmation()->assertExactJson(['confirmed' => false]);
    }

    public function test_normal_navigation_cannot_consume_a_pending_confirmation(): void
    {
        $this->withSession(['nn_contact_success' => ['id' => 'pending', 'at' => time()]]);
        $this->get('/tracking/contact-success')->assertNotFound();
        $this->confirmation()->assertExactJson(['confirmed' => true]);
    }
}
