#!/usr/bin/env node
// Einmalige Korrektur (6. November 2026): 102 Datentypen trugen GR_04 (personenbezogene Mikrodaten)
// ohne den Objekttyp OB_01. Die Beschreibungen zeigen: 89 sind Verzeichnisse, Berichte, Messreihen,
// Betriebsdaten oder Auswertungen, keine Daten über natürliche Personen. Sie stehen jetzt auf GR_01
// (einzelne Datensätze, Dokumente, Messungen) oder GR_02 (ausgewertet). 13 beschreiben tatsächlich
// Datensätze über Personen oder Haushalte und behalten GR_04, ihr Objekttyp ist nun OB_01.
// Jede Zuordnung ist einzeln getroffen (kein Suchmuster), Quelle der Entscheidung: die Beschreibung.
//
//   node scripts/datafix-granularitaet-gr04.mjs [--dry]     (aus dem Repo-Wurzelverzeichnis)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const P = 'OB_01'; // behalten GR_04, Objekttyp wird OB_01
const ZUORDNUNG = {
  // Datensätze über Personen oder Haushalte: GR_04 bleibt, Objekttyp OB_01
  'musikwirtschaft-streaming-urhebervergaetung': [4, P], 'fi-dat-querscnittstudien': [4, P],
  'wiss-forschungsinstitut-umfragedaten': [4, P], 'expertendatenbank': [4, P],
  'akademiemitglieder-verzeichnis': [4, P], 'steuerforschungsdaten': [4, P],
  'wfi-spe-arbeitsmarkt-panel': [4, P], 'haw-ds-kompetenzmessung': [4, P],
  'swi-sur-interviewereffekte': [4, P], 'sozialwiss-ungleichheit-einkommensdaten': [4, P],
  'wiss-ungleich-vermoegensverteilung-hfcs': [4, P], 'seltene-erkrankungen-register': [4, P],
  'bibb-erwachsenenbefragung-piaac': [4, P],
  // einzelne Datensätze, Dokumente, Messungen, Verzeichniseinträge: GR_01
  'bfr-forschungsdaten-tiergesundheit': [1], 'finanzdienstleister-wertpapier-leerverkaufs-daten': [1],
  'mv-vml-sortiment-warenkorbanalyse': [1], 'repositorium-zertifizierungen': [1], 'akademie-stellungnahmen': [1],
  'wissenschaftsrat-empfehlungen': [1], 'interdisziplinaere-expertenpanels': [1], 'nationale-forschungsagenden': [1],
  'peer-review-programme': [1], 'wissenschaftspreise-akademie': [1], 'internationale-akademiekooperationen': [1],
  'foerderprojektdatenbank': [1], 'exzellenzstrategie-daten': [1], 'produktivitaetsmessung-panel': [1],
  'befragungspanel-metadaten': [1], 'wiss-wirtschaftsforschung-ifo-geschaeftsklima': [1],
  'sozialpol-mindestlohn-beschaeftigungseffekte': [1], 'deal-oa-vertraege': [1], 'katalogdaten-bibliothek': [1],
  'normdaten-gnd': [1], 'nfdi-konsortien-metadaten': [1], 'ontologien-terminologien': [1],
  'simulationsdaten-repositorien': [1], 'laengsschnitt-kohorten-metadaten': [1], 'gerichts-urteilsdatenbanken': [1],
  'legal-tech-daten': [1], 'datenschutz-compliance': [1], 'seismologische-daten': [1], 'fernerkundungsdaten': [1],
  'geomagnetismus-daten': [1], 'astronomische-kataloge': [1], 'geodaetische-referenzdaten': [1],
  'radioastronomie-daten': [1], 'sonnenwetter': [1], 'meeresforschungsdaten': [1], 'klinische-studien-register': [1],
  'biobank-katalog': [1], 'genomik-metadaten': [1], 'mfk-bm-probenqualitaet-biodaten': [1],
  'medizin-biobank-probenmetadaten': [1], 'wiss-bbb-iab-betriebspanel': [1], 'wsp-bbf-betriebspanel': [1],
  'curriculum-daten': [1], 'foerderprogrammkatalog': [1], 'jahresabschluss-ngo': [1], 'jahres-wirkungsberichte': [1],
  'evaluationsberichte': [1], 'praeventionskampagnen-bericht': [1], 'forschungsprojektkatalog': [1],
  'forschungsdaten-open': [1], 'citizen-science-projekte': [1], 'entwicklungsprojekte-katalog': [1],
  'positionspapiere': [1], 'gesetzgebungsmonitoring': [1], 'konsultationsbeitraege': [1], 'organisationsverzeichnis': [1],
  'kooperationsvereinbarungen': [1], 'netzwerktreffen-protokolle': [1], 'berufsverband-verzeichnis': [1],
  'tarifvertrag-verzeichnis': [1], 'netzpolitik-monitoring': [1],
  // ausgewertet, aggregiert: GR_02
  'medien-dlr-dlf-nova-zielgruppe': [2], 'medien-streaming-nutzungszeit-altersgruppen': [2],
  'streaming-podcast-verweildauer-messung': [2], 'gfk-buchkaeufer-panel': [2], 'normungs-beitraege': [2],
  'persistente-identifier': [2], 'repositorium-interoperabilitaet': [2], 'datenmanagementplaene': [2],
  'wiss-foerderorg-programmwirkungsdaten': [2], 'makrooekon-projektionen': [2],
  'mikrosimulation-steuer-transferreformen': [2], 'wfi-spe-mikrosimulationsmodell-output': [2],
  'wiss-wirtschaftsforschung-sozialtransfer-evaluation': [2], 'base-suchindex': [2], 'panel-attritions-statistiken': [2],
  'wiss-sozialwiss-einkommensverteilung': [2], 'mfk-ksm-monitoring-berichte': [2], 'wirkstoff-first-in-human-daten': [2],
  'sammlungsbestaende-ngo': [2], 'oer-materialien': [2], 'ehrenamt-qualifizierung': [2], 'zivilgesellschaft-bericht': [2],
  'drittmittelstatistik': [2], 'open-access-repositorien': [2], 'datenmanagement-plan': [2], 'remittances-analyse': [2],
  'genossenschaftsfoerderung': [2], 'stiftungsgruendungs-motive-umfragen': [2],
};

