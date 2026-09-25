# Entwickler-Briefing: offene Punkte und Entscheidungen

Stand: 25. September 2026

Dieses Dokument listet, was noch zu entscheiden und zu tun ist. Bereits Umgesetztes
steht nur dann hier, wenn es Folgen für die weitere Arbeit hat — alles Übrige ist in
der Git-Historie nachvollziehbar, wo jede Änderung mit Begründung in einem eigenen
Commit liegt.

Der Code wird über Git ausgeliefert. Einzelne Änderungen gelangen daneben weiterhin
per FTP-Paket direkt auf Produktion; was das für den nächsten `git pull` bedeutet,
steht unter «Kein Frontend-Build nötig». Redaktionelle Inhalte unter `content/` sind **nicht** versioniert und gelangen auf
einem anderen Weg auf Staging und Produktion.

## Was bereits umgesetzt ist und Folgen hat

### SEO-01: Team-H1 und Cache-Nachprüfung

Die Teamübersicht hat lokal eine sichtbare H1 oberhalb der Filter und Karten, im Stil
der Portfolioüberschrift. `team_title` im Seiten-Blueprint ist formatierbar und
lokalisierbar; ohne eigenen Inhalt wird der Seitentitel ausgegeben. Alle verwendeten
CSS-Klassen sind im vorhandenen Build enthalten, deshalb kein neuer Frontend-Build
nötig.

Portfolio und Kontakt haben live bereits in DE und EN genau eine H1. Am 24. September
lieferten normale URLs teils einen älteren HTML- und Asset-Stand als dieselben URLs
mit Diagnoseparameter, etwa `/en/portfolio` ohne H1 und mit deutschen
Kontaktbeschriftungen. Nach Christophs Cache-Löschung liefern die zehn geprüften
Seiten mit und ohne Diagnoseparameter den gleichen Stand. Welche Cache-Schicht
betroffen war, ist nicht bestätigt. Bis das geklärt ist, gehört das Cache-Leeren zu
jedem Deployment, denn weder ein `git pull` noch ein FTP-Upload löst in Statamic eine
Invalidierung aus.

Die lokale Staging-robots.txt wurde gelöscht; die Live-Datei erlaubt Crawling und
enthält seit dem 25. September beide Sitemap-Verweise. Die Ergänzung wurde direkt
veröffentlicht und per HTTP geprüft. Christoph übernimmt die übrige Veröffentlichung
gesammelt nach Abschluss der Anpassungen und leert dabei den Online-Cache.

Auch Datenschutz, Impressum und die Kontakt-Bestätigungsseite wurden am 25. September
auf Christophs Auftrag lokal und live in beiden Sprachen geprüft: Die sichtbaren
Seitentitel sind bereits jeweils genau eine echte H1. Der frühere offene H1-Punkt
war veraltet; zusätzliche Template-, Inhalts- oder CSS-Änderungen sind dort nicht
nötig. Die Bestätigungsseiten liegen unter `/kontakt/vielen-dank` und
`/en/contact/thank-you` und behalten ihr `noindex, follow`.

### Sprungmarke `#jobs` auf der Über-uns-Seite

`partials/layout/section.antlers.html` nimmt einen optionalen Parameter `section_id`
entgegen, und der Jobs-Block setzt damit `id="jobs"`. `/ueber-uns#jobs` und
`/en/about-us#jobs` sind so verlässliche Ziele für eine künftige Weiterleitung von
`/jobs`, das heute 404 liefert, obwohl Jobmaps es als Karriereseite verlinkt, und für
den JOBS-Link auf Linktree. Eine Weiterleitung ist noch nicht eingerichtet. Das im
Inhalt gespeicherte `anchor: jobs` hätte das nicht geleistet, siehe «Aufräumen».

### Karussell: feste Höhe, ein Seitenverhältnis pro Karussell

Die Figur trägt jetzt ein festes Seitenverhältnis aus dem ersten belegten Rahmen,
die Bilder liegen mit `object-cover` darin übereinander. Vorher richtete sich die
Höhe nach dem gerade sichtbaren Bild und sprang bei jedem Wechsel.

### Kein Frontend-Build nötig

Keine Änderung vom 17. September führt eine **neue CSS-Klasse** ein. `public/build`
ist deshalb in keinem dieser Commits enthalten und muss nicht neu erzeugt werden.
Geprüft wurde das, indem die Klassen-Tokens jeder geänderten Datei gegen den Stand in
Git und gegen das kompilierte CSS verglichen wurden.

Die anfangs ebenfalls eingehaltene Bedingung «kein neues Feld» gilt dagegen nicht
mehr uneingeschränkt. Zwei Felder sind nach Rücksprache mit Christoph dazugekommen,
beide unten beschrieben. Auf den Build wirkt sich das nicht aus, wohl aber auf die
Inhalte: die Felder sind auf Produktion noch leer und müssen dort gefüllt werden.

Der aktuelle Build in Git verweist auf `public/build/assets/app-a3e676e8.css` und
`app-1adc73f0.js`. `manifest.json` und der Ordner `public/build/assets` müssen
gemeinsam deployt werden; alte Hash-Dateien können auf dem Server bleiben.

