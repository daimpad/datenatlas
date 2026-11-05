# Quellenprüfung — Vorgehen und Kalibrierung

Ziel: Jeder Datentyp bekommt mindestens eine **nachprüfbare** Quelle der
passenden Art, und keine Angabe im Atlas trägt den Status „Mit Quelle“, die
eine Maschine nicht auf der Quellseite wiederfinden kann.

Dieses Dokument beschreibt das Vorgehen und belegt jede Entscheidung darin mit
einer Messung. Gemessen wurde am 5. November 2026 an den 16 Einträgen der
dritten Quellenprüfung, deren Befunde bekannt sind.

## Das Vorgehen

```
Stufe 0  Gruppieren                    Skript, kein Modell
Stufe 1  Zwei unabhängige Prüfläufe     Sonnet 5.5, je 5 Einträge, fester Prüfbogen
Stufe 2  Maschinelle Prüfung            Zitatabgleich + Feldvergleich der beiden Läufe
Stufe 3  Übernahme                      einig → automatisch · uneinig → Prüfung am Beleg
Stufe 4  Pull Requests                  quellen-auto (Auto-Merge) · quellen-review
```

**Stufe 0 — Gruppieren.** Viele Einträge meinen dieselbe Statistik: 13 Einträge
zu Kirchenaustritten allein im evangelischen Bereich, 16 zu IVW-Auflagen.
`scripts/quellenpruefung/gruppieren.mjs` findet unter den 10.393 Einträgen ohne
Quelle 1.233 mit benannter Stelle, verteilt auf 489 Gruppen aus Herausgeber und
Aktivität (Ø 2,5; 46 Gruppen mit sechs oder mehr). „Benannte Stelle“ ist die
Tabelle `STELLEN` im Skript, nichts anderes — die frühere Schätzung (828 Einträge,
391 Gruppen) stammte aus einem Verfahren, das nicht im Repository liegt, und
ist damit nicht vergleichbar. Das Skript baut auch die Eingabedateien für den
Prüfauftrag. Recherchiert wird je Gruppe; Lizenz und Nutzungsbedingungen je
Herausgeber nur einmal.

**Stufe 1 — Zwei Prüfläufe.** Jeder Lauf arbeitet nach
`scripts/quellenpruefung/pruefauftrag.md`: fester Prüfbogen mit acht Feldern
(Herausgeber, Inhalt, Ebene, Rhythmus, Startjahr, Format, Lizenz,
Rechtsgrundlage), Codefelder als Vokabularcodes, jede Aussage mit wörtlichem
Zitat. Der Agententyp `.claude/agents/quellenpruefer.md` legt Modell und
Werkzeuge fest. Die beiden Läufe wissen nichts voneinander.

**Stufe 2 — Maschinelle Prüfung.**
`scripts/quellenpruefung/zitate-pruefen.mjs` sucht jedes Zitat auf seiner
Quellseite; ein nicht gefundenes Zitat macht den Befund wertlos.
`scripts/quellenpruefung/feldvergleich.mjs` vergleicht die beiden Läufe Feld für
Feld ohne Referenz und teilt jedes Feld nach Stufe 3 ein; `kalibrierung/uebereinstimmung.mjs`
macht dasselbe gegen eine Referenz (beide nutzen `felder.mjs`).

**Stufe 3 — Übernahme.**

| Automatisch (`quellen-auto`) | Prüfung am Beleg (`quellen-review`) |
|---|---|
| Codefeld in beiden Läufen belegt, gleicher Wert, Zitate gefunden | Läufe uneinig, oder nur einer hat einen Wert |
| Quellen, deren Zitate gefunden wurden | Öffnungsklasse ändert sich |
| | Datensatz existiert laut einem Lauf nicht |
| | neue Begründung, Umbenennung, neuer Vokabularcode |
| | Lizenzbeleg stammt von einer anderen Domain als die Hauptquelle |

Wie `feldvergleich.mjs` die Tabelle umsetzt, wo sie Spielraum ließ:

