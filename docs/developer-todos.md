# Entwickler-Briefing: offene Punkte und Entscheidungen

Stand: 26. September 2026

Dieses Dokument listet, was in der Entwicklung zu entscheiden und zu tun ist. Bereits
Umgesetztes steht nur dann hier, wenn es Folgen für die weitere Arbeit hat — alles
Übrige ist in der Git-Historie nachvollziehbar, wo jede Änderung mit Begründung in
einem eigenen Commit liegt.

## Build und Auslieferung

- **Build in Git:** `public/build/assets/app-a1043728.js` und `app-b5c57cd4.css`.
  `manifest.json` und `public/build/assets` gemeinsam deployen; alte Hash-Dateien
  können auf dem Server bleiben.
- **Nur nach `npm ci` bauen.** Ein Build aus einem mit pnpm installierten
  `node_modules` bündelte am 23. September Alpine.js 3.16.3 statt 3.14.9 aus
  `package-lock.json` und kam so auf Produktion.
- **Vor dem nächsten `git pull` auf Produktion `git status` prüfen.** Seit dem
  21. September wurden versionierte Dateien per FTP direkt eingespielt: Templates,
  Blueprints, Fieldsets, `lang/en.json` und der Build. Ein Pull bricht an ihnen ab,
  sobald er dieselben Dateien ändert. Vor dem Verwerfen mit Git abgleichen.
- **Nach jedem Deployment den Cache leeren.** Am 24. September lieferten normale URLs
  einen älteren Stand als dieselben URLs mit Diagnoseparameter, bis der Cache geleert
  wurde. Welche Cache-Schicht betroffen war, ist nicht geklärt. Weder `git pull` noch
  FTP lösen in Statamic eine Invalidierung aus.
- **`public/.htaccess` ist git-ignoriert** und enthält vor der Host-/HTTPS-Normalisierung
  einen kommentierten SEO-02-Block mit 301-Weiterleitungen: `/de`, alte Leistungs-,
  Team-, Übersichts- und Kontaktadressen auf ihre Nachfolger, `/jobs` und `/en/jobs`
  auf den `#jobs`-Bereich. Änderungen daran gelangen nicht über Git auf den Server.

## Umgesetzt, mit Folgen

### Neue Felder und Bausteine

- `team_title` (Teamübersicht) und `portfolio_title` (Portfolio-Übersicht) im
  Seiten-Blueprint: formatierbar und lokalisierbar, ausgegeben als H1, leer greift der
  Seitentitel. `portfolio_title` bindet das Feld des Fieldsets `title` per Referenz ein.
  Die Routen-Views `/portfolio/kategorie/…` und `/portfolio/tag/…` nehmen die H1 vom
  gefilterten Begriff. `ui/heading/h1` hat dafür die Grösse `none` bekommen.
- Logo-Marquee: Titelfeld (`import: title` in `resources/fieldsets/marquee.yaml`),
  Logos in zwei gegenläufigen Reihen.
- Segment-Kacheln: `subtitle` in `resources/fieldsets/teaser_competencies.yaml`, nur in
  der kompakten Variante ohne Bild ausgegeben.
- Baustein «Portfolio (Grid)», `teaser_projects_grid`: eine handverlesene Auswahl im
  gestaffelten Raster der Portfolio-Übersicht, unverändert über
  `content/project/elements/teaser-slot` und `components/portfolio-grid.css`. Der Titel
  belegt den ersten Slot, die Projekte beginnen bei #2; vollständig aufgehen 7 und 15
  Projekte. Der CTA steht ausserhalb des Rasters.
- `partials/layout/section.antlers.html` nimmt den optionalen Parameter `section_id`;
  der Jobs-Block setzt damit `id="jobs"`, und der Scroll-Observer respektiert einen
  Anker beim Laden.

### Kategorie-, Tag- und Suchseiten: 404 und `noindex`

