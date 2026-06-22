// One-off: make all node ids globally unique across sector files.
// Rule: the "keeper" occurrence keeps the bare id, every other occurrence is
// renamed to `${sectorId}-${id}` (with a numeric suffix on the rare further
// collision). Keeper selection:
//   - ids present in BOTH staat and bildung (the legacy education overlap):
//     bildung keeps, the staat copy is renamed (→ "staat-…", the municipal view)
//   - otherwise: the first occurrence in main.json order keeps the id
// Ids are pure identifiers (the tree is structural, no id cross-references and
// no hardcoded ids in code), so renaming is safe; the search index regenerates.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../public/data');
const order = JSON.parse(fs.readFileSync(path.join(DATA, 'main.json'), 'utf8'))
  .filter(s => s.subFile).map(s => s.id);

// Load + collect occurrences in walk order
const docs = {};
const trailingNL = {};
const occ = new Map(); // id -> [{ node, sector }]
for (const sid of order) {
  const raw = fs.readFileSync(path.join(DATA, `sector_${sid}.json`), 'utf8');
  trailingNL[sid] = raw.endsWith('\n');
  const doc = JSON.parse(raw);
  docs[sid] = doc;
  const walk = n => {
    if (n.id) { if (!occ.has(n.id)) occ.set(n.id, []); occ.get(n.id).push({ node: n, sector: sid }); }
    (n.children || []).forEach(walk);
  };
  (doc.children || []).forEach(walk);
}

const used = new Set(occ.keys()); // every distinct id is kept once
let renamed = 0;
const log = [];

for (const [id, list] of occ) {
  if (list.length < 2) continue;
  const sectors = list.map(o => o.sector);

  // pick keeper index
  let keeperIdx = 0;
  if (sectors.includes('staat') && sectors.includes('bildung')) {
    keeperIdx = list.findIndex(o => o.sector === 'bildung');
  }

  list.forEach((o, i) => {
    if (i === keeperIdx) return;
    let cand = `${o.sector}-${id}`;
    let k = 2;
    while (used.has(cand)) cand = `${o.sector}-${id}-${k++}`;
    used.add(cand);
    o.node.id = cand;
    renamed++;
    log.push(`  ${id}  [${o.sector}] -> ${cand}`);
  });
}

for (const sid of order) {
  fs.writeFileSync(path.join(DATA, `sector_${sid}.json`),
    JSON.stringify(docs[sid], null, 2) + (trailingNL[sid] ? '\n' : ''));
}

console.log(`Umbenannt: ${renamed} Knoten`);
log.forEach(l => console.log(l));
