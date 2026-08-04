// One-off: löst die 8 vom Validator gemeldeten Widersprüche zwischen
// Beschreibung und Metadaten auf (siehe Qualitätsbericht in validate-data.js).
//
// Leitlinie: Es wird die Seite korrigiert, die erkennbar falsch ist — nicht die
// bequemere. Zwei Muster:
//
//   A/B  Die Beschreibung sagt zutreffend, dass kein Personenbezug besteht
//        (aggregierte bzw. anonymisierte Statistiken), das Feld object stand
//        aber auf OB_01. Korrigiert wird das Feld. Zielwert nach Hauskonvention:
//        OB_08 für aggregierte Statistiken (30 % der eindeutig aggregierten
//        Einträge), OB_04 für Messwerte, OB_07 für Transaktionen.
//
//   C    Die Beschreibung behauptet, es seien "keine unternehmensspezifischen
//        oder vertraulichen Details" enthalten — obwohl die Einstufung OP_03
//        lautet und die Öffnungsbegründung das Gegenteil sagt
//        ("wettbewerbssensitiv", "proprietär"). Hier ist die Beschreibung zu
//        optimistisch: Tarifstrukturen, Fuhrparkauslastung und Routingdaten
//        sind sehr wohl wettbewerbsrelevant. Der unbelegte Satz entfällt; die
//        Einstufung bleibt.
//
// Run: node scripts/datafix-widersprueche.mjs
import fs from 'fs';

const DIR = 'public/data';

const FIXES = {
  // ── A: Objekttyp korrigieren (Beschreibung hat recht) ────────────────────
  buchungsstatistiken: {
    object: 'OB_07',        // Buchungen sind Transaktionen
    granularity: 'GR_02',   // Beschreibung sagt "Aggregierte", nicht Mikrodaten
    why: 'aggregierte Buchungstransaktionen, kein Personenbezug',
  },
  wasserversorgung_abwasser: {
    object: 'OB_04',        // Verbrauch, Qualität, Auslastung = Messwerte
    why: 'Messwerte der Ver- und Entsorgung, kein Personenbezug',
  },
  kundenfeedback: {
    object: 'OB_08',        // aggregierte Kennzahlen
    why: 'aggregierte Qualitätskennzahlen, kein Personenbezug',
  },
  'meisterpruefungen-wirtschaft': {
    object: 'OB_08',        // Prüfungsstatistik
    why: 'aggregierte Prüfungsstatistik, kein Personenbezug',
  },

  // ── B: wie A, Beratungsstellen ───────────────────────────────────────────
  'humanismus-beratungsstellen-nutzung': {
    object: 'OB_08',
    // Öffnungsklasse bleibt bewusst OP_02: Beratungsdaten nach Beratungstyp und
    // Problematik können in kleinen Gruppen trotz Anonymisierung
    // reidentifizierend wirken. Die Aggregationsanforderung bleibt bestehen.
    why: 'anonymisierte Nutzungsstatistik, kein Personenbezug',
  },

  // ── C: Beschreibung korrigieren (Einstufung hat recht) ───────────────────
  transportkosten: {
    object: 'OB_03',        // Kostendaten sind Finanzdaten, nicht Geodaten
    dropSentence: 'Enthält keine unternehmensspezifischen Daten.',
    why: 'Tarifstrukturen sind wettbewerbssensitiv — Satz war unbelegt',
  },
  flottenmanagement: {
    object: 'OB_04',        // Auslastung, Wartung, Verbrauch = Messwerte
    dropSentence: 'Enthält keine unternehmensspezifischen oder vertraulichen Details.',
    why: 'Fuhrparkauslastung ist betriebsintern — Satz war unbelegt',
  },
  routenoptimierung: {
    object: 'OB_04',        // Fahrzeiten, Distanzen, Verbrauch = Messwerte
    dropSentence: 'Enthält keine unternehmensspezifischen oder vertraulichen Details.',
    why: 'Routingdaten sind proprietär — Satz war unbelegt',
  },
};

const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
let changed = 0;
const log = [];

for (const s of main) {
  if (!s.subFile) continue;
  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const hadNL = raw.endsWith('\n');
  const data = JSON.parse(raw);
  let n = 0;

  (function walk(node) {
    const fix = FIXES[node.id];
    if (node.level === 4 && fix) {
      const d = node.details;
      const before = [];
      if (fix.object && d.object?.code !== fix.object) {
        before.push(`object ${d.object.code}→${fix.object}`);
        d.object.code = fix.object;
      }
      if (fix.granularity && d.granularity?.code !== fix.granularity) {
        before.push(`granularity ${d.granularity.code}→${fix.granularity}`);
        d.granularity.code = fix.granularity;
      }
      if (fix.dropSentence && d.description.includes(fix.dropSentence)) {
        d.description = d.description.replace(fix.dropSentence, '').replace(/\s+$/, '');
        before.push('Behauptungssatz entfernt');
      }
      if (before.length) { n++; changed++; log.push(`  ${node.id}: ${before.join(', ')}  — ${fix.why}`); }
    }
    (node.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (n) fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

console.log(log.join('\n'));
console.log(`  ── ${changed} Einträge korrigiert`);