- **Textfelder** (Herausgeber, Inhalt, Rechtsgrundlage): automatisch nur, wenn
  beide Läufe „belegt“ sagen; ein korrigiertes Textfeld geht an den Beleg, wird dort
  aber nicht einzeln entschieden, sondern fließt in die neue Beschreibung.
- **Quellen** gehen automatisch durch, wenn auf ihrer Seite ein Zitat des
  nennenden Laufs wiedergefunden wurde — auch wenn nur ein Lauf sie nennt. Eine
  Pflicht zur Doppelnennung würde fast jede Quelle zur Prüfung schicken: die Läufe
  wählen oft verschiedene Dokumente derselben Stelle.
- **Neue Beschreibungen gehen immer an den Beleg.** Der Check, der sie
  automatisch freigeben könnte, ist weiterhin nicht gebaut. Gebaut ist ein
  Hinweis: Zahlen, Jahre und Paragraphen der Beschreibung, die in keinem
  wiedergefundenen Zitat des Laufs stehen. Er ist schwach (siehe Runde 1).
- **Öffnungsklasse** ist kein Feld des Prüfbogens. Der Vergleich prüft stattdessen,
  ob ein geänderter Lizenzwert zur Klasse der Eingabe passt (frei bei „Nur
  Metadaten“, nicht frei bei „Sofort publizierbar“).

**Stufe 4** wie im Konzept: ein Auto-PR je Runde, der bei grüner CI selbst
mergt, ein Review-PR für den Rest, nie zwei Runden gleichzeitig offen.

### Drei Quellenarten

| Art | belegt | Beispiel |
|---|---|---|
| `statistik` | die Daten werden so veröffentlicht | SurvStat beim RKI |
| `rechtsgrundlage` | eine Norm verpflichtet zur Erhebung oder Führung | § 2 BMG: „Die Meldebehörden führen … Melderegister.“ |
| `beispiel` | eine Organisation dieses Typs veröffentlicht solche Daten | Datensatz einer Stadt |

Die Rechtsgrundlage macht das Ziel erst für den ganzen Bestand erreichbar:
Rund 9.600 Einträge sind allgemeine Datentypen ohne einzelnen veröffentlichten
Datensatz. Eine Rechtsgrundlage belegt, dass die Daten entstehen — nicht, dass
sie veröffentlicht werden; die Sidebar muss das unterscheiden (noch offen).

## Kalibrierung

Die 16 Einträge der dritten Runde, in ihrer **ursprünglichen, fehlerhaften
Fassung**, wurden zweimal unabhängig von Sonnet 5.5 nach dem Prüfauftrag
geprüft (Fassung aus Commit 72947a9). Referenz sind die geprüften Befunde der
dritten Runde (`kalibrierung/runde3-referenz.json`). Jeder Lauf hat
nachweislich nur den Auftrag und seine Eingabedatei gelesen — nichts aus dem
Repository, keine alten Ergebnisse, nicht datenatlas.de; das ist aus den
Protokollen der Läufe geprüft.

| | Opus 5.5 (Runde 3) | Sonnet Lauf 1 | Sonnet Lauf 2 | beide zusammen |
|---|---|---|---|---|
| Kosten | 15,61 $ | 7,56 $ | 7,49 $ | **15,05 $** |
| Anfragen | 238 | 154 | 143 | 297 |
| Zitate wiedergefunden | 160 / 160 | 215 / 215 | 226 / 226 | — |
| Codefelder richtig (von 47) | Referenz | 37 | 40 | siehe unten |
| Kernbefunde gefunden (von 21) | Referenz | 17 | 16 | **19** |
| Praxisaussagen in Begründungen (von 11) | 11 | 11 | 11 | — |

**Das zentrale Ergebnis — Übereinstimmung als Freigabe:**

| beide Läufe … | Feldpaare | davon richtig |
|---|---|---|
| einig | 37 | 36 |
| uneinig | 6 | in allen 6 lag mindestens ein Lauf falsch |
| nur einer mit Wert | 5 | — |

