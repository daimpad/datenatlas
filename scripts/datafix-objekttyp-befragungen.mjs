#!/usr/bin/env node
// Einmalige Korrektur (6. November 2026): neuer Objekttyp OB_10 „Befragungsdaten (Organisationen)“.
// Das Vokabular kannte keine Daten aus Befragungen von Betrieben, Unternehmen, Verbandsmitgliedern oder
// Trägern; Betriebspanels und Konjunkturumfragen standen deshalb auf Transaktions-, Mess-, Meta-, Finanz- oder
// sogar Personendaten. OB_10 gilt, wenn die Befragung selbst der beschriebene Datensatz ist (Antworten oder
// ihre direkt veröffentlichten Ergebnisse wie Geschäftsklimaindizes). Kennzahlen, die eine Befragung nur als
// eine von mehreren Quellen nutzen, behalten ihren Code (etwa IT-Fachkräftemangel, Insourcing, Anwaltsumsatz,
// Tarifbindungsquoten aus dem IAB-Betriebspanel); das LIAB bleibt personenbezogen (OB_01).
// Kandidaten aus einer Wortsuche (55), jede Zuordnung einzeln nach der Beschreibung (33).
//
//   node scripts/datafix-objekttyp-befragungen.mjs [--dry]     (aus dem Repo-Wurzelverzeichnis)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const ALT = {   // id: bisheriger Code
  'galerienumsaetze-bundesverband-deutscher-galerien': 'OB_03', 'vhs-wb-trägerbefragung-qualitaetssicherung': 'OB_08',
  'kwb-branchenbarometer-ihk': 'OB_08', 'kapazitaetsauslastung-maschinenbau': 'OB_07',
  'bau-konj-stimmungsindex-handwerker': 'OB_08', 'dehoga-konjunktur': 'OB_08', 'handwerk-digitalisierungs-reifegrad': 'OB_07',
  'handwerk-energiekosten': 'OB_03', 'hw-kj-energiepreis-kostenbelastung': 'OB_07', 'hw-konj-energiekosten-belastung': 'OB_03',
  'hw-konjunkturumfrage-zdh': 'OB_04', 'wirtschaft-handwerk-konjunkturumfrage': 'OB_07',
  'auto-nearshoring-verlagerungen-ifo': 'OB_03', 'vci-chemiekonjunktur-quartal': 'OB_04',
  'unternehmensumfragen-konjunktur': 'OB_01', 'wfi-kw-exporterwartungen-panel': 'OB_07',
  'wiss-wirtschaftsforschung-ifo-geschaeftsklima': 'OB_04', 'konjunktur-exporterwartungen-panel': 'OB_07',
  'wsp-wifo-geschaeftsklima-index': 'OB_07', 'sozialpol-mindestlohn-beschaeftigungseffekte': 'OB_07',
  'iab-betriebspanel-beschaeftigung': 'OB_08', 'bbf-iab-stellenerhebung': 'OB_02', 'wiss-bbb-iab-betriebspanel': 'OB_07',
  'berufsbildung-betriebliche-weiterbildung': 'OB_02', 'wsp-bbf-betriebspanel': 'OB_07', 'konjunkturumfrage': 'OB_08',
  'investitionsklima-index-verband': 'OB_08', 'dihk-konjunkturumfrage-branche-region': 'OB_08',
  'wbv-wvk-fachkraeftemangel-monitor': 'OB_08', 'zivil-wirtverb-konjunktur-umfragen': 'OB_08',
  'zsp-wbv-branchenumfragen': 'OB_07', 'zivil-wbv-wv-konjunkturumfragen': 'OB_07', 'instandhaltungskosten-benchmark': 'OB_03',
};

const dry = process.argv.includes('--dry');
const offen = new Set(Object.keys(ALT));
for (const f of readdirSync('public/data').filter(f => f.startsWith('sector_'))) {
  const path = `public/data/${f}`, data = JSON.parse(readFileSync(path, 'utf8'));
  let n = 0;
  (function walk(node) {
    if (node.level === 4 && ALT[node.id]) {
      const ob = node.details.object;
      if (ob.code !== ALT[node.id]) throw new Error(`${node.id}: erwartet ${ALT[node.id]}, gefunden ${ob.code}`);
      ob.code = 'OB_10';
      if ('label' in ob) ob.label = LABELS.OB_10;
      offen.delete(node.id); n++;
    }
    (node.children ?? []).forEach(walk);
  })(data);
  if (n && !dry) writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  if (n) console.log(`${f}: ${n}`);
}
if (offen.size) { console.error('nicht gefunden:', [...offen]); process.exit(1); }
console.log(`${Object.keys(ALT).length} Einträge auf OB_10 ${dry ? 'geprüft (--dry)' : 'gesetzt'}`);
