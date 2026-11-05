# Prüfauftrag: Datentypen gegen Primärquellen prüfen

<!-- Kalibriert mit der Fassung aus Commit 72947a9 (Regeln 1–6). Die Regeln
7–10 sind danach ergänzt, aus den Fehlern der Kalibrierung (Startjahr beim
KBA und Breitbandatlas, Lizenz bei DSA und KBA, Format bei den Häfen,
Quellentyp im Pilot). In Runde 1 (20 Einträge) gemessen; danach Regel 7 und 8 geschärft,
Regel 11 ergänzt und `beleg_art` im Prüfbogen eingeführt (Fassung ab Runde 2). Regel 7 ist
seit den Tests vom 5. November 2026 neu gefasst (aktuell abrufbare Reihe, Startjahr immer am Beleg). -->

Du prüfst Einträge des Datenatlas, eines Verzeichnisses der Datentypen, die
deutsche Organisationen erzeugen. Die Einträge sind **modelliert**, nicht aus
Quellen abgeschrieben. Erfahrungsgemäß stimmt kaum ein Eintrag vollständig:
Startjahr, Rhythmus, Format, Lizenz, Herausgeber oder Gesetz sind oft falsch,
und manchmal gibt es den beschriebenen Datensatz so gar nicht. Ziel ist nicht,
den Eintrag zu bestätigen, sondern festzustellen, was eine Primärquelle
**wörtlich** belegt. Ein „nicht gefunden“ oder ein Widerspruch ist ein ebenso
gutes Ergebnis wie eine Bestätigung.

## Regeln

1. **Primärquellen** sind Seiten und Dokumente des Herausgebers selbst
   (Behörde, Verband, Unternehmen), dazu Qualitäts- und Methodenberichte,
   Impressum und Nutzungsbedingungen. Gesetze: gesetze-im-internet.de oder das
   Landesportal; Bundestagsdrucksachen: dserver.bundestag.de; EU-Recht über
   Seiten der Kommission (EUR-Lex sperrt automatische Abrufe). Wikipedia,
   Presse und Blogs sind keine Belege, dürfen aber den Weg zeigen.
   **datenatlas.de ist der geprüfte Gegenstand und keine Quelle — nicht öffnen.**
2. **Zitate** stehen wörtlich auf der angegebenen Seite, Zeichen für Zeichen,
   höchstens etwa 25 Wörter, aus einem zusammenhängenden Absatz oder einer
   Tabellenzeile. Jedes Zitat wird danach maschinell auf der URL gesucht; ein
   nicht auffindbares Zitat macht den Befund wertlos. Nie aus dem Gedächtnis
   zitieren, nie paraphrasieren.
3. **Abruf** mit WebSearch und WebFetch. PDFs und XLSX, die WebFetch nicht
   lesen kann, lädst du in ein eigenes neues Verzeichnis im
   Arbeitsverzeichnis deines Auftrags:
   `curl -sL -A 'datenatlas-linkcheck (+https://datenatlas.de)' -o datei URL`,
   lesen mit `pdftotext` bzw. `unzip -p`. Keinen Browser-User-Agent vortäuschen,
   keine Bot-Sperre umgehen. Bei JavaScript-Seiten nach einer statischen
   Fassung suchen (Qualitätsbericht, PDF, Methodenbeschreibung).
4. **Gesetze**: den geltenden Stand prüfen — Fassung, Inkrafttreten,
   „(weggefallen)“. Ein Paragraph im Eintrag ist eine prüfbare Aussage wie
   jede andere.
5. **Lizenz** steht im Impressum, in den Nutzungsbedingungen oder in der
   Datensatzbeschreibung des Herausgebers. „Frei zugänglich“ oder „kostenlos“
   ist keine Lizenz.
6. **Nur lesen.** Außer diesem Auftrag und deiner Eingabedatei liest du keine
   lokalen Dateien, und du schreibst nur deine Ausgabedatei und Downloads —
   Hilfsskripte gehören ins Arbeitsverzeichnis deines Auftrags, nicht daneben.

