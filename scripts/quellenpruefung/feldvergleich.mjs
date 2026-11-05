#!/usr/bin/env node
// Stufe 2/3 der Quellenprüfung ohne Referenz: vergleicht zwei unabhängige Läufe
// Feld für Feld und teilt jedes Feld nach der Tabelle in docs/quellenpruefung.md
// (Stufe 3) ein in „automatisch“ oder „Prüfung am Beleg“.
//
//   node scripts/quellenpruefung/feldvergleich.mjs \
//        --a lauf-a.json[,…] --b lauf-b.json[,…] \
//        --za zitate-a.json --zb zitate-b.json \
//        [--eingabe eingabe.json[,…]] [--json bericht.json] [--beleg beleg.json] \
//        [--referenz runde3-referenz.json]
//
// --za/--zb sind die Ausgaben von zitate-pruefen.mjs --json über dieselben Läufe;
// ohne sie lässt sich nichts als belegt einstufen.
// --eingabe liefert die Öffnungsklasse je Eintrag (für die Lizenzregel unten).
// --beleg schreibt für alles, was am Beleg geprüft werden muss, beide Fassungen
//   nebeneinander — das ist die Eingabe für die Entscheidung bei Uneinigkeit.
// --referenz nur zum Testen an der Kalibrierung: zählt, wie viele Felder, die
//   „automatisch“ durchgehen, von der Referenz abweichen.
//
// Einteilung (jede Regel steht in der Tabelle der Stufe 3):
//   automatisch   Codefeld in beiden Läufen belegt und gleich · Textfeld in beiden
//                 „belegt“ · Existenz/Urteil gleich · Quelle mit wiedergefundenem
//                 Zitat auf ihrer Seite · nichts zu übernehmen
//   am Beleg      Läufe uneinig · nur ein Lauf hat einen (belegten) Wert · Zitat
//                 nicht wiedergefunden · Öffnungsklasse betroffen · Datensatz
//                 existiert laut einem Lauf nicht · neue Begründung · neue
//                 Beschreibung (immer) · Vokabularcode unbekannt · Lizenzbeleg von
//                 anderer Domain als die Quellen · Lizenzbeleg nur von der Seite
//                 (`beleg_art`) · Textfeld korrigiert · Quellentyp
//                 uneinig · Datensatz laut einem Lauf nicht belegbar (Quellen)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CODEFELDER, TEXTFELDER, feld, statusVon, ohneWert, codeWert, wert, gleich, passt } from './felder.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const laden = list => Object.assign({}, ...list.split(',').map(f => JSON.parse(readFileSync(f, 'utf8'))));
const need = n => opt(n) ?? (console.error(`Fehlt: ${n}`), process.exit(2));

const A = laden(need('--a')), B = laden(need('--b'));
const zit = f => JSON.parse(readFileSync(f, 'utf8')).zitate;
const ZA = zit(need('--za')), ZB = zit(need('--zb'));
const EIN = opt('--eingabe') ? laden(opt('--eingabe')) : {};
const REF = opt('--referenz') ? JSON.parse(readFileSync(opt('--referenz'), 'utf8')) : null;
const VOC = JSON.parse(readFileSync(join(ROOT, 'public/data/vocabulary.json'), 'utf8'));

const GUELTIG = {
  startjahr: null,
  rhythmus: new Set(VOC.update_frequency.map(v => v.code)),
  format: new Set(VOC.format.map(v => v.code)),
  lizenz: new Set(VOC.license.map(v => v.code)),
  raeumliche_ebene: new Set(VOC.granularity.map(v => v.code)),
};
const FREIE_LIZENZ = new Set(['LI_01', 'LI_02', 'LI_03', 'LI_05']);

// ── kleine Helfer ──
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const domain = u => host(u).split('.').slice(-2).join('.');
const schluessel = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/$/, ''); } catch { return u; } };
const gefunden = (Z, id, praefix) => Z.filter(z => z.id === id && z.result === 'gefunden' && z.path.startsWith(praefix));
const feldBelege = (Z, id, n) => gefunden(Z, id, `${n}.`).concat(gefunden(Z, id, `felder.${n}.`));
const zahlenTreu = s => s.normalize('NFKC').toLowerCase().replace(/(\d)[.\s](?=\d{3}\b)/g, '$1').replace(/\s+/g, '');

const ergebnis = [];
const beleg = {};
function melde(id, f, stufe, grund, extra = {}) {
  ergebnis.push({ id, feld: f, stufe, grund, ...extra });
  if (stufe !== 'beleg') return;
  // Korrigierte Textfelder entscheidet niemand für sich: sie fließen in die neue
  // Beschreibung. Sie zählen als „am Beleg“, stehen aber in der Beleg-Datei als Kontext.
  const e = (beleg[id] ??= { entscheidungen: [], kontext: [] });
  (TEXTFELDER.includes(f) ? e.kontext : e.entscheidungen).push({ feld: f, grund, beleg: extra.beleg });
}

