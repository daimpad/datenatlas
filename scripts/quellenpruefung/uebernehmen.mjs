#!/usr/bin/env node
// Stufe 3/4 der Quellenprüfung: schreibt das Ergebnis einer Runde in die Sektordateien.
//
//   node scripts/quellenpruefung/uebernehmen.mjs <rundenordner> --modus auto|review [--schreiben] [--geprueft YYYY-MM-DD]
//
// Ohne --schreiben wird nur angezeigt, was sich ändern würde. Aus dem Repo-Wurzelverzeichnis
// starten (liest public/data/ relativ).
//
//   auto    Was feldvergleich.mjs „automatisch“ eingeteilt hat: Codefelder, in denen beide
//           Läufe denselben belegten Wert haben, und Quellen vom Typ `statistik` mit
//           wiedergefundenem Zitat. Die Beschreibung bleibt unberührt — und damit auch jede
//           Quelle von Einträgen, deren Beschreibung noch korrigiert wird: „Mit Quelle“ sagt,
//           dass die Aussagen des Eintrags nachgelesen sind, und die alte Beschreibung ist es
//           dann nicht (CLAUDE.md: die Beschreibung an die Quelle anpassen, nie umgekehrt).
//   review  Was ein Mensch oder Opus am Beleg entschieden hat (entscheidung.json): neue
//           Beschreibung, entschiedene Codefelder, aufgenommene Quellen — dazu die Quellen
//           aus `auto`, die auf die neue Beschreibung gewartet haben. Ändert sich dadurch
//           die Lizenz von frei auf LI_04 bei Klasse OP_01, wird die Klasse OP_02 (Hindernis
//           ist das Nutzungsrecht, wie bei AGF und Media Control). Die Öffnungsbegründung
//           schreibt dieses Skript nie: dafür gibt es apply-begruendungen.mjs mit seinen
//           Regelprüfungen.
//
// Nie geschrieben, sondern nur gemeldet (zurückgestellt):
//   – Quellen vom Typ `rechtsgrundlage`: Die Sidebar kann noch nicht unterscheiden, dass eine
//     Norm das Entstehen der Daten belegt, nicht ihre Veröffentlichung.
//   – Quellen vom Typ `beispiel`, und `statistik`-Quellen, die nach Nutzungsbedingung,
//     Impressum oder Richtlinie aussehen (Regel 10 des Prüfauftrags).
//   – Werte, die keine Entscheidung tragen (Opus: `offen`, kein Jahr).
//   – Einträge, deren Datensatz beide Läufe verneinen (existenz `nein`): in beiden Modi ganz (im Modus
//     `auto` seit Runde 6; vorher wären Format und Lizenz des Qualitätsberichts auf den Eintrag gelangt).
//
// Schreibt nur Felder, die in der Eingabe der Runde standen; alles geht durch dieselbe
// Beschriftung aus src/vokabular.js wie der Validator.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LABELS } from '../../src/vokabular.js';
import { codeWert, existenzVon } from './felder.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'public', 'data');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const runde = args.find((a, i) => !a.startsWith('--') && !['--modus', '--geprueft'].includes(args[i - 1]));
const modus = opt('--modus');
const schreiben = args.includes('--schreiben');
const geprueft = opt('--geprueft') ?? new Date().toISOString().slice(0, 10);
if (!runde || !['auto', 'review'].includes(modus)) {
  console.error('Aufruf: uebernehmen.mjs <rundenordner> --modus auto|review [--schreiben] [--geprueft YYYY-MM-DD]');
  process.exit(2);
}
const lies = f => JSON.parse(readFileSync(join(runde, f), 'utf8'));
const laeufe = seite => Object.assign({}, ...readdirSync(runde).filter(f => f.startsWith(`lauf-${seite}-`)).map(lies));

// ── Bestand ──
const dateien = new Map(), knoten = new Map();
for (const s of JSON.parse(readFileSync(join(DATA, 'main.json'), 'utf8'))) {
  if (!s.subFile) continue;
  const pfad = join(DATA, s.subFile), roh = readFileSync(pfad, 'utf8');
  const daten = JSON.parse(roh);
  dateien.set(pfad, { daten, endetMitNL: roh.endsWith('\n'), geaendert: false });
  (function w(n) { if (n.level === 4) knoten.set(n.id, { n, pfad }); (n.children ?? []).forEach(w); })({ children: daten.children ?? [] });
}