Auf Produktion läuft seit dem FTP-Paket vom 23. September stattdessen
`app-fecf76e5.js`. Der Quellcode ist derselbe: Das lokale `node_modules` war mit pnpm
installiert, das `package-lock.json` nicht beachtet, und hat Alpine.js 3.16.3 statt
3.14.9 gebündelt. `app-1adc73f0.js` wurde laut Paket auf dem Server gelöscht. Ein Build
nach `npm ci` ergibt wieder genau den Stand in Git; mit dem nächsten gesammelten
Deployment kommen `manifest.json` und `app-1adc73f0.js` wieder hinauf.

**Vor dem nächsten `git pull` auf Produktion `git status` prüfen.** Die FTP-Pakete vom
21. und 23. September haben rund 30 versionierte Dateien direkt eingespielt:
Templates, Blueprints, Fieldsets, `lang/en.json` und den Build. Im Arbeitsverzeichnis
des Servers erscheinen sie als lokale Änderungen, an denen ein Pull abbricht, sobald
er dieselben Dateien ändert. Vor dem Verwerfen mit dem Stand in Git abgleichen.

Der Build vom 21. September enthält keine neue Regel, sondern zwei weniger:
`.truncate` und `.lg\:gap-y-30` werden nirgends mehr verwendet. Die Übersicht wäre
also auch mit dem alten Bundle richtig dargestellt worden.

Die Umstellung der Bildunterschrift vom 22. September führt ebenfalls keine neue Klasse
ein: `npm run build` liefert danach dieselben Hashes, `public/build` bleibt unverändert.

Auch der neue Baustein «Portfolio (Grid)» kommt ohne neue Klasse aus — er benutzt
durchweg die des Rasters und der bestehenden UI-Partials.

### Logo-Marquee: Titel, zwei Reihen, Abstand nach unten

Der Baustein hat ein neues, lokalisierbares Titelfeld. Es ist als `import: title` in
`resources/fieldsets/marquee.yaml` eingebunden, also dasselbe Bard-Feld, das der
Netzwerk-Baustein schon nutzt; die Auszeichnung im Template ist von dort gespiegelt.

Die Logos laufen jetzt in zwei Reihen. Sie verteilen sich abwechselnd nach ihrer
Position, damit beide Reihen unabhängig von der Gesamtzahl gleichmässig gefüllt
bleiben. Die untere Reihe läuft rückwärts und braucht für dieselbe Strecke länger.
Die Dauer wird weiterhin aus der Anzahl Logos berechnet, jetzt pro Reihe.

Die Gegenrichtung steht als Inline-Style am Track und nicht als Klasse. Das war
allein der Bedingung geschuldet, keinen Frontend-Build auszulösen — siehe die
Aufräum-Aufgabe weiter unten.

Der Abschnitt trägt ausserdem `py-90 lg:py-150` statt `pt-90 lg:pt-150`. Vorher hatte
er überhaupt kein Bottom-Padding und stiess unten direkt an den vollflächigen
Video-Baustein.

### Segment-Kacheln: Unterzeile, Pfeil, Spacing

`resources/fieldsets/teaser_competencies.yaml` hat ein lokalisierbares Feld
`subtitle`. Ausgegeben wird es nur in der kompakten Variante ohne Bild, also auf den
beiden Startseiten; die Bildvariante auf Kompetenzen, Angebot, Expertise und Services
bleibt unverändert. In derselben Variante steht der Pfeil jetzt vor dem Titel und
«Mehr erfahren» ist entfallen — verlinkt war und ist die ganze Kachel.

Die kompakte Variante bringt kein Top-Padding mehr mit. Vor dem Baustein steht auf
allen sechs Seiten ein `statement`, dessen Bottom-Padding sich vorher mit dem eigenen
auf rund die doppelte Höhe addierte, während unten nichts blieb. Der Fullpage-Zweig
ist davon nicht betroffen, dort füllt der Abschnitt ohnehin den Viewport.

Allgemeiner betrifft das drei Bausteine, die aus der Konvention `py-90 lg:py-150`
ausscheren und nur ein `pt-` setzen: Marquee und Segment-Kacheln sind bereinigt,
`teaser_blog` (`pt-90 md:pt-150`) steht noch aus. Dort greift es nur auf den
Nicht-Fullpage-Seiten.

### Portfolio-Übersicht: Bildunterschrift in drei Zeilen

Die Unterschrift steht in der Reihenfolge Auftraggeber, Projekttitel, Teaserzeile.
`client` sitzt als kleine Zeile über dem Titel (`text-xs xl:text-sm`), der Titel bleibt
halbfett in `text-md xl:text-lg`, und die Teaserzeile darunter übernimmt den Schriftgrad,
den vorher der Auftraggeber hatte. Der Auftraggeber steht mit `mt-8 xl:mt-10` etwas
abgesetzt darüber, Titel und Teaserzeile rücken mit `mt-4` zu einem Block zusammen.

Der Pfeil steht rechts und immer auf der **letzten** Zeile, auch wenn der Teaser
umbricht — auf den schmalen Spalten der Paare tut er das regelmässig. Dafür sitzt er in
einem Wrapper, der die Schriftgrösse und Zeilenhöhe der Teaserzeile trägt und damit
genau eine Zeile hoch ist; `items-end` legt diese Zeile auf die letzte Textzeile, und
das Icon steht als `inline-block` auf deren Grundlinie, also optisch auf Mittelhöhe.
Ein Versatz über `mb-*` wäre einfacher gewesen, bräuchte aber eine Klasse, die nicht im
kompilierten CSS steht.

