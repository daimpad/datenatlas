#!/usr/bin/env node
// Einmalige Korrektur (6. November 2026): Objekttypen der 89 Einträge, deren Granularität
// scripts/datafix-granularitaet-gr04.mjs von GR_04 auf GR_01/GR_02 gesetzt hat. Der Objekttyp war dabei
// unberührt geblieben und passte bei einem Teil nicht zur Beschreibung (Stellungnahmen als Messdaten,
// Sternkataloge als Geodaten, Nutzungsstatistiken als Transaktionsdaten). Jede Zuordnung ist einzeln nach
// der Beschreibung getroffen, kein Suchmuster. 37 von 89 geändert; die übrigen 52 passen oder haben keinen
// besseren Code (Betriebspanels, ifo-Umfragedaten, Simulationsarchive — siehe Ende der Datei).
//
//   node scripts/datafix-objekttyp-nach-gr04.mjs [--dry]     (aus dem Repo-Wurzelverzeichnis)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

// id: [alter Code, neuer Code]
const AENDERUNG = {
  // Statistik / Aggregatdaten: ausgewiesen werden Zahlen über viele Fälle (alle GR_02)
  'oer-materialien': ['OB_02', 'OB_09'],                         // Anzahl, Download-Statistiken
  'stiftungsgruendungs-motive-umfragen': ['OB_02', 'OB_09'],     // Umfrageergebnisse
  'normungs-beitraege': ['OB_04', 'OB_09'],                      // Anzahl Normvorschläge und Kommentare
  'datenmanagementplaene': ['OB_04', 'OB_09'],                   // aggregierte Analyse der Pläne
  'makrooekon-projektionen': ['OB_04', 'OB_09'],                 // Prognosewerte, keine Messung
  'medien-streaming-nutzungszeit-altersgruppen': ['OB_06', 'OB_09'], // Nutzungszeit, kein Medieninhalt
  'streaming-podcast-verweildauer-messung': ['OB_07', 'OB_09'],  // durchschnittliche Verweildauer
  'gfk-buchkaeufer-panel': ['OB_07', 'OB_09'],                   // Käuferreichweiten, Kauffrequenz
  'medien-dlr-dlf-nova-zielgruppe': ['OB_08', 'OB_09'],          // Hörerprofil
  'persistente-identifier': ['OB_08', 'OB_09'],                  // Registrierungszahlen, Wachstumsraten
  'wiss-foerderorg-programmwirkungsdaten': ['OB_08', 'OB_09'],   // Publikationsoutput, Drittmittelhebel
  'base-suchindex': ['OB_08', 'OB_09'],                          // Verteilung und Wachstum des Index
  'panel-attritions-statistiken': ['OB_08', 'OB_09'],            // Stichprobenausfälle nach Grund und Welle
  'sammlungsbestaende-ngo': ['OB_08', 'OB_09'],                  // Anzahl Sammlungsobjekte
  'ehrenamt-qualifizierung': ['OB_08', 'OB_09'],                 // Teilnehmende und Abschlüsse
  'open-access-repositorien': ['OB_08', 'OB_09'],                // Dokumentzahlen, Zugriffsstatistiken
  'datenmanagement-plan': ['OB_08', 'OB_09'],                    // Einhaltung der FAIR-Prinzipien
  // Metadaten: Verzeichnisse und Register, keine Finanz- oder Messdaten
  'repositorium-zertifizierungen': ['OB_03', 'OB_08'],
  'nfdi-konsortien-metadaten': ['OB_03', 'OB_08'],
  'klinische-studien-register': ['OB_03', 'OB_08'],
  'katalogdaten-bibliothek': ['OB_04', 'OB_08'],
  // Textdokumente: Stellungnahmen, Empfehlungen, Berichte, Studien
  'akademie-stellungnahmen': ['OB_04', 'OB_02'],
  'wissenschaftsrat-empfehlungen': ['OB_04', 'OB_02'],
  'interdisziplinaere-expertenpanels': ['OB_04', 'OB_02'],
  'nationale-forschungsagenden': ['OB_04', 'OB_02'],
  'peer-review-programme': ['OB_04', 'OB_02'],
  'wiss-wirtschaftsforschung-sozialtransfer-evaluation': ['OB_04', 'OB_02'], // wie evaluationsberichte
  // Finanzdaten
  'wfi-spe-mikrosimulationsmodell-output': ['OB_04', 'OB_03'],   // Nettoeinkommen; wie mikrosimulation-steuer-transferreformen
  'finanzdienstleister-wertpapier-leerverkaufs-daten': ['OB_07', 'OB_03'], // Positionen, keine Transaktionen
  // Messungen: Sensor- und Beobachtungsdaten, keine Geodaten im Sinn der Erdoberfläche
  'seismologische-daten': ['OB_05', 'OB_04'],
  'geomagnetismus-daten': ['OB_05', 'OB_04'],
  'astronomische-kataloge': ['OB_05', 'OB_04'],
  'radioastronomie-daten': ['OB_05', 'OB_04'],
  'sonnenwetter': ['OB_05', 'OB_04'],
  'meeresforschungsdaten': ['OB_05', 'OB_04'],
  'mfk-bm-probenqualitaet-biodaten': ['OB_08', 'OB_04'],         // RIN-Werte, Konzentrationen
  // Geodaten
  'fernerkundungsdaten': ['OB_06', 'OB_05'],                     // Satellitenaufnahmen
};
// Ohne passenden Code, unverändert: wiss-bbb-iab-betriebspanel, wsp-bbf-betriebspanel,
// sozialpol-mindestlohn-beschaeftigungseffekte (OB_07; Betriebsbefragungen, keine Transaktionen),
// wiss-wirtschaftsforschung-ifo-geschaeftsklima (OB_04; Unternehmensumfrage), simulationsdaten-repositorien
// (OB_05; Simulationen, weder Messung noch Geodaten), mfk-ksm-monitoring-berichte (OB_08; Berichte und Raten).

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
