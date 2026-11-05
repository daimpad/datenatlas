#!/usr/bin/env node
// Vergleicht zwei unabhängige Prüfläufe über dieselben Einträge Feld für Feld
// und legt das Ergebnis neben eine Referenz.
//
//   node uebereinstimmung.mjs --referenz runde3-referenz.json \
//        --a lauf1-1.json,lauf1-2.json --b lauf2-1.json,lauf2-2.json \
//        [--za zitate-a.json --zb zitate-b.json]
//
// Die Frage dahinter: Taugt „beide Läufe einig“ als Freigabe für das
// automatische Übernehmen? Dafür zählt vor allem eine Zahl — wie oft beide
// einig sind und trotzdem von der Referenz abweichen.
//
// Mit --za/--zb (Ausgaben von ../zitate-pruefen.mjs --json) zählt ein Wert nur,
// wenn mindestens ein Beleg wiedergefunden wurde; sonst gilt er als fehlend.
import { readFileSync } from 'node:fs';
import { wert, gleich, passt } from '../felder.mjs';

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const load = list => Object.assign({}, ...list.split(',').map(f => JSON.parse(readFileSync(f, 'utf8'))));
const ref = JSON.parse(readFileSync(opt('--referenz'), 'utf8'));
const A = load(opt('--a')), B = load(opt('--b'));
const zit = f => f ? JSON.parse(readFileSync(f, 'utf8')).zitate : null;
const ZA = zit(opt('--za')), ZB = zit(opt('--zb'));

// Feldlogik (Wert aus dem Prüfbogen, Beleg gefunden, gleich/passt) liegt in ../felder.mjs.

const T = { einig_richtig: 0, einig_falsch: 0, einig_ohneRef: 0, uneinig: 0, uneinig_ohneRef: 0, uneinig_mitFehler: 0, einer_fehlt: 0, beide_fehlen: 0 };
const liste = [];
for (const [id, r] of Object.entries(ref)) {
  if (id.startsWith('_') || !A[id] || !B[id]) continue;
  for (const n of ['startjahr', 'rhythmus', 'format', 'lizenz']) {
    const a = wert(A[id], id, n, ZA), b = wert(B[id], id, n, ZB);
    if (!a && !b) { T.beide_fehlen++; continue; }
    if (!a || !b) { T.einer_fehlt++; liste.push(`einer fehlt   ${id} · ${n}: A ${JSON.stringify(a)} B ${JSON.stringify(b)} Ref ${JSON.stringify(r[n])}`); continue; }
    if (gleich(a, b)) {
      const ok = passt(n, a, r[n]);
      if (ok === null) T.einig_ohneRef++;
      else if (ok) T.einig_richtig++;
      else { T.einig_falsch++; liste.push(`EINIG, FALSCH ${id} · ${n}: ${JSON.stringify(a)} Ref ${JSON.stringify(r[n])}`); }
    } else {
      if (!r[n]) T.uneinig_ohneRef++; else T.uneinig++;
      const fehler = r[n] && (!passt(n, a, r[n]) || !passt(n, b, r[n]));
      if (fehler) T.uneinig_mitFehler++;
      liste.push(`uneinig       ${id} · ${n}: A ${JSON.stringify(a)} B ${JSON.stringify(b)} Ref ${JSON.stringify(r[n])}`);
    }
  }
}
const einig = T.einig_richtig + T.einig_falsch;
console.log(`Feldpaare mit Referenz und Wert in beiden Läufen: ${einig + T.uneinig}`);
console.log(`  einig:   ${einig} — davon richtig ${T.einig_richtig}, falsch ${T.einig_falsch}`);
console.log(`  uneinig: ${T.uneinig} — davon mit mindestens einem falschen Wert ${T.uneinig_mitFehler}`);
console.log(`Ohne Referenzwert: einig ${T.einig_ohneRef}, uneinig ${T.uneinig_ohneRef} · nur ein Lauf hat einen Wert: ${T.einer_fehlt} · keiner: ${T.beide_fehlen}`);
console.log('\n' + liste.join('\n'));