Solange `teaser` leer ist, gibt das Template einen Platzhaltersatz aus. Der ist
ausdrücklich nicht veröffentlichbar — siehe «Zuerst mit Christoph zu klären».

### Neuer Baustein «Portfolio (Grid)»

Ein zweiter Portfolio-Baustein für den Seitenbaukasten, `teaser_projects_grid`,
zeigt eine handverlesene Auswahl von Projekten im selben gestaffelten Raster wie die
Portfolio-Übersicht. Raster, Slot-Muster und Kachel sind unverändert übernommen:
`content/project/elements/teaser-slot` setzt die Projekte, `components/portfolio-grid.css`
macht Reihen, Versatz und Anschnitte, beide über `[data-portfolio-grid]`. Im Baustein
selbst steht keine einzige dieser Zahlen noch einmal.

Der Titel steht an der Stelle des ersten Slots — gleiche Reihe wie Slot #2, aber bündig
am linken Rand. Die Projekte beginnen den Zyklus deshalb bei #2, was `count` (1-basiert)
direkt liefert: Projekt 1 landet auf `pos 1`, Projekt 7 auf `pos 7`. Sieben Projekte
füllen den ersten Zyklus genau; das achte beginnt auf Reihe 7 einen zweiten, und zwar
in dem Slot, in dem oben der Titel stand. Die Anzahl ist deshalb nicht begrenzt.
Vollständig aufgehen 7 und 15 — eine Auswahl, die mitten im Zyklus endet, lässt ihren
letzten Slot ohne die Kachel, neben der er im Entwurf steht. Mit 15 Projekten geprüft.

Der CTA steht **ausserhalb** des Rasters unter dem Baustein. Die letzten beiden Slots
tragen einen negativen oberen und einen unteren Aussenabstand; eine eigene Rasterreihe
darunter müsste beide verrechnen.

Der alte Baustein `teaser_project` («Portfolio (Masonry)») bleibt unverändert und in
Betrieb. Der neue muss im Control Panel auf der Seite gesetzt werden — die Inhalte
liegen in `content/` und werden hier nicht angefasst. Der alte wird entfernt, sobald
der neue live ist; die Liste dazu steht unter «Aufräumen».

### Portfolio-Übersicht: eigener Titel (H1)

Die Seite hatte keine eigene Überschrift. Sie trägt jetzt eine H1 **über** dem Raster,
linksbündig mit dem ersten Projekt; Filter und Slot-Muster bleiben unangetastet. Der
Titel steht bewusst ausserhalb von `[data-portfolio-grid]`: Die Slots tragen ab xl feste
Reihen (`--row-xl`), Reihe 1 gehört dem ersten Projekt, und davor gibt es keine Reihe.
Im Raster — wie beim Baustein «Portfolio (Grid)», der den freien ersten Slot dafür
benutzt — würde jedes Projekt um einen Slot weiterrücken und die Auftaktkachel nach
rechts wandern. Das ist verworfen.

Der Text kommt aus dem neuen Feld `portfolio_title` im Seiten-Blueprint. Es ist das Feld
des gemeinsamen Fieldsets `title`, per Referenz eingebunden statt kopiert
(`field: title.title` mit `config:`), also derselbe formatierbare Bard wie in den
Bausteinen; überschrieben sind nur die Instruktionen und eine Bedingung, die das Feld
nur auf der Portfolio-Übersicht zeigt. Leer greift der Seitentitel — eine H1 gibt es
also in jedem Fall.

`/portfolio/kategorie/…` und `/portfolio/tag/…` sind Routen-Views ohne Eintrag
(`routes/web.php`), ein Feld erreicht sie nicht. Sie nehmen die Überschrift vom Begriff,
nach dem gefiltert wird — dort ohnehin die bessere H1. Weil das in der Term-Schleife
aufgelöst wird, gibt ein unbekannter Slug gar keine Überschrift aus, so wie er auch
keine Projekte ausgibt.

`ui/heading/h1` hat dafür die Grösse `none` bekommen, die `h2` schon hatte.

### CTA-Link: `title` statt Seitentitel

`partials/ui/cta.antlers.html` gab `ui/link/arrow` kein `title` mit. Das Partial fällt
dann auf das umgebende `title` zurück, also im Seitenbaukasten auf den Titel der Seite:
Der CTA auf der Startseite hiess im `title`-Attribut «Startseite». Jetzt steht dort der
Button-Text. Betrifft auch den bestehenden Masonry-Baustein.

## Zuerst mit Christoph zu klären

Diese Punkte sind noch keine freigegebenen Aufträge.

- [ ] **Bild und Slideshow zusammenlegen?** Die Frage kam aus der Redaktion. Sinnvoll
  wäre das nur, wenn die Slideshow-Ausgabe zuvor an das Einzelbild angeglichen wird:
  volle Breite, `loading="lazy"`, Scroll-Animation und ausgeblendete Navigation bei
  nur einem Bild. Ohne diese Angleichung entsteht keine Vereinfachung, sondern eine
  sichtbare Layoutänderung auf allen bestehenden Seiten. Die Bildwechsel-Animation
  bleibt davon unberührt und wird nicht mit der Slideshow zusammengelegt.