7. **Startjahr** ist das erste Jahr der Zeitreihe, die der Herausgeber **heute** zum
   Gegenstand des Eintrags bereithält — in der aktuellen Ausgabe, dem aktuellen Portal
   oder der aktuellen Tabelle. Es zählt, was man heute in die Hand bekommt; Archive
   älterer Ausgaben suchst du nicht. (Mehrere Fassungen dieser Regel mit Rückwärtssuche
   haben in zwei Tests gerade deshalb abweichende Jahre ergeben.)
   a) *Gegenstand* ist die erste Kenngröße im Namen des Eintrags. Nennt der Name eine
      bestimmte Publikation oder Tabelle (Fachserie 16, FZ 10), gilt deren aktuelle Ausgabe.
   b) Nur Seiten des Herausgebers (Regel 1) und nur ausdrücklich genannte Zahlen im
      Text oder in einer Tabelle; ein aus einem Diagramm abgelesener Wert zählt nicht.
   c) *Nicht zählen*: Beginn der Erhebung, des Angebots oder des Portals („seit 1957“,
      „seit über 25 Jahren“), ein Jahrzehnt ohne Jahr, das Jahr eines Nachbarprodukts,
      das den Gegenstand nicht ausweist (Mikrodaten für „Ergebnisse“).
   d) Beginnen mehrere heutige Reihen zu verschiedenen Jahren (Gesamt- und Teilreihe,
      Gliederung nach Land oder Antrieb), steht in `wert` das früheste Jahr der Reihe,
      die den Gegenstand ausweist; jede weitere Reihe mit ihrem Jahr steht in `hinweis`.
   e) Ältere Ausgaben nennst du höchstens in `hinweis`, ohne sie zu suchen.
   f) Findest du keine Zahl: `nicht_gefunden` mit `gesucht`.
   Das Feld geht danach immer an die Entscheidung am Beleg (zwei Läufe stimmen bei
   Startjahren zu selten überein); belege es deshalb so, dass jemand anderes die Reihe
   auf der Seite nachschlagen kann.
8. **Lizenzbeleg** muss sich auf genau diese Daten oder ihr Datenportal
   beziehen. Gibt es mehrere Aussagen — allgemeiner Urheberrechtshinweis,
   Nutzungsbedingungen der Seite, Lizenz der Daten —, gilt die spezifischste
   für die Daten; die anderen in `hinweis`. Die Lizenzseite eines anderen
   Angebots (anderes Portal, andere Datenbank) belegt nichts. Im Feld `beleg_art`
   steht `daten`, wenn die Aussage genau diese Daten, Dateien oder ihr Datenportal
   nennt, und `seite`, wenn nur eine allgemeine Klausel der Website (Impressum,
   Urheberrechtshinweis) gilt. Eine bloße Urheberangabe („© …“) ohne Vorbehalt
   der Verwendung ist keine Lizenz: dann `nicht_gefunden`.
9. **Format**: alle Bezugswege prüfen — Statistischer Bericht, Datenbank
   (etwa GENESIS), Open-Data-Datei, Download-Bereich.
10. **Quellentyp `statistik`** nur für tatsächlich veröffentlichte Daten; eine
    Nutzungsbedingung oder ein Register ohne Auswertung ist keine Statistik.

11. **URLs** in Zitaten müssen beim Abruf die zitierte Datei oder Seite selbst
    liefern. Prüfe Downloads mit `curl -sI` auf den Content-Type: Liefert die
    URL HTML statt der Datei, nimm die URL mit dem Parameter, mit dem du die
    Datei tatsächlich geladen hast (bei kba.de `?__blob=publicationFile`).

## Prüfbogen

Für jeden Eintrag füllst du dieselben Felder. Jedes Feld ist ein Objekt:

```json
{
  "alt": "was der Eintrag behauptet (aus Beschreibung, Feldern oder Begründung)",
  "status": "belegt | korrigiert | nicht_gefunden | entfaellt",
  "wert": "der belegte Wert — auch bei „belegt“ ausfüllen; Codefelder als Code",
  "belege": [{ "zitat": "…", "url": "…" }],
  "gesucht": "nur bei nicht_gefunden: wonach und wo"
}
```

- `belegt`: die Quelle bestätigt `alt`. `korrigiert`: die Quelle zeigt einen
  anderen Wert. Beides nur mit mindestens einem Beleg.
- `entfaellt`: der Eintrag behauptet dazu nichts, und die Quelle sagt nichts.

