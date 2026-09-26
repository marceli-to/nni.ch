# Search Console: abweichende Canonical-Auswahl nach dem Launch

Stand: 7. September 2026. Status: aktuelles Indexierungsproblem bestätigt; technische Ursache noch offen.

**Nachtrag 25. September 2026:** Der neue Export enthält 12 statt 14 URLs; sechs der
ursprünglichen Fälle sind erledigt, darunter `/en/team/christoph-deiters`,
`/en/expertise` und `/portfolio`. Alle 12 liefern live HTTP 200, Self-Canonical,
`index, follow` und englischen Haupttext. Die letzten Crawls lagen vor der
Cache-Löschung vom 25. September, als normale URLs nachweislich einen veralteten Stand
auslieferten. Keine Code-Änderung nötig; Nachkontrolle am 9. Oktober. Der
Diagnoseablauf unten ist damit Vorgeschichte.

## Quellen und gesicherter Befund

- Benutzerexport `D:\Downloads\nightnurse.ch-Coverage-Drilldown-2026-09-07.zip`: `Chart.csv`, `Table.csv`, `Metadata.csv`.
- Gelieferter Screenshot der URL-Prüfung für `/en/team/christoph-deiters`.
- Direkte HTTP-/HTML-Prüfung aller 14 Export-URLs am 7. September 2026 mit Smartphone-Googlebot-Kennung; dies ist kein Abruf von einer verifizierten Google-IP und keine Prüfung von Googles gerenderter Seite.

Die Meldung lautet **«Duplicate, Google chose different canonical than user»**. Sie ist vom vorher besprochenen Fall **«Duplicate without user-selected canonical»** zu unterscheiden. Ein fehlender Canonical ist für Christoph ausdrücklich nicht die Erklärung: Google hat den englischen Self-Canonical erkannt.

`Chart.csv` zeigt vom 12. Juni bis einschliesslich 28. August 0 betroffene Seiten, ab 29. August bis zum letzten Diagrammdatum 4. September durchgehend 14. Die URL-Tabelle enthält bereits Crawl-Daten bis 5. September. Diese unterschiedlichen Datenstände erhalten, nicht zu einer vermeintlichen täglichen Bestätigung bis 7. September zusammenziehen.

Der Benutzer ordnet den Beginn dem Launch zu. Der Export belegt den Beginn dieser Berichtskategorie, aber weder das exakte Deployment noch, ob dieselben URLs vorher indexiert waren oder unter einer anderen Ausschlusskategorie geführt wurden. Eine neue Meldungskategorie kann auch entstehen, nachdem erstmals ein Canonical gesetzt wurde; ein solcher Kategorienwechsel ist hier eine zu prüfende Hypothese, kein festgestellter Verlauf.

## URL-Prüfung Christoph

- Letzter Crawl: 5. September 2026, 08:37:58 gemäss Screenshot; Zeitzone dort nicht angegeben.
- Googlebot Smartphone, Abruf erfolgreich, Crawling und Indexierung erlaubt.
- Vom Nutzer deklarierter Canonical: `https://www.nightnurse.ch/en/team/christoph-deiters`.
- Von Google gewählter Canonical: `https://www.nightnurse.ch/team/christoph-deiters`.
- Als Sitemap erkannt: `https://www.nightnurse.ch/en/sitemap.xml`.
- Als verweisende Seiten genannt: deutsches Christoph-Profil und `/team/tom-boeninger`. Der deutsche Sprachwechsler ist eine mögliche normale Erklärung für einen solchen Verweis; diese Angabe allein belegt keinen falschen internen Link.

Die englische URL ist damit laut Screenshot aktuell nicht eigenständig indexiert. Eine rein historische Fehlermeldung darf nicht unterstellt werden. Ein aktueller Crawl beweist umgekehrt nicht, wann Google alle Signale des gesamten DE-/EN-Paars neu verarbeitet hat.

## Alle 14 betroffenen URLs

Alle Pfade beziehen sich auf `https://www.nightnurse.ch`. Alle lieferten bei der aktuellen Prüfung HTTP 200, einen auf die eigene URL verweisenden Canonical und `index, follow`.