- [ ] **Der neue Baustein «Portfolio (Grid)» ist noch nirgends gesetzt.** Er steht im
  Seitenbaukasten unter «Special Elements» bereit, die Startseite zeigt aber weiterhin
  «Portfolio (Masonry)». Das Umstellen ist eine Redaktionsaufgabe im Control Panel:
  Baustein tauschen, Titel und Hauptlink übernehmen, die sieben Projekte auswählen,
  CTA-Text und -Link übernehmen. Zu beachten: `teaser_project` steht auf vier Seiten,
  nicht nur auf der deutschen Startseite — auch «Architektur», «Willkommen Deutschland»
  und die englische Startseite. Achtung ausserdem: die Kacheln zeigen dieselbe
  Teaserzeile wie die Übersicht, also bei ungepflegtem `teaser` den Platzhaltersatz aus
  dem nächsten Punkt. Dass der alte Baustein danach entfernt wird, ist beschlossen und
  unter «Aufräumen» aufgeschrieben.
- [ ] **Platzhaltertext in der Portfolio-Übersicht.** Die Bildunterschrift steht seit
  dem 22. September in der Reihenfolge Auftraggeber (klein), Projekttitel, Teaserzeile.
  Gepflegt ist `teaser` aber in einem von 43 deutschen Einträgen
  (`content/collections/projects/de/riva-arbon.md`) und in keinem der 39 englischen.
  Auf allen übrigen Kacheln steht deshalb **ein Platzhaltersatz aus dem Template** —
  «Ein Ort, der Massstab, Material und Atmosphäre zusammenbringt.», englisch über
  `lang/en.json`. Er zeigt das Layout und darf so nicht live gehen: entweder `teaser`
  redaktionell füllen oder die Zeile wieder ausschalten. Der eine gepflegte Eintrag
  zeigt ausserdem, dass `teaser` als lokalisierbares Feld auf die deutsche Fassung
  zurückfällt: `/en/portfolio` gibt für Riva Arbon den deutschen Satz aus. Die Vorgabe steht im Blueprint
  `resources/blueprints/collections/projects/project.yaml`: etwa 45–90 Zeichen, ohne
  Nightnurse-Leistung, ohne direkte Ansprache, ohne Handlungsaufforderung;
  verbindlicher Massstab ist
  [project-content-standard-de.md](project-content-standard-de.md). Beides steht in
  `partials/content/project/elements/teaser.antlers.html`.


## Fehler

- [ ] **Scroll-Animationen auf Projektdetailseiten mit `is_fullpage: false`.**
  Abschnitte bleiben dauerhaft leer, weil ihre Kinder über `[data-animation]` mit
  `opacity: 0` starten und erst sichtbar werden, wenn ein Vorfahre `.is-active`
  erhält. Diese Klasse setzt nur der IntersectionObserver
  (`resources/js/modules/observer.js`) und nur für Sections mit
  `data-section-observe`.
  - In `partials/layout/section.antlers.html` ist das bereits behoben: Das Attribut
    wird unabhängig von `is_fullpage` gesetzt, Vorbild war
    `partials/fieldsets/cta/wrapper.antlers.html`.
  - **Offen** steht die alte Bedingung noch an elf Stellen in
    `resources/views/project/show.antlers.html` und in
    `resources/views/project/_related.antlers.html`.
  - Vor der Änderung im Browser prüfen: Jede zusätzlich beobachtete Section startet
    auch Videos und blendet die Logo-Byline aus.
  - `is_fullpage: true` auf der Seite zu setzen ist **kein** Ersatz. Jedes
    Element-Template übergibt dann auch einen `fullpage`-Klassenparameter mit
    `min-h-screen`, wodurch jede Section auf Bildschirmhöhe aufgeblasen wird. Im Test
    wuchs `/angebot/animation-und-film` dadurch von rund 6858 auf 9599 Pixel.
  - Der Intro-Baustein (`partials/fieldsets/intro/wrapper.antlers.html`) ist zu Recht
    an `is_fullpage` gebunden, weil dort das Scroll-Snapping hängt.

- [ ] **Die Regel `content` in `.gitignore` greift zu breit.** Zeile 32 enthält das
  Muster ohne Pfadangabe, wodurch Git es auf jedes gleichnamige Verzeichnis anwendet.
  Für `content/` ist das gewollt und stimmig — keine einzige Datei daraus ist
  versioniert. Unbeabsichtigt trifft es aber auch `resources/views/partials/content/`
  mit seinen 26 Template-Partials. Die bestehenden Dateien bleiben erfasst, weil
  bereits versionierte Dateien von `.gitignore` nicht mehr berührt werden; eine
  **neue** Datei dort würde jedoch stillschweigend fehlen.
  - `/content` statt `content` trifft nur das Verzeichnis im Projektstamm.
    Anschliessend mit `git check-ignore -v` gegen je einen Pfad aus beiden
    Verzeichnissen prüfen.
  - Dieselbe Prüfung lohnt sich für das ebenfalls pfadlose `users` (Zeile 31).
  - Danach kontrollieren, ob unter `resources/views/partials/content/` bereits Dateien
    fehlen, die versioniert sein sollten.

## Aufgaben für die Entwicklung

### Cookie-Hinweis und Tracking