// ── Änderungen sammeln ──
const log = [], zurueck = [];
const schluessel = u => { try { const x = new URL(u); return x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/$/, ''); } catch { return u; } };
// „kostenpflichtig“: eine Preis- und Nutzungsseite belegt das Nutzungsrecht, nicht die Statistik.
const VERDAECHTIG = /impressum|nutzungsbedingung|richtlinie|urheber|copyright|rechtliche hinweise|terms|datenschutz|kostenpflichtig/i;

function setze(id, feld, wert) {
  const k = knoten.get(id);
  if (!k) { zurueck.push(`${id}: unbekannte id`); return; }
  const d = k.n.details, voc = c => ({ code: c, label: LABELS[c] });
  let alt, neu;
  switch (feld) {
    case 'startjahr': alt = d.temporal.available_from; neu = wert[0]; if (alt !== neu) d.temporal.available_from = neu; break;
    case 'rhythmus': alt = d.temporal.update_frequency; neu = wert[0]; if (alt !== neu) d.temporal.update_frequency = neu; break;
    case 'lizenz': alt = d.license.code; neu = wert[0]; if (alt !== neu) d.license = voc(neu); break;
    case 'raeumliche_ebene': alt = d.granularity.code; neu = wert[0]; if (alt !== neu) d.granularity = voc(neu); break;
    case 'format': alt = d.format.map(f => f.code).join('+'); neu = wert.join('+'); if (alt !== neu) d.format = wert.map(voc); break;
    default: throw new Error(`Feld ${feld}`);
  }
  if (String(alt) === String(neu)) return;
  dateien.get(k.pfad).geaendert = true;
  log.push(`${id} · ${feld}: ${alt} → ${neu}`);
}

// Hindernis ist das Nutzungsrecht, nicht der Personenbezug (AGF, Media Control, IVW): LI_04 und
// „sofort publizierbar“ passen nicht zusammen. Gilt für jeden Eintrag, den `review` anfasst und
// dessen Lizenz in dieser Runde belegt wurde (auch wenn sie schon vorher LI_04 war) — ein offen
// gebliebener Lizenzwert rechtfertigt keinen Klassenwechsel.
function klasseZurLizenz(id, lizenzBelegt) {
  const k = knoten.get(id), d = k.n.details;
  if (!lizenzBelegt || d.license?.code !== 'LI_04' || d.openness?.class !== 'OP_01') return;
  d.openness = { ...d.openness, class: 'OP_02', label: LABELS.OP_02 };
  dateien.get(k.pfad).geaendert = true;
  log.push(`${id} · Öffnungsklasse: OP_01 → OP_02 (Lizenz LI_04) — Begründung neu schreiben`);
}

function haengeAn(id, q) {
  const k = knoten.get(id);
  if (!k) { zurueck.push(`${id}: unbekannte id`); return; }
  if (q.typ !== 'statistik') { zurueck.push(`${id} · Quelle „${q.title}“ (${q.typ}) — nicht übernommen, Typ ${q.typ}`); return; }
  if (VERDAECHTIG.test(q.title)) { zurueck.push(`${id} · Quelle „${q.title}“ — sieht nach Nutzungsbedingung aus (Regel 10)`); return; }
  const d = k.n.details;
  d.sources ??= [];
  if (d.sources.some(s => schluessel(s.url) === schluessel(q.url))) return;
  d.sources.push({ title: q.title, publisher: q.publisher, url: q.url, checked: geprueft, supports: q.supports });
  dateien.get(k.pfad).geaendert = true;
  log.push(`${id} · Quelle: ${q.title} (${q.publisher})`);
}

const A = laeufe('a'), B = laeufe('b');
const fv = lies('feldvergleich.json').felder;
const beschreibungOffen = new Set(fv.filter(f => f.feld === 'beschreibung' && f.stufe === 'beleg').map(f => f.id));
let wartend = 0;
const vorschlag = (id, titel) => [A[id], B[id]].flatMap(r => r?.quellen ?? []).find(q => `quellen: ${q.title}` === titel);