| Pfad | Letzter Crawl laut Export | Sprachverweise im heutigen HTML |
| --- | --- | --- |
| `/en/portfolio/steinacker-kloten` | 05.09.2026 | de, en, x-default |
| `/en/team/francois-egreteau` | 05.09.2026 | de, en, x-default |
| `/en/team/christoph-deiters` | 05.09.2026 | de, en, x-default |
| `/en/team/alisa-muth` | 04.09.2026 | de, en, x-default |
| `/en/team/martina-morucci` | 04.09.2026 | de, en, x-default |
| `/en/team/jasmin-stricker` | 04.09.2026 | de, en, x-default |
| `/en/team/guenes-direk` | 04.09.2026 | de, en, x-default |
| `/en/portfolio/tag/ubs-funds` | 04.09.2026 | keine |
| `/en/team` | 03.09.2026 | de, en, x-default |
| `/en/team/mishka-voigt` | 02.09.2026 | de, en, x-default |
| `/en/expertise` | 01.09.2026 | de, en, x-default |
| `/en/team/cai-ling-duong` | 01.09.2026 | de, en, x-default |
| `/en/team/christopher-saller` | 01.09.2026 | de, en, x-default |
| `/portfolio` | 31.08.2026 | de, en, x-default |

Das Muster umfasst neun englische Personenprofile, eine englische Teamübersicht, eine englische Kompetenzseite, eine englische Projektseite, eine englische Tag-Seite und die deutsche Portfolioübersicht. Der Export nennt die von Google gewählten Ersatz-URLs nicht. Nur für Christoph ist die Zuordnung zur deutschen Version durch den Screenshot belegt. Insbesondere `/portfolio` darf nicht länger als nachweislich unbetroffen bezeichnet werden.

Die neun Personenprofile liefern englische biografische Absätze im HTML. Auch `/en/expertise` und `/en/portfolio/steinacker-kloten` enthalten englischen Haupttext. Die englischen Inhalte des Team-Detailtemplates werden direkt serverseitig ausgegeben. Das spricht gegen die pauschale Erklärung, nur Navigation und Footer seien übersetzt. Googles tatsächlich erfasster und gerenderter Inhalt bleibt separat zu prüfen.

Die Tag-Seite ist gesondert zu behandeln: Sie hat aktuell keine hreflang-Angaben. Ob sie eigenständig indexiert werden soll und ob die Ergebnisse gegenüber der Hauptübersicht eigenständig sind, ist Teil des bereits angelegten Filter-/Tag-Prüfpunkts. Dieser Befund erklärt nicht automatisch die übrigen 13 Fälle.

## Historie und Grenzen der bisherigen Diagnose

Das frühere Add-on `reachweb/locale-lander` und seine Entfernung sind im Repository dokumentiert (Commit `6f2bc1a`, 4. Juli 2026). Die Canonical-/hreflang-Ergänzung liegt ebenfalls vom 4. Juli vor (`af1a3c6`). Commitdaten belegen keine Produktions-Deploymentdaten. Ein Zusammenhang mit dem Launch muss über tatsächlich hochgeladene Dateien, Serverkonfiguration und Cachezustände geprüft werden.

Bei der vorausgehenden Live-Prüfung liessen sich Sprachweiterleitungen mit deutschem/englischem Sprachheader und einer übernommenen Sitzung nicht reproduzieren. Die aktuelle deutsche Kompetenz-URL ist `/kompetenzen`; `/expertise` leitet permanent dorthin weiter. Beide Sprachversionen der Kompetenzseite verweisen auf die aktuellen URLs.

Die korrekten heutigen HTML-Signale sind ein begrenzter technischer Befund, keine Bestätigung einer erfolgreichen Indexierung. Der Screenshot belegt, dass Google bei Christoph trotz erkanntem Self-Canonical eine andere Auswahl getroffen hat. Google beschreibt übersetzte Hauptinhalte normalerweise nicht als sprachübergreifende Duplikate: [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization).

## Priorisierter Auftrag an den Entwickler

### Vertiefte Prüfung auf automatische Spracherkennung

Am 7. September zusätzlich geprüft:

- Keine Treffer für das frühere Sprach-Add-on oder eine entsprechende Erkennung in Anwendungscode, Composer-Paketen, lokalen registrierten Paket-/Service-Caches und Website-JavaScript. Der Sprachwechsler erzeugt normale Links aus den CMS-Lokalisierungen.
- Live ausgelieferte Skripte `app-c267c68f.js`, `gdpr-f2c69d51.js` und der aktuelle öffentliche Tag-Manager-Container `GTM-MTN383N` auf typische Sprachdetektor-/Weiterleitungsmechanismen durchsucht: kein entsprechender Treffer. Eine Textsuche ist kein vollständiger Beweis gegen alle denkbaren dynamischen Skriptpfade.
- Deutsche Startseite mit englischem Sprachheader und englische Startseite mit deutschem Sprachheader: jeweils HTTP 200, kein Sprachwechsel. Beide Christoph-Profile zusätzlich mit französischem Sprachheader: jeweils HTTP 200 in der URL-Sprache.
- HTTP-/Apex-Aufruf des deutschen Christoph-Profils sowie HTTPS-/Apex-Aufruf der englischen Kompetenzseite: jeweils 301 auf HTTPS mit `www`, ursprünglicher Sprachpfad bleibt erhalten.
- Beide Christoph-Sprachversionen im echten Browser mit JavaScript geladen: passende Inhalte, keine automatische Sprachweiterleitung. Der englische Haupttext bleibt auch in mobiler Darstellung (412 × 823) ohne Interaktion sichtbar.

