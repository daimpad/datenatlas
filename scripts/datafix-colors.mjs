// One-off cleanup: normalise every L2/L3/L4 tile color to the intended
// per-level color of its sector (see the table in CLAUDE.md). Removes the
// legacy drift left over from earlier sector layouts and the Medien→Kultur
// split — e.g. Staat-blue tiles inside Medien, or Wissenschaft L3 nodes still
// carrying the L2 color.
//
// Kultur additionally gets its own palette derived from its L1 gradient
// (#701a75 → #a21caf) instead of the pink it inherited from Medien.
//
// File formatting (2-space indent, trailing-newline state) is preserved so the
// diff stays limited to the changed color lines.
// Run: node scripts/datafix-colors.mjs
import fs from 'fs';

const DIR = 'public/data';
const RESERVED = new Set(['#27ae60', '#d4a017', '#c0392b']);

const PALETTE = {
  staat:             { 2: '#2980b9', 3: '#3498db', 4: '#2471a3' },
  wirtschaft:        { 2: '#d35400', 3: '#e67e22', 4: '#ca6f1e' },
  wissenschaft:      { 2: '#4527a0', 3: '#5e35b1', 4: '#3d1a87' },
  zivilgesellschaft: { 2: '#6d28d9', 3: '#7c3aed', 4: '#6d28d9' },
  medien:            { 2: '#be185d', 3: '#db2777', 4: '#9d174d' },
  kultur:            { 2: '#8b1a91', 3: '#a21caf', 4: '#5c1560' },
  religion:          { 2: '#1a6b65', 3: '#0f766e', 4: '#0d5c57' },
  bildung:           { 2: '#b45309', 3: '#d97706', 4: '#92400e' },
};

// Guard: never write a reserved openness color as a tile color.
for (const [sector, levels] of Object.entries(PALETTE))
  for (const [lvl, c] of Object.entries(levels))
    if (RESERVED.has(c.toLowerCase()))
      throw new Error(`${sector} L${lvl}: ${c} is a reserved openness color`);

const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
let changed = 0;
const perSector = {};

for (const s of main) {
  const want = PALETTE[s.id];
  if (!want || !s.subFile) continue;

  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const hadNL = raw.endsWith('\n');
  const data = JSON.parse(raw);

  let n = 0;
  (function walk(node) {
    const target = want[node.level];
    if (target && node.color && node.color.toLowerCase() !== target) {
      node.color = target;
      n++;
    }
    (node.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });

  if (n) {
    fs.writeFileSync(p, JSON.stringify(data, null, 2) + (hadNL ? '\n' : ''));
    perSector[s.id] = n;
    changed += n;
  }
}

for (const [k, v] of Object.entries(perSector)) console.log(`  ${k.padEnd(18)} ${v} Kacheln`);
console.log(`  Gesamt: ${changed}`);
