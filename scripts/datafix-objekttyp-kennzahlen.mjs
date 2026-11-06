#!/usr/bin/env node
// Einmalige Korrektur (6. November 2026): die übrigen 22 Kandidaten der Wortsuche nach Befragungen
// (scripts/datafix-objekttyp-befragungen.mjs), die nicht OB_10 bekamen. 21 davon trugen einen Objekttyp, der ihrer
// Beschreibung widerspricht: Quoten und Anteile als Textdokumente (OB_02), Kennzahlen als Metadaten (OB_08) oder
// Transaktionsdaten (OB_07). Einzeln nach der Beschreibung entschieden. Das LIAB bleibt OB_01.
//
//   node scripts/datafix-objekttyp-kennzahlen.mjs [--dry]     (aus dem Repo-Wurzelverzeichnis)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const AENDERUNG = {
  // Statistik / Aggregatdaten: Quoten, Anteile, Indizes, Mengen aus mehreren Quellen oder abgeleitet
  'gew-organisationsgrad-nach-branche': ['OB_02', 'OB_09'],
  'betriebsrats-wahl-beteiligung': ['OB_02', 'OB_09'],
  'gew-tarifbindungsquoten': ['OB_02', 'OB_09'],
  'gew-aussenseiterquoten-nicht-tarifgebundene-betriebe': ['OB_02', 'OB_09'],
  'wbv-tar-tarifbindung-entwicklung': ['OB_08', 'OB_09'],
  'tarifbindung-sektoral-zeitreihe': ['OB_08', 'OB_09'],
  'gewerkschaft-betriebsratsabdeckung-branchen': ['OB_08', 'OB_09'],
  'gewerkschaft-tarifbindungsquote-westost': ['OB_08', 'OB_09'],
  'parteien-altersstruktur-mitglieder': ['OB_08', 'OB_09'],
  'beschaeftigte-life-sciences': ['OB_08', 'OB_09'],
  'bbf-kq-weiterbildungsbeteiligung': ['OB_08', 'OB_09'],
  'bk-kav-artfair-messekalender-aussteller': ['OB_08', 'OB_09'],
  'mw-mvk-open-air-festival-infrastruktur': ['OB_08', 'OB_09'],
  'pw-mitarb-ueberstundenstatistik': ['OB_08', 'OB_09'],
  'ikt-it-fachkraeftemangel-it': ['OB_07', 'OB_09'],
  'insourcing-trend-indikatoren': ['OB_07', 'OB_09'],
  'steinbruch-betriebsdaten': ['OB_07', 'OB_09'],          // Fördermengen und Zahl der Steinbrüche
  'hw-materialpreisbelastung': ['OB_04', 'OB_09'],         // Preisindex, keine Messung
  // Finanzdaten
  'ud-rsb-rechtsanwaltsumsatz': ['OB_07', 'OB_03'],        // Honorareinnahmen, keine Transaktionen
  // Befragungsdaten (Organisationen): die Befragung ist die einzige Quelle des Datensatzes
  'mv-dmu-newspaywall-conversion': ['OB_08', 'OB_10'],     // Mitgliederbefragungen von VDZ und BDZV
  'vers-lv-betriebliche-altersvorsorge-verbreitung': ['OB_08', 'OB_10'], // Arbeitgeber- und Trägerbefragung
};

const dry = process.argv.includes('--dry');
const offen = new Set(Object.keys(AENDERUNG));
for (const f of readdirSync('public/data').filter(f => f.startsWith('sector_'))) {
  const path = `public/data/${f}`, data = JSON.parse(readFileSync(path, 'utf8'));
  let n = 0;
  (function walk(node) {
    const a = AENDERUNG[node.id];
    if (a && node.level === 4) {
      const ob = node.details.object;
      if (ob.code !== a[0]) throw new Error(`${node.id}: erwartet ${a[0]}, gefunden ${ob.code}`);
      ob.code = a[1];
      if ('label' in ob) ob.label = LABELS[a[1]];
      offen.delete(node.id); n++;
    }
    (node.children ?? []).forEach(walk);
  })(data);
  if (n && !dry) writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  if (n) console.log(`${f}: ${n}`);
}
if (offen.size) { console.error('nicht gefunden:', [...offen]); process.exit(1); }
console.log(`${Object.keys(AENDERUNG).length} Objekttypen ${dry ? 'geprüft (--dry)' : 'geändert'}`);
