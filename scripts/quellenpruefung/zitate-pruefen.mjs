#!/usr/bin/env node
// Zitatabgleich: Jedes Belegzitat muss wörtlich auf der genannten Seite stehen.
//
//   node scripts/quellenpruefung/zitate-pruefen.mjs <ergebnis.json> […] [--json bericht.json] [--strict]
//
// Liest beliebig verschachtelte Ergebnisdateien und prüft jedes Objekt, das
// `zitat` und `url` trägt. Befunde mit Status „nicht gefunden“ werden
// übersprungen. Ausgabe je Zitat: ✓ gefunden, ✗ nicht gefunden, ? Seite nicht
// abrufbar. Exit 1, wenn ein Zitat fehlt; mit --strict auch bei „nicht abrufbar“.
//
// Hinter einem Proxy (Node ≥ 22) mit NODE_USE_ENV_PROXY=1 starten.
//
// Jede Normalisierung unten hat in der Quellenprüfung einmal einen falschen
// Fehlschlag erzeugt — keine davon ist Vorsorge:
//   Zeichensatz aus Header oder <meta>    gesetze-im-internet.de, Förderkatalog (ISO-8859-1)
//   HTML-Entities                          GKV-Spitzenverband (&sect;, &ndash;)
//   Vergleich ohne Leerraum                Inline-Tags zerreißen „*.csv“ zu „*. csv“ (thru.de, DWD)
//   Anführungszeichen, Striche, &shy;      typografische Varianten in PDFs
//   PDF über pdftotext, XLSX/ODS über unzip   Qualitätsberichte, Destatis-Tabellen
//   Bruchstrich ⁄ und Trennstrich am Zitatende   Destatis (&frasl;), PDF-Zeilenumbruch („Excel-“)
//   PDF-Tabellenzeilen über pdftotext -layout     EKD-Kirchenmitgliederzahlen („Anhalt 9.361 13.795 23.156“)
//   Bindestrich am Zeilenende in zwei Lesarten    Destatis („Nominal- und Reallohnindex“), HTML-Tabellenzelle „-“ (FDZ)
//   altes .xls (OLE) als Latin-1/UTF-16           ZDH-Statistik (load_doc.php?datei=….xls)
// Abgerufen wird mit ehrlichem User-Agent. Eine nicht abrufbare Seite gilt
// als nicht prüfbar, nie als gefunden.

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const UA = 'datenatlas-linkcheck (+https://datenatlas.de)';
const DIR = mkdtempSync(join(tmpdir(), 'zitate-'));
const PARALLEL = 4;

const ENT = { sect: '§', ndash: '–', mdash: '—', nbsp: ' ', shy: '', euro: '€', lt: '<', gt: '>', amp: '&',
  quot: '"', apos: "'", laquo: '«', raquo: '»', lsquo: '‘', rsquo: '’', sbquo: '‚', bdquo: '„', ldquo: '“',
  rdquo: '”', hellip: '…', middot: '·', para: '¶', deg: '°', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä',
  Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', times: '×',
  copy: '©', reg: '®', bull: '•', thinsp: ' ', ensp: ' ', emsp: ' ', frasl: '/' };

const decodeEntities = s => s
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? m);

// Endtags mit [^>]*: Browser schließen auch bei „</script >“ oder „</script foo>“.
const htmlText = html => decodeEntities(html
  .replace(/<script[\s\S]*?<\/script[^>]*>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style[^>]*>/gi, ' ')
  .replace(/<[^>]+>/g, ' '));

