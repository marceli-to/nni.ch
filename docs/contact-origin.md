# Herkunft in Kontaktanfragen

Das Modul `resources/js/modules/contact-origin.js` ergänzt das Kontaktformular um
optionale Herkunftsfelder. Es erfasst erst nach der bestehenden
Analyse-Einwilligung und beginnt deshalb gegebenenfalls auf einer späteren Seite
als dem tatsächlichen Einstieg. Ohne JavaScript oder Einwilligung bleiben die
Felder leer; das Formular funktioniert weiterhin.

- `origin_landing`: erste beobachtete Seite als Pfad ohne Query oder Fragment.
- `origin_referrer`: externe verweisende Domain, soweit der Browser sie angibt.
- `origin_campaign`: erste vorhandene UTM-Kennung im Besuch (`utm_id`,
  `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`).
- `origin_path`: letzte 20 besuchte Seiten als Pfade, einschliesslich Kontaktseite.

Die Daten liegen im `sessionStorage` des Tabs unter
`nightnurse_contact_origin_v1`. Nach 30 Minuten ohne erfassten Seitenaufruf oder
Formularversuch beginnt ein neuer Besuch. Die Danke-Seiten und der Widerruf der
Analyse-Einwilligung löschen die Daten. Blockierter Speicher führt zu einer
Erfassung nur auf der aktuellen Seite. Es gibt keine Besucher-ID und keinen
zusätzlichen Tracking-Endpunkt. Die Werte werden erst mit dem Formular übermittelt
und wie die übrigen Anfragefelder in Statamic gespeichert.

`resources/forms/contact_form.yaml` verwendet getrennte Vorlagen für die interne
Anfrage (`email/*/contact`) und die Bestätigung (`email/*/contact-confirmation`).
Intern stehen Kontaktdaten und Nachricht zuerst, Herkunftsinformationen darunter.
Die interne Antwortadresse ist die Formularadresse. Die Bestätigung verwendet
Deutsch oder Englisch gemäss Formularseite und enthält nur die vier bisherigen
Formularfelder; Antworten gehen an beeper@nightnurse.ch.
HTML-Mails maskieren die Werte; die
Herkunftsfelder sind im Blueprint optional und in Typ und Länge begrenzt.
Die Angaben stammen aus dem Browser und können fehlen oder verändert sein.

Lokale Prüfung ohne Mailversand:

```sh
node --test tests/contact-origin.test.cjs tests/consent.test.cjs
php artisan test --filter=ContactOriginTest
```
