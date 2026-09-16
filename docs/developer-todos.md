# Entwickler-Briefing: technische Änderungen und offene Punkte

Stand: 7. September 2026

## Bereits umgesetzt: Änderungen ausserhalb der redaktionellen Inhalte

Die folgenden Anpassungen liegen **nicht** unter `content` oder `public/assets`. Sie sind für die korrekte Darstellung und Funktion der aktualisierten Inhalte erforderlich und deshalb – mit Ausnahme der ausdrücklich als lokal gekennzeichneten Datei – im FTP-Paket `ftp-upload-2026-08-31` enthalten.

### Responsive Videos

- `resources/views/partials/ui/media/video/fullscreen-wrapper.antlers.html`
  - Hoch- und Querformatvideos werden jetzt als getrennte `<source>`-Elemente ausgegeben.
  - Das Hochformat wird nur auf kleinen Geräten im Portrait-Modus verwendet; ansonsten greift das Querformat.
  - Dasselbe Verhalten wurde für direkt geladene und lazy-geladene Videos umgesetzt.
  - Die bisherige Übergabe über `data-video-source` wurde entfernt. Die bestehende Lazy-Loading-Logik kann die Quelle direkt aus `data-src` lesen.

### Projektseiten und Typografie

- `resources/views/partials/content/project/elements/image_text.antlers.html`
  - Überschriften und Fliesstext der Bild-/Text-Elemente erhielten responsive Schriftgrössen.
  - Ziel ist eine besser lesbare Darstellung auf grossen und sehr grossen Bildschirmen.
- `resources/views/project/show.antlers.html`
  - Vollseitige Bild-/Text-Abschnitte werden erst ab dem `3xl`-Breakpoint vertikal zentriert.
  - Damit werden Inhalte bei niedrigeren Viewport-Höhen nicht mehr ungünstig abgeschnitten.

### Portfolio, Team und Accordion

- `resources/views/partials/fieldsets/teaser/portfolio/item.antlers.html`
  - Falsche MIME-Types `img/webp` und `img/jpeg` wurden zu `image/webp` und `image/jpeg` korrigiert.
- `resources/views/team/index.antlers.html`
  - Die Teamübersicht fordert die Sortierung `order` neu ausdrücklich an. Damit folgt die Ausgabe der von Hand gepflegten Reihenfolge aus `content/trees/collections/*/team.yaml` und hängt nicht mehr vom Standardverhalten des Tags ab. Diese manuelle Reihenfolge ist gewollt; alphabetisch nach Vornamen soll ausdrücklich nicht sortiert werden.
- `resources/views/partials/ui/accordion/item.antlers.html`
  - Die Element-IDs des Accordions stammen neu aus der ID des jeweiligen FAQ-Items statt aus dem Schleifenindex. Der Index beginnt in jedem FAQ-Block wieder bei 1, wodurch Seiten mit mehreren Blöcken doppelte IDs und falsche `aria-controls`-Verweise erzeugten.
  - Links innerhalb aufgeklappter Accordion-Texte werden sichtbar hervorgehoben: mittlere Schriftstärke, Unterstreichung und Hover-Zustand.

### Ansprache, Kontaktformular und Cookie-Hinweis

Die fest im Template hinterlegten deutschen Texte wurden von der formellen Sie-Ansprache auf die Du-Ansprache umgestellt:

- `resources/views/contact.antlers.html`
- `resources/views/partials/layout/footer.antlers.html`
- `resources/views/partials/fieldsets/cta/project.antlers.html`
- `resources/views/partials/ui/form/contact.antlers.html`
- `resources/views/partials/ui/form/elements/errors.antlers.html`
- `resources/views/partials/ui/gdpr.antlers.html`
- `lang/en.json`

Wichtig: Die Schlüssel in `lang/en.json` mussten zusammen mit den deutschen Ausgangstexten geändert werden, damit die englischen Übersetzungen weiterhin gefunden werden.

### Social-Media- und Open-Graph-Metadaten

- `resources/views/partials/layout/head.antlers.html`
  - `og:description` verwendet konsistent das Attribut `property`.
  - `twitter:image` verwendet das Attribut `name` und gibt bei einem Statamic-Asset dessen URL (`open_graph_image:url`) aus.
  - Dadurch wird nicht mehr das Asset-Objekt beziehungsweise dessen interner Wert als Bildadresse ausgegeben.

### Projekt-Blueprint im Control Panel

- `resources/blueprints/collections/projects/project.yaml`
  - Hilfetexte für `teaser`, `summary` und `services` ergänzt.
  - Sie beschreiben Länge und Zweck der Felder sowie die gewünschte konsistente Benennung der Leistungen.
  - Die redaktionelle Referenz dazu liegt in `docs/project-content-standard-de.md`.

### Kompilierter Frontend-Build

- `public/build/manifest.json`
- `public/build/assets/*`