// Domains der Quellen, die die Läufe anhängen wollen — die „Hauptquelle“ für die Lizenzregel.
const quellenDomains = id => new Set([A, B].flatMap(R => (R[id]?.quellen ?? []).map(q => domain(q.url ?? ''))).filter(Boolean));

function codefeld(id, n, a, b, eingabe) {
  const wa = wert(a, id, n, ZA), wb = wert(b, id, n, ZB);
  const fa = feld(a, n), fb = feld(b, n);
  const roh = { a: fa, b: fb };
  const hatA = !ohneWert(fa), hatB = !ohneWert(fb);
  if (!hatA && !hatB) return melde(id, n, 'automatisch', 'in beiden Läufen nicht belegt — nichts zu übernehmen', { aktion: 'keine' });
  if (hatA !== hatB || (!wa !== !wb)) {
    const grund = !wa && !wb ? 'Zitat zum Wert in beiden Läufen nicht wiedergefunden'
      : hatA !== hatB ? 'nur ein Lauf hat einen Wert' : 'Zitat zum Wert in einem Lauf nicht wiedergefunden';
    return melde(id, n, 'beleg', grund, { a: wa, b: wb, beleg: roh });
  }
  if (!wa) return melde(id, n, 'beleg', 'Zitat zum Wert in beiden Läufen nicht wiedergefunden', { beleg: roh });
  if (!gleich(wa, wb)) return melde(id, n, 'beleg', 'Läufe uneinig', { a: wa, b: wb, beleg: roh });
  // Ab hier: beide belegt und gleich. Ausschlüsse, die trotzdem zum Beleg führen:
  const bestaetigt = statusVon(fa) === 'belegt' && statusVon(fb) === 'belegt';
  const extra = { wert: wa, aktion: bestaetigt ? 'bestaetigt' : 'aendern', beleg: roh };
  const unbekannt = GUELTIG[n] && wa.filter(c => !GUELTIG[n].has(c));
  if (unbekannt?.length) return melde(id, n, 'beleg', `Vokabularcode unbekannt: ${unbekannt.join(', ')}`, extra);
  if (n === 'lizenz') {
    // Fassung des Prüfauftrags ab Runde 2: `beleg_art` sagt, ob die Aussage die Daten oder nur die Seite betrifft.
    if (fa?.beleg_art === 'seite' || fb?.beleg_art === 'seite')
      return melde(id, n, 'beleg', 'Lizenzbeleg ist nur eine allgemeine Klausel der Seite', extra);
    const eigene = new Set([...feldBelege(ZA, id, n), ...feldBelege(ZB, id, n)].map(z => domain(z.url)));
    const haupt = quellenDomains(id);
    const fremd = [...eigene].filter(d => haupt.size && !haupt.has(d));
    if (fremd.length) return melde(id, n, 'beleg', `Lizenzbeleg von anderer Domain als die Quellen (${fremd.join(', ')})`, extra);
    const klasse = eingabe?.oeffnungsklasse;
    const frei = wa.every(c => FREIE_LIZENZ.has(c));
    if (!bestaetigt && ((!frei && klasse === 'Sofort publizierbar') || (frei && klasse === 'Nur Metadaten publizierbar')))
      return melde(id, n, 'beleg', `Öffnungsklasse „${klasse}“ passt nicht mehr zur Lizenz`, extra);
  }
  melde(id, n, 'automatisch', bestaetigt ? 'beide Läufe: Eintrag belegt' : 'beide Läufe: gleicher belegter Wert', extra);
}

function textfeld(id, n, a, b) {
  const fa = feld(a, n), fb = feld(b, n), roh = { a: fa, b: fb };
  const na = ohneWert(fa), nb = ohneWert(fb);
  if (na && nb) return melde(id, n, 'automatisch', 'in beiden Läufen nicht belegt — nichts zu übernehmen', { aktion: 'keine' });
  const ok = (f, Z) => statusVon(f) === 'belegt' && feldBelege(Z, id, n).length > 0;
  if (ok(fa, ZA) && ok(fb, ZB)) return melde(id, n, 'automatisch', 'beide Läufe: Eintrag belegt', { aktion: 'bestaetigt' });
  const grund = na !== nb ? 'nur ein Lauf hat einen Wert'
    : statusVon(fa) === 'korrigiert' || statusVon(fb) === 'korrigiert' ? 'Textfeld korrigiert — Übernahme nur über die Beschreibung'
      : 'Zitat zum Wert nicht wiedergefunden';
  melde(id, n, 'beleg', grund, { beleg: roh });
}