- [ ] **Der Hinweis steuert die Tags nicht.** `resources/js/gdpr.js` und
  `partials/ui/gdpr.antlers.html` setzen lediglich `global_consent` im Local Storage und
  blenden den Hinweis aus. Die Tags im Container `GTM-MTN383N` — GA4,
  Google-Ads-Remarketing, Meta-Pixel und LinkedIn Insight — sind für das
  Seitenladeereignis konfiguriert und laufen davon unabhängig. Eingebunden ist der
  Hinweis über `partials/layout/footer.antlers.html` und
  `partials/layout/body.antlers.html`.

  Gewünscht ist eine möglichst kleine Lösung mit einer Auswahl, die tatsächlich auf die
  Tag-Auslösung wirkt und später änderbar bleibt. Die Werbe-Tags werden weiterhin
  benötigt, es geht nicht um deren Abschaffung. Zu prüfen wären danach das Verhalten vor
  einer Auswahl, nach einer Ablehnung, bei Teilauswahl und bei Widerruf im Browser,
  ausserdem Maps, YouTube/Vimeo und reCAPTCHA.

  Für die Ladezeit zählt die neue Lösung doppelt. Vor einer Auswahl entfallen rund
  2,3 MiB Tag-Skripte, und der Hinweistext ist auf dem Handy das LCP-Element der
  Startseite. Heute wird er erst sichtbar, wenn `gdpr.js` als letztes Modul-Skript
  läuft; der neue Hinweis sollte ohne diesen Umweg erscheinen.

### CTA-System

- [ ] Hauptaktion im Header als visuell abgesetzten Button «Sprechstunde» /
  «Consultation» ausgeben und den Menüpunkt «Kontakt» ersetzen. Betrifft
  `partials/layout/header.antlers.html`, die Hauptnavigation und die Button-Partials.
  Braucht neues Styling und damit einen Frontend-Build.
- [ ] Am Ende der Portfolioübersicht erscheint weiterhin der allgemeine Footer mit
  «Kontakt aufnehmen». Dort die Hauptaktion angleichen.
- [ ] «Offerte anfragen» / «Request a quote» künftig nur für einen tatsächlich
  projektspezifischen Anfrageweg verwenden; der Schlüssel ist in `lang/en.json`
  erhalten geblieben. Das Ziel der Sprechstunden-Buttons ist derzeit die Kontaktseite,
  für eine echte Terminbuchung fehlt ein Buchungslink.

### Neue optionale Felder

Die beiden übrigen sollen lokalisierbar sein und das heutige Layout unverändert
lassen, wenn sie leer bleiben. Logo-Marquee und Segment-Kacheln sind umgesetzt und
oben beschrieben; die dort notierten Entwurfstexte weichen leicht von dem ab, was
tatsächlich eingetragen wurde.

- [ ] **Hero**: Erklärungstext unterhalb der Headline, kleiner gesetzt als die
  Hauptüberschrift und nicht als weitere H1-Zeile. «Seit 16 Jahren aus Zürich – für
  Wettbewerbe, Immobilienvermarktung und öffentliche Kommunikation.» / «Based in
  Zurich for 16 years – for competitions, real estate marketing and public
  communication.»
- [ ] **Netzwerk-Baustein**: Einleitungstext vor den Partnern. Feldset
  `resources/fieldsets/network.yaml`, Ausgabe
  `partials/fieldsets/network/wrapper.antlers.html`. Entwurf: «Unser Netzwerk
  verbindet unterschiedliche Perspektiven auf Raum, Gestaltung und Kommunikation. Je
  nach Aufgabe kommen zusätzliche Kompetenzen dazu. So lässt sich dein Projekt über
  die Visualisierung hinaus weiterdenken.» / «Our network brings together different
  perspectives on space, design and communication. Depending on the task, we bring in
  additional expertise to help develop your project beyond visualization.» Der
  ursprüngliche Entwurf mit «Lichtplanung, Bewegtbild und Szenografie» beschreibt
  nicht alle verlinkten Organisationen und ist nicht zu übernehmen.

### Projekte und Portfolio

- [ ] «Zum Projekt» auf den Startseiten-Projektkacheln durch einen eindeutigen
  Pfeil ersetzen. Linkziel erhalten. Betrifft
  `partials/fieldsets/teaser/portfolio/item.antlers.html`. In der Portfolio-Übersicht
  ist das am 21. September geschehen und lässt sich von dort übernehmen: In
  `partials/content/project/elements/teaser.antlers.html` umschliesst **ein** Link die
  ganze Kachel — so, wie es die Kompetenz-Kacheln schon halten. Der Pfeil steht als
  blosses Icon rechts neben dem Auftraggeber, nicht als eigener Link. Vorher führten
  Bild, Titel und Button je einzeln zum selben Ziel und standen dreimal in der
  Tab-Reihenfolge.
- [ ] Beim Hover auf Projektkacheln Titel und Teaser stehen lassen und nur ein
  zusätzliches Element einblenden. Touch- und Tastaturbedienung mitprüfen; die
  Information muss auch ohne Hover zugänglich sein.
- [ ] Auf Projektdetailseiten sichtbare Pfeile für vorheriges und nächstes Projekt
  ergänzen. Veröffentlichungsstatus und aktive Sprache berücksichtigen, keine Links
  auf unveröffentlichte Projekte.
- [ ] Vorher-Nachher-Slider als Startseiten-Baustein nutzbar machen. Bestehende
  Projekt-Komponenten wiederverwenden und für Seiten freigeben; Platzierung im
  Projektbereich. Bildpaar und Position wählt die Redaktion.
- [ ] Auftraggeber in den Portfolio-Kacheln stärker hervorheben. Vorhandenes Feld
  `client` verwenden; «Partner» ist auch für Auftraggeber gewünscht.

### Kompetenz-Kacheln