Der Frontend-Build wurde nach den Template-Anpassungen neu erstellt. Die aktuelle Manifest-Datei verweist insbesondere auf:

- `public/build/assets/app-28a9c2de.css`
- `public/build/assets/app-aef0eed8.js`

`manifest.json` und der komplette mitgelieferte Ordner `public/build/assets` müssen gemeinsam deployt werden. Alte Dateien mit Hash-Namen können auf dem Server bestehen bleiben; sie werden vom aktuellen Manifest nicht mehr referenziert.

### Nur lokal, nicht deployen

- `public/.user.ini`
  - Für die lokale Statamic-/PHP-Umgebung wurden Upload-, Speicher- und Zeitlimits erhöht, damit grosse Video-Uploads im Control Panel getestet werden konnten.
  - Diese Datei ist bewusst **nicht** im FTP-Paket enthalten, weil die passenden Werte von der PHP-/Webserver-Konfiguration des Zielservers abhängen.
  - Falls grosse Uploads auf Produktion benötigt werden, sollen die Limits kontrolliert in der dortigen Hosting-Konfiguration gesetzt werden.

### Keine fachlichen Änderungen

Unter Windows erscheinen bei `artisan`, `please` sowie mehreren `.gitignore`-Dateien Änderungen am Unix-Dateimodus (`100755` zu `100644`). Der Dateiinhalt wurde nicht verändert. Diese Modusänderungen gehören nicht zum Deployment und sind nicht im FTP-Paket enthalten.

## Bekannte Bugs

### Scroll-Animationen bleiben unsichtbar, wenn `is_fullpage` auf einer Seite `false` ist

**Lokal behoben am 7. September 2026:** `layout/section` setzt `data-section-observe` jetzt unabhängig von `is_fullpage`. Die Animationsseite verwendet wieder `is_fullpage: false`; der Seiteninhalt wird sichtbar, ohne bildschirmhohe Abschnitte zu erzwingen. Im Browser auf der Animationsseite (Desktop/Mobil) und auf der bestehenden Kompetenzseite geprüft. Noch nicht auf Produktion übertragen. Die folgende Fehlerbeschreibung dokumentiert den vorherigen Zustand.

- [ ] **Fix ist noch unvollständig:** Die Bedingung steht weiterhin an elf Stellen in `resources/views/project/show.antlers.html` sowie in `resources/views/project/_related.antlers.html`. Projektdetailseiten mit `is_fullpage: false` zeigen den Fehler deshalb weiterhin. Vor einer Änderung dort im Browser prüfen, da jede zusätzlich beobachtete Section auch Videos startet und die Logo-Byline ausblendet. Der Intro-Baustein (`partials/fieldsets/intro/wrapper.antlers.html`) ist zu Recht an `is_fullpage` gebunden, weil dort zusätzlich das Scroll-Snapping hängt.

Betroffen z. B.: `/animation-und-film` (Elemente „Title - Text" und „Teaser Project" / Portfolio-Masonry).

**Symptom:** Einzelne Seitenabschnitte erscheinen komplett leer, obwohl ihr Inhalt (Text, Bilder) korrekt im CMS gepflegt ist und im HTML ausgegeben wird. Betroffen sind bisher konkret die Elemente `title_text` (Titel + Fliesstext) und `teaser_project` (Portfolio-Masonry-Kachel).

**Ursache:** Diese Elemente animieren ihre Kinder über `[data-animation="..."]`-Attribute ein (siehe `resources/css/animations/*.css`); der Ausgangszustand ist `opacity: 0`, sichtbar wird der Inhalt erst, wenn ein Vorfahre die Klasse `.is-active` erhält. Diese Klasse setzt ausschliesslich der IntersectionObserver in `resources/js/modules/observer.js`, und zwar nur für Sections mit dem Attribut `data-section-observe`. Dieses Attribut wird in `resources/views/partials/layout/section.antlers.html` aber nur gesetzt, wenn das seitenweite Feld `is_fullpage` auf `true` steht:

```
{{ is_fullpage ? 'data-section-observe' : '' }}
```

Ist `is_fullpage: false` (z. B. weil eine Seite bewusst kompakt/ohne Fullpage-Intro gestaltet ist), wird die Section nie beobachtet, `.is-active` nie gesetzt – der Inhalt bleibt dauerhaft unsichtbar, nicht nur verzögert. Die CTA-Sektion (`cta_expertise`) ist zufällig **nicht** betroffen, weil `resources/views/partials/fieldsets/cta/wrapper.antlers.html` `data-section-observe` unabhängig von `is_fullpage` immer setzt, sobald `fullpage="true"` übergeben wird – das ist das Vorbild für die Lösung.

