# Prompt: Blogartikel über den Datenatlas

> Zum Kopieren in Claude Chat. Alle Zahlen sind aus dem Datenbestand berechnet
> und zum Zeitpunkt der Erstellung geprüft — Stand siehe unten. Werden Daten
> ergänzt, die Zahlen vor der nächsten Verwendung neu erheben:
> `node scripts/validate-data.js` und der Qualitätsbericht liefern die
> wichtigsten.

---

Du schreibst einen Blogartikel über den **Datenatlas** (datenatlas.de). Unten
findest du alles, was du brauchst. Halte dich strikt daran.

## Grundregel

**Erfinde nichts hinzu.** Keine Zahlen, keine Funktionen, keine Zitate, keine
Nutzerstimmen, keine Vergleiche mit konkreten anderen Projekten, keine
Behauptungen darüber, wer den Atlas nutzt oder was er bewirkt hat. Wenn dir für
eine Aussage die Grundlage fehlt, lass sie weg. Der Artikel soll für jemanden
bestehen, der jede Angabe nachprüft.

---

## 1. Was der Datenatlas ist

Ein interaktiver Atlas der deutschen Datenlandschaft. Er verzeichnet, **welche
Datentypen in deutschen Organisationen entstehen**, und bewertet für jeden
einzelnen, **wie leicht er sich als Open Data veröffentlichen ließe — mit
Begründung**.

Der blinde Fleck, den er adressiert: Die Open-Data-Debatte dreht sich um
Portale, Lizenzen und Schnittstellen — also um Daten, die *bereits*
veröffentlicht sind. Was fehlt, ist der Blick auf das, was **noch nicht**
veröffentlicht ist. Der Atlas fragt nicht „was liegt im Portal?", sondern „was
entsteht überhaupt, und was steht seiner Öffnung im Weg?".

Dargestellt wird das als **isometrische Karte** auf einem Canvas: Man navigiert
von der Gesellschaftsebene bis zum einzelnen Datenprodukt.

## 2. Die Zahlen

| | |
|---|---|
| Datentypen (L4) | **10.149** |
| Aktivitäten (L3) | 418 |
| Organisationstypen (L2) | 147 |
| Sektoren (L1) | 8 |
| Prozessbezüge | 50.745 (Ø 5,0 je Datentyp) |
| Zeitangaben-Abdeckung | 100 % (alle 10.149 tragen Verfügbarkeitsjahr und Aktualisierungsrhythmus) |

**Datentypen je Sektor:** Staat und Verwaltung 3.174 · Wirtschaft 1.587 ·
Zivilgesellschaft 1.386 · Wissenschaft und Forschung 1.311 · Medien 828 ·
Bildung 828 · Religionsgemeinschaften 690 · Kultur 345

**Die zentrale Erkenntnis — die Öffnungsverteilung:**

| Klasse | Anteil | Bedeutung |
|---|---|---|
| `OP_01` Sofort publizierbar | **68,1 %** (6.909) | keine Schranke erkennbar |
| `OP_02` Nach Aufbereitung publizierbar | **28,5 %** (2.895) | ein benannter Schritt fehlt (Anonymisierung, Aggregation, Schwärzung …) |
| `OP_03` Nur Metadaten publizierbar | **3,4 %** (345) | die Daten selbst bleiben zurück |

Das ist die Kernaussage des Projekts: **Über zwei Drittel der erfassten
Datentypen wären sofort publizierbar. Nur 3,4 % sind so sensibel, dass
lediglich Metadaten veröffentlicht werden könnten.** Der Engpass liegt selten
im Datenschutz — er liegt in Zuständigkeit, Aufbereitung und Ermessen.

**Weitere Verteilungen, falls du sie brauchst:**

