# Entscheidungsauftrag: Prüfung am Beleg

Zwei unabhängige Prüfläufe haben Einträge des Datenatlas nach
`scripts/quellenpruefung/pruefauftrag.md` geprüft. Wo sie uneinig waren, nur
einer einen Wert hatte oder eine neue Beschreibung vorgeschlagen wurde, entscheidest
du am Beleg. Lies zuerst den Prüfauftrag (Regeln 1–10 gelten auch für dich) und dann
die Beleg-Datei aus deinem Auftrag.

## Eingabe

Die Beleg-Datei hat je Eintrags-id `entscheidungen` (Felder, über die du entscheidest)
und `kontext` (korrigierte Textfelder — sie fließen in die Beschreibung, du entscheidest
nicht einzeln über sie). Jede Entscheidung trägt `grund` und beide Fassungen (`beleg.a`,
`beleg.b`) mit Wert, Zitaten und URLs. Die Beschreibung steht als `beleg.a` / `beleg.b`
beim Feld `beschreibung`; `unbelegt_a` / `unbelegt_b` nennen Zahlen, Jahre und
Paragraphen darin, die in keinem wiedergefundenen Zitat des Laufs stehen — dort zuerst
nachsehen. Die ursprüngliche Beschreibung steht in der Eingabedatei des Auftrags.

## Vorgehen

1. Je Entscheidung die Belege beider Fassungen **auf der Quellseite selbst** nachlesen
   (WebFetch, bei PDF/XLSX wie im Prüfauftrag). Nicht aus dem Gedächtnis entscheiden,
   nicht eine Fassung nur deshalb nehmen, weil sie plausibler klingt.
2. Stimmt keine der Fassungen, suche selbst die Primärquelle. Findest du sie nicht
   nach zwei gezielten Suchen: `offen` mit `gesucht`.
3. Lizenz: nur die Aussage, die sich auf genau diese Daten bezieht (Regel 8).
   Startjahr: früheste abrufbare Daten des beschriebenen Datensatzes (Regel 7).
4. **Beschreibung**: schreibe die endgültige Fassung — zwei bis drei Sätze, jede Zahl,
   jedes Jahr und jeder Paragraph mit Beleg. Übernimmst du Teile aus A oder B, prüfe sie
   neu; ein Detail ohne Beleg fällt weg. Keine Aussage darüber, was eine Organisation
   „bereits veröffentlicht“.
5. **Begründung der Öffnungsklasse**: entscheide nur, ob sie bleiben kann
   (`bleibt`) oder neu geschrieben werden muss (`neu`), mit dem Grund in einem Satz.
   Schreibe sie nicht.
6. Jedes Zitat wörtlich von der Seite, höchstens etwa 25 Wörter; es wird danach
   maschinell gesucht.

## Ausgabe

Eine JSON-Datei, ein Objekt je Eintrags-id:

```json
{
  "<id>": {
    "entscheidungen": [
      { "feld": "startjahr", "urteil": "a | b | beide | keiner | offen",
        "wert": "Code, Zahl oder Text", "belege": [{ "zitat": "…", "url": "…" }],
        "gesucht": "nur bei offen", "notiz": "ein Satz, warum" }
    ],
    "beschreibung": { "text": "endgültige Fassung", "belege": [{ "zitat": "…", "url": "…" }] },
    "begruendung": { "urteil": "bleibt | neu", "grund": "ein Satz" }
  }
}
```

`urteil`: `a` / `b` — die Fassung des jeweiligen Laufs stimmt · `beide` — beide stimmen
(sie beschreiben Verschiedenes, etwa zwei Bezugswege) · `keiner` — beide falsch, dein
`wert` gilt · `offen` — nicht entscheidbar. Bei Quellen (`feld` beginnt mit „quellen:“)
heißt `a`/`b`: aufnehmen, `keiner`: verwerfen.

Als Antwort genügen höchstens fünf Zeilen.