function existenz(id, a, b) {
  const x = a.existenz?.wert, y = b.existenz?.wert, roh = { a: a.existenz, b: b.existenz };
  if (x === 'nein' || y === 'nein') return melde(id, 'existenz', 'beleg', 'Datensatz existiert laut einem Lauf nicht', { a: x, b: y, beleg: roh });
  if (x !== y) return melde(id, 'existenz', 'beleg', 'Läufe uneinig', { a: x, b: y, beleg: roh });
  melde(id, 'existenz', 'automatisch', `beide Läufe: ${x}`, { wert: x });
}

function urteil(id, a, b) {
  const x = a.urteil, y = b.urteil, roh = { a: x, b: y };
  if (x !== y) return melde(id, 'urteil', 'beleg', 'Läufe uneinig', { a: x, b: y, beleg: roh });
  melde(id, 'urteil', 'automatisch', `beide Läufe: ${x}`, { wert: x });
}

function begruendung(id, a, b) {
  const p = r => r.begruendung?.praxisaussage || null, w = r => r.begruendung?.widerspruch || null;
  if (p(a) || p(b) || w(a) || w(b))
    return melde(id, 'begruendung', 'beleg', 'neue Begründung nötig (Praxisaussage oder Widerspruch)', { beleg: { a: a.begruendung, b: b.begruendung } });
  melde(id, 'begruendung', 'automatisch', 'in beiden Läufen unbeanstandet', { aktion: 'keine' });
}

// Zahlen, Jahre und Paragraphen der neuen Beschreibung, die in keinem wiedergefundenen
// Zitat des Laufs vorkommen. Kein Ausschlusskriterium — die Beschreibung geht ohnehin
// immer an den Beleg —, sondern ein Hinweis, wohin die Entscheidung zuerst schauen soll.
function unbelegteZahlen(text, Z, id) {
  const quelle = zahlenTreu(Z.filter(z => z.id === id && z.result === 'gefunden').map(z => z.zitat).join(' '));
  const kandidaten = text.match(/§\s*\d+[a-z]?|\b\d{1,3}(?:\.\d{3})+\b|\b\d{3,}\b/g) ?? [];
  return [...new Set(kandidaten)].filter(k => !quelle.includes(zahlenTreu(k)));
}

function beschreibung(id, a, b) {
  const x = a.beschreibung_neu || null, y = b.beschreibung_neu || null;
  if (!x && !y) return melde(id, 'beschreibung', 'automatisch', 'in beiden Läufen keine neue Beschreibung', { aktion: 'keine' });
  melde(id, 'beschreibung', 'beleg', 'neue Beschreibung — immer am Beleg', {
    beleg: { a: x, b: y, unbelegt_a: x ? unbelegteZahlen(x, ZA, id) : null, unbelegt_b: y ? unbelegteZahlen(y, ZB, id) : null },
  });
}

// Stufe 3: „Quellen, deren Zitate gefunden wurden“ gehen automatisch durch. Das gilt
// je Lauf — die Läufe wählen oft verschiedene Dokumente derselben Stelle (PDF oder XLSX,
// andere Ausgabe), sodass eine Pflicht zur Doppelnennung fast jede Quelle zur Prüfung
// schicken würde. `beide` hält fest, ob beide Läufe dieselbe Seite genannt haben.
function quellen(id, a, b) {
  const qa = a.quellen ?? [], qb = b.quellen ?? [];
  if (!qa.length && !qb.length) return melde(id, 'quellen', 'automatisch', 'keine Quelle vorgeschlagen', { aktion: 'keine' });
  const sperre = a.existenz?.wert === 'nein' || b.existenz?.wert === 'nein' || a.urteil === 'nicht_belegbar' || b.urteil === 'nicht_belegbar';
  const index = (qs, Z) => new Map(qs.map(q => [schluessel(q.url ?? ''), { q, zitiert: Z.some(z => z.id === id && z.result === 'gefunden' && schluessel(z.url) === schluessel(q.url ?? '')) }]));
  const ia = index(qa, ZA), ib = index(qb, ZB);
  for (const k of new Set([...ia.keys(), ...ib.keys()])) {
    const x = ia.get(k), y = ib.get(k), q = (x ?? y).q, roh = { a: x?.q ?? null, b: y?.q ?? null };
    const name = `quellen: ${q.title ?? k}`, beide = !!(x && y);
    let grund = null;
    if ((x && !x.zitiert) || (y && !y.zitiert)) grund = 'auf der Quellseite kein Zitat wiedergefunden';
    else if (beide && x.q.typ !== y.q.typ) grund = `Quellentyp uneinig (${x.q.typ} / ${y.q.typ})`;
    else if (sperre) grund = 'Datensatz nicht belegbar oder nicht vorhanden laut einem Lauf';
    if (grund) melde(id, name, 'beleg', grund, { beide, beleg: roh });
    else melde(id, name, 'automatisch', `${beide ? 'beide Läufe' : 'ein Lauf'}, Typ ${q.typ}, Zitat wiedergefunden`, { aktion: 'anhaengen', beide, beleg: roh });
  }
}