- [ ] Vorschaubilder als Mouse-over-Animation: im Ruhezustand das statische Bild, beim
  Darüberfahren das hinterlegte Video automatisch und ohne Ton, beim Verlassen zurück
  zum Standbild. Auf Geräten ohne Hover bleibt das Standbild.

### Aufräumen

- [ ] **Wird der Branch `staging` noch gebraucht?** Sein letzter Commit ist
  `1cd9bba "wip"` vom 10. Juli 2025, und er enthält keinen Commit, der nicht schon in
  `master` steht. Der Name führt regelmässig zu Verwechslungen mit der Umgebung
  staging.nightnurse.ch — zuletzt wurde das neue Portfolio-Layout dort vermutet,
  obwohl es auf `master` liegt. Falls die Auslieferung nach staging.nightnurse.ch
  nicht an diesem Branch hängt, könnte er lokal und auf `origin` gelöscht werden.

- [ ] **Alten Portfolio-Baustein «Portfolio (Masonry)» entfernen.** Beschlossen, aber
  **erst nachdem der neue Baustein «Portfolio (Grid)» live ist** — wann das sein wird,
  steht noch nicht fest. Bis dahin bleiben beide nebeneinander bestehen; der alte ist
  der, der ausgeliefert wird.

  Voraussetzung: `teaser_project` steht derzeit auf vier Seiten — `de/startseite.md`,
  `de/architektur.md`, `de/hallodeutschland.md` und `en/home.md`. **Alle vier** müssen
  umgestellt sein, nicht nur die deutsche Startseite, sonst verschwinden die Bausteine
  auf den übrigen Seiten ersatzlos. Das Umstellen ist Redaktionsarbeit im Control
  Panel und geschieht in `content/`, gehört also nicht in dieses Repository.

  Danach entfernbar, und nur dann:

  - `resources/fieldsets/teaser_project.yaml` und `resources/fieldsets/teaser_project_item.yaml`
    — letzteres wird ausschliesslich vom ersteren importiert.
  - `resources/views/partials/fieldsets/teaser/portfolio/` (`wrapper` und `item`).
  - Der Zweig `teaser_project` in `partials/dispatcher.antlers.html` und der Satz
    `teaser_project` in `resources/blueprints/collections/pages/page.yaml`.
  - `resources/css/animations/masonry.css` samt `@import` in `app.css`. Die vier
    Animationen `masonryTitle`, `masonryCta`, `masonrySlideInTopRight` und
    `masonrySlideInBottom` kommen ausschliesslich im alten Wrapper vor — geprüft am
    22. September 2026, vor dem Entfernen erneut prüfen. Das löst einen Frontend-Build
    aus; siehe «Kein Frontend-Build nötig».

  Nicht entfernen, obwohl der alte Baustein sie benutzt:

  - `resources/js/modules/touch.js` und das Attribut `data-touch` — auch von
    `partials/content/team/media/portrait.antlers.html` gebraucht.
  - `partials/ui/cta.antlers.html`, `partials/ui/button/more.antlers.html` und die
    Fieldsets `cta`, `cta_text`, `cta_section_header` — der neue Baustein und andere
    Bausteine benutzen sie weiter.
  - Die Übersetzungen «Zum Projekt», «Projekt anfragen» und «Zum Portfolio» in
    `lang/en.json` — sie stehen auch im neuen Baustein und in der Projektübersicht.

- [ ] **Laufrichtung der zweiten Logoreihe als Klasse.** Sie steht derzeit als
  `style="animation-direction: reverse;"` am Track in
  `partials/fieldsets/marquee/wrapper.antlers.html`. Gewählt wurde das nur, um keinen
  Frontend-Build auslösen zu müssen. Sobald ohnehin gebaut wird: eine
  Modifier-Klasse in `resources/css/animations/marquee.css` ergänzen und den
  Inline-Style entfernen. Danach prüfen, dass beide Reihen weiterhin gegenläufig
  laufen und `prefers-reduced-motion` sie weiterhin anhält.
- [ ] **Alte Sprungnavigation.** Die vier nicht mehr verwendeten Sprungziele sind aus
  der deutschen Startseite entfernt. Vor einer projektweiten Entfernung prüfen, ob
  andere Seiten die alten `anchors`-Inhalte noch brauchen — vorhanden sind sie unter
  anderem auf «Über uns», «Kompetenzen» und englischen Seiten. Wird die Funktion
  nirgends mehr gebraucht, `resources/fieldsets/anchors.yaml` und zugehörige
  Frontend-Logik entfernen. Die einzelnen `anchor`-Felder an Inhaltsabschnitten sind
  davon getrennt zu beurteilen.
- [ ] **Die einzelnen `anchor`-Felder werden nirgends ausgegeben.** Rund ein Dutzend
  Fieldsets und mehrere Blueprints bieten das Feld an, aber kein Template rendert es;
  der zugehörige Partial `components/misc/anchor` war schon unbenutzt, als ihn Cleanup
  #5.1 entfernte. Lokal sind 14 Werte in fünf Inhaltsdateien gesetzt, etwa `ueberuns`,
  `arbeiten` und `team`, und bleiben wirkungslos. Entscheiden, ob das Feld wieder
  ausgegeben wird, etwa über den neuen Parameter `section_id` von
  `partials/layout/section.antlers.html`, oder aus den Fieldsets verschwindet.
