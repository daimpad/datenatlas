/**
 * check-links.mjs — prüft alle Links in details.examples und details.sources.
 *
 *   node scripts/check-links.mjs                 Bericht auf der Konsole
 *   node scripts/check-links.mjs --json out.json zusätzlich als JSON
 *   node scripts/check-links.mjs --strict        Exit 1 bei toten Links
 *
 * Hinter einem Proxy: NODE_USE_ENV_PROXY=1 setzen (Node ≥ 22).
 *
 * Bewusst nicht Teil der PR-Prüfung: fremde Server antworten mal langsam, mal
 * mit 429, mal sperren sie Rechenzentrums-Adressen aus. Ein PR soll nicht rot
 * werden, weil ein Landesportal gerade Wartung hat. Die Prüfung läuft deshalb
 * wöchentlich (.github/workflows/check-links.yml) und meldet, was sie findet.
 *
 * Ein Statuscode 200 allein beweist nichts: mcloud.de leitete jede Adresse
 * auf seine Abschiedsmeldung um und antwortete dort mit 200. Deshalb gilt eine
 * Weiterleitung auf einen anderen Host oder auf die Startseite als Befund.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RETIRED_HOSTS } from './link-regeln.mjs';

const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/data');
const args = process.argv.slice(2);
const JSON_OUT = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const STRICT = args.includes('--strict');
const TIMEOUT = 15000;
const PARALLEL = 10;        // insgesamt
const PER_HOST = 2;         // je Server — Landesportale sind keine CDN

// ── Links einsammeln ───────────────────────────────────────────────────────────
const links = [];
for (const f of fs.readdirSync(DATA).filter(f => /^sector_.+\.json$/.test(f))) {
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    if (n.level === 4 && n.details) {
      for (const field of ['examples', 'sources'])
        for (const e of n.details[field] ?? []) links.push({ file: f, id: n.id, field, url: e.url, title: e.title });
    }
    Object.values(n).forEach(walk);
  };
  walk(JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')));
}

// ── Prüfen ─────────────────────────────────────────────────────────────────────
function classify(orig, res, err) {
  let u; try { u = new URL(orig); } catch { return ['ungueltig', 'keine gültige URL']; }
  if (RETIRED_HOSTS[u.hostname]) return ['tot', RETIRED_HOSTS[u.hostname]];
  if (err) return ['nicht_pruefbar', err];
  const s = res.status;
  if (s === 404 || s === 410) return ['tot', `HTTP ${s}`];
  if (s === 401 || s === 403 || s === 429) return ['nicht_pruefbar', `HTTP ${s} — Server sperrt automatische Abrufe`];
  if (s >= 500) return ['nicht_pruefbar', `HTTP ${s} — Serverfehler, später erneut prüfen`];
  // 400 ist kein Beleg für einen fehlenden Datensatz: gdk.gdi-de.org und
  // registry.gdi-de.org antworten Rechenzentrums-Adressen mit einer
  // Firewall-Seite („Request Rejected") und Status 400 — 167 Links im Nov. 2026.
  if (s === 400) return ['nicht_pruefbar', 'HTTP 400 — vermutlich Firewall, nicht als tot werten'];
  if (s >= 400) return ['fehler', `HTTP ${s}`];
  const fin = new URL(res.url);
  if (fin.hostname.replace(/^www\./, '') !== u.hostname.replace(/^www\./, ''))
    return ['umgeleitet', `endet auf ${fin.hostname}${fin.pathname}`];
  if ((fin.pathname === '/' || fin.pathname === '') && u.pathname.length > 1)
    return ['umgeleitet', 'endet auf der Startseite'];
  return ['ok', `HTTP ${s}`];
}

async function check(l) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    const res = await fetch(l.url, {
      redirect: 'follow', signal: ctl.signal,
      headers: { 'user-agent': 'datenatlas-linkcheck (+https://datenatlas.de)' },
    });
    res.body?.cancel?.().catch(() => {});
    [l.status, l.detail] = classify(l.url, res, null);
  } catch (e) {
    const why = e.name === 'AbortError' ? 'Zeitüberschreitung' : (e.cause?.code || e.message);
    [l.status, l.detail] = classify(l.url, null, why);
  } finally { clearTimeout(t); }
}

const hostOf = l => { try { return new URL(l.url).hostname; } catch { return '?'; } };
const busy = new Map();
let next = 0, active = 0;
await new Promise(done => {
  const pump = () => {
    if (next >= links.length && active === 0) return done();
    for (let i = next; i < links.length && active < PARALLEL; i++) {
      const l = links[i];
      if (l.started) continue;
      const h = hostOf(l);
      if ((busy.get(h) ?? 0) >= PER_HOST) continue;
      l.started = true; active++; busy.set(h, (busy.get(h) ?? 0) + 1);
      check(l).finally(() => { active--; busy.set(h, busy.get(h) - 1); pump(); });
    }
    while (next < links.length && links[next].started) next++;
  };
  pump();
});

// ── Bericht ────────────────────────────────────────────────────────────────────
const LABEL = {
  ok: 'erreichbar', tot: 'tot (404/410, abgeschaltet)', fehler: 'anderer Fehler (4xx)',
  umgeleitet: 'umgeleitet (anderer Host / Startseite)', nicht_pruefbar: 'nicht prüfbar (gesperrt, Zeitüberschreitung, 5xx)',
  ungueltig: 'ungültige URL',
};
const by = {};
for (const l of links) (by[l.status] ??= []).push(l);
console.log(`${links.length} Links geprüft\n`);
for (const k of Object.keys(LABEL)) if (by[k]) console.log(`  ${String(by[k].length).padStart(4)}  ${LABEL[k]}`);
for (const k of ['tot', 'fehler', 'umgeleitet', 'ungueltig']) {
  if (!by[k]) continue;
  const hosts = {};
  for (const l of by[k]) hosts[hostOf(l)] = (hosts[hostOf(l)] ?? 0) + 1;
  console.log(`\n${LABEL[k]} — nach Server:`);
  for (const [h, n] of Object.entries(hosts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${h}`);
}
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify(links.map(({ started, ...l }) => l), null, 2));
if (STRICT && (by.tot?.length || by.ungueltig?.length)) process.exit(1);
