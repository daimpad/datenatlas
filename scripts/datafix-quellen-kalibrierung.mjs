// Korrektur aus der Kalibrierung der Quellenprüfung — 2026-11-05.
//
// Die Kalibrierung (scripts/quellenpruefung/kalibrierung/) hat die 16 Einträge
// der dritten Runde mit Sonnet 5.5 und festem Prüfbogen ein zweites Mal
// prüfen lassen. Wo beide Läufe auseinanderlagen, wurde am Beleg entschieden.
// Einmal lag die dritte Runde falsch, und der Fehler stand seit #163 live:
//
//   breitbandversorgung-geodaten — Lizenz LI_05 → LI_03. Runde 3 hatte die
//   Nutzungsbedingungen der Seite gelesen und eine Datenlizenz Deutschland
//   „nicht genannt“ gefunden. Das Impressum desselben Portals sagt es aber
//   ausdrücklich für die Downloads: „Die auf der Internetseite verwendeten
//   Daten in den Formaten .xls, .xlsx ,.csv und .gpkg stehen, falls nicht
//   anders gekennzeichnet, unter der Datenlizenz Deutschland – Namensnennung –
//   Version 2.0.“ Die Nutzungsbedingungen gelten für die Seite, das Impressum
//   regelt die Daten.
//
// Aufruf aus dem Repo-Wurzelverzeichnis: node scripts/datafix-quellen-kalibrierung.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const path = 'public/data/sector_staat.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
let done = false;

(function walk(n) {
  if (n.id === 'breitbandversorgung-geodaten' && n.level === 4) {
    const d = n.details;
    if (d.license?.code !== 'LI_05') throw new Error(`unerwartete Lizenz ${d.license?.code}`);
    d.license = { code: 'LI_03' };
    d.sources.push({
      title: 'Impressum',
      publisher: 'Bundesnetzagentur (Gigabit-Grundbuch)',
      url: 'https://gigabitgrundbuch.bund.de/GIGA/DE/Impressum/start.html',
      checked: '2026-11-05',
      supports: 'Daten in xls, xlsx, csv und gpkg unter Datenlizenz Deutschland – Namensnennung 2.0',
    });
    done = true;
  }
  (n.children ?? []).forEach(walk);
})(data);

if (!done) { console.error('breitbandversorgung-geodaten nicht gefunden'); process.exit(1); }
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('korrigiert: breitbandversorgung-geodaten, Lizenz LI_03');
