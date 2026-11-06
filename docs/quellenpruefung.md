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
  wählen oft verschiedene Dokumente derselben Stelle. Angehängt wird sie aber erst
  zusammen mit der neuen Beschreibung des Eintrags: „Mit Quelle“ sagt, dass die
  Aussagen des Eintrags nachgelesen sind, und die alte Beschreibung ist es nicht.
  Quellen vom Typ `rechtsgrundlage` und `beispiel` sowie Seiten, die nach Nutzungs-
  bedingung oder Preisliste aussehen, schreibt `uebernehmen.mjs` nie selbst (die Sidebar kann
  Rechtsgrundlagen noch nicht von Veröffentlichungen unterscheiden).
- **Neue Beschreibungen gehen immer an den Beleg.** Der Check, der sie
  automatisch freigeben könnte, ist weiterhin nicht gebaut. Gebaut ist ein
  Hinweis: Zahlen, Jahre und Paragraphen der Beschreibung, die in keinem
  wiedergefundenen Zitat des Laufs stehen. Er ist schwach (siehe Runde 1).
- **Startjahre** gehen immer an den Beleg, auch wenn beide Läufe dasselbe Jahr nennen; nur wenn beide kein Jahr
  fanden, bleibt der Eintrag, wie er ist.
- **Öffnungsklasse** ist kein Feld des Prüfbogens. Der Vergleich prüft stattdessen,
  ob ein geänderter Lizenzwert zur Klasse der Eingabe passt (frei bei „Nur
  Metadaten“, nicht frei bei „Sofort publizierbar“).

**Übernahme.** `uebernehmen.mjs <Runde> --modus auto|review [--schreiben]` schreibt das
Ergebnis in die Sektordateien, ohne `--schreiben` nur als Vorschau. `auto` übernimmt die
automatisch eingeteilten Codefelder (Startjahr, Rhythmus, Format, Lizenz, Ebene).
`review` übernimmt die Entscheidungen am Beleg: neue Beschreibung, entschiedene Felder,
Quellen. Steht ein Eintrag danach auf `LI_04` bei Klasse `OP_01`, wird die Klasse
`OP_02` (wie bei AGF und Media Control); die Begründung dazu wird einzeln geschrieben. Die Öffnungsbegründung schreibt das Skript nie;
sie geht einzeln durch `apply-begruendungen.mjs` und dessen Regelprüfung.

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
0,29 $), Runde 2 1,16 $ (0,89 $ und 0,27 $); die Kalibrierung hatte für zwei Läufe 0,94 $
gemessen. Für die 1.233 Einträge mit benannter Stelle wären das rund 1.300 bis 1.400 $. Ob die Gruppierung das senkt, zeigt Runde 1
nicht: Jede Runde bestand aus einer Gruppe, eine Vergleichsrunde mit denselben Einträgen
ohne Gruppierung gab es nicht. Für die allgemeinen Datentypen ist die Gruppierung nach
Rechtsgrundlage nicht gemessen; eine Hochrechnung wäre geraten.

## Erste Produktionsrunde (5. November 2026)

20 Einträge aus drei Gruppen — KBA-Zulassungen (10, zwei Runden), IVW-Auflagen (5),
EKD-Mitgliedschaft (5) —, je Runde zwei unabhängige Sonnet-Läufe mit dem Agententyp
`quellenpruefer`, dann Zitatabgleich, `feldvergleich.mjs`, und Opus 5.5 am Beleg
(`entscheidungsauftrag.md`). Alles liegt in `scripts/quellenpruefung/runden/1/`. Übernommen
wurde in zwei PRs mit `uebernehmen.mjs`: erst die Codefelder, bei denen beide Läufe einig waren
(41 Änderungen an 18 Einträgen), dann Beschreibung, Quellen, Klasse und Begründung (20 Einträge;
55 von 10.428 Datentypen haben jetzt eine geprüfte Quelle).

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

## Test einer neuen Regel 7 (5. November 2026, nicht übernommen)