**Nicht als Fix geeignet:** Auf der betroffenen Seite einfach `is_fullpage: true` setzen. Das behebt zwar die Sichtbarkeit, weil dann *jede* Section auf der Seite beobachtet wird – aber jedes Element-Template übergibt an `layout/section` auch einen `fullpage`-Klassenparameter mit `min-h-screen ...`, wodurch **jede** Section der Seite auf mindestens Bildschirmhöhe aufgeblasen wird. Im Test wurde die Gesamthöhe von `/animation-und-film` dadurch von ca. 6858px auf ca. 9599px vergrössert (+40 %), mit grossen leeren Weissräumen um Titel, Services-Liste und Portfolio-Kachel. Das widerspricht dem für diese Seite bewusst kompakt/nüchtern angelegten Layout (siehe `docs/entwurf-landingpage-animation.md`) und ist keine allgemeingültige Lösung.

**Empfohlener Fix:** `data-section-observe` in `resources/views/partials/layout/section.antlers.html` unabhängig von `is_fullpage` immer setzen (analog zum CTA-Wrapper). Für bestehende Fullpage-Seiten ändert sich dadurch nichts; nicht-Fullpage-Seiten profitieren zusätzlich von funktionierenden Scroll-Animationen, ohne dass sich ihr Layout ändert.

## Offene Punkte

### SEO und Zugänglichkeit: Seiten ganz ohne H1

- [ ] Mehreren Seiten fehlt eine H1 vollständig: `/team`, `/portfolio` und `/kontakt` sowie `/datenschutz`, `/impressum` und `/vielen-dank`.
  - Ursache: Bei Seiten stammt die einzige H1 aus dem Intro-Baustein (`resources/views/partials/fieldsets/intro/content.antlers.html`). Die genannten Seiten laufen über eigene Templates wie `resources/views/team/index.antlers.html`, `resources/views/project/index.antlers.html` und `resources/views/contact.antlers.html`. Diese enthalten überhaupt keine Überschrift, weder H1 noch H2.
  - Ein redaktioneller Schalter am `title_text`-Baustein wurde geprüft und verworfen: Er wirkt nur auf Seiten mit Baukasten-Inhalten und damit gerade nicht auf den betroffenen Seiten. Zudem rendern diese Templates keine `page_elements`.
  - Vor der Umsetzung gestalterisch entscheiden, ob die Überschrift sichtbar sein soll oder nur für Suchmaschinen und Screenreader zugänglich. Danach je Template den Eintragstitel als H1 ausgeben und dafür das vorhandene Partial `resources/views/partials/ui/heading/h1.antlers.html` verwenden, statt die Tags von Hand zu schreiben.

### Video: Auswahl zwischen Hoch- und Querformat im Browser prüfen

- [ ] Die Quellenauswahl in `resources/views/partials/ui/media/video/fullscreen-wrapper.antlers.html` erfolgt über `media`-Attribute an den `<source>`-Elementen. Zuverlässig ausgewertet wird dieses Attribut nur in `<picture>`; bei `<video>` berücksichtigen es Chrome und Firefox nach bisherigem Kenntnisstand nicht, WebKit dagegen schon.
  - Folge im ungünstigen Fall: Der Browser nimmt die erste abspielbare Quelle, also das Hochformat, und zeigt es auch auf dem Desktop bildschirmfüllend beschnitten.
  - Prüfung: Hero-Seite in Chrome auf dem Desktop öffnen, DevTools → Netzwerk, geladene MP4-Datei kontrollieren. Anschliessend dasselbe in Safari und auf einem Telefon im Hochformat.
  - Falls das Hochformat überall geladen wird, die Auswahl per `matchMedia` im JavaScript setzen, statt sie dem Browser zu überlassen. Das Attribut `data-video-source` verfolgte ursprünglich genau diese Absicht, wurde vom JavaScript aber nie ausgewertet, weshalb bis dahin immer nur das Querformat ausgeliefert wurde.

### Teambilder: fehlendes Portrait bricht die Übersichtskarte

- [ ] `resources/views/partials/content/team/media/portrait.antlers.html` gibt `<img src="{{ glide:portrait … }}">` ohne Bedingung aus. Fehlt das Portrait, entsteht eine leere Bildadresse und die Übersichtskarte zeigt ein kaputtes Bild.
  - Das Portrait ist im Blueprint inzwischen ein Pflichtfeld, das deckt aber nur das Control Panel ab. Über FTP eingespielte oder von Hand bearbeitete Content-Dateien umgehen die Prüfung.
  - Sinnvoll wäre ein Rückfall auf ein Platzhalterbild oder das Auslassen der Karte, statt ein leeres `src` auszugeben. Betroffen sind die Teamübersicht und die Detailseite ohne Bildkarussell.
  - Sieben unveröffentlichte Einträge haben derzeit kein Portrait, teils aber ein gefülltes Bildkarussell. Vor dem Veröffentlichen ein Portrait ergänzen.

### SEO: automatisch erzeugte Tag-, Filter- und Parameterseiten

