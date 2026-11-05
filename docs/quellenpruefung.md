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
zu Kirchenaustritten allein im evangelischen Bereich, 16 zu IVW-Auflagen. Die
828 noch offenen Einträge mit benannter Stelle verteilen sich auf 391 Gruppen
aus Herausgeber und Aktivität (Ø 2,1). Recherchiert wird je Gruppe; Lizenz und
Nutzungsbedingungen je Herausgeber nur einmal. Die Gruppierung ist eine grobe
Näherung und noch nicht als Skript im Repository.

**Stufe 1 — Zwei Prüfläufe.** Jeder Lauf arbeitet nach
`scripts/quellenpruefung/pruefauftrag.md`: fester Prüfbogen mit acht Feldern
(Herausgeber, Inhalt, Ebene, Rhythmus, Startjahr, Format, Lizenz,
Rechtsgrundlage), Codefelder als Vokabularcodes, jede Aussage mit wörtlichem
Zitat. Der Agententyp `.claude/agents/quellenpruefer.md` legt Modell und
Werkzeuge fest. Die beiden Läufe wissen nichts voneinander.

**Stufe 2 — Maschinelle Prüfung.**
`scripts/quellenpruefung/zitate-pruefen.mjs` sucht jedes Zitat auf seiner
Quellseite; ein nicht gefundenes Zitat macht den Befund wertlos.
`scripts/quellenpruefung/kalibrierung/uebereinstimmung.mjs` vergleicht die
beiden Läufe Feld für Feld.

**Stufe 3 — Übernahme.**

| Automatisch (`quellen-auto`) | Prüfung am Beleg (`quellen-review`) |
|---|---|
| Codefeld in beiden Läufen belegt, gleicher Wert, Zitate gefunden | Läufe uneinig, oder nur einer hat einen Wert |
| Quellen, deren Zitate gefunden wurden | Öffnungsklasse ändert sich |
| | Datensatz existiert laut einem Lauf nicht |
| | neue Begründung, Umbenennung, neuer Vokabularcode |
| | Lizenzbeleg stammt von einer anderen Domain als die Hauptquelle |

Neue Beschreibungen sollen nur dann automatisch übernommen werden, wenn jede
Zahl, jedes Jahr und jeder Paragraph darin in einem wiedergefundenen Beleg
steht und beide Läufe bei Urteil und Existenz übereinstimmen. Dieser Check ist
noch zu bauen.

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
| Entscheidung bei Uneinigkeit | Opus 5.5 oder Mensch | Abwägen am Beleg; selten, deshalb teuer vertretbar |
| Fable 5.1 | nicht nötig | — |
| Haiku 5.5 | nicht getestet | Kandidat für Gruppierung |

**Kosten verstehen.** Ein Agent liest bei jedem Schritt seinen ganzen Verlauf
neu. Cache-Lesen machte bei Sonnet 57 %, bei Opus 50 % der Kosten aus — und
kostet bei Opus 5.5 und Sonnet 5.5 gleich viel (0,20 $ je Mio. Tokens). Der
größte Hebel ist deshalb die Zahl der Schritte, nicht das Modell: Mit dem
festen Prüfbogen brauchte Sonnet 154 statt 238 Anfragen. Der zweite Hebel ist
der Startkontext (78.000 Tokens beim allgemeinen Agenten); der Agententyp mit
nur fünf Werkzeugen soll ihn verkleinern — noch nicht gemessen.

**Hochrechnung.** Zwei Läufe kosten rund 0,94 $ je Eintrag. Für die 828 offenen
Einträge mit benannter Stelle wären das ohne Gruppierung rund 780 $, mit
Gruppierung voraussichtlich deutlich weniger (Schätzung, nicht gemessen). Für
die allgemeinen Datentypen ist die Gruppierung nach Rechtsgrundlage noch nicht
gemessen; eine Hochrechnung wäre geraten.

## Grenzen dieser Messung

- 16 Einträge plus 6 im Pilot — eine Stichprobe, keine Statistik.
- Die Referenz stammt aus einem einzigen Opus-Lauf; zwei ihrer Befunde waren
  nachweislich falsch oder zu eng und sind korrigiert (`_korrekturen` in der
  Referenzdatei).
- Die Regeln 7–10 im Prüfauftrag sind nach der Kalibrierung aus deren Fehlern
  ergänzt und noch nicht an neuem Material gemessen.
- Der Agententyp `quellenpruefer` ist in dieser Sitzung nicht gelaufen (er wird
  erst in einer neuen Sitzung geladen); die Läufe nutzten den allgemeinen Agenten
  mit Sonnet.
- Die Opus-Zahlen stammen aus Runde 3 mit dem alten, freieren Auftrag; wie viel
  der Ersparnis am Modell und wie viel am Prüfbogen liegt, ist nicht getrennt.

## Werkzeuge

| Datei | Zweck |
|---|---|
| `scripts/quellenpruefung/pruefauftrag.md` | der Auftrag — einzige Fassung, alle Läufe lesen ihn |
| `scripts/quellenpruefung/zitate-pruefen.mjs` | Zitatabgleich; jede Normalisierung darin hat einmal einen falschen Fehlschlag erzeugt |
| `scripts/quellenpruefung/kalibrierung/vergleich.mjs` | bewertet Läufe gegen eine Referenz |
| `scripts/quellenpruefung/kalibrierung/uebereinstimmung.mjs` | vergleicht zwei Läufe Feld für Feld |
| `scripts/quellenpruefung/kalibrierung/laeufe/` | Eingaben und Ergebnisse dieser Kalibrierung |
| `.claude/agents/quellenpruefer.md` | Agententyp: Sonnet, fünf Werkzeuge |

```bash
NODE_USE_ENV_PROXY=1 node scripts/quellenpruefung/zitate-pruefen.mjs lauf.json --json zitate.json
node scripts/quellenpruefung/kalibrierung/uebereinstimmung.mjs --referenz … --a lauf1.json --b lauf2.json --za … --zb …
```

`NODE_USE_ENV_PROXY=1` nur hinter einem Proxy (Node ≥ 22). Der Abgleich braucht
`pdftotext` und `unzip`.