**Ergebnis:** Kein aktuell aktiver Sprachdetektor in den geprüften Codebeständen oder Live-Abrufen nachgewiesen. Die tatsächliche Produktions-Paketliste, PHP-Konfiguration, serverseitige Caches und Logs wurden nicht direkt eingesehen; IP-abhängige Sonderfälle lassen sich mit diesen Abrufen nicht vollständig ausschliessen. Ein blinder Ausbau weiterer Sprachlogik ist damit nicht begründet.

**Zusätzlicher Rendering-Befund:** Auf `/en/expertise` hat der Container des englischen Einleitungstexts beim initialen mobilen Abruf `opacity: 0`. Seine Section liegt unterhalb des bildschirmfüllenden Intros. Nach Scrollen wird die Section aktiv und der Text mit `opacity: 1` eingeblendet. Ursache im lokalen Code: anfängliche Transparenz in `resources/css/animations/fadeIn.css` und Aktivierung durch `resources/js/modules/observer.js`. Der Text ist bereits im HTML vorhanden, wird also nicht erst geladen. Dies ist eine zu prüfende Abhängigkeit der sichtbaren Darstellung von der Animation, **kein Nachweis**, dass Google den Text nicht indexiert oder deswegen die Canonical-Auswahl trifft. Beim Christoph-Profil liegt dieses Verhalten am Haupttext nicht vor. Googles gerenderte Ansicht der Kompetenzseite gezielt damit vergleichen; keine pauschale Gleichsetzung von CSS-Einblendung mit fehlendem Inhalt. Referenz: [Google zu Rendering und Lazy Loading](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading).

### Nächste Diagnose mit Produktions- und Google-Daten

1. **Zuerst `/en/expertise` und `/portfolio`:** URL-Prüfung jeweils mit gewählter Google-Canonical, deklarierter Canonical und letztem Crawl festhalten. Die gewählte Gegenseite ebenfalls prüfen. Für alle weiteren Export-URLs dieselben Angaben ergänzen, damit sprachübergreifende Zuordnungen von anderen Duplikaten getrennt werden können.
2. **Christoph als belegtes DE-/EN-Problem untersuchen:** Für beide Sprachen das von Google gecrawlte HTML und, soweit verfügbar, die gerenderte Ansicht sichern. Mit aktuellen Live-Tests vergleichen: Sprache und Umfang des Hauptinhalts, Canonicals, gegenseitige hreflang-Ziele, geladene Ressourcen und sichtbarer Haupttext auf Mobilgeräten. Ein erfolgreicher Live-Test allein bestätigt keine neue Canonical-Auswahl im Index.
3. **Launch nachvollziehen:** Produktionsänderungen und Serverlogs um den 28./29. August sowie die angegebenen Crawlzeitpunkte prüfen. Besonders Sprach-Add-on, alte/neue Templates, Weiterleitungen und mögliche unterschiedliche Cacheantworten untersuchen. Die alte Dokumentation pauschalisiert den Googlebot-Sprachheader; reguläre Googlebot-Aufrufe erfolgen laut [Google](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages) ohne `Accept-Language`.
4. **Vorherigen Indexzustand vergleichen:** Soweit Exporte vorhanden sind, dieselben URLs vor dem Launch auf «ohne vom Nutzer ausgewählte kanonische Seite», Weiterleitungsstatus und tatsächliche Indexierung prüfen. Der Sprung dieser einen Kategorie beweist für sich keinen Verlust von 14 zuvor indexierten Seiten.
5. **Gezielt korrigieren und kontrollieren:** Erst anhand der Abweichung einen Fix festlegen. Anschliessend wichtige URLs erneut zur Indexierung einreichen und die tatsächliche Google-Canonical nach Verarbeitung prüfen. Reguläre englische Seiten sollen eigenständig indexierbar bleiben. Für die Tag-Seite eine separate Indexierungsentscheidung treffen.

Die englische Sitemap ist Google für Christoph bereits bekannt. Eine erneute Einreichung oder Ergänzung in `robots.txt` ist keine hinreichende Lösung für die belegte Fehlzuordnung. Keine pauschalen Canonical- oder noindex-Änderungen allein aufgrund des Exportzählers vornehmen.

Referenz zur Berichtskategorie und zur Interpretation: [Google Search Console – Page indexing report](https://support.google.com/webmasters/answer/7440203).
