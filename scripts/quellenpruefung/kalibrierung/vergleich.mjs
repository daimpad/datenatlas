#!/usr/bin/env node
// Bewertet Prüfbögen gegen eine Referenz mit bekannten Befunden.
//
//   node vergleich.mjs --referenz runde3-referenz.json --zitate bericht.json ergebnis-1.json […]
//
// bericht.json ist die --json-Ausgabe von ../zitate-pruefen.mjs über dieselben
// Ergebnisdateien. Ein Feldwert zählt nur als richtig, wenn mindestens eines
// seiner Belegzitate auf der Quellseite wiedergefunden wurde — ein geratener,
// zufällig richtiger Wert wird nicht belohnt.
//
// Wertung je Codefeld (startjahr, rhythmus, format, lizenz):
//   richtig    Wert stimmt mit der Referenz (bei Listen: gleiche Menge), Beleg gefunden
//   teilweise  Format: Schnittmenge, aber nicht gleich
//   anders     anderer Wert mit gefundenem Beleg — von Hand prüfen, wer recht hat
//   unbelegt   Wert ohne gefundenen Beleg
//   fehlt      nicht_gefunden / entfaellt / leer
//   zusatz     Referenz hat keinen Wert, Ergebnis schon (mit Beleg) — von Hand prüfen
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : null; };
const ref = JSON.parse(readFileSync(opt('--referenz'), 'utf8'));
const zit = JSON.parse(readFileSync(opt('--zitate'), 'utf8')).zitate;
const res = Object.assign({}, ...args.map(f => JSON.parse(readFileSync(f, 'utf8'))));

const CODE = { rhythmus: /FQ_\d\d/g, format: /FT_\d\d/g, lizenz: /LI_\d\d/g };
const feld = (e, name) => e?.felder?.[name] ?? e?.[name];
const belegt = (id, name) => zit.some(z => z.id === id && z.result === 'gefunden'
  && (z.path.startsWith(`${name}.`) || z.path.startsWith(`felder.${name}.`)));

function werte(name, f) {
  if (!f || ['nicht_gefunden', 'entfaellt'].includes(String(f.status).replace(' ', '_'))) return null;
  const raw = JSON.stringify(f.wert ?? '');
  if (name === 'startjahr') { const m = raw.match(/\b(1[89]\d\d|20\d\d)\b/); return m ? [Number(m[1])] : null; }
  const m = raw.match(CODE[name]); return m ? [...new Set(m)] : null;
}

function wertung(name, refv, got, hasBeleg) {
  if (!got) return refv ? 'fehlt' : null;
  if (!hasBeleg) return 'unbelegt';
  if (!refv) return 'zusatz';
  if (name === 'format') {
    const a = new Set(refv), b = new Set(got);
    if (a.size === b.size && [...a].every(x => b.has(x))) return 'richtig';
    return [...a].some(x => b.has(x)) ? 'teilweise' : 'anders';
  }
  return got.some(v => refv.includes(v)) ? 'richtig' : 'anders';
}

// Für Kernbefunde nur, was das Ergebnis selbst sagt — nicht die zitierten Altaussagen.
const ohneAlt = o => JSON.stringify(o, (k, v) => (k === 'alt' || k === 'praxisaussage') ? undefined : v);

const T = { feld: {}, kern: [0, 0], praxis: { tp: 0, fn: 0, fp: 0, tn: 0 }, existenz: [0, 0], zitate: { gefunden: 0, fehlt: 0, nicht_abrufbar: 0 } };
const pruefen = [];
for (const z of zit) T.zitate[z.result]++;

console.log('Eintrag'.padEnd(46), 'Felder', 'Kern', 'Praxis', 'Existenz');
for (const [id, r] of Object.entries(ref)) {
  if (id.startsWith('_')) continue;
  const e = res[id];
  if (!e) { console.log(id.padEnd(46), 'FEHLT IM ERGEBNIS'); continue; }
  const fz = [];
  for (const name of ['startjahr', 'rhythmus', 'format', 'lizenz']) {
    const w = wertung(name, r[name], werte(name, feld(e, name)), belegt(id, name));
    if (!w) continue;
    T.feld[w] = (T.feld[w] ?? 0) + 1;
    fz.push(w === 'richtig' ? '✓' : w === 'zusatz' ? '+' : w === 'teilweise' ? '~' : '✗');
    if (w !== 'richtig') pruefen.push(`${id} · ${name}: ${w} — Ergebnis ${JSON.stringify(feld(e, name)?.wert ?? null)}, Referenz ${JSON.stringify(r[name])}`);
  }
  const text = ohneAlt(e);
  const kern = r.kernbefunde.map(k => { const m = text.match(new RegExp(`.{0,70}(${k.muster}).{0,70}`, 'i')); return { k, m }; });
  kern.forEach(({ k, m }) => { T.kern[1]++; if (m) T.kern[0]++; pruefen.push(`${id} · Kern ${m ? '✓' : '✗'} ${k.text}${m ? `\n      …${m[0].replace(/\\"/g, '"')}…` : ''}`); });
  const pa = e.begruendung?.praxisaussage;
  const sagtPraxis = typeof pa === 'string' && pa.trim().length > 0;
  T.praxis[r.praxisaussage ? (sagtPraxis ? 'tp' : 'fn') : (sagtPraxis ? 'fp' : 'tn')]++;
  const ex = String(e.existenz?.status ?? e.existenz?.wert ?? e.existenz ?? '').toLowerCase();
  const exOk = r.existenz.some(v => ex.startsWith(v));
  T.existenz[1]++; if (exOk) T.existenz[0]++;
  console.log(id.padEnd(46), fz.join('').padEnd(6), `${kern.filter(x => x.m).length}/${kern.length}`.padEnd(4),
    (r.praxisaussage === sagtPraxis ? '✓' : r.praxisaussage ? '✗ übersehen' : '✗ Fehlalarm').padEnd(6), `${exOk ? '✓' : '✗'} ${ex.slice(0, 12)}`);
}

const f = T.feld, wertbar = (f.richtig ?? 0) + (f.teilweise ?? 0) + (f.anders ?? 0) + (f.unbelegt ?? 0) + (f.fehlt ?? 0);
console.log(`\nCodefelder: ${f.richtig ?? 0} richtig von ${wertbar} gewertet · teilweise ${f.teilweise ?? 0} · anders ${f.anders ?? 0} · unbelegt ${f.unbelegt ?? 0} · fehlt ${f.fehlt ?? 0} · zusätzlich belegt ${f.zusatz ?? 0}`);
console.log(`Kernbefunde: ${T.kern[0]} von ${T.kern[1]} (Muster-Treffer, von Hand bestätigen)`);
console.log(`Praxisaussagen: ${T.praxis.tp} von ${T.praxis.tp + T.praxis.fn} erkannt · ${T.praxis.fp} Fehlalarme`);
console.log(`Existenz: ${T.existenz[0]} von ${T.existenz[1]} richtig eingestuft`);
console.log(`Zitate: ${T.zitate.gefunden} gefunden · ${T.zitate.fehlt} fehlen · ${T.zitate.nicht_abrufbar} nicht abrufbar`);
console.log('\nVon Hand prüfen:'); pruefen.forEach(p => console.log('  ' + p));