- [ ] Prüfen, ob die SEO-Behandlung dieser URL-Typen im CMS bewusst so vorgesehen ist und welche Seiten eigenständig bei Google ranken sollen.
  - Beispiele aus dem Hinweis vom 7. September 2026: `/en/portfolio?r=73`, `/en/services?pp=1`, `/en/blog/category/our-work?page=1`, `/en/blog/tag/...` und `/en/portfolio/tag/...`.
  - Zunächst je URL-Typ klären, welche Inhalte und Funktionen die Parameter beziehungsweise Tags steuern und ob eigenständige Inhalte, Duplikate, Filter oder paginierte Archive entstehen. Aktuelle Canonicals, Robots-Metadaten und interne Verlinkung prüfen; entsprechende deutsche URLs mitberücksichtigen.
  - Für Seiten ohne eigenes Ranking-Ziel je nach tatsächlichem CMS-Verhalten eine passende Behandlung festlegen: Canonical auf die entsprechende Hauptseite bei inhaltlich gleichen Varianten, `noindex` für reine Filter-/Archivseiten oder unnötige crawlbare Links auf Parameter-Varianten vermeiden.
  - Die genannten Möglichkeiten sind Prüfoptionen, keine pauschale Umsetzungsvorgabe. Eigenständige Tag-Seiten und Folgeseiten mit anderen Inhalten gesondert beurteilen.
  - Ergebnis und gewählte Regeln je URL-Typ dokumentieren und anhand repräsentativer URLs überprüfen.

### SEO: Canonicals regulärer englischer Portfolio-Seiten

- [ ] Reguläre englische Projektseiten genauer prüfen, insbesondere `/en/portfolio/hotel-complex-in-tirana` und `/en/portfolio/gruenauring` sowie weitere vergleichbare URLs.
  - Anlass ist der gemeldete Search-Console-Status «Duplicate without user-selected canonical» (Hinweis vom 7. September 2026; noch nicht technisch verifiziert).
  - Je URL zunächst feststellen, ob sie weiterhin eine reguläre englische Projektseite ist und indexiert werden soll oder inzwischen umgeleitet beziehungsweise entfernt wurde.
  - Für weiterhin bestehende, zur Indexierung vorgesehene Projektseiten einen sauberen Self-Canonical auf die eigene bevorzugte englische URL prüfen und bei Bedarf korrigieren. Die tatsächlich ausgegebene Canonical-Angabe und die von Google erfasste beziehungsweise ausgewählte kanonische URL vergleichen.
  - Bei inzwischen umgeleiteten oder entfernten URLs prüfen, ob die Search-Console-Meldung lediglich Altbestand ist; aktuellen HTTP-Status, allfälliges Weiterleitungsziel und Zeitpunkt des letzten Google-Crawls dokumentieren.
  - Befund und erforderliche Massnahmen je URL festhalten.

### SEO: englische Kompetenzseite und Team – Live-Prüfung vom 7. September 2026

**Nachtrag mit Search-Console-Belegen:** Der anschliessend gelieferte Export und Screenshot bestätigen ein aktuelles Indexierungsproblem trotz vorhandener Canonicals. Vollständige Auswertung und priorisierte Diagnose: [Search-Console-Auswertung vom 7. September 2026](seo-gsc-canonical-audit-2026-09-07.md). Die bisherige Live-Prüfung entkräftet dieses Problem nicht. Für Christoph ist der letzte Crawl am 5. September und die Auswahl der deutschen URL belegt; Google kennt dessen englische Sitemap bereits. Die unten noch als ungeprüft bezeichneten Angaben zum Anstieg von 0 auf 14 sind nun durch den Export bestätigt. Der Einreichungsstatus der Sitemap bleibt unbekannt, ihre Entdeckung durch Google ist belegt.

**Befund:** Die im gemeldeten Verlauf vermuteten fehlenden Sprachverweise beziehungsweise automatischen Sprachweiterleitungen sind aktuell in den geprüften Fällen nicht reproduzierbar.

- `/team/christoph-deiters`, `/en/team/christoph-deiters`, `/team`, `/en/team`, `/kompetenzen` und `/en/expertise` liefern jeweils HTTP 200, einen Self-Canonical auf die eigene absolute HTTPS-/www-URL sowie `index, follow`. Die jeweiligen DE-/EN-Paare verweisen gegenseitig per `hreflang` aufeinander; `x-default` zeigt auf Deutsch.
- Alle sieben geprüften URLs einschliesslich `/expertise` liefern mit deutschem und englischem `Accept-Language` denselben Status und dieselben Canonical-/Sprachsignale. `/expertise` liefert in beiden Fällen HTTP 301 auf `/kompetenzen`: Dies ist die aktuelle deutsche Haupt-URL, entsprechend der lokalen `.htaccess`.
- Zusätzliche Abrufe beider Christoph-Profile und von `/en/expertise` mit Googlebot-User-Agent ohne Sprachheader liefern ebenfalls HTTP 200 und die korrekten Canonical-/Sprachverweise. Dies simuliert nur die Kennung, keinen echten Google-Crawl oder dessen IP-Adresse.
- Ein deutscher Profilaufruf nach Besuch des englischen Profils mit übernommenen Sitzungscookies und englischem Sprachheader bleibt HTTP 200 ohne Weiterleitung.
- Der englische Hauptinhalt ist auf dem Christoph-Profil und der Kompetenzseite im ausgelieferten HTML vorhanden. Die Sprachzuordnungen sind lokal über `origin` hinterlegt; das gemeinsame Head-Template erzeugt die Canonical-/hreflang-Angaben aus diesen Zuordnungen.
- `robots.txt` sperrt das Crawling nicht. Die deutsche Sitemap `/sitemap.xml` und die englische `/en/sitemap.xml` enthalten die jeweils aktuellen Kompetenz-, Team- und Christoph-Profil-URLs. In `robots.txt` sind keine Sitemaps angegeben.

