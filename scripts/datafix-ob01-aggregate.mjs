// One-off: korrigiert Einträge, die als „Personenbezogene Daten" (OB_01)
// geführt werden, obwohl ihre eigene Beschreibung sie als aggregiert oder
// anonymisiert ausweist.
//
// Der Befund entstand beim Durcharbeiten der kurzen OP_01-Begründungen: Immer
// wieder war OB_01 gesetzt, wo die Beschreibung „Aggregierte Auswertungen …"
// oder „Anonymisierte Statistik …" sagte. Einzeln korrigiert waren das bis
// hierher sechs Fälle; die systematische Suche findet 258.
//
// Das ist eine Massenkorrektur, und die sind in diesem Projekt zu Recht
// verdächtig. Deshalb ist die Auswahl eng geführt:
//
//   • Beleg ist ausschließlich die BESCHREIBUNG. Die Begründung taugt nicht:
//     allein „Aggregierte amtliche Statistik ohne Personenbezug; regulär als
//     Open Data publizierbar." steht wortgleich bei 329 Einträgen und ist
//     damit kein Nachweis über den einzelnen Eintrag, sondern eine Floskel.
//   • Nennt die Beschreibung personenbezogene Inhalte (Name, Adresse,
//     Geburtsdatum, Stammdaten …), ist der Eintrag ausgenommen — auch wenn
//     irgendwo „aggregiert" vorkommt.
//
// Zielwerte nach der Hauskonvention aus datafix-widersprueche.mjs:
//   OB_01 → OB_08  aggregierte Statistik
//   GR_04 → GR_02  wo die Beschreibung ausdrücklich aggregiert sagt; GR_04
//                  meint personenbezogene Mikrodaten (siehe CLAUDE.md).
//
// Die Öffnungsklassen bleiben unangetastet. Ein falscher Objekttyp sagt nichts
// darüber, ob der Datensatz publizierbar ist.
//
// Run: node scripts/datafix-ob01-aggregate.mjs [--dry]
import fs from 'fs';

const DIR = 'public/data';
const dry = process.argv.includes('--dry');

const NEG = /\b(anonymisiert\w*|aggregiert\w*|ohne personenbezug|keine personenbezogenen|ohne einzelfallbezug|ohne individuelle|ohne rückschluss auf einzel)/i;
const POS = /\b(name|namen|adresse|geburtsdatum|personenbezogene|stammdaten|einzelperson|klarname|kontaktdaten|erziehungsberechtigte)\b/i;
// „aggregiert" muss sich auf den Datensatz beziehen, nicht auf einen Vorgang.
const AGGREGIERT = /\b(aggregiert\w*|zusammengefasst\w*|summiert\w*|anonymisiert\w*)/i;

const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
let nObj = 0, nGran = 0;
const log = [];

for (const s of main) {
  if (!s.subFile) continue;
  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const hadNL = raw.endsWith('\n');
  const data = JSON.parse(raw);
  let dirty = 0;

  (function walk(n) {
    if (n.level === 4 && n.details?.object?.code === 'OB_01') {
      const d = n.details;
      const desc = d.description ?? '';
      if (NEG.test(desc) && !POS.test(desc)) {
        const parts = [];
        d.object.code = 'OB_08'; parts.push('object OB_01→OB_08'); nObj++;
        if (d.granularity?.code === 'GR_04' && AGGREGIERT.test(desc)) {
          d.granularity.code = 'GR_02'; parts.push('granularity GR_04→GR_02'); nGran++;
        }
        log.push(`  ${n.id}: ${parts.join(', ')}`);
        dirty++;
      }
    }
    (n.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (dirty && !dry) fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

console.log(log.slice(0, 15).join('\n'));
if (log.length > 15) console.log(`  … und ${log.length - 15} weitere`);
console.log(`\n  ── ${nObj} Objekttypen, ${nGran} Granularitäten korrigiert${dry ? ' (Probelauf)' : ''}`);