Die 15 Einträge, deren Startjahr in Runde 1 und 2 strittig war, mit einer neuen Fassung von Regel 7
(Gegenstand = erste Kenngröße im Namen; Rückwärtssuche in älteren Ausgaben und Archiven;
Beginn von Erhebung oder Angebot zählt nicht; früheste gefundene Zahl, sonst `nicht_gefunden`).
Zwei Sonnet-Läufe je Eintrag, nur Startjahr, ursprüngliche Eingaben. Kosten 12,51 $ (363 Anfragen;
die Schätzung vorab lag bei 3 $ und war falsch — die Rückwärtssuche ist teuer). Zitate 67 von 67
wiedergefunden. Maßstab war: mindestens 12 von 15 einig und mit Opus' Urteil vereinbar.

**Ergebnis: durchgefallen.** 9 von 15 einig, aber nur 4 davon gleich Opus' Urteil (BVMI-Streaming 2008,
DFG-Bewilligungen 1991, Pkw-Bestand 1960, Streaming-Charts 2012). Vier einige Werte weichen ab, sechs Einträge
bleiben uneinig.

| Fehlerart | Beispiele |
|---|---|
| Rückwärtssuche läuft aus dem Ruder: Bibliothekskopien, Sekundärdatensätze, verknüpfte Reihen | Verdienste 1913 (beide Läufe; Indexreihe mit dem Statistischen Reichsamt), Halterstruktur 1968 (Statistisches Jahrbuch 1969 aus einer Bibliothek), GEPRIS 1921 (Zenodo-Analysedatensatz), Kirchensteuer 1973 |
| Zahl aus einem Diagramm abgelesen | Förderquoten 1991, DFG-Quote 1982 |
| Gliederungen verschieben das Jahr nicht: Das Ergebnis beantwortet nicht, ab wann der beschriebene Datensatz vorliegt | Elektro-Neuzulassungen 1975 (43 Pkw) bzw. 2006, obwohl der Eintrag monatliche Zahlen je Marke und Modellreihe beschreibt (Opus: 2017) |
| Gegenstand „Ergebnisse“ gegen Mikrodaten | Mikrozensus 1957 (Fachserie, mit Zahlen) statt 1973 (Forschungsdatenzentrum) — hier ist die neue Fassung plausibler als Opus |

Der Teil der Regel, der den Gegenstand festlegt, hat geholfen (9 einig, Runde 2: 11 von 20 an den Beleg). Das Risiko liegt in der
Rückwärtssuche: Sie belohnt jede Fundstelle, auch eine, die der Herausgeber nie als seine Reihe geführt hat.
Prüfauftrag und Entscheidungsauftrag bleiben in der Fassung von Runde 2.

**Dritte Fassung (derselbe Aufbau, 16,12 $, 413 Anfragen).** Sie schloss die Fehlerarten des ersten Tests aus:
nur Quellen des Herausgebers (keine Bibliothekskopien, Zenodo, Drittjahrbücher), keine aus Diagrammen abgelesenen oder
rückwirkend verknüpften Zahlen, begrenzte Rückwärtssuche (Abbruch nach zwei älteren Ausgaben ohne frühere Zahl), die
Hauptgliederung des ersten Beschreibungssatzes gehört zum Datensatz. Zitate 71 von 72 (ein GEPRIS-Zitat stammte aus
einem Suchtreffer, nicht von der angegebenen URL).