**Historie:** `docs/seo-investigation.md` dokumentiert ein früheres Problem mit `reachweb/locale-lander`. Git-Commit `6f2bc1a` vom 4. Juli 2026 entfernt dieses Add-on und dessen Konfiguration; Commit `af1a3c6` vom selben Tag ergänzt die SEO-Tags. Das Paket ist aktuell nicht in `composer.json`/`composer.lock` enthalten. Der tatsächliche damalige Produktions-Uploadtermin ist damit nicht belegt. Die alte Dokumentation behauptet pauschal, Googlebot sende `Accept-Language: en`; das darf nicht als gesicherte Grundlage der Ursachenanalyse übernommen werden. Google beschreibt reguläre Googlebot-Aufrufe ohne `Accept-Language`: https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages.

- [ ] Priorität: In der Search Console für `/en/expertise` den letzten Crawl, die von Google gewählte kanonische URL und das damals gecrawlte HTML mit einem aktuellen Live-Test vergleichen. Anschliessend beide Christoph-Profile und die Teamübersichten ebenso prüfen. Zugriff auf diese Search-Console-Daten lag bei der jetzigen Prüfung nicht vor.
- [ ] Prüfen, ob auch `/en/sitemap.xml` in der Search Console eingereicht ist; beide Sitemaps in `robots.txt` auffindbar machen oder über einen Sitemap-Index zusammenführen.
- [ ] Den gemeldeten Anstieg von 0 auf 14 Fälle zwischen 28. und 29. August mit Search-Console-Export, Crawlzeitpunkten und tatsächlichen Deployments abgleichen. Eine Ursache oder ein aktueller Fehler ist durch diese zeitliche Nähe allein nicht belegt.
- [ ] Falls der Live-Test korrekte aktuelle Angaben bestätigt, für die wichtige englische Kompetenzseite erneute Indexierung beantragen und die nächste Verarbeitung beobachten. Falls dort abweichendes HTML oder Weiterleitungen auftauchen, Server-/CDN-Regeln und Logs anhand dieses konkreten Abrufs untersuchen.

Referenz: https://developers.google.com/search/docs/crawling-indexing/canonicalization – Canonical ist ein Hinweis; übersetzter Hauptinhalt wird normalerweise nicht als sprachübergreifendes Duplikat behandelt. Die aktuelle Prüfung erklärt noch nicht, weshalb Google die berichtete Canonical-Auswahl getroffen hat. Andere IP-Standorte, sämtliche Cookies und alle weiteren Personenprofile wurden nicht getestet.

### Startseite

- [ ] Alte Sprungnavigation technisch bereinigen.
  - Die vier nicht mehr verwendeten Sprungziele wurden aus den Inhalten der deutschen Startseite entfernt.
  - Vor einer projektweiten Entfernung prüfen, ob andere Seiten die alten `anchors`-Inhalte noch benötigen. Solche Daten sind unter anderem noch auf «Über uns», «Kompetenzen» und englischen Seiten vorhanden.
  - Wenn die Funktion nirgends mehr gebraucht wird, das alte Feldset `resources/fieldsets/anchors.yaml` sowie allfällige zugehörige Frontend-Logik entfernen.
  - Die einzelnen `anchor`-Felder an Inhaltsabschnitten sind davon getrennt zu beurteilen: Sie könnten weiterhin für direkte Abschnittslinks verwendet werden.

- [ ] Optionalen Einleitungstext vor dem Logo-Marquee ermöglichen.
  - Den Baustein «Logo Marquee» um einen optionalen, lokalisierbaren Titel und einen optionalen kurzen Text erweitern.
  - Titel und Text oberhalb der Logos ausgeben und an die bestehenden Abstände und die Typografie der Startseite anpassen.
  - Wenn beide Felder leer sind, soll das heutige Layout unverändert bleiben.
  - Aktueller Text aus Hannes’ Feedback: «Unsere Partner. Viele seit über zehn Jahren.»
  - Englisch: «Our partners. Many have been with us for over ten years.»
  - Kunden werden gemäss Christoph ebenfalls «Partner» genannt. Die Aussage zur Dauer der Zusammenarbeit vor Verwendung redaktionell bestätigen.
  - Ergänzung aus dem Feedback: Logos dichter und präsenter anordnen; Abstände und Grössen auf Mobilgeräten und Desktop prüfen, ohne die Logos zu verzerren.

