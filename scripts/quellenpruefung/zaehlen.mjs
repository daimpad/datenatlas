#!/usr/bin/env node
// Zählt, wie viele Einträge die Prüfrunden bisher geprüft haben und mit welchem Ergebnis — aus den Protokollen der
// Läufe (`urteil` je Eintrag in runden/<n>/lauf-a*.json und lauf-b*.json). Quelle der Zahlen im Abschnitt
// „Woher die Angaben stammen“ auf ueber.html und in docs/ueber-den-datenatlas.md; dort von Hand eintragen.
//
//   node scripts/quellenpruefung/zaehlen.mjs          (aus dem Repo-Wurzelverzeichnis)
//
// Die ersten drei Belegungen (Erst-, Zweit-, Drittbelegung; 38 Einträge) liefen vor den Rundenprotokollen und stehen
// als Konstanten: 2 stimmten vollständig, 33 mussten korrigiert werden, 3 ließen sich im Kern nicht belegen.
// Runde 3 ist die Kalibrierung gegen die Drittbelegung und zählt nicht doppelt.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const R = 'scripts/quellenpruefung/runden';
const FRUEH = { n: 38, stimmt: 2, korrigiert: 33, nicht: 3 };
let n = 0, korrigiert = 0, nicht = 0, stimmt = 0;
for (const r of readdirSync(R).filter(d => /^\d+$/.test(d) && d !== '3')) {
  const dir = join(R, r), urteile = {};
  for (const f of readdirSync(dir).filter(f => /^lauf-[ab](-\d+)?\.json$/.test(f))) {
    const seite = f.startsWith('lauf-a') ? 'a' : 'b';
    for (const [id, v] of Object.entries(JSON.parse(readFileSync(join(dir, f), 'utf8')))) (urteile[id] ??= {})[seite] = v.urteil;
  }
  const ids = Object.keys(urteile); let k = 0, ni = 0, s = 0;
  for (const u of Object.values(urteile)) {
    if (u.a === 'stimmt' && u.b === 'stimmt') s++;
    else if (u.a === 'nicht_belegbar' || u.b === 'nicht_belegbar') ni++;
    else k++;
  }
  console.log(`Runde ${r}: ${ids.length} Einträge — ${s} stimmen, ${k} zu korrigieren, ${ni} (mindestens ein Lauf) nicht belegbar`);
  n += ids.length; stimmt += s; korrigiert += k; nicht += ni;
}
console.log(`\nRunden mit Protokoll: ${n} Einträge — ${stimmt} stimmen, ${korrigiert} zu korrigieren, ${nicht} nicht belegbar`);
console.log(`Mit den ersten drei Belegungen: ${n + FRUEH.n} Einträge — ${stimmt + FRUEH.stimmt} stimmen, ${korrigiert + FRUEH.korrigiert} zu korrigieren, ${nicht + FRUEH.nicht} nicht belegbar`);