| Feld | Inhalt |
|---|---|
| `herausgeber` | wer erhebt oder veröffentlicht (Text) |
| `inhalt` | was gezählt oder erfasst wird, Gliederungsmerkmale (Text) |
| `raeumliche_ebene` | tiefste Ausweisungsebene: `wert` als GR-Code, Erläuterung in `hinweis` |
| `rhythmus` | Erscheinungs- bzw. Aktualisierungsrhythmus der beschriebenen Daten: FQ-Code |
| `startjahr` | erstes verfügbares Jahr der beschriebenen Daten: Zahl |
| `format` | Liste von FT-Codes; Formate ohne Code in `hinweis` |
| `lizenz` | LI-Code; den Wortlaut der Bedingung als Beleg; zusätzlich `beleg_art`: `daten` oder `seite` |
| `rechtsgrundlage` | Norm, die Erhebung, Führung oder Veröffentlichung regelt, falls es eine gibt |

Außerdem je Eintrag:

- `weitere_aussagen`: übrige prüfbare Aussagen der Beschreibung (Zahlen,
  Namen, Paragraphen, Zeitangaben) — je `{ "aussage", "status", "wert",
  "belege", "gesucht" }`.
- `existenz`: `ja` | `teilweise` | `nein` — gibt es den beschriebenen
  Datensatz so? Mit `erlaeuterung`.
- `begruendung`: `{ "praxisaussage": …, "widerspruch": … }`.
  `praxisaussage` ist der Wortlaut aus der Öffnungsbegründung, der behauptet,
  dass eine Organisation etwas bereits veröffentlicht oder nicht
  veröffentlicht („X veröffentlicht …“, „ist öffentlich verfügbar“, „bereits
  als Open Data“, „nach dem Vorbild von …“), sonst `null` — solche Aussagen
  sind im Atlas verboten, auch wenn sie stimmen. `widerspruch`: was in der
  Begründung den belegten Fakten widerspricht, sonst `null`.
- `urteil`: `stimmt` | `korrigierbar` | `nicht_belegbar`.
- `beschreibung_neu`: nur bei `korrigierbar` — zwei bis drei Sätze, die
  ausschließlich Belegtes enthalten. Keine neuen unbelegten Details.
- `quellen`: die Quellen, die der Eintrag künftig tragen soll —
  `[{ "typ", "title", "publisher", "url", "supports" }]` mit `typ`
  - `statistik`: die beschriebenen Daten werden so veröffentlicht
  - `rechtsgrundlage`: eine Norm verpflichtet zur Erhebung oder Führung
  - `beispiel`: eine Organisation dieses Typs veröffentlicht solche Daten
  und `supports` als knappe Angabe, welche Aussage die Quelle stützt.

## Codes

- **FQ** (Rhythmus): `FQ_01` Echtzeit · `FQ_02` täglich · `FQ_06` wöchentlich ·
  `FQ_03` monatlich · `FQ_08` vierteljährlich · `FQ_07` halbjährlich ·
  `FQ_04` jährlich · `FQ_09` zweijährlich · `FQ_05` unregelmäßig
- **FT** (Format): `FT_01` CSV · `FT_02` JSON · `FT_03` NetCDF/HDF5 · `FT_04` XML ·
  `FT_05` GeoJSON · `FT_06` Shapefile · `FT_07` PDF · `FT_08` Excel (XLSX)
- **LI** (Lizenz): `LI_01` CC0 · `LI_02` CC BY 4.0 · `LI_03` Datenlizenz
  Deutschland · `LI_04` proprietär/restriktiv · `LI_05` eigene
  Nutzungsbedingungen (frei, etwa mit Quellenangabe)
- **GR** (Ebene): `GR_01` Einzelereignis/Rohdaten · `GR_02` aggregiert
  (Bund, Land) · `GR_03` kleinräumig (Kreis, Gemeinde, Stadtteil) ·
  `GR_04` personenbezogene Mikrodaten

## Vorgehen

1. Alle Einträge der Eingabe lesen und je Eintrag die prüfbaren Aussagen notieren.
2. Je Eintrag zuerst die zentrale Primärquelle suchen — meist belegt ein
   Dokument (Themenseite, Qualitätsbericht) mehrere Felder auf einmal.
3. Die Lizenz eines Herausgebers einmal klären und für seine weiteren Einträge
   wiederverwenden.
4. Ist ein Feld nach zwei gezielten Suchen nicht belegbar: `nicht_gefunden`
   mit `gesucht`, und weiter.
5. Vor dem Schreiben jedes Zitat noch einmal gegen den abgerufenen Text halten.

## Ausgabe

Eine JSON-Datei (Pfad steht in deinem Auftrag), ein Objekt je Eintrags-id.
Als Antwort genügen höchstens fünf Zeilen.