### Kompetenzen

- [ ] Bilder der Kompetenz-Kacheln als Mouse-over-Animationen umsetzen.
  - Betrifft die Kacheln auf der Kompetenzen-Seite, zum Beispiel «Architektur», «Immobilienvermarktung» sowie «Öffentliche und politische Projekte».
  - Im Ruhezustand wie bisher ein statisches Vorschaubild anzeigen.
  - Beim Darüberfahren mit der Maus soll das zur jeweiligen Kachel hinterlegte Video automatisch und ohne Ton abgespielt werden, sodass das Bild lebendig wird.
  - Verlässt der Mauszeiger die Kachel, soll wieder das statische Vorschaubild erscheinen.
  - Auf Geräten ohne Mouse-over weiterhin das statische Vorschaubild verwenden.

### Seiten-Baukasten: neuer Editorial-/Artikel-Baustein

- [ ] Neuen `page_elements`-Baustein für Seiten schaffen, der optisch dem Blog-Artikel-Layout entspricht (durchgehender Fliesstext statt einzelner Module).
  - Anlass: Rückmeldung zu `/animation-und-film` (Christoph) – das bestehende Baukasten-Layout (einzelne Module wie „Title - Text", Services, Portfolio-Teaser) wirkt für diese Seite weniger gut als das Editorial-Layout der Blogartikel (`resources/views/blog/show.antlers.html`).
  - Das Blog-Layout ist strukturell einfach: optionales Titelbild (`content/post/media/feature`), `h1`, optionaler Teaser, dann **ein** Bard-Feld `content` mit eingebetteten Sets `text`/`image`/`video`/`image_slideshow` (Blueprint: `resources/blueprints/collections/posts/post.yaml`), zum Schluss Tags und ein posts-spezifischer „Ähnliche Beiträge"-Block (`resources/views/blog/_related.antlers.html`).
  - Direktes Umbiegen einer Seite auf `template: blog/show` (wie es `kontakt.md`/`datenschutz.md`/`impressum.md` bereits für ihre Spezial-Templates tun) ist **kein** brauchbarer Weg: Der `page`-Blueprint hat kein Äquivalent zum durchgehenden `content`-Bard-Feld (Artikeltext bliebe leer), und `blog/_related.antlers.html` fragt hart verdrahtet die `posts`-Collection nach Kategorie ab und verlinkt eine feste Blog-Übersichts-Entry-ID – auf einer Leistungsseite erschienen dort themenfremde Blogteaser und ein unpassender „Zur Blog-Übersicht"-Link.
  - Sauberer Ansatz stattdessen: eigener Baustein-Typ (Arbeitstitel `article_body` o. ä.) analog zu den bestehenden Fieldsets unter `resources/fieldsets/` bzw. `resources/views/partials/fieldsets/`, registriert im `page`-Blueprint (`resources/blueprints/collections/pages/page.yaml`) und in `resources/views/partials/dispatcher.antlers.html`. Enthält optionales Kopfbild + ein Bard-Feld mit denselben Sets wie bei Posts (`text`/`image`/`video`/`image_slideshow`, ggf. dieselben Sub-Partials aus `content/post/media/*` wiederverwenden), aber ohne Tags und ohne den „Ähnliche Beiträge"-Block.
  - Damit bleibt der Baustein frei mit den übrigen Modulen kombinierbar (z. B. Artikeltext + anschliessender Portfolio-Teaser + CTA, wie aktuell auf `/animation-und-film` verwendet) und es entsteht keine Abhängigkeit von blogspezifischer Query-Logik.
  - Priorität/Umfang mit Christoph abstimmen, bevor Aufwand geschätzt wird – bisher nur als Wunsch geäussert, nicht als Auftrag freigegeben.

## Ergänzungen aus «Website-Feedback Hannes – Umsetzung» vom 7. September 2026

Quelle: [Website-Feedback Hannes – Umsetzung](https://app.notion.com/p/3cf0be17ef8381149247f0699c0e33f0).

Die redaktionellen Änderungen sind lokal in Deutsch und Englisch eingepflegt. Die folgenden Aufgaben bleiben technisch offen. Bestehende Änderungen und offene Punkte weiter oben gelten weiterhin. Die Logo-Erweiterung wurde oben ergänzt, statt sie nochmals als eigene Aufgabe anzulegen.

Hinweis zur Content-Übergabe: Das Paket `ftp-upload-content-hannes-2026-09-07` enthält auch die korrigierte Metadatendatei von Christoph Deiters’ Übersichtsfoto.

Überholt: Die ursprünglich hier vermerkte Anweisung, nach dem Upload den Asset-Metadaten-Cache zu erneuern (`php artisan statamic:assets:clear-cache`), ist für den Alternativtext nicht mehr nötig. Die Alternativtexte der Teambilder stammen inzwischen aus dem Eintragstitel, also dem Namen der Person, und nicht mehr aus den Asset-Metadaten. Betroffen sind `resources/views/partials/content/team/media/portrait.antlers.html` und das Bildkarussell auf den Teamprofilen. Die gepflegten Alt-Texte in den Asset-Metadaten erscheinen damit nicht mehr auf den Teamseiten.

### CTA-System, Header und Footer

- [ ] Hauptaktion im Header als visuell abgesetzten Button «Sprechstunde» / «Consultation» ausgeben und den bisherigen Header-Menüpunkt «Kontakt» entsprechend ersetzen.
  - Reguläre Kontaktlinks im Footer und in der Navigation können bestehen bleiben. Das Ziel ist eine deutlich erkennbare Hauptaktion.
  - Betroffen: `resources/views/partials/layout/header.antlers.html`, Hauptnavigation und die verwendeten Button-Partials.
- [ ] Haupt-CTAs in Menü und Footer auf «Sprechstunde vereinbaren» / «Book a consultation» vereinheitlichen.
  - Aktuell enthält `resources/views/partials/menu/wrapper.antlers.html` noch «Offerte anfragen» und `resources/views/partials/layout/footer.antlers.html` noch «Kontakt aufnehmen» als CTA.
  - «Offerte anfragen» / «Request a quote» nur für einen tatsächlich projektspezifischen Anfrageweg verwenden.
  - Übersetzungsschlüssel und englische Werte in `lang/en.json` gleichzeitig ergänzen. Kein globales Ersetzen aller Kontaktlinks.
  - Das aktuelle Ziel der Sprechstunden-Buttons ist die Kontaktseite. Falls eine direkte Terminbuchung gewünscht ist, muss deren Ziel noch festgelegt werden; aktuell gibt es keinen belegten Buchungslink.
- [ ] Auch am Ende der Portfolioübersicht die Hauptaktion prüfen und korrigieren.
  - Dort wird gegenwärtig der allgemeine Footer mit «Kontakt aufnehmen» ausgegeben. Der bereits abgehakte Notion-Punkt ist damit lokal noch nicht vollständig erfüllt.

### Startseite und Kompetenz-Kacheln

- [ ] Die drei Segment-Kacheln um ein optionales, lokalisierbares Beschreibungsfeld erweitern.
  - Feldset: `resources/fieldsets/teaser_competencies.yaml`; Ausgabe: `resources/views/partials/fieldsets/teaser/competencies/item.antlers.html`.
  - Architektur: «Wettbewerbe, Studien, Projektentwicklung.» / «Competitions, studies, project development.»
  - Immobilienvermarktung: «Schlüsselbilder, die verkaufen und vermieten.» / «Key images for sales and leasing.»
  - Öffentliche und politische Projekte: «Bilder, die Mehrheiten schaffen.» / «Images that build public support.»
  - Beschreibung unter der jeweiligen Überschrift darstellen; sowohl Kacheln mit Bild als auch reine Textkacheln berücksichtigen.
- [ ] Im Hero einen optionalen, lokalisierbaren Erklärungstext unterhalb der Headline ermöglichen.
  - Das aktuelle Intro besitzt nur ein Titel-Feld. Die freigegebene Headline ist bereits im Content umgesetzt; Erfahrung und Leistungsbreite stehen im anschliessenden Einleitungsblock.
  - Gewünschte Ergänzung direkt im Hero: «Seit 16 Jahren aus Zürich – für Wettbewerbe, Immobilienvermarktung und öffentliche Kommunikation.»
  - Englisch: «Based in Zurich for 16 years – for competitions, real estate marketing and public communication.»
  - Den Erklärungstext kleiner als die Hauptüberschrift ausgeben, statt ihn als weitere H1-Zeile anzuhängen. Das vorhandene Layout ohne Erklärungstext beibehalten.

### Projekte und Portfolio

- [ ] «Zum Projekt» auf den Startseiten-Projektkacheln durch einen eindeutigen Pfeil-Button ersetzen.
  - Bestehendes Linkziel erhalten; einen zugänglichen Namen wie «Projekt [Titel] ansehen» / «View project [title]» vergeben.
  - Betroffen: `resources/views/partials/fieldsets/teaser/portfolio/item.antlers.html`.
- [ ] Beim Hover auf Projektkacheln Titel und Teaser sichtbar stehen lassen; nur ein zusätzliches Hover-Element einblenden.
  - Touch- und Tastaturbedienung mitprüfen. Die Information muss auch ohne Hover zugänglich sein.
- [ ] Auf Projektdetailseiten deutlich sichtbare Pfeile für vorheriges und nächstes Projekt ergänzen.
  - Veröffentlichungsstatus und aktive Sprache berücksichtigen; keine Links auf unveröffentlichte Projekte erzeugen.
- [ ] Vorher-Nachher-Slider als prominenten Startseiten-Baustein nutzbar machen.
  - Bisher ist auf der Startseite kein entsprechender Baustein gepflegt. Wiederverwendung der bestehenden Projekt-Komponenten und deren Freigabe für Seiten prüfen.
  - Platzierung im Projektbereich der Startseite vorsehen. Das konkrete Bildpaar und die finale Position müssen redaktionell ausgewählt werden.
- [ ] Auftraggeber in den Portfolio-Kacheln visuell stärker hervorheben.
  - Vorhandenes Feld `client` verwenden; keine Umbenennung von Projektbeteiligten oder Änderung der Projektdaten nötig.
  - Die Bezeichnung «Partner» ist auch für Auftraggeber gewünscht. Typografische Gewichtung auf Desktop und Mobilgeräten abstimmen.

### Blog-Teaser

- [ ] Datumsangaben in den Blog-Teasern entfernen, sodass Bild und Titel bleiben.
  - Betroffen: `resources/views/partials/fieldsets/teaser/post/item.antlers.html`, verwendet für Desktop und mobilen Slider.
  - Veröffentlichungsdaten, chronologische Sortierung und Artikel-URLs erhalten. Es geht um die sichtbaren Teaser, nicht um das Löschen von Datumswerten im CMS.
  - Der Beitragstitel «Erfahre das Geheimnis hinter unseren Visualisierungen» war deutsch bereits korrekt; Englisch wurde im Content auf «Discover the secret behind our visualizations» angeglichen. Dafür ist keine Template-Änderung erforderlich.

### Nightnurse-Netzwerk

- [ ] Einen optionalen, lokalisierbaren Einleitungstext im Netzwerk-Baustein ergänzen und vor den Partnern ausgeben.
  - Feldset: `resources/fieldsets/network.yaml`; Ausgabe: `resources/views/partials/fieldsets/network/wrapper.antlers.html`.
  - Angepasster deutscher Entwurf: «Unser Netzwerk verbindet unterschiedliche Perspektiven auf Raum, Gestaltung und Kommunikation. Je nach Aufgabe kommen zusätzliche Kompetenzen dazu. So lässt sich dein Projekt über die Visualisierung hinaus weiterdenken.»
  - Englisch: «Our network brings together different perspectives on space, design and communication. Depending on the task, we bring in additional expertise to help develop your project beyond visualization.»
  - Den ursprünglichen Entwurf mit «Lichtplanung, Bewegtbild und Szenografie» nicht unverändert übernehmen: Er beschreibt nicht alle verlinkten Organisationen. Die konkrete Zusammenarbeit und das Versprechen eines einzigen Ansprechpartners müssen intern bestätigt werden.
  - Quellenprüfung: [Christian Ammann – Fotografie und Film](https://photographer.ch/about), [Lightsphere – Lichtplanung](https://lightsphere.ch/en/portfolio/services/), [Team Ensemble – gesellschaftliche Zusammenarbeit](https://team-ensemble.ch/), [SHIFT – Stadt- und Siedlungsentwicklung](https://shift.immo/). SHIFT wurde anhand des Logos und der Anschrift eindeutig zugeordnet.
  - Die fehlerhaften Netzwerk-Links sind im deutschen und englischen Content sowie im Upload-Paket `ftp-upload-content-hannes-2026-09-07/` korrigiert: Christian Ammann auf `https://photographer.ch/`, SHIFT auf `https://shift.immo/`. Noch nicht veröffentlicht; die Live-Seite verlinkt am 7. September 2026 weiterhin `https://www.christian-amman.ch` und `https://shift.ch`. Originale Bilddateinamen bleiben erhalten.

### Entscheidungen und spätere technische Aufgaben

Diese Punkte sind weiterhin offen und sollen nicht als freigegebene Umsetzung behandelt werden:

- [ ] Instagram-Feed statt Blog: redaktionelle Entscheidung einholen; erst danach Integration, Ladeverhalten und Datenschutz prüfen.
- [ ] «Imagine tomorrow»: Entscheidung über Beibehaltung oder kleinere Platzierung beim Logo. Der Claim bleibt vorerst im vorhandenen Einleitungsblock.
- [ ] Animiertes Logo-Element und Burger-Menü-Effekt: als späteren Schritt planen.
- [ ] Farbe im Corporate Design: separates Gestaltungsthema, noch kein Auftrag zur Anpassung der bestehenden Farben.

Video-Neuschnitt (Denzler Haus und Brücke), Teamfotos, Mitarbeiterinterviews und ein Hero-Film mit Menschen sind Produktionsaufgaben. Die Entscheidung über Stellenanzeigen und eine spätere KI-Seite bleibt redaktionell. Diese Punkte sind in der ursprünglichen Notion-Liste weiterhin offen.
