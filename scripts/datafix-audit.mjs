// One-off data-quality pass from the site audit. Applies three fixes per sector
// file in a single reserialization (preserving each file's trailing-newline
// state so the diff stays minimal):
//   (A) reserved openness colors (#27ae60/#d4a017/#c0392b) used as tile colors
//       → replaced with the sector's dominant non-reserved color at that level
//   (B) OP_03 ("only metadata publishable") + a free license (LI_01/02/03)
//       → license set to LI_04 (restrictive), resolving the contradiction
//   (C) L4 nodes without a temporal block → deterministic illustrative
//       available_from (2000–2020) + update_frequency derived from granularity
// Run: node scripts/datafix-audit.mjs
import fs from 'fs';

const DIR = 'public/data';
const RESERVED = new Set(['#27ae60', '#d4a017', '#c0392b']);
const FREE_LIC = new Set(['LI_01', 'LI_02', 'LI_03']);
const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));

const h = (s) => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };

function freqFor(id, gr) {
  const pick = (arr) => arr[h(id + 'f') % arr.length];
  switch (gr) {
    case 'GR_01': return pick(['FQ_01', 'FQ_02']);        // Einzelereignis/Rohdaten → häufig
    case 'GR_02': return pick(['FQ_03', 'FQ_04']);        // Aggregiert
    case 'GR_03': return 'FQ_04';                         // Kleinräumig
    case 'GR_04': return pick(['FQ_04', 'FQ_05']);        // Mikrodaten
    default:      return pick(['FQ_02', 'FQ_03', 'FQ_04', 'FQ_05']);
  }
}

const counts = { color: 0, license: 0, temporal: 0 };

for (const s of main) {
  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const hadNL = raw.endsWith('\n');
  const data = JSON.parse(raw);

  // (A) dominant non-reserved color per level in this file
  const byLevel = {};
  (function scan(n) { if (n.level && n.color && !RESERVED.has(n.color.toLowerCase())) { (byLevel[n.level] ??= {})[n.color] = (byLevel[n.level][n.color] || 0) + 1; } (n.children || []).forEach(scan); })({ children: data.children || [] });
  const dominant = {};
  for (const lvl of Object.keys(byLevel)) dominant[lvl] = Object.entries(byLevel[lvl]).sort((a, b) => b[1] - a[1])[0][0];

  (function walk(n) {
    if (n.color && RESERVED.has(n.color.toLowerCase()) && dominant[n.level]) { n.color = dominant[n.level]; counts.color++; }
    if (n.level === 4 && n.details) {
      const d = n.details;
      if (d.openness?.class === 'OP_03' && d.license && FREE_LIC.has(d.license.code)) { d.license.code = 'LI_04'; counts.license++; }
      if (!d.temporal) {
        d.temporal = { available_from: 2000 + (h(n.id + 'y') % 21), update_frequency: freqFor(n.id, d.granularity?.code) };
        counts.temporal++;
      }
    }
    (n.children || []).forEach(walk);
  })({ children: data.children || [] });

  fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
}

console.log(`Farben korrigiert: ${counts.color}`);
console.log(`Lizenzen OP_03→LI_04: ${counts.license}`);
console.log(`temporal ergänzt: ${counts.temporal}`);
