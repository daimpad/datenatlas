// One-off: arbeitet die Feldkorrekturen aus der Prüfliste zum Regelwerk v2 ab
// (pruefliste_auffaellige_eintraege.tsv). Die Prüfliste entstand, weil das
// Regelwerk zwei Sicherheitsventile hat: Reichen die Angaben nicht (Regel 7)
// oder widersprechen sie sich (Regel 8), gibt das Modell den Alttext zurück
// statt zu spekulieren. Genau diese Rückläufer sind hier gelandet.
//
// Bemerkenswert daran: Nicht die überarbeiteten Begründungen waren der Ertrag,
// sondern die verweigerten. Sechs Einträge tragen Objekttypen oder
// Granularitäten, die ihrer eigenen Beschreibung widersprechen — Fehler, die
// eine blind generierende Pipeline zugeschrieben statt aufgedeckt hätte.
//
// Leitlinie wie in datafix-widersprueche.mjs: Korrigiert wird die Seite, die
// erkennbar falsch ist. Öffnungsklassen bleiben unangetastet — sie sind eine
// inhaltliche Bewertung, kein Formfehler, und die Prüfliste verlangt dort
// „prüfen", nicht „ändern".
//
// Run: node scripts/datafix-pruefliste-v2.mjs
import fs from 'fs';

const DIR = 'public/data';

const FIXES = {
  // ── Granularität: aggregierte Größen standen auf Mikrodaten ──────────────
  transportkosten: {
    granularity: 'GR_02',
    why: 'Durchschnittswerte und Kostenentwicklung sind aggregiert, nicht individuell',
  },
  routenoptimierung: {
    // GR_04 heißt „Individuell / Mikrodaten" und meint Personenbezug. Fahrzeiten
    // und Distanzen je Route sind Einzelereignisse ohne Personenbezug — das ist
    // GR_01, nicht GR_04.
    granularity: 'GR_01',
    why: 'Routendaten sind Einzelereignisse, keine personenbezogenen Mikrodaten',
  },

  // ── Objekttyp: „Personenbezogene Daten" bei ausdrücklich anonymen Quellen ─
  'zeugenschutz-programme': {
    object: 'OB_08',
    // Die Einstufung OP_03 bleibt richtig, stützt sich aber auf Geheimhaltung,
    // nicht auf Personenbezug — die Begründung sagt das bereits so.
    why: 'Beschreibung sagt „anonymisiert, aggregiert"; Beschränkung folgt aus Geheimhaltung',
  },
  'v-mann-einsatz-statistik': {
    object: 'OB_08',
    why: 'Beschreibung sagt „aggregiert … keine Einzelfälle"',
  },
  transportvolumen: {
    object: 'OB_08',
    granularity: 'GR_02',
    why: 'aggregierte amtliche Statistik über Gütermengen, kein Personenbezug',
  },
  'strukturdaten-sozialunternehmen': {
    // OB_05 (Geodaten) passte nie: Mitarbeiterzahl und Wirkungsbereich sind
    // Organisationsstrukturdaten. Der Wirkungsbereich hat einen räumlichen
    // Aspekt, macht den Datensatz aber nicht zu Geodaten.
    object: 'OB_08',
    why: 'Mitarbeiterzahl und Wirkungsbereich sind Strukturdaten, keine Geodaten',
  },
};

const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
const seen = new Set();
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
      seen.add(node.id);
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
      if (before.length) { n++; changed++; log.push(`  ${node.id}: ${before.join(', ')}  — ${fix.why}`); }
    }
    (node.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (n) fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

const missing = Object.keys(FIXES).filter(id => !seen.has(id));
console.log(log.join('\n') || '  (keine Änderung nötig)');
if (missing.length) console.log(`  ⚠ nicht gefunden: ${missing.join(', ')}`);
console.log(`  ── ${changed} Einträge korrigiert`);