- `blog/show.antlers.html`: Die Kategorie-Schleife steht in `{{ if post_categories }}`.
  Ohne das Feld lief sie im Kontext des Beitrags und gab dessen eigenen Slug als
  Kategorie-Link aus — daher Soft 404 wie `/en/blog/category/new-visual-workflow`.
- Die Routen in `routes/web.php` nehmen jeden Slug an und lieferten dafür eine leere
  Seite mit HTTP 200. Jetzt löst `blog/categories/index.antlers.html` für einen Slug
  ohne passende Kategorie `{{ 404 }}` aus, `blog/tags/index.antlers.html` für einen Tag
  ohne veröffentlichten Beitrag in der aktuellen Sprache. Übersichten ohne Slug sind
  unverändert.
- Tag-Seiten in Blog und Portfolio sind `noindex, follow`, ausser den Jahres-Tags des
  Blogs (`/blog/tag/2024` usw.), die als Jahresarchive dienen:
  `partials/layout/head.antlers.html` prüft
  `{{ if noindex || (tag && !(tag | is_numeric)) || current_uri == '/blog/suche' || current_uri == '/en/blog/search' }}`.
  `tag` gibt es nur als Routenparameter der vier Tag-Routen, kein Blueprint hat ein
  Feld dieses Namens.
- Die internen Suchseiten `/blog/suche` und `/en/blog/search` sind aus derselben Zeile
  `noindex, follow`, mit und ohne `?q=`. Die Pfade stehen dort fest: Ändert sich eine
  der beiden Suchrouten in `routes/web.php`, muss die Zeile mitgeändert werden.
- **Offen, Entscheidung des Entwicklers:** Im Portfolio liefert weiterhin jeder
  erfundene Slug 200, bei Tag-URLs mit `noindex`, bei Kategorie-URLs indexierbar. Die
  Routen teilen sich `project.index` mit der Übersicht, eine 404-Prüfung dort berührt
  also die Hauptseite.

### Strukturierte Daten: Unternehmen und Breadcrumbs

- `partials/layout/head.antlers.html` bindet auf der Startseite jeder Sprache
  (`is_homepage`) `partials/layout/organization-schema.antlers.html` ein. Das
  `Organization`-JSON-LD nimmt Firmenname, Adresse, Telefon und E-Mail aus dem Global
  «Contact info», die `sameAs`-Links aus «Social Media» und als Beschreibung die
  Meta-Beschreibung der Startseite; Logo ist `/android-chrome-512x512.png`. Die Adresse
  wird am Zeilenumbruch und am ersten Leerzeichen der zweiten Zeile zerlegt und setzt
  deshalb die Form «Strasse, dann PLZ und Ort» voraus.
- `partials/menu/breadcrumbs/wrapper.antlers.html` gibt nach den sichtbaren Brotkrumen
  ein `BreadcrumbList` aus derselben `nav:breadcrumbs`-Schleife aus, also auf Projekt-
  und Teamseiten, auch dort, wo die Brotkrumen mobil ausgeblendet sind.
  `team/show.antlers.html` verweist in `worksFor` per `@id` auf den Organization-Block.
- Texte laufen durch `to_json`; der ältere ProfilePage-Block in `team/show` gibt
  `title` noch ungefiltert aus.

### Bilder: Asset statt Pfad an die Bild-Partials

18 Aufrufe übergaben das Bild als Text (`image="{{ image }}"`), wodurch `alt`,
`width` und `height` leer blieben. Jetzt wird das Objekt gebunden (`:image="image"`,
Commit `15a07b1`). **Folge:** Diese Bilder tragen erstmals `width` und `height`. Die
Darstellung ändert sich nicht — das Preflight von Tailwind setzt `height: auto`, und
alle Aufrufe haben `w-full` mit `h-auto`, `h-full` oder `aspect-*`.

## Fehler

