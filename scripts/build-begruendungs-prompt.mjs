// Erzeugt Prompts zum redaktionellen Überarbeiten der Öffnungsbegründungen.
//
// Dieselbe Aufgabe wie in begruendungen.html, aber für die Stapelarbeit: Die
// 942 kurzen Begründungen über den Browser abzuarbeiten ist zäh, hier fallen
// fertige Prompt-Dateien an, die sich nacheinander abarbeiten lassen.
//
// Die Regeln im Prompt sind bewusst restriktiv. Die Begründungen sollen sich
// gegenüber Datenschutzbeauftragten und Gremien zitieren lassen — ein
// erfundener Paragraf richtet dort mehr Schaden an, als ein knapper Satz je
// nützen könnte. Deshalb: keine Fundstellen ohne Beleg, und im Zweifel den
// bisherigen Text behalten.
//
// Aufrufe:
//   node scripts/build-begruendungs-prompt.mjs                    # alle kurzen
//   node scripts/build-begruendungs-prompt.mjs --op OP_03         # nur eine Klasse
//   node scripts/build-begruendungs-prompt.mjs --sektor staat     # nur ein Sektor
//   node scripts/build-begruendungs-prompt.mjs --batch 40 --out ./prompts
//
// Die Antwort des Modells wird in begruendungen.html eingefügt („Antwort
// einfügen") — dort landet sie in den Feldern zur Prüfung, nie direkt in den
// Daten, und Texte mit Rechtsbezug werden markiert.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DATA_DIR = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../public/data');
const MIN_WORDS = 5;   // gleiche Schwelle wie Validator und Browser-Werkzeug

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const onlyOp     = arg('op');
const onlySector = arg('sektor');
const batchSize  = Number(arg('batch', 50));
const outDir     = arg('out', path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../prompts'));

const words = (s) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;
const read  = (f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));

const vocab = (() => { try { return read('vocabulary.json'); } catch { return {}; } })();
const label = (key, code) => (vocab[key] ?? []).find(x => x.code === code)?.label ?? code ?? '';

// ── Einträge einsammeln ─────────────────────────────────────────────────────
const main = read('main.json');
const items = [];

for (const sector of main) {
  if (!sector.subFile) continue;
  if (onlySector && sector.id !== onlySector) continue;
  let sd;
  try { sd = read(sector.subFile); } catch { continue; }

  for (const org of sd.children ?? []) {
    for (const act of org.children ?? []) {
      for (const dt of act.children ?? []) {
        if (dt.level !== 4) continue;
        const d = dt.details ?? {};
        const expl = (d.openness?.explanation ?? '').trim();
        if (words(expl) >= MIN_WORDS) continue;
        if (onlyOp && d.openness?.class !== onlyOp) continue;

        items.push({
          id: dt.id,
          name: dt.name,
          pfad: `${sector.name} › ${org.name} › ${act.name}`,
          beschreibung: d.description ?? '',
          oeffnungsklasse: `${d.openness?.class ?? '?'} — ${d.openness?.label ?? ''}`,
          objekttyp: label('object', d.object?.code),
          granularitaet: label('granularity', d.granularity?.code),
          lizenz: label('license', d.license?.code),
          bisherige_begruendung: expl,
        });
      }
    }
  }
}

if (!items.length) {
  console.log('Keine passenden Einträge gefunden.');
  process.exit(0);
}

// ── Prompt ──────────────────────────────────────────────────────────────────
const RULES = `Du überarbeitest Öffnungsbegründungen für den Datenatlas (datenatlas.de).

Der Datenatlas verzeichnet, welche Datentypen in deutschen Organisationen
entstehen, und bewertet je Datentyp, wie leicht er sich als Open Data
veröffentlichen ließe. Die Begründung erklärt, WARUM die Einstufung so lautet.

Diese Begründungen sind kein Beiwerk: Nutzerinnen und Nutzer sollen sie
gegenüber Datenschutzbeauftragten, Leitungsebenen und Gremien anführen können.
Ein erfundener Paragraf richtet dort mehr Schaden an, als ein zusätzlicher Satz
je nützen könnte.

REGELN — bitte strikt einhalten:

1. Stütze dich AUSSCHLIESSLICH auf die je Eintrag gelieferten Angaben
   (Beschreibung, Öffnungsklasse, Objekttyp, Granularität, Lizenz).
2. Erfinde KEINE Paragrafen, Gesetzesfundstellen, Richtlinien, Aktenzeichen
   oder Fristen. Nenne eine Rechtsgrundlage nur, wenn sie sich zwingend aus den
   Angaben ergibt — sonst gar nicht.
3. Behaupte NICHT, dass bestimmte Behörden, Städte, Unternehmen oder
   Organisationen etwas bereits veröffentlichen. Das ist ohne Recherche nicht
   belegbar.
4. Benenne stattdessen den sachlichen Mechanismus:
   • Liegt Personenbezug vor, oder ist er aufgelöst?
   • Einzelfall oder aggregiert?
   • Besteht eine Veröffentlichungspflicht, oder ist es Ermessen?
   • Bei OP_02: WELCHER Aufbereitungsschritt wäre nötig (Anonymisierung,
     Aggregation, Schwärzung, Stichprobenreduktion)?
   • Bei OP_03: WAS genau verhindert die Veröffentlichung — und welche
     abgeleitete Form (z. B. Aggregatstatistik) wäre stattdessen denkbar?
5. Länge: 15 bis 40 Wörter, ein bis zwei Sätze, sachlicher Ton, deutsche
   Sprache, keine Werbesprache, keine Füllfloskeln.
6. Behalte den fachlichen Kern der bisherigen Begründung bei — sie ist meist
   knapp, aber zutreffend. Du präzisierst sie, du ersetzt sie nicht durch eine
   andere Aussage.
7. Wenn die gelieferten Angaben für eine tragfähige Begründung NICHT
   ausreichen, gib die bisherige Begründung unverändert zurück. Das ist ein
   gültiges Ergebnis, kein Fehler — Spekulation ist schlechter als Kürze.

AUSGABEFORMAT — ausschließlich dieses JSON-Array, ohne Vor- oder Nachtext:
[{"id":"<id>","explanation":"<neue Begründung>"}]`;

const batches = [];
for (let i = 0; i < items.length; i += batchSize) batches.push(items.slice(i, i + batchSize));

fs.mkdirSync(outDir, { recursive: true });
const tag = [onlyOp, onlySector].filter(Boolean).join('-') || 'alle';

batches.forEach((batch, i) => {
  const n = String(i + 1).padStart(2, '0');
  const head = `${RULES}\n\nSTAPEL ${i + 1} VON ${batches.length} — ${batch.length} EINTRÄGE:\n`;
  const file = path.join(outDir, `begruendungen-${tag}-${n}.txt`);
  fs.writeFileSync(file, head + JSON.stringify(batch, null, 1) + '\n');
});

const chars = batches.reduce((a, b) => a + JSON.stringify(b).length, 0);
console.log(`${items.length} Einträge (${tag}) → ${batches.length} Prompt-Dateien à max. ${batchSize}`);
console.log(`Verzeichnis: ${outDir}`);
console.log(`Umfang der Nutzdaten: ~${(chars / 1024).toFixed(0)} KB`);
console.log(`\nAntworten in begruendungen.html unter „Antwort einfügen" übernehmen —`);
console.log(`dort landen sie zur Prüfung in den Feldern, nicht direkt in den Daten.`);