Der eine „einig, aber falsch“-Fall ist das Startjahr des Kulturfinanzberichts
(beide 2005, Referenz 2001 = erste Ausgabe) — eher eine Definitionsfrage.
Uneinigkeit hat in dieser Stichprobe jeden Fehler angezeigt.

**Auch die Referenz hatte Fehler**, und die zwei Läufe haben sie gefunden:

- Breitbandatlas: Runde 3 setzte „eigene Nutzungsbedingungen“; das Impressum
  stellt die Downloads unter die Datenlizenz Deutschland. Live korrigiert
  (`scripts/datafix-quellen-kalibrierung.mjs`).
- Grundsicherung: „nur bis Kreisebene“ war zu eng — der Qualitätsbericht der
  BA nennt auch Gemeinden.

Ein einzelner Lauf, egal welches Modell, hat also Fehler, die nur ein zweiter,
unabhängiger Lauf sichtbar macht.

**Was die Maschine nicht erkennt.** Ein Lauf belegte die Lizenz der
DSA-Transparenzberichte mit der Lizenzseite der DSA-Datenbank für
Einzelbegründungen — echtes Zitat, falscher Gegenstand. Der Zitatabgleich
kann das nicht sehen; die Uneinigkeit der Läufe schon (der zweite Lauf
erkannte, dass das Portal nicht die Berichte enthält).

### Pilot: Rechtsgrundlage für allgemeine Datentypen

Sechs allgemeine Datentypen ohne einzelnen Datensatz (Melderegister,
Gewerbeanzeigen, Vereinsregister, Kirchenaustritte, Jahresabschlüsse,
Schulpflichtkontrolle), ein Sonnet-Lauf, 2,76 $:

- Alle 6 mit belegter Rechtsgrundlage für das Entstehen der Daten: vier aus
  Bundesrecht mit Zitat aus dem Gesetzestext (BMG, GewO, HGB, BGB), zwei aus
  Landesrecht mit Beispielen aus NRW und Bayern. Zwei Einschränkungen: Bei den
  Kirchenaustritten belegt die Norm den Austritt, nicht seine Zählung; bei der
  Schulpflicht stützt sich der Beleg auf einen Runderlass, der § 41 SchulG NRW
  zitiert, nicht auf den Gesetzestext.
- 80 von 80 Zitaten wiedergefunden.
- Ein Fehler: Nutzungsbedingungen als Quelle vom Typ `statistik`.
- Bei der Schulpflichtkontrolle belegt: Die Daten werden in NRW nicht zentral
  erhoben — ein richtiges „nicht belegbar“.

## Modellwahl

| Aufgabe | Modell | Grund |
|---|---|---|
| Prüfläufe | **Sonnet 5.5** | gemessen: gleiche Zitatgenauigkeit, halbe Kosten je Lauf, Fehlersignal durch Zweitlauf |
| Entscheidung bei Uneinigkeit | Opus 5.5 oder Mensch | Abwägen am Beleg; Runde 1: 5,87 $ für 20 Einträge, 81 Entscheidungen |
| Fable 5.1 | nicht nötig | — |
| Haiku 5.5 | nicht getestet | Kandidat für Gruppierung |

**Kosten verstehen.** Ein Agent liest bei jedem Schritt seinen ganzen Verlauf
neu. Cache-Lesen machte bei Sonnet 57 %, bei Opus 50 % der Kosten aus — und
kostet bei Opus 5.5 und Sonnet 5.5 gleich viel (0,20 $ je Mio. Tokens). Der
größte Hebel ist deshalb die Zahl der Schritte, nicht das Modell: Mit dem
festen Prüfbogen brauchte Sonnet 154 statt 238 Anfragen. Der zweite Hebel ist
der Startkontext (78.000 Tokens beim allgemeinen Agenten); der Agententyp mit
nur fünf Werkzeugen hat ihn auf 27.600 verkleinert (Runde 1).

