# Entwickler-Briefing: technische Änderungen und offene Punkte

Stand: 17. September 2026

## Bereits umgesetzt: Änderungen ausserhalb der redaktionellen Inhalte

Die folgenden Anpassungen liegen **nicht** unter `content` oder `public/assets`. Sie sind für die korrekte Darstellung und Funktion der aktualisierten Inhalte erforderlich. Sie sind – mit Ausnahme der ausdrücklich als lokal gekennzeichneten Datei – im Repository enthalten und werden über Git ausgeliefert; die früheren manuellen FTP-Pakete entfallen.

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

- `public/build/assets/app-b78a33d3.css` (aus `resources/css/app.css`, enthält Tailwind)
- `public/build/assets/app-dbd11412.js` (aus `resources/js/app.js`, mit `app-816446ca.css`)

Die früher hier genannten Dateien `app-28a9c2de.css` und `app-aef0eed8.js` sind durch die beiden späteren Rebuild-Commits überholt. Die Angaben oben entsprechen dem Stand vom 17. September 2026.

`manifest.json` und der komplette mitgelieferte Ordner `public/build/assets` müssen gemeinsam deployt werden. Alte Dateien mit Hash-Namen können auf dem Server bestehen bleiben; sie werden vom aktuellen Manifest nicht mehr referenziert.

### Korrekturen vom 17. September 2026 ohne Frontend-Build

Die folgenden Änderungen sind lokal umgesetzt und auf dem lokalen Entwicklungssystem
über alle Projekt-, Team-, Blog- und Seitentypen in beiden Sprachen geprüft
(64 Seiten, alle HTTP 200). Sie halten bewusst eine Bedingung ein: **keine neue
CSS-Klasse und kein neues Feld.** Deshalb ist kein `npm run build` nötig und
`public/build` bleibt unverändert. Nachgewiesen wurde das, indem die Klassen-Tokens
jeder geänderten Datei gegen den Stand in Git und gegen das kompilierte CSS
verglichen wurden; neu hinzugekommen ist keines.

- `resources/views/project/show.antlers.html` — Tippfehler behoben (siehe unten).
- `resources/views/partials/content/project/elements/image_text.antlers.html` — Entweder-oder-Ausgabe und Formatentscheidung.
- `resources/views/partials/ui/media/image/image_carousel.antlers.html` — Rahmen ohne Bild überspringen.
- `resources/views/partials/content/team/media/portrait.antlers.html` — Schutz gegen fehlendes Portrait.
- `resources/views/partials/fieldsets/teaser/post/item.antlers.html` — Datum im Blog-Teaser entfernt.
- `resources/views/partials/menu/wrapper.antlers.html`, `resources/views/partials/layout/footer.antlers.html`, `lang/en.json` — Haupt-CTA vereinheitlicht.
- `resources/fieldsets/image_carousel.yaml`, `resources/fieldsets/image_slideshow.yaml`, `resources/blueprints/collections/projects/project.yaml`, `resources/blueprints/collections/posts/post.yaml` — Feldbeschriftungen im Control Panel.

Die Einzelheiten stehen jeweils bei der ursprünglichen Fehlerbeschreibung weiter
unten. Sichtungsbedarf besteht vor allem bei der Formatentscheidung im Baustein
`image_text`, weil sich dort das Layout auf vielen Projektseiten sichtbar ändert.

### Verirrtes Anführungszeichen in den Projektseiten

- `resources/views/project/show.antlers.html`, Zeile 107
  - Im Klassen-String einer Section stand ein zusätzliches Anführungszeichen:
    `class="{{ is_fullpage ? '"min-h-screen flex flex-col justify-center' : … }}"`.
  - Auf Projektseiten mit `is_fullpage: true` schloss dieses Zeichen das
    `class`-Attribut vorzeitig. Die Section erhielt dadurch keine ihrer Klassen,
    `min-h-screen flex flex-col justify-center` wurde stattdessen als ungültiges
    Attribut ausgegeben.
  - Der Fehler war bisher nicht dokumentiert und fiel beim Nachzählen der elf
    `is_fullpage`-Bedingungen auf.

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

Betroffen z. B.: `/angebot/animation-und-film` (Elemente „Title - Text" und „Teaser Project" / Portfolio-Masonry).

Hinweis zur URL: Die Seite lag in diesem Briefing bisher als `/animation-und-film` vor. Diese Adresse liefert HTTP 404. Der Eintrag hängt im Seitenbaum unter «Angebot», die gültige deutsche URL ist `/angebot/animation-und-film` (lokal am 17. September 2026 mit HTTP 200 geprüft).

**Symptom:** Einzelne Seitenabschnitte erscheinen komplett leer, obwohl ihr Inhalt (Text, Bilder) korrekt im CMS gepflegt ist und im HTML ausgegeben wird. Betroffen sind bisher konkret die Elemente `title_text` (Titel + Fliesstext) und `teaser_project` (Portfolio-Masonry-Kachel).

**Ursache:** Diese Elemente animieren ihre Kinder über `[data-animation="..."]`-Attribute ein (siehe `resources/css/animations/*.css`); der Ausgangszustand ist `opacity: 0`, sichtbar wird der Inhalt erst, wenn ein Vorfahre die Klasse `.is-active` erhält. Diese Klasse setzt ausschliesslich der IntersectionObserver in `resources/js/modules/observer.js`, und zwar nur für Sections mit dem Attribut `data-section-observe`. Dieses Attribut wird in `resources/views/partials/layout/section.antlers.html` aber nur gesetzt, wenn das seitenweite Feld `is_fullpage` auf `true` steht:

```
{{ is_fullpage ? 'data-section-observe' : '' }}
```

Ist `is_fullpage: false` (z. B. weil eine Seite bewusst kompakt/ohne Fullpage-Intro gestaltet ist), wird die Section nie beobachtet, `.is-active` nie gesetzt – der Inhalt bleibt dauerhaft unsichtbar, nicht nur verzögert. Die CTA-Sektion (`cta_expertise`) ist zufällig **nicht** betroffen, weil `resources/views/partials/fieldsets/cta/wrapper.antlers.html` `data-section-observe` unabhängig von `is_fullpage` immer setzt, sobald `fullpage="true"` übergeben wird – das ist das Vorbild für die Lösung.

**Nicht als Fix geeignet:** Auf der betroffenen Seite einfach `is_fullpage: true` setzen. Das behebt zwar die Sichtbarkeit, weil dann *jede* Section auf der Seite beobachtet wird – aber jedes Element-Template übergibt an `layout/section` auch einen `fullpage`-Klassenparameter mit `min-h-screen ...`, wodurch **jede** Section der Seite auf mindestens Bildschirmhöhe aufgeblasen wird. Im Test wurde die Gesamthöhe von `/angebot/animation-und-film` dadurch von ca. 6858px auf ca. 9599px vergrössert (+40 %), mit grossen leeren Weissräumen um Titel, Services-Liste und Portfolio-Kachel. Das widerspricht dem für diese Seite bewusst kompakt/nüchtern angelegten Layout und ist keine allgemeingültige Lösung.

**Empfohlener Fix:** `data-section-observe` in `resources/views/partials/layout/section.antlers.html` unabhängig von `is_fullpage` immer setzen (analog zum CTA-Wrapper). Für bestehende Fullpage-Seiten ändert sich dadurch nichts; nicht-Fullpage-Seiten profitieren zusätzlich von funktionierenden Scroll-Animationen, ohne dass sich ihr Layout ändert.

## Offene Punkte

### Versionierung: die Regel `content` in `.gitignore` greift zu breit

Aufgefallen beim Committen am 17. September 2026. Zeile 32 von `.gitignore` enthält
das Muster `content` ohne Pfadangabe. Git wendet ein solches Muster auf **jedes**
Verzeichnis dieses Namens an, unabhängig von der Ebene.

Zwei verschiedene Wirkungen sind zu unterscheiden:

- Das CMS-Verzeichnis `content/` ist damit vollständig von der Versionierung
  ausgenommen. Das ist offensichtlich so gewollt und in sich stimmig: Es ist keine
  einzige Datei daraus versioniert. Redaktionelle Inhalte gelangen also nicht über
  Git auf Staging und Produktion, sondern auf einem anderen Weg. Das sollte bei
  jeder Aussage über den Deployment-Weg mitgedacht werden.
- **Unbeabsichtigt** trifft dasselbe Muster aber auch
  `resources/views/partials/content/`, also Template-Partials. Dort liegen aktuell
  26 versionierte Dateien; sie bleiben erfasst, weil bereits versionierte Dateien
  von `.gitignore` nicht mehr berührt werden. Eine **neue** Datei in diesem Ordner
  würde jedoch stillschweigend ignoriert und bei einem `git add .` schlicht
  fehlen. Beim Hinzufügen einzeln benannter Pfade warnt Git zwar und liefert einen
  Fehlercode, fügt bereits versionierte Dateien aber trotzdem hinzu — die Warnung
  lässt sich also leicht übersehen.

- [ ] Muster verengen, damit nur das CMS-Verzeichnis gemeint ist: `/content` statt
  `content` trifft ausschliesslich das Verzeichnis im Projektstamm. Anschliessend
  mit `git check-ignore -v resources/views/partials/content/team/media/portrait.antlers.html`
  und `git check-ignore -v content/collections/projects/de/beliebig.md` überprüfen,
  dass die Template-Partials frei sind und `content/` weiterhin ignoriert bleibt.
- [ ] Dieselbe Prüfung lohnt sich für die ebenfalls pfadlosen Muster `users` (Zeile 31)
  und `INSTALL.txt`. `users` trifft neben `resources/users` auch jedes andere
  gleichnamige Verzeichnis.
- [ ] Danach kontrollieren, ob unter `resources/views/partials/content/` bereits
  Dateien fehlen, die eigentlich versioniert sein sollten.

### SEO und Zugänglichkeit: Seiten ganz ohne H1

- [ ] Mehreren Seiten fehlt eine H1 vollständig: `/team`, `/portfolio` und `/kontakt` sowie `/datenschutz`, `/impressum` und `/vielen-dank`.
  - Ursache: Bei Seiten stammt die einzige H1 aus dem Intro-Baustein (`resources/views/partials/fieldsets/intro/content.antlers.html`). Die genannten Seiten laufen über eigene Templates wie `resources/views/team/index.antlers.html`, `resources/views/project/index.antlers.html` und `resources/views/contact.antlers.html`. Diese enthalten überhaupt keine Überschrift, weder H1 noch H2.
  - Ein redaktioneller Schalter am `title_text`-Baustein wurde geprüft und verworfen: Er wirkt nur auf Seiten mit Baukasten-Inhalten und damit gerade nicht auf den betroffenen Seiten. Zudem rendern diese Templates keine `page_elements`.
  - Vor der Umsetzung gestalterisch entscheiden, ob die Überschrift sichtbar sein soll oder nur für Suchmaschinen und Screenreader zugänglich. Danach je Template den Eintragstitel als H1 ausgeben und dafür das vorhandene Partial `resources/views/partials/ui/heading/h1.antlers.html` verwenden, statt die Tags von Hand zu schreiben.