- Lizenzen: Datenlizenz Deutschland 41,1 % · CC BY 4.0 32,2 % · CC0 13,9 % · proprietär/restriktiv 12,8 %
- Granularität: aggregiert 62,6 % · kleinräumig 22,1 % · Einzelereignis 12,0 % · personenbezogene Mikrodaten 3,3 %
- Objekttyp: Metadaten 29,5 % · Finanzdaten 15,2 % · Textdokumente 13,9 % · personenbezogene Daten 12,8 % · Transaktionsdaten 12,2 % · Messwerte 8,7 % · Geodaten 5,9 % · Mediendaten 1,9 %
- Aktualisierung: jährlich 57,1 % · monatlich 29,7 % · täglich 5,2 % · Echtzeit 5,0 % · unregelmäßig 3,1 %
- Themen (Top 5): Wirtschaft 20,8 % · Soziales 14,7 % · Bildung 14,0 % · Wissenschaft/Technik 9,7 % · Finanzen 9,5 %
- Verfügbarkeitsjahre reichen von 1988 bis 2020

## 3. Wie der Bestand gegliedert ist

Vier Ebenen nach dem Prinzip *Wer produziert welche Daten wobei?*

```
Sektor        →  Organisation      →  Aktivität              →  Datentyp
Staat            Ordnungsamt          Verkehrsüberwachung       Messstellen-Geodaten
```

**Die Sektoren sind nach Trägertyp geschnitten, nicht nach Thema** — danach,
*wer* die Daten erzeugt. Ein Krankenhausdatensatz liegt daher je nach Träger in
*Staat* oder *Wirtschaft*, nicht in einem Sektor „Gesundheit". Das klingt
sperrig, ist aber der entscheidende Kunstgriff: **Öffnungshürden hängen an der
Trägerform, nicht am Thema.** Eine kommunale Klinik unterliegt anderen
Transparenzpflichten als eine private.

Jeder Datentyp trägt ein kontrolliertes Vokabular: Öffnungsklasse, Thema,
Objekttyp, Granularität, Format, Lizenz, Relevanz (1–5), mindestens fünf
Prozessbezüge und einen Zeitblock. Alle Codes liegen in einer
`vocabulary.json` — der Validator liest sie von dort.

## 4. Was die Anwendung kann

- **Isometrische Karte** mit Pan, Zoom, Touch-Gesten und vollständiger Tastaturnavigation
- **Suche** über einen schlanken Index; **Tiefensuche** über die Beschreibungen ist zuschaltbar (sie lädt dafür den vollen Bestand nach)
- **Filter** nach Öffnungsklasse
- **Detail-Sidebar** je Datentyp mit allen Metadaten und Prozessbezügen
- **„Ähnliche Datensätze"** — bis zu fünf Datentypen aus *anderen* Sektoren mit gleichem Thema/Objekttyp. Das macht den Trägertyp-Schnitt praktisch nutzbar: Man sieht, wo dieselbe Datenart unter anderen Bedingungen entsteht.
- **Statistik-Dashboard** — Öffnungsklassenverteilung je Sektor
- **Zeitleiste** — Verfügbarkeitskurve und Aktualisierungsrhythmen
- **CSV-Export** der sichtbaren Datentypen, im Browser erzeugt
- **Wizard „Daten öffnen"** — fünf Schritte von der Rechtefrage bis zur Lizenzempfehlung, mit Ergebnis-Checkliste
- **Datenkombinator** — 32 vorgedachte Szenarien, die Datentypen aus verschiedenen Sektoren zusammenführen und zeigen, welche Frage sich damit beantworten ließe
- **Deep Links**: jede Ansicht hat eine URL (`#medien/zdf`)

## 5. Die Technik

**Der Atlas läuft vollständig im Browser.** Keine Datenbank, kein Backend,
keine Nutzerkonten. Die gesamte Taxonomie liegt als statische JSON-Dateien vor.