**Hochrechnung.** Runde 1 kostete 1,07 $ je Eintrag (zwei Läufe 0,78 $, Opus am Beleg
0,29 $); die Kalibrierung hatte für zwei Läufe 0,94 $ gemessen. Für die 1.233 Einträge
mit benannter Stelle wären das rund 1.300 $. Ob die Gruppierung das senkt, zeigt Runde 1
nicht: Jede Runde bestand aus einer Gruppe, eine Vergleichsrunde mit denselben Einträgen
ohne Gruppierung gab es nicht. Für die allgemeinen Datentypen ist die Gruppierung nach
Rechtsgrundlage nicht gemessen; eine Hochrechnung wäre geraten.

## Erste Produktionsrunde (5. November 2026)

20 Einträge aus drei Gruppen — KBA-Zulassungen (10, zwei Runden), IVW-Auflagen (5),
EKD-Mitgliedschaft (5) —, je Runde zwei unabhängige Sonnet-Läufe mit dem Agententyp
`quellenpruefer`, dann Zitatabgleich, `feldvergleich.mjs`, und Opus 5.5 am Beleg
(`entscheidungsauftrag.md`). Alles liegt in `scripts/quellenpruefung/runden/1/`; die
Daten in `public/data/` sind **nicht** angefasst, es gibt noch keinen Übernahmeschritt.

| | Läufe A (4) | Läufe B (4) | Opus am Beleg |
|---|---|---|---|
| Kosten | 8,23 $ | 7,38 $ | 5,87 $ |
| Anfragen | 193 | 189 | 86 |
| Zitate wiedergefunden | 333 / 336 | 326 / 326 | 263 / 263 |
| Dauer je Lauf | 9–15 Min. | 6–16 Min. | 18 Min. |

**Startkontext.** 27.645 Tokens beim Agententyp `quellenpruefer` (Opus: 27.893) statt
rund 78.000 beim allgemeinen Agenten. Die Zahl der Anfragen je Eintrag blieb gleich
(9,6 und 8,9 in den Kalibrierläufen, 9,5 hier); der Gewinn liegt allein im kleineren Sockel:
0,39 $ je Eintrag und Lauf statt 0,47 $ (−17 %).

**Einteilung nach Stufe 3.** Von 316 Feldern gehen 200 (63 %) automatisch durch, 116
gehen an den Beleg — 81 Entscheidungen und 35 Textfelder als Kontext. Bei den 100
Codefeldern (Startjahr, Rhythmus, Format, Lizenz, Ebene) sind es 80 automatisch.

**Uneinigkeit zeigt Fehler.** Bei den 15 strittigen Feldern (Startjahr, Format,
Rhythmus, Ebene, Existenz, Urteil) lag nach Opus in 14 genau ein Lauf falsch, in 1 stimmten
beide (zwei Bezugswege), in keinem beide falsch. Kalibrierung: 6 von 6.

**Was die Prüfung fand.** Kein Eintrag stimmte vollständig (39 von 40 Läuferurteilen
`korrigierbar`, eines `nicht_belegbar`). Von den einig gefundenen Werten wichen vom
Eintrag ab: Format 16 von 16, Startjahr 10 von 10, Rhythmus 11 von 19, Ebene 3 von 19,
Lizenz 1 von 12. Existenz: in 30 von 40 Läuferurteilen nur `teilweise`, einmal `nein`
(Altersgruppen bei EKD-Mitgliedern gibt es nicht). Bei IVW und EKD steht `LI_04`
statt CC BY 4.0: das ändert für 8 Einträge die Öffnungsklasse, und genau diese 8 hat der
Lizenz-Check an den Beleg geschickt (Opus bestätigte alle).

**Regeln 7–10 an neuem Material.**