### Video: Auswahl zwischen Hoch- und Querformat

**In Chrome geprüft und in Ordnung.** Die Quellenauswahl in `resources/views/partials/ui/media/video/fullscreen-wrapper.antlers.html` erfolgt über `media`-Attribute an den `<source>`-Elementen. Chrome wertet sie aus: Ein breites Fenster lädt das Querformat, ein schmales das Hochformat.

Die Auswahl findet einmalig beim Laden der Seite statt und wird beim Verändern der Fenstergrösse nicht wiederholt. Das entspricht dem Verhalten von Medienelementen und ist kein Fehler. Praktisch relevant ist davon nur das Drehen eines Telefons nach dem Laden: Die bereits gewählte Datei bleibt und wird skaliert. Ein Nachladen bei Orientierungswechsel würde das Video neu starten und wäre störender als der jetzige Zustand.

Zur Einordnung: Vor dieser Änderung wurde das Hochformat auf keinem Gerät ausgeliefert. Das frühere Attribut `data-video-source` verfolgte diese Absicht, wurde vom JavaScript aber nie ausgewertet.

### Teambilder: fehlendes Portrait bricht die Übersichtskarte

- [x] **Lokal behoben am 17. September 2026.** `resources/views/partials/content/team/media/portrait.antlers.html` gab `<img src="{{ glide:portrait … }}">` ohne Bedingung aus. Fehlte das Portrait, entstand eine leere Bildadresse und die Übersichtskarte zeigte ein kaputtes Bild. Die Ausgabe ist jetzt in `{{ if portrait }}` gefasst; ohne Portrait entfällt die Figur vollständig. Gewählt wurde bewusst das Auslassen statt eines Platzhalterbildes, weil dafür kein Asset vorhanden ist. Auf der Teamübersicht bleibt dadurch eine leere Rasterzelle, falls ein veröffentlichter Eintrag kein Portrait hat — sichtbar als Lücke, nicht mehr als kaputtes Bild.
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
  - Anlass: Rückmeldung zu `/angebot/animation-und-film` (Christoph) – das bestehende Baukasten-Layout (einzelne Module wie „Title - Text", Services, Portfolio-Teaser) wirkt für diese Seite weniger gut als das Editorial-Layout der Blogartikel (`resources/views/blog/show.antlers.html`).
  - Das Blog-Layout ist strukturell einfach: optionales Titelbild (`content/post/media/feature`), `h1`, optionaler Teaser, dann **ein** Bard-Feld `content` mit eingebetteten Sets `text`/`image`/`video`/`image_slideshow` (Blueprint: `resources/blueprints/collections/posts/post.yaml`), zum Schluss Tags und ein posts-spezifischer „Ähnliche Beiträge"-Block (`resources/views/blog/_related.antlers.html`).
  - Direktes Umbiegen einer Seite auf `template: blog/show` (wie es `kontakt.md`/`datenschutz.md`/`impressum.md` bereits für ihre Spezial-Templates tun) ist **kein** brauchbarer Weg: Der `page`-Blueprint hat kein Äquivalent zum durchgehenden `content`-Bard-Feld (Artikeltext bliebe leer), und `blog/_related.antlers.html` fragt hart verdrahtet die `posts`-Collection nach Kategorie ab und verlinkt eine feste Blog-Übersichts-Entry-ID – auf einer Leistungsseite erschienen dort themenfremde Blogteaser und ein unpassender „Zur Blog-Übersicht"-Link.
  - Sauberer Ansatz stattdessen: eigener Baustein-Typ (Arbeitstitel `article_body` o. ä.) analog zu den bestehenden Fieldsets unter `resources/fieldsets/` bzw. `resources/views/partials/fieldsets/`, registriert im `page`-Blueprint (`resources/blueprints/collections/pages/page.yaml`) und in `resources/views/partials/dispatcher.antlers.html`. Enthält optionales Kopfbild + ein Bard-Feld mit denselben Sets wie bei Posts (`text`/`image`/`video`/`image_slideshow`, ggf. dieselben Sub-Partials aus `content/post/media/*` wiederverwenden), aber ohne Tags und ohne den „Ähnliche Beiträge"-Block.
  - Damit bleibt der Baustein frei mit den übrigen Modulen kombinierbar (z. B. Artikeltext + anschliessender Portfolio-Teaser + CTA, wie aktuell auf `/angebot/animation-und-film` verwendet) und es entsteht keine Abhängigkeit von blogspezifischer Query-Logik.
  - Priorität/Umfang mit Christoph abstimmen, bevor Aufwand geschätzt wird – bisher nur als Wunsch geäussert, nicht als Auftrag freigegeben.

### Bild-Bausteine: Karussell, Slideshow und Einzelbild

Frage aus der Redaktion: Bei einigen Bausteinen lässt sich zwischen einem Bildkarussell und einem Einzelbild wählen. Könnte man nicht immer das Karussell verwenden und dort einfach nur ein Bild einfügen, wenn nur ein Bild gewünscht ist?

**Ausgangslage:** Im CMS gibt es drei Bildmechanismen, die trotz ähnlicher Bezeichnungen technisch und gestalterisch verschiedene Dinge sind.

- **Einzelbild** (`resources/fieldsets/image.yaml`, `image_fullscreen.yaml`): Ausgabe über `resources/views/partials/content/project/elements/image.antlers.html` in voller Containerbreite, mit `2xl`-Presets auf dem Desktop, `loading="lazy"` und der Scroll-Animation `fadeIn`.
- **Slideshow** (`resources/fieldsets/image_slideshow.yaml`): eine von Hand blätterbare Galerie auf Basis von Swiper. Ausgabe über `resources/views/partials/content/project/elements/slideshow.antlers.html` mit Vor-/Zurück-Navigation, seitlichem Abstand (`sm:px-80 xl:px-100`), Höhenbegrenzung `max-h-[700px]`, ohne `loading="lazy"` und ohne Scroll-Animation. Die Navigationspfeile werden immer ausgegeben, auch bei einem einzigen Bild; die Swiper-Instanz für diese Galerien registriert das Navigations-Modul bewusst nicht, sondern verdrahtet die Pfeile von Hand (`resources/js/modules/swiper/index.js`).
- **Image Carousel** (`resources/fieldsets/image_carousel.yaml`): **keine** Galerie, sondern eine Bildwechsel-Animation. `resources/js/modules/carousel.js` blendet die hinterlegten Bilder per `setInterval` nacheinander ein und aus, sobald alle geladen sind. Die Dauer kommt aus dem Feld `intervall_duration` (Vorgabe 150 ms, im Content zum Beispiel 800 ms). Es gibt keine Bedienelemente und keine Benutzersteuerung.

Aktuelle Verbreitung, über beide Sprachfassungen gezählt: in den Projekten 254 `image_text`, 137 `fullscreen_image`, 96 `image`, 22 `image_comparison` und 18 `image_slideshow`; in den Blogbeiträgen 252 Bild-Sets und 40 Slideshow-Sets; bei den Teamprofilen 28 deutsche Einträge, alle mit `image_carousel`, davon 21 zusätzlich mit Portrait.

**Antwort auf die Frage:** «Immer das Karussell» ist keine Vereinfachung, weil die drei Mechanismen nicht dasselbe leisten.

- Das Image Carousel mit nur einem Bild ergibt zwar ein stehendes Bild, lässt aber einen wirkungslosen `setInterval` laufen und verzichtet auf die responsiven Bildquellen, auf `loading="lazy"` und auf die Scroll-Animation des Einzelbild-Bausteins. Es ist als Animation gedacht, nicht als Behälter für beliebig viele Bilder.
- Eine Slideshow mit nur einem Bild sieht sichtbar anders aus als ein Einzelbild: schmaler wegen des seitlichen Abstands, auf 700 px Höhe begrenzt, mit ausgegebenen Navigationspfeilen ohne Funktion und ohne verzögertes Laden. Ein Zusammenlegen verändert also das Erscheinungsbild von 96 Projekt- und 252 Blogbildern. Das ist eine gestalterische Entscheidung, keine reine Aufräumarbeit.

**Zwei konkrete Mängel, die bei dieser Gelegenheit zu beheben sind:**

- [x] **Lokal behoben am 17. September 2026.** Im Baustein `image_text` schlossen sich Einzelbild und Karussell technisch nicht aus: `resources/views/partials/content/project/elements/image_text.antlers.html` prüfte `{{ if image }}` und `{{ if image_carousel }}` unabhängig voneinander.
  - **Der Befund war ungenauer als hier ursprünglich beschrieben.** Eine erneute Auswertung aller Projektinhalte über beide Sprachfassungen ergab vier betroffene Sets, nicht sechs, und nur in zwei Projekten: «Umfahrung Uznach» (je einmal Deutsch und Englisch) und «Grosshofbrücken in Kriens» (zweimal Englisch). «Hochwasserrückhalteraum Hegmatten» ist nicht betroffen. Gezählt wurden 252 aktive `image_text`-Sets, davon 181 nur mit Einzelbild, 66 nur mit Karussell.
  - In allen vier Fällen enthielt das Karussell **ausschliesslich** Rahmen ohne Bild. Es erschien also kein doppeltes Bild, sondern unter dem Einzelbild eine zusätzliche graue Figur mit einem kaputten Bild. Im gerenderten HTML war das `src="/"` — kein leerer Wert, sondern die Startseite selbst, die der Browser als Bild zu laden versuchte.
  - Gelöst über zwei Stellen: `resources/views/partials/ui/media/image/image_carousel.antlers.html` filtert Rahmen ohne Bild vor der Schleife heraus (`{{ frames = image_carousel | where('image', '!=', '') }}`) und gibt die Figur gar nicht erst aus, wenn nichts übrig bleibt. Das Filtern **vor** der Schleife ist wesentlich, weil `resources/js/modules/carousel.js` die Animation immer bei Bild 0 startet und die Markierung `first` daher den ersten tatsächlich ausgegebenen Rahmen meinen muss.
  - In `image_text.antlers.html` entscheidet jetzt `{{ if frame_count > 0 }} … {{ elseif image }} … {{ /if }}`. Das Karussell hat Vorrang — wie im Vorbild `resources/views/team/show.antlers.html` —, gilt aber nur als gefüllt, wenn es mindestens einen belegten Rahmen hat. Dadurch erscheint in den vier betroffenen Sets korrekt das Einzelbild.
  - Geprüft über alle 49 erreichbaren deutschen Projektseiten: keine einzige leere Bildadresse mehr (vorher eine), Gesamtzahl der `<img>`-Elemente 705 auf 704.
- [x] **Lokal behoben am 17. September 2026.** Im selben Baustein steuerte der Vergleich `image:width > image:height` die Spaltenaufteilung. War nur das Karussell gefüllt — in 66 der 252 aktiven `image_text`-Sets —, blieb der Vergleich leer und der Block landete immer im Hochformat-Zweig (`md:col-span-7 xl:col-span-6`), auch bei querformatigen Karussellbildern.
  - Die Formatentscheidung steht jetzt einmal pro Set als `is_landscape` oben im Template und stammt vom tatsächlich ausgegebenen Bild: beim Karussell vom ersten belegten Rahmen, sonst vom Einzelbild. Damit entfällt zugleich die vierfache Wiederholung desselben Vergleichs im Template.
  - **Diese Korrektur verändert das Layout sichtbar, und zwar breiter als zunächst angenommen.** Von den 66 reinen Karussell-Sets wechseln **48** vom Hochformat- in den Querformat-Zweig, verteilt über beide Sprachfassungen: 24 deutsche und 24 englische Sets in je rund 16 Projekten. Die übrigen 18 Sets führen hoch- oder quadratformatige Bilder und bleiben unverändert.
  - Gemessen an den gerenderten Seiten: über die 49 erreichbaren deutschen Projektseiten wechseln 20 Blöcke (Hochformat 56 auf 36, Querformat 60 auf 80). Die Differenz zu den 24 deutschen Sets erklärt sich durch «Stöcklin Küchen», das unveröffentlicht ist und allein vier betroffene Sets enthält.
  - Betroffen sind unter anderem «Ensemble Hardturm» (zwei Sets: «Koordination komplexer Beiträge» mit 4500×2432 und «Kontinuität über Projektphasen» mit 4954×3344), «Uraniastrasse Zürich» (drei Sets), «Stöcklin Küchen» (vier Sets), «Denzler Haus» und «Steinacker Kloten» (je zwei Sets) sowie je ein Set in «AS Grenchen Bypass», «Appenzeller Huus», «Dorfplatz Rorbas», «Historisches Museum Bern», «Hochparterre Themenheft», «Hegmatten Winterthur», «Le Chevreuil», «Lebendige Limmat», «MACH Koch-Areal», «Neue Festhalle Bern» und «Umfahrung Uznach».
  - Zwei Fälle verdienen beim Sichten besondere Aufmerksamkeit, weil das Bild in der breiteren Spalte stärker hochskaliert wird: «Hegmatten Winterthur» führt als erstes Karussellbild eine Datei mit nur 719×458 Pixeln, «MACH Koch-Areal» eine mit 1223×1137 Pixeln. Letztere ist zudem fast quadratisch und fällt nur knapp in den Querformat-Zweig — das entspricht dem Verhalten, das Einzelbilder mit demselben Seitenverhältnis schon immer hatten.
  - Quadratische Bilder gelten unverändert als Hochformat, weil der Vergleich weiterhin streng `>` ist.

**Höhensprünge innerhalb eines Karussells (Frage vom 17. September 2026):**

Weil `carousel.js` die Rahmen über die Klasse `hidden` ein- und ausblendet und die
Bilder mit `w-full h-auto` in der normalen Dokumentflusshöhe stehen, richtet sich
die Höhe der Figur immer nach dem gerade sichtbaren Bild. Haben die Rahmen eines
Karussells unterschiedliche Seitenverhältnisse, springt die Höhe bei jedem
Bildwechsel. Das ist unabhängig von der oben behobenen Formatentscheidung, die nur
die Spaltenbreite bestimmt.

Auswertung aller 94 Karussells mit mindestens einem Bild (Projekte und Teamprofile,
beide Sprachen):

| Seitenverhältnisse im selben Karussell | Anzahl |
| --- | --- |
| nur ein Bild, kein Wechsel | 34 |
| identisch (Abweichung unter 0,5 %) | 54 |
| fast gleich (unter 5 %) | 4 |
| merklich (5 bis 20 %) | 2 |
| stark (über 20 %) | 0 |

Praktisch betrifft das heute also **ein einziges Set**, «Vom Produkt zur Marke» im
Projekt «Stöcklin Küchen», dort in beiden Sprachfassungen: acht Bilder mit
Seitenverhältnissen zwischen 1,40 und 1,50, was rund 7 % Höhenunterschied ergibt.
Alle übrigen Karussells liegen unter 1,5 %.

**Behoben am 17. September 2026.** Christoph hat entschieden, dass auch die
kleinen Sprünge stören, und die technische Absicherung freigegeben.

- [x] `resources/views/partials/ui/media/image/image_carousel.antlers.html` gibt der
  Figur jetzt ein festes Seitenverhältnis aus dem ersten belegten Rahmen und legt die
  Bilder mit `absolute inset-0 w-full h-full object-cover` darin übereinander. Die Höhe
  steht damit von Anfang an fest und ändert sich beim Bildwechsel nicht mehr.
  - Das Seitenverhältnis steht als `style="aspect-ratio: B / H"`, weil es aus dem Inhalt
    stammt und deshalb keine Tailwind-Klasse sein kann. Genau dadurch war die Änderung
    **ohne Frontend-Build** möglich: Die vier neu verwendeten Klassen `absolute`,
    `inset-0`, `h-full` und `object-cover` sind im kompilierten CSS bereits enthalten,
    weil andere Templates sie verwenden. Nachgeprüft gegen `app-b78a33d3.css`.
  - Gewählt wurde `object-cover`, nicht `object-contain`: Bei den gemessenen Abweichungen
    von höchstens 7 % wird ein abweichendes Bild um wenige Prozent beschnitten, was bei
    Visualisierungen unauffälliger ist als schmale graue Ränder. **Nebenwirkung, die zu
    beachten ist:** Enthielte ein Karussell künftig Bilder mit stark unterschiedlichem
    Format — etwa Hoch- und Querformat gemischt —, würde kräftig beschnitten. Die
    redaktionelle Regel «ein Seitenverhältnis pro Karussell» bleibt deshalb bestehen.
  - Fehlen die Bildmasse in den Asset-Metadaten, greift der bisherige Fluss mit
    `w-full h-auto`: Dann springt die Höhe wie zuvor, aber es verschwindet nichts.
    Aktuell haben alle 302 Karussellrahmen mit Bild vollständige Masse.
  - Die Figur erhielt zusätzlich `w-full`. Das ist für die Teamprofile nötig, wo das
    Karussell in einem Flex-Container sitzt: Ohne im Fluss stehendes Bild hätte die Figur
    dort keine Breite mehr. Alle 28 Karussellbilder der Teamprofile sind 1984 bis 2533 px
    breit und damit ohnehin breiter als die Spalte, weshalb sich optisch nichts ändert.
  - Der Parameter `class="w-full h-auto"` wurde an den beiden Aufrufstellen in
    `image_text.antlers.html` entfernt, weil er mit `h-full` kollidiert wäre. Er war
    ohnehin wirkungslos doppelt, da das Partial dieselben Klassen fest gesetzt hatte.
  - Geprüft: 82 Seiten mit HTTP 200 über Projekte, Teamprofile, Blog und Seiten in beiden
    Sprachen; alle 48 gerenderten Karussell-Figuren tragen ein festes Seitenverhältnis,
    keine leeren Bildadressen.

**Latente Stelle auf den Teamprofilen (Hinweis zur Änderung vom 17. September 2026):**

`resources/views/team/show.antlers.html` wählt mit `{{ if image_carousel }} … {{ else }}
… {{ /if }}` zwischen Karussell und Portrait. Seit das Karussell-Partial Rahmen ohne
Bild überspringt, gilt: Enthält ein Profil ein Karussell, dessen Rahmen alle leer sind,
ist die Bedingung weiterhin wahr, das Partial gibt aber nichts aus — und der
Portrait-Rückfall greift nicht. Die Spalte bliebe leer. Vor der Änderung erschien an
dieser Stelle ein kaputtes Bild; beides ist unerwünscht.

- [x] **Behoben am 17. September 2026.** `resources/views/team/show.antlers.html` prüft
  jetzt `{{ if image_carousel | where('image', '!=', '') | length }}` statt `{{ if image_carousel }}`
  und wendet damit dieselbe Regel an wie das Partial. Enthält ein Profil ein Karussell
  ohne belegten Rahmen, greift wieder der Portrait-Rückfall.
  - Gegengeprüft mit einem Testinhalt: Wurde die Bildangabe im Karussell eines Profils
    entfernt, erschien das Portrait und keine leere Bildadresse. Der Testinhalt wurde
    anschliessend zurückgesetzt.
  - Betroffen war ohnehin kein Eintrag: Von 56 Teameinträgen hat keiner ein Karussell
    ohne belegten Rahmen. Die sieben Einträge ohne Portrait sind unveröffentlicht und
    führen je ein Karussellbild.

**Empfehlung für eine Vereinheitlichung, falls sie gewünscht wird:**

- [x] **Lokal umgesetzt am 17. September 2026.** Die Felder im Control Panel heissen jetzt «Image Animation» statt «Image Carousel» und «Slideshow (browsable)» statt «Image Slideshow» beziehungsweise «Slideshow». Geändert in `resources/fieldsets/image_carousel.yaml`, `resources/fieldsets/image_slideshow.yaml` sowie in den Set-Beschriftungen von `resources/blueprints/collections/projects/project.yaml` und `resources/blueprints/collections/posts/post.yaml`.
  - Zusätzlich erklärt je ein Hilfetext den Unterschied: «Fades the images in and out automatically, one after another. This is an animation, not a gallery: visitors have no controls.» gegenüber «Browsable gallery with previous and next arrows.»
  - Dieses Briefing hatte deutsche Bezeichnungen vorgeschlagen («Bildwechsel-Animation», «Slideshow (blätterbar)»). Christoph hat sich dagegen entschieden: Da alle übrigen Feldbeschriftungen des Control Panels englisch sind («Image», «Duration», «Sequence»), bleiben auch diese englisch. Die Absicht der Umbenennung bleibt davon unberührt.
  - Betroffen sind ausschliesslich Anzeigetexte des Control Panels. Weder die Feld-Handles noch die Inhalte oder die Ausgabe ändern sich.
- [ ] Erst danach entscheiden, ob «Bild» und «Slideshow» in Projekten und Blogbeiträgen zu einem Baustein mit einem bis mehreren Bildern verschmelzen. Voraussetzung ist, dass die Slideshow-Ausgabe zuvor an das Einzelbild angeglichen wird: volle Breite, `loading="lazy"`, Scroll-Animation und ausgeblendete Navigation bei nur einem Bild. Ohne diese Angleichung entsteht keine Vereinfachung, sondern eine sichtbare Layoutänderung auf allen bestehenden Seiten.
- [ ] Das Image Carousel bleibt davon unberührt und wird nicht mit der Slideshow zusammengelegt. Es bleibt der Baustein für die Bildwechsel-Animation auf Teamprofilen und in `image_text`.
- [ ] Umfang und Priorität mit Christoph abstimmen. Bisher ist dies eine Frage, kein freigegebener Auftrag.

### Frontend-Abhängigkeiten: ungenutzte npm-Pakete

Befund vom 17. September 2026, zur Beurteilung durch die Entwicklung. Bewusst nicht umgesetzt: Änderungen an `package.json` und am Build liegen in der Zuständigkeit der Entwicklung.

Aus den gebauten Einstiegspunkten `resources/css/app.css`, `resources/js/app.js`, `resources/js/map.js` und `resources/js/gdpr.js` werden aus `node_modules` nur `alpinejs` und `swiper` geladen. Die folgenden Pakete sind in `package.json` deklariert, aber nirgends importiert oder registriert:

- `@tailwindcss/forms` – installiert, in `tailwind.config.js` jedoch nicht unter `plugins` eingetragen; dort steht nur `@tailwindcss/typography`. Das Paket ist damit wirkungslos.
- `axios`, `vue-axios` und `nprogress` – kein Vorkommen in `resources/`.
- `fullpage.js` – kein Vorkommen in `resources/`. Scheinbare Treffer betreffen durchwegs das CMS-Feld `is_fullpage`, nicht die Bibliothek. Das Paket ist GPL-3.0 lizenziert; da es nicht eingebunden wird, gelangt nichts davon in `public/build`.

Gesondert zu beurteilen ist `@vitejs/plugin-vue`. Es gehört zum stillgelegten Control-Panel-Gerüst: `resources/js/cp.js`, `resources/css/cp.css`, `resources/js/components/fieldtypes/ExampleFieldtype.vue` sowie die auskommentierten Zeilen in `vite.config.js`. Alles davon ist konsistent auskommentiert, auch der Vue-Import innerhalb von `cp.js`. Das Plugin wird wieder benötigt, sobald ein eigener Fieldtype für das Control Panel entsteht. Nur das Paket zu entfernen und das Gerüst stehen zu lassen wäre die ungünstigste Variante: Wer später die beiden Zeilen in `vite.config.js` aktiviert, erhält einen schwer deutbaren Build-Fehler.

- [ ] Entscheiden, ob die fünf ungenutzten Pakete entfernt werden. Anschliessend `package-lock.json` erneuern; alle Build-Umgebungen müssen einmal `npm install` ausführen.
- [ ] Zur Absicherung nach dem Entfernen `npm run build` ausführen und `public/build` mit dem Stand in Git vergleichen. Bleibt das Ergebnis unverändert, hing nichts an diesen Paketen.
- [ ] Über `@vitejs/plugin-vue` gemeinsam mit dem Control-Panel-Gerüst entscheiden: entweder beides behalten oder beides entfernen.

## Ergänzungen aus «Website-Feedback Hannes – Umsetzung» vom 7. September 2026

Quelle: [Website-Feedback Hannes – Umsetzung](https://app.notion.com/p/3cf0be17ef8381149247f0699c0e33f0).

Die redaktionellen Änderungen sind lokal in Deutsch und Englisch eingepflegt. Die folgenden Aufgaben bleiben technisch offen. Bestehende Änderungen und offene Punkte weiter oben gelten weiterhin. Die Logo-Erweiterung wurde oben ergänzt, statt sie nochmals als eigene Aufgabe anzulegen.

Hinweis zur Content-Übergabe: Zur Übergabe gehört auch die korrigierte Metadatendatei von Christoph Deiters’ Übersichtsfoto.

Überholt: Die ursprünglich hier vermerkte Anweisung, nach dem Upload den Asset-Metadaten-Cache zu erneuern (`php artisan statamic:assets:clear-cache`), ist für den Alternativtext nicht mehr nötig. Die Alternativtexte der Teambilder stammen inzwischen aus dem Eintragstitel, also dem Namen der Person, und nicht mehr aus den Asset-Metadaten. Betroffen sind `resources/views/partials/content/team/media/portrait.antlers.html` und das Bildkarussell auf den Teamprofilen. Die gepflegten Alt-Texte in den Asset-Metadaten erscheinen damit nicht mehr auf den Teamseiten.

### CTA-System, Header und Footer

- [ ] Hauptaktion im Header als visuell abgesetzten Button «Sprechstunde» / «Consultation» ausgeben und den bisherigen Header-Menüpunkt «Kontakt» entsprechend ersetzen.
  - Reguläre Kontaktlinks im Footer und in der Navigation können bestehen bleiben. Das Ziel ist eine deutlich erkennbare Hauptaktion.
  - Betroffen: `resources/views/partials/layout/header.antlers.html`, Hauptnavigation und die verwendeten Button-Partials.
- [x] **Lokal umgesetzt am 17. September 2026.** Die Haupt-CTAs in Menü und Footer lauten jetzt einheitlich «Sprechstunde vereinbaren» / «Book a consultation».
  - Geändert: `resources/views/partials/menu/wrapper.antlers.html` (vorher «Offerte anfragen») und `resources/views/partials/layout/footer.antlers.html` (vorher «Kontakt aufnehmen»). Beide übergeben den Text nur als Parameter an dasselbe Button-Partial; am Erscheinungsbild ändert sich nichts.
  - In `lang/en.json` ist der Schlüssel «Sprechstunde vereinbaren» mit «Book a consultation» ergänzt. Die bisherigen Schlüssel «Offerte anfragen» und «Kontakt aufnehmen» bleiben erhalten, weil «Offerte anfragen» laut diesem Briefing für einen künftigen projektspezifischen Anfrageweg vorgesehen ist.
  - Das Linkziel ist unverändert die Kontaktseite. Ein Buchungslink existiert weiterhin nicht.
  - Noch offen bleibt der Header-Punkt darüber: Ein visuell abgesetzter Button braucht neues Styling und damit einen Frontend-Build.
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

- [x] **Lokal umgesetzt am 17. September 2026.** Die Datumsangaben in den Blog-Teasern sind entfernt; Bild und Titel bleiben.
  - Geändert: `resources/views/partials/fieldsets/teaser/post/item.antlers.html`, verwendet für Desktop und mobilen Slider.
  - Der Baustein heisst im Baukasten `teaser_blog` und ist auf der Startseite, «Über uns», «Kompetenzen», den drei Segmentseiten und «Vielen Dank» gepflegt, je deutsch und englisch. Auf der Startseite gingen die sichtbaren Datumsangaben dadurch von sieben auf null zurück.
  - Nicht betroffen ist die Blogübersicht `/blog`: Deren Artikelliste läuft über ein anderes Template und zeigt die Daten weiterhin an. Falls sie auch dort verschwinden sollen, ist das ein eigener Entscheid.
  - Veröffentlichungsdaten, chronologische Sortierung und Artikel-URLs erhalten. Es geht um die sichtbaren Teaser, nicht um das Löschen von Datumswerten im CMS.
  - Der Beitragstitel «Erfahre das Geheimnis hinter unseren Visualisierungen» war deutsch bereits korrekt; Englisch wurde im Content auf «Discover the secret behind our visualizations» angeglichen. Dafür ist keine Template-Änderung erforderlich.

### Nightnurse-Netzwerk

- [ ] Einen optionalen, lokalisierbaren Einleitungstext im Netzwerk-Baustein ergänzen und vor den Partnern ausgeben.
  - Feldset: `resources/fieldsets/network.yaml`; Ausgabe: `resources/views/partials/fieldsets/network/wrapper.antlers.html`.
  - Angepasster deutscher Entwurf: «Unser Netzwerk verbindet unterschiedliche Perspektiven auf Raum, Gestaltung und Kommunikation. Je nach Aufgabe kommen zusätzliche Kompetenzen dazu. So lässt sich dein Projekt über die Visualisierung hinaus weiterdenken.»
  - Englisch: «Our network brings together different perspectives on space, design and communication. Depending on the task, we bring in additional expertise to help develop your project beyond visualization.»
  - Den ursprünglichen Entwurf mit «Lichtplanung, Bewegtbild und Szenografie» nicht unverändert übernehmen: Er beschreibt nicht alle verlinkten Organisationen. Die konkrete Zusammenarbeit und das Versprechen eines einzigen Ansprechpartners müssen intern bestätigt werden.
  - Quellenprüfung: [Christian Ammann – Fotografie und Film](https://photographer.ch/about), [Lightsphere – Lichtplanung](https://lightsphere.ch/en/portfolio/services/), [Team Ensemble – gesellschaftliche Zusammenarbeit](https://team-ensemble.ch/), [SHIFT – Stadt- und Siedlungsentwicklung](https://shift.immo/). SHIFT wurde anhand des Logos und der Anschrift eindeutig zugeordnet.
  - Die fehlerhaften Netzwerk-Links sind im deutschen und englischen Content korrigiert: Christian Ammann auf `https://photographer.ch/`, SHIFT auf `https://shift.immo/`. Noch nicht veröffentlicht; die Live-Seite verlinkt am 7. September 2026 weiterhin `https://www.christian-amman.ch` und `https://shift.ch`. Originale Bilddateinamen bleiben erhalten.

### Entscheidungen und spätere technische Aufgaben

Diese Punkte sind weiterhin offen und sollen nicht als freigegebene Umsetzung behandelt werden:

- [ ] Instagram-Feed statt Blog: redaktionelle Entscheidung einholen; erst danach Integration, Ladeverhalten und Datenschutz prüfen.
- [ ] «Imagine tomorrow»: Entscheidung über Beibehaltung oder kleinere Platzierung beim Logo. Der Claim bleibt vorerst im vorhandenen Einleitungsblock.
- [ ] Animiertes Logo-Element und Burger-Menü-Effekt: als späteren Schritt planen.
- [ ] Farbe im Corporate Design: separates Gestaltungsthema, noch kein Auftrag zur Anpassung der bestehenden Farben.

Video-Neuschnitt (Denzler Haus und Brücke), Teamfotos, Mitarbeiterinterviews und ein Hero-Film mit Menschen sind Produktionsaufgaben. Die Entscheidung über Stellenanzeigen und eine spätere KI-Seite bleibt redaktionell. Diese Punkte sind in der ursprünglichen Notion-Liste weiterhin offen.