**Ergebnis: schlechter als die zweite Fassung.** 5 von 15 einig (vorher 9), davon 3 gleich Opus (vorher 4; zählt man
„beide nicht gefunden“ bei IVW als Übereinstimmung mit Opus' `offen`). Die Läufe weichen jetzt dort ab, wo die Regel
Auslegung verlangt:

| Auslegungsfrage | Beispiele (A / B) |
|---|---|
| Was ist die Hauptgliederung? | Pkw-Bestand 2010 / 1960; Halterstruktur 2009 / 2018 |
| Was ist ein „Archiv des Herausgebers“? | Statistische Bibliothek wird von einem Lauf mitgezählt (Mikrozensus 1957) |
| Was ist „die heutige Methode“? | Verdienste 1977 / 2007 |
| Zählt ein Wert, den nur eine Diagrammbeschriftung nennt? | Förderquoten 2004 / 1997, DFG-Quote 1998 / 1997 |
| Welche Kenngröße der Name zuerst nennt | Streaming-Umsätze 2009 (Anteile) / 2008 (Euro) |

Zwei Tests mit je sechs Läufen (zusammen 28,63 $) zeigen: Je mehr die Regel festlegt, desto mehr Auslegung stecken die
Läufe hinein, und jede Auslegung ist eine neue Quelle der Uneinigkeit. Der Text der Regel ist nicht der Hebel.

**Folgerung, umgesetzt (5. November 2026):** Startjahre hängen nicht mehr von der Einigkeit zweier Läufe ab, sondern gehen
immer an den Beleg (`feldvergleich.mjs`). Die Bedeutung des Feldes folgt dem Prinzip, das der Atlas bei der Granularität schon
hat — es zählt, was man in die Hand bekommt: Startjahr ist das erste Jahr der **aktuell abrufbaren** Reihe beim Herausgeber,
ohne Archivsuche (Regel 7 im Prüfauftrag, Startjahr-Absatz im Entscheidungsauftrag). Eine dritte Gegenprobe mit Sonnet gab es
nicht; die Definition wurde nicht getestet, sondern aus den Ursachen der Uneinigkeit abgeleitet. Folge an der Kalibrierung:
Von den 16 Startjahren gehen 10 richtige zusätzlich an den Beleg (36 → 26 automatisch richtige Felder, das eine falsche entfällt);
in Runde 2 wären 18 von 20 Startjahren am Beleg gelandet. Bereits übernommene Startjahre (Runde 1 und 2) folgen noch der alten
Regel; ob sie unter der neuen Definition abweichen (Pkw-Bestand 1960, Mikrozensus 1973), ist nicht geprüft.

## Grenzen dieser Messung

- 16 Einträge plus 6 im Pilot plus 2 × 20 in den Produktionsrunden — Stichproben, keine Statistik.
  Sieben Herausgeber, durchweg mit Excel-, PDF- oder Webtabellen.
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

**Offen aus Runde 1** (Regel 7, Regel 8, URL-Form) ist in der Fassung des Prüfauftrags ab
Runde 2 bearbeitet; die Messung steht unten.

## Zweite Produktionsrunde (5. November 2026)

20 Einträge aus vier Gruppen — BVMI-Tonträgermarkt, DFG-Projektförderung, Destatis-
Statistikproduktion, ZDH-Handwerk (je 5) —, derselbe Ablauf wie Runde 1, aber mit dem
geschärften Prüfauftrag (Regeln 6, 7, 8, 11, Feld `beleg_art`). Übernommen in zwei PRs:
29 Codefelder an 13 Einträgen, dann Beschreibung, Quellen, Klassen und Begründungen
(19 Einträge, 74 von 10.428 mit geprüfter Quelle). Ein Eintrag blieb unverändert: Beide
Läufe verneinten die BVMI-Exportstatistik, es gibt keinen Datensatz, für den man Lizenz
und Klasse setzen könnte.

| | Läufe A (4) | Läufe B (4) | Opus am Beleg |
|---|---|---|---|
| Kosten | 8,20 $ | 9,55 $ | 5,44 $ |
| Anfragen | 194 | 224 | 84 |
| Zitate wiedergefunden | 289 / 289 | 335 / 335 | 199 / 199 |

Startkontext 28.110 Tokens (Runde 1: 27.645; mein Auftrag war etwas länger). Von 315 Feldern
gehen 200 automatisch durch, 115 an den Beleg (76 Entscheidungen).

**Uneinigkeit zeigt Fehler.** Bei den 19 uneinigen Codefeldern lag in 15 genau ein Lauf
falsch, in 2 beide, in 2 stimmten beide (zwei Bezugswege). Runde 1: 14 von 15, Kalibrierung 6 von 6.

**Die Regeländerungen aus Runde 1 an neuem Material.**

| Regel | Befund |
|---|---|
| 7 Startjahr (Name des Eintrags) | Hat nicht geholfen: 9 von 20 an den Beleg (Runde 1: 6 von 20), Opus ließ 3 offen. Die Läufe lasen „der Gegenstand, den der Name nennt“ verschieden (GEPRIS-Start online gegen erste Daten; Quoten ab 2016 gegen ältere Jahresberichte). Der Name legt den Gegenstand nicht fest, wenn er eine Reihe mit Vorläufern benennt. Offen |
| 8 Lizenz, `beleg_art` | Wirkt wie gedacht: 14 Lizenzaussagen kamen als `seite`, 17 als `daten`; die vier einigen `seite`-Fälle gingen alle an den Beleg (Opus bestätigte `LI_04`). Strenger ist auch der Preis: Bei 4 Lizenzen hatte nur ein Lauf einen Wert, 2 waren uneinig; Opus entschied 10 von 11 (offen blieb das Chartportal, das mit 403 antwortet). Eine Fehlstelle: CC BY-SA 4.0 hat keinen Code (`LI_05` als Notbehelf bei DFG) |
| 11 URL liefert die Datei | 0 falsche URLs (Runde 1: 3 von 662). Alle fünf anfänglich fehlenden Zitate waren Lücken im Abgleich |
| 6 nur Ausgabe und Downloads | 1 von 8 Läufen schrieb außerhalb (ein Verzeichnis `x/` im Repository, wieder entfernt); Runde 1: 4 von 8 |
| 10 Quellentyp | 7 von 91 `statistik`-Quellen sind Impressum- oder Copyright-Seiten (Runde 1: 0 von 77). Folge von Regel 8: Die Läufe führen ihre Lizenzbelege jetzt als Quelle. `uebernehmen.mjs` hält sie zurück |
| 1 | `datenatlas.de` öffnete keiner der acht Läufe |

**Zwei Fehler der Werkzeuge, von der Runde gefunden.**

- `feldvergleich.mjs` las `existenz` nur als Objekt `{wert}`. In Runde 2 stand sie bei einem Teil der
  Läufe als bloßer Text; 14 der 15 „uneinigen“ Existenz-Entscheidungen waren dadurch Artefakte.
  Beide Formen werden jetzt gelesen (`felder.mjs`). An Runde 1 und der Kalibrierung ändert das nichts.
- Der Zitatabgleich entfernte in der Seitenvorlage jeden Bindestrich vor einem Zeilenumbruch.
  Das macht aus „Nominal- und Reallohnindex“ und aus der HTML-Tabellenzelle „-“ (FDZ-Seite)
  ein falsches Fehlen. Jetzt gelten beide Lesarten; alte `.xls`-Dateien (ZDH) werden gelesen.

**Was die Maschine nicht erkannte.** Die Läufe fanden in 10 von 20 Öffnungsbegründungen eine
Praxisaussage (beide Läufe dieselben 10); `claimsThirdPartyPractice()` trifft keine (Runde 1: 17 von 20).
Die DFG-Einträge zu GEPRIS belegen Aussagen nur in JavaScript-Dateien mit Hash im Namen; die
lesbaren Seiten-URLs tragen die Quelle, aber ein Abgleich ist dort nicht möglich.

## Werkzeuge

| Datei | Zweck |
|---|---|
| `scripts/quellenpruefung/pruefauftrag.md` | der Auftrag — einzige Fassung, alle Läufe lesen ihn |
| `scripts/quellenpruefung/entscheidungsauftrag.md` | Auftrag für die Entscheidung am Beleg |
| `scripts/quellenpruefung/gruppieren.mjs` | Stufe 0: Gruppen, Eingabedateien |
| `scripts/quellenpruefung/zitate-pruefen.mjs` | Zitatabgleich; jede Normalisierung darin hat einmal einen falschen Fehlschlag erzeugt |
| `scripts/quellenpruefung/uebernehmen.mjs` | Übernahme in die Sektordateien (`auto`, `review`) |
| `scripts/quellenpruefung/feldvergleich.mjs` | zwei Läufe ohne Referenz, Einteilung nach Stufe 3, Beleg-Datei |
| `scripts/quellenpruefung/felder.mjs` | gemeinsame Feldlogik für beide Vergleiche |
| `scripts/quellenpruefung/kosten.mjs` | Kosten und Startkontext aus Agentenprotokollen |
| `scripts/quellenpruefung/kalibrierung/vergleich.mjs` | bewertet Läufe gegen eine Referenz |
| `scripts/quellenpruefung/kalibrierung/uebereinstimmung.mjs` | vergleicht zwei Läufe Feld für Feld gegen eine Referenz |
| `scripts/quellenpruefung/kalibrierung/laeufe/` | Eingaben und Ergebnisse der Kalibrierung |
| `scripts/quellenpruefung/runden/1/`, `…/2/` | Eingaben, Läufe, Zitatabgleich, Feldvergleich, Entscheidung, Kosten, Begründungen |
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

## Vierte Produktionsrunde (5. November 2026)

17 Einträge, die zusammen `OP_01` und `LI_04` trugen und eine bestimmte Stelle nennen (GDV 6, IVW 5, ZDH 4,
VDA 1, VCI 1) — der Widerspruch zwischen Klasse und Lizenz war der Anlass, nicht ein Herausgeber. Derselbe
Ablauf; die 58 übrigen Einträge mit diesem Widerspruch sind allgemeine Datentypen ohne eine einzelne Quelle
und bleiben unverändert. Übernommen in zwei PRs: 27 Codefelder an 16 Einträgen, dann Beschreibung, Quellen,
Klassen und Begründungen (16 Einträge, 90 von 10.428 mit geprüfter Quelle).

| | Läufe A (4) | Läufe B (4) | Opus am Beleg (2) |
|---|---|---|---|
| Kosten | 6,54 $ | 7,27 $ | 5,33 $ |
| Anfragen | 164 | 183 | 90 |
| Zitate wiedergefunden | 229 / 229 | 239 / 239 | 184 / 184 |

Gesamt 19,15 $ (437 Anfragen), Startkontext 29.765 Tokens (Sonnet) und 29.948 (Opus). Von 252 Feldern gehen 171
automatisch durch, 81 an den Beleg.

**Was die Runde ergab.**

- **Acht Einträge von `OP_01` auf `OP_02`**, weil die Nutzungsbedingungen die Verwertung vorbehalten: GDV (drei Sach- und
  Cyber-Einträge, Risikoleben), VDA-Produktion, VCI-Energieintensität, bAV-Studie und die Nachfolgestudie des
  KCE. Der GDV verlangt schriftliche Zustimmung, bevor Daten in einem Statistik-Portal erscheinen oder für
  Text- und Data-Mining dienen — das ist mehr als eine Pflicht zur Quellenangabe.
- **Der Automatismus hätte zwei GDV-Einträge auf `LI_05` gesetzt**, weil beide Läufe die Seite „kostenfreie Nutzung
  mit Quellenangabe“ fanden. Die Entscheidung am Beleg wertete dieselben Bedingungen bei drei Schwestereinträgen
  als `LI_04`. Beide blieben auf `LI_04`: ein Herausgeber, eine Bedingung, ein Code. Der Feldvergleich vergleicht
  Läufe je Eintrag, nicht je Herausgeber — das ist eine Lücke des Verfahrens.
- **Mehrere Beschreibungen nannten Angaben, die die Quelle nicht ausweist**: eine Deckungssummen-Verteilung beim GDV (beide Läufe:
  `existenz` = nein; `uebernehmen.mjs` stellt sie zurück), eine jährliche Nachfolgestatistik aus Kammerdaten (belegt
  sind eine Studie und eine einmalige Sonderumfrage), Gewerk-Gliederungen im ZDH-Konjunkturbericht (ausgewiesen sind
  Gewerbegruppen), „Versicherungsdichte“ für Cyber, „Schadenquoten nach Region“ für Klimaschäden.
- **Die AGOF ist in Liquidation**; ihre Online-Reichweitenforschung liegt seit dem Jahreswechsel 2022/2023 bei der
  agma. Zwei IVW-Digitaleinträge hatten sie als Messstelle genannt.
- **Startjahre**: 14 von 17 gingen an den Beleg (die übrigen 3 hatten in beiden Läufen keine Zahl). Bei den drei ZDH-Konjunktureinträgen entschied Opus gegen Lauf B
  (2012, das Archiv vergangener Jahre) für 2025: Der aktuelle Bericht weist nur Tabellenwerte ab dort aus (Regel 7e).
- **Zitatabgleich**: Drei Zitate aus der IVW-Auflagen-CSV fehlten zunächst. Die Datei ist Latin-1 ohne
  Zeichensatzangabe, `zitate-pruefen.mjs` las sie als UTF-8. Behoben: ohne Angabe UTF-8, sonst Windows-1252.

**Offen** blieb, was die Läufe nicht entscheiden konnten: Bei den fünf IVW-Einträgen und den drei ZDH-Konjunktureinträgen
fand kein Lauf einen Lizenzbeleg (Nutzungsbedingungen der Seite: 404 oder anderer Datensatz). Sie stehen weiter auf
`OP_01` mit `LI_04`; weder ist `LI_04` belegt noch ein anderer Code. Der Haftpflicht-Eintrag beschreibt einen Datensatz,
den es nicht gibt, und ist nicht angefasst.

## Fünfte Produktionsrunde: Stichprobe der allgemeinen Einträge (6. November 2026)

Die vierte Runde hatte die 58 übrigen Einträge mit `OP_01` und `LI_04` als „allgemeine Datentypen ohne eine einzelne
Quelle“ unverändert gelassen. Die Stichprobe von zehn dieser Einträge widerlegt das: Bei allen zehn ließ sich aus der
Beschreibung ein Herausgeber ableiten (AGEB, BDEW, EPEX SPOT, GIE, Destatis, Börsenverein, game, ZAW, Fachagentur Wind
und Solar, NIM/GfK), und keiner stimmte vollständig. Ausgewählt wurden Einträge, bei denen die Beschreibung einen
Herausgeber nahelegt; die Stichprobe ist deshalb nicht zufällig und nicht auf die übrigen 48 übertragbar.

| | Läufe A (2) | Läufe B (2) | Opus am Beleg (2) |
|---|---|---|---|
| Kosten | 3,10 $ | 4,84 $ | 5,30 $ |
| Zitate wiedergefunden | 118 / 118 | 125 / 126 (+1 von Hand) | 101 / 101 |

Gesamt 13,24 $ (256 Anfragen), 1,32 $ je Eintrag und damit mehr als in Runde 4 (1,13 $), weil die Läufe erst den
Herausgeber suchen mussten. Von 149 Feldern gingen 97 automatisch durch, 52 an den Beleg. Das eine fehlende Zitat war
ein Destatis-Zitat über zwei Zellen derselben XLSX-Zeile; der Abgleich vergleicht Zellen einzeln. Die Zeile wurde von
Hand bestätigt (Blatt 4, Zellen 82, 83 und 6) und in `zitate-b.json` mit dem Vermerk `von_hand` auf „gefunden“ gesetzt.

**Was die Runde ergab.**

- **Sechs Einträge von `OP_01` auf `OP_02`**: AGEB-Strommix (die Daten sind nur zu nicht-kommerziellen Zwecken frei),
  BDEW-Gasabsatz (Zustimmung des Rechteinhabers), EPEX-Preise (lizenz- und gebührenpflichtig), ZAW-Werbeumsätze („Alle
  Rechte beim Verlag“), NIM-Konsumklima (Vervielfältigung vorbehalten) und der Börsenverein-Buchmarkt. Beim Börsenverein
  fand sich keine Lizenz, nur „© Börsenverein“ und für die Warengruppen „© Media Control“; wie bei AGF und Media Control
  ist das Hindernis das Nutzungsrecht. `uebernehmen.mjs` stuft nur um, wenn sich die Lizenz ändert; die Klasse wurde
  hier von Hand gesetzt.
- **Drei Einträge trugen `LI_04` zu Unrecht**: game (`LI_05`: „Zahlen und Grafiken … dürfen mit Quellenangabe verwendet
  werden“), Gasspeicher/GIE (`LI_05`) und Containerhäfen (`LI_03`). `OP_01` bleibt dort richtig; die alte Auflage
  „Nutzungsrecht vorab klären“ war überholt und ist durch die Quellenangabe als Auflage ersetzt.
- **Häfen: zwei Wortlaute für dieselbe Statistik.** Der Statistische Bericht erlaubt „Vervielfältigung und Verbreitung …
  mit Quellenangabe“ (`LI_05`), das Impressum nennt für die Datenbank GENESIS-Online die Datenlizenz Deutschland
  (`LI_03`). Gewählt wurde `LI_03`, weil sie die Datenbank betrifft; die Faustregel „Destatis-Publikationen = `LI_05`“
  gilt für die Berichte.
- **Repowering bleibt offen**: Die Fachagentur Wind und Solar erlaubt die Weitergabe mit Urhebernennung, aber nur
  unverändert; eine Lizenz nennt die Seite nicht. Der Eintrag steht weiter auf `OP_01` mit `LI_04`, die Begründung nennt
  die Bedingung offen. Entschieden vom Nutzer, nicht von den Läufen.
- **Beschreibungen nannten Dinge, die es nicht gibt**: „private Erzeuger“ und „Erzeugerkategorie“ (AGEB weist nur
  Energieträger aus), „nach Region“ (BDEW weist nur Verbrauchergruppen aus), Liegeplatzbelegung (Destatis erhebt sie
  nicht), „Wissenschaft“ als Warengruppe mit Euro-Beträgen (nur Prozentanteile), „Leistungszuwachs“ und WindGuard als
  Herausgeber (ausgewiesen ist die Leistung neuer Anlagen), Konjunkturerwartung als Index-Komponente (es sind
  Einkommenserwartung, Anschaffungsneigung und Sparneigung). Die EPEX-Begründung „Gebote einzelner Händler gehören
  nicht dazu“ war falsch: Blockgebote und anonyme Orderhistorien sind eigene Produkte.
- **Startjahre** gingen alle an den Beleg: 1990 (AGEB), 2015 (BDEW), 2011 (GIE, Häfen), 2021 (Börsenverein, game),
  2022 (ZAW), 2025 (Repowering). Beim NIM fand kein Lauf eine Zahl (1974 und 1980 sind der Erhebungsbeginn); das Jahr
  steht unverändert und unbelegt.

**Folgerung.** Von den 58 Einträgen mit `OP_01` und `LI_04` ohne Quelle bleiben 48; sie sind keine „allgemeinen“
Datentypen im Sinne von „ohne Herausgeber“, sondern Einträge, die `gruppieren.mjs` nur deshalb nicht fand, weil
`STELLEN` den Herausgeber nicht kennt. Die Tabelle um EPEX, GIE, game, ZAW, Börsenverein, NIM und AGEB zu erweitern,
wäre der erste Schritt für eine weitere Runde.

**Handhabung.** `uebernehmen.mjs` erwartet je Runde zusammengeführte Dateien (`eingabe.json`, `entscheidung.json`,
`zitate-a/b/opus.json`, `feldvergleich.json`). Bei zwei Teileingaben wurden sie per Einmalskript vereinigt und der
Feldvergleich über die vereinigten Läufe neu gerechnet.

## Sechste Produktionsrunde: 30 Einträge mit `OP_01` und `LI_04` (6. November 2026)

Fortsetzung der Stichprobe: 30 der 48 Einträge, bei denen die Beschreibung einen Herausgeber nahelegt, in sechs
Eingaben zu je fünf, nach Herausgeber zusammengestellt (BVMI, Börsenverein, Deutsche Börse, GDV, ZDH, Bitkom und
Bundesnetzagentur, BVE und AMI, BStBK und G-BA). Die übrigen 18 (Musikschulen, duale Hochschulen, EdTech, Esports,
Streaming-Kataloge, Theater, Filmverleih, IG BCE u. a.) blieben ungeprüft.

| | Läufe A (6) | Läufe B (6) | Opus am Beleg (6) |
|---|---|---|---|
| Kosten | 16,50 $ | 15,45 $ | 16,63 $ |
| Zitate wiedergefunden | 420 / 420 (davon 4 von Hand) | 370 / 370 (davon 1 von Hand) | 309 / 309 (davon 4 von Hand) |

Gesamt 48,58 $ (928 Anfragen), 1,62 $ je Eintrag — mehr als in Runde 4 (1,13 $) und Runde 5 (1,32 $), weil die Läufe
zuerst den Herausgeber suchen mussten und teils verschiedene wählten. Von 442 Feldern gingen 278 automatisch durch, 164
an den Beleg. Übernommen in zwei PRs: 41 Codefelder an 26 Einträgen, dann 140 Änderungen an 27 Einträgen
(Beschreibung, Quellen, Startjahre, Klassen) und 25 neue Öffnungsbegründungen. Datentypen mit geprüfter Quelle:
126 von 10.428.

**Was die Runde ergab.**

- **Kein Eintrag stimmte vollständig.** Rhythmus „monatlich“ und Format „CSV“ waren fast überall falsch: Die Herausgeber
  veröffentlichen jährlich oder vierteljährlich als PDF.
- **14 Einträge von `OP_01` auf `OP_02`**, weil `LI_04` belegt ist: BVMI, agma, ZAW, GDV (zweimal), VDA, VDMA, HDE, ADV,
  AMI, DRV, Pro Generika und die beiden Börsenverein-Einträge (dort fehlt eine Lizenz; wie in Runde 5 hat der
  Vorbehalt von Media Control den Ausschlag gegeben und der Schwestereintrag stand schon auf `OP_02`).
- **Drei Einträge trugen `LI_04` zu Unrecht**: Bitkom und die Bundesnetzagentur (zwei Einträge) stehen unter CC BY 4.0.
  Dort entfiel die Auflage „Nutzungsrecht vorab klären“, `OP_01` bleibt.
- **Zehn Einträge bleiben auf `OP_01` mit `LI_04`, weil keine Lizenz zu belegen war** (nur „©“): drei ZDH, zwei Deutsche
  Börse, ADM, BVE, BStBK, BIOCOM, BGR-Steinbruch. Opus empfahl bei einem Teil `OP_02`; entschieden wurde wie in Runde 4:
  ohne Beleg weder ein Vorbehalt noch eine freie Lizenz. Die Begründungen sagen das offen.
- **Vier Einträge beschreiben Datensätze, die es nicht gibt**: Case-Mix-Index nach Fachabteilung (kein Pflichtinhalt des
  Qualitätsberichts), Wiederaufnahmerate „QUIPS“ (ein Benchmark zur Schmerztherapie am Uniklinikum Jena), Insolvenzen von
  Reiseveranstaltern (keine Statistik bei Creditreform, BMWK oder Destatis gefunden) und der GDV-Haftpflicht-Eintrag aus
  Runde 4. Sie sind unverändert; über sie wird als Gruppe entschieden.
- **Die Läufe wählten für denselben Eintrag verschiedene Herausgeber** (Luftfracht: Destatis oder ADV; Breitband: VATM
  oder Bundesnetzagentur; E-Commerce: HDE oder bevh). Das Verfahren hat dafür keine Regel; Opus entschied am Beleg
  nach dem Sektor des Eintrags (Luftfracht: ADV, weil die Flughäfen die Daten erzeugen).
- **Websuchkontingent**: In zwei Läufen (A4 und B4, beide Eingabe 4) war es gegen Ende aufgebraucht; ADV und bevh
  wurden deshalb nicht von beiden geprüft, Opus schloss die Lücke. Zwölf Läufe gleichzeitig mögen dazu beigetragen
  haben (nicht untersucht).
- **Zitatabgleich**: Neun Zitate fehlten und wurden von Hand bestätigt. Ursachen: das Zeichen „∅“ auf der agma-Seite,
  ein Trennstrich am PDF-Zeilenumbruch („Newsletter-Marketing“), mehrzellige XLSX-Kopfzeilen mit Jahren als Zahlen
  (Bundesnetzagentur) — der Abgleich vergleicht Zellen einzeln.
- **Werkzeug**: `uebernehmen.mjs` übergeht im Modus `auto` jetzt Einträge, deren Datensatz beide Läufe verneinen, wie im
  Modus `review`. Sonst wären Format und Lizenz des Qualitätsberichts auf den Case-Mix-Eintrag gelangt, und `auto` hätte
  `LI_05` gesetzt, wo Opus `LI_04` entschied.

**Offen**: Startjahr beim Getreide-Eintrag (2009, von keinem Lauf geprüft), beim NIM-Konsumklima und bei der agma
(Beginn des Angebots, nicht der Reihe); 41 Einträge mit `OP_01` und `LI_04` insgesamt, davon 22 ohne Quelle.