- [ ] **Scroll-Animationen auf Projektdetailseiten mit `is_fullpage: false`.**
  Abschnitte bleiben leer: Ihre Kinder starten über `[data-animation]` mit
  `opacity: 0` und werden erst sichtbar, wenn ein Vorfahre `.is-active` erhält. Das
  setzt nur der IntersectionObserver (`resources/js/modules/observer.js`), und nur für
  Sections mit `data-section-observe`.
  - In `partials/layout/section.antlers.html` behoben: Das Attribut wird unabhängig von
    `is_fullpage` gesetzt, nach dem Vorbild von `partials/fieldsets/cta/wrapper.antlers.html`.
  - **Offen** steht `{{ is_fullpage ? 'data-section-observe' : '' }}` noch an neun
    Stellen in `resources/views/project/show.antlers.html` und an einer in
    `resources/views/project/_related.antlers.html`.
  - Vor der Änderung im Browser prüfen: Jede zusätzlich beobachtete Section startet auch
    Videos und blendet die Logo-Byline aus.
  - `is_fullpage: true` auf der Seite ist **kein** Ersatz: Jedes Element-Template
    übergibt dann `min-h-screen`, und jede Section wird bildschirmhoch — im Test wuchs
    `/angebot/animation-und-film` von rund 6858 auf 9599 Pixel.
  - Der Intro-Baustein ist zu Recht an `is_fullpage` gebunden, dort hängt das
    Scroll-Snapping.

## Aufgaben

### Cookie-Hinweis und Tracking

- [ ] **Der Hinweis steuert die Tags nicht.** `resources/js/gdpr.js` und
  `partials/ui/gdpr.antlers.html` setzen nur `global_consent` im Local Storage und
  blenden den Hinweis aus. Die Tags im Container `GTM-MTN383N` — GA4,
  Google-Ads-Remarketing, Meta-Pixel und LinkedIn Insight — laufen beim Seitenaufruf
  unabhängig davon. Eingebunden ist der Hinweis über `partials/layout/footer.antlers.html`
  und `partials/layout/body.antlers.html`.

  Gewünscht ist eine möglichst kleine Lösung mit einer Auswahl, die tatsächlich auf die
  Tag-Auslösung wirkt und später änderbar bleibt; die Werbe-Tags werden weiter
  gebraucht. Danach prüfen: vor einer Auswahl, nach Ablehnung, bei Teilauswahl und bei
  Widerruf, ausserdem Maps, YouTube/Vimeo und reCAPTCHA. Für die Ladezeit zählt das
  doppelt: Vor einer Auswahl entfallen rund 2,3 MiB Tag-Skripte, und der Hinweistext ist
  auf dem Handy das LCP-Element der Startseite. Heute erscheint er erst, wenn `gdpr.js`
  als letztes Modul läuft; der neue Hinweis sollte ohne diesen Umweg erscheinen.

- [ ] **Werbe-Tags erst nach dem Laden auslösen.** Im PageSpeed-Bericht vom
  25. September brauchen die Tags den grössten Teil der Rechenzeit: mobil Tag Manager
  454 ms, Facebook 253 ms und LinkedIn 21 ms gegenüber 158 ms für die eigenen Skripte,
  am Desktop 614, 299 und 30 ms gegenüber 165 ms. Am Desktop drückt allein die Total
  Blocking Time (590 ms) den Wert auf 76. Die Auslöser von Meta-Pixel, LinkedIn und
  Google-Ads-Remarketing auf «Fenster geladen» (Window Loaded) zu legen, entlastet den
  Seitenaufbau; der Preis ist etwas weniger Tracking bei sehr kurzen Besuchen. GA4 kann
  beim Seitenaufruf bleiben. Das ist eine Einstellung im Tag Manager, lässt sich über
  die Container-Versionen zurücknehmen und passt in denselben Schritt wie die
  Einwilligungslösung. Christoph hat dort vermutlich keinen Zugriff. LinkedIn ist nicht
  doppelt eingebunden; `insight.min.js` lädt `insight.old.min.js` nach.

### CTA-System