- **Vanilla JavaScript, kein Framework.** Vite als Build-Werkzeug. Rund 5.700 Zeilen Quellcode.
- **Canvas-Renderer** für die isometrischen Kacheln, selbst geschrieben.
- **Auslieferungsgröße**: JS-Bundle 123 KB, CSS 56 KB. Die Sektordaten werden **erst bei Bedarf** geladen — wer nur einen Sektor ansieht, lädt nicht die anderen sieben.
- **Suchindex im Format v2**: Statt Sektor, Organisation und Aktivität auf jedem der 10.149 Einträge als id *und* Name zu wiederholen, verweisen positionelle Arrays auf eine gemeinsame Pfadtabelle mit 418 Einträgen. Das drückt den Index von 3,00 MB auf **1,16 MB** (253 KB gzip). Ein Adapter stellt beim Laden die Form wieder her, die Suche, Statistik und Zeitleiste erwarten — das Format ist also austauschbar, ohne die Konsumenten anzufassen.
- **Datenminimierung beim Build**: 28,6 MB JSON → 17,3 MB.
- **Vorkomprimierung**: Der Build erzeugt `.br`- und `.gz`-Geschwister für große Textdateien (34,9 MB → 4,2 MB Brotli). Apache liefert sie nach `Accept-Encoding` aus.
- **Deployment ohne Handgriffe**: Merge nach `main` deployt — GitHub Pages und Netcup per FTP, dazu Validator und CodeQL bei jedem Pull Request.
- **Lizenz: MPL-2.0.** Die Struktur lässt sich für andere Länder oder Domänen übernehmen.
- **Reichweitenmessung** mit GoatCounter, cookiefrei, ohne Wiedererkennung über Besuche hinweg. Weil die Karte über Hash-Fragmente navigiert, wird der jeweils angezeigte Ausschnitt eigens gezählt.

### Das SEO-Problem und seine Lösung — eine gute Geschichte für den Artikel

Ein Canvas hat für Suchmaschinen **keinen lesbaren Inhalt**. Alle 10.149
Datentypen lagen hinter Hash-Fragmenten, die Google nicht als eigene URLs
indexiert. Effektiv waren **zwei** URLs indexierbar.

Die Lösung: Der Build erzeugt **155 zusätzliche statische Seiten** — eine je
Sektor und eine je Organisationstyp. Sie entstehen aus denselben Sektordateien,
neue Datentypen erscheinen also automatisch.

Bewusst **keine Seite je Datentyp**: Eine Organisationsseite trägt rund 69
Datentypen und etwa 5.700 Wörter, eine Datentypseite hätte ~82 Wörter. Das wäre
dünner Inhalt, der der Domain schadet. Ergebnis: **157 indexierbare URLs statt
2**, dazu JSON-LD (`DataCatalog` mit den acht Sektoren als `Dataset`, jeweils
mit erreichbarer Distribution), eine crawler- und screenreader-lesbare
Sektorenübersicht und eine Sitemap.

## 6. Die Qualitätssicherung — der interessanteste Teil

Bei 10.149 Einträgen ist die eigentliche Schwierigkeit nicht das Erfassen,
sondern das **Verhindern von plausibel klingendem Unsinn**.

**Ein Validator** prüft bei jeder Änderung Schema, Vokabular, global eindeutige
Kennungen und Farbregeln. Ziel und Ist: **0 Warnungen, 0 Fehler**. Er läuft bei
jedem Pull Request.

**Ein Qualitätsbericht** misst darüber hinaus redaktionelle Schulden —
bewusst *nicht* als Warnungen, damit das „0 Warnungen"-Ziel erreichbar bleibt,
während die Schuld sichtbar wird:

- Öffnungsbegründungen unter fünf Wörtern
- mehrfach wortgleich verwendete Begründungstexte
- **Aussagen über die Veröffentlichungspraxis Dritter**
- Beschreibungen, die den eigenen Metadaten widersprechen

**Warum die dritte Kennzahl existiert:** Die Begründungen sollen sich gegenüber
Datenschutzbeauftragten und Gremien **zitieren** lassen. Ein Satz wie „wird
ohnehin schon veröffentlicht" ist dort keine Begründung, sondern eine
Behauptung, die der Gegenüber sofort prüfen kann — und die veraltet, sobald
sich die Praxis ändert. Solche Sätze werden gemessen und ersetzt.

