// Nachtrag zur zweiten Produktionsrunde der Quellenprüfung (2026-11-05).
//
// 1. dfg-bewilligungsstatistik: Lizenz LI_05 → LI_06. Der Förderatlas steht unter CC BY-SA 4.0; in der
//    Runde fehlte dafür ein Code, und LI_05 („eigene Nutzungsbedingungen“) war ein Notbehelf.
// 2. bvmi-exportumsaetze-musikindustrie: Beschreibung auf das Belegte. Beide Läufe fanden keine Statistik
//    der Exportumsätze der deutschen Musikindustrie (Jahrbücher 2014, 2019, 2025 durchsucht); das Jahrbuch 2025
//    gibt für den Weltmarkt Daten des IFPI Global Music Report 2026 wieder (Zitat im Lauf A, „Die Daten
//    entstammen dem Global Music Report 2026“, gefunden). Lizenz und Klasse bleiben unangetastet, weil es
//    keinen Datensatz gibt, für den man sie belegen könnte; der Eintrag bleibt Einschätzung.
//
// Aufruf aus dem Repo-Wurzelverzeichnis: node scripts/datafix-runde2-nachtrag.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { LABELS } from '../src/vokabular.js';

const PATCH = {
  'dfg-bewilligungsstatistik': d => { d.license = { code: 'LI_06', label: LABELS.LI_06 }; },
  'bvmi-exportumsaetze-musikindustrie': d => {
    d.description = 'Gemeint wären Exportumsätze der deutschen Musikindustrie nach Region und Format. In den BVMI-Jahrbüchern 2014, 2019 und 2025 fand sich keine solche Statistik; für den Weltmarkt gibt das Jahrbuch 2025 Daten des IFPI Global Music Report 2026 wieder.';
  },
};
const dir = 'public/data';
let n = 0;
for (const f of readdirSync(dir).filter(f => f.startsWith('sector_'))) {
  const path = `${dir}/${f}`, data = JSON.parse(readFileSync(path, 'utf8'));
  let changed = false;
  (function w(x) {
    if (x.level === 4 && PATCH[x.id]) { PATCH[x.id](x.details); changed = true; n++; }
    (x.children ?? []).forEach(w);
  })({ children: data.children ?? [] });
  if (changed) writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}
if (n !== Object.keys(PATCH).length) { console.error(`erwartet ${Object.keys(PATCH).length} Einträge, gefunden ${n}`); process.exit(1); }
console.log(`${n} Einträge angepasst`);