- [ ] Hauptaktion im Header als visuell abgesetzten Button «Sprechstunde» /
  «Consultation» ausgeben und den Menüpunkt «Kontakt» ersetzen. Betrifft
  `partials/layout/header.antlers.html`, die Hauptnavigation und die Button-Partials.
  Braucht neues Styling und damit einen Frontend-Build.
- [ ] Am Ende der Portfolioübersicht erscheint weiterhin der allgemeine Footer mit
  «Kontakt aufnehmen». Dort die Hauptaktion angleichen.
- [ ] «Offerte anfragen» / «Request a quote» nur für einen tatsächlich
  projektspezifischen Anfrageweg verwenden; der Schlüssel ist in `lang/en.json`
  erhalten. Die Sprechstunden-Buttons führen derzeit auf die Kontaktseite, für eine
  echte Terminbuchung fehlt ein Buchungslink.

### Neue optionale Felder

Lokalisierbar; leer bleibt das heutige Layout unverändert.

- [ ] **Hero:** eine Zeile Erklärungstext unterhalb der Headline, kleiner gesetzt als
  die Hauptüberschrift und nicht als weitere H1-Zeile.
- [ ] **Netzwerk-Baustein:** zwei bis drei Sätze Einleitung vor den Partnern. Fieldset
  `resources/fieldsets/network.yaml`, Ausgabe
  `partials/fieldsets/network/wrapper.antlers.html`.

### Projekte und Kompetenz-Kacheln

- [ ] Auf Projektdetailseiten sichtbare Pfeile für vorheriges und nächstes Projekt
  ergänzen. Veröffentlichungsstatus und aktive Sprache berücksichtigen, keine Links auf
  unveröffentlichte Projekte.
- [ ] Vorher-Nachher-Slider als Seitenbaustein nutzbar machen. Die bestehende
  Projekt-Komponente (`content/project/elements/image_comparison`) wiederverwenden und
  für Seiten freigeben; Bildpaar und Position wählt die Redaktion.
- [ ] Kompetenz-Kacheln: im Ruhezustand das statische Bild, beim Darüberfahren das
  hinterlegte Video automatisch und ohne Ton, beim Verlassen zurück zum Standbild. Auf
  Geräten ohne Hover bleibt das Standbild.

### Mobile PageSpeed

PageSpeed Insights für die Startseite am 25. September: Core Web Vitals mobil «nicht
bestanden», weil der LCP der Besucher knapp über 2,5 s liegt; ihre Serverantwort
(TTFB) beträgt 1,9 s. Im Labor Score 63, FCP 1,8 s, LCP 8,2 s, 24,1 MiB. Für das
Ranking zählen die Felddaten, nicht der Lighthouse-Wert. Die Punkte nach Gewicht:

- [ ] **Serverantwort.** Gecachte Seiten antworten in rund 80 ms, dieselbe URL mit
  neuem Query-Parameter beim ersten Aufruf in 1,09 s. In
  `config/statamic/static_caching.php` steht `ignore_query_strings` auf `false`, jede
  Parametervariante ist ein eigener Cache-Eintrag. Besuche aus Google Ads, Facebook
  oder Newslettern bringen `gclid`, `fbclid` oder `utm_*` mit und verfehlen den Cache
  jedes Mal; das erklärt vermutlich einen grossen Teil der 1,9 s. In den Server-Logs den
  Anteil solcher Aufrufe prüfen und diese Parameter vom Cache-Schlüssel ausnehmen, ohne
  Pagination und Filter zu brechen; welche Einstellungen Statamic 5.73 dafür bietet,
  vorher in der Dokumentation bestätigen.