// Für den Vergleich: Varianten vereinheitlichen, dann allen Leerraum entfernen.
// `entwirrt` entfernt Bindestrich + Zeilenumbruch im Seitentext (PDF-Silbentrennung: „Excel-\nDatei“).
// Das muss eine zweite Lesart sein, keine einzige: „Nominal-\nund Reallohnindex“ und die Tabellenzelle
// „-“ vor </td> sind echte Bindestriche, die das Zitat enthält.
const flat = (s, entwirrt = false) => s
  .normalize('NFKC')
  .replace(/[\u2044\u2215]/g, '/')        // Bruchstrich als Schrägstrich (Destatis: „barrierefrei⁄barrierearm“)
  .replace(/-\s*$/, '')                    // Zitat endet in einer Silbentrennung („…als Excel-“)
  .replace(/­/g, '')
  .replace(/-\s*\n\s*/g, entwirrt ? '' : '-')
  .replace(/[„“”"«»‚‘’']/g, '"')
  .replace(/[–—‑]/g, '-')
  .toLowerCase()
  .replace(/\s+/g, '');

const cache = new Map();

async function pageText(url) {
  if (!cache.has(url)) cache.set(url, load(url));
  return cache.get(url);
}

async function load(url, attempt = 1) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(40000) });
    if (!r.ok) return { err: `HTTP ${r.status}` };
    const ct = r.headers.get('content-type') ?? '';
    const buf = Buffer.from(await r.arrayBuffer());
    const file = join(DIR, `${cache.size}-${attempt}`);
    if (buf.subarray(0, 2).toString() === 'PK') {            // XLSX / ODS
      writeFileSync(file, buf);
      let xml = '';
      for (const part of ['xl/sharedStrings.xml', 'content.xml']) {
        try { xml += execFileSync('unzip', ['-p', file, part], { maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString(); } catch {}
      }
      return { t: htmlText(xml.replace(/<\/(t|si|text:p)>/g, ' ')) };
    }
    if (buf.subarray(0, 4).toString('hex') === 'd0cf11e0') {    // altes Excel (OLE): Zeichenketten liegen als Latin-1 oder UTF-16
      return { t: [buf.toString('latin1'), buf.toString('utf16le'), buf.subarray(1).toString('utf16le')].join('\u0001') };
    }
    if (ct.includes('pdf') || buf.subarray(0, 5).toString() === '%PDF-') {
      writeFileSync(file, buf);
      // Tabellenzeilen: pdftotext liest ohne -layout Zelle für Zelle, ein Zitat „Anhalt 9.361 13.795“
      // steht dann auf drei Zeilen weit auseinander. Beide Lesarten durchsuchen; das Trennzeichen
      // (NUL) übersteht flat() und kommt in keinem Zitat vor, ein Treffer kann sie also nicht überbrücken.
      const lies = a => execFileSync('pdftotext', ['-q', ...a, file, '-'], { maxBuffer: 1 << 28 }).toString();
      return { t: lies([]) + '\u0000' + lies(['-layout']) };
    }
    const head = buf.subarray(0, 4096).toString('latin1');
    const cs = (ct.match(/charset=([\w-]+)/i) ?? head.match(/charset=["']?([\w-]+)/i))?.[1] ?? 'utf-8';
    let dec; try { dec = new TextDecoder(cs.toLowerCase()); } catch { dec = new TextDecoder('utf-8'); }
    return { t: htmlText(dec.decode(buf)) };
  } catch (e) {
    if (attempt < 2) return load(url, attempt + 1);            // ein zweiter Versuch, mehr nicht
    return { err: e.name === 'TimeoutError' ? 'Zeitüberschreitung' : e.message };
  }
}

// Alle {zitat, url}-Paare einsammeln, gleich wie tief verschachtelt.
function collect(node, path, out, skip = false) {
  if (Array.isArray(node)) { node.forEach((n, i) => collect(n, `${path}[${i}]`, out, skip)); return; }
  if (!node || typeof node !== 'object') return;
  const status = String(node.status ?? '').replace(' ', '_');
  const skipHere = skip || status === 'nicht_gefunden';
  if (typeof node.zitat === 'string' && typeof node.url === 'string' && node.zitat.trim() && !skipHere) {
    out.push({ path, zitat: node.zitat, url: node.url });
  }
  for (const [k, v] of Object.entries(node)) collect(v, path ? `${path}.${k}` : k, out, skipHere);
}

const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const strict = args.includes('--strict');
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--json');

const items = [];
for (const f of files) {
  const data = JSON.parse(readFileSync(f, 'utf8'));
  for (const [id, entry] of Object.entries(data)) {
    const found = [];
    collect(entry, '', found);
    found.forEach(x => items.push({ file: f, id, ...x }));
  }
}

let next = 0;
async function worker() {
  while (next < items.length) {
    const it = items[next++];
    const r = await pageText(it.url);
    const q = flat(it.zitat);
    it.result = r.t == null ? 'nicht_abrufbar' : [false, true].some(e => flat(r.t, e).includes(q)) ? 'gefunden' : 'fehlt';
    if (r.err) it.fehler = r.err;
  }
}
await Promise.all(Array.from({ length: PARALLEL }, worker));

const sum = { gefunden: 0, fehlt: 0, nicht_abrufbar: 0 };
const byId = {};
for (const it of items) {
  sum[it.result]++;
  (byId[it.id] ??= { gefunden: 0, fehlt: 0, nicht_abrufbar: 0 })[it.result]++;
  if (it.result !== 'gefunden') {
    console.log(`${it.result === 'fehlt' ? '✗' : '?'} ${it.id} · ${it.path}${it.fehler ? ` [${it.fehler}]` : ''}`);
    console.log(`    „${it.zitat.slice(0, 140)}“\n    ${it.url}`);
  }
}
console.log(`\nZitate: ${items.length} · gefunden ${sum.gefunden} · fehlt ${sum.fehlt} · nicht abrufbar ${sum.nicht_abrufbar}`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ summe: sum, je_eintrag: byId, zitate: items }, null, 2));
process.exit(sum.fehlt || (strict && sum.nicht_abrufbar) ? 1 : 0);
