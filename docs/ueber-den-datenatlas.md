# Über den Datenatlas

**Eine Landkarte der deutschen Datenlandschaft — und ihres ungenutzten Potenzials.**

---

## Kurzfassung

Der Datenatlas beantwortet eine Frage, die sich bislang niemand systematisch gestellt hat: *Welche Daten entstehen eigentlich in unserer Gesellschaft — und welche davon könnten offen sein?*

Er kartiert **10.428 Datentypen** aus **8 gesellschaftlichen Sektoren** und bewertet für jeden einzelnen, wie leicht er sich als Open Data veröffentlichen ließe — mit Begründung. Nicht als Datenkatalog zum Herunterladen, sondern als strukturierte Übersicht darüber, **wo Datenschätze liegen und was ihrer Öffnung im Weg steht**.

**→ [datenatlas.de](https://datenatlas.de)**

---

## Das Problem, das er adressiert

Die Open-Data-Debatte krankt an einem blinden Fleck. Sie dreht sich um Portale, Lizenzen und Schnittstellen — also um Daten, die bereits veröffentlicht sind. Was fehlt, ist der Blick auf das, was **noch nicht** veröffentlicht ist:

- **Organisationen kennen ihren eigenen Datenbestand oft nicht.** Ein Jugendamt weiß, dass es Fallakten führt — dass daraus aggregierte Sozialraumstatistiken werden könnten, die für Stadtplanung und Forschung wertvoll wären, steht auf einem anderen Blatt.
- **„Zu sensibel" ist häufig ein Pauschalurteil.** Weil die Rohdaten personenbezogen sind, gilt der ganze Datenbestand als tabu — obwohl die aggregierte Auswertung völlig unproblematisch wäre.
- **Das Potenzial ist unsichtbar.** Wer nicht weiß, dass eine Datenart existiert, kann sie weder anfragen noch nutzen noch ihre Öffnung einfordern.

Der Datenatlas macht diese unsichtbare Schicht sichtbar — und zwar nicht als Behauptung, sondern strukturiert, begründet und durchsuchbar.

---

## Wie der Datenatlas aufgebaut ist

### Die vierstufige Hierarchie

Der gesamte Bestand ist nach dem Prinzip *Wer produziert welche Daten wobei?* gegliedert:

```
Staat und Verwaltung                    ← Sektor        (8)
  └── Ordnungsamt                       ← Organisation  (151)
        └── Verkehrsüberwachung         ← Aktivität     (430)
              └── Messstellen-Geodaten  ← Datentyp      (10.428)
```

Die Sektoren sind konsequent nach **Trägertyp** geschnitten — also danach, wer die Daten erzeugt, nicht danach, worum es thematisch geht. Ein Krankenhausdatensatz liegt daher je nach Träger in *Staat* oder *Wirtschaft*, nicht in einem Sektor „Gesundheit". Das klingt sperrig, ist aber entscheidend: Öffnungshürden hängen an der Trägerform, nicht am Thema. Eine kommunale Klinik unterliegt anderen Transparenzpflichten als eine private.

| Sektor | Organisationstypen | Datentypen |
|---|---:|---:|
| Staat und Verwaltung | 45 | 3.105 |
| Wirtschaft | 23 | 1.587 |
| Zivilgesellschaft | 20 | 1.386 |
| Wissenschaft und Forschung | 19 | 1.311 |
| Bildung | 12 | 831 |
| Medien | 12 | 828 |
| Religionsgemeinschaften | 10 | 690 |
| Kultur | 10 | 690 |
| **Gesamt** | **151** | **10.428** |

### Die Öffnungsbewertung — der eigentliche Kern

Jeder Datentyp trägt eine von drei Öffnungsklassen. Entscheidend ist: Die Einstufung steht nie allein, sondern immer **mit Begründung**.

| Klasse | Anteil | Bedeutung |
|---|---:|---|
| 🟢 Sofort publizierbar | 67,2 % | kein oder minimaler Aufbereitungsbedarf |
| 🟡 Nach Aufbereitung publizierbar | 29,4 % | Anonymisierung oder Aggregation nötig |
| 🔴 Nur Metadaten publizierbar | 3,3 % | Inhalt zu sensibel, aber Existenz dokumentierbar |

Ein Beispiel aus dem Bestand zeigt, worin der Wert liegt. Für die **Blitzerfoto-Datenbank** eines Ordnungsamts lautet die Einstufung *rot*, mit dieser Begründung:

> Rohdaten enthalten biometrische Daten (Gesichtsbilder) und KFZ-Kennzeichen als direkte Personenidentifikatoren. Direktveröffentlichung ist rechtlich ausgeschlossen. Nur aggregierte Standortstatistiken (Anzahl Verstöße pro Messort und Monat) ohne Fahrzeug- oder Personenbezug sind als Open Data geeignet.

Direkt daneben stehen die **Bußgeldstatistiken** derselben Aktivität — *grün*, mit dieser Begründung:

> Gezählt werden Vorgänge nach Deliktart, Bezirk und Tageszeit, nicht Betroffene. Ein Mensch mit zwanzig Verwarnungen erscheint als zwanzig Fälle; Kennzeichen und Namen bleiben im Vorgang.

Genau diese Differenzierung ist der Punkt: Nicht „Verkehrsüberwachung ist heikel", sondern **welcher Teil davon aus welchem Grund** — und was stattdessen ginge.

### Die Metadaten je Datentyp

Über die Öffnungsklasse hinaus ist jeder der 10.428 Einträge strukturiert erschlossen:

| Merkmal | Ausprägungen | Häufigste Werte |
|---|---|---|
| **Thema** | 13 Felder | Wirtschaft (20,9 %), Soziales (14,3 %), Bildung (13,9 %) |
| **Datenart** | 9 Typen | Metadaten (32,2 %), Finanzdaten (14,8 %), Textdokumente (13,3 %) |
| **Granularität** | 4 Stufen | Einzelereignis bis aggregiert |
| **Format** | 8 Formate | CSV, JSON, GeoJSON, XML, Shapefile, NetCDF, PDF, Excel |
| **Lizenz** | 4 Modelle | Datenlizenz Deutschland (42,2 %), CC BY (31,3 %), CC0 (13,9 %), proprietär (12,6 %) |
| **Relevanz** | Skala 1–5 | 62,6 % auf Stufe 4 oder 5 |
| **Aktualisierung** | 5 Rhythmen | jährlich (57,7 %), monatlich (28,9 %), täglich (5,0 %) |
| **Verfügbar ab** | Jahreszahl | Zeitraum 1981–2020 |
| **Prozesse** | ≥ 5 je Datentyp | **52.140** Verknüpfungen insgesamt |

Die Prozessverknüpfungen sind dabei mehr als Beiwerk: Sie verbinden Datentypen quer über Sektorgrenzen. Wer „Monitoring & Evaluation" verfolgt, sieht auf einen Schlag alle Datentypen aus allen acht Sektoren, die diesem Zweck dienen.

---

## Was der Datenatlas kann

### Erkunden

- **Isometrische Karte** — alle Datentypen einer Ebene als begehbare Kachellandschaft, frei verschiebbar und zoombar. Die Farbe jeder Kachel zeigt die Öffnungsklasse; Muster werden auf einen Blick sichtbar.
- **Vierstufige Navigation** — vom Sektor bis zum einzelnen Datentyp, mit Breadcrumb und eigener URL je Ebene.
- **Detailansicht** — Beschreibung, Öffnungsbewertung samt Begründung, sämtliche Metadaten und verknüpfte Prozesse.

### Suchen und Filtern

- **Suche** über Namen und Pfade aller Sektoren hinweg.
- **Tiefensuche** — auf Wunsch werden zusätzlich die Beschreibungen durchsucht. Der Unterschied ist erheblich: „pseudonymisiert" findet ohne Tiefensuche keinen, mit Tiefensuche fünf Datentypen.
- **Öffnungsklassen-Filter** — zeigt gezielt, was sofort publizierbar wäre.

### Analysieren

- **Statistik-Dashboard** — Öffnungsklassen-Verteilung je Sektor. Hier wird das vielleicht interessanteste Muster des gesamten Bestands sichtbar (siehe unten).
- **Zeitliche Verfügbarkeit** — kumulative Kurve, ab wann Daten vorliegen, plus Aktualisierungsrhythmen je Sektor.
- **Ähnliche Datensätze** — zu jedem Datentyp bis zu fünf thematisch verwandte aus **anderen** Sektoren.
- **Datenkombinator** — 32 Fusionsszenarien, die zeigen, welches Erkenntnispotenzial in der Verknüpfung sektorübergreifender Daten steckt.

### Handeln

- **Wizard „Daten öffnen"** — ein fünfstufiger Leitfaden für Organisationen, die veröffentlichen wollen. Lizenz- und Publikationsempfehlungen richten sich nach Sektor, Datenart und Rechtslage; am Ende steht eine konkrete Checkliste.
- **CSV-Export** der jeweils sichtbaren Datentypen — für eigene Auswertungen.
- **Teilbare Links** — jede Navigationstiefe hat eine eigene URL; `?q=Suchbegriff` öffnet direkt eine Suche.

---

## Wozu der Datenatlas gebraucht werden kann

### 1. Den eigenen Datenbestand entdecken

Eine Kommune, ein Verein oder ein Institut findet unter dem eigenen Organisationstyp eine strukturierte Liste dessen, was dort typischerweise anfällt — häufig einschließlich Datenarten, an die intern niemand gedacht hat. Das ist der schnellste Einstieg in eine Dateninventur, ohne bei null anzufangen.

### 2. Öffnungsentscheidungen vorbereiten

Statt der pauschalen Frage „Dürfen wir das veröffentlichen?" liefert der Atlas die differenzierte Vorlage: Welcher Teil ist unbedenklich, welcher braucht Aufbereitung, wo bleibt nur die Metadaten-Veröffentlichung — und aus welchem Grund. Die mitgelieferten Begründungen sind als Argumentationsgrundlage gegenüber Datenschutzbeauftragten, Leitungsebene oder Gremien verwendbar.

### 3. Datenlücken und Nachfrage adressieren

Wer Daten *sucht*, kann belegen, dass sie existieren müssten. Journalistische Recherche, wissenschaftliche Anfragen und Informationsfreiheitsanträge werden konkreter, wenn statt „Gibt es dazu Daten?" gefragt wird: „Ihr Amt führt Aktivität X, dabei entsteht typischerweise Datentyp Y — in welcher Form liegt der vor?"

### 4. Sektorübergreifende Verknüpfung erkennen

Der größte Erkenntnisgewinn liegt selten in einem einzelnen Datensatz, sondern in der Kombination. Ähnlichkeitsverweise und Datenkombinator zeigen systematisch, welche Daten aus verschiedenen Sektoren zusammenpassen — etwa Umweltmessungen des Staates mit Gesundheitsdaten und zivilgesellschaftlichem Monitoring.

### 5. Politik und Strategie begründen

Die Auswertung über den Gesamtbestand macht strukturelle Aussagen möglich. Die Öffnungsquote je Sektor etwa:

| Sektor | sofort publizierbar |
|---|---:|
| Staat und Verwaltung | 76,6 % |
| Wissenschaft und Forschung | 73,8 % |
| Zivilgesellschaft | 71,3 % |
| Bildung | 66,4 % |
| Kultur | 62,5 % |
| Religionsgemeinschaften | 61,7 % |
| Wirtschaft | 55,7 % |
| Medien | 46,5 % |

Der Befund dahinter ist bemerkenswert: **Über zwei Drittel aller erfassten Datentypen wären sofort publizierbar**, und nur 3,3 % sind tatsächlich so sensibel, dass lediglich Metadaten veröffentlicht werden könnten. Der Engpass ist demnach überwiegend kein rechtlicher, sondern ein organisatorischer und kultureller.

### 6. Lehre und Qualifizierung

Die Struktur eignet sich als Lehrmaterial für Verwaltungsinformatik, Data Literacy, Bibliotheks- und Informationswissenschaft oder Journalismusausbildung: ein realistischer, in sich konsistenter Datenraum mit begründeten Bewertungen, an dem sich Abwägungen zwischen Transparenz und Schutzinteressen durchspielen lassen.

---

## Wer sich damit auseinandersetzen sollte

**Open-Data-Verantwortliche in Verwaltungen** — als Inventurhilfe und Priorisierungsgrundlage. Der Sektor Staat ist mit 45 Organisationstypen und 3.105 Datentypen am dichtesten erschlossen, von Bundesbehörden bis zu kommunalen Ämtern.

**Kommunale Leitungs- und Digitalisierungsebene** — um zu erkennen, welche Datenschätze im eigenen Haus liegen und welche davon mit vertretbarem Aufwand Transparenz und Verwaltungsnutzen erzeugen.

**Datenschutzbeauftragte und Justiziariate** — als Diskussionsgrundlage für differenzierte statt pauschaler Bewertungen. Die Begründungstexte benennen Rechtsgrundlagen und zeigen Aggregationswege auf, die eine Veröffentlichung ermöglichen.

**Datenjournalistinnen und Rechercheure** — um zielgerichtet zu erkennen, welche Daten bei welcher Stelle entstehen, und Anfragen präzise zu formulieren.

**Forschung und Wissenschaft** — für Datenquellensuche, Forschungsdatenmanagement und als Untersuchungsgegenstand: Der Bestand ist selbst eine Datengrundlage für Arbeiten zur Datenlandschaft, Transparenzforschung und Open-Government-Analyse.

**Zivilgesellschaft und NGOs** — um Transparenzforderungen zu belegen und eigene Datenbestände einzuordnen. Der Sektor ist entlang der 16 Engagementfelder des ZiviZ-Monitors gegliedert und damit anschlussfähig an etablierte Systematiken.

**Unternehmen mit Datenverantwortung** — der Wirtschaftssektor zeigt mit 57,1 % Grün-Anteil, dass auch dort erhebliches Öffnungspotenzial liegt, insbesondere bei aggregierten Kennzahlen und Nachhaltigkeitsberichterstattung.

**Bildungseinrichtungen** — sowohl als Datenproduzenten wie als Vermittler von Datenkompetenz.

**Politik und Verbände** — für Argumentationen zu Transparenzgesetzgebung, Open-Data-Strategien und Verwaltungsdigitalisierung, gestützt auf Struktur statt Anekdote.

---

## Woher die Angaben stammen

Die Einträge sind **modelliert**, nicht aus den Beständen realer Organisationen abgeschrieben. Das ist die wichtigste Einschränkung des Atlas — deshalb steht sie hier ausführlich.

**Wie ein Eintrag entsteht.** Für jeden Organisationstyp wird systematisch gefragt: Was erhebt diese Art von Organisation? Was produziert sie als Bericht oder Statistik? Was muss sie veröffentlichen? Und was davon wäre für andere Sektoren wertvoll? Daraus entstehen Beschreibung, Metadaten und Öffnungsbewertung. Das Ergebnis ist ein Modell dessen, was bei einem Organisations*typ* typischerweise anfällt — keine Erhebung bei einzelnen Organisationen und keine Abschrift aus deren Verzeichnissen.

**Mit Quelle oder Einschätzung.** Aus der Entstehungszeit der Einträge gibt es keine Quellenangaben. Jeder Datentyp zeigt deshalb in der Detailansicht, im CSV-Export und auf den Organisationsseiten seinen Status:

- **Mit Quelle** — die Angaben sind in einer Primärquelle nachgelesen, etwa beim Herausgeber der Statistik. Genannt werden Quelle, Prüfdatum und die Aussage, die sie stützt — nicht mehr.
- **Einschätzung** — noch nicht gegen eine Quelle geprüft. Beschreibung, Öffnungsklasse und Zeitangaben sind modelliert. Das gilt derzeit für fast alle Einträge.

Eine Quelle wird erst eingetragen, wenn die Aussage auf der Quellseite tatsächlich steht. Die bisher geprüften Einträge zeigen, warum das nötig ist: Von 138 stimmten zwei vollständig, 124 mussten korrigiert werden, zwölf ließen sich im Kern nicht belegen. Meist gab es die beschriebene Statistik, ungenau waren die Details — Startjahr, Erscheinungsrhythmus, Format, Lizenz, Gliederung, gelegentlich der Herausgeber oder das zugrunde liegende Gesetz; mehrere Einträge beschrieben einen Datensatz, den es so nicht gibt. Derzeit tragen 128 von 10.428 Einträgen eine Quelle. Die Auswahl der geprüften Einträge war nicht zufällig, bevorzugt wurden Einträge mit benanntem Herausgeber; daraus lässt sich deshalb keine Fehlerquote für den Gesamtbestand berechnen. Wer einen Eintrag verwendet, sollte Zeitangaben, Format und Lizenz vor der Nutzung beim Herausgeber nachlesen.

**Beispiellinks.** Ein Teil der Einträge verweist auf Beispieldatensätze. Diese Links werden wöchentlich automatisch geprüft; bei der ersten Prüfung waren 231 von 937 nicht mehr erreichbar und wurden entfernt. Ein Beispiellink zeigt, dass es Vergleichbares gibt. Die Angaben des Eintrags belegt er nicht.

**Öffnungsbegründungen.** Für die Begründungen gelten feste Regeln: keine Behauptung darüber, was andere Organisationen bereits veröffentlichen oder nicht, und keine Rechtsgrundlage, die sich aus dem Eintrag selbst nicht ergibt. Verstöße gegen die erste Regel meldet ein Prüfprogramm bei jeder Änderung. Auch mit Quelle bleibt die Öffnungsklasse eine fachliche Einschätzung, keine rechtliche Prüfung.

Für die Nutzung heißt das: Der Atlas zeigt, **wonach man fragen sollte**. Ob ein bestimmter Datensatz so existiert, klärt erst die Nachfrage bei der Organisation. Hinweise auf Fehler oder geeignete Quellen nehmen wir gern über [GitHub](https://github.com/daimpad/datenatlas) oder den [Kontakt](https://nozilla.de/kontakt/) entgegen.

---

## Was der Datenatlas *nicht* ist

Für einen redlichen Umgang mit dem Werkzeug sind seine Grenzen ebenso wichtig wie seine Möglichkeiten:

- **Kein Datenkatalog und kein Downloadportal.** Er verzeichnet Daten*typen*, nicht einzelne Datensätze. Es gibt keine Schnittstellen zu konkreten Beständen; Beispiel- und Quellenlinks führen zu den jeweiligen Herausgebern. Für tatsächlich verfügbare Daten sind GovData, Landesportale und Fachrepositorien die richtigen Anlaufstellen.
- **Kein Verzeichnis geprüfter Bestände einer konkreten Organisation.** Der Atlas modelliert, was bei einem Organisations*typ* typischerweise anfällt. Ob ein bestimmtes Amt einen bestimmten Datensatz tatsächlich führt, muss vor Ort geprüft werden.
- **Keine Rechtsberatung.** Die Öffnungsklassen sind fachlich begründete Einschätzungen, keine rechtsverbindlichen Feststellungen. Eine konkrete Veröffentlichungsentscheidung erfordert die Prüfung des Einzelfalls.
- **Zeitangaben sind illustrativ.** Verfügbarkeitsjahre und Aktualisierungsrhythmen bilden plausible Größenordnungen ab und stützen die Zeitanalyse — sie sind nicht je Datentyp recherchiert, außer bei Einträgen mit geprüfter Quelle.

Kurz: Der Datenatlas ist ein **Orientierungs-, Argumentations- und Planungswerkzeug**. Er ersetzt keine Inventur, keine Rechtsprüfung und kein Datenportal — er macht sie zielgerichteter.

---

## Technisches Fundament

Der Datenatlas läuft **vollständig im Browser**. Es gibt keine Datenbank, kein Backend und keine Nutzerkonten; die gesamte Taxonomie liegt als statische JSON-Dateien vor. Das hat drei Konsequenzen, die für die Nutzung relevant sind:

- **Nachvollziehbarkeit** — der komplette Datenbestand ist einsehbar und als CSV exportierbar; nichts passiert in einer Blackbox.
- **Nachnutzbarkeit** — der Quellcode steht unter der Mozilla Public License 2.0 auf [GitHub](https://github.com/daimpad/datenatlas); die Struktur lässt sich für andere Länder oder Domänen übernehmen.
- **Dauerhaftigkeit** — ohne Serverkomponente gibt es nichts, das ausfallen oder unbemerkt veralten kann.

Zur Reichweitenmessung läuft [GoatCounter](https://www.goatcounter.com/) mit — ohne Cookies und ohne Wiedererkennung über Besuche oder Geräte hinweg. Gezählt werden Seitenaufrufe, nicht Personen; auf der Karte zusätzlich der jeweils angezeigte Ausschnitt, weil sonst jeder Besuch nur als Startseite erschiene. Die internen Redaktionswerkzeuge sind ausgenommen.

Die Datenqualität wird maschinell abgesichert: Ein Validator prüft bei jeder Änderung Schema, Vokabular, sektorübergreifend eindeutige Kennungen und die Farbkonventionen; er läuft automatisch bei jedem Pull Request.

---

*[datenatlas.de](https://datenatlas.de) · [Quellcode](https://github.com/daimpad/datenatlas) · MPL-2.0 · von [nozilla](https://nozilla.de)*