// ── Lauf ──
const ids = Object.keys(A).filter(id => B[id]);
for (const id of Object.keys(A).filter(id => !B[id]).concat(Object.keys(B).filter(id => !A[id])))
  console.error(`Übersprungen (nur in einem Lauf): ${id}`);
for (const id of ids) {
  const a = A[id], b = B[id];
  for (const n of CODEFELDER) codefeld(id, n, a, b, EIN[id]);
  for (const n of TEXTFELDER) textfeld(id, n, a, b);
  existenz(id, a, b); urteil(id, a, b); begruendung(id, a, b); beschreibung(id, a, b); quellen(id, a, b);
}

// ── Ausgabe ──
const je = (f) => ergebnis.filter(f).length;
const auto = je(e => e.stufe === 'automatisch'), am = je(e => e.stufe === 'beleg');
console.log(`Einträge ${ids.length} · Felder ${ergebnis.length} · automatisch ${auto} · Prüfung am Beleg ${am}`);
const nach = {};
for (const e of ergebnis) { const k = e.feld.startsWith('quellen:') ? 'quellen' : e.feld; (nach[k] ??= { automatisch: 0, beleg: 0 })[e.stufe]++; }
console.log('\nFeld                 automatisch  am Beleg');
for (const [k, v] of Object.entries(nach)) console.log(`${k.padEnd(20)} ${String(v.automatisch).padStart(6)} ${String(v.beleg).padStart(10)}`);
// Nur Felder, bei denen etwas übernommen würde, sind eine Entscheidung — die ohne Änderung sind Buchhaltung.
const aendernd = je(e => e.stufe === 'automatisch' && ['aendern', 'anhaengen'].includes(e.aktion));
console.log(`\nautomatisch mit Änderung am Datenbestand (Wert ändern, Quelle anhängen): ${aendernd}`);
console.log('\nPrüfung am Beleg:');
for (const e of ergebnis.filter(e => e.stufe === 'beleg'))
  console.log(`  ${e.id} · ${e.feld}: ${e.grund}${e.a !== undefined && e.b !== undefined ? `  [A ${JSON.stringify(e.a)} · B ${JSON.stringify(e.b)}]` : ''}`);

if (REF) {
  const t = { autoRichtig: 0, autoFalsch: 0, belegBeideRichtig: 0, belegMitFehler: 0, ohneRef: 0 };
  const fehler = [];
  for (const e of ergebnis.filter(e => CODEFELDER.includes(e.feld) && REF[e.id]?.[e.feld])) {
    const r = REF[e.id][e.feld], na = e.feld;
    if (e.stufe === 'automatisch' && e.wert) {
      if (passt(na, e.wert, r)) t.autoRichtig++; else { t.autoFalsch++; fehler.push(`AUTOMATISCH FALSCH ${e.id} · ${na}: ${JSON.stringify(e.wert)} Ref ${JSON.stringify(r)}`); }
    } else if (e.stufe === 'beleg') {
      const a = codeWert(feld(A[e.id], na), na), b = codeWert(feld(B[e.id], na), na);
      const ok = [a, b].filter(Boolean).every(v => passt(na, v, r)) && a && b;
      if (ok) t.belegBeideRichtig++; else t.belegMitFehler++;
    }
  }
  console.log(`\nGegen Referenz (${opt('--referenz')}): automatisch richtig ${t.autoRichtig}, automatisch falsch ${t.autoFalsch} · am Beleg: beide Läufe richtig ${t.belegBeideRichtig}, mindestens ein Fehler oder Lücke ${t.belegMitFehler}`);
  fehler.forEach(f => console.log('  ' + f));
}

if (opt('--json')) writeFileSync(opt('--json'), JSON.stringify({ eintraege: ids.length, automatisch: auto, beleg: am, felder: ergebnis }, null, 2) + '\n');
if (opt('--beleg')) writeFileSync(opt('--beleg'), JSON.stringify(beleg, null, 2) + '\n');