- [ ] **Ungenutzte npm-Pakete.** Aus den gebauten Einstiegspunkten werden nur
  `alpinejs` und `swiper` geladen. Nirgends importiert sind `axios`, `vue-axios`,
  `nprogress` und `fullpage.js`; `@tailwindcss/forms` ist installiert, aber nicht in
  `tailwind.config.js` unter `plugins` eingetragen und damit wirkungslos.
  - Nach dem Entfernen `package-lock.json` erneuern; alle Build-Umgebungen müssen
    einmal `npm install` ausführen.
  - Zur Absicherung `npm run build` ausführen und `public/build` mit dem Stand in Git
    vergleichen. Bleibt das Ergebnis gleich, hing nichts an diesen Paketen.
  - `@vitejs/plugin-vue` gesondert beurteilen: Es gehört zum stillgelegten
    Control-Panel-Gerüst (`resources/js/cp.js`, `resources/css/cp.css`,
    `ExampleFieldtype.vue`, auskommentierte Zeilen in `vite.config.js`) und wird wieder
    gebraucht, sobald ein eigener Fieldtype entsteht. Entweder beides behalten oder
    beides entfernen — nur das Paket zu entfernen ergäbe später einen schwer deutbaren
    Build-Fehler.

### Technische Vorüberlegung zum Editorial-Baustein

Falls der Baustein freigegeben wird: Eine Seite einfach auf `template: blog/show`
umzubiegen funktioniert **nicht**. Der `page`-Blueprint hat kein Äquivalent zum
durchgehenden `content`-Bard-Feld, und `blog/_related.antlers.html` fragt hart
verdrahtet die `posts`-Collection ab und verlinkt eine feste
Blog-Übersichts-Entry-ID.

Sauberer wäre ein eigener Baustein-Typ analog zu den bestehenden Fieldsets,
registriert im `page`-Blueprint und in `partials/dispatcher.antlers.html`: ein
optionales Kopfbild und ein Bard-Feld mit denselben Sets wie bei Posts
(`text`/`image`/`video`/`image_slideshow`, gegebenenfalls dieselben Sub-Partials aus
`content/post/media/*`), aber ohne Tags und ohne «Ähnliche Beiträge». So bleibt er
frei mit den übrigen Modulen kombinierbar.

## Redaktionelle Restarbeiten

- [ ] Das Feld `client` fehlt in 30 der 39 englischen Projekte; deutsch ist es in 42
  von 43 gepflegt. In der Portfolio-Übersicht steht es seit dem 22. September als kleine
  Zeile **über** dem Titel. Fehlt es, rückt der Titel nach oben — die Kachel bricht
  nicht, wirkt aber unfertig und sitzt eine Zeile höher als ihre Nachbarn. Englisch
  nachtragen.
- [ ] Der Titel der Portfolio-Übersicht (`portfolio_title`) ist übersetzbar, fällt aber
  auf die deutsche Fassung zurück. `/en/portfolio` zeigt bis zur englischen Eingabe den
  deutschen Titel.
- [ ] Sieben unveröffentlichte Teameinträge haben kein Portrait. Vor dem
  Veröffentlichen ergänzen, sonst bleibt ihre Karte in der Übersicht leer.
- [ ] Die korrigierten Netzwerk-Links sind lokal eingepflegt, aber noch nicht
  veröffentlicht: Christian Ammann auf `https://photographer.ch/`, SHIFT auf
  `https://shift.immo/`. Die Live-Seite verlinkte am 7. September 2026 weiterhin
  `https://www.christian-amman.ch` und `https://shift.ch`.
- [ ] Zur Content-Übergabe gehört die korrigierte Metadatendatei von Christoph
  Deiters' Übersichtsfoto.

## SEO

### Mobile PageSpeed weiterhin offen