- [ ] **Intro der Startseite.** Header, Menü, Titel und Logo-Unterzeile starten mit
  `opacity: 0` und erscheinen erst mit `is-playing`, das `observer.js` nur setzt, wenn
  `video.play()` gelingt. Scheitert das Abspielen, bleibt die Seite schwarz: bei
  PageSpeed jedes Mal, bei echten Besuchern etwa auf iPhones im Stromsparmodus. Der
  Browser springt dann auch auf die nächste `<source>` und lädt die Desktop-Datei, daher
  die 24 MiB im Labor. Vorschlag: auch beim Scheitern einblenden. Ein Poster zählt als
  bildschirmfüllendes Bild nicht als LCP-Element (lokal geprüft).
- **Cookie-Hinweis und Tracking-Skripte:** Der Hinweistext ist auf der schwarzen Seite
  das einzige Element und damit LCP; die Tags belegen auf dem Handy 2,27 der 2,40 MiB
  Skripte und den Grossteil der Total Blocking Time. Siehe «Cookie-Hinweis und
  Tracking».
- [ ] **Render-blockierendes CSS, geschätzt 880 ms.** Neben dem Haupt-CSS im `<head>`
  (9,7 KiB, 192 ms) erzeugt Vite aus `import 'swiper/css'` in
  `resources/js/modules/swiper/index.js` eine zweite Datei (3,1 KiB), die mit `app.js`
  am Ende des HTML steht und spät entdeckt wird (571 ms). Das Swiper-CSS ins Haupt-CSS
  zu übernehmen spart diese Anfrage; das löst einen Build aus.
- [ ] **Bilder.** Die Projektkacheln der Startseite kommen mobil als `lg-webp`.
  Lighthouse schätzt 557 KiB Einsparung, überwiegend durch Kompression (die
  Glide-Presets arbeiten mit Qualität 90), bei einem Bild auch durch die Grösse
  (1052 × 864 px für 727 × 491 px Anzeige). Beide Portfolio-Bausteine nutzen dieselbe
  Voreinstellung. Abhilfe wären `srcset` mit Breitenangaben und `sizes` oder eine
  niedrigere Qualität; beides betrifft viele Bilder.
- Das Timeline-Video weiter unten lädt wegen `is_fullpage` sofort mit; ein späteres
  Laden berührt Autoplay und Scroll-Snapping.
- Nicht beeinflussbar: Die 189 KiB «Cache-Verweildauer» betreffen nur Facebook- und
  LinkedIn-Skripte.

### Blog: Vorschaubilder

- [ ] **Vorschaubild für Beiträge.** `og:image` und `twitter:image` zeigen das Original
  von `open_graph_image`, sonst `/opengraph.jpg`. Bei Beiträgen ist das Feld fast überall
  leer, sie teilen also alle dasselbe allgemeine Bild. Das Titelbild direkt zu verwenden
  hilft nicht: 34 der 113 Titelbilder sind über 5 MB, 18 über 8 MB (bis 16 MB, darunter
  GIF und PNG); LinkedIn nimmt höchstens 5 MB, Facebook 8 MB. Optionen: im Kopf
  `open_graph_image ?? feature_image` über Glide ausliefern (etwa 1200 px breit, JPEG,
  absolute URL), oder nur die Rückfallregel für Beiträge ergänzen und die Originale
  belassen. Betrifft jede Seite mit Vorschaubild, deshalb Entscheidung des Entwicklers.
  Prüfen im LinkedIn Post Inspector und im Facebook Sharing Debugger mit einem alten
  Beitrag mit grossem Titelbild und einer Seite mit eigenem `open_graph_image`.

### Aufräumen

- [ ] **Wird der Branch `staging` noch gebraucht?** Sein letzter Commit ist
  `1cd9bba "wip"` vom 10. Juli 2025, und er enthält nichts, was nicht schon in `master`
  steht. Der Name führt regelmässig zu Verwechslungen mit der Umgebung
  staging.nightnurse.ch. Falls die Auslieferung dorthin nicht an diesem Branch hängt,
  könnte er lokal und auf `origin` gelöscht werden.