if (modus === 'auto') {
  const verneint = new Set(Object.keys(A).filter(id => existenzVon(A[id]) === 'nein' && existenzVon(B[id]) === 'nein'));
  for (const f of fv) {
    if (f.stufe !== 'automatisch') continue;
    // Wie im Modus review: Format, Lizenz oder Rhythmus eines Datensatzes, den beide Läufe nicht fanden,
    // beschreiben die Quelle der Suche (etwa den Qualitätsbericht), nicht den Eintrag (Runde 6).
    if (verneint.has(f.id)) { if (!zurueck.some(z => z.startsWith(`${f.id} —`))) zurueck.push(`${f.id} — Datensatz existiert laut beiden Läufen nicht: nichts übernommen`); continue; }
    if (f.aktion === 'aendern') setze(f.id, f.feld, f.wert);
    else if (f.aktion === 'anhaengen') {
      if (beschreibungOffen.has(f.id)) wartend++;
      else haengeAn(f.id, f.beleg.a ?? f.beleg.b);
    }
  }
} else {
  for (const [id, e] of Object.entries(lies('entscheidung.json'))) {
    const k = knoten.get(id);
    if (!k) { zurueck.push(`${id}: unbekannte id`); continue; }
    // Beide Läufe verneinen den Datensatz: Eine Lizenz oder Klasse für etwas, das es so nicht gibt,
    // wäre erfunden. Der Eintrag bleibt Einschätzung und wird gemeldet.
    if (existenzVon(A[id]) === 'nein' && existenzVon(B[id]) === 'nein') {
      zurueck.push(`${id} — Datensatz existiert laut beiden Läufen nicht: nichts übernommen`);
      continue;
    }
    if (e.beschreibung?.text && e.beschreibung.text !== k.n.details.description) {
      k.n.details.description = e.beschreibung.text;
      dateien.get(k.pfad).geaendert = true;
      log.push(`${id} · Beschreibung neu (${e.beschreibung.text.split(/\s+/).length} Wörter)`);
    }
    if (e.beschreibung?.text) {
      for (const f of fv.filter(f => f.id === id && f.stufe === 'automatisch' && f.aktion === 'anhaengen'))
        haengeAn(id, f.beleg.a ?? f.beleg.b);
    }
    for (const d of e.entscheidungen ?? []) {
      if (d.feld.startsWith('quellen:')) {
        if (['a', 'b', 'beide'].includes(d.urteil)) haengeAn(id, vorschlag(id, d.feld) ?? { typ: '?', title: d.feld });
        else zurueck.push(`${id} · ${d.feld} — verworfen (${d.urteil})`);
        continue;
      }
      if (!['startjahr', 'rhythmus', 'format', 'lizenz', 'raeumliche_ebene'].includes(d.feld)) continue;
      const w = d.urteil === 'offen' ? null : codeWert({ status: 'belegt', wert: d.wert }, d.feld);
      if (w) setze(id, d.feld, w);
      else zurueck.push(`${id} · ${d.feld} — kein Wert übernommen (${d.urteil}${d.wert ? '' : ', ohne Wert'})`);
    }
    const entschieden = (e.entscheidungen ?? []).find(d => d.feld === 'lizenz');
    klasseZurLizenz(id, entschieden ? entschieden.urteil !== 'offen' && !!entschieden.wert
      : fv.some(f => f.id === id && f.feld === 'lizenz' && f.stufe === 'automatisch' && f.wert));
  }
}

// ── Ausgabe ──
console.log(`Modus ${modus} · Runde ${runde} · geprüft ${geprueft}\n`);
log.forEach(l => console.log('  ' + l));
console.log(`\n${log.length} Änderungen an ${new Set(log.map(l => l.split(' ')[0])).size} Einträgen`);
if (wartend) console.log(`\n${wartend} Quellen warten auf die neue Beschreibung (review).`);
if (zurueck.length) { console.log(`\nZurückgestellt (${zurueck.length}):`); zurueck.forEach(z => console.log('  ' + z)); }
if (schreiben) {
  for (const [pfad, f] of dateien) if (f.geaendert) writeFileSync(pfad, JSON.stringify(f.daten, null, 2) + (f.endetMitNL ? '\n' : ''));
  console.log('\ngeschrieben.');
} else console.log('\nTrockenlauf — mit --schreiben übernehmen.');
