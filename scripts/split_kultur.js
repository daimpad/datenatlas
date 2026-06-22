// One-off: split "Medien und Kultur" into two sectors.
// Moves the 5 cultural L2 nodes out of sector_medien.json into a new
// sector_kultur.json. L2/L3/L4 ids are preserved (pure move → no duplicates,
// no consumer changes). Stored tile colors are left untouched because the
// renderer overrides them anyway (L2/L3 ← sector color, L4 ← openness color).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../public/data');
const KULTUR_L2 = ['kulturbetriebe', 'bildende_kuenste_galerien', 'musikwirtschaft', 'filmwirtschaft-kino', 'buchverlage'];

const medienPath = path.join(DATA, 'sector_medien.json');
const kulturPath = path.join(DATA, 'sector_kultur.json');

const medien = JSON.parse(fs.readFileSync(medienPath, 'utf8'));

const kulturChildren = [];
const medienChildren = [];
for (const l2 of medien.children) {
  (KULTUR_L2.includes(l2.id) ? kulturChildren : medienChildren).push(l2);
}

if (kulturChildren.length !== KULTUR_L2.length) {
  throw new Error(`Erwartet ${KULTUR_L2.length} Kultur-L2, gefunden ${kulturChildren.length}`);
}

medien.children = medienChildren;
const kultur = { sectorId: 'kultur', children: kulturChildren };

const count = sec => sec.children.reduce((a, l2) =>
  a + l2.children.reduce((b, l3) => b + (l3.children?.length ?? 0), 0), 0);

fs.writeFileSync(medienPath, JSON.stringify(medien, null, 2) + '\n');
fs.writeFileSync(kulturPath, JSON.stringify(kultur, null, 2) + '\n');

console.log(`medien: ${medien.children.length} L2, ${count(medien)} L4`);
console.log(`kultur: ${kultur.children.length} L2, ${count(kultur)} L4`);