- [ ] **Mobile Performance gezielt verbessern.** Christoph führt die Aufgabe;
  technische Unterstützung nur für abgegrenzte Änderungen. Für das Ranking zählen die
  Felddaten echter Besucher, nicht der Lighthouse-Wert. PageSpeed Insights für die
  Startseite am 25. September: Core Web Vitals mobil «nicht bestanden», weil der LCP
  der Besucher knapp über 2,5 s liegt; ihre Serverantwort (TTFB) beträgt 1,9 s. Im
  Labor Score 63, FCP 1,8 s, LCP 8,2 s, 24,1 MiB. Die Punkte nach Gewicht:
  - **Serverantwort.** Gecachte Seiten antworten in rund 80 ms, dieselbe URL mit
    neuem Query-Parameter beim ersten Aufruf in 1,09 s. In
    `config/statamic/static_caching.php` steht `ignore_query_strings` auf `false`,
    jede Parametervariante ist also ein eigener Cache-Eintrag. Besuche aus Google Ads,
    Facebook oder Newslettern bringen eigene Parameter wie `gclid`, `fbclid` oder
    `utm_*` mit und verfehlen den Cache damit jedes Mal; das erklärt vermutlich einen
    grossen Teil der 1,9 s. In den Server-Logs den Anteil solcher Aufrufe prüfen und
    die Parameter vom Cache-Schlüssel ausnehmen, ohne Pagination und Filter zu
    brechen; welche Einstellungen die installierte Statamic-Version dafür bietet,
    vorher in der Dokumentation bestätigen.
  - **Intro der Startseite.** Header, Menü, Titel und Logo-Unterzeile starten mit
    `opacity: 0` und erscheinen erst mit `is-playing`, das `observer.js` nur setzt,
    wenn `video.play()` gelingt. Scheitert das Abspielen, bleibt die Seite schwarz: bei
    PageSpeed jedes Mal, weil dessen Testbrowser das Video nicht abspielt, bei echten
    Besuchern etwa auf iPhones im Stromsparmodus, der Autoplay blockiert. Der Browser
    springt dann auch auf die nächste `<source>` und lädt die Desktop-Datei, daher die
    24 MiB im Labor; in normalen Browsern laden nur die Mobilvarianten. Vorschlag:
    auch beim Scheitern einblenden. Ein Poster zeigt immerhin ein Bild statt Schwarz,
    zählt als bildschirmfüllendes Bild aber nicht als LCP-Element (lokal geprüft).
  - **Cookie-Hinweis als LCP-Element.** Auf der schwarzen Seite ist sein Text das
    einzige Element, und er erscheint erst, wenn `gdpr.js` als letztes Modul läuft.
    Der Labor-LCP besteht deshalb fast ganz aus Render-Verzögerung. Siehe «Cookie-Hinweis
    und Tracking».
  - **Render-blockierendes CSS, geschätzt 880 ms.** Neben dem Haupt-CSS im `<head>`
    (9,7 KiB, 192 ms) erzeugt Vite aus `import 'swiper/css'` in
    `resources/js/modules/swiper/index.js` eine zweite Datei (3,1 KiB). Sie steht mit
    `app.js` ganz am Ende des HTML und wird deshalb spät entdeckt (571 ms). Das
    Swiper-CSS ins Haupt-CSS zu übernehmen spart diese Anfrage; das löst einen Build
    aus.
  - **Bilder.** Die drei Projektbilder der Startseite kommen mobil als `lg-webp`
    (1280 px) bei rund 600 physischen Pixeln Anzeigebreite; Lighthouse schätzt
    557 KiB Einsparung.
  - **Poster der Filmseite: lokal behoben.** Glide statt Originale, die Seite sinkt
    mobil von 20,1 auf 5,9 MiB. Live mit dem nächsten gesammelten Deployment.
  - Das Timeline-Video weiter unten lädt wegen `is_fullpage` sofort mit; ein späteres
    Laden berührt Autoplay und Scroll-Snapping.
  - Nicht beeinflussbar: Die 189 KiB «Cache-Verweildauer» betreffen nur Facebook- und
    LinkedIn-Skripte.

### Indexierung und Canonicals

Diese Punkte behandelt Christoph separat. Die ausführliche Auswertung steht in
[Search-Console-Auswertung vom 7. September 2026](seo-gsc-canonical-audit-2026-09-07.md),
die Vorgeschichte in [seo-investigation.md](seo-investigation.md). Dort steht auch
der priorisierte Diagnoseablauf, einschliesslich des Abgleichs mit den
Produktionsänderungen um den 28./29. August und der erneuten Indexierung nach einem
Fix.

- [ ] Englische Kompetenzseite und Teamprofile: In der Search Console letzten Crawl,
  gewählte kanonische URL und das gecrawlte HTML mit einem Live-Test vergleichen. Eine
  lokale Prüfung am 7. September ergab für alle betroffenen URLs HTTP 200,
  Self-Canonical und `index, follow`, auch mit Googlebot-Kennung — das erklärt die
  gemeldete Canonical-Auswahl also noch nicht.
- [ ] Prüfen, ob `/en/sitemap.xml` in der Search Console eingereicht ist. Beide
  Sitemaps sind seit dem 25. September in der Live-robots.txt eingetragen und geprüft.
  **Das ist Hygiene, keine Lösung:** Die englische Sitemap ist Google für das
  Christoph-Profil bereits bekannt, eine erneute Einreichung behebt die belegte
  Fehlzuordnung also nicht.
- [ ] Automatisch erzeugte Tag-, Filter- und Parameterseiten beurteilen, etwa
  `/en/portfolio?r=73`, `/en/services?pp=1`, `/en/blog/category/…?page=1`. Je URL-Typ
  klären, ob eigenständige Inhalte, Duplikate oder paginierte Archive entstehen, und
  danach Canonical, `noindex` oder weniger crawlbare Links festlegen. Die deutschen
  Entsprechungen mitberücksichtigen.
- [ ] Canonicals regulärer englischer Projektseiten prüfen, insbesondere
  `/en/portfolio/hotel-complex-in-tirana` und `/en/portfolio/gruenauring`. Je URL
  feststellen, ob sie noch indexiert werden soll, und den Self-Canonical mit der von
  Google gewählten URL vergleichen.

## Geprüft, keine Aufgabe mehr

Die Quellenauswahl zwischen Hoch- und Querformatvideo funktioniert. Sie erfolgt über
`media`-Attribute an den `<source>`-Elementen und wurde in Chrome bestätigt. Dass die
Auswahl nur beim Laden stattfindet und ein Drehen des Telefons sie nicht wiederholt,
entspricht dem Verhalten von Medienelementen; ein Nachladen würde das Video neu
starten und wäre störender. Vor dieser Änderung wurde das Hochformat auf keinem Gerät
ausgeliefert. Kann ein Browser die Hochformat-Datei nicht abspielen, lädt er zusätzlich
die nächste Quelle, also das Querformat; das und die Folgen für das Intro stehen unter
«Mobile PageSpeed weiterhin offen».