| Regel | Befund |
|---|---|
| 7 Startjahr | 6 von 20 an den Beleg (5 uneinig, 1 nur ein Lauf; Kalibrierung 2 von 16). Beide Läufe wandten die Regel an, aber auf verschiedene Gegenstände: BEV-Spalte in FZ 10 ab 2017 gegen Berichtsjahre des Statistikportals ab 2020; Bestandsreihe ab 1960 gegen regionale Tabellen ab 2007. Regel 7 legt nicht fest, welches Produkt „der beschriebene Datensatz“ ist, wenn der Eintrag mehrere bündelt. Bei den vier IVW-Zeitreihen verzichteten beide Läufe auf ein Jahr, weil nur Teilseiten datiert waren — im Sinne der Regel |
| 8 Lizenzbeleg | 0 von 20 uneinig (Kalibrierung 2 von 16). Die zehn KBA-Werte `LI_03` stützen sich auf den Lizenzvermerk der Excel-Dateien selbst. Lücke: Gibt es nur ein allgemeines Impressum (EKD), sagt die Regel nicht, ob `LI_04` oder „nicht belegt“ gilt; beide Läufe nahmen `LI_04`, ein Lauf nannte den Beleg selbst „schwach“. Der Eintrag zur Kirchensteuer ging so automatisch durch, weil seine Klasse „Nach Aufbereitung“ den Check nicht auslöst |
| 9 Format | 4 von 20 strittig (Kalibrierung 3 von 16), jedes Mal um einen weiteren Bezugsweg: zweimal das Statistikportal des KBA mit CSV/JSON/GeoJSON-Export, zweimal ältere PDF-Ausgaben neben XLSX. In allen vier nahm Opus den weiteren Weg auf (Regel 9). Ob die zwei einigen FZ-10-Einträge das Portal übersehen haben, ist nicht geprüft |
| 10 Quellentyp | 0 von 77 `statistik`-Quellen sind Nutzungsbedingungen (Pilot: 1). Zwei Randfälle: die agma-Nutzungsrichtlinien als `beispiel` (Opus verwarf sie) und ein IVW-Regelwerk als `rechtsgrundlage` |
| 1 und 6 | `datenatlas.de` öffnete keiner der acht Läufe; keiner las fremde Dateien oder Dateien eines anderen Laufs. Vier schrieben Hilfsskripte außerhalb ihres Arbeitsverzeichnisses (im Scratchpad, nicht im Repository), obwohl Regel 6 nur Ausgabe und Downloads erlaubt |

**Was die Maschine nicht erkannte.**

- Drei Zitate fehlten, weil der Lauf die KBA-Excel-Datei ohne `?__blob=publicationFile`
  angab; die URL liefert eine HTML-Seite. Das Zitat steht im Dokument, aber nicht unter
  der genannten Adresse — ein echter Befund, kein Fehler des Abgleichs. Zwei weitere
  fehlten nur, weil `pdftotext` Tabellenzeilen zellenweise liest; `zitate-pruefen.mjs`
  sucht PDFs jetzt auch im Zeilenmodus.
- 17 der 20 Öffnungsbegründungen enthalten nach beiden Läufen eine Praxisaussage
  („KBA veröffentlicht …“); `claimsThirdPartyPractice()` trifft keine davon. Das ist die
  bekannte Lücke in Regel 3 (Abkürzung als Subjekt), hier an einer Stichprobe, die wegen der
  benannten Stellen genau diese Fälle bevorzugt.
- Quellen: 11 von 19 Quellen, die der Vergleich wegen eines fehlenden Zitats auf ihrer
  Seite an den Beleg schickte, nahm Opus alle auf; insgesamt wurden 17 von 19 aufgenommen,
  2 verworfen. Die Prüfung kostet hier mehr, als sie findet.
- Der Zahlenhinweis zur Beschreibung markierte 10 Zahlen; 8 davon stehen in Opus' Fassung
  mit Beleg. Er ist ein schlechter Filter.

## Grenzen dieser Messung

- 16 Einträge plus 6 im Pilot plus 20 in Runde 1 — Stichproben, keine Statistik.
  Runde 1 deckt drei Herausgeber ab, alle mit Excel- oder PDF-Veröffentlichungen.
