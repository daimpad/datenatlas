// Übernimmt überarbeitete Öffnungsbegründungen aus einer JSON-Datei in die
// Sektordateien — mit maschineller Regelprüfung vor dem Schreiben.
//
// Gedacht für die Stapelarbeit an den Kennzahlen des Qualitätsberichts. Das
// Browser-Werkzeug (begruendungen.html) bleibt der Weg für einzelne Einträge
// und für alles, was jemand von Hand nachsehen will; hier geht es um ganze
// Stapel, die zuvor gegen src/begruendungs-regeln.js erzeugt wurden.
//
// Eingabeformat — dasselbe, das das Regelwerk als Ausgabe vorschreibt:
//   [{"id":"…","explanation":"…","status":"ueberarbeitet"}]
//
// Geprüft wird VOR dem ersten Schreibzugriff, und zwar alles oder nichts:
//
//   1. Die id existiert und ist ein L4-Knoten.
//   2. Regel 3 — keine Aussage über die Veröffentlichungspraxis Dritter.
//   3. Regel 5 — 20 bis 45 Wörter.
//   4. Regel 2 — jede Rechtsfundstelle im neuen Text muss bereits in der
//      Beschreibung oder im Namen des Eintrags vorkommen. Das ist die
//      eigentliche Absicherung: Ein Modell (oder ein Mensch in Eile) kann
//      einen plausibel klingenden Paragrafen erfinden, und genau davor warnt
//      CLAUDE.md. Hier scheitert der Lauf, statt die Erfindung zu übernehmen.
//   5. Status — "unzureichend" und "widerspruechlich" bedeuten laut Regelwerk
//      „Alttext behalten"; solche Einträge werden übersprungen und gemeldet,
//      nicht geschrieben.
//
// Run: node scripts/apply-begruendungen.mjs <datei.json> [--dry]
import fs from 'fs';
import { normalizeStatus, STATUS, TARGET_WORDS } from '../src/begruendungs-regeln.js';

const DIR = 'public/data';
const file = process.argv[2];
const dry = process.argv.includes('--dry');
if (!file) { console.error('Aufruf: node scripts/apply-begruendungen.mjs <datei.json> [--dry]'); process.exit(2); }

// Muss zum Muster in scripts/validate-data.js, src/begruendungen.js und
// scripts/build-begruendungs-prompt.mjs passen — alle vier zusammen ändern.
const PRACTICE_RE = /(veröffentlich(en|t) (bislang |bisher |in der regel |derzeit )?keine|(bereits|schon) (teilweise |weitgehend )?(öffentlich|frei) (zugänglich|verfügbar|abrufbar)|werden (bereits|regelmäßig|routinemäßig|standardmäßig) (veröffentlicht|publiziert|bereitgestellt)|teilweise (öffentlich|frei) (zugänglich|verfügbar)|(stellen|stellt) (die )?(daten )?nicht (öffentlich )?(bereit|zur verfügung)|geben (die daten )?nicht (heraus|frei))/i;

// Fundstellen und benannte Rechtsakte. Bewusst großzügig: lieber ein Treffer
// zu viel, der sich in der Beschreibung wiederfindet, als eine erfundene
// Fundstelle, die durchrutscht.
const CITE_RE = /(§+\s*\d+[a-z]?|Art\.\s*\d+|Artikel\s+\d+|\b[A-ZÄÖÜ][A-ZÄÖÜ]{2,}(?:G|VO|GB|StV)\b|\bDSGVO\b|\bGrundgesetz\b|\bRichtlinie\s+\d)/g;

const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;

const input = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(input)) { console.error('Erwartet wird ein JSON-Array.'); process.exit(2); }

// ── Bestand einlesen ────────────────────────────────────────────────────────
const main = JSON.parse(fs.readFileSync(`${DIR}/main.json`, 'utf8'));
const files = new Map();     // subFile → { data, hadNL }
const nodes = new Map();     // id → node
for (const s of main) {
  if (!s.subFile) continue;
  const p = `${DIR}/${s.subFile}`;
  const raw = fs.readFileSync(p, 'utf8');
  const data = JSON.parse(raw);
  files.set(p, { data, hadNL: raw.endsWith('\n'), dirty: false });
  (function walk(n) {
    if (n.level === 4 && n.id) nodes.set(n.id, { node: n, path: p });
    (n.children ?? []).forEach(walk);
  })({ children: data.children ?? [] });
}

// ── Prüfen ──────────────────────────────────────────────────────────────────
const errors = [];
const held = [];
const todo = [];
const seenIds = new Set();

for (const item of input) {
  const id = item?.id;
  const hit = nodes.get(id);
  if (!hit) { errors.push(`${id}: keine L4-id mit diesem Namen`); continue; }
  if (seenIds.has(id)) { errors.push(`${id}: doppelt in der Eingabe`); continue; }
  seenIds.add(id);

  const st = normalizeStatus(item.status);
  if (item.status && !st) { errors.push(`${id}: unbekannter status „${item.status}"`); continue; }
  if (st && STATUS[st].keep) { held.push(`${id} (${STATUS[st].label})`); continue; }

  const text = String(item.explanation ?? '').trim();
  if (!text) { errors.push(`${id}: leere Begründung`); continue; }

  if (PRACTICE_RE.test(text)) errors.push(`${id}: Regel 3 — Aussage über fremde Veröffentlichungspraxis`);

  const w = words(text);
  if (w < TARGET_WORDS.min || w > TARGET_WORDS.max) {
    errors.push(`${id}: Regel 5 — ${w} Wörter (Ziel ${TARGET_WORDS.min}–${TARGET_WORDS.max})`);
  }

  const d = hit.node.details ?? {};
  const haystack = `${d.description ?? ''} ${hit.node.name ?? ''}`;
  for (const cite of new Set(text.match(CITE_RE) ?? [])) {
    if (!haystack.includes(cite)) {
      errors.push(`${id}: Regel 2 — „${cite}" steht nicht in Beschreibung oder Name`);
    }
  }

  todo.push({ id, text, hit });
}

if (errors.length) {
  console.error(`${errors.length} Probleme — es wurde nichts geschrieben:\n` + errors.map(e => '  ' + e).join('\n'));
  process.exit(1);
}

// ── Schreiben ───────────────────────────────────────────────────────────────
let changed = 0, same = 0;
for (const { text, hit } of todo) {
  const o = hit.node.details?.openness;
  if (!o) continue;
  if (o.explanation === text) { same++; continue; }
  o.explanation = text;
  files.get(hit.path).dirty = true;
  changed++;
}

if (!dry) {
  for (const [p, f] of files) {
    if (f.dirty) fs.writeFileSync(p, JSON.stringify(f.data, null, 2) + (f.hadNL ? '\n' : ''));
  }
}

console.log(`${changed} übernommen${same ? `, ${same} unverändert` : ''}${dry ? ' (Probelauf, nichts geschrieben)' : ''}`);
if (held.length) console.log(`${held.length} zurückgestellt: ${held.join(', ')}`);