**Ein Regelwerk** (eine einzige Quelldatei, geteilt zwischen Browser-Werkzeug
und Stapelgenerator) gibt vor, wie eine Begründung auszusehen hat: nur auf die
Angaben des Eintrags stützen, keine Paragrafen erfinden, keine Praxisaussagen
über Dritte, stattdessen den sachlichen Mechanismus benennen — aggregiert oder
Einzelfall, Personenbezug vorhanden oder aufgelöst, Pflicht oder Ermessen.

**Die Sicherheitsventile sind der Kern.** Reichen die Angaben nicht aus oder
widersprechen sie sich, ist die vorgeschriebene Antwort: *alten Text
unverändert zurückgeben*. Das ist ausdrücklich ein gültiges Ergebnis. In der
Praxis war es das **wertvollste**: Die Verweigerungen haben Einträge
aufgedeckt, deren Objekttyp der eigenen Beschreibung widersprach — Fehler, die
eine blind generierende Pipeline mit einer plausiblen Begründung zugedeckt
hätte.

Beim Übernehmen prüft ein Werkzeug **vor dem ersten Schreibzugriff, alles oder
nichts**: Länge, Regelkonformität und vor allem, dass **jede Rechtsfundstelle
im neuen Text bereits in der Beschreibung des Eintrags vorkommt**. Ein
erfundener Paragraf lässt den Lauf scheitern, statt in die Daten zu geraten.

Das ist die Haltung, die den Artikel trägt: **Ein knapper richtiger Satz ist
besser als ein unbelegter Absatz, der überzeugend klingt.**

## 7. Was der Atlas *nicht* ist

Diese Grenzen gehören in den Artikel — sie machen ihn glaubwürdig:

- **Kein Datenkatalog, kein Downloadportal.** Er verzeichnet Daten*typen*, nicht einzelne Datensätze. Für tatsächlich verfügbare Daten sind GovData, Landesportale und Fachrepositorien die richtigen Anlaufstellen.
- **Kein Verzeichnis geprüfter Bestände einer konkreten Organisation.** Er modelliert, was bei einem Organisations*typ* typischerweise anfällt. Ob ein bestimmtes Amt einen bestimmten Datensatz führt, muss vor Ort geprüft werden.
- **Keine Rechtsberatung.** Die Öffnungsklassen sind fachlich begründete Einschätzungen, keine rechtsverbindlichen Feststellungen.
- **Die Zeitangaben sind illustrativ.** Verfügbarkeitsjahre und Rhythmen bilden plausible Größenordnungen ab, sie sind nicht je Datentyp recherchiert.

Kurz: ein **Orientierungs-, Argumentations- und Planungswerkzeug**. Es ersetzt
keine Inventur, keine Rechtsprüfung und kein Datenportal — es macht sie
zielgerichteter.

---

## Vorgaben für den Artikel

- **Sprache:** Deutsch. Sachlich, konkret, ohne Marketingfloskeln. Keine
  Ausrufezeichen, kein „revolutionär", kein „einzigartig".
- **Länge:** 1.200–1.800 Wörter.
- **Aufbau:** frei, aber die Öffnungsverteilung (68,1 / 28,5 / 3,4) sollte
  früh kommen — sie ist der Grund, warum das Projekt existiert. Die Grenzen
  aus Abschnitt 7 gehören hinein, nicht ans Ende versteckt.
- **Zielgruppe:** Menschen aus Verwaltung, Zivilgesellschaft, Datenjournalismus
  und Open-Data-Community. Technisch interessiert, aber nicht zwingend
  Entwickler — technische Details brauchen also einen Satz, der erklärt,
  *warum* sie zählen.
- **Zahlen:** deutsche Schreibweise (10.149, 68,1 %).
- **Was du weglassen sollst:** Nutzerzahlen, Erfolgsmeldungen, Roadmap-
  Versprechen, Vergleiche mit benannten anderen Projekten.

Nenne am Ende die URL **datenatlas.de** und den Hinweis, dass der Quellcode
unter MPL-2.0 auf GitHub liegt.

---

*Stand der Zahlen: aus dem Datenbestand berechnet, 10.149 Datentypen.*