- „Einig, aber falsch“ ist in Runde 1 nicht gemessen: Opus sah nur die strittigen
  Felder. Die 80 einigen Codefelder sind nur durch gefundene Zitate gedeckt.
- Die Referenz der Kalibrierung stammt aus einem einzigen Opus-Lauf; zwei ihrer
  Befunde waren nachweislich falsch oder zu eng und sind korrigiert (`_korrekturen`
  in der Referenzdatei).
- Die Entscheidung am Beleg ist ein einzelner Opus-Lauf ohne Gegenlauf; sein Urteil
  „genau ein Lauf falsch“ ist nicht unabhängig bestätigt.
- Die Kosten sind aus Tokens gerechnet (Preise Stand 6.10.2026, Cache-Schreiben mit
  den üblichen Faktoren 1,25 und 2), keine Abrechnung. Die Tokens sind gemessen.
- Die Opus-Zahlen der Kalibrierung stammen aus Runde 3 mit dem alten, freieren
  Auftrag; wie viel der Ersparnis am Modell und wie viel am Prüfbogen liegt, ist
  nicht getrennt.

**Offen aus Runde 1:** Regel 7 braucht eine Aussage zu gebündelten Produkten; Regel 8
eine zum Fall „nur allgemeines Impressum“; Quellen-URLs sollen die Datei selbst liefern
(KBA: `?__blob=publicationFile`). Der Prüfauftrag ist dafür bewusst nicht geändert
worden, damit Runde 2 mit derselben Fassung vergleichbar bleibt.

## Werkzeuge

| Datei | Zweck |
|---|---|
| `scripts/quellenpruefung/pruefauftrag.md` | der Auftrag — einzige Fassung, alle Läufe lesen ihn |
| `scripts/quellenpruefung/entscheidungsauftrag.md` | Auftrag für die Entscheidung am Beleg |
| `scripts/quellenpruefung/gruppieren.mjs` | Stufe 0: Gruppen, Eingabedateien |
| `scripts/quellenpruefung/zitate-pruefen.mjs` | Zitatabgleich; jede Normalisierung darin hat einmal einen falschen Fehlschlag erzeugt |
| `scripts/quellenpruefung/feldvergleich.mjs` | zwei Läufe ohne Referenz, Einteilung nach Stufe 3, Beleg-Datei |
| `scripts/quellenpruefung/felder.mjs` | gemeinsame Feldlogik für beide Vergleiche |
| `scripts/quellenpruefung/kosten.mjs` | Kosten und Startkontext aus Agentenprotokollen |
| `scripts/quellenpruefung/kalibrierung/vergleich.mjs` | bewertet Läufe gegen eine Referenz |
| `scripts/quellenpruefung/kalibrierung/uebereinstimmung.mjs` | vergleicht zwei Läufe Feld für Feld gegen eine Referenz |
| `scripts/quellenpruefung/kalibrierung/laeufe/` | Eingaben und Ergebnisse der Kalibrierung |
| `scripts/quellenpruefung/runden/1/` | Runde 1: Eingaben, Läufe, Zitatabgleich, Feldvergleich, Entscheidung, Kosten |
| `.claude/agents/quellenpruefer.md` | Agententyp: Sonnet, fünf Werkzeuge |

```bash
NODE_USE_ENV_PROXY=1 node scripts/quellenpruefung/zitate-pruefen.mjs lauf.json --json zitate.json
node scripts/quellenpruefung/gruppieren.mjs --min 6                    # Gruppen
node scripts/quellenpruefung/gruppieren.mjs --eingabe id,id --out eingabe.json
node scripts/quellenpruefung/feldvergleich.mjs --a a.json --b b.json --za za.json --zb zb.json --eingabe eingabe.json --beleg beleg.json
node scripts/quellenpruefung/kosten.mjs a-1=protokoll.jsonl           # Protokolle: ~/.claude/projects/…/subagents/
```

`NODE_USE_ENV_PROXY=1` nur hinter einem Proxy (Node ≥ 22). Der Abgleich braucht
`pdftotext` und `unzip`.
