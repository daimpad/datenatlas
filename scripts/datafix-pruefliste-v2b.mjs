// One-off: die beiden offenen Entscheidungen aus der Prüfliste zum Regelwerk v2.
//
// ── 1. kita-sprachstanderhebung: Granularität ────────────────────────────────
// Die Prüfliste schlug vor, Erhebungs- und Ausweisungsebene als getrennte
// Felder zu führen. Dagegen sprechen zwei Dinge: es wäre ein Pflichtfeld für
// alle 10.149 Einträge, und der Atlas bewertet Veröffentlichbarkeit — dafür
// zählt die Ebene, auf der der beschriebene Datensatz existiert, nicht die, auf
// der einmal erhoben wurde. Also keine Modelländerung, sondern eine
// festgeschriebene Lesart (siehe CLAUDE.md, „Granularität"):
//
//   granularity = Ausweisungsebene des beschriebenen Datenprodukts.
//
// Diese Lesart entspricht dem, was in datafix-widersprueche.mjs und
// datafix-pruefliste-v2.mjs bereits angewandt wurde (GR_04 → GR_02, sobald die
// Beschreibung „aggregiert" sagt).
//
// Ein Massenlauf über den Bestand wäre trotzdem falsch: Ein Suchmuster findet
// 136 Einträge mit GR_03 und Bund/Land-Wörtern in der Beschreibung, aber
// staat-vergleichsarbeiten etwa beschreibt „bundesweite Vergleichsarbeiten …
// auf Kreisebene" — bundesweit erhoben, kleinräumig ausgewiesen, GR_03 also
// richtig. Genau die Verwechslung, um die es geht, steckt im Suchmuster selbst.
// Deshalb hier nur der eine Eintrag, den die Prüfliste benennt und dessen
// Beschreibung ausschließlich die Landesebene nennt.
//
// ── 2. nachhilfemarkt / nachhilfe-marktvolumen: Abgrenzung ───────────────────
// Zwei Einträge im selben L3 mit weitgehend deckungsgleichem Inhalt. Statt
// zusammenzuführen (kostet eine id und damit jeden Deep-Link darauf) werden sie
// entlang einer klaren Achse getrennt:
//
//   nachhilfe-marktvolumen → Geld    (Umsatz nach Segment)
//   nachhilfemarkt         → Struktur (Anbieterzahl und Schüleranteile)
//
// Die Änderungen sind bewusst rein subtraktiv: Jeder Eintrag verliert das
// Element, das beim anderen besser aufgehoben ist. Nichts wird hinzuerfunden.
// Die Begründungen werden nur so weit nachgezogen, wie sie das entfernte
// Element nennen — sonst widerspräche die Begründung ihrer eigenen
// Beschreibung.
//
// Run: node scripts/datafix-pruefliste-v2b.mjs
import fs from 'fs';

const DIR = 'public/data';

const FIXES = {
  'kita-sprachstanderhebung': {
    granularity: 'GR_02',
    why: 'Beschreibung weist nach Bundesland aus; GR_03 wäre Stadtteil/Gemeinde',
  },

  nachhilfemarkt: {
    name: 'Anbieterstruktur Nachhilfemarkt',
    description: 'Anzahl der Anbieter und Schüleranteile im Nachhilfebereich.',
    explanation: 'Anbieterscharfe Schüleranteile sind wettbewerbssensitiv; als Anbieterzahl '
      + 'und Anteilswerte über die Branche aggregiert sind sie ohne Personenbezug publizierbar.',
    why: 'Marktvolumen entfernt — liegt bei nachhilfe-marktvolumen',
  },
  'nachhilfe-marktvolumen': {
    description: 'Umsatz des privaten Nachhilfemarkts nach Segment.',
    explanation: 'Der Umsatz einzelner Anbieter ist ein Geschäftsdatum; die Segmentsumme entsteht '
      + 'durch Aggregation über Anbieter und ist dann ohne Rückschluss auf einzelne Unternehmen publizierbar.',
    why: 'Teilnehmerzahlen entfernt — liegen bei nachhilfemarkt',
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
      if (fix.granularity && d.granularity?.code !== fix.granularity) {
        before.push(`granularity ${d.granularity.code}→${fix.granularity}`);
        d.granularity.code = fix.granularity;
      }
      if (fix.name && node.name !== fix.name) {
        before.push(`name „${node.name}" → „${fix.name}"`);
        node.name = fix.name;
      }
      if (fix.description && d.description !== fix.description) {
        before.push('Beschreibung abgegrenzt');
        d.description = fix.description;
      }
      if (fix.explanation && d.openness?.explanation !== fix.explanation) {
        before.push('Begründung nachgezogen');
        d.openness.explanation = fix.explanation;
      }
      if (before.length) { n++; changed++; log.push(`  ${node.id}: ${before.join(', ')}\n      ${fix.why}`); }
    }
    (node.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (n) fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

const missing = Object.keys(FIXES).filter(id => !seen.has(id));
console.log(log.join('\n') || '  (keine Änderung nötig)');
if (missing.length) console.log(`  ⚠ nicht gefunden: ${missing.join(', ')}`);
console.log(`  ── ${changed} Einträge geändert`);
