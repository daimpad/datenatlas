#!/usr/bin/env node
// Einmalige Korrektur (6. November 2026): Vier Einträge beschreiben Datensätze, die sich in den Prüfläufen
// (Runde 4 und 6, je zwei Sonnet-Läufe und Opus am Beleg) nicht belegen ließen. Die Beschreibung sagt das jetzt
// selbst und nennt nur, was belegt ist; die Zitate stehen in scripts/quellenpruefung/runden/4 und /6
// (entscheidung.json) und sind maschinell auf ihren Seiten wiedergefunden. Codes, Id und Name bleiben:
// ohne Beleg weder ein Vorbehalt noch eine freie Lizenz. Die Öffnungsbegründungen schreibt
// apply-begruendungen.mjs (runden/6/begruendungen-nicht-belegbar.json).
//
//   node scripts/datafix-nicht-belegbare-datensaetze.mjs [--dry]     (aus dem Repo-Wurzelverzeichnis)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const NEU = {
  'krankenhaus-casemix-index-zeitreihe':
    'Eine Zeitreihe des Case-Mix-Index nach Fachabteilung ist nicht belegbar; der Eintrag bleibt eine Einschätzung. ' +
    'Der strukturierte Qualitätsbericht nach § 136b SGB V, den jedes Krankenhaus jährlich je Standort erstellt, enthält ' +
    'keinen Case-Mix-Index, sondern je Fachabteilung Fallzahlen, Hauptdiagnosen nach ICD-10 und Prozeduren nach OPS.',
  'krankenhaus-unfreiwillige-wiederaufnahmen-rate':
    'Eine Rate ungeplanter Wiederaufnahmen innerhalb von 30 Tagen nach Fachabteilung ist weder als QUIPS-Indikator noch im ' +
    'gesetzlichen Qualitätsbericht belegbar; der Eintrag bleibt eine Einschätzung. QUIPS ist ein Benchmarking-Projekt zur ' +
    'postoperativen Schmerztherapie unter Leitung der Klinik für Anästhesiologie und Intensivmedizin des Universitätsklinikums ' +
    'Jena. Der jährliche strukturierte Qualitätsbericht nach § 136b SGB V enthält keine Wiederaufnahmerate.',
  'gt-tour-reiseveranstalter-insolvenzstatistik':
    'Eine Statistik insolventer Reiseveranstalter und betroffener Reisender nach Größenklasse von Creditreform oder dem BMWK ' +
    'ist nicht belegbar; der Eintrag bleibt eine Einschätzung. Die amtliche Insolvenzstatistik des Statistischen Bundesamts ' +
    'liefert monatlich Informationen über die Zahl der beantragten und eröffneten Insolvenzverfahren und erfragt unter anderem ' +
    'Wirtschaftszweig, Rechtsform, Gründungsjahr und Zahl der Arbeitnehmer; ob sie Reiseveranstalter einzeln ausweist, ist nicht geprüft.',
  'fdi-vers-haftpflicht-deckungssummen':
    'Eine Verteilung vereinbarter Deckungssummen in der privaten und gewerblichen Haftpflichtversicherung ist in den „Statistiken ' +
    'zur deutschen Versicherungswirtschaft 2026“ des GDV nicht belegbar; der Begriff Deckungssumme kommt dort nicht vor. Für die ' +
    'Allgemeine Haftpflichtversicherung weist der GDV nur die Geschäftsentwicklung des inländischen Direktgeschäfts aus: Zahl der ' +
    'Versicherungsunternehmen, Beiträge, Leistungen, Schadenquote und Combined Ratio. Der Eintrag bleibt eine Einschätzung.',
};

const dry = process.argv.includes('--dry'); let n = 0;
for (const f of readdirSync('public/data').filter(f => /^sector_.*\.json$/.test(f))) {
  const pfad = `public/data/${f}`, roh = readFileSync(pfad, 'utf8'), j = JSON.parse(roh); let geaendert = false;
  (function w(k) {
    if (k.level === 4 && NEU[k.id]) { k.details.description = NEU[k.id]; geaendert = true; n++; }
    (k.children || []).forEach(w);
  })(j);
  if (geaendert && !dry) writeFileSync(pfad, JSON.stringify(j, null, 2) + (roh.endsWith('\n') ? '\n' : ''));
}
if (n !== Object.keys(NEU).length) throw new Error(`erwartet ${Object.keys(NEU).length}, gefunden ${n}`);
console.log(`${n} Beschreibungen ${dry ? '(Probelauf)' : 'ersetzt'}`);