const dry = process.argv.includes('--dry');
const gesehen = new Set(); const log = []; let n = 0;
for (const f of readdirSync('public/data').filter(f => /^sector_.*\.json$/.test(f))) {
  const pfad = `public/data/${f}`; const roh = readFileSync(pfad, 'utf8'); const j = JSON.parse(roh); let geaendert = false;
  (function w(k) {
    if (k.level === 4) {
      const d = k.details;
      if (d.granularity.code === 'GR_04' && d.object.code !== 'OB_01') {
        const z = ZUORDNUNG[k.id];
        if (!z) throw new Error(`keine Zuordnung für ${k.id}`);
        gesehen.add(k.id);
        const gr = `GR_0${z[0]}`;
        if (gr !== 'GR_04') { d.granularity.code = gr; if ('label' in d.granularity) d.granularity.label = LABELS[gr]; }
        if (z[1]) { d.object.code = z[1]; if ('label' in d.object) d.object.label = LABELS[z[1]]; }
        geaendert = true; n++; log.push(`${k.id}: ${gr}${z[1] ? ' + ' + z[1] : ''}`);
      }
    }
    (k.children || []).forEach(w);
  })(j);
  if (geaendert && !dry) writeFileSync(pfad, JSON.stringify(j, null, 2) + (roh.endsWith('\n') ? '\n' : ''));
}
const fehlend = Object.keys(ZUORDNUNG).filter(id => !gesehen.has(id));
if (fehlend.length) throw new Error(`Zuordnung ohne Treffer: ${fehlend.join(', ')}`);
console.log(`${n} Einträge ${dry ? '(Probelauf)' : 'geändert'}`);