- [ ] **Alten Baustein «Portfolio (Masonry)» entfernen.** Beschlossen, sobald
  `teaser_project` in keiner Inhaltsdatei mehr vorkommt — die Umstellung auf
  «Portfolio (Grid)» geschieht redaktionell. Vorher prüfen, etwa mit
  `grep -rl "type: teaser_project$" content/`, sonst verschwinden Bausteine ersatzlos.
  Dann entfernbar:

  - `resources/fieldsets/teaser_project.yaml` und `teaser_project_item.yaml` —
    letzteres wird nur vom ersteren importiert.
  - `resources/views/partials/fieldsets/teaser/portfolio/` (`wrapper` und `item`).
  - Der Zweig `teaser_project` in `partials/dispatcher.antlers.html` und der Satz
    `teaser_project` in `resources/blueprints/collections/pages/page.yaml`.
  - `resources/css/animations/masonry.css` samt `@import` in `app.css`; die vier
    `masonry*`-Animationen kommen nur im alten Wrapper vor. Das löst einen Build aus.
  - Der Schlüssel «Zum Projekt» in `lang/en.json` — nur noch vom alten `item` benutzt.

  Bleiben müssen `resources/js/modules/touch.js` mit `data-touch` (auch im
  Team-Portrait), `partials/ui/cta.antlers.html`, `partials/ui/button/more.antlers.html`,
  die Fieldsets `cta`, `cta_text`, `cta_section_header` sowie «Projekt anfragen» und
  «Zum Portfolio» in `lang/en.json` — der neue Baustein benutzt sie weiter.

- [ ] **Laufrichtung der zweiten Logoreihe als Klasse.** Sie steht nur deshalb als
  `style="animation-direction: reverse;"` in `partials/fieldsets/marquee/wrapper.antlers.html`,
  weil kein Build ausgelöst werden sollte. Beim nächsten Build eine Modifier-Klasse in
  `resources/css/animations/marquee.css` ergänzen und prüfen, dass beide Reihen
  gegenläufig laufen und `prefers-reduced-motion` sie anhält.
- [ ] **Sprungnavigation und `anchor`-Felder.** `resources/fieldsets/anchors.yaml` ist in
  keinem Blueprint mehr eingebunden. Die einzelnen `anchor`-Felder bieten rund ein
  Dutzend Fieldsets an, aber kein Template gibt sie aus. In beiden Fällen enthalten
  Inhaltsdateien noch Werte, die wirkungslos bleiben. Entscheiden, ob das Feld über den
  Parameter `section_id` von `partials/layout/section.antlers.html` ausgegeben wird oder
  aus den Fieldsets verschwindet.
- [ ] **Ungenutzte npm-Pakete.** Aus den gebauten Einstiegspunkten werden nur
  `alpinejs` und `swiper` geladen. Nirgends importiert sind `axios`, `vue-axios`,
  `nprogress` und `fullpage.js`; `@tailwindcss/forms` ist installiert, aber nicht unter
  `plugins` in `tailwind.config.js` eingetragen.
  - Nach dem Entfernen `package-lock.json` erneuern, `npm ci` in allen
    Build-Umgebungen, `npm run build` und `public/build` mit Git vergleichen. Bleibt es
    gleich, hing nichts an diesen Paketen.
  - `@vitejs/plugin-vue` gehört zum stillgelegten Control-Panel-Gerüst
    (`resources/js/cp.js`, `resources/css/cp.css`, `ExampleFieldtype.vue`,
    auskommentierte Zeilen in `vite.config.js`). Entweder beides behalten oder beides
    entfernen — nur das Paket zu entfernen ergäbe später einen schwer deutbaren
    Build-Fehler.

## Geprüft, keine Aufgabe

Die Quellenauswahl zwischen Hoch- und Querformatvideo funktioniert über
`media`-Attribute an den `<source>`-Elementen. Dass ein Drehen des Telefons die Auswahl
nicht wiederholt, entspricht dem Verhalten von Medienelementen; ein Nachladen würde
das Video neu starten.
