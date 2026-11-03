<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Statamic\Events\FormSubmitted;
use Statamic\Facades\Form;
use Statamic\Facades\Site;
use Tests\TestCase;

class ContactMailTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config([
            'statamic.static_caching.strategy' => null,
            // Exercise the real controller and mail jobs entirely in memory.
            'mail.mailers.mailgun.transport' => 'array',
            'queue.default' => 'sync',
        ]);
        Event::forget(FormSubmitted::class);
        Form::find('contact_form')->store(false);
    }

    public function test_both_languages_send_separate_mails_with_the_right_content_and_reply_addresses(): void
    {
        foreach (['de', 'en'] as $language) {
            $transport = Mail::mailer('mailgun')->getSymfonyTransport();
            $transport->flush();
            $url = rtrim(Site::get($language)->absoluteUrl(), '/').($language === 'en' ? '/contact' : '/kontakt');

            $this->from($url)->post('/!/forms/contact_form', [
                'name' => 'Mail <b>Test</b>', 'email' => 'test@example.invalid', 'phone' => '+41 44 000 00 00',
                'message' => "A <b>sample inquiry</b>\nSecond line.",
                'origin_landing' => '/landing-unique', 'origin_referrer' => 'referrer-unique.example',
                'origin_campaign' => 'utm_id=campaign-unique', 'origin_path' => "/landing-unique\n/kontakt",
            ])->assertRedirect()->assertSessionHasNoErrors();

            $this->assertCount(2, $transport->messages());
            [$internal, $confirmation] = $transport->messages()->map(fn ($sent) => $sent->getOriginalMessage())->all();
            $this->assertSame('beeper@nightnurse.ch', $internal->getTo()[0]->getAddress());
            $this->assertSame('test@example.invalid', $internal->getReplyTo()[0]->getAddress());
            $this->assertSame('test@example.invalid', $confirmation->getTo()[0]->getAddress());
            $this->assertSame('beeper@nightnurse.ch', $confirmation->getReplyTo()[0]->getAddress());
            $this->assertSame('Nightnurse Images', $confirmation->getFrom()[0]->getName());
            $this->assertSame($language === 'en' ? 'Your message to Nightnurse Images' : 'Ihre Nachricht an Nightnurse Images', $confirmation->getSubject());

            foreach ([$internal, $confirmation] as $mail) {
                $this->assertStringContainsString('&lt;b&gt;sample inquiry&lt;/b&gt;<br', $mail->getHtmlBody());
                $this->assertStringNotContainsString('<b>Test</b>', $mail->getHtmlBody());
                $this->assertStringContainsString('A <b>sample inquiry</b>', $mail->getTextBody());
                $this->assertStringContainsString('+41 44 000 00 00', $mail->getTextBody());
            }
            foreach ([$internal->getHtmlBody(), $internal->getTextBody()] as $body) {
                $this->assertLessThan(strpos($body, 'Herkunft der Anfrage'), strpos($body, 'sample inquiry'));
                foreach (['landing-unique', 'referrer-unique', 'campaign-unique'] as $marker) {
                    $this->assertStringContainsString($marker, $body);
                }
            }
            foreach ([$confirmation->getHtmlBody(), $confirmation->getTextBody()] as $body) {
                $this->assertStringContainsString($language === 'en' ? 'Thank you for getting in touch.' : 'Vielen Dank für Ihre Nachricht.', $body);
                foreach (['landing-unique', 'referrer-unique', 'campaign-unique', 'Herkunft', 'origin_'] as $marker) {
                    $this->assertStringNotContainsString($marker, $body);
                }
                $this->assertStringNotContainsString($language === 'en' ? 'Guten Tag' : 'Hello', $body);
            }
            $this->assertStringContainsString('<html lang="'.$language.'">', $confirmation->getHtmlBody());
        }
    }

    public function test_empty_optional_fields_do_not_leave_placeholder_rows(): void
    {
        $this->from(Site::get('de')->absoluteUrl().'kontakt')->post('/!/forms/contact_form', [
            'name' => 'Minimal Test', 'email' => 'test@example.invalid',
        ])->assertRedirect()->assertSessionHasNoErrors();

        [$internal, $confirmation] = Mail::mailer('mailgun')->getSymfonyTransport()->messages()
            ->map(fn ($sent) => $sent->getOriginalMessage())->all();
        foreach ([$internal, $confirmation] as $mail) {
            foreach ([$mail->getHtmlBody(), $mail->getTextBody()] as $body) {
                $this->assertStringContainsString('Keine Nachricht angegeben.', $body);
                $this->assertStringNotContainsString('Telefon', $body);
                $this->assertStringNotContainsString("'–'", $body);
            }
        }
        $this->assertStringContainsString('Keine Herkunftsinformationen übermittelt.', $internal->getTextBody());
    }
}
